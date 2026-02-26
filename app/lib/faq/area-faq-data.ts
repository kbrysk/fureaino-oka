/**
 * 地域ページ用 FAQ データ生成ロジック。
 * Page から呼び出し、1 ページ 1 FAQPage に集約するためのデータソース。
 */

import type { FaqItem } from "./schema";
import type { MunicipalityDataOrDefault } from "@/app/lib/data/municipalities";

/** buildLocalSubsidyFaqItems の引数（LocalSubsidyFaq と同様のデータ） */
export interface LocalSubsidyFaqDataParams {
  municipalityData?: MunicipalityDataOrDefault | null;
  cityName: string;
  prefName: string;
  prefId: string;
  cityId: string;
  regionalStats?: { landPrice: number } | null;
}

/** buildDynamicFaqItems の引数（DynamicFaq と同様） */
export interface DynamicFaqDataParams {
  prefName: string;
  cityName: string;
  hasData: boolean;
  municipalityData?: {
    subsidy?: { name?: string; maxAmount?: string };
    garbage?: { officialUrl?: string; phone?: string };
  } | null;
}

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

/**
 * LocalSubsidyFaq 用の 3 問を生成（補助金・粗大ゴミ・年間損失）。
 */
export function buildLocalSubsidyFaqItems(props: LocalSubsidyFaqDataParams): FaqItem[] {
  const { municipalityData, cityName, prefName, regionalStats } = props;
  if (municipalityData == null) {
    return buildGenericLocalSubsidyFaqItems(cityName, prefName);
  }
  const hasSubsidy = municipalityData.subsidy?.hasSubsidy ?? false;
  const subsidyName = municipalityData.subsidy?.name ?? "";
  const maxAmount = municipalityData.subsidy?.maxAmount ?? "";
  const conditions = municipalityData.subsidy?.conditions ?? "";
  const garbageUrl =
    municipalityData.garbage?.officialUrl ??
    `https://www.google.com/search?q=${encodeURIComponent(prefName + " " + cityName + " 粗大ゴミ 申し込み")}`;
  const garbagePhone = municipalityData.garbage?.phone ?? "自治体の公式サイトでご確認ください";

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

function buildGenericLocalSubsidyFaqItems(cityName: string, prefName: string): FaqItem[] {
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

/**
 * DynamicFaq 用の 3 問を生成（補助金・3,000万円控除・不用品処分）。
 */
export function buildDynamicFaqItems(params: DynamicFaqDataParams): FaqItem[] {
  const { prefName, cityName, hasData, municipalityData } = params;
  const subsidyName = municipalityData?.subsidy?.name ?? "空き家除却等の補助金";
  const subsidyMaxAmount = municipalityData?.subsidy?.maxAmount ?? "補助金";
  const garbageUrl = municipalityData?.garbage?.officialUrl ?? "";
  const garbagePhone = municipalityData?.garbage?.phone;

  const q1 = `${prefName}${cityName}で実家を解体・処分する際、補助金や助成金はもらえますか？`;
  const a1WithData = `はい、${cityName}には『${subsidyName}』などの制度があり、条件を満たすと${subsidyMaxAmount}が支給される可能性があります。申請条件や募集枠の最新状況については、本ページに設置している公式窓口へのリンクから${cityName}の担当課へ直接ご確認ください。`;
  const a1WithoutData = `実家の解体に関する補助金（老朽空家等除却補助金など）の有無や予算枠は、${prefName}内の各自治体によって毎年変動します。${cityName}における現在の制度適用については、本ページに設置している『公式窓口で確認する』ボタンから、市の担当窓口（建築指導課など）へ直接お問い合わせいただくのが最も確実です。`;

  const q2 = `${cityName}にある空き家となった実家を売却する場合、税金の優遇措置はありますか？`;
  const a2 = `一定要件を満たせば『被相続人の居住用財産（空き家）に係る譲渡所得の3,000万円特別控除』が適用され、${cityName}の不動産を売却した際の税金が大幅に軽減される可能性があります。ただし、この特例には厳格な適用期限が設けられています。まずは本ページ内の『不動産一括査定』を利用して、現在の適正な売却相場を早急に把握することをお勧めします。`;

  const q3 = `${cityName}の通常のゴミ回収に出せない不用品（家電や粗大ゴミ）はどう処分すればよいですか？`;
  const a3WithData = garbagePhone
    ? `${cityName}のルールに従い、粗大ゴミとして処分してください。詳細は市の案内ページ（${garbageUrl}）をご確認いただくか、受付センター（${garbagePhone}）へご相談ください。`
    : `${cityName}のルールに従い、粗大ゴミとして処分してください。詳細は市の案内ページ（${garbageUrl}）をご確認いただくか、市の担当窓口へご相談ください。`;
  const a3WithoutData = `テレビ、冷蔵庫、洗濯機などの家電リサイクル法対象品目や、タイヤ等の処理困難物は、${cityName}の通常のゴミ回収（集積所）には出せません。${cityName}の許可を受けた一般廃棄物収集運搬業者へ依頼するか、本ページ内でご案内している遺品整理・お片付け業者への無料見積もりを活用して、適切かつ安全に処分してください。`;

  return [
    { question: q1, answer: hasData ? a1WithData : a1WithoutData },
    { question: q2, answer: a2 },
    { question: q3, answer: hasData ? a3WithData : a3WithoutData },
  ];
}

// --- DynamicCaseStudy: ケーススタディ用のケース生成と FAQ 変換 ---

const ATTRIBUTES = ["50代 男性", "60代 女性", "40代 男性", "70代 女性", "50代 女性", "60代 男性"];
const LAYOUTS = ["3LDK", "4LDK", "一軒家", "2DK", "3LDK", "4LDK+"];
const ITEM_LEVELS = [
  "レベル3（生活感あり）",
  "レベル4（かなり多い）",
  "レベル5（困難）",
  "レベル2（やや多い）",
  "レベル3（生活感あり）",
  "レベル4（かなり多い）",
];
const PRO_COMMENTS = [
  "地価が高い{cityName}では、特定空家指定による税金増加のダメージが深刻です。早急な査定が推奨されます。",
  "{cityName}は資産価値が高いエリアのため、放置による機会損失が大きくなります。まずは無料診断で現状把握を。",
  "高地価エリアの{cityName}では、固定資産税の負担が重くのしかかります。早めの実家じまい検討を推奨します。",
];

function hashString(str: string): number {
  let h = 0;
  const s = str.toLowerCase();
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return Math.abs(h) || 1;
}

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

export interface CaseItem {
  attribute: string;
  layout: string;
  itemLevel: string;
  annualRiskYen: number;
  proComment: string;
}

const CASE_LAND_AREA_M2 = 80;

/**
 * 診断事例 3 件を決定論的に生成（cityId でシード）。
 * UI の DynamicCaseStudy に渡す cases と、FAQ 用の generateCaseStudyFaqItems の両方で利用。
 */
export function generateCases(cityId: string, cityName: string, landPrice: number): CaseItem[] {
  const seed = hashString(cityId);
  const rand = seededRandom(seed);
  const cases: CaseItem[] = [];
  const commentPool = PRO_COMMENTS.map((t) => t.replace(/{cityName}/g, cityName));
  const propertyValue = landPrice * CASE_LAND_AREA_M2;

  for (let i = 0; i < 3; i++) {
    const attrIndex = Math.floor(rand() * ATTRIBUTES.length);
    const layoutIndex = Math.floor(rand() * LAYOUTS.length);
    const levelIndex = Math.floor(rand() * ITEM_LEVELS.length);
    const commentIndex = Math.floor(rand() * commentPool.length);
    const coefficient = 0.04 + rand() * 0.08;
    const baseRisk = propertyValue * coefficient;
    const fraction = Math.floor(rand() * 8000) + 2000;
    const annualRiskYen = Math.round(baseRisk + fraction);

    cases.push({
      attribute: ATTRIBUTES[attrIndex],
      layout: LAYOUTS[layoutIndex],
      itemLevel: ITEM_LEVELS[levelIndex],
      annualRiskYen,
      proComment: commentPool[commentIndex],
    });
  }

  return cases;
}

/**
 * ケーススタディ 3 件を FAQ 用の FaqItem[] に変換。
 * 1 ページ 1 FAQPage にマージするために Page から呼ぶ。
 */
export function generateCaseStudyFaqItems(cityName: string, cases: CaseItem[]): FaqItem[] {
  return cases.map((item) => ({
    question: `${cityName}での実家じまい・空き家放置（${item.layout} / ${item.itemLevel}）の損失リスク・費用事例はありますか？`,
    answer: `はい、最近の診断事例（${item.attribute}）によると、年間約${item.annualRiskYen.toLocaleString()}円の放置リスクが判明しています。プロの総評：${item.proComment}`,
  }));
}
