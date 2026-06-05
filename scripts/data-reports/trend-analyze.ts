/**
 * 終活・生前整理 検索トレンドレポート 分析スクリプト
 *
 * 入力: logs/data-reports/trends/YYYY-MM.json（trend-collect.ts の出力）
 * 出力: logs/data-reports/trends/YYYY-MM-analyzed.json
 *
 * 主な分析:
 *   - 急上昇判定（直近30日平均 vs 過去60日平均）
 *   - クラスタ別関心度集計
 *   - 関連クエリ集約（上位/急上昇）
 *   - 都道府県別関心度ランキング
 *   - 親子温度差シグナル抽出
 *
 * 使い方:
 *   npx tsx scripts/data-reports/trend-analyze.ts
 *   REPORT_MONTH=2026-05 npx tsx scripts/data-reports/trend-analyze.ts
 */
import fs from "node:fs";
import path from "node:path";
import {
  TREND_CLUSTERS,
  type TrendCluster,
} from "../../app/lib/data/trend-keywords";

const TRENDS_DIR = path.join(process.cwd(), "logs", "data-reports", "trends");
const PUBLIC_DATA_DIR = path.join(
  process.cwd(),
  "app",
  "lib",
  "data",
  "trend-reports"
);
const REPORT_MONTH =
  process.env.REPORT_MONTH || new Date().toISOString().slice(0, 7);

type TimelinePoint = { time: string; formattedTime: string; value: number };
type RankedQuery = { query: string; value: number };
type RegionPoint = { geoName: string; geoCode?: string; value: number };

type KeywordData = {
  keyword: string;
  cluster: TrendCluster;
  monthlyVolume: number | null;
  kwId: string | null;
  label: string;
  ymylSensitive?: boolean;
  interestOverTime:
    | { ok: true; points: TimelinePoint[] }
    | { ok: false; error: string };
  relatedQueries:
    | { ok: true; top: RankedQuery[]; rising: RankedQuery[] }
    | { ok: false; error: string };
  interestByRegion:
    | { ok: true; regions: RegionPoint[] }
    | { ok: false; error: string };
};

type CollectedData = {
  generated_at: string;
  report_month: string;
  geo: string;
  hl: string;
  keyword_count: number;
  success_count: number;
  error_count: number;
  keywords: KeywordData[];
};

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function roundTo(value: number, digits = 1): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

/**
 * 急上昇スコア: 直近30日平均 / 過去60日平均
 * 1.0 を上回るほど "最近の関心が高い"
 */
function trendingScore(points: TimelinePoint[]): {
  recent30Avg: number;
  prior60Avg: number;
  liftRatio: number;
  liftPercent: number;
} {
  if (points.length < 30) {
    return { recent30Avg: 0, prior60Avg: 0, liftRatio: 0, liftPercent: 0 };
  }
  // 末尾の isPartial 等が含まれる場合があるので、value=0が連続する末尾は無視
  const cleaned = [...points];
  while (
    cleaned.length > 0 &&
    cleaned[cleaned.length - 1].value === 0
  ) {
    cleaned.pop();
  }
  if (cleaned.length < 30) {
    return { recent30Avg: 0, prior60Avg: 0, liftRatio: 0, liftPercent: 0 };
  }
  const recent30 = cleaned.slice(-30).map((p) => p.value);
  const prior = cleaned.slice(0, Math.max(0, cleaned.length - 30)).map((p) => p.value);
  const recent30Avg = average(recent30);
  const prior60Avg = average(prior);
  const liftRatio = prior60Avg === 0 ? 0 : recent30Avg / prior60Avg;
  const liftPercent = prior60Avg === 0 ? 0 : ((recent30Avg - prior60Avg) / prior60Avg) * 100;
  return {
    recent30Avg: roundTo(recent30Avg, 1),
    prior60Avg: roundTo(prior60Avg, 1),
    liftRatio: roundTo(liftRatio, 2),
    liftPercent: roundTo(liftPercent, 1),
  };
}

/**
 * 期間平均値（0除算とisPartial除外）
 */
function periodAverage(points: TimelinePoint[]): number {
  const cleaned = points.filter((p) => p.value > 0);
  if (cleaned.length === 0) return 0;
  return roundTo(average(cleaned.map((p) => p.value)), 1);
}

