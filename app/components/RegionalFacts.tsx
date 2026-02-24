import { getRegionalStats } from "../lib/utils/regional-stats-loader";

interface RegionalFactsProps {
  prefName: string;
  cityName: string;
  prefId: string;
  cityId: string;
}

/**
 * 地域統計の表示と査定導線（サーバーコンポーネント・テンプレート固定でハルシネーション回避）。
 */
export default function RegionalFacts({
  prefName,
  cityName,
  prefId,
  cityId,
}: RegionalFactsProps) {
  const statsKey = `${prefId}-${cityId}`;
  const stats = getRegionalStats(statsKey);

  if (stats) {
    const populationStr = stats.population.toLocaleString();
    const agingRateStr = String(stats.agingRate);
    const landPriceStr = stats.landPrice.toLocaleString();
    const text =
      `政府のオープンデータ等に基づく${prefName}${cityName}の動向として、人口は約${populationStr}人、高齢化率は${agingRateStr}％で推移しています。また、平均地価の目安は${landPriceStr}円/㎡です。人口動態の変化は不動産価値に直結するため、${cityName}に空き家を所有している場合は、資産価値が下落する前に現在の適正価格を把握しておくことが重要です。`;
    return (
      <aside
        className="bg-slate-50 border-l-4 border-blue-600 p-5 rounded-r-md text-sm leading-relaxed text-foreground/90"
        aria-labelledby="regional-facts-heading"
      >
        <h2 id="regional-facts-heading" className="sr-only">
          {prefName}{cityName}の地域統計に基づく解説
        </h2>
        <p>{text}</p>
        <div className="mt-4 font-bold">
          <a href="#appraisal-section" className="text-blue-600 underline hover:text-blue-800 transition-colors flex items-center">
            <span className="mr-1">👉</span> {cityName}の不動産売却相場をノムコムで確認（無料）
          </a>
        </div>
      </aside>
    );
  }

  const fallbackText =
    `${prefName}${cityName}を含む全国の多くの自治体で、少子高齢化に伴う空き家の増加が社会課題となっています。空き家を放置して『特定空家』に指定されると、固定資産税の優遇措置が解除され税負担が最大6倍になるリスクがあります。${cityName}の実家をどうすべきか迷っている場合は、まずは現状の不動産価値を正確に知ることから対策を始めましょう。`;
  return (
    <aside
      className="bg-slate-50 border-l-4 border-blue-600 p-5 rounded-r-md text-sm leading-relaxed text-foreground/90"
      aria-labelledby="regional-facts-heading"
    >
      <h2 id="regional-facts-heading" className="sr-only">
        {prefName}{cityName}の空き家・実家に関する解説
      </h2>
      <p>{fallbackText}</p>
      <div className="mt-4 font-bold">
        <a href="#appraisal-section" className="text-blue-600 underline hover:text-blue-800 transition-colors flex items-center">
          <span className="mr-1">👉</span> {cityName}の不動産売却相場をノムコムで確認（無料）
        </a>
      </div>
    </aside>
  );
}
