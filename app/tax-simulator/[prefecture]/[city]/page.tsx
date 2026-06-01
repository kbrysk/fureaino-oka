import { notFound } from "next/navigation";
import Link from "next/link";
import { getAreaById, getAreaIdSlugs, getAreaIds } from "../../../lib/area-data";
import EmptyHouseTaxSimulator from "../../../components/EmptyHouseTaxSimulator";
import RealEstateAppraisalCard from "../../../components/RealEstateAppraisalCard";
import { pageTitle } from "../../../lib/site-brand";
import { getCanonicalUrl } from "../../../lib/site-url";

interface Props {
  params: Promise<{ prefecture: string; city: string }>;
}

export async function generateStaticParams() {
  return getAreaIdSlugs().map(({ prefectureId, cityId }) => ({
    prefecture: prefectureId,
    city: cityId,
  }));
}

const CURRENT_YEAR = new Date().getFullYear();

export async function generateMetadata({ params }: Props) {
  const { prefecture, city } = await params;
  const area = getAreaById(prefecture, city);
  if (!area)
    return {
      title: pageTitle("空き家税金シミュレーション"),
      alternates: { canonical: getCanonicalUrl(`/tax-simulator/${prefecture}/${city}`) },
    };
  // CTR最適化版 title（旧: 「{city}の空き家税金シミュレーション | 固定資産税はいくら?」）
  // 新: 検索意図「今いくら？」「特定空家になったらいくら？」を直撃
  const title = `【${CURRENT_YEAR}年最新】${area.city}の空き家 固定資産税はいくら？1分で試算｜売却前チェック`;
  const description = `${area.prefecture}${area.city}の空き家・実家の固定資産税を1分で無料試算。特定空家指定で最大6倍になる前に、売却・解体・補助金の選択肢を比較できます。野村不動産の無料査定にも対応。`;
  return {
    title: pageTitle(title),
    description,
    alternates: { canonical: getCanonicalUrl(`/tax-simulator/${prefecture}/${city}`) },
    openGraph: {
      title: pageTitle(title),
      description,
      url: getCanonicalUrl(`/tax-simulator/${prefecture}/${city}`),
    },
  };
}

