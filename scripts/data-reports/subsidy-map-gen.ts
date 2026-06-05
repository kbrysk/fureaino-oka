/**
 * 全国補助金マップ 2026 データ集計スクリプト
 *
 * 入力: app/lib/data/municipalities.json（全1,741市区町村の補助金データ）
 * 出力: app/lib/data/subsidy-map.json（公開ビルド用の加工済みデータ）
 *
 * 集計内容:
 *   - 都道府県別カバレッジ率（補助金がある自治体の割合）
 *   - 補助金最高額の自治体ランキングTOP30
 *   - 補助金額の中央値・平均値
 *   - 補助金「全額」「条件次第」など定量化困難な制度のカウント
 *   - 「補助金カバレッジ100%」の都道府県
 *   - 「補助金がほぼゼロ（10%未満）」の都道府県
 *
 * 使い方:
 *   npx tsx scripts/data-reports/subsidy-map-gen.ts
 */
import fs from "node:fs";
import path from "node:path";

type Municipality = {
  prefId: string;
  cityId: string;
  prefName: string;
  cityName: string;
  subsidy: {
    hasSubsidy: boolean;
    name?: string;
    maxAmount?: string;
    conditions?: string | string[];
    officialUrl?: string;
  };
  garbage?: {
    officialUrl: string;
  };
};

const ROOT = process.cwd();
const INPUT_PATH = path.join(ROOT, "app", "lib", "data", "municipalities.json");
const OUTPUT_PATH = path.join(ROOT, "app", "lib", "data", "subsidy-map.json");
const REPORT_VERSION = "2026";

/**
 * "最大300万円" "最大100万円（不燃化特区等は別規定）" 等から
 * 数値（万円単位）を抽出する。複合表記の場合は最大値を採用。
 */
function parseMaxAmountToYen(input: unknown): number | null {
  if (!input) return null;
  const text =
    typeof input === "string"
      ? input
      : Array.isArray(input)
        ? input.join(" ")
        : String(input);
  const normalized = text.replace(/,/g, "").replace(/、/g, "、");
  // 「最大XXX万円」「XXX万円まで」「上限XXX万円」
  const manMatches = [...normalized.matchAll(/(\d{1,4})\s*万円/g)];
  if (manMatches.length > 0) {
    return Math.max(...manMatches.map((m) => parseInt(m[1], 10))) * 10000;
  }
  // 「XXX,XXX円」「XXX円」
  const yenMatches = [...normalized.matchAll(/(\d{4,8})\s*円/g)];
  if (yenMatches.length > 0) {
    return Math.max(...yenMatches.map((m) => parseInt(m[1], 10)));
  }
  return null;
}

function classifyAmountType(input: unknown): string {
  if (!input) return "unspecified";
  const text =
    typeof input === "string"
      ? input
      : Array.isArray(input)
        ? input.join(" ")
        : String(input);
  if (text.includes("全額")) return "full_amount";
  if (parseMaxAmountToYen(text) !== null) return "fixed_cap";
  if (text.includes("1㎡") || text.includes("単価") || text.includes("延床面積"))
    return "per_unit";
  if (text.includes("一部") || text.includes("条件"))
    return "case_by_case";
  return "other";
}

type CityEntry = {
  prefId: string;
  cityId: string;
  prefName: string;
  cityName: string;
  hasSubsidy: boolean;
  subsidyName?: string;
  maxAmountText?: string;
  maxAmountYen: number | null;
  amountType: string;
  officialUrl?: string;
};

type PrefSummary = {
  prefId: string;
  prefName: string;
  totalCities: number;
  withSubsidyCount: number;
  coverageRate: number;
  averageMaxAmountYen: number | null;
  medianMaxAmountYen: number | null;
  topCity: { cityName: string; maxAmountYen: number } | null;
};

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round(values.reduce((s, v) => s + v, 0) / values.length);
}

