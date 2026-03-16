// overwrite-shiga-municipalities.mjs
// 使い方: node scripts/overwrite-shiga-municipalities.mjs
// 機能: scripts/shiga-raw.json の14件の subsidy で municipalities.json の滋賀県該当市町村を上書きする
//       - 滋賀県以外のデータは一切変更しない
//       - windowUrl → officialUrl に変換して格納

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DATA_PATH = resolve(ROOT, "app/lib/data/municipalities.json");
const RAW_PATH = resolve(__dirname, "shiga-raw.json");

const TARGET_IDS = new Set([
  "nagahama",
  "omihachiman",
  "moriyama",
  "ritto",
  "koka",
  "yasu",
  "konan",
  "takashima",
  "higashiomi",
  "maibara",
  "hino",
  "ryuo",
  "aisho",
  "taga",
]);

/** raw の subsidy を municipalities.json 用に変換（windowUrl → officialUrl） */
function transformSubsidy(s) {
  const out = {
    hasSubsidy: s.hasSubsidy === true ? true : s.hasSubsidy === false ? false : null,
    windowName: s.windowName ?? undefined,
    windowPhone: s.windowPhone ?? undefined,
    officialUrl: s.windowUrl ?? undefined,
    noSubsidyNote: s.noSubsidyNote ?? undefined,
    notes: s.notes ?? undefined,
    name: s.name ?? undefined,
    maxAmount: s.maxAmount ?? undefined,
    applicationPeriod: s.applicationPeriod ?? undefined,
  };
  if (Array.isArray(s.conditions) && s.conditions.length > 0) {
    out.conditions = s.conditions;
  } else if (Array.isArray(s.conditions)) {
    out.conditions = [];
  }
  // null のまま渡すと JSON に "key": null と出る。undefined は省略される
  Object.keys(out).forEach((k) => {
    if (out[k] === null) delete out[k];
  });
  return out;
}

function main() {
  console.log("📂 municipalities.json を読み込み中...");
  let data;
  try {
    data = JSON.parse(readFileSync(DATA_PATH, "utf-8"));
  } catch (e) {
    console.error("❌ municipalities.json の読み込みに失敗しました:", e.message);
    process.exit(1);
  }

  console.log("📂 scripts/shiga-raw.json を読み込み中...");
  let raw;
  try {
    raw = JSON.parse(readFileSync(RAW_PATH, "utf-8"));
  } catch (e) {
    console.error("❌ shiga-raw.json の読み込みに失敗しました:", e.message);
    process.exit(1);
  }

  const byCityId = new Map(raw.map((r) => [r.cityId, r]));

  let updated = 0;
  for (const item of data) {
    if (item.prefId !== "shiga" || !TARGET_IDS.has(item.cityId)) continue;
    const entry = byCityId.get(item.cityId);
    if (!entry) {
      console.warn(`⚠️ shiga-raw に cityId "${item.cityId}" がありません。スキップします。`);
      continue;
    }
    item.subsidy = transformSubsidy(entry.subsidy);
    updated++;
  }

  if (updated !== TARGET_IDS.size) {
    console.warn(`⚠️ 更新件数が ${TARGET_IDS.size} 件でなく ${updated} 件でした。`);
  }

  try {
    writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + "\n", "utf-8");
  } catch (e) {
    console.error("❌ ファイルの書き込みに失敗しました:", e.message);
    process.exit(1);
  }

  const shiga = data.filter((x) => x.prefId === "shiga");
  console.log("\n🎉 上書き完了！");
  console.log("─".repeat(50));
  console.log(`📊 滋賀県 更新: ${updated} 件`);
  console.log(
    `   補助金あり (true) : ${shiga.filter((x) => x.subsidy.hasSubsidy === true).length} 件`
  );
  console.log(
    `   補助金なし (false): ${shiga.filter((x) => x.subsidy.hasSubsidy === false).length} 件`
  );
  console.log(
    `   調査中   (null)  : ${shiga.filter((x) => x.subsidy.hasSubsidy === null).length} 件`
  );
  console.log("─".repeat(50));
  console.log("✅ JSON valid");
}

main();
