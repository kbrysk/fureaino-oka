/**
 * nagano-raw.json の内容で、既存の municipalities 内の長野県エントリを更新する（追加はしない）。
 * windowUrl → officialUrl、garbage を officialUrl/phone に変換して上書き。
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const jsonPath = path.join(root, "app/lib/data/municipalities.json");
const rawPath = path.join(root, "scripts/nagano-raw.json");

const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const raw = JSON.parse(fs.readFileSync(rawPath, "utf8"));
const rawByCityId = new Map(raw.map((e) => [e.cityId, e]));

function transformSubsidyGarbage(entry) {
  const { cityName, subsidy: s, garbage: g } = entry;
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
  return { subsidy, garbage };
}

let updated = 0;
for (const m of data) {
  if (m.prefId !== "nagano") continue;
  const r = rawByCityId.get(m.cityId);
  if (!r) continue;
  const { subsidy, garbage } = transformSubsidyGarbage(r);
  m.subsidy = subsidy;
  m.garbage = garbage;
  if (!m.mascot || !m.mascot.localRiskText) {
    m.mascot = { localRiskText: `${m.cityName}の補助金・粗大ゴミの詳細は自治体の案内で確認してみてね。` };
  }
  updated++;
}

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log("Updated", updated, "Nagano entries from", rawPath);
