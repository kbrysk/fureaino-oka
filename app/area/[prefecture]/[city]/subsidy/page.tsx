// import { notFound } from "next/navigation";
import Link from "next/link";
import { getMunicipalityDataOrDefault, getMunicipalitiesByPrefecture } from "../../../../lib/data/municipalities";
import { getAreaById, getAreaIds } from "../../../../lib/area-data";
import { getSampleCityPaths } from "../../../../lib/utils/city-loader";

export const dynamicParams = true;
export const revalidate = 86400;
import { getAreaSeizenseiriColumn } from "../../../../lib/area-column";
import AreaBreadcrumbs from "../../../../components/AreaBreadcrumbs";
import AreaOwlBlock from "../../../../components/AreaOwlBlock";
import AreaBulkyWasteLink from "../../../../components/AreaBulkyWasteLink";
import MascotAdviceBlock from "../../../../components/MascotAdviceBlock";
import LocalConsultationCard from "../../../../components/LocalConsultationCard";
import RealEstateAppraisalCard from "../../../../components/RealEstateAppraisalCard";
import NearbySubsidyLinks from "../../../../components/NearbySubsidyLinks";
import SpokeInternalLinks from "../../../../components/SpokeInternalLinks";
import OperatorTrustBlock from "../../../../components/OperatorTrustBlock";
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
  if (!area) return { title: pageTitle("空き家・補助金") };
  if (data._isDefault) {
    return {
      title: pageTitle(`${data.cityName}の実家解体・空き家補助金・助成金まとめ`),
      description: `${data.cityName}で空き家整理や売却を検討中の方へ。自治体の窓口情報や、相続時に役立つ3,000万円控除の特例、おすすめの査定サービスをまとめています。`,
    };
  }

  if (data.subsidy.hasSubsidy && data.subsidy.maxAmount) {
    const amount = data.subsidy.maxAmount.replace(/最大|万円|円/g, "").trim() || "〇〇";
    return {
      title: pageTitle(
        `${data.cityName}（${data.prefName}）の空き家解体補助金は最大${amount}万円！対象条件と粗大ゴミの捨て方`
      ),
      description: `${data.prefName}${data.cityName}の空き家解体補助金「${data.subsidy.name ?? "自治体補助"}」は${data.subsidy.maxAmount}。対象条件・申請方法と粗大ゴミの申し込み案内。`,
    };
  }

  return {
    title: pageTitle(`${data.cityName}の実家解体・空き家補助金・助成金まとめ`),
    description: `${data.prefName}${data.cityName}の空き家解体補助金・相続空き家の3000万円特別控除の相談窓口と概要。専門家への無料相談がおすすめです。`,
  };
}

