/**
 * areas.csv から (prefecture, city) → (prefectureId, cityId) のマッピングを生成し、
 * app/lib/area-id-map.generated.ts を出力する。
 * 実行: node scripts/generate-area-id-map.cjs
 */
const fs = require("fs");
const path = require("path");

const PREFECTURE_NAME_TO_ID = {
  北海道: "hokkaido", 青森県: "aomori", 岩手県: "iwate", 宮城県: "miyagi",
  秋田県: "akita", 山形県: "yamagata", 福島県: "fukushima", 茨城県: "ibaraki",
  栃木県: "tochigi", 群馬県: "gunma", 埼玉県: "saitama", 千葉県: "chiba",
  東京都: "tokyo", 神奈川県: "kanagawa", 新潟県: "niigata", 富山県: "toyama",
  石川県: "ishikawa", 福井県: "fukui", 山梨県: "yamanashi", 長野県: "nagano",
  岐阜県: "gifu", 静岡県: "shizuoka", 愛知県: "aichi", 三重県: "mie",
  滋賀県: "shiga", 京都府: "kyoto", 大阪府: "osaka", 兵庫県: "hyogo",
  奈良県: "nara", 和歌山県: "wakayama", 鳥取県: "tottori", 島根県: "shimane",
  岡山県: "okayama", 広島県: "hiroshima", 山口県: "yamaguchi", 徳島県: "tokushima",
  香川県: "kagawa", 愛媛県: "ehime", 高知県: "kochi", 福岡県: "fukuoka",
  佐賀県: "saga", 長崎県: "nagasaki", 熊本県: "kumamoto", 大分県: "oita",
  宮崎県: "miyazaki", 鹿児島県: "kagoshima", 沖縄県: "okinawa",
};

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') inQuotes = !inQuotes;
    else if ((c === "," && !inQuotes) || c === "\r") {
      result.push(current.trim());
      current = "";
    } else current += c;
  }
  result.push(current.trim());
  return result;
}

function normalizeRomaji(s) {
  return s
    .toLowerCase()
    .replace(/ō/g, "o")
    .replace(/ū/g, "u")
    .replace(/ā/g, "a")
    .replace(/ī/g, "i")
    .replace(/ē/g, "e")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .replace(/^$/, "unknown");
}

async function main() {
  const csvPath = path.join(process.cwd(), "content", "area-data", "areas.csv");
  const raw = fs.readFileSync(csvPath, "utf-8");
  const lines = raw.split("\n").filter((l) => l.trim());
  const Kuroshiro = require("kuroshiro").default;
  const Analyzer = require("kuroshiro-analyzer-kuromoji");
  const kuroshiro = new Kuroshiro();
  await kuroshiro.init(new Analyzer());

  const out = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length < 2) continue;
    const prefecture = cols[0];
    const city = cols[1];
    const prefectureId = PREFECTURE_NAME_TO_ID[prefecture] || prefecture.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const cityNameBase = city.replace(/[市区町村]$/, "") || city;
    let cityId;
    try {
      const romaji = await kuroshiro.convert(cityNameBase, { to: "romaji", romajiSystem: "hepburn" });
      cityId = normalizeRomaji(romaji);
    } catch (_) {
      cityId = normalizeRomaji(cityNameBase) || "unknown";
    }
    if (!cityId) cityId = "unknown";
    out.push({ prefecture, city, prefectureId, cityId });
  }

  const keyCount = new Map();
  const dedup = out.map((row) => {
    const key = `${row.prefectureId}/${row.cityId}`;
    const n = (keyCount.get(key) || 0) + 1;
    keyCount.set(key, n);
    const cityId = n > 1 ? `${row.cityId}-${n}` : row.cityId;
    return { ...row, cityId };
  });

  const ts = `/** 自動生成: node scripts/generate-area-id-map.cjs で再生成 */
export interface AreaIdEntry {
  prefecture: string;
  city: string;
  prefectureId: string;
  cityId: string;
}

export const AREA_ID_MAP: AreaIdEntry[] = ${JSON.stringify(dedup, null, 2)};
`;

  const outPath = path.join(process.cwd(), "app", "lib", "area-id-map.generated.ts");
  fs.writeFileSync(outPath, ts, "utf-8");
  console.log("Wrote", outPath, "(", dedup.length, "entries )");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
