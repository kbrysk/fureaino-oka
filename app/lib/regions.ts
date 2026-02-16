/**
 * Programmatic SEO: 全国市区町村データ（粗大ゴミ・遺品整理ページ用）
 * CSV/JSON ローダー。必須: city_name, garbage_center_phone（非表示用）, subsidy_amount, population（任意）
 */

import path from "path";
import fs from "fs";

export interface Region {
  /** 表示用市区町村名（都道府県+市区町村） */
  city_name: string;
  prefecture: string;
  city: string;
  /** 粗大ゴミ窓口電話（非表示＝アコーディオン内に格納） */
  garbage_center_phone: string;
  /** 補助金有無（"あり" | "なし" または金額メモ） */
  subsidy_amount: string;
  /** 人口（任意。CSVに列があれば使用） */
  population?: number;
  bulkyWasteUrl?: string;
  estateCleanupNote?: string;
  subsidyNote?: string;
}

let cached: Region[] | null = null;

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

/**
 * 全国市区町村データを読み込む（content/area-data/areas.csv を利用）
 */
export function getRegions(): Region[] {
  if (cached) return cached;
  const filePath = path.join(process.cwd(), "content", "area-data", "areas.csv");
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split("\n").filter((l) => l.trim());
  const rows: Region[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length >= 5) {
      const prefecture = cols[0];
      const city = cols[1];
      const subsidyNote = cols[5]?.trim() || undefined;
      const population = cols[7]?.trim() ? parseInt(cols[7], 10) : undefined;
      rows.push({
        city_name: `${prefecture}${city}`,
        prefecture,
        city,
        garbage_center_phone: cols[3]?.trim() || "",
        subsidy_amount: subsidyNote ? "あり" : "なし",
        population: Number.isNaN(population) ? undefined : population,
        bulkyWasteUrl: cols[2]?.trim() || undefined,
        estateCleanupNote: cols[4]?.trim() || undefined,
        subsidyNote,
      });
    }
  }
  cached = rows;
  return rows;
}

/**
 * slug 配列で地域を取得。[都道府県, 市区町村] または [市区町村] で検索
 */
export function getRegionBySlug(slug: string[]): Region | null {
  const regions = getRegions();
  if (slug.length >= 2) {
    const prefecture = decodeURIComponent(slug[0]);
    const city = decodeURIComponent(slug[1]);
    return regions.find((r) => r.prefecture === prefecture && r.city === city) ?? null;
  }
  if (slug.length === 1) {
    const city = decodeURIComponent(slug[0]);
    return regions.find((r) => r.city === city || r.city_name === city) ?? null;
  }
  return null;
}

/**
 * generateStaticParams 用: 全地域の slug 配列
 */
export function getRegionSlugs(): { slug: string[] }[] {
  return getRegions().map((r) => ({ slug: [r.prefecture, r.city] }));
}

/**
 * 近隣の市区町村（同都道府県内の他市区町村）を最大 limit 件返す。内部リンク用
 */
export function getNeighborRegions(region: Region, limit: number = 10): Region[] {
  const all = getRegions();
  const samePref = all.filter(
    (r) => r.prefecture === region.prefecture && (r.city !== region.city || r.city_name !== region.city_name)
  );
  return samePref.slice(0, limit);
}
