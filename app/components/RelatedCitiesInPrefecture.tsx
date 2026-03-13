import Link from "next/link";
import { getCityPathsByPrefecture } from "../lib/utils/city-loader";

export type RelatedCitiesInPrefectureProps = {
  currentCity: string;
  prefecture: string;
  prefectureName: string;
  pageType: "subsidy" | "garbage" | "cost";
};

const PAGE_TYPE_TITLES: Record<RelatedCitiesInPrefectureProps["pageType"], string> = {
  subsidy: "の補助金情報",
  garbage: "の粗大ゴミ・遺品整理情報",
  cost: "の費用相場",
};

const PATH_PREFIX: Record<RelatedCitiesInPrefectureProps["pageType"], string> = {
  subsidy: "/subsidy",
  garbage: "/garbage",
  cost: "/cost",
};

/**
 * 同一都道府県内の他市区町村への内部リンクブロック。
 * 現在の市区町村を除き最大7件表示し、8件以上なら「全市区町村を見る」リンクを追加。
 */
export function RelatedCitiesInPrefecture({
  currentCity,
  prefecture,
  prefectureName,
  pageType,
}: RelatedCitiesInPrefectureProps) {
  const allCities = getCityPathsByPrefecture(prefecture);
  const others = allCities.filter((c) => c.cityId !== currentCity);
  const display = others.slice(0, 7);
  const hasMore = others.length > 7;
  const suffix = PATH_PREFIX[pageType];
  const title = `${prefectureName}${PAGE_TYPE_TITLES[pageType]}`;

  if (display.length === 0) return null;

  return (
    <section aria-labelledby="related-cities-in-pref-heading">
      <h2 id="related-cities-in-pref-heading" className="font-bold text-primary mb-4">
        {title}
      </h2>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 list-none p-0 m-0">
        {display.map((c) => (
          <li key={c.cityId}>
            <Link
              href={`/area/${prefecture}/${c.cityId}${suffix}`}
              className="block rounded-lg border border-border p-3 text-sm text-foreground hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
            >
              {c.cityName}
            </Link>
          </li>
        ))}
        {hasMore && (
          <li className="col-span-2 md:col-span-1 lg:col-span-1">
            <Link
              href={`/area/${prefecture}`}
              className="flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm font-medium text-primary hover:bg-primary/10 transition"
            >
              {prefectureName}の全市区町村を見る
              <span aria-hidden>→</span>
            </Link>
          </li>
        )}
      </ul>
    </section>
  );
}
