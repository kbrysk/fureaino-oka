/**
 * data/area-contents に存在する JSON に対応する [prefecture, city] パス一覧。
 * 補助金LP（/area/[prefecture]/[city]/subsidy）の generateStaticParams で 176 都市分を静的生成するために使用。
 */
import fs from "fs";
import path from "path";

const AREA_CONTENTS_DIR = path.join(process.cwd(), "data", "area-contents");

export interface AreaContentsPath {
  prefecture: string;
  city: string;
}

/**
 * data/area-contents 内の全 JSON ファイルから (prefectureId, cityId) のリストを返す。
 * ビルド時に同期で実行（generateStaticParams から利用）。
 */
export function getAreaContentsStaticParams(): AreaContentsPath[] {
  if (!fs.existsSync(AREA_CONTENTS_DIR)) return [];
  const prefs = fs.readdirSync(AREA_CONTENTS_DIR, { withFileTypes: true });
  const result: AreaContentsPath[] = [];
  for (const pref of prefs) {
    if (!pref.isDirectory()) continue;
    const prefPath = path.join(AREA_CONTENTS_DIR, pref.name);
    const files = fs.readdirSync(prefPath);
    for (const file of files) {
      if (file.endsWith(".json")) {
        result.push({
          prefecture: pref.name,
          city: file.replace(/\.json$/, ""),
        });
      }
    }
  }
  return result;
}
