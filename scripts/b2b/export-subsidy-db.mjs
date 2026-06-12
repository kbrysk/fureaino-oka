/**
 * B2Bデータライセンス用 補助金DBエクスポート
 *
 * 用途: 全国1,726市区町村の解体・空き家補助金DBを商品化形式で出力する。
 *   - full:   全件CSV/JSON（契約顧客への納品物。リポジトリにはコミットしない）
 *   - sample: 都道府県2県分のサンプルCSV（営業資料に添付。コミット可）
 *   - stats:  収録統計サマリーJSON（ワンページャー・営業メールの数値根拠）
 *
 * 使い方:
 *   node scripts/b2b/export-subsidy-db.mjs            # sample + stats のみ
 *   node scripts/b2b/export-subsidy-db.mjs --full     # full も出力
 *   node scripts/b2b/export-subsidy-db.mjs --sample-prefs hiroshima,aichi
 *
 * 出力先: b2b-exports/（.gitignore 推奨。sample/stats は docs/b2b/assets/ にもコピー）
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const DB_PATH = path.join(ROOT, "app", "lib", "data", "municipalities.json");
const OUT_DIR = path.join(ROOT, "b2b-exports");
const DOCS_ASSET_DIR = path.join(ROOT, "docs", "b2b", "assets");

const args = process.argv.slice(2);
const FULL = args.includes("--full");
const samplePrefsArg = (() => {
  const i = args.indexOf("--sample-prefs");
  return i >= 0 && args[i + 1] ? args[i + 1].split(",") : ["hiroshima", "aichi"];
})();

/** CSVフィールドのエスケープ */
function q(v) {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** conditions は string | string[] の両対応 */
function condText(c) {
  if (c == null) return "";
  return Array.isArray(c) ? c.join("／") : String(c);
}

const COLUMNS = [
  "pref_id",
  "pref_name",
  "city_id",
  "city_name",
  "has_subsidy",
  "subsidy_name",
  "max_amount",
  "conditions",
  "application_period",
  "window_name",
  "official_url",
  "no_subsidy_note",
  "notes",
  "garbage_official_url",
];

function toRow(m) {
  const s = m.subsidy || {};
  return [
    m.prefId,
    m.prefName,
    m.cityId,
    m.cityName,
    s.hasSubsidy === true ? "あり" : s.hasSubsidy === false ? "なし" : "調査中",
    s.name || "",
    s.maxAmount || "",
    condText(s.conditions),
    s.applicationPeriod || "",
    s.windowName || "",
    s.officialUrl || "",
    s.noSubsidyNote || "",
    s.notes || "",
    m.garbage?.officialUrl || "",
  ];
}

function toCsv(rows) {
  // Excel互換のためBOM付きUTF-8
  return "﻿" + [COLUMNS.join(","), ...rows.map((r) => r.map(q).join(","))].join("\r\n") + "\r\n";
}

function main() {
  const db = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(DOCS_ASSET_DIR, { recursive: true });

  const today = new Date().toISOString().slice(0, 10);

  // ---- stats ----
  const withSubsidy = db.filter((m) => m.subsidy?.hasSubsidy === true);
  const withUrl = withSubsidy.filter((m) => m.subsidy?.officialUrl);
  const withAmount = withSubsidy.filter((m) => m.subsidy?.maxAmount);
  const prefs = new Set(db.map((m) => m.prefId));
  const byPref = {};
  for (const m of db) {
    if (!byPref[m.prefId]) byPref[m.prefId] = { prefName: m.prefName, total: 0, hasSubsidy: 0 };
    byPref[m.prefId].total++;
    if (m.subsidy?.hasSubsidy === true) byPref[m.prefId].hasSubsidy++;
  }
  const stats = {
    generatedAt: today,
    totalMunicipalities: db.length,
    prefectures: prefs.size,
    subsidyAvailable: withSubsidy.length,
    subsidyWithOfficialUrl: withUrl.length,
    subsidyWithMaxAmount: withAmount.length,
    garbageWindowCovered: db.filter((m) => m.garbage?.officialUrl).length,
    byPrefecture: byPref,
  };
  const statsPath = path.join(OUT_DIR, "db-stats.json");
  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
  fs.copyFileSync(statsPath, path.join(DOCS_ASSET_DIR, "db-stats.json"));

  // ---- sample ----
  const sample = db.filter((m) => samplePrefsArg.includes(m.prefId));
  const samplePath = path.join(OUT_DIR, `sample_${samplePrefsArg.join("-")}_${today}.csv`);
  fs.writeFileSync(samplePath, toCsv(sample.map(toRow)));
  fs.copyFileSync(samplePath, path.join(DOCS_ASSET_DIR, "sample.csv"));

  // ---- full（契約納品用・要 --full フラグ。コミット禁止） ----
  if (FULL) {
    const fullCsvPath = path.join(OUT_DIR, `full_${today}.csv`);
    fs.writeFileSync(fullCsvPath, toCsv(db.map(toRow)));
    const fullJsonPath = path.join(OUT_DIR, `full_${today}.json`);
    const apiShape = db.map((m) => ({
      pref: { id: m.prefId, name: m.prefName },
      city: { id: m.cityId, name: m.cityName },
      subsidy: {
        available: m.subsidy?.hasSubsidy === true,
        name: m.subsidy?.name ?? null,
        maxAmount: m.subsidy?.maxAmount ?? null,
        conditions: m.subsidy?.conditions ?? null,
        applicationPeriod: m.subsidy?.applicationPeriod ?? null,
        officialUrl: m.subsidy?.officialUrl ?? null,
        note: m.subsidy?.noSubsidyNote ?? m.subsidy?.notes ?? null,
      },
      garbage: { officialUrl: m.garbage?.officialUrl ?? null },
    }));
    fs.writeFileSync(fullJsonPath, JSON.stringify({ meta: { generatedAt: today, count: db.length }, data: apiShape }, null, 2));
    console.log("full:", fullCsvPath, "+ .json");
  }

  console.log("=== B2B Export 完了 ===");
  console.log("総市区町村:", stats.totalMunicipalities, "/ 47都道府県");
  console.log("補助金あり:", stats.subsidyAvailable, `(うち公式URL付き ${stats.subsidyWithOfficialUrl}・上限額情報あり ${stats.subsidyWithMaxAmount})`);
  console.log("粗大ごみ窓口収録:", stats.garbageWindowCovered);
  console.log("sample:", samplePath, `(${sample.length}行)`);
  console.log("stats :", statsPath);
}

main();
