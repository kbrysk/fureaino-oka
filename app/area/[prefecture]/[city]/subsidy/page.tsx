import { notFound } from "next/navigation";
import Link from "next/link";
import { getAreaBySlug, getAreaSlugs } from "../../../../lib/area-data";
import { getAreaSeizenseiriColumn, getAreaOwlColumn } from "../../../../lib/area-column";
import AreaBreadcrumbs from "../../../../components/AreaBreadcrumbs";
import AreaOwlBlock from "../../../../components/AreaOwlBlock";
import AreaBulkyWasteLink from "../../../../components/AreaBulkyWasteLink";
import { pageTitle } from "../../../../lib/site-brand";

interface Props {
  params: Promise<{ prefecture: string; city: string }>;
}

export async function generateStaticParams() {
  return getAreaSlugs().map(({ prefecture, city }) => ({ prefecture, city }));
}

export async function generateMetadata({ params }: Props) {
  const { prefecture, city } = await params;
  const area = getAreaBySlug(prefecture, city);
  if (!area) return { title: pageTitle("空き家・補助金") };
  return {
    title: pageTitle(`${area.city}（${area.prefecture}）空き家 解体 補助金・3000万円控除`),
    description: `${area.prefecture}${area.city}の空き家解体補助金・相続空き家の3000万円特別控除の相談窓口と概要。`,
  };
}

export default async function AreaSubsidyPage({ params }: Props) {
  const { prefecture, city } = await params;
  const area = getAreaBySlug(prefecture, city);
  if (!area) notFound();

  const subsidyText = area.subsidyNote || `${area.city}では、空き家の解体に際して自治体の補助金や、相続した空き家の譲渡所得から3000万円まで控除できる特例（相続空き家の3000万円特別控除）の対象になるかどうか、市区町村の窓口や税理士にご確認ください。`;

  const bulkyWasteSummary =
    area.bulkyWasteUrl.startsWith("https://www.google.com/search")
      ? `${area.city}の粗大ゴミは、自治体の案内に従って申し込みます。申し込み方法・収集日・料金は市区町村により異なります。`
      : `${area.city}の粗大ゴミ回収は、自治体の公式案内で申し込み方法・収集日・料金を確認できます。`;

  const cleanupPriceText =
    area.cleanupPriceNote ||
    `${area.city}では、遺品整理・実家の片付けは、部屋数・荷物量・立地により相場が異なります。1Kで十数万円〜、2LDKで20〜40万円程度、3LDK以上で40万円〜が目安となることが多いです。複数社の無料見積もりで比較することをおすすめします。`;

  return (
    <div className="space-y-8">
      <AreaBreadcrumbs prefecture={area.prefecture} city={area.city} page="subsidy" />
      <div>
        <h1 className="text-2xl font-bold text-primary">
          {area.city}（{area.prefecture}）の空き家 解体補助金・3000万円控除
        </h1>
        <p className="text-foreground/60 mt-1">
          空き家の解体補助金と、相続空き家の3000万円特別控除の相談の目安です。
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

      <section className="bg-primary-light/40 rounded-2xl border border-primary/20 p-5">
        <h2 className="text-sm font-bold text-primary mb-2">
          モグ隊長（フクロウ）のひとこと
        </h2>
        <p className="text-sm text-foreground/80 leading-relaxed">
          {getAreaOwlColumn(area.prefecture, area.city)}
        </p>
      </section>

      {/* {city}の粗大ゴミ回収ルール概要 */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 className="font-bold text-primary">{area.city}の粗大ゴミ回収ルール概要</h2>
        </div>
        <div className="p-6 space-y-3">
          <p className="text-sm text-foreground/70 leading-relaxed">{bulkyWasteSummary}</p>
          <AreaBulkyWasteLink
            href={area.bulkyWasteUrl}
            prefecture={area.prefecture}
            city={area.city}
          >
            {area.bulkyWasteUrl.startsWith("https://www.google.com/search")
              ? `${area.prefecture}${area.city}の粗大ゴミ案内を検索`
              : `${area.city}の粗大ゴミ申し込み案内を見る`}
          </AreaBulkyWasteLink>
        </div>
      </div>

      {/* {city}で使える可能性のある補助金リスト */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 className="font-bold text-primary">{area.city}で使える可能性のある補助金</h2>
        </div>
        <div className="p-6 space-y-4">
          <ul className="list-disc list-inside space-y-2 text-sm text-foreground/70">
            <li>空き家解体・除却に伴う補助金（自治体により要件・上限あり）</li>
            <li>相続空き家の3000万円特別控除（譲渡所得から控除。条件あり）</li>
            <li>空き家バンク登録・改修補助（自治体による）</li>
          </ul>
          <p className="text-sm text-foreground/70 leading-relaxed">{subsidyText}</p>
          <p className="text-xs text-foreground/50">
            制度の要件・申請方法は自治体により異なります。必ずお住まいの市区町村窓口または税理士にご確認ください。
          </p>
        </div>
      </div>

      {/* {city}対応の遺品整理業者の相場 */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 className="font-bold text-primary">{area.city}対応の遺品整理業者の相場</h2>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-foreground/70 leading-relaxed">{cleanupPriceText}</p>
          <Link
            href={`/area/${encodeURIComponent(area.prefecture)}/${encodeURIComponent(area.city)}/cleanup`}
            className="inline-block text-primary font-medium hover:underline"
          >
            {area.city}の片付け相場・詳細を見る →
          </Link>
        </div>
      </div>

      {/* PLG導線: 補助金対象か30秒で判定 */}
      <div className="bg-primary rounded-2xl p-6 text-white text-center">
        <p className="font-bold mb-2">あなたの実家が補助金の対象か、モグ隊長が30秒で判定！</p>
        <p className="text-sm text-white/80 mb-4">
          空き家の維持費シミュレーターで「10年でいくらかかるか」を確認し、売却・活用の相談につなげましょう。
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
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/area" className="inline-block text-foreground/60 text-sm hover:text-primary hover:underline">
          ← 地域一覧（全国）へ
        </Link>
        <Link href={`/area/${encodeURIComponent(area.prefecture)}/${encodeURIComponent(area.city)}`} className="inline-block text-primary font-medium hover:underline">
          ← {area.city}の粗大ゴミ・遺品整理ページへ
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
