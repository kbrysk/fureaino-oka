/**
 * 全国 空き家解体補助金 オープンデータ書き出し（被リンク獲得・データドロップ用）
 *
 * 目的:
 * - 記者・研究者・自治体・開発者が「引用・利用」しやすい機械可読データ（CSV/JSON）を生成する。
 * - これらは安定URL（/opendata/akiya-hojokin-2026.{json,csv}）で配布し、被リンク／サイテーションを誘発する。
 * - 四半期ごとの「データドロップ」運用で再生成し、リンクを複利的に積み上げる。
 *
 * 集計ロジックは app/lib/data/municipality-stats.ts を再利用（数値の二重実装・乖離を防ぐ）。
 * ライセンス: CC BY 4.0（出典明記で自由利用可）。実データのみ・捏造なし。
 *
 * 実行: npm run data:opendata
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import {
  getOpenDataset,
  getFullSubsidyRows,
  formatYenAsMan,
  STATS_AS_OF,
  STATS_CREDIT,
  STATS_SOURCE,
  type OpenDataRow,
} from "../../app/lib/data/municipality-stats";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "opendata");
const SITE = "https://www.fureaino-oka.com";
const REPORT_URL = `${SITE}/data/akiya-hojokin-ranking`;

/** CSV の1セルを安全にエスケープする（カンマ・改行・引用符に対応）。 */
function csvCell(value: unknown): string {
  const s = value == null ? "" : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** OpenDataRow[] を CSV 文字列に変換する（UTF-8 BOM 付き＝Excelで文字化けしない）。 */
function rowsToCsv(rows: OpenDataRow[]): string {
  const header = [
    "pref_id",
    "pref_name",
    "city_id",
    "city_name",
    "has_subsidy",
    "subsidy_name",
    "max_amount_raw",
    "max_amount_yen",
    "official_url",
  ];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.prefId,
        r.prefName,
        r.cityId,
        r.cityName,
        r.hasSubsidy ? "1" : "0",
        r.subsidyName,
        r.maxAmountRaw,
        r.maxAmountYen ?? "",
        r.officialUrl,
      ]
        .map(csvCell)
        .join(",")
    );
  }
  return "﻿" + lines.join("\r\n") + "\r\n";
}

