/**
 * /region/{都道府県}/{市区町村} → /area/{prefId}/{cityId} の 301 リダイレクト一覧を生成。
 * next.config の redirects() から利用。PDF 指示書「フェーズ 0 マッピング」「フェーズ 1」に準拠。
 */
import { getRegions } from "./regions";
import { getAreaIds } from "./area-data";
import { AREA_ID_MAP } from "./area-id-map.generated";
import municipalities from "./data/municipalities.json";

export interface RegionRedirectRule {
  source: string;
  destination: string;
  permanent: boolean;
}

/** 都道府県名（日本語）→ prefectureId のマップ（フォールバック用） */
function getPrefectureIdMap(): Map<string, string> {
  const m = new Map<string, string>();
  for (const e of AREA_ID_MAP) {
    if (!m.has(e.prefecture)) m.set(e.prefecture, e.prefectureId);
  }
  return m;
}

type MunicipalitySubsidy = {
  hasSubsidy: boolean | null;
};

type MunicipalityRow = {
  prefId: string;
  cityId: string;
  subsidy?: MunicipalitySubsidy;
};

const SUBSIDY_EXISTS_BY_AREA_KEY: Map<string, boolean> = (() => {
  const m = new Map<string, boolean>();
  for (const row of municipalities as unknown as MunicipalityRow[]) {
    const key = `${row.prefId}`.toLowerCase().trim() + "/" + `${row.cityId}`.toLowerCase().trim();
    m.set(key, row.subsidy?.hasSubsidy === true);
  }
  return m;
})();

/**
 * 全 /region/ 用 301 リダイレクトルールを生成する。
 * 優先順位：
 * 1) /area/{prefId}/{cityId}/subsidy が「補助金あり」なら subsidy へ
 * 2) subsidy がなければ 市区町村トップ /area/{prefId}/{cityId} へ
 * 3) 市区町村トップがない場合（AREA_ID_MAP にない）都道府県トップ /area/{prefId} へ
 * 4) それもない場合 /area へ
 */
export function getRegionRedirects(): RegionRedirectRule[] {
  const regions = getRegions();
  const prefIdMap = getPrefectureIdMap();
  const rules: RegionRedirectRule[] = [];

  for (const r of regions) {
    const areaIds = getAreaIds(r.prefecture, r.city);
    let destination: string;
    if (areaIds) {
      const subsidyKey = `${areaIds.prefectureId}/${areaIds.cityId}`.toLowerCase();
      const hasSubsidy = SUBSIDY_EXISTS_BY_AREA_KEY.get(subsidyKey) === true;
      destination = hasSubsidy
        ? `/area/${areaIds.prefectureId}/${areaIds.cityId}/subsidy`
        : `/area/${areaIds.prefectureId}/${areaIds.cityId}`;
    } else {
      const prefId = prefIdMap.get(r.prefecture);
      destination = prefId ? `/area/${prefId}` : "/area";
    }
    const encodedSegment = `/${encodeURIComponent(r.prefecture)}/${encodeURIComponent(r.city)}`;
    const rawSegment = `/${r.prefecture}/${r.city}`;
    const bases = [`/region${encodedSegment}`, `/region${rawSegment}`];
    for (const base of bases) {
      rules.push({ source: base, destination, permanent: true });
      rules.push({ source: `${base}/`, destination, permanent: true });
    }
  }

  return rules;
}
