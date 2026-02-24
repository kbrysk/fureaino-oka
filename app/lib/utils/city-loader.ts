/**
 * 静的生成用：マスターリスト（area-id-map）のみ参照する軽量ローダー。
 * municipalities.json は読まないため generateStaticParams を高速化する。
 */
import { AREA_ID_MAP } from "../area-id-map.generated";

export interface CityPath {
  prefId: string;
  cityId: string;
  cityName: string;
}

/** 全市区町村の prefId, cityId, cityName を返す。sitemap 等の全件列挙用。 */
export function getAllCityPaths(): CityPath[] {
  return AREA_ID_MAP.map((e) => ({
    prefId: e.prefectureId,
    cityId: e.cityId,
    cityName: e.city,
  }));
}

/** ISR用：代表都市のみ（10〜20件）。generateStaticParams でビルド負荷を抑える。 */
const SAMPLE_SIZE = 15;

export function getSampleCityPaths(): CityPath[] {
  return AREA_ID_MAP.slice(0, SAMPLE_SIZE).map((e) => ({
    prefId: e.prefectureId,
    cityId: e.cityId,
    cityName: e.city,
  }));
}

/** 全国の都道府県ID（prefId）のユニークリスト。sitemap 分割用。 */
export function getPrefectureIds(): string[] {
  const prefIds = AREA_ID_MAP.map((e) => e.prefectureId);
  return Array.from(new Set(prefIds));
}

/** 指定都道府県に属する市区町村パスのみ。sitemap(prefId) 用。 */
export function getCityPathsByPrefecture(prefId: string): CityPath[] {
  return AREA_ID_MAP.filter((e) => e.prefectureId === prefId).map((e) => ({
    prefId: e.prefectureId,
    cityId: e.cityId,
    cityName: e.city,
  }));
}
