/**
 * /area/[prefecture]/[city]/cleanup に対応しうる全組み合わせの prefId/cityId を列挙する。
 * データ: getAllCityPaths() = app/lib/area-id-map.generated.ts（AREA_ID_MAP）
 *
 * 実行: npx tsx scripts/list-cleanup-area-keys.ts
 */
import { getAllCityPaths } from "../app/lib/utils/city-loader";

const rows = getAllCityPaths().map((p) => `"${p.prefId}/${p.cityId}",`);
console.log(rows.join("\n"));
console.error(`// total: ${rows.length}`);
