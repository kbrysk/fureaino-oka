import CaseStudyCtaButton from "./CaseStudyCtaButton";

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

/** cityId から決定論的なハッシュ（数値）を生成 */
function hashString(str: string): number {
  let h = 0;
  const s = str.toLowerCase();
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return Math.abs(h) || 1;
}

/** シード付き擬似乱数（0〜1）。同じシードなら同じ系列 */
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

/** 地価（円/㎡）から想定資産価値（約80㎡換算）を算出 */
const LAND_AREA_M2 = 80;

function generateCases(cityId: string, cityName: string, landPrice: number): CaseItem[] {
  const seed = hashString(cityId);
  const rand = seededRandom(seed);
  const cases: CaseItem[] = [];
  const commentPool = PRO_COMMENTS.map((t) => t.replace(/{cityName}/g, cityName));
  const propertyValue = landPrice * LAND_AREA_M2;

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

export interface DynamicCaseStudyProps {
  cityName: string;
  landPrice: number;
  cityId: string;
}

/**
 * 地域固有の決定論的ケーススタディ（最近の診断事例）。FOMO 喚起・CVR 向上。
 * サーバーコンポーネントで初期 HTML に含め SEO を最大化。
 */
export default function DynamicCaseStudy({ cityName, landPrice, cityId }: DynamicCaseStudyProps) {
  const cases = generateCases(cityId, cityName, landPrice);

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: cases.map((item) => ({
      "@type": "Question",
      name: `${cityName}での実家じまい・空き家放置（${item.layout} / ${item.itemLevel}）の損失リスク・費用事例はありますか？`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `はい、最近の診断事例（${item.attribute}）によると、年間約${item.annualRiskYen.toLocaleString()}円の放置リスクが判明しています。プロの総評：${item.proComment}`,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }} />
      <section className="rounded-2xl border-2 border-slate-200 bg-white shadow-sm overflow-hidden" aria-labelledby="case-study-heading">
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
        <h2 id="case-study-heading" className="text-lg font-bold text-slate-800">
          {cityName}での最近の実家じまい・診断事例
        </h2>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {cases.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-xs font-bold text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">
                🚨 判明した放置リスク：年間約 {item.annualRiskYen.toLocaleString()} 円
              </p>
              <p className="text-sm text-slate-600 mb-2">
                {item.attribute} / {item.layout} / 荷物量: {item.itemLevel}
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {item.proComment}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <CaseStudyCtaButton />
        </div>
      </div>
    </section>
    </>
  );
}
