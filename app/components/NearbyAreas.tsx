import Link from "next/link";
import { AREA_ID_MAP } from "../lib/area-id-map.generated";

/** 同一都道府県内の他自治体を最大で表示する件数（リンクスパム回避） */
const MAX_NEARBY_AREAS = 12;

export interface NearbyAreasProps {
  /** 現在の都道府県ID（例: tokyo） */
  currentPrefecture: string;
  /** 現在の市区町村ID（例: setagaya） */
  currentCity: string;
}

/**
 * 同一都道府県内の他エリアへの動的クロスリンク（近隣エリア）。
 * サーバーコンポーネントとして初期HTMLに含め、クローラーのクロールバジェットと回遊性を最大化する。
 */
export default function NearbyAreas({ currentPrefecture, currentCity }: NearbyAreasProps) {
  const prefIdNorm = currentPrefecture.toLowerCase().trim();
  const cityIdNorm = currentCity.toLowerCase().trim();

  const samePrefecture = AREA_ID_MAP.filter(
    (e) => e.prefectureId.toLowerCase() === prefIdNorm && e.cityId.toLowerCase() !== cityIdNorm
  );

  if (samePrefecture.length === 0) return null;

  const sorted = [...samePrefecture].sort((a, b) => a.cityId.localeCompare(b.cityId));
  const toShow = sorted.slice(0, MAX_NEARBY_AREAS);
  const prefectureName = samePrefecture[0]?.prefecture ?? currentPrefecture;

  return (
    <section
      className="rounded-2xl border border-border bg-card p-5 sm:p-6"
      aria-labelledby="nearby-areas-heading"
    >
      <h2 id="nearby-areas-heading" className="text-lg font-bold text-primary mb-4">
        {prefectureName}のその他のエリアで実家じまい・資産防衛を診断する
      </h2>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {toShow.map((entry) => (
          <Link
            key={entry.cityId}
            href={`/area/${entry.prefectureId}/${entry.cityId}`}
            className="inline-flex items-center rounded-full bg-primary-light/40 text-primary px-4 py-2 text-sm font-medium hover:bg-primary-light hover:text-primary border border-primary/20 transition"
            title={`${entry.city}の実家じまい・費用相場`}
          >
            {entry.city}の実家じまい・費用相場
          </Link>
        ))}
      </div>
    </section>
  );
}