function buildReadme(total: number): string {
  return [
    "全国 空き家解体補助金 調査データ（オープンデータ）",
    "==================================================",
    "",
    `調査対象: 全国 ${total.toLocaleString("ja-JP")} 自治体`,
    `基準時点: ${STATS_AS_OF}`,
    `調査主体: ${STATS_CREDIT}`,
    `出典: ${STATS_SOURCE}`,
    `解説ページ: ${REPORT_URL}`,
    "",
    "ライセンス: CC BY 4.0 ( https://creativecommons.org/licenses/by/4.0/ )",
    "出典を明記いただければ、記事・報道・研究・自治体資料などに自由にご利用いただけます。",
    "",
    "出典表記例:",
    `「全国${total.toLocaleString("ja-JP")}自治体 空き家解体補助金 調査データ（${STATS_AS_OF}・${STATS_CREDIT}）／ 生前整理支援センター ふれあいの丘」`,
    `引用元URL: ${REPORT_URL}`,
    "",
    "ファイル:",
    "  akiya-hojokin-2026.json … メタ＋全国サマリ＋金額分布＋都道府県別＋TOP30＋全自治体明細",
    "  akiya-hojokin-2026.csv  … 1行=1自治体の明細（pref_id, city_name, has_subsidy, max_amount_yen ほか）",
    "",
    "注意:",
    "  金額は各自治体公式の上限額（または定額）を機械抽出した目安です。",
    "  費用割合・面積単価・世帯条件等により実際の交付額は変動します。",
    "  最新・正確な情報は必ず各自治体公式でご確認ください。",
    "",
  ].join("\n");
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * 配布用インフォグラフィック（1200x630・OG比）のSVGを生成する。
 * メディアが記事に"図版"として置きやすく、SNSでの拡散・被リンクを誘発する。
 * テキストは sans-serif（閲覧者ブラウザ／ラスタライズ環境のフォントで描画）。
 */
function buildInfographicSvg(summary: ReturnType<typeof getOpenDataset>["summary"]): string {
  const W = 1200;
  const H = 630;
  const pct = summary.withSubsidyConfirmedPercent; // 48.9
  const confirmed = summary.withSubsidyConfirmed.toLocaleString("ja-JP");
  const total = summary.totalMunicipalities.toLocaleString("ja-JP");
  const natTotal = summary.nationalMunicipalityTotal.toLocaleString("ja-JP");
  const cov = summary.coveragePercent;
  const medianMan = summary.medianYen ? formatYenAsMan(summary.medianYen) : "—";
  const avgMan = summary.averageYen ? formatYenAsMan(summary.averageYen) : "—";

  const green = "#2f7d5b";
  const ink = "#33312e";
  const sub = "#6b5f51";
  const cream = "#fffdf8";
  const track = "#eee7da";

  const barX = 70;
  const barW = 1060;
  const fillW = Math.round((barW * pct) / 100);

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${cream}"/>
  <rect x="0" y="0" width="${W}" height="14" fill="${green}"/>
  <text x="70" y="92" font-family="sans-serif" font-size="30" fill="${sub}">独自調査 ${esc(STATS_AS_OF)}・${esc(STATS_CREDIT)}</text>
  <text x="70" y="150" font-family="sans-serif" font-size="46" font-weight="bold" fill="${ink}">全国 空き家解体補助金 調査 2026</text>

  <text x="70" y="298" font-family="sans-serif" font-size="140" font-weight="bold" fill="${green}">${pct}%</text>
  <text x="540" y="236" font-family="sans-serif" font-size="34" fill="${ink}">の自治体で</text>
  <text x="540" y="292" font-family="sans-serif" font-size="42" font-weight="bold" fill="${ink}">解体補助金を確認</text>
  <text x="540" y="340" font-family="sans-serif" font-size="28" fill="${sub}">（調査${esc(total)}自治体のうち${esc(confirmed)}自治体）</text>

  <rect x="${barX}" y="380" width="${barW}" height="26" rx="13" fill="${track}"/>
  <rect x="${barX}" y="380" width="${fillW}" height="26" rx="13" fill="${green}"/>

  <text x="70" y="478" font-family="sans-serif" font-size="36" fill="${ink}">上限額の中央値 <tspan font-weight="bold" fill="${green}">${esc(medianMan)}</tspan>（平均 約${esc(avgMan)}）</text>
  <text x="70" y="524" font-family="sans-serif" font-size="28" fill="${sub}">調査範囲：全国${esc(natTotal)}市区町村の約${cov}%（${esc(total)}自治体）／ 出典：${esc(STATS_SOURCE)}</text>

  <text x="70" y="596" font-family="sans-serif" font-size="24" fill="${sub}">${esc(SITE_LABEL_INFOGRAPHIC)} ｜ CC BY 4.0 ｜ www.fureaino-oka.com/data/akiya-hojokin-ranking</text>
</svg>`;
}

const SITE_LABEL_INFOGRAPHIC = "生前整理支援センター ふれあいの丘";

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const dataset = getOpenDataset();
  const rows = getFullSubsidyRows();

  const jsonPath = path.join(OUT_DIR, "akiya-hojokin-2026.json");
  const csvPath = path.join(OUT_DIR, "akiya-hojokin-2026.csv");
  const readmePath = path.join(OUT_DIR, "README.txt");

  fs.writeFileSync(
    jsonPath,
    JSON.stringify({ ...dataset, meta: { ...dataset.meta, sourceUrl: REPORT_URL } }, null, 2),
    "utf8"
  );
  fs.writeFileSync(csvPath, rowsToCsv(rows), "utf8");
  fs.writeFileSync(readmePath, buildReadme(dataset.summary.totalMunicipalities), "utf8");

  // 配布用インフォグラフィック（SVG＋PNG）。PNG は本機（フォントあり）でラスタライズして同梱する。
  const svg = buildInfographicSvg(dataset.summary);
  const svgPath = path.join(OUT_DIR, "akiya-hojokin-infographic.svg");
  const pngPath = path.join(OUT_DIR, "akiya-hojokin-infographic.png");
  fs.writeFileSync(svgPath, svg, "utf8");
  await sharp(Buffer.from(svg)).png().toFile(pngPath);

  console.log("Open data written:");
  console.log(`  ${path.relative(ROOT, jsonPath)}  (${rows.length} rows)`);
  console.log(`  ${path.relative(ROOT, csvPath)}`);
  console.log(`  ${path.relative(ROOT, readmePath)}`);
  console.log(`  ${path.relative(ROOT, svgPath)}`);
  console.log(`  ${path.relative(ROOT, pngPath)}`);
  console.log(
    `Summary: confirmed=${dataset.summary.withSubsidyConfirmed}/${dataset.summary.totalMunicipalities} (${dataset.summary.withSubsidyConfirmedPercent}%), coverage=${dataset.summary.coveragePercent}% of ${dataset.summary.nationalMunicipalityTotal}, avg=${dataset.summary.averageYen ?? "—"}yen`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
