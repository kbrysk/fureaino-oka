/**
 * qa-lint.mjs — SEO記事 自動QAリンター（決定論ゲート）
 *
 * 設計書 docs/SEO_CONTENT_AUTOMATION_ARCHITECTURE.md §5.5 の法務・構成・CTA・監修整合ルールを
 * 機械判定する。LLMの自己申告に依存せず、公開前の必須ゲートとして使う。
 *
 * 使い方:
 *   node scripts/content/qa-lint.mjs <draft.html> [--meta <meta.json>] [--ymyl] [--json]
 *   node scripts/content/qa-lint.mjs --if-draft <path>   # ファイル名が draft.html のときだけ実行（フック用）
 *
 * 出力: 人間可読レポート（既定）/ --json で機械可読。
 * 終了コード: FAIL が1つでもあれば 1、なければ 0（WARNは0）。
 *
 * meta.json（任意）の想定フィールド:
 *   { "category": "guide|cleanup|inheritance|real-estate|digital|mental",
 *     "tags": ["save-money", ...],
 *     "supervisor": "murakami|shihoshoshi|zeirishi|kaitai|takken|none",
 *     "murakamiApproved": true|false }
 */
import fs from "fs";

const CATEGORIES = ["guide", "cleanup", "inheritance", "real-estate", "digital", "mental"];
const TAGS = ["long-distance","save-money","no-time","parent-stubborn","family-conflict","gomi-yashiki","akiya-long","digital-worry","inheritance-deadline","guilt-cannot-throw"];
const MURAKAMI_DOMAINS = ["guide", "mental", "cleanup"]; // 村上様監修可カテゴリ（生前整理・心/供養・片付け系。要運用調整）
const SPECIALIST_DOMAINS = ["inheritance", "real-estate"]; // 税理士/司法書士/宅建/解体が必要

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function parseArgs(argv) {
  const a = argv.slice(2);
  const out = { file: null, meta: null, ymyl: false, json: false, ifDraft: false, pillar: false };
  for (let i = 0; i < a.length; i++) {
    if (a[i] === "--meta") out.meta = a[++i];
    else if (a[i] === "--ymyl") out.ymyl = true;
    else if (a[i] === "--json") out.json = true;
    else if (a[i] === "--pillar") out.pillar = true;
    else if (a[i] === "--if-draft") { out.ifDraft = true; out.file = a[++i]; }
    else if (!out.file) out.file = a[i];
  }
  return out;
}

