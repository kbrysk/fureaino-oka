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
import {
  getOpenDataset,
  getFullSubsidyRows,
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

function main() {
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

  console.log("Open data written:");
  console.log(`  ${path.relative(ROOT, jsonPath)}  (${rows.length} rows)`);
  console.log(`  ${path.relative(ROOT, csvPath)}`);
  console.log(`  ${path.relative(ROOT, readmePath)}`);
  console.log(
    `Summary: withSubsidy=${dataset.summary.withSubsidy}/${dataset.summary.totalMunicipalities} (${dataset.summary.withSubsidyPercent}%), avg=${dataset.summary.averageYen ?? "—"}yen`
  );
}

main();
