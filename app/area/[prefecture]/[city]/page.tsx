// import { notFound } from "next/navigation";
import Link from "next/link";
import { getAreaById, getAreaIds } from "../../../lib/area-data";
import { getSampleCityPaths } from "../../../lib/utils/city-loader";

export const dynamicParams = true;
export const revalidate = 86400;
import { getMunicipalityDataOrDefault, getMunicipalitiesByPrefecture } from "../../../lib/data/municipalities";
import { getRegionBySlug } from "../../../lib/regions";
import { getAreaSeizenseiriColumn, getAreaOwlColumn } from "../../../lib/area-column";
import AreaBreadcrumbs from "../../../components/AreaBreadcrumbs";
import AreaOwlBlock from "../../../components/AreaOwlBlock";
import AreaBulkyWasteLink from "../../../components/AreaBulkyWasteLink";
import CleanupAffiliateCard from "../../../components/CleanupAffiliateCard";
import RealEstateAppraisalCard from "../../../components/RealEstateAppraisalCard";
import MascotAdviceBlock from "../../../components/MascotAdviceBlock";
import LocalConsultationCard from "../../../components/LocalConsultationCard";
import NearbySubsidyLinks from "../../../components/NearbySubsidyLinks";
import AreaDirectoryFallback from "../../../components/AreaDirectoryFallback";
import DynamicFaq from "../../../components/DynamicFaq";
import BreadcrumbJsonLd from "../../../components/BreadcrumbJsonLd";
import RelatedAreas from "../../../components/RelatedAreas";
import NearbyAreas from "../../../components/NearbyAreas";
import DynamicCaseStudy from "../../../components/DynamicCaseStudy";
import RegionalFacts from "../../../components/RegionalFacts";
import LocalSubsidyFaq from "../../../components/LocalSubsidyFaq";
import InheritanceRouting from "../../../components/InheritanceRouting";
import SituationGuide from "../../../components/SituationGuide";
import JikkaOptimizer from "../../../components/JikkaOptimizer";
import AreaBodyMeta from "../../../components/AreaBodyMeta";
import OperatorTrustBlock from "../../../components/OperatorTrustBlock";
import { getRegionalStats } from "../../../lib/utils/regional-stats-loader";
import { getCanonicalBase } from "../../../lib/site-url";
import { pageTitle } from "../../../lib/site-brand";

type SearchParamsRecord = { [key: string]: string | string[] | undefined };

interface Props {
  params: Promise<{ prefecture: string; city: string }>;
  searchParams?: Promise<SearchParamsRecord>;
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
  if (!area) return { title: pageTitle("地域情報") };
  if (data._isDefault) {
    return {
      title: pageTitle(`${data.cityName}の実家じまい・空き家対策 総合ガイド`),
      description: `${data.cityName}で空き家整理や売却を検討中の方へ。自治体の窓口情報や、相続時に役立つ3,000万円控除の特例、おすすめの査定サービスをまとめています。`,
    };
  }
  return {
    title: pageTitle(`${data.cityName}の実家じまい・空き家対策 総合ガイド`),
    description: `${data.prefName}${data.cityName}の粗大ゴミ申し込み・遺品整理・補助金の相談先。無料見積もりで比較。`,
  };
}

