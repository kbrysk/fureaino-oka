import Link from "next/link";
import { getMunicipalityDataOrDefault, getMunicipalitiesByPrefecture } from "../../../../lib/data/municipalities";
import { getAreaById, getAreaIds } from "../../../../lib/area-data";
import { getAreaContent } from "../../../../lib/getAreaContent";
import { getAreaContentsStaticParams } from "../../../../lib/utils/area-contents-paths";
import { translateBureaucraticToPlain } from "../../../../lib/subsidy-translate";
import { generateFaqSchema } from "../../../../lib/faq/schema";
import { getCanonicalBase } from "../../../../lib/site-url";
import { getRegionalStats } from "../../../../lib/utils/regional-stats-loader";
import AreaBreadcrumbs from "../../../../components/AreaBreadcrumbs";
import CostSimulator from "../../../../components/CostSimulator";
import NearbySubsidyLinks from "../../../../components/NearbySubsidyLinks";
import SpokeInternalLinks from "../../../../components/SpokeInternalLinks";
import OperatorTrustBlock from "../../../../components/OperatorTrustBlock";
import AreaSurveyCredit from "../../../../components/AreaSurveyCredit";
import AreaDirectoryFallback from "../../../../components/AreaDirectoryFallback";
import RegionalFaq from "../../../../components/RegionalFaq";
import RealEstateAppraisalCard from "../../../../components/RealEstateAppraisalCard";
import { pageTitle } from "../../../../lib/site-brand";
import type { FaqItem } from "../../../../lib/faq/schema";

export const dynamicParams = true;
export const revalidate = 86400;

const CURRENT_YEAR = new Date().getFullYear();

interface Props {
  params: Promise<{ prefecture: string; city: string }>;
}

/** 補助金額テキストからタイトル用「上限〇〇万円」を抽出。無い場合は null */
function extractMaxAmountForTitle(maxAmountRaw: string | undefined): string | null {
  if (!maxAmountRaw || /詳細確認中|お問い合わせ|—|－/.test(maxAmountRaw)) return null;
  const matches = maxAmountRaw.match(/(\d+)\s*万/g);
  if (!matches?.length) return null;
  const maxVal = Math.max(...matches.map((m) => parseInt(m.replace(/\D/g, ""), 10)));
  return maxVal ? `${maxVal}万円` : null;
}

