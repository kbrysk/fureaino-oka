/**
 * 地域別ページ用の独自データ型（Thin Content 脱却・オリジナルコンテンツ化）
 * 各地域固有の補助金・粗大ゴミ・モグ隊長コラムを格納する。
 * データ本体は municipalities.json（scripts/manage-data.mjs merge で更新）。
 */

import storeData from "./municipalities.json";

export interface MunicipalityData {
  prefId: string;
  cityId: string;
  prefName: string;
  cityName: string;
  mascot: {
    localRiskText: string;
  };
  subsidy: {
    hasSubsidy: boolean;
    name?: string;
    maxAmount?: string;
    conditions?: string;
    officialUrl?: string;
  };
  garbage: {
    officialUrl: string;
    phone?: string;
  };
}

const MUNICIPALITY_STORE: MunicipalityData[] = storeData as MunicipalityData[];

/**
 * prefId と cityId から地域データを取得する。
 * データが存在しない場合は null を返す（非同期で将来 API 化しやすい形）。
 */
export async function getMunicipalityData(
  prefId: string,
  cityId: string
): Promise<MunicipalityData | null> {
  const normalized = { pref: prefId.toLowerCase().trim(), city: cityId.toLowerCase().trim() };
  const found = MUNICIPALITY_STORE.find(
    (m) => m.prefId.toLowerCase() === normalized.pref && m.cityId.toLowerCase() === normalized.city
  );
  return found ?? null;
}

/** 公式窓口誘導用の固定デフォルト。データなし時（1000自治体規模で未登録地域）に即返す。 */
const DEFAULT_MUNICIPALITY_TEMPLATE = {
  mascot: {
    localRiskText:
      "お住まいの地域の補助金・粗大ゴミの出し方は自治体の公式サイトでご確認ください。無料査定で資産価値の目安も把握できます。",
  },
  subsidy: { hasSubsidy: false as const },
  garbage: {
    officialUrl: "https://www.google.com/search?q=空き家補助金+公式サイト",
  },
};

export type MunicipalityDataOrDefault = MunicipalityData & { _isDefault?: boolean };

/**
 * データがなければ即座に標準オブジェクトを返すラッパー。
 * 呼び出し側は _isDefault でフォールバック表示を判定する。
 */
export async function getMunicipalityDataOrDefault(
  prefId: string,
  cityId: string,
  fallback: { prefName: string; cityName: string }
): Promise<MunicipalityDataOrDefault> {
  const data = await getMunicipalityData(prefId, cityId);
  if (data) return data;
  return {
    prefId,
    cityId,
    prefName: fallback.prefName,
    cityName: fallback.cityName,
    ...DEFAULT_MUNICIPALITY_TEMPLATE,
    garbage: {
      ...DEFAULT_MUNICIPALITY_TEMPLATE.garbage,
      officialUrl: `https://www.google.com/search?q=${encodeURIComponent(fallback.prefName + " " + fallback.cityName + " 空き家補助金 公式サイト")}`,
    },
    _isDefault: true,
  };
}

/** データが存在する地域のスラッグ一覧（generateStaticParams 用） */
export function getMunicipalitySlugs(): { prefecture: string; city: string }[] {
  return MUNICIPALITY_STORE.map((m) => ({ prefecture: m.prefId, city: m.cityId }));
}

/** 同一都道府県内の市区町村一覧（近隣リンク・回遊用） */
export function getMunicipalitiesByPrefecture(prefId: string): MunicipalityData[] {
  const normalized = prefId.toLowerCase().trim();
  return MUNICIPALITY_STORE.filter((m) => m.prefId.toLowerCase() === normalized);
}
