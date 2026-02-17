import path from "path";
import fs from "fs";
import { AREA_ID_MAP } from "./area-id-map.generated";

export interface AreaRow {
  prefecture: string;
  city: string;
  bulkyWasteUrl: string;
  cleanCenterPhone: string;
  estateCleanupNote: string;
  /** 空き家解体・特例・補助金の備考（pSEO: 地域×補助金） */
  subsidyNote?: string;
  /** 遺品整理・片付け相場の備考（pSEO: 地域×相場） */
  cleanupPriceNote?: string;
}

let cached: AreaRow[] | null = null;

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if ((c === "," && !inQuotes) || c === "\r") {
      result.push(current.trim());
      current = "";
    } else {
      current += c;
    }
  }
  result.push(current.trim());
  return result;
}

export function getAreaData(): AreaRow[] {
  if (cached) return cached;
  const filePath = path.join(process.cwd(), "content", "area-data", "areas.csv");
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split("\n").filter((l) => l.trim());
  const header = lines[0];
  const rows: AreaRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length >= 5) {
      rows.push({
        prefecture: cols[0],
        city: cols[1],
        bulkyWasteUrl: cols[2],
        cleanCenterPhone: cols[3],
        estateCleanupNote: cols[4],
        subsidyNote: cols[5]?.trim() || undefined,
        cleanupPriceNote: cols[6]?.trim() || undefined,
      });
    }
  }
  cached = rows;
  return rows;
}

export function getAreaBySlug(prefecture: string, city: string): AreaRow | null {
  const decodedP = decodeURIComponent(prefecture);
  const decodedC = decodeURIComponent(city);
  const data = getAreaData();
  return data.find((r) => r.prefecture === decodedP && r.city === decodedC)
    ?? data.find((r) => r.prefecture === prefecture && r.city === city)
    ?? null;
}

export function getAreaSlugs(): { prefecture: string; city: string }[] {
  return getAreaData().map((r) => ({ prefecture: r.prefecture, city: r.city }));
}

/** URL用ローマ字IDのスラッグ一覧（/area/{prefectureId}/{cityId} 用） */
export function getAreaIdSlugs(): { prefectureId: string; cityId: string }[] {
  return AREA_ID_MAP.map((e) => ({ prefectureId: e.prefectureId, cityId: e.cityId }));
}

/** 日本語名からURL用IDを取得 */
export function getAreaIds(prefecture: string, city: string): { prefectureId: string; cityId: string } | null {
  const entry = AREA_ID_MAP.find((e) => e.prefecture === prefecture && e.city === city);
  return entry ? { prefectureId: entry.prefectureId, cityId: entry.cityId } : null;
}

/** URL用IDから地域データを取得（ローマ字URL用） */
export function getAreaById(prefectureId: string, cityId: string): AreaRow | null {
  const entry = AREA_ID_MAP.find(
    (e) => e.prefectureId === prefectureId && e.cityId === cityId
  );
  if (!entry) return null;
  return getAreaBySlug(entry.prefecture, entry.city);
}