export default async function AreaSubsidyPage({ params }: Props) {
  const { prefecture, city } = await params;
  const area = getAreaById(prefecture, city);
  // if (!area) notFound();
  const fallbackNames = { prefName: area?.prefecture ?? prefecture, cityName: area?.city ?? city };
  const data = await getMunicipalityDataOrDefault(prefecture, city, fallbackNames);
  const ids = area ? getAreaIds(area.prefecture, area.city)! : { prefectureId: prefecture, cityId: city };

  if (data._isDefault || !area) {
    return (
      <div className="space-y-8">
        <AreaBreadcrumbs
          prefecture={data.prefName}
          city={data.cityName}
          prefectureId={data.prefId}
          cityId={data.cityId}
          page="subsidy"
        />
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
          faqItems={[]}
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
          <p>税制・補助金に関する記載は税理士の監修を受けております。詳細は自治体・専門家にご確認ください。</p>
        </footer>
      </div>
    );
  }

  const cleanupPriceText =
    area?.cleanupPriceNote ||
    `${data.cityName}では、遺品整理・実家の片付けは、部屋数・荷物量・立地により相場が異なります。1Kで十数万円〜、2LDKで20〜40万円程度、3LDK以上で40万円〜が目安となることが多いです。複数社の無料見積もりで比較することをおすすめします。`;

  return (
    <div className="space-y-8">
      <AreaBreadcrumbs
        prefecture={data.prefName}
        city={data.cityName}
        prefectureId={data.prefId}
        cityId={data.cityId}
        page="subsidy"
      />
      <div>
        <h1 className="text-2xl font-bold text-primary">
          {data.cityName}（{data.prefName}）の空き家 解体補助金・3000万円控除
        </h1>
        <p className="text-foreground/60 mt-1">
          空き家の解体補助金と、相続空き家の3000万円特別控除の相談の目安です。
        </p>
      </div>

      <AreaOwlBlock cityName={data.cityName} />

      <section className="bg-amber-50/80 rounded-2xl border border-amber-200/60 p-5">
        <h2 className="text-sm font-bold text-amber-900/90 mb-2">
          {data.cityName}（{data.prefName}）の生前整理コラム
        </h2>
        <p className="text-sm text-foreground/80 leading-relaxed">
          {getAreaSeizenseiriColumn(data.prefName, data.cityName)}
        </p>
      </section>

      <MascotAdviceBlock localRiskText={data.mascot.localRiskText} cityName={data.cityName} />

      <LocalConsultationCard
        cityName={data.cityName}
        prefName={data.prefName}
        localRiskText={data.mascot.localRiskText}
      />

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 className="font-bold text-primary">{data.cityName}の粗大ゴミ回収ルール概要</h2>
        </div>
        <div className="p-6 space-y-3">
          <p className="text-sm text-foreground/70 leading-relaxed">
            {data.cityName}の粗大ゴミ回収は、自治体の公式案内で申し込み方法・収集日・料金を確認できます。
          </p>
          <AreaBulkyWasteLink
            href={data.garbage.officialUrl}
            prefecture={data.prefName}
            city={data.cityName}
          >
            {data.cityName}の粗大ゴミ受付ページ（公式サイト）へ
          </AreaBulkyWasteLink>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 className="font-bold text-primary">{data.cityName}で使える可能性のある補助金</h2>
        </div>
        <div className="p-6 space-y-4">
          {data.subsidy.hasSubsidy ? (
            <>
              <ul className="list-disc list-inside space-y-2 text-sm text-foreground/70">
                {data.subsidy.name && <li><strong>制度名：</strong>{data.subsidy.name}</li>}
                {data.subsidy.maxAmount && <li><strong>補助額：</strong>{data.subsidy.maxAmount}</li>}
                {data.subsidy.conditions && <li><strong>対象条件：</strong>{data.subsidy.conditions}</li>}
              </ul>
              {data.subsidy.officialUrl && (
                <a
                  href={data.subsidy.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:opacity-90 transition"
                >
                  自治体の公式案内はこちら
                </a>
              )}
            </>
          ) : (
            <>
              <p className="text-sm text-foreground/70 leading-relaxed">
                現在、{data.cityName}独自の空き家解体特化の補助金は確認されていません。しかし、国や県の制度が使える場合があるため、専門家への無料相談をおすすめします。
              </p>
              {/* CRO: 補助金なし時の節税メリット訴求CTA */}
              <div className="mt-4 p-4 rounded-xl bg-primary-light/60 border border-primary/30">
                <p className="text-sm font-medium text-foreground/90 mb-2">
                  補助金がなくても、諦めるのは早いです！
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                  「相続空き家の3,000万円控除」という特例を使えば、売却時の税金を数百万円単位で抑えられる可能性があります。まずは対象かどうか、無料査定でプロに確認してみましょう。
                </p>
                <Link
                  href="/tools/appraisal"
                  className="inline-block px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 transition"
                >
                  無料査定で対象か確認する
                </Link>
              </div>
            </>
          )}
          <p className="text-xs text-foreground/50">
            制度の要件・申請方法は自治体により異なります。必ずお住まいの市区町村窓口または税理士にご確認ください。
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 className="font-bold text-primary">{data.cityName}対応の遺品整理業者の相場</h2>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-foreground/70 leading-relaxed">{cleanupPriceText}</p>
          <Link
            href={`/area/${data.prefId}/${data.cityId}/cleanup`}
            className="inline-block text-primary font-medium hover:underline"
          >
            {data.cityName}の片付け相場・詳細を見る →
          </Link>
        </div>
      </div>

      <RealEstateAppraisalCard
        cityName={data.cityName}
        cityId={data.cityId}
        localRiskText={data.mascot.localRiskText}
      />

      {/* PLG導線: 補助金対象か30秒で判定 ＋ 高単価査定導線・マイクロコピー */}
      <div className="bg-primary rounded-2xl p-6 text-white text-center">
        <p className="font-bold mb-2">あなたの実家が補助金の対象か、モグ隊長が30秒で判定！</p>
        <p className="text-sm text-white/80 mb-4">
          空き家の維持費シミュレーターで「10年でいくらかかるか」を確認し、売却・活用の相談につなげましょう。
        </p>
        <p className="text-xs text-white/60 mb-3">
          ※自治体の窓口に代わって、専門家が制度の適用可否を無料でアドバイスします
        </p>
        <Link
          href="/tools/empty-house-tax"
          className="inline-block bg-accent text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition"
        >
          無料でシミュレーションする
        </Link>
        <span className="mx-2 text-white/60">または</span>
        <Link
          href="/tools/jikka-diagnosis"
          className="inline-block bg-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition"
        >
          実家じまい力診断を受ける
        </Link>
        <div className="mt-4 pt-4 border-t border-white/20">
          <Link
            href="/tools/appraisal"
            className="text-sm text-white/90 hover:text-white underline"
          >
            {data.cityName}の不動産売却相場をチェック
          </Link>
        </div>
      </div>

      <NearbySubsidyLinks
        cityName={data.cityName}
        prefId={data.prefId}
        neighbours={getMunicipalitiesByPrefecture(data.prefId)
          .filter((m) => m.cityId !== data.cityId)
          .slice(0, 6)
          .map((m) => ({ cityId: m.cityId, cityName: m.cityName }))}
      />

      <SpokeInternalLinks
        prefId={data.prefId}
        cityId={data.cityId}
        prefName={data.prefName}
        cityName={data.cityName}
        currentSpoke="subsidy"
      />
      <OperatorTrustBlock />
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
        <p>
          税制・補助金に関する記載は税理士の監修を受けております。詳細は自治体・専門家にご確認ください。
        </p>
      </footer>
    </div>
  );
}
