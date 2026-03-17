import Link from "next/link";
import { getAreaById, getAreaIds } from "../../../../lib/area-data";
import { getSampleCityPaths } from "../../../../lib/utils/city-loader";

export const dynamicParams = true;
export const revalidate = 86400;
import { getMunicipalityDataOrDefault } from "../../../../lib/data/municipalities";
import AreaBreadcrumbs from "../../../../components/AreaBreadcrumbs";
import SpokeInternalLinks from "../../../../components/SpokeInternalLinks";
import OperatorTrustBlock from "../../../../components/OperatorTrustBlock";
import JikkaOptimizer from "../../../../components/JikkaOptimizer";
import { getRegionalStats } from "../../../../lib/utils/regional-stats-loader";
import { pageTitle } from "../../../../lib/site-brand";
import { getCanonicalUrl, getCanonicalBase } from "../../../../lib/site-url";
// S1: _isDefaultページ CTR改善 メタ修正 2026-03（Search Console CTR=0.1%改善・全ページ共通）
import { generateBreadcrumbSchema } from "../../../../lib/schema/breadcrumb";
import { generateLocalBusinessSchema } from "../../../../lib/schema/local-business";
import JsonLd from "../../../../components/JsonLd";
import { CostBreakdownTable } from "../../../../components/CostBreakdownTable";
// S2: costページ 解体費用テーブル・FAQスキーマ追加（CTR改善・AI Overview対策）2026-03

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
  const currentYear = new Date().getFullYear();
  const canonicalUrl = getCanonicalUrl(`/area/${prefecture}/${city}/cost`);
  const title = `${data.cityName}の解体費用相場【${currentYear}年最新】坪単価・構造別・補助金込みで解説`;
  const description = `${data.cityName}の実家じまい・空き家解体にかかる費用の目安を間取り別（1K〜4LDK以上）で掲載。解体補助金を使えばさらに費用を抑えられます。無料で相場を確認できます。`;
  const fullTitle = pageTitle(title.length > 50 ? title.slice(0, 49) + "…" : title);
  return {
    title: fullTitle,
    description: description.length > 120 ? description.slice(0, 119) + "…" : description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: fullTitle,
      description: description.length > 120 ? description.slice(0, 119) + "…" : description,
      url: canonicalUrl,
    },
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
  const base = getCanonicalBase();
  const prefName = data.prefName;
  const breadcrumb = generateBreadcrumbSchema([
    { name: "ホーム", url: `${base}/` },
    { name: "地域一覧", url: `${base}/area` },
    { name: prefName, url: `${base}/area/${prefecture}` },
    { name: cityName, url: `${base}/area/${prefecture}/${city}` },
    { name: `${cityName}の費用相場`, url: `${base}/area/${prefecture}/${city}/cost` },
  ]);
  const localBizSchema = generateLocalBusinessSchema({
    cityName,
    prefectureName: prefName,
    prefecture,
    city,
    pageType: "cost",
  });

  const costFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `${cityName}で実家の解体にはいくらかかりますか？`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${cityName}の木造住宅の解体費用は30〜40坪で90〜150万円が目安です。解体補助金を活用することで費用を大幅に抑えられる場合があります。まずは無料見積もりで確認することをお勧めします。`,
        },
      },
      {
        "@type": "Question",
        name: `${cityName}で遺品整理・実家片付けにはいくらかかりますか？`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${cityName}の遺品整理費用は間取りによって異なり、1Kで3〜8万円、3LDK以上で25万円〜が目安です。荷物の量や種類によって変動するため、複数業者から無料見積もりを取ることをお勧めします。`,
        },
      },
    ],
  };

  return (
    <div className="space-y-8">
      <JsonLd data={breadcrumb} />
      <JsonLd data={localBizSchema} />
      <JsonLd data={costFaqSchema} />
      <AreaBreadcrumbs prefecture={data.prefName} city={data.cityName} prefectureId={data.prefId} cityId={data.cityId} page="cost" />
      <div>
        <h1 className="text-2xl font-bold text-primary">
          {cityName}の実家じまい・解体費用相場シミュレーション
        </h1>
        <p className="text-foreground/60 mt-1">
          間取り・荷物量・建物条件で費用と放置リスクを試算します。
        </p>
      </div>

      <CostBreakdownTable cityName={cityName} />

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
      <OperatorTrustBlock />
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