export default async function AreaPage({ params, searchParams }: Props) {
  const { prefecture, city } = await params;
  const resolvedSearchParams: SearchParamsRecord = (await searchParams) ?? {};
  const rawLayout = resolvedSearchParams.layout;
  const layoutStr = typeof rawLayout === "string" ? rawLayout : Array.isArray(rawLayout) ? rawLayout[0] : undefined;
  const validLayout = layoutStr && ["1K", "2DK", "3LDK", "4LDK+"].includes(layoutStr) ? (layoutStr as "1K" | "2DK" | "3LDK" | "4LDK+") : undefined;
  const area = getAreaById(prefecture, city);
  // if (!area) notFound();
  const fallbackNames = { prefName: area?.prefecture ?? prefecture, cityName: area?.city ?? city };
  const ids = area ? getAreaIds(area.prefecture, area.city)! : { prefectureId: prefecture, cityId: city };
  const region = area ? getRegionBySlug([area.prefecture, area.city]) : null;
  const data = await getMunicipalityDataOrDefault(prefecture, city, fallbackNames);

  const showFallback = !area || data._isDefault;
  const base = getCanonicalBase();
  const breadcrumbItems = [
    { name: "ホーム", item: `${base}/` },
    { name: data.prefName, item: `${base}/area#${prefecture}` },
    { name: data.cityName, item: `${base}/area/${prefecture}/${city}` },
  ];

  const optimizerJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${showFallback ? data.cityName : area!.city}の実家じまい・資産防衛シミュレーター`,
    description: "間取り・荷物量・建物条件を選ぶと、費用と放置リスクがリアルタイムで計算されます。家族会議用レポートで共有可能。",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
  };

  if (showFallback) {
    const bulkySearchUrl = `https://www.google.com/search?q=${encodeURIComponent(data.prefName + " " + data.cityName + " 粗大ゴミ")}`;
    return (
      <div className="space-y-8">
        <AreaBodyMeta cityName={data.cityName} />
        <BreadcrumbJsonLd itemListElements={breadcrumbItems} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(optimizerJsonLd) }} />
        <AreaBreadcrumbs prefecture={data.prefName} city={data.cityName} prefectureId={data.prefId} cityId={data.cityId} page="main" />
        <div>
          <h1 className="text-2xl font-bold text-primary">
            {data.cityName}の空き家補助金・遺品整理の公式窓口（2026年最新）
          </h1>
        </div>
        <RegionalFacts prefName={data.prefName} cityName={data.cityName} prefId={prefecture} cityId={city} />
        <LocalSubsidyFaq
          municipalityData={data}
          cityName={data.cityName}
          prefName={data.prefName}
          prefId={prefecture}
          cityId={city}
          regionalStats={getRegionalStats(`${prefecture}-${city}`)}
          baseUrl={base}
        />
        <DynamicCaseStudy
          cityName={data.cityName}
          landPrice={getRegionalStats(`${prefecture}-${city}`)?.landPrice ?? 20000000}
          cityId={city}
        />
        <section id="optimizer-section" aria-label="実家じまいシミュレーター">
          <JikkaOptimizer
            cityName={data.cityName}
            cityId={city}
            regionalStats={getRegionalStats(`${prefecture}-${city}`)}
            initialLayout={validLayout}
            titleVariant="area"
          />
        </section>
        <SituationGuide prefName={data.prefName} cityName={data.cityName} />
        <AreaDirectoryFallback
          cityName={data.cityName}
          prefName={data.prefName}
          prefId={data.prefId}
          cityId={data.cityId}
        />
        <InheritanceRouting prefName={data.prefName} cityName={data.cityName} />
        <DynamicFaq
          prefName={data.prefName}
          cityName={data.cityName}
          hasData={false}
        />
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-primary-light/30">
            <h2 className="font-bold text-primary">粗大ゴミの申し込み</h2>
          </div>
          <div className="p-6 space-y-3">
            <p className="text-sm text-foreground/70">
              {data.cityName}の粗大ゴミは、自治体の案内に従って申し込みます。
            </p>
            <AreaBulkyWasteLink href={bulkySearchUrl} prefecture={data.prefName} city={data.cityName}>
              {data.prefName}{data.cityName}の粗大ゴミ案内を検索
            </AreaBulkyWasteLink>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/area" className="inline-block text-foreground/60 text-sm hover:text-primary hover:underline">
            ← 地域一覧（全国）へ
          </Link>
          <Link href={`/area/${data.prefId}/${data.cityId}/subsidy`} className="inline-block bg-card border border-border px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-light hover:text-primary transition">
            {data.cityName}の空き家・補助金
          </Link>
          <Link href={`/area/${data.prefId}/${data.cityId}/cleanup`} className="inline-block bg-card border border-border px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-light hover:text-primary transition">
            {data.cityName}の遺品整理・相場
          </Link>
          <Link href="/tools" className="inline-block text-primary font-medium hover:underline">
            ← 無料ツール一覧へ
          </Link>
        </div>
        <RelatedAreas currentPrefId={prefecture} currentCityId={city} prefName={data.prefName} />
        <NearbyAreas currentPrefecture={prefecture} currentCity={city} />
        <OperatorTrustBlock />
        <footer className="pt-8 mt-8 border-t border-border text-sm text-foreground/60">
          <p className="font-medium text-foreground/80 mb-1">監修</p>
          <p>整理収納・生前整理に関する記載は整理収納アドバイザー／税理士の監修を受けております。YMYL領域の情報は随時見直しを行っています。</p>
        </footer>
      </div>
    );
  }

  const richBreadcrumbItems = [
    { name: "ホーム", item: `${base}/` },
    { name: area.prefecture, item: `${base}/area#${prefecture}` },
    { name: area.city, item: `${base}/area/${prefecture}/${city}` },
  ];

  return (
    <div className="space-y-8">
      <AreaBodyMeta cityName={data.cityName} />
      <BreadcrumbJsonLd itemListElements={richBreadcrumbItems} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(optimizerJsonLd) }} />
      <AreaBreadcrumbs prefecture={area.prefecture} city={area.city} prefectureId={ids.prefectureId} cityId={ids.cityId} page="main" />
      <div>
        <h1 className="text-2xl font-bold text-primary">
          {area.city}（{area.prefecture}）の粗大ゴミ・遺品整理
        </h1>
        <p className="text-foreground/60 mt-1">
          粗大ゴミの申し込み方法と、遺品整理の相談先をご案内します。
        </p>
      </div>

      <RegionalFacts prefName={data.prefName} cityName={area.city} prefId={prefecture} cityId={city} />
      <LocalSubsidyFaq
        municipalityData={data}
        cityName={area.city}
        prefName={data.prefName}
        prefId={prefecture}
        cityId={city}
        regionalStats={getRegionalStats(`${prefecture}-${city}`)}
        baseUrl={base}
      />
      <DynamicCaseStudy
        cityName={area.city}
        landPrice={getRegionalStats(`${prefecture}-${city}`)?.landPrice ?? 20000000}
        cityId={ids.cityId}
      />
      <section id="optimizer-section" aria-label="実家じまいシミュレーター">
        <JikkaOptimizer
          cityName={area.city}
          cityId={ids.cityId}
          regionalStats={getRegionalStats(`${prefecture}-${city}`)}
          initialLayout={validLayout}
          titleVariant="area"
        />
      </section>
      <SituationGuide prefName={data.prefName} cityName={area.city} />
      <AreaOwlBlock cityName={area.city} />

      <section className="bg-amber-50/80 rounded-2xl border border-amber-200/60 p-5">
        <h2 className="text-sm font-bold text-amber-900/90 mb-2">
          {area.city}（{area.prefecture}）の生前整理コラム
        </h2>
        <p className="text-sm text-foreground/80 leading-relaxed">
          {getAreaSeizenseiriColumn(area.prefecture, area.city)}
        </p>
      </section>

      <MascotAdviceBlock localRiskText={data.mascot.localRiskText} cityName={area.city} />
      <LocalConsultationCard
        cityName={area.city}
        prefName={data.prefName}
        localRiskText={data.mascot.localRiskText}
      />

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 className="font-bold text-primary">粗大ゴミの申し込み</h2>
        </div>
        <div className="p-6 space-y-3">
          <p className="text-sm text-foreground/70">
            {area.city}の粗大ゴミは、自治体の案内に従って申し込みます。
          </p>
          <AreaBulkyWasteLink
            href={area.bulkyWasteUrl}
            prefecture={area.prefecture}
            city={area.city}
          >
            {area.bulkyWasteUrl.startsWith("https://www.google.com/search")
              ? `${area.prefecture}${area.city}の粗大ゴミ案内を検索`
              : area.bulkyWasteUrl}
          </AreaBulkyWasteLink>
        </div>
      </div>

      {/* 清掃問い合わせは自治体HP案内のみ（電話番号は表示しない＝離脱防止・リスク管理） */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 className="font-bold text-primary">粗大ゴミ・清掃の問い合わせ</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-foreground/70 mb-4">
            清掃関係の問い合わせ・収集日は、{area.city}の公式HPまたは窓口でご確認ください。
          </p>
          <Link
            href="/guide"
            className="inline-block bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition"
          >
            遺品整理の無料見積もりを依頼する
          </Link>
        </div>
      </div>

      <InheritanceRouting prefName={data.prefName} cityName={area.city} />
      <DynamicFaq
        prefName={data.prefName}
        cityName={area.city}
        hasData={!data._isDefault}
        municipalityData={data._isDefault ? undefined : data}
      />
      <div id="cleanup-section">
        <CleanupAffiliateCard cityName={area.city} cityId={ids.cityId} />
      </div>

      <RealEstateAppraisalCard
        cityName={area.city}
        cityId={ids.cityId}
        localRiskText={data?.mascot.localRiskText}
      />

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 className="font-bold text-primary">遺品整理・生前整理の相談</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-foreground/70 mb-4">
            {area.estateCleanupNote}。複数社で見積もりを取ると安心です。
          </p>
          <Link
            href="/guide"
            className="inline-block bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition"
          >
            無料で見積もりを依頼する
          </Link>
        </div>
      </div>

      <NearbySubsidyLinks
        cityName={area.city}
        prefId={ids.prefectureId}
        neighbours={getMunicipalitiesByPrefecture(ids.prefectureId)
          .filter((m) => m.cityId !== ids.cityId)
          .slice(0, 6)
          .map((m) => ({ cityId: m.cityId, cityName: m.cityName }))}
      />

      <div className="flex flex-wrap gap-3">
        <Link href="/area" className="inline-block text-foreground/60 text-sm hover:text-primary hover:underline">
          ← 地域一覧（全国）へ
        </Link>
        <Link
          href={`/area/${ids.prefectureId}/${ids.cityId}/garbage`}
          className="inline-block bg-card border border-border px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-light hover:text-primary transition"
        >
          {area.city}の粗大ゴミ・遺品整理
        </Link>
        <Link
          href={`/area/${ids.prefectureId}/${ids.cityId}/subsidy`}
          className="inline-block bg-card border border-border px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-light hover:text-primary transition"
        >
          {area.city}の空き家・補助金
        </Link>
        <Link
          href={`/area/${ids.prefectureId}/${ids.cityId}/cleanup`}
          className="inline-block bg-card border border-border px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-light hover:text-primary transition"
        >
          {area.city}の遺品整理・相場
        </Link>
        <Link
          href={`/area/${ids.prefectureId}/${ids.cityId}/cost`}
          className="inline-block bg-card border border-border px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-light hover:text-primary transition"
        >
          {area.city}の費用相場シミュレーション
        </Link>
        <Link
          href={`/tax-simulator/${ids.prefectureId}/${ids.cityId}`}
          className="inline-block bg-card border border-border px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-light hover:text-primary transition"
        >
          {area.city}の空き家税金シミュレーション
        </Link>
        <Link href="/tools" className="inline-block text-primary font-medium hover:underline">
          ← 無料ツール一覧へ
        </Link>
      </div>

      <RelatedAreas currentPrefId={prefecture} currentCityId={city} prefName={data.prefName} />
      <NearbyAreas currentPrefecture={ids.prefectureId} currentCity={ids.cityId} />
      <OperatorTrustBlock />
      <footer className="pt-8 mt-8 border-t border-border text-sm text-foreground/60">
        <p className="font-medium text-foreground/80 mb-1">監修</p>
        <p>
          整理収納・生前整理に関する記載：整理収納アドバイザー／税理士の監修を受けております。YMYL（Your Money Your Life）領域の情報は、アルゴリズム変動リスク低減のため随時見直しを行っています。
        </p>
      </footer>
    </div>
  );
}
