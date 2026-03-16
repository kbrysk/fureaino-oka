/**
 * 長野県市区町村データを municipalities.json にマージする。
 * 既存の nagano cityId はスキップする。
 * スキーマ変換: mascot null → デフォルト文言、windowUrl → officialUrl、garbage を officialUrl/phone に。
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const jsonPath = path.join(root, "app/lib/data/municipalities.json");
const rawPath = path.join(root, "scripts/nagano-raw.json");

const existing = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const existingNaganoIds = new Set(
  existing.filter((m) => m.prefId === "nagano").map((m) => m.cityId)
);

const raw = JSON.parse(fs.readFileSync(rawPath, "utf8"));

function transform(entry) {
  const { prefId, cityId, cityName, prefName, subsidy: s, garbage: g } = entry;
  const mascot = entry.mascot && entry.mascot.localRiskText
    ? { localRiskText: entry.mascot.localRiskText }
    : { localRiskText: `${cityName}の補助金・粗大ゴミの詳細は自治体の案内で確認してみてね。` };

  const subsidy = {
    hasSubsidy: s.hasSubsidy === true ? true : s.hasSubsidy === false ? false : null,
    name: s.name ?? undefined,
    maxAmount: s.maxAmount ?? undefined,
    conditions: Array.isArray(s.conditions) && s.conditions.length ? s.conditions : (s.conditions || undefined),
    officialUrl: s.windowUrl ?? undefined,
    applicationPeriod: s.applicationPeriod ?? undefined,
    windowName: s.windowName ?? undefined,
    windowPhone: s.windowPhone ?? undefined,
    noSubsidyNote: s.noSubsidyNote ?? undefined,
    notes: s.notes ?? undefined,
  };
  if (!subsidy.hasSubsidy && s.noSubsidyNote) subsidy.noSubsidyNote = s.noSubsidyNote;
  if (!subsidy.hasSubsidy && s.notes && !s.noSubsidyNote) subsidy.noSubsidyNote = s.notes;

  const officialUrl = (g && g.applicationUrl) || s.windowUrl || `https://www.google.com/search?q=${encodeURIComponent(cityName + " 粗大ゴミ")}`;
  const garbage = {
    officialUrl,
    phone: (g && g.applicationPhone) || s.windowPhone || undefined,
  };
  if (garbage.phone === null) delete garbage.phone;

  return {
    prefId,
    cityId,
    cityName,
    prefName,
    mascot,
    subsidy,
    garbage,
  };
}

const toAdd = raw.filter((e) => !existingNaganoIds.has(e.cityId)).map(transform);
console.log(`Skipping existing Nagano cityIds: ${[...existingNaganoIds].join(", ")}`);
console.log(`Adding ${toAdd.length} entries`);

const merged = [...existing, ...toAdd];
fs.writeFileSync(jsonPath, JSON.stringify(merged, null, 2) + "\n", "utf8");
console.log("Written", jsonPath);