export async function generateStaticParams() {
  return getAreaContentsStaticParams().map(({ prefecture, city }) => ({
    prefecture,
    city,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { prefecture, city } = await params;
  const area = getAreaById(prefecture, city);
  const fallbackNames = { prefName: area?.prefecture ?? prefecture, cityName: area?.city ?? city };
  const data = await getMunicipalityDataOrDefault(prefecture, city, fallbackNames);
  const areaContent = await getAreaContent(prefecture, city);
  const subsidyInfo = areaContent?.subsidyInfo ?? (data.subsidy?.maxAmount ? {
    name: data.subsidy.name ?? "",
    maxAmount: data.subsidy.maxAmount ?? "",
    condition: data.subsidy.conditions ?? "",
    contact: "",
  } : null);

  const cityName = areaContent?.cityName ?? data.cityName;
  const maxForTitle = extractMaxAmountForTitle(subsidyInfo?.maxAmount);

  const title = maxForTitle
    ? `${cityName}の解体補助金（${CURRENT_YEAR}年最新）| 上限${maxForTitle}の受給条件と申請方法をプロが解説`
    : `${cityName}の解体補助金（${CURRENT_YEAR}年最新）| 受給条件と申請方法をプロが解説`;

  const description = maxForTitle
    ? `${cityName}で実家の解体・処分をお考えの方へ。最大${maxForTitle}が支給される空き家解体補助金の条件や、令和${CURRENT_YEAR - 2018}年度の最新情報を分かりやすく翻訳。固定資産税が6倍になる前に知っておきたい節税対策も公開中。`
    : `${cityName}で実家の解体・処分をお考えの方へ。空き家解体補助金の条件や、令和${CURRENT_YEAR - 2018}年度の最新情報を分かりやすく翻訳。固定資産税が6倍になる前に知っておきたい節税対策も公開中。`;

  return {
    title: pageTitle(title),
    description,
    alternates: { canonical: `${getCanonicalBase()}/area/${prefecture}/${city}/subsidy` },
  };
}

export default async function AreaSubsidyPage({ params }: Props) {
  const { prefecture, city } = await params;
  const area = getAreaById(prefecture, city);
  const fallbackNames = { prefName: area?.prefecture ?? prefecture, cityName: area?.city ?? city };
  const data = await getMunicipalityDataOrDefault(prefecture, city, fallbackNames);
  const areaContent = await getAreaContent(prefecture, city);
  const ids = area ? getAreaIds(area.prefecture, area.city)! : { prefectureId: prefecture, cityId: city };

  const cityName = areaContent?.cityName ?? data.cityName;
  const prefName = data.prefName;
  const subsidyInfo = areaContent?.subsidyInfo ?? (data.subsidy?.maxAmount && data.subsidy?.name ? {
    name: data.subsidy.name,
    maxAmount: data.subsidy.maxAmount,
    condition: data.subsidy.conditions ?? "",
    contact: "",
  } : null);

  const hasConcreteAmount =
    subsidyInfo?.maxAmount &&
    /[0-9０-９]|万|円|上限/.test(subsidyInfo.maxAmount) &&
    subsidyInfo.maxAmount !== "—" &&
    !/詳細確認中|お問い合わせ/.test(subsidyInfo.maxAmount);

  const base = getCanonicalBase();
  const pageUrl = `${base}/area/${prefecture}/${city}/subsidy`;

  // FAQ: 地域JSONの「解体補助金」関連 + 共通補助金FAQ
  const localFaqs = (areaContent?.faqs ?? []).filter(
    (f) => f.question.includes("解体補助金") || f.question.includes("補助金")
  );
  const commonSubsidyFaqs: FaqItem[] = [
    {
      question: "空き家を放置すると固定資産税はどうなりますか？",
      answer: "空き家対策特別措置法により、一定の「特定空き家」に指定されると、固定資産税の優遇措置が外れ、最大で従来の約6倍になる可能性があります。早めの解体・売却・活用の検討をおすすめします。",
    },
    {
      question: "補助金と売却を組み合わせることはできますか？",
      answer: "はい。補助金で解体費用を抑えつつ、更地にしてから売却すると、実質的な負担が軽くなるケースがあります。まずは無料の一括見積もりで解体費用と、無料査定で土地の価値を確認してみてください。",
    },
  ];
  const faqItems: FaqItem[] = [
    ...localFaqs.map((f) => ({ question: f.question, answer: f.answer })),
    ...commonSubsidyFaqs,
  ];
  const faqSchema = generateFaqSchema(faqItems, { url: pageUrl });

  if (data._isDefault && !areaContent) {
    return (
      <div className="space-y-8">
        <AreaBreadcrumbs
          prefecture={prefName}
          city={cityName}
          prefectureId={data.prefId}
          cityId={data.cityId}
          page="subsidy"
        />
        <div>
          <h1 className="text-2xl font-bold text-primary">
            【{CURRENT_YEAR}年最新】{cityName}の空き家補助金・遺品整理の公式窓口
          </h1>
        </div>
        <div className="my-8 rounded-xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
          <p className="mb-3 font-bold text-yellow-800 flex items-center gap-2">
            <span className="text-xl" aria-hidden>💡</span> 【重要】補助金を使って解体・改修する前に！
          </p>
          <p className="text-sm leading-relaxed text-gray-700">
            解体費用を払って更地にするよりも、場合によっては<strong>「そのまま売却」</strong>した方が手元に多くのお金が残るケースがあります。行動を起こす前に、まずはご実家・空き家の「現在の価値」を無料で把握しておくことをおすすめします。
          </p>
        </div>
        <AreaDirectoryFallback
          cityName={cityName}
          prefName={prefName}
          prefId={data.prefId}
          cityId={data.cityId}
          faqItems={[]}
        />
        <div className="flex flex-wrap gap-3">
          <Link href="/area" className="inline-block text-foreground/60 text-sm hover:text-primary hover:underline">
            ← 地域一覧（全国）へ
          </Link>
          <Link href={`/area/${data.prefId}/${data.cityId}`} className="inline-block text-primary font-medium hover:underline">
            ← {cityName}の粗大ゴミ・遺品整理ページへ
          </Link>
        </div>
        <StickyCta cityName={cityName} prefId={data.prefId} cityId={data.cityId} />
        <AreaSurveyCredit />
        <footer className="pt-8 mt-8 border-t border-border text-sm text-foreground/60">
          <p className="font-medium text-foreground/80 mb-1">監修</p>
          <p>税制・補助金に関する記載は税理士の監修を受けております。詳細は自治体・専門家にご確認ください。</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <AreaBreadcrumbs
        prefecture={prefName}
        city={cityName}
        prefectureId={ids.prefectureId}
        cityId={ids.cityId}
        page="subsidy"
      />

      {/* A. ヒーローセクション */}
      <section className="rounded-2xl bg-gradient-to-br from-primary/10 to-amber-50 border border-primary/20 p-6 sm:p-8">
        <p className="text-lg sm:text-xl font-bold text-primary mb-6 text-center">
          その実家、壊す前に補助金をチェック！
        </p>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
          <div className="rounded-xl bg-white border border-primary/20 p-5 shadow-sm">
            <p className="text-xs font-bold text-foreground/60 uppercase tracking-wide mb-1">補助金名</p>
            <p className="font-bold text-foreground/90 break-words">
              {subsidyInfo?.name ?? `${cityName}の空き家解体補助金`}
            </p>
          </div>
          <div className="rounded-xl bg-white border border-primary/20 p-5 shadow-sm">
            <p className="text-xs font-bold text-foreground/60 uppercase tracking-wide mb-1">最大金額</p>
            {hasConcreteAmount ? (
              <p className="font-bold text-primary text-lg">{subsidyInfo!.maxAmount}</p>
            ) : (
              <p className="font-bold text-foreground/80">{cityName}の最新予算を窓口で確認する</p>
            )}
          </div>
          <div className="rounded-xl bg-white border border-primary/20 p-5 shadow-sm">
            <p className="text-xs font-bold text-foreground/60 uppercase tracking-wide mb-1">窓口</p>
            <p className="font-medium text-foreground/90 break-words">
              {subsidyInfo?.contact || `${cityName}の建築指導課・空き家対策担当など`}
            </p>
          </div>
        </div>
      </section>

      <section id="cost-simulator-section" aria-label="解体・片付け費用シミュレーター">
        <CostSimulator
          cityName={cityName}
          cityId={ids.cityId}
          prefId={prefecture}
          regionalStats={getRegionalStats(`${prefecture}-${city}`)}
          subsidyInfo={subsidyInfo ?? undefined}
          hasNarrowAccess={areaContent ? /坂|階段/.test(areaContent.empatheticLead ?? "") : false}
          hasSnowRegion={areaContent ? /豪雪|積雪/.test(areaContent.empatheticLead ?? "") : false}
        />
      </section>

      {/* B. 役所言葉の「翻訳」セクション */}
      {subsidyInfo?.condition && (
        <section className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-primary-light/30">
            <h2 className="font-bold text-primary">役所の言葉を、わかりやすく翻訳しました</h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-foreground/60">（お金をもらうために守るべきルールを、やさしい言葉に置き換えています）</p>
            <div className="rounded-xl bg-amber-50/80 border border-amber-200/60 p-5">
              <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                {translateBureaucraticToPlain(subsidyInfo.condition)}
              </p>
            </div>
            <p className="text-xs text-foreground/50">
              制度の要件・申請方法は自治体により異なります。必ずお住まいの市区町村窓口または税理士にご確認ください。
            </p>
          </div>
        </section>
      )}

      {/* C. 放置のリスクと解決策 */}
      <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
        <h2 className="font-bold text-amber-900/90 mb-4 flex items-center gap-2">
          <span aria-hidden>⚠️</span> 空き家を放置すると、固定資産税が最大6倍になる可能性があります
        </h2>
        <p className="text-sm text-foreground/80 leading-relaxed mb-4">
          「空き家対策特別措置法」により、危険や不衛生と判断された空き家は「特定空き家」に指定されることがあります。指定されると、固定資産税の優遇が外れ、これまでの約6倍になるケースも。早めに「補助金＋解体＋売却」を検討すれば、実質プラスになる可能性もあります。
        </p>
        <Link
          href="/articles/master-guide"
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-5 py-3 font-bold text-sm hover:opacity-90 transition"
        >
          <span>無料で解体・一括見積もりを依頼する</span>
          <span aria-hidden>→</span>
        </Link>
      </section>

      {/* 売却・査定の選択肢 */}
      <RealEstateAppraisalCard
        cityName={cityName}
        cityId={ids.cityId}
        localRiskText={data.mascot?.localRiskText}
      />

      {/* 地域特化FAQ（アコーディオン + FAQPage JSON-LD・単一データソース） */}
      <RegionalFaq cityName={cityName} />

      {/* その他FAQ（地域JSON・共通補助金FAQ） */}
      {faqItems.length > 0 && (
        <section className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-primary-light/30">
            <h2 className="font-bold text-primary">{cityName}の補助金 その他の質問</h2>
          </div>
          <dl className="divide-y divide-border">
            {faqItems.map((item, i) => (
              <div key={i} className="px-6 py-4">
                <dt className="font-bold text-foreground/90 mb-1">Q. {item.question}</dt>
                <dd className="text-sm text-foreground/70 leading-relaxed">A. {item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <NearbySubsidyLinks
        cityName={cityName}
        prefId={ids.prefectureId}
        neighbours={getMunicipalitiesByPrefecture(ids.prefectureId)
          .filter((m) => m.cityId !== ids.cityId)
          .slice(0, 6)
          .map((m) => ({ cityId: m.cityId, cityName: m.cityName }))}
      />

      <SpokeInternalLinks
        prefId={ids.prefectureId}
        cityId={ids.cityId}
        prefName={prefName}
        cityName={cityName}
        currentSpoke="subsidy"
      />
      <OperatorTrustBlock />

      <div className="flex flex-wrap gap-3">
        <Link href="/area" className="inline-block text-foreground/60 text-sm hover:text-primary hover:underline">
          ← 地域一覧（全国）へ
        </Link>
        <Link href={`/area/${ids.prefectureId}/${ids.cityId}`} className="inline-block text-primary font-medium hover:underline">
          ← {cityName}の粗大ゴミ・遺品整理ページへ
        </Link>
      </div>

      <StickyCta cityName={cityName} prefId={ids.prefectureId} cityId={ids.cityId} />

      <AreaSurveyCredit />
      <footer className="pt-8 mt-8 border-t border-border text-sm text-foreground/60">
        <p className="font-medium text-foreground/80 mb-1">監修</p>
        <p>税制・補助金に関する記載は税理士の監修を受けております。詳細は自治体・専門家にご確認ください。</p>
      </footer>
    </div>
  );
}

function StickyCta({
  cityName,
  prefId,
  cityId,
}: {
  cityName: string;
  prefId: string;
  cityId: string;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white/95 backdrop-blur-sm shadow-lg safe-area-pb">
      <div className="mx-auto max-w-lg px-4 py-3 flex items-center justify-center gap-3">
        <Link
          href="/articles/master-guide"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white py-3.5 px-4 font-bold text-sm hover:opacity-90 transition touch-manipulation"
        >
          <span className="inline-block w-5 h-5" aria-hidden>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          無料見積もり・相談
        </Link>
        <Link
          href={`/area/${prefId}/${cityId}`}
          className="inline-flex items-center justify-center rounded-xl border-2 border-primary text-primary py-3.5 px-4 font-bold text-sm hover:bg-primary/5 transition touch-manipulation"
        >
          {cityName}の総合ガイド
        </Link>
      </div>
    </div>
  );
}
