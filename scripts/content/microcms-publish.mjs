/**
 * microcms-publish.mjs — 検閲済み記事を microCMS の blogs に投入する（既定=下書き）
 *
 * 設計書 docs/SEO_CONTENT_AUTOMATION_ARCHITECTURE.md §5.3 / §4 Step4。
 * 完全自動公開はしない方針: 既定は下書き(isDraft)。--live 指定時のみ公開。
 *
 * 使い方:
 *   node scripts/content/microcms-publish.mjs <kw_id> [--live]
 *
 * 前提:
 *   - content/pipeline/<kw_id>/draft.html, meta.json, qa-report.json が存在
 *   - qa-report.json が FAIL でない（FAIL なら投入を拒否）
 *   - .env.local に MICROCMS_SERVICE_DOMAIN と、書き込み権限付き MICROCMS_WRITE_API_KEY
 *     （読み取りは MICROCMS_API_KEY を使用。無ければ WRITE キーで代用）
 *
 * 注意: microCMS のカテゴリ/タグは「コンテンツ参照」。コード側 slug を
 *   getCategories()/getTags() の contentId に実マッピングしてから投入する。
 *
 * ※ 本スクリプトは書き込みキー設定後に1度、手動で動作検証してください（未投入の状態でコミットされています）。
 */
import fs from "fs";
import path from "path";

