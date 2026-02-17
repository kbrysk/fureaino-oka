/**
 * 地域別ページ用：都道府県・市区町村の「日本語名」と「ローマ字ID」のマスタ
 * URL は /area/{prefectureId}/{cityId} 形式（例: /area/iwate/kitakami）で SEO・ユーザビリティ向上
 */

/** 市区町村：ローマ字ID と 日本語名 */
export interface CityRow {
  /** URL用ローマ字ID（小文字・ハイフン可） */
  id: string;
  /** 表示用日本語名（例: 北上市） */
  name: string;
}

/** 都道府県：ローマ字ID と 日本語名 と 市区町村リスト */
export interface PrefectureRow {
  /** URL用ローマ字ID（小文字・ハイフン可） */
  id: string;
  /** 表示用日本語名（例: 岩手県） */
  name: string;
  /** 当該都道府県に属する市区町村 */
  cities: CityRow[];
}

/**
 * 都道府県マスタ（日本語名 ⇔ ローマ字ID）
 * 他地域は後から追加する
 */
export const PREFECTURES: PrefectureRow[] = [
  {
    id: "iwate",
    name: "岩手県",
    cities: [
      { id: "kitakami", name: "北上市" },
      // 他市区町村は後で追加
    ],
  },
  // 他都道府県は後で追加
];

/** 都道府県IDの型（存在する id のみ許可したい場合は as const と組み合わせ） */
export type PrefectureId = (typeof PREFECTURES)[number]["id"];

/** 市区町村IDの型（全都道府県の全 cities[].id のユニオンは後段で生成可能） */
export type CityId = string;