function main() {
  const raw: Municipality[] = JSON.parse(
    fs.readFileSync(INPUT_PATH, "utf-8")
  );

  const cityEntries: CityEntry[] = raw.map((m) => {
    const max = parseMaxAmountToYen(m.subsidy?.maxAmount);
    const amountText =
      typeof m.subsidy?.maxAmount === "string"
        ? m.subsidy.maxAmount
        : Array.isArray(m.subsidy?.maxAmount)
          ? (m.subsidy.maxAmount as string[]).join(" / ")
          : m.subsidy?.maxAmount
            ? String(m.subsidy.maxAmount)
            : undefined;
    return {
      prefId: m.prefId,
      cityId: m.cityId,
      prefName: m.prefName,
      cityName: m.cityName,
      hasSubsidy: !!m.subsidy?.hasSubsidy,
      subsidyName: m.subsidy?.name,
      maxAmountText: amountText,
      maxAmountYen: max,
      amountType: classifyAmountType(m.subsidy?.maxAmount),
      officialUrl: m.subsidy?.officialUrl,
    };
  });

  // 都道府県別集計
  const prefMap = new Map<string, CityEntry[]>();
  for (const c of cityEntries) {
    if (!prefMap.has(c.prefName)) prefMap.set(c.prefName, []);
    prefMap.get(c.prefName)!.push(c);
  }

  const prefSummaries: PrefSummary[] = Array.from(prefMap.entries()).map(
    ([prefName, list]) => {
      const withSubsidy = list.filter((c) => c.hasSubsidy);
      const amounts = withSubsidy
        .map((c) => c.maxAmountYen)
        .filter((v): v is number => v !== null);
      const topCity =
        withSubsidy
          .filter((c) => c.maxAmountYen !== null)
          .sort((a, b) => (b.maxAmountYen ?? 0) - (a.maxAmountYen ?? 0))[0] ??
        null;
      return {
        prefId: list[0].prefId,
        prefName,
        totalCities: list.length,
        withSubsidyCount: withSubsidy.length,
        coverageRate: Math.round((withSubsidy.length / list.length) * 1000) / 10,
        averageMaxAmountYen: average(amounts),
        medianMaxAmountYen: median(amounts),
        topCity: topCity
          ? { cityName: topCity.cityName, maxAmountYen: topCity.maxAmountYen! }
          : null,
      };
    }
  );

  // 補助金額ランキング（数値化できた自治体のみ）
  const amountRanking = cityEntries
    .filter((c) => c.hasSubsidy && c.maxAmountYen !== null)
    .sort((a, b) => (b.maxAmountYen ?? 0) - (a.maxAmountYen ?? 0));

  const topCities = amountRanking.slice(0, 30);
  const bottomCities = [...amountRanking].slice(-30).reverse(); // 最低額側

  // カバレッジランキング
  const coverageRanking = [...prefSummaries].sort(
    (a, b) => b.coverageRate - a.coverageRate
  );

  // サマリ統計
  const totalCities = cityEntries.length;
  const totalWithSubsidy = cityEntries.filter((c) => c.hasSubsidy).length;
  const totalQuantified = amountRanking.length;
  const totalFullAmount = cityEntries.filter(
    (c) => c.amountType === "full_amount"
  ).length;
  const allAmounts = amountRanking
    .map((c) => c.maxAmountYen)
    .filter((v): v is number => v !== null);

  // 100%カバレッジ・10%未満カバレッジの都道府県
  const fullCoveragePrefs = prefSummaries
    .filter((p) => p.coverageRate >= 100)
    .map((p) => p.prefName);
  const lowCoveragePrefs = prefSummaries
    .filter((p) => p.coverageRate < 10)
    .sort((a, b) => a.coverageRate - b.coverageRate)
    .map((p) => ({ prefName: p.prefName, coverageRate: p.coverageRate }));

  const report = {
    generated_at: new Date().toISOString(),
    report_version: REPORT_VERSION,
    data_source: {
      name: "ふれあいの丘 全国市区町村補助金データベース",
      total_cities: totalCities,
      with_subsidy_count: totalWithSubsidy,
      coverage_rate_national: Math.round((totalWithSubsidy / totalCities) * 1000) / 10,
      quantified_count: totalQuantified,
      full_amount_count: totalFullAmount,
      note: "市区町村の解体補助金・空き家対策補助金の集計。最大支給額は文字列パースで取得できた自治体のみを対象。「全額」「条件次第」等の自治体は別途カウント。",
    },
    summary_stats: {
      averageMaxAmountYen: average(allAmounts),
      medianMaxAmountYen: median(allAmounts),
      maxAmountYen: allAmounts.length > 0 ? Math.max(...allAmounts) : null,
      minAmountYen: allAmounts.length > 0 ? Math.min(...allAmounts) : null,
    },
    full_coverage_prefs: fullCoveragePrefs,
    low_coverage_prefs: lowCoveragePrefs,
    pref_summaries: prefSummaries.sort(
      (a, b) => b.coverageRate - a.coverageRate
    ),
    coverage_ranking: coverageRanking.slice(0, 47),
    top_amount_ranking: topCities,
    bottom_amount_ranking: bottomCities,
    all_city_entries: cityEntries, // 検索用に全件含める
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(report, null, 2), "utf-8");

  console.log("========================================");
  console.log("  全国補助金マップ 2026 集計");
  console.log("========================================");
  console.log(`  総市区町村数: ${totalCities}`);
  console.log(`  補助金あり: ${totalWithSubsidy} (${report.data_source.coverage_rate_national}%)`);
  console.log(`  数値化できた: ${totalQuantified}`);
  console.log(`  「全額」型: ${totalFullAmount}`);
  console.log(`\n  全自治体平均最大額: ${report.summary_stats.averageMaxAmountYen?.toLocaleString()}円`);
  console.log(`  中央値: ${report.summary_stats.medianMaxAmountYen?.toLocaleString()}円`);
  console.log(`  最高額: ${report.summary_stats.maxAmountYen?.toLocaleString()}円`);
  console.log(`\n  100%カバレッジ都道府県: ${fullCoveragePrefs.join("、")}`);
  console.log(`  10%未満カバレッジ都道府県:`);
  lowCoveragePrefs.forEach((p) =>
    console.log(`    ${p.prefName} ${p.coverageRate}%`)
  );
  console.log(`\n  補助金最大額 TOP5:`);
  topCities.slice(0, 5).forEach((c, i) => {
    console.log(
      `    ${i + 1}. ${c.prefName}${c.cityName} ${c.maxAmountYen?.toLocaleString()}円 (${c.subsidyName})`
    );
  });
  console.log(`\n出力: ${path.relative(ROOT, OUTPUT_PATH)}`);
}

main();