// .env.local の簡易読込（依存を増やさない）
function loadEnvLocal() {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

async function main() {
  loadEnvLocal();
  const args = process.argv.slice(2);
  const live = args.includes("--live");
  const kwId = args.find((a) => !a.startsWith("--"));
  if (!kwId) {
    console.error("使い方: node scripts/content/microcms-publish.mjs <kw_id> [--live]");
    process.exit(2);
  }

  const dir = path.join(process.cwd(), "content", "pipeline", kwId);
  const draftPath = path.join(dir, "draft.html");
  const metaPath = path.join(dir, "meta.json");
  const qaPath = path.join(dir, "qa-report.json");

  for (const [label, p] of [["draft.html", draftPath], ["meta.json", metaPath]]) {
    if (!fs.existsSync(p)) { console.error(`【エラー】${label} が見つかりません: ${p}`); process.exit(2); }
  }

  // QAゲート: FAIL なら投入しない
  if (fs.existsSync(qaPath)) {
    try {
      const qa = JSON.parse(fs.readFileSync(qaPath, "utf8"));
      if (qa.summary && qa.summary.fail > 0) {
        console.error(`【中止】QAレポートに FAIL が ${qa.summary.fail} 件あります。投入できません。`);
        process.exit(1);
      }
    } catch { /* レポートが壊れていても投入は止める方が安全 */ console.error("【中止】qa-report.json を解析できません。"); process.exit(1); }
  } else {
    console.error("【中止】qa-report.json がありません。先に qa-reviewer / qa-lint を実行してください。");
    process.exit(1);
  }

  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  const writeKey = process.env.MICROCMS_WRITE_API_KEY;
  const readKey = process.env.MICROCMS_API_KEY || writeKey;
  if (!serviceDomain || !writeKey) {
    console.error("\n【未設定】MICROCMS_SERVICE_DOMAIN と MICROCMS_WRITE_API_KEY が必要です。");
    console.error("microCMS 管理画面で書き込み(POST)権限付き APIキーを発行し、.env.local に設定してください。\n");
    process.exit(1);
  }

  const bodyHtml = fs.readFileSync(draftPath, "utf8");
  const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));

  let createClient;
  try {
    ({ createClient } = await import("microcms-js-sdk"));
  } catch {
    console.error("microcms-js-sdk を読み込めません。npm install を確認してください。");
    process.exit(1);
  }

  const readClient = createClient({ serviceDomain, apiKey: readKey });
  const writeClient = createClient({ serviceDomain, apiKey: writeKey });

  // slug → contentId マッピング（カテゴリ/タグはコンテンツ参照）
  async function mapId(endpoint, slug) {
    if (!slug) return undefined;
    const res = await readClient.get({ endpoint, queries: { limit: 100 } });
    const found = (res.contents || []).find(
      (c) => c.id === slug || c.slug === slug || c.name === slug
    );
    if (!found) console.warn(`[警告] ${endpoint} に slug/id "${slug}" が見つかりません。参照なしで投入します。`);
    return found ? found.id : undefined;
  }

  const categoryId = await mapId("categories", meta.category);
  const tagIds = [];
  for (const t of meta.tags || []) {
    const id = await mapId("tags", t);
    if (id) tagIds.push(id);
  }

  const content = {
    title: meta.title,
    content: bodyHtml,
    ...(meta.description ? { description: meta.description } : {}),
    ...(categoryId ? { category: categoryId } : {}),
    ...(tagIds.length ? { tags: tagIds } : {}),
    // 監修区分（記事末尾バイラインの表示制御）。microCMS の blogs スキーマに
    // "supervisor" フィールド（テキスト or セレクト: general/okubo/murakami/none）が
    // 必要。未定義の場合は下の自動除外ロジックでスキップされる。
    ...(meta.supervisor ? { supervisor: meta.supervisor } : {}),
  };

  console.log(`投入: kw_id=${kwId} / ${live ? "公開(live)" : "下書き(draft)"} / category=${meta.category || "-"} / tags=${(meta.tags || []).join(",") || "-"}`);

  // microCMSスキーマに未定義のフィールドは自動で除外して再投入（堅牢化）。
  // 既存コンテンツ（同一contentID）の場合は create(PUT) が 400 を返すため update(PATCH) にフォールバック。
  let payload = { ...content };
  let res = null;
  let useUpdate = false; // true なら既存コンテンツへの上書き更新（PATCH）
  for (let attempt = 0; attempt < 8 && !res; attempt++) {
    try {
      if (useUpdate) {
        // 既存コンテンツの本文・フィールドを上書き更新（PATCH）。
        // 注意: PATCH は公開ステータスを変更しない（下書きは下書きのまま）。
        // --live で「下書き→公開」に切り替える場合は microCMS 管理画面の「公開」操作、
        // または下書きを削除してから本スクリプトを --live で再実行してください。
        res = await writeClient.update({
          endpoint: "blogs",
          contentId: meta.slug,
          content: payload,
        });
      } else {
        res = await writeClient.create({
          endpoint: "blogs",
          content: payload,
          isDraft: !live,
          ...(meta.slug ? { contentId: meta.slug } : {}), // slug指定時は意味のあるURL（要: microCMSでコンテンツID指定を許可＋キーにPUT権限）
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      // 既存コンテンツ → PATCH へ切替（contentId 指定時のみ）
      if (!useUpdate && meta.slug && /already exists/i.test(msg)) {
        console.warn(`[既存コンテンツ] contentId「${meta.slug}」は既に存在します。update(PATCH)で上書き更新します。`);
        useUpdate = true;
        continue;
      }
      const m = msg.match(/'([^']+)' is unexpected key/);
      if (m && payload[m[1]] !== undefined) {
        const key = m[1];
        if (key === "title" || key === "content") {
          console.error(`\n【中止】microCMS の blogs スキーマに必須フィールド「${key}」がありません。`);
          console.error(`microCMS管理画面 → ブログ → API設定 → APIスキーマ で「${key}」フィールド（本文＝content はリッチエディタ推奨）を追加してから再実行してください。\n`);
          process.exit(1);
        }
        console.warn(`[スキーマ調整] フィールド「${key}」は microCMS 未定義のため除外して再投入します。`);
        delete payload[key];
        continue;
      }
      if (/PATCH is forbidden/i.test(msg)) {
        console.error("\n【中止】既存コンテンツの更新に必要な PATCH 権限が APIキーにありません。");
        console.error("対処1: microCMS 管理画面 → API設定 → APIキー で書き込みキーに『PATCH』権限を付与し、再実行。");
        console.error(`対処2: 管理画面でコンテンツ「${meta.slug}」を削除してから本スクリプトを再実行（PUTで再作成）。\n`);
        process.exit(1);
      }
      console.error("【投入エラー】", msg);
      console.error("APIキーの書き込み権限（blogs に POST/PUT/PATCH）、本文フィールド名（content）をご確認ください。");
      process.exit(1);
    }
  }
  if (!res) { console.error("【中止】再投入の上限に達しました。"); process.exit(1); }
  if (useUpdate && live) {
    console.warn("【注意】既存コンテンツを update(PATCH) で更新しました。公開ステータスは変更されていません。");
    console.warn("        本番公開する場合は microCMS 管理画面で「公開」操作を行うか、下書きを削除してから --live で再実行してください。");
  }
  console.log(`完了: microCMS contentId = ${res.id}（${useUpdate ? "既存を更新" : live ? "公開" : "下書き"}）`);
  console.log(`記事URL（公開後）: https://www.fureaino-oka.com/articles/${res.id}`);
  console.log("※ 台帳 content/pipeline/keywords.csv の article_id / status を更新してください。");
}

main().catch((err) => { console.error("予期しないエラー:", err); process.exit(1); });
