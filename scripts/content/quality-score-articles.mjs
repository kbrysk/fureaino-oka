/**
 * quality-score-articles.mjs — microCMS blogs 全記事の品質スコアリング
 *
 * 背景: 週末に100記事を一気に投入したが、GSC（過去90日）で
 *   サイト全体CTR=0.39%、articles配下 imp=11 / clk=0 と低迷。
 *   「即noindex」判断の前に、まず各記事の品質を機械判定し、
 *   ・統合（合体）対象
 *   ・抜本リライト対象
 *   ・本文拡充＋内部リンク強化対象
 *   を分類するための一次データを作る。
 *
 * 使い方:
 *   node scripts/content/quality-score-articles.mjs [--limit 100] [--out logs/content-quality]
 *
 * 必要な環境変数（.env.local 推奨）:
 *   MICROCMS_SERVICE_DOMAIN
 *   MICROCMS_API_KEY              // 読み取り用（GETキー）
 *   MICROCMS_WRITE_API_KEY        // 読み取りキー未設定時のフォールバック
 *
 * 出力:
 *   logs/content-quality/quality-report-YYYY-MM-DD.csv
 *   logs/content-quality/quality-report-YYYY-MM-DD.json
 *
 * スコアリング（合計100点満点）:
 *   - 文字数       20点  (>=2000:20, 1500-1999:15, 1000-1499:10, <1000:0)
 *   - H2見出し数   15点  (>=5:15, 3-4:10, 1-2:5, 0:0)
 *   - 内部リンク   15点  (>=5:15, 3-4:10, 1-2:5, 0:0)
 *   - 外部リンク   10点  (>=2:10, 1:5, 0:0)
 *   - 画像数       10点  (>=2:10, 1:5, 0:0)
 *   - 監修者       10点  (あり:10, なし:0)
 *   - タグ数       10点  (>=3:10, 1-2:5, 0:0)
 *   - description  10点  (あり:10, なし:0)
 *
 * 分類:
 *   60点以上 = 健全 / 40-59点 = 要改善 / 40点未満 = 重大な懸念
 *
 * 注: スクリプトはあくまで「機械可読シグナル」の集計。
 *     最終的なリライト/統合/noindex判断は人間が行うこと。
 */
import fs from "fs";
import path from "path";

// ---------- 環境変数 ----------
function loadEnvLocal() {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

// ---------- CLI 引数 ----------
function parseArgs(argv) {
  const a = argv.slice(2);
  const out = { limit: null, out: "logs/content-quality" };
  for (let i = 0; i < a.length; i++) {
    if (a[i] === "--limit") out.limit = Number(a[++i]);
    else if (a[i] === "--out") out.out = a[++i];
  }
  return out;
}

// ---------- HTMLパース（依存ゼロ） ----------
function stripTags(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function countMatches(html, regex) {
  const m = String(html || "").match(regex);
  return m ? m.length : 0;
}

/**
 * 内部リンク = 相対パス(/...) または fureaino-oka.com を含む http(s)
 * 外部リンク = 上記以外の http(s) リンク
 */
function classifyLinks(html) {
  const re = /<a\s[^>]*href=["']([^"']+)["'][^>]*>/gi;
  let internal = 0, external = 0;
  let m;
  while ((m = re.exec(String(html || ""))) !== null) {
    const href = m[1];
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    if (/^https?:\/\//i.test(href)) {
      if (/fureaino-oka\.com/i.test(href)) internal++;
      else external++;
    } else if (href.startsWith("/")) {
      internal++;
    }
  }
  return { internal, external };
}

// ---------- スコアリング ----------
function scoreLen(len) {
  if (len >= 2000) return 20;
  if (len >= 1500) return 15;
  if (len >= 1000) return 10;
  return 0;
}
function scoreH2(n) {
  if (n >= 5) return 15;
  if (n >= 3) return 10;
  if (n >= 1) return 5;
  return 0;
}
function scoreInternal(n) {
  if (n >= 5) return 15;
  if (n >= 3) return 10;
  if (n >= 1) return 5;
  return 0;
}
function scoreExternal(n) {
  if (n >= 2) return 10;
  if (n >= 1) return 5;
  return 0;
}
function scoreImg(n) {
  if (n >= 2) return 10;
  if (n >= 1) return 5;
  return 0;
}
function scoreSupervisor(has) { return has ? 10 : 0; }
function scoreTags(n) {
  if (n >= 3) return 10;
  if (n >= 1) return 5;
  return 0;
}
function scoreDesc(has) { return has ? 10 : 0; }

function suggestImprovements(s) {
  const tips = [];
  if (s.len < 2000) tips.push(`本文を${2000 - s.len}字以上追加（現状${s.len}字）`);
  if (s.h2 < 3) tips.push(`H2見出しを${Math.max(3 - s.h2, 1)}個以上追加し論点を分割`);
  if (s.internalLinks < 3) tips.push(`内部リンクを${3 - s.internalLinks}本追加（関連記事/チェックリスト/はじめかた）`);
  if (s.externalLinks < 1) tips.push("公的出典（厚労省・総務省・国民生活センター等）の外部リンクを最低1本追加");
  if (s.images < 1) tips.push("オリジナル画像/図解を1点以上追加（HCS対策）");
  if (!s.hasSupervisor) tips.push("監修者を付与（生前整理系=村上様 / 専門家領域は該当士業）");
  if (s.tags < 1) tips.push("タグを最低1つ付与（内部回遊と検索意図整合のため）");
  if (!s.hasDescription) tips.push("description（150字前後のメタ説明）を設定しCTRを底上げ");
  return tips;
}

function classify(total) {
  if (total < 40) return "重大な懸念";
  if (total < 60) return "要改善";
  return "健全";
}

// ---------- microCMS取得 ----------
async function fetchAllBlogs({ serviceDomain, apiKey, limit }) {
  const all = [];
  let offset = 0;
  const pageLimit = 100;
  // 必要なフィールドを絞ってAPI負荷とペイロードを抑える
  const fields = [
    "id", "title", "description", "content", "supervisor",
    "category", "tags", "publishedAt", "revisedAt", "createdAt", "updatedAt",
  ].join(",");
  while (true) {
    const url = `https://${serviceDomain}.microcms.io/api/v1/blogs?limit=${pageLimit}&offset=${offset}&fields=${fields}`;
    const res = await fetch(url, { headers: { "X-MICROCMS-API-KEY": apiKey } });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`microCMS GET 失敗: ${res.status} ${res.statusText} ${body.slice(0, 300)}`);
    }
    const json = await res.json();
    const contents = Array.isArray(json.contents) ? json.contents : [];
    all.push(...contents);
    const total = json.totalCount ?? all.length;
    offset += contents.length;
    if (contents.length === 0 || offset >= total) break;
    if (limit && all.length >= limit) break;
  }
  return limit ? all.slice(0, limit) : all;
}

