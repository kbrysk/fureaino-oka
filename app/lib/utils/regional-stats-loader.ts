/**
 * 地域統計CSVのサーバーサイド読み込み（Node.js fs/path 使用・クライアントでは実行不可）。
 * getRegionalStats(statsKey) で cityId（CSVの1列目＝prefId-cityId 形式）をキーに1件取得。
 */
import path from "path";
import fs from "fs";

export interface RegionalStatsRow {
  population: number;
  agingRate: number;
  landPrice: number;
}

let cachedMap: Map<string, RegionalStatsRow> | null = null;

function parseCsvSync(): Map<string, RegionalStatsRow> {
  if (cachedMap) return cachedMap;
  const filePath = path.join(process.cwd(), "content", "area-data", "regional-stats.csv");
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split(/\r?\n/).filter((line) => line.trim());
  const map = new Map<string, RegionalStatsRow>();
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim());
    if (cols.length >= 4) {
      const cityId = cols[0];
      const population = parseInt(cols[1], 10);
      const agingRate = parseFloat(cols[2]);
      const landPrice = parseInt(cols[3], 10);
      if (!Number.isNaN(population) && !Number.isNaN(agingRate) && !Number.isNaN(landPrice)) {
        map.set(cityId, { population, agingRate, landPrice });
      }
    }
  }
  cachedMap = map;
  return map;
}

/**
 * statsKey: CSVの cityId 列（例: tokyo-shinjuku = prefId + "-" + cityId）。
 * サーバーコンポーネントからのみ呼び出すこと。
 */
export function getRegionalStats(statsKey: string): RegionalStatsRow | null {
  const map = parseCsvSync();
  return map.get(statsKey) ?? null;
}

/** 全地域の統計をキー付きで取得（診断ツール等で利用）。サーバーコンポーネント専用。 */
export function getAllRegionalStats(): Record<string, RegionalStatsRow> {
  const map = parseCsvSync();
  return Object.fromEntries(map);
}