function analyzeKeyword(kw: KeywordData) {
  const points = kw.interestOverTime.ok ? kw.interestOverTime.points : [];
  const score = trendingScore(points);
  const periodAvg = periodAverage(points);
  const regions = kw.interestByRegion.ok ? kw.interestByRegion.regions : [];
  const topRegions = [...regions]
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  const relatedTop = kw.relatedQueries.ok ? kw.relatedQueries.top : [];
  const relatedRising = kw.relatedQueries.ok ? kw.relatedQueries.rising : [];
  return {
    keyword: kw.keyword,
    label: kw.label,
    cluster: kw.cluster,
    kwId: kw.kwId,
    monthlyVolume: kw.monthlyVolume,
    ymylSensitive: kw.ymylSensitive ?? false,
    periodAverage: periodAvg,
    ...score,
    topRelated: relatedTop.slice(0, 5),
    risingRelated: relatedRising.slice(0, 5),
    topRegions: topRegions.map((r) => ({ name: r.geoName, value: r.value })),
    dataAvailability: {
      timeline: points.length > 0,
      related: relatedTop.length > 0 || relatedRising.length > 0,
      regions: regions.length > 0,
    },
  };
}

function clusterSummary(
  analyzed: ReturnType<typeof analyzeKeyword>[]
): Array<{
  cluster: TrendCluster;
  label: string;
  description: string;
  keywordCount: number;
  averagePeriodInterest: number;
  averageLiftPercent: number;
  topKeyword: { keyword: string; periodAverage: number } | null;
}> {
  const groups = new Map<TrendCluster, ReturnType<typeof analyzeKeyword>[]>();
  for (const a of analyzed) {
    if (!groups.has(a.cluster)) groups.set(a.cluster, []);
    groups.get(a.cluster)!.push(a);
  }
  return Object.keys(TREND_CLUSTERS).map((key) => {
    const cluster = key as TrendCluster;
    const items = groups.get(cluster) ?? [];
    const top = [...items].sort((a, b) => b.periodAverage - a.periodAverage)[0];
    return {
      cluster,
      label: TREND_CLUSTERS[cluster].label,
      description: TREND_CLUSTERS[cluster].description,
      keywordCount: items.length,
      averagePeriodInterest: roundTo(
        average(items.map((i) => i.periodAverage)),
        1
      ),
      averageLiftPercent: roundTo(
        average(items.map((i) => i.liftPercent)),
        1
      ),
      topKeyword: top
        ? { keyword: top.keyword, periodAverage: top.periodAverage }
        : null,
    };
  });
}

function regionAggregate(
  analyzed: ReturnType<typeof analyzeKeyword>[],
  source: CollectedData
): Array<{ name: string; averageValue: number; topKeywords: string[] }> {
  const regionMap = new Map<string, { sum: number; count: number; kws: Map<string, number> }>();
  for (const kw of source.keywords) {
    if (!kw.interestByRegion.ok) continue;
    for (const region of kw.interestByRegion.regions) {
      if (region.value === 0) continue;
      if (!regionMap.has(region.geoName)) {
        regionMap.set(region.geoName, { sum: 0, count: 0, kws: new Map() });
      }
      const entry = regionMap.get(region.geoName)!;
      entry.sum += region.value;
      entry.count += 1;
      entry.kws.set(kw.keyword, (entry.kws.get(kw.keyword) ?? 0) + region.value);
    }
  }
  return Array.from(regionMap.entries())
    .map(([name, data]) => ({
      name,
      averageValue: roundTo(data.sum / data.count, 1),
      topKeywords: Array.from(data.kws.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([k]) => k),
    }))
    .sort((a, b) => b.averageValue - a.averageValue);
}

function aggregateRisingRelated(
  source: CollectedData
): Array<{ query: string; sourceKeyword: string; value: number }> {
  const all: Array<{ query: string; sourceKeyword: string; value: number }> = [];
  for (const kw of source.keywords) {
    if (!kw.relatedQueries.ok) continue;
    for (const rising of kw.relatedQueries.rising.slice(0, 5)) {
      all.push({
        query: rising.query,
        sourceKeyword: kw.keyword,
        value: rising.value,
      });
    }
  }
  return all
    .sort((a, b) => b.value - a.value)
    .slice(0, 20);
}