// ---------- CSVエスケープ ----------
function csvEscape(v) {
  if (v === null || v === undefined) return "";
  const s = String(v).replace(/\r?\n/g, " ");
  if (/[",]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

// ---------- メイン ----------
async function main() {
  loadEnvLocal();
  const args = parseArgs(process.argv);

  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = process.env.MICROCMS_API_KEY || process.env.MICROCMS_WRITE_API_KEY;
  if (!serviceDomain || !apiKey) {
    console.error("\n【未設定】MICROCMS_SERVICE_DOMAIN と MICROCMS_API_KEY（または MICROCMS_WRITE_API_KEY）が必要です。");
    console.error(".env.local に設定してから再実行してください。\n");
    process.exit(1);
  }

  console.log("microCMS blogs を取得中...");
  const articles = await fetchAllBlogs({ serviceDomain, apiKey, limit: args.limit });
  console.log(`取得件数: ${articles.length}`);

  const rows = articles.map((a) => {
    const html = a.content || "";
    const text = stripTags(html);
    const len = [...text].length;
    const h2 = countMatches(html, /<h2[\s>]/gi);
    const { internal: internalLinks, external: externalLinks } = classifyLinks(html);
    const images = countMatches(html, /<img[\s>]/gi);
    const hasSupervisor = Boolean(
      a.supervisor && (typeof a.supervisor === "string" ? a.supervisor !== "none" : true)
    );
    const tagCount = Array.isArray(a.tags) ? a.tags.length : 0;
    const hasDescription = Boolean(a.description && String(a.description).trim().length > 0);

    const scores = {
      len: scoreLen(len),
      h2: scoreH2(h2),
      internal: scoreInternal(internalLinks),
      external: scoreExternal(externalLinks),
      image: scoreImg(images),
      supervisor: scoreSupervisor(hasSupervisor),
      tags: scoreTags(tagCount),
      desc: scoreDesc(hasDescription),
    };
    const total =
      scores.len + scores.h2 + scores.internal + scores.external +
      scores.image + scores.supervisor + scores.tags + scores.desc;

    const signals = { len, h2, internalLinks, externalLinks, images, hasSupervisor, tags: tagCount, hasDescription };
    const tips = suggestImprovements(signals);

    return {
      contentId: a.id,
      title: a.title || "",
      total,
      band: classify(total),
      // 生シグナル（CSV/JSONで参照しやすいようトップレベル）
      len, h2, internalLinks, externalLinks, images, hasSupervisor,
      tags: tagCount, hasDescription,
      // 詳細スコアはネストに退避（命名衝突回避）
      scores,
      publishedAt: a.publishedAt || a.createdAt || "",
      revisedAt: a.revisedAt || a.updatedAt || "",
      suggestions: tips.join(" / "),
    };
  });

  // 集計
  rows.sort((a, b) => a.total - b.total); // 低い順に並べる（要改善が上に来る）
  const summary = {
    total: rows.length,
    avgScore: rows.length ? Math.round(rows.reduce((s, r) => s + r.total, 0) / rows.length) : 0,
    critical: rows.filter((r) => r.band === "重大な懸念").length,
    needsWork: rows.filter((r) => r.band === "要改善").length,
    healthy: rows.filter((r) => r.band === "健全").length,
    noSupervisor: rows.filter((r) => !r.hasSupervisor).length,
    noDescription: rows.filter((r) => !r.hasDescription).length,
    under1000chars: rows.filter((r) => r.len < 1000).length,
    zeroInternal: rows.filter((r) => r.internalLinks === 0).length,
    zeroExternal: rows.filter((r) => r.externalLinks === 0).length,
  };

  // 出力ディレクトリ
  const outDir = path.join(process.cwd(), args.out);
  fs.mkdirSync(outDir, { recursive: true });
  const date = new Date().toISOString().slice(0, 10);
  const csvPath = path.join(outDir, `quality-report-${date}.csv`);
  const jsonPath = path.join(outDir, `quality-report-${date}.json`);

  // ---- CSV出力 ----
  // rows の中で「スコア配点」と「生のシグナル」がプロパティ名衝突しているため、
  // CSVではプロパティを明示マッピングして衝突を解消する。
  const header = [
    "contentId","title","total","band",
    "score_len","score_h2","score_internal","score_external","score_image","score_supervisor","score_tags","score_desc",
    "raw_len","raw_h2","raw_internalLinks","raw_externalLinks","raw_images","raw_hasSupervisor","raw_tags","raw_hasDescription",
    "publishedAt","revisedAt","suggestions",
  ];
  const lines = [header.join(",")];
  for (const r of rows) {
    // 注: r.len / r.h2 / r.tags はスコア（配点）にも raw シグナルにも同じ名前があるが、
    // 上で scores と signals をスプレッドした際、後勝ちで signals 側が r に残っている。
    // そこで明示的にスコア辞書を再計算してCSVに書き出す。
    const scoreCells = {
      len: scoreLen(r.len),
      h2: scoreH2(r.h2),
      internal: scoreInternal(r.internalLinks),
      external: scoreExternal(r.externalLinks),
      image: scoreImg(r.images),
      supervisor: scoreSupervisor(r.hasSupervisor),
      tags: scoreTags(r.tags),
      desc: scoreDesc(r.hasDescription),
    };
    lines.push([
      csvEscape(r.contentId),
      csvEscape(r.title),
      csvEscape(r.total),
      csvEscape(r.band),
      csvEscape(scoreCells.len),
      csvEscape(scoreCells.h2),
      csvEscape(scoreCells.internal),
      csvEscape(scoreCells.external),
      csvEscape(scoreCells.image),
      csvEscape(scoreCells.supervisor),
      csvEscape(scoreCells.tags),
      csvEscape(scoreCells.desc),
      csvEscape(r.len),
      csvEscape(r.h2),
      csvEscape(r.internalLinks),
      csvEscape(r.externalLinks),
      csvEscape(r.images),
      csvEscape(r.hasSupervisor),
      csvEscape(r.tags),
      csvEscape(r.hasDescription),
      csvEscape(r.publishedAt),
      csvEscape(r.revisedAt),
      csvEscape(r.suggestions),
    ].join(","));
  }
  fs.writeFileSync(csvPath, lines.join("\n") + "\n", "utf8");
  fs.writeFileSync(jsonPath, JSON.stringify({ generatedAt: new Date().toISOString(), summary, rows }, null, 2), "utf8");

  // ターミナル出力
  console.log("\n==== 品質スコアリング サマリ ====");
  console.log(`総記事数        : ${summary.total}`);
  console.log(`平均スコア      : ${summary.avgScore}/100`);
  console.log(`重大な懸念(<40) : ${summary.critical}`);
  console.log(`要改善(40-59)   : ${summary.needsWork}`);
  console.log(`健全(>=60)      : ${summary.healthy}`);
  console.log(`監修なし        : ${summary.noSupervisor}`);
  console.log(`description無し : ${summary.noDescription}`);
  console.log(`1000字未満      : ${summary.under1000chars}`);
  console.log(`内部リンク0本   : ${summary.zeroInternal}`);
  console.log(`外部出典0本     : ${summary.zeroExternal}`);
  console.log("");
  console.log("低スコア ワースト10:");
  for (const r of rows.slice(0, 10)) {
    console.log(`  [${String(r.total).padStart(3)}/100] ${r.band}  ${r.contentId}  ${r.title.slice(0, 40)}`);
  }
  console.log("");
  console.log(`CSV : ${csvPath}`);
  console.log(`JSON: ${jsonPath}`);
  console.log("\n次のアクション:");
  console.log("  1. 重大な懸念(<40) は『統合 or 抜本リライト』を検討");
  console.log("  2. 要改善(40-59) は『本文拡充＋内部リンク強化』");
  console.log("  3. GSC で同contentIdの imp/clk と突き合わせ、最終判断を人間が下す");
}

main().catch((err) => {
  console.error("予期しないエラー:", err);
  process.exit(1);
});
