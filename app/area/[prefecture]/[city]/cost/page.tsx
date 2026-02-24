import Link from "next/link";
import { getAreaById, getAreaIds } from "../../../../lib/area-data";
import { getSampleCityPaths } from "../../../../lib/utils/city-loader";

export const dynamicParams = true;
export const revalidate = 86400;
import { getMunicipalityDataOrDefault } from "../../../../lib/data/municipalities";
import AreaBreadcrumbs from "../../../../components/AreaBreadcrumbs";
import SpokeInternalLinks from "../../../../components/SpokeInternalLinks";
import JikkaOptimizer from "../../../../components/JikkaOptimizer";
import { getRegionalStats } from "../../../../lib/utils/regional-stats-loader";
import { pageTitle } from "../../../../lib/site-brand";

interface Props {
  params: Promise<{ prefecture: string; city: string }>;
}

export async function generateStaticParams() {
  return getSampleCityPaths().map(({ prefId, cityId }) => ({
    prefecture: prefId,
    city: cityId,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { prefecture, city } = await params;
  const area = getAreaById(prefecture, city);
  const fallbackNames = { prefName: area?.prefecture ?? prefecture, cityName: area?.city ?? city };
  const data = await getMunicipalityDataOrDefault(prefecture, city, fallbackNames);
  if (!area) return { title: pageTitle("費用相場") };
  return {
    title: pageTitle(`${data.cityName}の実家じまい・解体費用相場シミュレーション`),
    description: `${data.prefName}${data.cityName}の実家じまい・空き家解体の費用相場を間取り・荷物量でシミュレーション。無料診断で資産価値の目安を把握。`,
  };
}

export default async function AreaCostPage({ params }: Props) {
  const { prefecture, city } = await params;
  const area = getAreaById(prefecture, city);
  const fallbackNames = { prefName: area?.prefecture ?? prefecture, cityName: area?.city ?? city };
  const data = await getMunicipalityDataOrDefault(prefecture, city, fallbackNames);
  const ids = area ? getAreaIds(area.prefecture, area.city)! : { prefectureId: prefecture, cityId: city };
  const regionalStats = getRegionalStats(`${prefecture}-${city}`);
  const cityName = area?.city ?? data.cityName;
  const cityId = ids.cityId;

  return (
    <div className="space-y-8">
      <AreaBreadcrumbs prefecture={data.prefName} city={data.cityName} prefectureId={data.prefId} cityId={data.cityId} page="cost" />
      <div>
        <h1 className="text-2xl font-bold text-primary">
          {cityName}の実家じまい・解体費用相場シミュレーション
        </h1>
        <p className="text-foreground/60 mt-1">
          間取り・荷物量・建物条件で費用と放置リスクを試算します。
        </p>
      </div>

      <section aria-labelledby="cost-simulator-heading">
        <h2 id="cost-simulator-heading" className="sr-only">
          {cityName}の費用シミュレーター
        </h2>
        <JikkaOptimizer
          cityName={cityName}
          cityId={cityId}
          regionalStats={regionalStats}
          titleVariant="area"
          ctaHref={`/area/${prefecture}/${city}#appraisal-section`}
          ctaLabel={`${cityName}の無料査定・相場確認へ進む 👉`}
        />
      </section>

      <SpokeInternalLinks
        prefId={ids.prefectureId}
        cityId={ids.cityId}
        prefName={data.prefName}
        cityName={cityName}
        currentSpoke="cost"
      />

      <div className="flex flex-wrap gap-3">
        <Link href="/area" className="inline-block text-foreground/60 text-sm hover:text-primary hover:underline">
          ← 地域一覧（全国）へ
        </Link>
        <Link href={`/area/${ids.prefectureId}/${ids.cityId}`} className="inline-block text-primary font-medium hover:underline">
          ← {cityName}の総合ガイドへ
        </Link>
      </div>

      <footer className="pt-8 mt-8 border-t border-border text-sm text-foreground/60">
        <p className="font-medium text-foreground/80 mb-1">監修</p>
        <p>整理収納・生前整理に関する記載は整理収納アドバイザー／税理士の監修を受けております。</p>
      </footer>
    </div>
  );
}
