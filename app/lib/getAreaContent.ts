import fs from "fs";
import path from "path";
import type { AreaContentData } from "@/types/areaContent";

/**
 * 指定した都道府県・市区町村の地域コンテンツJSONを読み込む。
 * パス: data/area-contents/[pref]/[city].json
 * @param pref 都道府県ID（例: 'hiroshima'）
 * @param city 市区町村ID（例: 'edajima'）
 * @returns AreaContentData または ファイルが存在しない場合 null
 */
export async function getAreaContent(
  pref: string,
  city: string
): Promise<AreaContentData | null> {
  try {
    const filePath = path.join(process.cwd(), "data", "area-contents", pref, `${city}.json`);
    const raw = await fs.promises.readFile(filePath, "utf-8");
    const data = JSON.parse(raw) as AreaContentData;
    return data;
  } catch {
    return null;
  }
}