function main() {
  const inputPath = path.join(TRENDS_DIR, `${REPORT_MONTH}.json`);
  if (!fs.existsSync(inputPath)) {
    console.error(`入力ファイルがありません: ${inputPath}`);
    console.error(`先に npm run data:trends:collect を実行してください。`);
    process.exit(1);
  }

  const data: CollectedData = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  console.log("========================================");
  console.log(`  検索トレンドレポート 分析`);
  console.log("========================================");
  console.log(`  Report month: ${data.report_month}`);
  console.log(`  Keywords: ${data.keywords.length}\n`);

  // KW別分析
  const analyzed = data.keywords.map(analyzeKeyword);

  // 急上昇TOP10（liftPercent高い順、ただしデータ十分なものに限る）
  const trendingTop = [...analyzed]
    .filter((a) => a.dataAvailability.timeline && a.periodAverage > 0)
    .sort((a, b) => b.liftPercent - a.liftPercent)
    .slice(0, 10);

  // 急下降TOP5（参考、報告対象）
  const decliningTop = [...analyzed]
    .filter((a) => a.dataAvailability.timeline && a.periodAverage > 0)
    .sort((a, b) => a.liftPercent - b.liftPercent)
    .slice(0, 5);

  // クラスタ別集計
  const clusters = clusterSummary(analyzed);

  // 地域別集計
  const regions = regionAggregate(analyzed, data);

  // 親子温度差シグナル（parent_child_gap クラスタの動向）
  const parentChildGap = analyzed.filter(
    (a) => a.cluster === "parent_child_gap"
  );

  // 関連クエリ急上昇集約
  const risingRelatedAcrossAll = aggregateRisingRelated(data);

  const analyzedReport = {
    generated_at: new Date().toISOString(),
    report_month: data.report_month,
    source_generated_at: data.generated_at,
    geo: data.geo,
    hl: data.hl,
    keyword_count: data.keywords.length,
    success_count: data.success_count,
    summary: {
      averagePeriodInterest: roundTo(
        average(analyzed.map((a) => a.periodAverage)),
        1
      ),
      averageLiftPercent: roundTo(
        average(analyzed.map((a) => a.liftPercent)),
        1
      ),
      trendingCount: analyzed.filter((a) => a.liftPercent > 10).length,
      decliningCount: analyzed.filter((a) => a.liftPercent < -10).length,
    },
    trending_top10: trendingTop,
    declining_top5: decliningTop,
    clusters,
    parent_child_gap_signals: parentChildGap,
    regions_top: regions.slice(0, 15),
    rising_related_queries: risingRelatedAcrossAll,
    keyword_details: analyzed,
  };

  const outPath = path.join(TRENDS_DIR, `${REPORT_MONTH}-analyzed.json`);
  fs.writeFileSync(outPath, JSON.stringify(analyzedReport, null, 2), "utf-8");

  // 本番ビルドに含めるため、加工済みサマリを app/lib/data/trend-reports/ にも書き出す
  fs.mkdirSync(PUBLIC_DATA_DIR, { recursive: true });
  const publicPath = path.join(PUBLIC_DATA_DIR, `${REPORT_MONTH}.json`);
  fs.writeFileSync(publicPath, JSON.stringify(analyzedReport, null, 2), "utf-8");

  // コンソールサマリ
  console.log(`【今月の急上昇TOP5】`);
  trendingTop.slice(0, 5).forEach((a, i) => {
    console.log(
      `  ${i + 1}. ${a.keyword.padEnd(20)} lift=${a.liftPercent > 0 ? "+" : ""}${a.liftPercent}% (avg ${a.periodAverage})`
    );
  });

  console.log(`\n【クラスタ別構成】`);
  clusters.forEach((c) => {
    console.log(
      `  ${c.label.padEnd(20)} avg=${c.averagePeriodInterest} lift=${c.averageLiftPercent > 0 ? "+" : ""}${c.averageLiftPercent}%`
    );
  });

  console.log(`\n【関心度上位3都道府県（全KW平均）】`);
  regions.slice(0, 3).forEach((r) => {
    console.log(
      `  ${r.name.padEnd(8)} avg=${r.averageValue} top=${r.topKeywords.join("/")}`
    );
  });

  console.log(`\n出力:`);
  console.log(`  ${path.relative(process.cwd(), outPath)}`);
  console.log(`  ${path.relative(process.cwd(), publicPath)} (公開ビルド用)`);
}

main();
