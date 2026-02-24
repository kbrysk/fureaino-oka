import Link from "next/link";
import { getAllCityPaths } from "../lib/utils/city-loader";

/** 同県内の近隣エリア内部リンク数（リンクスパム防止のため20未満） */
const MAX_RELATED = 12;

interface RelatedAreasProps {
  currentPrefId: string;
  currentCityId: string;
  prefName: string;
}

/**
 * 同県内の他市区町村への内部リンクブロック（孤立ページ防止・トピッククラスター）。
 * city-loader の getAllCityPaths() のみ使用し、ビルド負荷を抑える。
 */
export default function RelatedAreas({
  currentPrefId,
  currentCityId,
  prefName,
}: RelatedAreasProps) {
  const all = getAllCityPaths();
  const samePref = all.filter(
    (p) => p.prefId === currentPrefId && p.cityId !== currentCityId
  );
  const related = samePref.slice(0, MAX_RELATED);

  if (related.length === 0) return null;

  return (
    <section
      className="bg-card rounded-2xl border border-border overflow-hidden"
      aria-labelledby="related-areas-heading"
    >
      <div className="px-5 py-4 border-b border-border bg-primary-light/30">
        <h3 id="related-areas-heading" className="font-bold text-primary text-base">
          {prefName}の近隣エリアから実家じまい・空き家情報を探す
        </h3>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {related.map(({ prefId, cityId, cityName }) => (
            <Link
              key={`${prefId}-${cityId}`}
              href={`/area/${prefId}/${cityId}`}
              className="inline-block px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 bg-muted/50 border border-border hover:bg-primary-light hover:text-primary hover:border-primary/30 transition"
            >
              {cityName}の空き家・実家整理
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
