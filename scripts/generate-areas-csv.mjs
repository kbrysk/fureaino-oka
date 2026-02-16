/**
 * 全国市区町村CSV生成
 * - 既存の areas.csv の行（東京23区など実データ）を維持
 * - municipalities-nationwide.json の市区町村をマージ（プレースホルダーURL/電話）
 * 実行: node scripts/generate-areas-csv.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = path.join(process.cwd());
const CSV_PATH = path.join(ROOT, "content", "area-data", "areas.csv");
const JSON_PATH = path.join(ROOT, "content", "area-data", "municipalities-nationwide.json");

function escapeCsv(s) {
  if (s == null || s === "") return "";
  const t = String(s);
  if (/[",\r\n]/.test(t)) return `"${t.replace(/"/g, '""')}"`;
  return t;
}

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

function parseExistingCsv(content) {
  const lines = content.split("\n").filter((l) => l.trim());
  const header = lines[0];
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length >= 5) {
      rows.push({
        prefecture: cols[0],
        city: cols[1],
        bulkyWasteUrl: cols[2],
        cleanCenterPhone: cols[3],
        estateCleanupNote: cols[4],
        subsidyNote: cols[5]?.trim() || "",
        cleanupPriceNote: cols[6]?.trim() || "",
      });
    }
  }
  return { header, rows };
}

function buildPlaceholderUrl(prefecture, city) {
  const q = encodeURIComponent(`${prefecture} ${city} 粗大ゴミ 申し込み`);
  return `https://www.google.com/search?q=${q}`;
}

function main() {
  const existing = fs.readFileSync(CSV_PATH, "utf-8");
  const { header, rows: existingRows } = parseExistingCsv(existing);
  const keySet = new Set(existingRows.map((r) => `${r.prefecture}\t${r.city}`));

  const raw = fs.readFileSync(JSON_PATH, "utf-8");
  const data = JSON.parse(raw);
  const prefectures = data.prefectures || data;

  for (const [prefecture, cities] of Object.entries(prefectures)) {
    if (!Array.isArray(cities)) continue;
    for (const city of cities) {
      const key = `${prefecture}\t${city}`;
      if (keySet.has(key)) continue;
      keySet.add(key);
      existingRows.push({
        prefecture,
        city,
        bulkyWasteUrl: buildPlaceholderUrl(prefecture, city),
        cleanCenterPhone: "要確認",
        estateCleanupNote: "提携業者に無料相談",
        subsidyNote: "",
        cleanupPriceNote: "",
      });
    }
  }

  const out = [
    header,
    ...existingRows.map((r) =>
      [
        r.prefecture,
        r.city,
        r.bulkyWasteUrl,
        r.cleanCenterPhone,
        r.estateCleanupNote,
        r.subsidyNote ? escapeCsv(r.subsidyNote) : "",
        r.cleanupPriceNote ? escapeCsv(r.cleanupPriceNote) : "",
      ].join(",")
    ),
  ].join("\n");

  fs.writeFileSync(CSV_PATH, out, "utf-8");
  console.log(`Wrote ${CSV_PATH}: ${existingRows.length} rows total.`);
}

main();
