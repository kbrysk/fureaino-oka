import { AREA_ID_MAP } from "../../../lib/area-id-map.generated";
import { getAllRegionalStats } from "../../../lib/utils/regional-stats-loader";
import OptimizerToolClient from "./OptimizerToolClient";
import { getCanonicalBase } from "../../../lib/site-url";
import { pageTitle } from "../../../lib/site-brand";

type SearchParamsRecord = { [key: string]: string | string[] | undefined };

interface Props {
  searchParams?: Promise<SearchParamsRecord>;
}

function buildOptimizerData() {
  const prefectureSet = new Map<string, string>();
  const citiesByPrefecture: Record<string, { cityId: string; cityName: string }[]> = {};
  for (const entry of AREA_ID_MAP) {
    if (!prefectureSet.has(entry.prefectureId)) {
      prefectureSet.set(entry.prefectureId, entry.prefecture);
    }
    if (!citiesByPrefecture[entry.prefectureId]) {
      citiesByPrefecture[entry.prefectureId] = [];
    }
    citiesByPrefecture[entry.prefectureId].push({ cityId: entry.cityId, cityName: entry.city });
  }
  const prefectures = Array.from(prefectureSet.entries()).map(([prefectureId, prefectureName]) => ({
    prefectureId,
    prefectureName,
  }));
  return { prefectures, citiesByPrefecture };
}

export const metadata = {
  title: pageTitle("実家じまい・資産防衛シミュレーター（30秒診断）"),
  description:
    "都道府県・市区町村を選んで、実家を放置した場合の年間損失額と10年後の消失資産を試算。家族会議用レポートで共有可能。",
  openGraph: {
    title: pageTitle("実家じまい・資産防衛シミュレーター（30秒診断）"),
    description:
      "都道府県・市区町村を選んで、実家を放置した場合の年間損失額と10年後の消失資産を試算。",
  },
};

export default async function OptimizerToolPage({ searchParams }: Props) {
  const resolved = (await searchParams) ?? {};
  const rawLayout = resolved.layout;
  const layoutStr = typeof rawLayout === "string" ? rawLayout : Array.isArray(rawLayout) ? rawLayout[0] : undefined;
  const validLayout =
    layoutStr && ["1K", "2DK", "3LDK", "4LDK+"].includes(layoutStr)
      ? (layoutStr as "1K" | "2DK" | "3LDK" | "4LDK+")
      : undefined;

  const { prefectures, citiesByPrefecture } = buildOptimizerData();
  const statsMap = getAllRegionalStats();

  const base = getCanonicalBase();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "実家じまい・資産防衛シミュレーター（30秒診断）",
    description:
      "都道府県・市区町村を選んで、実家を放置した場合の年間損失額と10年後の消失資産を試算。家族会議用レポートで共有可能。",
    applicationCategory: "FinanceApplication",
    url: `${base}/tool/optimizer`,
  };

  return (
    <div className="space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div>
        <h1 className="text-2xl font-bold text-primary">実家じまい・資産防衛シミュレーター</h1>
        <p className="text-foreground/80 mt-1">
          地域を選ぶと地価に基づいたより精緻な試算が表示されます。間取り・荷物量・建物条件で費用と放置リスクをシミュレーションできます。
        </p>
      </div>
      <OptimizerToolClient
        prefectures={prefectures}
        citiesByPrefecture={citiesByPrefecture}
        statsMap={statsMap}
        initialLayout={validLayout}
      />
    </div>
  );
}
