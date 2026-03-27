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
import CostSimulator from "../../../components/CostSimulator";
import ExpertGuideLink from "../../../components/ExpertGuideLink";
import AreaBodyMeta from "../../../components/AreaBodyMeta";
import OperatorTrustBlock from "../../../components/OperatorTrustBlock";
import LocalAreaLinks from "../../../components/LocalAreaLinks";
import AreaSurveyCredit from "../../../components/AreaSurveyCredit";
import { getRegionalStats } from "../../../lib/utils/regional-stats-loader";
import { getCanonicalBase, getCanonicalUrl } from "../../../lib/site-url";
import { pageTitle } from "../../../lib/site-brand";
import {
  buildLocalSubsidyFaqItems,
  buildDynamicFaqItems,
  generateCases,
  generateCaseStudyFaqItems,
} from "../../../lib/faq/area-faq-data";
import { getAreaContent } from "../../../lib/getAreaContent";
import { generateBreadcrumbSchema } from "../../../lib/schema/breadcrumb";
import { generateLocalBusinessSchema } from "../../../lib/schema/local-business";

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
  const canonical = getCanonicalUrl(`/area/${prefecture}/${city}`);
  if (!area) return { title: pageTitle("地域情報"), alternates: { canonical } };
  const currentYear = new Date().getFullYear();
  const titleBase = `${data.cityName}の実家じまい・空き家対策｜粗大ゴミ・遺品整理・解体補助金【${currentYear}年】`;
  const titleFinal = titleBase.length > 32 ? titleBase.slice(0, 32) + "…" : titleBase;
  const descriptionBase = `${data.cityName}の実家じまい・遺品整理・空き家解体補助金の情報をまとめています。粗大ゴミの捨て方から解体費用の相場、補助金の申請方法まで、${data.cityName}で実家じまいを進めるための情報を無料で提供しています。`;
  const descriptionFinal = descriptionBase.length > 120 ? descriptionBase.slice(0, 119) + "…" : descriptionBase;
  return { title: pageTitle(titleFinal), description: descriptionFinal, alternates: { canonical } };
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

  const areaData = await getAreaContent(prefecture, city);
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

  const regionalStatsVal = getRegionalStats(`${prefecture}-${city}`);
  const landPriceVal = regionalStatsVal?.landPrice ?? 20000000;
  const displayCityName = showFallback ? data.cityName : area!.city;
  const cityIdForCases = showFallback ? city : ids.cityId;
  const hasMunicipalityData = !data._isDefault;
  const areaDisposalRules = areaData?.localDisposalRules ?? [];
  const areaFacilities = areaData?.facilities ?? [];
  const areaFaqs = areaData?.faqs ?? [];
  const areaMarketPriceText = areaData?.marketPriceText ?? "";

  const localSubsidyItems = buildLocalSubsidyFaqItems({
    municipalityData: data,
    cityName: displayCityName,
    prefName: data.prefName,
    prefId: prefecture,
    cityId: city,
    regionalStats: regionalStatsVal ?? undefined,
  });
  const dynamicFaqItems = buildDynamicFaqItems({
    prefName: data.prefName,
    cityName: displayCityName,
    hasData: hasMunicipalityData,
    municipalityData: data._isDefault ? undefined : data,
  });
  const cases = generateCases(cityIdForCases, displayCityName, landPriceVal);
  const caseStudyFaqItems = generateCaseStudyFaqItems(displayCityName, cases);

  if (showFallback) {
    const bulkySearchUrl = `https://www.google.com/search?q=${encodeURIComponent(data.prefName + " " + data.cityName + " 粗大ゴミ")}`;
    const breadcrumb = generateBreadcrumbSchema([
      { name: "ホーム", url: `${base}/` },
      { name: "地域一覧", url: `${base}/area` },
      { name: data.prefName, url: `${base}/area/${prefecture}` },
      { name: data.cityName, url: `${base}/area/${prefecture}/${city}` },
    ]);
    const localBizSchema = generateLocalBusinessSchema({
      cityName: data.cityName,
      prefectureName: data.prefName,
      prefecture,
      city,
      pageType: "city",
    });
    return (
      <div className="space-y-8">
        <AreaBodyMeta cityName={data.cityName} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
        <BreadcrumbJsonLd itemListElements={breadcrumbItems} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(optimizerJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBizSchema) }} />
        <AreaBreadcrumbs prefecture={data.prefName} city={data.cityName} prefectureId={data.prefId} cityId={data.cityId} page="main" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
            {data.cityName}で実家じまいをするには？費用・補助金・手順を完全解説【{new Date().getFullYear()}年版】
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl">
            {data.cityName}の実家が空き家になった、または親が高齢で管理が難しくなってきた方へ。このページでは「何から手をつければいいか」から、解体・売却・補助金申請の実務手順まで、{data.cityName}在住者・遠方在住者どちらの方でも使える情報をまとめています。
          </p>
        </div>
        <RegionalFacts prefName={data.prefName} cityName={data.cityName} prefId={prefecture} cityId={city} />
        <LocalSubsidyFaq
          items={localSubsidyItems}
          heading={`${data.cityName}の実家じまい・補助金よくある質問`}
        />
        <DynamicCaseStudy cityName={data.cityName} cases={cases} />
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
          faqItems={dynamicFaqItems}
        />
        <InheritanceRouting prefName={data.prefName} cityName={data.cityName} />
        <DynamicFaq
          items={dynamicFaqItems}
          heading={`${data.cityName}の実家・空き家に関するよくある質問`}
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
        <ExpertGuideLink variant="default" />
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
        <LocalAreaLinks prefecture={prefecture} currentCity={city} />
        <AreaSurveyCredit />
        <footer className="pt-8 mt-8 border-t border-border text-sm text-foreground/60">
          <p className="font-medium text-foreground/80 mb-1">監修</p>
          <p>整理収納・生前整理に関する記載は整理収納アドバイザー／税理士の監修を受けております。YMYL領域の情報は随時見直しを行っています。</p>
        </footer>
      </div>
    );
  }

  const areaCityName = areaData?.cityName ?? area!.city;
  const bulkyWasteUrl =
    area!.bulkyWasteUrl ||
    `https://www.google.com/search?q=${encodeURIComponent(area!.prefecture + " " + area!.city + " 粗大ゴミ")}`;

  const richBreadcrumbItems = [
    { name: "ホーム", item: `${base}/` },
    { name: area.prefecture, item: `${base}/area#${prefecture}` },
    { name: area.city, item: `${base}/area/${prefecture}/${city}` },
  ];

  const breadcrumb = generateBreadcrumbSchema([
    { name: "ホーム", url: `${base}/` },
    { name: "地域一覧", url: `${base}/area` },
    { name: area.prefecture, url: `${base}/area/${prefecture}` },
    { name: area.city, url: `${base}/area/${prefecture}/${city}` },
  ]);
  const localBizSchema = generateLocalBusinessSchema({
    cityName: area.city,
    prefectureName: area.prefecture,
    prefecture,
    city,
    pageType: "city",
  });

  return (
    <div className="space-y-8">
      <AreaBodyMeta cityName={data.cityName} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <BreadcrumbJsonLd itemListElements={richBreadcrumbItems} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(optimizerJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBizSchema) }} />
      <AreaBreadcrumbs prefecture={area.prefecture} city={area.city} prefectureId={ids.prefectureId} cityId={ids.cityId} page="main" />
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
          {area.city}で実家じまいをするには？費用・補助金・手順を完全解説【{new Date().getFullYear()}年版】
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl">
          {area.city}の実家が空き家になった、または親が高齢で管理が難しくなってきた方へ。このページでは「何から手をつければいいか」から、解体・売却・補助金申請の実務手順まで、{area.city}在住者・遠方在住者どちらの方でも使える情報をまとめています。
        </p>
      </div>

      {areaData?.subsidyInfo && (() => {
        const { maxAmount } = areaData.subsidyInfo;
        const hasConcreteAmount =
          /[0-9０-９]|万|円|上限/.test(maxAmount) && maxAmount !== "—" && !/詳細確認中|お問い合わせ/.test(maxAmount);
        return (
          <div className="bg-green-50 border-l-4 border-green-600 p-6 my-8 rounded-r-lg shadow-sm">
            <p className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span aria-hidden>💡</span>
              <span aria-hidden>🏠</span>
              {hasConcreteAmount ? (
                <>
                  【{area.city}限定】最大{maxAmount}の補助金を活用して、実家じまいの負担を軽減しませんか？
                </>
              ) : (
                <>【{area.city}限定】補助金を活用して、実家じまいの負担を軽減しませんか？</>
              )}
            </p>
            <p className="text-sm text-gray-700 mb-4">
              空き家の放置は固定資産税の増税（最大6倍）のリスクがあります。公的な支援を確認し、賢く整理を進めましょう。
            </p>
            {hasConcreteAmount ? (
              <Link
                href={`/area/${ids.prefectureId}/${ids.cityId}/subsidy`}
                className="inline-block bg-green-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-green-700 transition"
                id="cta-subsidy-check"
                data-ga-cta="subsidy_check"
                data-event-name="cta_subsidy_confirm"
              >
                {area.city}の補助金・申請条件を確認する
              </Link>
            ) : (
              <Link
                href={`/area/${ids.prefectureId}/${ids.cityId}/subsidy`}
                className="inline-block bg-green-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-green-700 transition"
                id="cta-subsidy-check-fallback"
                data-ga-cta="subsidy_check"
                data-event-name="cta_subsidy_confirm"
              >
                {area.city}役所の最新補助枠を確認する（窓口案内）
              </Link>
            )}
          </div>
        );
      })()}

      {!showFallback && area && (
        <section id="cost-simulator-section" aria-label="解体・片付け費用シミュレーター">
          <CostSimulator
            cityName={area.city}
            cityId={ids.cityId}
            prefId={prefecture}
            regionalStats={getRegionalStats(`${prefecture}-${city}`)}
            subsidyInfo={areaData?.subsidyInfo ?? undefined}
            hasNarrowAccess={areaData ? /坂|階段/.test(areaData.empatheticLead ?? "") : false}
            hasSnowRegion={areaData ? /豪雪|積雪/.test(areaData.empatheticLead ?? "") : false}
          />
        </section>
      )}

      {areaData && (
        <>
          <div className="my-8 rounded-2xl bg-blue-50/80 p-6 sm:p-8 border border-blue-100 shadow-sm">
            <p className="text-base sm:text-lg leading-loose text-gray-800 font-medium">
              {areaData.empatheticLead}
            </p>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-6 border-b-2 border-blue-500 pb-2">
            {areaCityName}の粗大ゴミ出し方・ルール
          </h2>
          <ul className="space-y-4">
            {areaDisposalRules.map((rule, i) => (
              <li key={i} className="flex items-start text-base sm:text-lg leading-relaxed text-gray-800">
                <span className="mr-3 text-green-500 text-xl flex-shrink-0">✅</span>
                {rule}
              </li>
            ))}
          </ul>

          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-8 mb-4">
            持ち込み可能な施設
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {areaFacilities.map((facility, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h4 className="font-bold text-gray-900 text-lg mb-2">{facility.name}</h4>
                <p className="text-base text-gray-800">{facility.address}</p>
                {facility.phone && (
                  <a
                    href={`tel:${facility.phone}`}
                    className="text-blue-600 font-bold underline text-lg block mt-2 py-2"
                  >
                    {facility.phone}
                  </a>
                )}
              </div>
            ))}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-6 border-b-2 border-blue-500 pb-2">
            {areaCityName}の生前整理・遺品整理の費用相場
          </h2>
          <p className="text-base sm:text-lg leading-loose text-gray-800 mb-8">
            {areaMarketPriceText}
          </p>
          <RealEstateAppraisalCard
            cityName={area.city}
            cityId={ids.cityId}
            localRiskText={data?.mascot?.localRiskText}
          />
          <CleanupAffiliateCard cityName={area.city} cityId={ids.cityId} />

          <dl className="space-y-6 mt-10">
            {areaFaqs.map((faq, i) => (
              <div key={i}>
                <dt className="font-bold text-lg text-gray-900 bg-gray-100 p-4 rounded-t-lg flex items-center">
                  Q. {faq.question}
                </dt>
                <dd className="text-base sm:text-lg text-gray-800 leading-relaxed bg-white border border-gray-100 p-4 rounded-b-lg shadow-sm">
                  A. {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </>
      )}

      <RegionalFacts prefName={data.prefName} cityName={area.city} prefId={prefecture} cityId={city} />
      <LocalSubsidyFaq
        items={localSubsidyItems}
        heading={`${area.city}の実家じまい・補助金よくある質問`}
      />
      <DynamicCaseStudy cityName={area.city} cases={cases} />
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

      <MascotAdviceBlock localRiskText={data.mascot?.localRiskText} cityName={area.city} />
      <LocalConsultationCard
        cityName={area.city}
        prefName={data.prefName}
        localRiskText={data.mascot?.localRiskText ?? ""}
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
            href={bulkyWasteUrl}
            prefecture={area.prefecture}
            city={area.city}
          >
            {bulkyWasteUrl.startsWith("https://www.google.com/search")
              ? `${area.prefecture}${area.city}の粗大ゴミ案内を検索`
              : bulkyWasteUrl}
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
            href="/articles/master-guide"
            className="inline-block bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition"
          >
            遺品整理の無料見積もりを依頼する
          </Link>
        </div>
      </div>

      <InheritanceRouting prefName={data.prefName} cityName={area.city} />
      <DynamicFaq
        items={dynamicFaqItems}
        heading={`${area.city}の実家・空き家に関するよくある質問`}
      />
      <div id="cleanup-section">
        <CleanupAffiliateCard cityName={area.city} cityId={ids.cityId} />
      </div>

      <RealEstateAppraisalCard
        cityName={area.city}
        cityId={ids.cityId}
        localRiskText={data?.mascot?.localRiskText}
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
            href="/articles/master-guide"
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

      <ExpertGuideLink
        variant={
          areaData?.empatheticLead
            ? /坂|階段/.test(areaData.empatheticLead)
              ? "narrow"
              : /豪雪|積雪/.test(areaData.empatheticLead)
                ? "snow"
                : "default"
            : "default"
        }
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
      <LocalAreaLinks prefecture={prefecture} currentCity={city} />
      {areaData && (
        <p className="mt-12 text-sm text-gray-500 leading-normal bg-gray-50 p-4 rounded-lg">
          {areaData.advisoryNote}
        </p>
      )}
      <AreaSurveyCredit />
      <footer className="pt-8 mt-8 border-t border-border text-sm text-foreground/60">
        <p className="font-medium text-foreground/80 mb-1">監修</p>
        <p>
          整理収納・生前整理に関する記載：整理収納アドバイザー／税理士の監修を受けております。YMYL（Your Money Your Life）領域の情報は、アルゴリズム変動リスク低減のため随時見直しを行っています。
        </p>
      </footer>
    </div>
  );
}
