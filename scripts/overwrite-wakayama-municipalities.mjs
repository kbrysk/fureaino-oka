/**
 * municipalities.json 内の和歌山県エントリを wakayama-raw.json の内容で上書きする。
 * 新規追加は行わない。cityId 一致分のみ差し替え。
 * 変換: windowUrl→officialUrl, garbage→officialUrl/phone, mascot未設定時はデフォルト文言。
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const jsonPath = path.join(root, "app/lib/data/municipalities.json");
const rawPath = path.join(root, "scripts/wakayama-raw.json");

const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const raw = JSON.parse(fs.readFileSync(rawPath, "utf8"));

const rawByCityId = new Map(raw.map((e) => [e.cityId, e]));

function transform(entry) {
  const { prefId, cityId, cityName, prefName, subsidy: s, garbage: g } = entry;
  const mascot =
    entry.mascot && entry.mascot.localRiskText
      ? { localRiskText: entry.mascot.localRiskText }
      : { localRiskText: `${cityName}の補助金・粗大ゴミの詳細は自治体の案内で確認してみてね。` };

  const conditionsVal =
    Array.isArray(s.conditions) && s.conditions.length
      ? s.conditions
      : typeof s.conditions === "string"
        ? [s.conditions]
        : undefined;
  const subsidy = {
    hasSubsidy: s.hasSubsidy === true ? true : s.hasSubsidy === false ? false : null,
    name: s.name ?? undefined,
    maxAmount: s.maxAmount ?? undefined,
    conditions: conditionsVal,
    officialUrl: s.windowUrl ?? undefined,
    applicationPeriod: s.applicationPeriod ?? undefined,
    windowName: s.windowName ?? undefined,
    windowPhone: s.windowPhone ?? undefined,
    noSubsidyNote: s.noSubsidyNote ?? undefined,
    notes: s.notes ?? undefined,
  };
  if (!subsidy.hasSubsidy && s.noSubsidyNote) subsidy.noSubsidyNote = s.noSubsidyNote;
  if (!subsidy.hasSubsidy && s.notes && !s.noSubsidyNote) subsidy.noSubsidyNote = s.notes;

  const officialUrl =
    (g && g.applicationUrl) ||
    s.windowUrl ||
    `https://www.google.com/search?q=${encodeURIComponent(cityName + " 粗大ゴミ")}`;
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

let overwritten = 0;
const result = data.map((m) => {
  if (m.prefId !== "wakayama") return m;
  const rawEntry = rawByCityId.get(m.cityId);
  if (!rawEntry) return m;
  overwritten++;
  return transform(rawEntry);
});

fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2) + "\n", "utf8");
console.log(`Overwritten ${overwritten} Wakayama entries. Written ${jsonPath}`);
