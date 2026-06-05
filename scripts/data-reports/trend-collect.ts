/**
 * 終活・生前整理 検索トレンドレポート データ収集スクリプト
 *
 * Google Trends API (npm: google-trends-api) を使い、TREND_KEYWORDS で定義された
 * 監視キーワード20語の以下を取得：
 *   - interestOverTime  : 過去90日の関心度推移
 *   - relatedQueries    : 上位/急上昇の関連クエリ
 *   - interestByRegion  : 都道府県別の関心度
 *
 * 出力: logs/data-reports/trends/YYYY-MM.json
 *
 * 注意:
 *   - Google Trends API は非公式ラッパー。429（レート制限）が返る場合あり
 *   - 失敗したKWは error フィールド付きで記録され、後工程で除外される
 *   - 月次バッチ運用前提だが、初号は手動実行
 *
 * 使い方:
 *   npx tsx scripts/data-reports/trend-collect.ts
 *   REPORT_MONTH=2026-05 npx tsx scripts/data-reports/trend-collect.ts
 */
import fs from "node:fs";
import path from "node:path";
// @ts-expect-error - google-trends-api は型定義を持たない
import googleTrends from "google-trends-api";
import {
  TREND_CLUSTERS,
  TREND_KEYWORDS,
} from "../../app/lib/data/trend-keywords";

const OUT_DIR = path.join(process.cwd(), "logs", "data-reports", "trends");
const REPORT_MONTH =
  process.env.REPORT_MONTH || new Date().toISOString().slice(0, 7);
const GEO = "JP";
const HL = "ja-JP";
const DELAY_MS = 2500; // Google Trends API のレート制限対策
const TIMEOUT_MS = 30_000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`timeout: ${label} after ${ms}ms`)),
      ms
    );
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

function safeParseJson(raw: unknown): unknown {
  if (typeof raw !== "string") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return { _parseError: true, snippet: String(raw).slice(0, 200) };
  }
}

type TimelinePoint = {
  time: string;
  formattedTime: string;
  value: number;
};

async function collectInterestOverTime(keyword: string): Promise<
  | { ok: true; points: TimelinePoint[] }
  | { ok: false; error: string }
> {
  const startTime = new Date();
  startTime.setDate(startTime.getDate() - 90);
  try {
    const raw = await withTimeout(
      googleTrends.interestOverTime({
        keyword,
        geo: GEO,
        hl: HL,
        startTime,
      }),
      TIMEOUT_MS,
      `interestOverTime(${keyword})`
    );
    const parsed = safeParseJson(raw) as {
      default?: {
        timelineData?: Array<{
          time: string;
          formattedTime: string;
          value: number[];
        }>;
      };
    };
    const timeline = parsed.default?.timelineData ?? [];
    return {
      ok: true,
      points: timeline.map((row) => ({
        time: row.time,
        formattedTime: row.formattedTime,
        value: Array.isArray(row.value) ? row.value[0] ?? 0 : 0,
      })),
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

type RankedQuery = { query: string; value: number };

async function collectRelatedQueries(keyword: string): Promise<
  | { ok: true; top: RankedQuery[]; rising: RankedQuery[] }
  | { ok: false; error: string }
> {
  try {
    const raw = await withTimeout(
      googleTrends.relatedQueries({
        keyword,
        geo: GEO,
        hl: HL,
      }),
      TIMEOUT_MS,
      `relatedQueries(${keyword})`
    );
    const parsed = safeParseJson(raw) as {
      default?: {
        rankedList?: Array<{
          rankedKeyword?: Array<{ query: string; value: number }>;
        }>;
      };
    };
    const lists = parsed.default?.rankedList ?? [];
    const top = lists[0]?.rankedKeyword ?? [];
    const rising = lists[1]?.rankedKeyword ?? [];
    return {
      ok: true,
      top: top.slice(0, 10).map(({ query, value }) => ({ query, value })),
      rising: rising.slice(0, 10).map(({ query, value }) => ({ query, value })),
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

type RegionPoint = { geoName: string; geoCode?: string; value: number };

async function collectInterestByRegion(keyword: string): Promise<
  | { ok: true; regions: RegionPoint[] }
  | { ok: false; error: string }
> {
  try {
    const raw = await withTimeout(
      googleTrends.interestByRegion({
        keyword,
        geo: GEO,
        hl: HL,
        resolution: "REGION",
      }),
      TIMEOUT_MS,
      `interestByRegion(${keyword})`
    );
    const parsed = safeParseJson(raw) as {
      default?: {
        geoMapData?: Array<{
          geoName: string;
          geoCode?: string;
          value: number[];
        }>;
      };
    };
    const regions = parsed.default?.geoMapData ?? [];
    return {
      ok: true,
      regions: regions.map((row) => ({
        geoName: row.geoName,
        geoCode: row.geoCode,
        value: Array.isArray(row.value) ? row.value[0] ?? 0 : 0,
      })),
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log("========================================");
  console.log(`  終活・生前整理 検索トレンドレポート データ収集`);
  console.log("========================================");
  console.log(`  Report month: ${REPORT_MONTH}`);
  console.log(`  Geo: ${GEO} / hl: ${HL}`);
  console.log(`  Keywords: ${TREND_KEYWORDS.length}\n`);

  const collected: Array<Record<string, unknown>> = [];
  let okCount = 0;
  let errCount = 0;

  for (let i = 0; i < TREND_KEYWORDS.length; i++) {
    const kw = TREND_KEYWORDS[i];
    process.stdout.write(
      `  [${String(i + 1).padStart(2, "0")}/${TREND_KEYWORDS.length}] ${kw.keyword} (${kw.cluster}) ... `
    );

    const iot = await collectInterestOverTime(kw.keyword);
    await delay(DELAY_MS / 2);
    const rq = await collectRelatedQueries(kw.keyword);
    await delay(DELAY_MS / 2);
    const ibr = await collectInterestByRegion(kw.keyword);

    const successCount = [iot, rq, ibr].filter((r) => r.ok).length;
    if (successCount === 3) {
      okCount += 1;
      console.log("OK");
    } else if (successCount === 0) {
      errCount += 1;
      console.log("FAIL");
    } else {
      console.log(`partial (${successCount}/3)`);
    }

    collected.push({
      keyword: kw.keyword,
      cluster: kw.cluster,
      monthlyVolume: kw.monthlyVolume ?? null,
      kwId: kw.kwId ?? null,
      label: kw.label ?? kw.keyword,
      ymylSensitive: kw.ymylSensitive ?? false,
      interestOverTime: iot,
      relatedQueries: rq,
      interestByRegion: ibr,
      collectedAt: new Date().toISOString(),
    });

    if (i < TREND_KEYWORDS.length - 1) await delay(DELAY_MS);
  }

  const outPath = path.join(OUT_DIR, `${REPORT_MONTH}.json`);
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        report_month: REPORT_MONTH,
        geo: GEO,
        hl: HL,
        keyword_count: TREND_KEYWORDS.length,
        success_count: okCount,
        error_count: errCount,
        cluster_definitions: TREND_CLUSTERS,
        keywords: collected,
      },
      null,
      2
    ),
    "utf-8"
  );

  console.log(
    `\n結果: ${okCount}/${TREND_KEYWORDS.length} 成功, ${errCount} 失敗`
  );
  console.log(`出力: ${path.relative(process.cwd(), outPath)}`);
}

main().catch((err) => {
  console.error("予期しないエラー:", err);
  process.exit(1);
});