function run() {
  const args = parseArgs(process.argv);
  if (args.ifDraft) {
    // フック用: draft.html 以外は黙って成功扱い（無関係なWriteを邪魔しない）
    if (!args.file || !/draft\.html$/i.test(args.file)) process.exit(0);
  }
  if (!args.file || !fs.existsSync(args.file)) {
    console.error("使い方: node scripts/content/qa-lint.mjs <draft.html> [--meta meta.json] [--ymyl] [--json]");
    process.exit(2);
  }

  const html = fs.readFileSync(args.file, "utf8");
  const text = stripTags(html);
  const meta = args.meta && fs.existsSync(args.meta) ? JSON.parse(fs.readFileSync(args.meta, "utf8")) : null;

  // YMYL 判定: フラグ or カテゴリ or 本文に税務/法務/不動産語
  const ymyl =
    args.ymyl ||
    (meta && SPECIALIST_DOMAINS.includes(meta.category)) ||
    /(相続税|遺言|譲渡所得|不動産売却|解体|登記|家族信託)/.test(text);

  const results = [];
  const add = (id, name, status, detail) => results.push({ id, name, status, detail: detail || "" });
  const failIf = (cond, id, name, detail) => add(id, name, cond ? "FAIL" : "PASS", cond ? detail : "");
  const requireIf = (cond, id, name, detail) => add(id, name, cond ? "PASS" : "FAIL", cond ? "" : detail);

  // ---- 法務 (L1-L6) ----
  failIf(/(遺言(書)?\s*(に|には)?\s*(次の(ように|とおり)|以下の(ように|とおり)|こう)\s*(書|記載))/.test(text) || /相続させる(。|と記載|と書)/.test(text),
    "L1", "遺言の具体文案", "遺言の記載例・文案らしき表現");
  failIf(/(遺産分割|分割協議).{0,8}(代行|交渉|代理)/.test(text), "L2", "遺産分割の代行/交渉示唆", "代行・交渉の示唆");
  failIf(/相続税.{0,12}([0-9０-９][0-9０-９,，]*\s*万?円).{0,6}(になります|です|かかります)/.test(text), "L3", "個別相続税の金額断定", "具体額の断定（制度説明は可）");
  failIf(/(節税|相続税).{0,10}(減らせ|圧縮|スキーム|対策で.{0,4}得)/.test(text), "L4", "節税スキーム推奨", "特定の節税手法の推奨");
  failIf((text.match(/(必ず|間違いなく|絶対に)[^。]{0,20}(なります|べきです|してください)/g) || []).length >= 2, "L5", "断定的判断の多用", "断定表現が複数");
  failIf(/(今すぐ売らないと|急がないと損|今だけ高く|すぐに手放さ)/.test(text), "L6", "押し買い/煽り勧誘", "緊急性を煽る勧誘");

  // ---- 出典・E-E-A-T (S1-S5) ----
  requireIf(/(厚生労働省|総務省|国民生活センター|法務省|国税庁|\.lg\.jp)/.test(text), "S1", "公的出典の引用", "公的一次出典が見当たらない");
  if (ymyl) requireIf(/(弁護士|司法書士|税理士|医師|専門家|ケアマネ)[^。]{0,15}(相談|ご相談)/.test(text), "S2", "専門家相談の明記(YMYL)", "YMYL記事だが専門家相談の案内がない");
  else add("S2", "専門家相談の明記(YMYL)", "SKIP", "非YMYL");
  const claimsCred = /(税理士|弁護士|司法書士)[^。]{0,6}監修/.test(text);
  failIf(claimsCred && (!meta || !["zeirishi","shihoshoshi","takken"].includes(meta.supervisor)), "S3", "虚偽資格表示", "有資格者監修の表示だが meta.supervisor が該当専門家でない");

  // S4: 監修クレジットのドメイン整合（metaがある場合）
  if (meta) {
    const sup = meta.supervisor || "none";
    let s4Fail = false, s4d = "";
    if (sup === "murakami" && SPECIALIST_DOMAINS.includes(meta.category)) { s4Fail = true; s4d = "村上様監修だが専門家領域(相続/不動産)"; }
    if (/村上\s*充恵/.test(text) && sup !== "murakami") { s4Fail = true; s4d = "本文に村上様の名があるが supervisor!=murakami"; }
    add("S4", "監修クレジットのドメイン整合", s4Fail ? "FAIL" : "PASS", s4d);
    // S5: 村上監修記事は承認なしに公開不可（draftは可）。ここでは承認状態をWARN表示。
    if (sup === "murakami") add("S5", "村上様の最終確認", meta.murakamiApproved ? "PASS" : "WARN", meta.murakamiApproved ? "" : "未承認（公開前に村上様確認が必要・下書きは可）");
  } else {
    add("S4", "監修クレジットのドメイン整合", "SKIP", "meta.json 未指定");
  }

  // ---- 構成・トーン (T1-T3) ----
  const pillar = args.pillar || (meta && meta.pillar === true);
  const len = [...text].length;
  let t1 = "PASS", t1d = `${len}字`;
  if (pillar) {
    // ピラー/ハブ記事は網羅型（上位競合7,000〜9,000字に対抗）
    if (len < 3000 || len > 12000) { t1 = "FAIL"; t1d = `${len}字（ピラー推奨4,000〜10,000, 3,000未満/12,000超でFAIL）`; }
    else if (len < 4000 || len > 10000) { t1 = "WARN"; t1d = `${len}字（ピラー推奨4,000〜10,000の範囲外）`; }
    else { t1d = `${len}字（ピラー）`; }
  } else {
    if (len < 1500 || len > 4000) { t1 = "FAIL"; t1d = `${len}字（2000〜3000推奨, 1500未満/4000超でFAIL）`; }
    else if (len < 2000 || len > 3000) { t1 = "WARN"; t1d = `${len}字（推奨2000〜3000の範囲外）`; }
  }
  add("T1", "文字数", t1, t1d);

  const h2count = (html.match(/<h2[\s>]/gi) || []).length;
  const firstH2 = html.search(/<h2[\s>]/i);
  const leadHtml = firstH2 >= 0 ? html.slice(0, firstH2) : html;
  const leadLen = [...stripTags(leadHtml)].length;
  let t2 = "PASS", t2d = `H2:${h2count} / リード:${leadLen}字`;
  if (h2count < 2) { t2 = "FAIL"; t2d = `H2が${h2count}個（2以上必要）`; }
  else if (leadLen < 120 || leadLen > 180) { t2 = "WARN"; t2d = `リード${leadLen}字（120〜180目安）／H2:${h2count}`; }
  add("T2", "構成(H2/リード)", t2, t2d);

  const subeki = (text.match(/すべき|しなければならない/g) || []).length;
  add("T3", "トーン(断定/命令の多用)", subeki >= 4 ? "WARN" : "PASS", subeki >= 4 ? `「すべき/しなければ」が${subeki}回` : "");

  // ---- CTA・内部リンク・禁止要素 (C1-C5) ----
  const internalLinks = (html.match(/href=["'](\/(?!\/)[^"']*|https?:\/\/(www\.)?fureaino-oka\.com[^"']*)["']/gi) || []).length;
  let c1 = "PASS", c1d = `内部リンク${internalLinks}本`;
  if (internalLinks === 0) { c1 = "FAIL"; c1d = "内部リンク0本（2〜3本必要）"; }
  else if (internalLinks === 1) { c1 = "WARN"; c1d = "内部リンク1本（2〜3本推奨）"; }
  add("C1", "内部リンク(2〜3本)", c1, c1d);

  failIf(/(LINEで|友だち追加|今すぐ受け取る|特典をもらう|ともだち追加)/.test(text), "C2", "LINE CTAの本文混入", "LINE誘導文言は本文に入れない（テンプレが表示）");

  // C3: フクロウ相槌の地書き（【フクロウ:】記法の外に「ホー」語尾）
  const withoutOwl = html.replace(/【フクロウ:[^】]*】/g, "");
  add("C3", "相槌の地書き", /ホー(。|、|！|」|\s|$)/.test(stripTags(withoutOwl)) ? "WARN" : "PASS", "");

  failIf(/href=["']tel:/i.test(html) || /(市役所|役場).{0,6}(0\d{1,4}-\d{1,4}-\d{3,4})/.test(text), "C4", "tel/自治体電話の露出", "tel:リンク or 自治体電話の強調");
  failIf(/(口座番号|パスワード|暗証番号|PIN)[^。]{0,10}(記入|入力|保存|控え)/.test(text), "C5", "PII保存誘導", "機密情報の記入/保存誘導");

  // ---- メタ整合 (M1) ----
  if (meta) {
    const catOk = !meta.category || CATEGORIES.includes(meta.category);
    const tagsOk = !meta.tags || meta.tags.every((t) => TAGS.includes(t));
    add("M1", "メタ(カテゴリ/タグ)整合", catOk && tagsOk ? "PASS" : "FAIL", catOk && tagsOk ? "" : `category/tags がタクソノミー外`);
  } else add("M1", "メタ(カテゴリ/タグ)整合", "SKIP", "meta.json 未指定");

  // ---- 集計・出力 ----
  const fails = results.filter((r) => r.status === "FAIL");
  const warns = results.filter((r) => r.status === "WARN");
  const report = {
    file: args.file, ymyl, generatedAt: new Date().toISOString(),
    summary: { pass: results.filter(r=>r.status==="PASS").length, warn: warns.length, fail: fails.length, skip: results.filter(r=>r.status==="SKIP").length },
    results,
  };

  if (args.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    const icon = (s) => ({ PASS: "✓", FAIL: "✗", WARN: "△", SKIP: "－" }[s] || "?");
    console.log("==== QA Lint:", args.file, ymyl ? "(YMYL)" : "", "====");
    for (const r of results) console.log(` ${icon(r.status)} [${r.id}] ${r.name}${r.detail ? " — " + r.detail : ""}`);
    console.log(`---- PASS:${report.summary.pass} WARN:${report.summary.warn} FAIL:${report.summary.fail} SKIP:${report.summary.skip} ----`);
    console.log(fails.length ? "結果: FAIL（公開不可。差し戻し）" : warns.length ? "結果: PASS（要確認のWARNあり）" : "結果: PASS");
  }

  process.exit(fails.length ? 1 : 0);
}

run();
