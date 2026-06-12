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
import { getNationalContextForCity, formatYenAsMan } from "../../../../lib/data/municipality-stats";
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

  return (
    <div className="space-y-8">
      <JsonLd data={breadcrumb} />
      <JsonLd data={localBizSchema} />
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

      {(() => {
        const ctx = getNationalContextForCity(prefecture, city);
        return (
          <section aria-labelledby="cost-subsidy-context" className="rounded-2xl border border-border bg-primary/5 p-5">
            <h2 id="cost-subsidy-context" className="mb-2 text-lg font-bold">
              {cityName}の解体費用は補助金で抑えられる？
            </h2>
            {ctx.hasSubsidy ? (
              <p className="text-sm leading-relaxed text-foreground/85">
                {cityName}では、空き家・老朽家屋の解体補助金を<strong>確認できています</strong>
                {ctx.cityAmountYen ? (
                  <>
                    （上限額の目安 <strong>{formatYenAsMan(ctx.cityAmountYen)}</strong>
                    {ctx.nationalRank ? `／金額を確認できた全国${ctx.nationalRankPool.toLocaleString("ja-JP")}自治体中 ${ctx.nationalRank}位` : ""}）
                  </>
                ) : ""}
                。解体費用から、この補助金を差し引ける可能性があります。
              </p>
            ) : (
              <p className="text-sm leading-relaxed text-foreground/85">
                {cityName}では現時点で、解体補助金を公式情報から確認できていません（制度の新設・更新で変わる場合があります）。費用を抑えるには、複数社の見積もり比較が有効です。
              </p>
            )}
            <p className="mt-2 text-sm text-foreground/70">
              全国では{ctx.nationalCoveragePercent}%（{ctx.nationalWithSubsidy.toLocaleString("ja-JP")}/{ctx.nationalTotal.toLocaleString("ja-JP")}自治体）で解体補助金を確認。上限額の全国中央値は約50万円です。
            </p>
            <p className="mt-2 text-sm">
              →{" "}
              <Link href={`/area/${prefecture}/${city}/subsidy`} className="font-medium text-primary hover:underline">
                {cityName}の解体補助金（対象条件・申請の流れ）
              </Link>
              {" ／ "}
              <Link href="/akiya/kaitai-hojokin" className="font-medium text-primary hover:underline">
                解体補助金 完全ガイド
              </Link>
            </p>
          </section>
        );
      })()}

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

      {/* 勝ちクラスタ集中(2026-06): 費用文脈→「解体後の固定資産税」へ tax-simulator(平均17位)を橋渡し */}
      <section
        aria-label="固定資産税シミュレーター案内"
        className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary-light/30 to-white p-6"
      >
        <h2 className="text-lg font-bold text-primary mb-2">
          解体費用だけでなく「解体後の固定資産税」も確認を
        </h2>
        <p className="text-sm text-foreground/70 leading-relaxed mb-4">
          更地にすると住宅用地特例が外れ、土地の固定資産税が上がる場合があります。
          解体の総コストは「工事費 −補助金 ＋税額の変化」で判断するのが確実です。
        </p>
        <Link
          href={`/tax-simulator/${ids.prefectureId}/${ids.cityId}`}
          className="inline-block bg-primary text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition"
        >
          {cityName}の固定資産税の変化を1分で試算 →
        </Link>
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
