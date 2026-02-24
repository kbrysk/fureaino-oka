import { notFound } from "next/navigation";
import Link from "next/link";
import { getAreaById, getAreaIdSlugs, getAreaIds } from "../../../lib/area-data";
import { getMunicipalityData, getMunicipalitiesByPrefecture } from "../../../lib/data/municipalities";
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
import { pageTitle } from "../../../lib/site-brand";

interface Props {
  params: Promise<{ prefecture: string; city: string }>;
}

export async function generateStaticParams() {
  return getAreaIdSlugs().map(({ prefectureId, cityId }) => ({
    prefecture: prefectureId,
    city: cityId,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { prefecture, city } = await params;
  const area = getAreaById(prefecture, city);
  if (!area) return { title: pageTitle("地域情報") };
  return {
    title: pageTitle(`${area.city}（${area.prefecture}）の粗大ゴミ・遺品整理`),
    description: `${area.prefecture}${area.city}の粗大ゴミ申し込み・遺品整理の相談先。無料見積もりで比較。`,
  };
}

export default async function AreaPage({ params }: Props) {
  const { prefecture, city } = await params;
  const area = getAreaById(prefecture, city);
  if (!area) notFound();
  const ids = getAreaIds(area.prefecture, area.city)!;
  const region = getRegionBySlug([area.prefecture, area.city]);
  const municipalityData = await getMunicipalityData(ids.prefectureId, ids.cityId);

  return (
    <div className="space-y-8">
      <AreaBreadcrumbs prefecture={area.prefecture} city={area.city} prefectureId={ids.prefectureId} cityId={ids.cityId} page="main" />
      <div>
        <h1 className="text-2xl font-bold text-primary">
          {area.city}（{area.prefecture}）の粗大ゴミ・遺品整理
        </h1>
        <p className="text-foreground/60 mt-1">
          粗大ゴミの申し込み方法と、遺品整理の相談先をご案内します。
        </p>
      </div>

      <AreaOwlBlock cityName={area.city} />

      <section className="bg-amber-50/80 rounded-2xl border border-amber-200/60 p-5">
        <h2 className="text-sm font-bold text-amber-900/90 mb-2">
          {area.city}（{area.prefecture}）の生前整理コラム
        </h2>
        <p className="text-sm text-foreground/80 leading-relaxed">
          {getAreaSeizenseiriColumn(area.prefecture, area.city)}
        </p>
      </section>

      {municipalityData ? (
        <>
          <MascotAdviceBlock localRiskText={municipalityData.mascot.localRiskText} cityName={area.city} />
          <LocalConsultationCard
            cityName={area.city}
            prefName={municipalityData.prefName}
            localRiskText={municipalityData.mascot.localRiskText}
          />
        </>
      ) : (
        <section className="bg-primary-light/40 rounded-2xl border border-primary/20 p-5">
          <h2 className="text-sm font-bold text-primary mb-2">
            モグ隊長（フクロウ）のひとこと
          </h2>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {getAreaOwlColumn(area.prefecture, area.city)}
          </p>
        </section>
      )}

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

      <CleanupAffiliateCard cityName={area.city} cityId={ids.cityId} />

      <RealEstateAppraisalCard
        cityName={area.city}
        cityId={ids.cityId}
        localRiskText={municipalityData?.mascot.localRiskText}
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
        {region && (
          <Link
            href={`/region/${encodeURIComponent(area.prefecture)}/${encodeURIComponent(area.city)}`}
            className="inline-block bg-card border border-border px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-light hover:text-primary transition"
          >
            {area.city}で安く遺品整理する裏技を読む
          </Link>
        )}
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
          href={`/tax-simulator/${ids.prefectureId}/${ids.cityId}`}
          className="inline-block bg-card border border-border px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-light hover:text-primary transition"
        >
          {area.city}の空き家税金シミュレーション
        </Link>
        <Link href="/tools" className="inline-block text-primary font-medium hover:underline">
          ← 無料ツール一覧へ
        </Link>
      </div>

      <footer className="pt-8 mt-8 border-t border-border text-sm text-foreground/60">
        <p className="font-medium text-foreground/80 mb-1">監修</p>
        <p>
          整理収納・生前整理に関する記載：整理収納アドバイザー／税理士の監修を受けております。YMYL（Your Money Your Life）領域の情報は、アルゴリズム変動リスク低減のため随時見直しを行っています。
        </p>
      </footer>
    </div>
  );
}
