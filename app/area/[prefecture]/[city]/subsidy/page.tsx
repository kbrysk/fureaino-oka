import Link from "next/link";
import { getMunicipalityDataOrDefault, getMunicipalitiesByPrefecture } from "../../../../lib/data/municipalities";
import { getAreaById, getAreaIds } from "../../../../lib/area-data";
import { getAreaContent } from "../../../../lib/getAreaContent";
import { getAreaContentsStaticParams } from "../../../../lib/utils/area-contents-paths";
import { translateBureaucraticToPlain } from "../../../../lib/subsidy-translate";
import { generateFaqSchema } from "../../../../lib/faq/schema";
import { getSubsidyFaq } from "../../../../lib/faq/area-subsidy-garbage-faq";
import { getSubsidyDirectAnswerFaq } from "../../../../lib/faq/direct-answer-faq";
import { buildRegionalFaqItems } from "../../../../lib/regional-faq-data";
import { getCanonicalBase } from "../../../../lib/site-url";
import { generateBreadcrumbSchema } from "../../../../lib/schema/breadcrumb";
import { generateLocalBusinessSchema } from "../../../../lib/schema/local-business";
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
import { TableOfContents } from "../../../../components/TableOfContents";
import { SubsidySummaryBox } from "../../../../components/SubsidySummaryBox";
import { PageLead } from "../../../../components/PageLead";
import { RelatedCitiesInPrefecture } from "../../../../components/RelatedCitiesInPrefecture";
import JsonLd from "../../../../components/JsonLd";
import { SubsidyCostSection } from "../../../../components/SubsidyCostSection";
import { DirectAnswerFaq } from "../../../../components/DirectAnswerFaq";
import UpdateBanner from "../../../../components/UpdateBanner";
import { pageTitle } from "../../../../lib/site-brand";
import type { FaqItem, FaqPageSchema } from "../../../../lib/faq/schema";
// S1: _isDefaultページ CTR改善 メタ修正 2026-03（Search Console CTR=0%改善）
// S4: 解体費用目安セクション追加（「解体費用 ○○市」クエリ取り込み）2026-03

export const dynamicParams = true;
export const revalidate = 86400;

const CURRENT_YEAR = new Date().getFullYear();

interface Props {
  params: Promise<{ prefecture: string; city: string }>;
}

/** maxAmountから「最大○○万円」部分のみ抽出（title用）。例: "最大50万円（費用の1/2以内）" → "最大50万円" */
function extractMaxAmount(maxAmount: string | null | undefined): string | null {
  if (!maxAmount || /詳細確認中|お問い合わせ|—|－/.test(maxAmount)) return null;
  const match = maxAmount.match(/最大[\d,]+万円/);
  return match ? match[0] : maxAmount.split("（")[0].trim() || null;
}

/** S4: 補助金上限額テキストから円換算の数値を取得（SubsidyCostSection・FAQ用） */
function parseMaxSubsidyAmountYen(maxAmountRaw: string | undefined): number | null {
  if (!maxAmountRaw || /詳細確認中|お問い合わせ|—|－/.test(maxAmountRaw)) return null;
  const matches = maxAmountRaw.match(/(\d+)\s*万/g);
  if (!matches?.length) return null;
  const maxVal = Math.max(...matches.map((m) => parseInt(m.replace(/\D/g, ""), 10)));
  return maxVal ? maxVal * 10000 : null;
}

/** 空・不明扱いの文字列か */
function isEmptyOrUnknown(s: string | null | undefined): boolean {
  if (s == null || typeof s !== "string") return true;
  const t = s.trim();
  return t === "" || t === "—" || t === "－" || /不明|情報なし/.test(t);
}

/**
 * FAQPage 用の mainEntity を生成（1ページ1スキーマ・PDF指示の5項目）。
 * Q1〜Q3 はデータがある場合のみ、Q4・Q5 は常に出力。
 */