export default async function TaxSimulatorAreaPage({ params }: Props) {
  const { prefecture, city } = await params;
  const area = getAreaById(prefecture, city);
  if (!area) notFound();
  const ids = getAreaIds(area.prefecture, area.city)!;

  return (
    <div className="space-y-10 pb-16">
      {/* H1 + リードコピー（CTR・滞在時間最適化版） */}
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-primary leading-tight">
          【{CURRENT_YEAR}年最新】{area.city}の空き家・実家
          <br className="hidden sm:inline" />
          固定資産税はいくら？1分で無料試算
        </h1>
        <p className="text-base text-foreground/70 mt-3 leading-relaxed">
          {area.prefecture}
          {area.city}の固定資産税・都市計画税・維持費の目安を、無料でその場で試算できます。
          <strong className="text-amber-700">特定空家に指定されると最大6倍</strong>
          になる前に、売却・解体・補助金の3つの選択肢を比較しましょう。
        </p>
      </header>

      {/* ⚠️ 重要な警告ボックス：放置リスクで滞在＋CTR */}
      <aside className="rounded-2xl border border-amber-300/70 bg-amber-50/80 p-5 sm:p-6">
        <p className="font-bold text-amber-900 flex items-center gap-2 mb-2">
          <span aria-hidden>⚠️</span>
          {area.city}で空き家を放置するとどうなる？
        </p>
        <ul className="space-y-1.5 text-sm text-foreground/80 leading-relaxed list-disc list-inside">
          <li>「特定空家」指定で固定資産税が<strong>最大6倍</strong>に上昇</li>
          <li>3,000万円特別控除の<strong>適用期限</strong>（相続から3年以内）</li>
          <li>近隣からの苦情・行政指導・強制解体のリスク</li>
        </ul>
      </aside>

      {/* シミュレーター本体 */}
      <section aria-label="固定資産税シミュレーター">
        <EmptyHouseTaxSimulator
          compact={false}
          initialPrefecture={area.prefecture}
          initialCityLabel={area.city}
        />
      </section>

      {/* シミュレーション結果が高かったら → 売却査定CTA（ノムコムA8） */}
      <RealEstateAppraisalCard cityName={area.city} cityId={ids.cityId} />

      {/* 3つの選択肢を整理（売却・解体・活用） */}
      <section className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 className="font-bold text-primary">
            {area.city}の空き家、3つの選択肢を比較する
          </h2>
        </div>
        <div className="p-6 grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs font-bold text-emerald-700 mb-1 uppercase tracking-wide">
              選択肢A
            </p>
            <p className="font-bold text-foreground/90 mb-2">そのまま売却</p>
            <p className="text-sm text-foreground/70 leading-relaxed">
              解体費用がかからず、買主が活用方法を決める。古家付き土地として売り出すケースが多い。3,000万円特別控除を活かせる可能性。
            </p>
            <Link
              href="#appraisal-section"
              className="inline-block mt-3 text-sm font-bold text-primary hover:underline"
            >
              無料査定で価値を確認 →
            </Link>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs font-bold text-amber-700 mb-1 uppercase tracking-wide">
              選択肢B
            </p>
            <p className="font-bold text-foreground/90 mb-2">解体して更地売却</p>
            <p className="text-sm text-foreground/70 leading-relaxed">
              木造30坪で90万〜150万円が目安。
              {area.city}に解体補助金がある場合、自己負担を大きく減らせます。更地化で売却価格が上がるケースも。
            </p>
            <Link
              href={`/area/${ids.prefectureId}/${ids.cityId}/subsidy`}
              className="inline-block mt-3 text-sm font-bold text-primary hover:underline"
            >
              {area.city}の解体補助金を確認 →
            </Link>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs font-bold text-sky-700 mb-1 uppercase tracking-wide">
              選択肢C
            </p>
            <p className="font-bold text-foreground/90 mb-2">活用（賃貸・民泊）</p>
            <p className="text-sm text-foreground/70 leading-relaxed">
              固定資産税は引き続き発生しますが、家賃収入で相殺できる可能性。リフォーム費用・空室リスクを試算してから判断を。
            </p>
            <Link
              href={`/area/${ids.prefectureId}/${ids.cityId}/cost`}
              className="inline-block mt-3 text-sm font-bold text-primary hover:underline"
            >
              {area.city}の費用相場を確認 →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 className="font-bold text-primary">{area.city}の空き家・固定資産税 よくある質問</h2>
        </div>
        <dl className="divide-y divide-border">
          <div className="px-6 py-4">
            <dt className="font-bold text-foreground/90 mb-1">
              Q. {area.city}の固定資産税は実際いくらですか？
            </dt>
            <dd className="text-sm text-foreground/70 leading-relaxed">
              A. 固定資産税は「固定資産税評価額 × 1.4%」で算出されます。
              {area.city}
              の住宅用地は通常6分の1に減額されますが、特定空家に指定されるとこの減額が外れ、最大6倍に。上記シミュレーターで概算を確認できます。
            </dd>
          </div>
          <div className="px-6 py-4">
            <dt className="font-bold text-foreground/90 mb-1">
              Q. 空き家を売却するとどれくらい税金が安くなりますか？
            </dt>
            <dd className="text-sm text-foreground/70 leading-relaxed">
              A. 相続から3年以内の売却で「3,000万円特別控除」を利用できる可能性があり、譲渡所得税を大きく圧縮できます。詳細は税理士・専門家へ。まずは無料査定で売却可能価格を把握するのが第一歩です。
            </dd>
          </div>
          <div className="px-6 py-4">
            <dt className="font-bold text-foreground/90 mb-1">
              Q. 解体すれば固定資産税は下がりますか？
            </dt>
            <dd className="text-sm text-foreground/70 leading-relaxed">
              A. 建物分の固定資産税はゼロになりますが、土地の住宅用地特例が外れて土地の固定資産税が約6倍に上昇します。「解体→売却までの期間」を短くする計画が重要です。
            </dd>
          </div>
        </dl>
      </section>

      {/* 補足 + 関連リンク */}
      <div className="rounded-xl bg-card p-5 border border-border">
        <p className="text-sm text-foreground/60 leading-relaxed">
          実際の税額は評価額・自治体により異なります。{area.city}
          の空き家については特例措置の対象になる場合もあります。売却・活用のご相談は
          <Link href="/articles/master-guide" className="text-primary hover:underline mx-1">
            はじめかた
          </Link>
          から提携サービスをご案内しています。
        </p>
      </div>

      <nav aria-label="関連ページ" className="flex flex-wrap gap-3 pt-2">
        <Link
          href={`/area/${ids.prefectureId}/${ids.cityId}/subsidy`}
          className="inline-block rounded-lg border border-primary text-primary px-4 py-2 text-sm font-bold hover:bg-primary-light/30 transition"
        >
          {area.city}の解体補助金
        </Link>
        <Link
          href={`/area/${ids.prefectureId}/${ids.cityId}`}
          className="inline-block rounded-lg border border-border text-foreground/80 px-4 py-2 text-sm hover:bg-primary-light/20 transition"
        >
          {area.city}の粗大ゴミ・遺品整理
        </Link>
        <Link
          href={`/area/${ids.prefectureId}/${ids.cityId}/cost`}
          className="inline-block rounded-lg border border-border text-foreground/80 px-4 py-2 text-sm hover:bg-primary-light/20 transition"
        >
          {area.city}の費用相場
        </Link>
        <Link
          href="/tools/empty-house-tax"
          className="inline-block text-foreground/60 text-sm hover:text-primary hover:underline self-center"
        >
          シミュレーターTOP
        </Link>
      </nav>
    </div>
  );
}
