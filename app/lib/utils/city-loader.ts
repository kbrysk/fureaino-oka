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

/** 全市区町村の prefId, cityId, cityName を返す。generateStaticParams 専用。 */
export function getAllCityPaths(): CityPath[] {
  return AREA_ID_MAP.map((e) => ({
    prefId: e.prefectureId,
    cityId: e.cityId,
    cityName: e.city,
  }));
}