function buildSubsidyFaqPageEntities(
  cityName: string,
  maxAmountRaw: string | null | undefined,
  conditions: string | null | undefined,
  period: string | null | undefined
): FaqPageSchema["mainEntity"] {
  const entities: FaqPageSchema["mainEntity"] = [];

  const maxAmount = extractMaxAmount(maxAmountRaw ?? undefined);
  if (maxAmount) {
    entities.push({
      "@type": "Question",
      name: `${cityName}の空き家解体補助金はいくらもらえますか？`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${cityName}の空き家解体補助金は${maxAmount}です。補助の対象となる工事内容や申請条件は年度によって変わるため、最新情報は${cityName}の担当窓口へご確認ください。`,
      },
    });
  }

  if (!isEmptyOrUnknown(conditions)) {
    const conditionsStr = typeof conditions === "string" ? conditions : "";
    if (conditionsStr.trim()) {
      entities.push({
        "@type": "Question",
        name: `${cityName}の空き家解体補助金の申請条件は何ですか？`,
        acceptedAnswer: { "@type": "Answer", text: conditionsStr.trim() },
      });
    }
  }

  if (!isEmptyOrUnknown(period)) {
    entities.push({
      "@type": "Question",
      name: `${cityName}の解体補助金の申請時期はいつですか？`,
      acceptedAnswer: { "@type": "Answer", text: period!.trim() },
    });
  }

  entities.push({
    "@type": "Question",
    name: "解体工事の費用の目安はいくらですか？",
    acceptedAnswer: {
      "@type": "Answer",
      text: "木造住宅の解体費用は坪単価3万〜5万円が目安です。30坪の場合で90万〜150万円程度になります。建物の構造・立地・付帯工事の有無によって異なります。無料見積もりで正確な費用を確認することをおすすめします。",
    },
  });

  entities.push({
    "@type": "Question",
    name: "補助金を使って解体する手順を教えてください。",
    acceptedAnswer: {
      "@type": "Answer",
      text: "①市区町村の担当窓口で補助金の申請受付を確認する、②解体業者から見積もりを取得する、③補助金の事前申請を行う（着工前の申請が必須）、④工事完了後に実績報告書を提出する、⑤補助金が交付される、という流れが一般的です。自治体によって手順が異なるため、必ず事前に窓口へ確認してください。",
    },
  });

  return entities;
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
  const hasNoSubsidyMeta = data.subsidy?.hasSubsidy === false;
  const subsidyInfo = areaContent?.subsidyInfo ?? (hasNoSubsidyMeta
    ? null
    : data.subsidy?.maxAmount
      ? {
          name: data.subsidy.name ?? "",
          maxAmount: data.subsidy.maxAmount ?? "",
          condition: Array.isArray(data.subsidy.conditions) ? data.subsidy.conditions.join("。") : (data.subsidy.conditions ?? ""),
          contact: "",
        }
      : null);

  const cityName = areaContent?.cityName ?? data.cityName;
  const prefName = data.prefName;

  const base = getCanonicalBase();
  const canonicalSubsidy = `${base}/area/${prefecture}/${city}/subsidy`;

  const currentYear = new Date().getFullYear();
  // 金額は「最大○万円」がデータに存在する場合のみ表示（デフォルト値は使わない。municipalities の未登録は maxAmount なし、area-contents の "—" は extractMaxAmount で null）
  const maxAmountShort = extractMaxAmount(subsidyInfo?.maxAmount ?? data.subsidy?.maxAmount ?? null);
  const amountText = maxAmountShort ? ` ${maxAmountShort}` : "";
  const amountSentence = maxAmountShort
    ? `${maxAmountShort}の補助が受けられる可能性があります。`
    : "";

  // title: 【{year}年最新】{市区町村名} 空き家解体補助金{金額テキスト} | 申請条件・方法を解説（32文字目標）
  let titleBase = `【${currentYear}年最新】${cityName} 空き家解体補助金${amountText}`;
  const suffix = " | 申請条件・方法を解説";
  let titleFinal =
    titleBase.length + suffix.length <= 32
      ? `${titleBase}${suffix}`
      : titleBase;

  // meta description: 120文字以内厳守
  const description =
    `${cityName}の空き家・老朽家屋の解体に使える補助金を解説。${amountSentence}対象条件・必要書類・申請の流れをわかりやすくまとめています。無料で補助金診断もできます。`;
  const descriptionFinal = description.length > 120 ? description.slice(0, 119) + "…" : description;

  const fullTitle = pageTitle(titleFinal);
  return {
    title: fullTitle,
    description: descriptionFinal,
    alternates: { canonical: canonicalSubsidy },
    openGraph: {
      title: fullTitle,
      description: descriptionFinal,
      url: canonicalSubsidy,
    },
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
  const hasNoSubsidy = data.subsidy?.hasSubsidy === false;
  const subsidyInfo = areaContent?.subsidyInfo ?? (hasNoSubsidy
    ? null
    : data.subsidy?.maxAmount && data.subsidy?.name
      ? {
          name: data.subsidy.name,
          maxAmount: data.subsidy.maxAmount,
          condition: Array.isArray(data.subsidy.conditions)
            ? data.subsidy.conditions.join("。")
            : (data.subsidy.conditions ?? ""),
          contact: data.subsidy.windowName ? `${data.subsidy.windowName}${data.subsidy.windowPhone ? `（${data.subsidy.windowPhone}）` : ""}` : "",
        }
      : null);

  const hasConcreteAmount =
    subsidyInfo?.maxAmount &&
    /[0-9０-９]|万|円|上限/.test(subsidyInfo.maxAmount) &&
    subsidyInfo.maxAmount !== "—" &&
    !/詳細確認中|お問い合わせ/.test(subsidyInfo.maxAmount);

  const maxSubsidyAmount = parseMaxSubsidyAmountYen(subsidyInfo?.maxAmount) ?? null;

  const base = getCanonicalBase();
  const pageUrl = `${base}/area/${prefecture}/${city}/subsidy`;
  const breadcrumb = generateBreadcrumbSchema([
    { name: "ホーム", url: `${base}/` },
    { name: "地域一覧", url: `${base}/area` },
    { name: prefName, url: `${base}/area/${prefecture}` },
    { name: cityName, url: `${base}/area/${prefecture}/${city}` },
    { name: `${cityName}の補助金・助成金`, url: `${base}/area/${prefecture}/${city}/subsidy` },
  ]);

  // UI用FAQ（アコーディオン・TOC用。JSON-LDとは別）
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
  const subsidyFaqSet = getSubsidyFaq(cityName);
  const faqItems: FaqItem[] = [
    ...subsidyFaqSet,
    ...localFaqs.map((f) => ({ question: f.question, answer: f.answer })),
    ...commonSubsidyFaqs.filter((c) => c.question !== "空き家を放置すると固定資産税はどうなりますか？"),
  ];
  const directFaqItems = getSubsidyDirectAnswerFaq(cityName, maxSubsidyAmount);

  // FAQPage JSON-LD: 1ページ1スキーマ（PDF指示の5項目・データありの項目のみ出力）
  const conditionsStr =
    areaContent?.subsidyInfo?.condition ??
    (Array.isArray(data.subsidy?.conditions) ? data.subsidy.conditions.join("。") : data.subsidy?.conditions ?? null);
  const periodStr = data.subsidy?.applicationPeriod ?? (areaContent?.subsidyInfo as { period?: string } | undefined)?.period ?? null;
  const faqPageEntities = buildSubsidyFaqPageEntities(
    cityName,
    subsidyInfo?.maxAmount ?? data.subsidy?.maxAmount ?? null,
    conditionsStr,
    periodStr
  );
  const faqSchema: FaqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqPageEntities,
  };
  const localBizSchema = generateLocalBusinessSchema({
    cityName,
    prefectureName: prefName,
    prefecture,
    city,
    pageType: "subsidy",
  });

  if (data._isDefault && !areaContent) {
    const fallbackConditions =
      Array.isArray(data.subsidy?.conditions) ? data.subsidy.conditions.join("。") : data.subsidy?.conditions ?? null;
    const fallbackFaqEntities = buildSubsidyFaqPageEntities(
      cityName,
      data.subsidy?.maxAmount ?? null,
      fallbackConditions,
      data.subsidy?.applicationPeriod ?? null
    );
    const fallbackFaqSchema: FaqPageSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: fallbackFaqEntities,
    };
    const fallbackWebPageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      datePublished: "2026-02-15",
      dateModified: "2026-03-17",
    };
    return (
      <div className="space-y-10">
        <JsonLd data={breadcrumb} />
        {fallbackFaqSchema.mainEntity.length > 0 && <JsonLd data={fallbackFaqSchema} />}
        <JsonLd data={fallbackWebPageSchema} />
        <JsonLd data={localBizSchema} />
        <AreaBreadcrumbs
          prefecture={prefName}
          city={cityName}
          prefectureId={data.prefId}
          cityId={data.cityId}
          page="subsidy"
        />
        <UpdateBanner />
        <div>
          <h1 className="text-2xl font-bold text-primary">
            【{CURRENT_YEAR}年最新】{cityName}の空き家補助金・遺品整理の公式窓口
          </h1>
        </div>
        <PageLead text={`${cityName}の空き家解体補助金の受給条件・申請方法・上限額をこのページで確認できます。`} />
        <div className="my-8 rounded-xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
          <p className="mb-3 font-bold text-yellow-800 flex items-center gap-2">
            <span className="text-xl" aria-hidden>💡</span> 【重要】補助金を使って解体・改修する前に！
          </p>
          <p className="text-base leading-relaxed text-gray-700">
            解体費用を払って更地にするよりも、場合によっては<strong>「そのまま売却」</strong>した方が手元に多くのお金が残るケースがあります。行動を起こす前に、まずはご実家・空き家の「現在の価値」を無料で把握しておくことをおすすめします。
          </p>
        </div>
        {hasNoSubsidy && data.subsidy?.noSubsidyNote && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-bold text-amber-800 mb-1">
              ⚠️ {cityName}の補助金制度について
            </p>
            <p className="text-sm text-amber-700">
              {data.subsidy.noSubsidyNote}
            </p>
            {data.subsidy.windowPhone && (
              <p className="text-sm text-amber-700 mt-2">
                窓口：{data.subsidy.windowName}（{data.subsidy.windowPhone}）
              </p>
            )}
          </div>
        )}
        <AreaDirectoryFallback
          cityName={cityName}
          prefName={prefName}
          prefId={data.prefId}
          cityId={data.cityId}
          faqItems={[]}
        />
        <DirectAnswerFaq
          items={getSubsidyDirectAnswerFaq(cityName, null)}
          sectionTitle={`${cityName}の補助金 よくある質問`}
        />
        {!hasNoSubsidy && <SubsidyCostSection cityName={cityName} maxSubsidyAmount={null} />}
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

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    datePublished: "2026-02-15",
    dateModified: "2026-03-17",
  };

  return (
    <div className="space-y-10 pb-24">
      <JsonLd data={breadcrumb} />
      {faqSchema.mainEntity.length > 0 && <JsonLd data={faqSchema} />}
      <JsonLd data={webPageSchema} />
      <JsonLd data={localBizSchema} />
      <AreaBreadcrumbs
        prefecture={prefName}
        city={cityName}
        prefectureId={ids.prefectureId}
        cityId={ids.cityId}
        page="subsidy"
      />

      {/* 2026年度版バナー（全 subsidy ページで表示） */}
      <UpdateBanner />

      {/* A. ヒーローセクション（制度ありの場合のみ） */}
      {!hasNoSubsidy && (
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
      )}

      {(() => {
        const tocItems = [
          { id: "cost-simulator-section", label: "費用シミュレーター" },
          ...(subsidyInfo?.condition ? [{ id: "conditions", label: "申請条件" }] : []),
          { id: "tax-risk", label: "放置のリスク" },
          { id: "cost-estimate", label: "解体費用の目安" },
          { id: "regional-faq-heading", label: "よくある質問" },
          ...(faqItems.length > 0 ? [{ id: "faq-other", label: "その他の質問" }] : []),
        ];
        return <TableOfContents items={tocItems} />;
      })()}

      <PageLead text={`${cityName}の空き家解体補助金の受給条件・申請方法・上限額をこのページで確認できます。`} />

      {hasNoSubsidy && data.subsidy?.noSubsidyNote ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <p className="text-sm font-bold text-amber-800 mb-1">
            ⚠️ {cityName}の補助金制度について
          </p>
          <p className="text-sm text-amber-700">
            {data.subsidy.noSubsidyNote}
          </p>
          {data.subsidy.windowPhone && (
            <p className="text-sm text-amber-700 mt-2">
              窓口：{data.subsidy.windowName}（{data.subsidy.windowPhone}）
            </p>
          )}
        </div>
      ) : !hasNoSubsidy ? (
        <SubsidySummaryBox cityName={cityName} hasRealData={!data._isDefault} />
      ) : null}

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
        <section id="conditions" className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-primary-light/30">
            <h2 className="font-bold text-primary">役所の言葉を、わかりやすく翻訳しました</h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-base text-foreground/60">（お金をもらうために守るべきルールを、やさしい言葉に置き換えています）</p>
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
      <section id="tax-risk" className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
        <h2 className="font-bold text-amber-900/90 mb-4 flex items-center gap-2">
          <span aria-hidden>⚠️</span> 空き家を放置すると、固定資産税が最大6倍になる可能性があります
        </h2>
        <p className="text-base text-foreground/80 leading-relaxed mb-4">
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

      {/* S5: 直接回答型FAQ（AI Overview対策・40文字以内の直接回答） */}
      <DirectAnswerFaq
        items={directFaqItems}
        sectionTitle={`${cityName}の補助金 よくある質問`}
      />

      {/* 地域特化FAQ（アコーディオン + FAQPage JSON-LD・単一データソース） */}
      <RegionalFaq cityName={cityName} />

      {/* その他FAQ（地域JSON・共通補助金FAQ） */}
      {faqItems.length > 0 && (
        <section id="faq-other" className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-primary-light/30">
            <h2 className="font-bold text-primary">{cityName}の補助金 その他の質問</h2>
          </div>
          <dl className="divide-y divide-border">
            {faqItems.map((item, i) => (
              <div key={i} className="px-6 py-4">
                <dt className="font-bold text-foreground/90 mb-1">Q. {item.question}</dt>
                <dd className="text-base text-foreground/70 leading-relaxed">A. {item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {!hasNoSubsidy && <SubsidyCostSection cityName={cityName} maxSubsidyAmount={maxSubsidyAmount} />}

      <RelatedCitiesInPrefecture
        currentCity={city}
        prefecture={prefecture}
        prefectureName={prefName}
        pageType="subsidy"
      />

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

      <section className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 className="font-bold text-primary">{cityName}の関連情報</h2>
        </div>
        <ul className="px-6 py-4 space-y-2 list-none">
          <li>
            <Link href={`/area/${ids.prefectureId}/${ids.cityId}/cost`} className="text-primary hover:underline">
              {cityName}の解体費用相場
            </Link>
          </li>
          <li>
            <Link href={`/area/${ids.prefectureId}/${ids.cityId}/cleanup`} className="text-primary hover:underline">
              {cityName}の空き家片付け
            </Link>
          </li>
          <li>
            <Link href={`/area/${ids.prefectureId}`} className="text-primary hover:underline">
              {prefName}の補助金一覧に戻る
            </Link>
          </li>
        </ul>
      </section>

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
