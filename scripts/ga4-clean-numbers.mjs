/**
 * GA4 クリーン数字 算出（DD提出用・再現可能）
 *
 * GA4管理UIのデータフィルタではヘッドレスDCボット（IP動的）を除外できない。
 * そこで「ボット署名」を明示ルールで除外し、買い手に出せる実人間セッションを算出する。
 *
 * 使い方:
 *   node scripts/ga4-clean-numbers.mjs <ランディングページCSV> [チャネルCSV]
 *   例: node scripts/ga4-clean-numbers.mjs "C:/Users/Ryosuke/Downloads/ランディング_ページ.csv"
 *
 * ボット署名（4専門家合意・OVERSEAS_TRAFFIC_INVESTIGATION準拠）:
 *   - エンゲージメント時間 0秒 かつ ランディングが /area・/cost 完全一致（合成/ボット流入の指紋）
 *   - .html 終端の旧静的パス（/access.html, /eat.html 等＝中古ドメイン残骸クロール）
 * クリーンの定義: 上記を除いた「平均エンゲージメント時間>0 のセッション」。
 * さらに保守的なDD数字として「エンゲージ≥10秒のセッション」も併記する。
 */
import fs from "fs";

const path = process.argv[2];
if (!path) {
  console.error("使い方: node scripts/ga4-clean-numbers.mjs <ランディングページCSV>");
  process.exit(1);
}

function parseCsv(raw) {
  // GA4エクスポートは先頭に # コメント行があり、その後にヘッダー＋データ
  const lines = raw.split(/\r?\n/).filter((l) => l.trim() && !l.startsWith("#"));
  const header = lines[0].split(",");
  const idx = (name) => header.findIndex((h) => h.includes(name));
  const iPage = idx("ランディング");
  const iSess = idx("セッション");
  const iEng = header.findIndex((h) => h.includes("平均エンゲージメント時間") || h.includes("エンゲージメント時間"));
  const rows = lines.slice(1).map((l) => {
    // 単純CSV（GA4のページ名にカンマは通常入らない）
    const p = l.split(",");
    return { page: p[iPage], sessions: parseFloat(p[iSess]) || 0, eng: parseFloat(p[iEng]) || 0 };
  });
  return rows;
}

const rows = parseCsv(fs.readFileSync(path, "utf8"));

const BOT_SIG = (r) =>
  (r.eng === 0 && /^\/(area|cost)$/.test(r.page)) || // 合成流入の指紋
  /\.html$/.test(r.page) ||                           // 中古ドメイン残骸
  r.page === "(not set)" && r.eng < 5;                // 計測欠落＋低エンゲージ

const total = rows.reduce((s, r) => s + r.sessions, 0);
const botRows = rows.filter(BOT_SIG);
const botSessions = botRows.reduce((s, r) => s + r.sessions, 0);
const clean = rows.filter((r) => !BOT_SIG(r));
const cleanSessions = clean.reduce((s, r) => s + r.sessions, 0);
const engaged = clean.filter((r) => r.eng >= 10);
const engagedSessions = engaged.reduce((s, r) => s + r.sessions, 0);

console.log("=== GA4 クリーン数字（DD提出用）===");
console.log("総セッション(GA4生):", total);
console.log("ボット署名で除外:", botSessions, `(${(botSessions / total * 100).toFixed(1)}%)`);
console.log("  内訳上位:");
botRows.sort((a, b) => b.sessions - a.sessions).slice(0, 5).forEach((r) => console.log(`    ${r.page} : ${r.sessions}セッション・エンゲージ${r.eng}秒`));
console.log("→ クリーン・セッション(人間推定):", cleanSessions, `(${(cleanSessions / total * 100).toFixed(1)}%)`);
console.log("→ うちエンゲージ≥10秒(保守的DD数字):", engagedSessions);
console.log("\n=== 実際に読まれている記事(エンゲージ≥60秒・買い手に見せる隠れ資産) ===");
clean.filter((r) => r.eng >= 60 && r.page.startsWith("/articles/"))
  .sort((a, b) => b.eng - a.eng).slice(0, 12)
  .forEach((r) => console.log(`  ${r.page} : ${r.sessions}セッション・平均${Math.round(r.eng)}秒`));
