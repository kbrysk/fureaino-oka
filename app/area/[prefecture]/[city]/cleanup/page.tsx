// import { notFound } from "next/navigation";
import Link from "next/link";
import { getAreaById, getAreaIds } from "../../../../lib/area-data";
import { getSampleCityPaths } from "../../../../lib/utils/city-loader";

export const dynamicParams = true;
export const revalidate = 86400;
import { getMunicipalityDataOrDefault, getMunicipalitiesByPrefecture } from "../../../../lib/data/municipalities";
import { getAreaSeizenseiriColumn, getAreaOwlColumn } from "../../../../lib/area-column";
import AreaBreadcrumbs from "../../../../components/AreaBreadcrumbs";
import AreaOwlBlock from "../../../../components/AreaOwlBlock";
import CleanupAffiliateCard from "../../../../components/CleanupAffiliateCard";
import RealEstateAppraisalCard from "../../../../components/RealEstateAppraisalCard";
import MascotAdviceBlock from "../../../../components/MascotAdviceBlock";
import LocalConsultationCard from "../../../../components/LocalConsultationCard";
import NearbySubsidyLinks from "../../../../components/NearbySubsidyLinks";
import AreaDirectoryFallback from "../../../../components/AreaDirectoryFallback";
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
  if (!area) return { title: pageTitle("遺品整理・片付け相場") };
  if (data._isDefault) {
    return {
      title: pageTitle(`${data.cityName}の空き家補助金・実家整理ガイド【2026年最新版】`),
      description: `${data.cityName}で空き家整理や売却を検討中の方へ。自治体の窓口情報や、相続時に役立つ3,000万円控除の特例、おすすめの査定サービスをまとめています。`,
    };
  }
  return {
    title: pageTitle(`${data.cityName}（${data.prefName}）遺品整理 相場・実家 片付け 業者 おすすめ`),
    description: `${data.prefName}${data.cityName}の遺品整理・実家の片付けの相場（1K〜4LDK）と業者選びのポイント。`,
  };
}

export default async function AreaCleanupPage({ params }: Props) {
  const { prefecture, city } = await params;
  const area = getAreaById(prefecture, city);
  // if (!area) notFound();
  const fallbackNames = { prefName: area?.prefecture ?? prefecture, cityName: area?.city ?? city };
  const data = await getMunicipalityDataOrDefault(prefecture, city, fallbackNames);
  const ids = area ? getAreaIds(area.prefecture, area.city)! : { prefectureId: prefecture, cityId: city };

  if (data._isDefault || !area) {
    return (
      <div className="space-y-8">
        <AreaBreadcrumbs prefecture={data.prefName} city={data.cityName} prefectureId={data.prefId} cityId={data.cityId} page="cleanup" />
        <div>
          <h1 className="text-2xl font-bold text-primary">
            {data.cityName}の空き家補助金・遺品整理の公式窓口（2026年最新）
          </h1>
        </div>
        <AreaDirectoryFallback
          cityName={data.cityName}
          prefName={data.prefName}
          prefId={data.prefId}
          cityId={data.cityId}
        />
        <div className="flex flex-wrap gap-3">
          <Link href="/area" className="inline-block text-foreground/60 text-sm hover:text-primary hover:underline">
            ← 地域一覧（全国）へ
          </Link>
          <Link href={`/area/${data.prefId}/${data.cityId}`} className="inline-block text-primary font-medium hover:underline">
            ← {data.cityName}の粗大ゴミ・遺品整理ページへ
          </Link>
        </div>
        <footer className="pt-8 mt-8 border-t border-border text-sm text-foreground/60">
          <p className="font-medium text-foreground/80 mb-1">監修</p>
          <p>整理収納・遺品整理に関する記載は整理収納アドバイザーの監修を受けております。</p>
        </footer>
      </div>
    );
  }

  const cleanupText = area.cleanupPriceNote || `${area.city}では、遺品整理・実家の片付けは、部屋数・荷物量・立地により相場が異なります。1Kで十数万円〜、2LDKで20〜40万円程度、3LDK以上で40万円〜が目安となることが多いです。複数社の無料見積もりで比較することをおすすめします。`;

  return (
    <div className="space-y-8">
      <AreaBreadcrumbs prefecture={area.prefecture} city={area.city} prefectureId={ids.prefectureId} cityId={ids.cityId} page="cleanup" />
      <div>
        <h1 className="text-2xl font-bold text-primary">
          {area.city}（{area.prefecture}）の遺品整理・片付け相場
        </h1>
        <p className="text-foreground/60 mt-1">
          1K〜4LDKの目安と、実家の片付け業者選びのポイントです。
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

      <MascotAdviceBlock localRiskText={data.mascot.localRiskText} cityName={area.city} />
      <LocalConsultationCard
        cityName={area.city}
        prefName={data.prefName}
        localRiskText={data.mascot.localRiskText}
      />

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 className="font-bold text-primary">遺品整理・実家片付けの相場目安</h2>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-foreground/70 leading-relaxed">{cleanupText}</p>
          <ul className="text-sm text-foreground/70 space-y-1 list-disc list-inside">
            <li>1K：十数万円〜</li>
            <li>2LDK：20〜40万円程度の目安</li>
            <li>3LDK〜4LDK：40万円〜（荷物量で変動）</li>
          </ul>
          <p className="text-xs text-foreground/50">
            業者・作業内容により異なります。必ず無料見積もりでご確認ください。
          </p>
        </div>
      </div>

      <CleanupAffiliateCard cityName={area.city} cityId={ids.cityId} />

      <RealEstateAppraisalCard
        cityName={area.city}
        cityId={ids.cityId}
        localRiskText={data?.mascot.localRiskText}
      />

      {/* PLG導線: 荷物量で費用シミュレーション */}
      <div className="bg-primary rounded-2xl p-6 text-white text-center">
        <p className="font-bold mb-2">
          {area.city}の平均より高い？安い？実家の荷物量で片付け費用をシミュレーション
        </p>
        <p className="text-sm text-white/80 mb-4">
          チェックリストで「やること」を把握し、見積もり依頼の準備をしましょう。
        </p>
        <Link
          href="/checklist"
          className="inline-block bg-accent text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition mr-2"
        >
          生前整理チェックリストを見る
        </Link>
        <Link
          href="/guide"
          className="inline-block bg-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition"
        >
          無料で見積もりを依頼する
        </Link>
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
        <Link href={`/area/${ids.prefectureId}/${ids.cityId}`} className="inline-block text-primary font-medium hover:underline">
          ← {area.city}の粗大ゴミ・遺品整理ページへ
        </Link>
      </div>

      <footer className="pt-8 mt-8 border-t border-border text-sm text-foreground/60">
        <p className="font-medium text-foreground/80 mb-1">監修</p>
        <p>
          整理収納・遺品整理に関する記載は整理収納アドバイザーの監修を受けております。
        </p>
      </footer>
    </div>
  );
}
