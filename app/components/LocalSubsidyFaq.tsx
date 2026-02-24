/**
 * 地域特化FAQ（AI Overviews・SGE ソース引用・リッチリザルト対応）。
 * municipalities と地域統計に基づく動的Q&A + FAQPage JSON-LD。
 */

import type { MunicipalityDataOrDefault } from "@/app/lib/data/municipalities";

const BASE_URL = "https://www.fureaino-oka.com";

/** 地価（円/㎡）× 想定土地面積で年間維持コストの目安を算出（特定空家想定） */
const LAND_AREA_M2 = 80;
const FIXED_TAX_RATE = 0.01;
const SPECIFIC_EMPTY_HOUSE_MULTIPLIER = 6;
const INSURANCE_MANAGEMENT = 20000 + 120000;
const OPPORTUNITY_RATE = 0.03;

function estimateAnnualLossFromLandPrice(landPricePerM2: number): number {
  const V = landPricePerM2 * LAND_AREA_M2;
  const fixedAssetTaxMax = Math.round(V * FIXED_TAX_RATE * SPECIFIC_EMPTY_HOUSE_MULTIPLIER);
  const opportunityCost = Math.round(V * OPPORTUNITY_RATE);
  return fixedAssetTaxMax + INSURANCE_MANAGEMENT + opportunityCost;
}

export interface LocalSubsidyFaqProps {
  /** 自治体データ（undefined の場合は汎用テンプレートで表示） */
  municipalityData?: MunicipalityDataOrDefault | null;
  cityName: string;
  prefName: string;
  prefId: string;
  cityId: string;
  /** 地域統計（地価ベースの年間損失試算に使用） */
  regionalStats?: { landPrice: number } | null;
  /** FAQPage JSON-LD の url に使用（絶対URL） */
  baseUrl?: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

function buildFaqItems(props: LocalSubsidyFaqProps): FaqItem[] {
  const { municipalityData, cityName, prefName, regionalStats } = props;
  const hasSubsidy = municipalityData?.subsidy?.hasSubsidy ?? false;
  const subsidyName = municipalityData?.subsidy?.name ?? "";
  const maxAmount = municipalityData?.subsidy?.maxAmount ?? "";
  const conditions = municipalityData?.subsidy?.conditions ?? "";
  const garbageUrl = municipalityData?.garbage?.officialUrl ?? `https://www.google.com/search?q=${encodeURIComponent(prefName + " " + cityName + " 粗大ゴミ 申し込み")}`;
  const garbagePhone = municipalityData?.garbage?.phone ?? "自治体の公式サイトでご確認ください";

  const q1: FaqItem = {
    question: `${cityName}で実家じまいの補助金はありますか？`,
    answer: hasSubsidy
      ? `はい、${cityName}では「${subsidyName}」が実施されており、${maxAmount}を上限に支援が受けられます。${conditions}が主な要件です。`
      : `現在、${cityName}独自の直接的な解体補助金は確認されていませんが、空き家対策の相談窓口が設置されています。国の税制優遇措置（3,000万円控除等）が適用できるか確認をおすすめします。`,
  };

  const q2: FaqItem = {
    question: `${cityName}で実家の荷物を処分する際、どこに相談すればいいですか？`,
    answer: `${cityName}の粗大ゴミ回収（${garbagePhone}）へ直接申し込むか、公式サイト（${garbageUrl}）で手順を確認してください。量が多い場合は、当センター提携の優良業者への一括見積もりも可能です。`,
  };

  const landPrice = regionalStats?.landPrice;
  const annualLoss =
    typeof landPrice === "number" && Number.isFinite(landPrice)
      ? estimateAnnualLossFromLandPrice(landPrice)
      : null;
  const annualLossText =
    annualLoss !== null
      ? `年間約${annualLoss.toLocaleString()}円`
      : "地域の地価・建物条件により変動するため、無料シミュレーターで試算することをおすすめします";

  const q3: FaqItem = {
    question: `${cityName}の実家を放置すると、年間でどの程度の損失になりますか？`,
    answer:
      annualLoss !== null
        ? `${cityName}の最新の地価公示価格に基づくと、固定資産税や管理費を合わせ、${annualLossText}の維持コストが発生するリスクがあります。特定空家に指定されると税負担が最大6倍になるため注意が必要です。`
        : `${cityName}の実家を放置すると、固定資産税の優遇解除や管理費・機会費用で年間の維持コストが発生するリスクがあります。特定空家に指定されると税負担が最大6倍になるため、無料シミュレーターで試算することをおすすめします。`,
  };

  return [q1, q2, q3];
}

/** 汎用テンプレート（municipalityData が無い場合） */
function buildGenericFaqItems(cityName: string, prefName: string): FaqItem[] {
  return [
    {
      question: `${cityName}で実家じまいの補助金はありますか？`,
      answer: `${cityName}の一般的な空き家対策として、自治体の相談窓口で補助金の有無を確認できます。国の税制優遇措置（3,000万円控除等）が適用できるかもあわせて確認をおすすめします。`,
    },
    {
      question: `${cityName}で実家の荷物を処分する際、どこに相談すればいいですか？`,
      answer: `${cityName}の粗大ゴミの申し込みは自治体の公式サイトまたは窓口で手順を確認してください。量が多い場合は、遺品整理・不用品回収の業者への一括見積もりも可能です。`,
    },
    {
      question: `${cityName}の実家を放置すると、年間でどの程度の損失になりますか？`,
      answer: `実家を放置すると、固定資産税の優遇解除や管理費・機会費用で年間の維持コストが発生するリスクがあります。特定空家に指定されると税負担が最大6倍になるため、当サイトの無料シミュレーターで試算することをおすすめします。`,
    },
  ];
}

export default function LocalSubsidyFaq(props: LocalSubsidyFaqProps) {
  const { municipalityData, cityName, prefId, cityId, baseUrl = BASE_URL } = props;
  const items: FaqItem[] =
    municipalityData != null ? buildFaqItems(props) : buildGenericFaqItems(cityName, props.prefName);

  const pageUrl = `${baseUrl.replace(/\/$/, "")}/area/${prefId}/${cityId}`;
  const faqPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
    url: pageUrl,
  };

  return (
    <section className="bg-card rounded-2xl border border-border overflow-hidden" aria-labelledby="local-faq-heading">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }} />
      <div className="px-6 py-4 border-b border-border bg-primary-light/30">
        <h2 id="local-faq-heading" className="font-bold text-primary">
          {cityName}の実家じまい・補助金よくある質問
        </h2>
      </div>
      <dl className="p-6 space-y-6">
        {items.map((item, i) => (
          <div key={i} className="space-y-2">
            <dt className="font-semibold text-foreground text-sm md:text-base">
              Q. {item.question}
            </dt>
            <dd className="text-foreground/85 text-sm md:text-base leading-relaxed pl-4 border-l-2 border-primary/30">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
