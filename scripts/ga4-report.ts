/**
 * GA4 レポート取得スクリプト
 * 自分の Google アカウントの認証情報（ADC: Application Default Credentials）で
 * GA4 Data API から主要レポート（流入チャネル別・ページ別・国別・日別の利用状況）を取得して
 * logs/ga4/ に CSV と JSON で保存する。Claude が読んでサイトの集客・行動を分析する用途。
 *
 * ※ サービスアカウントを使わない理由: 2026年4月以降、新規サービスアカウントを GA4/GSC に
 *    追加できない Google 側のバグがあるため、ADC（自分のアカウント）方式を採用している。
 *
 * 使い方:
 *   npx tsx scripts/ga4-report.ts                # 直近28日
 *   npx tsx scripts/ga4-report.ts --days 90
 *
 * 事前準備（1回だけ）:
 *   1. Google Cloud CLI（gcloud）をインストール
 *   2. 自分のアカウントでログイン（GA4/GSC のオーナー権限を持つアカウント）:
 *      gcloud auth application-default login --scopes=openid,https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/webmasters.readonly
 *      gcloud auth application-default set-quota-project seizenseiri-497212
 *   3. Google Cloud Console で「Google Analytics Data API」を有効化（済）
 *   4. .env.local に GA4_PROPERTY_ID を設定（数値のみ。GA4 管理画面 → プロパティ設定 → プロパティID）
 */
import fs from "fs";
import path from "path";
import { google } from "googleapis";

const OUT_DIR = path.join(process.cwd(), "logs", "ga4");
const SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"];

interface ReportDef {
  name: string;
  dimensions: string[];
  metrics: string[];
  orderByMetric?: string;
  limit?: number;
}

const REPORTS: ReportDef[] = [
  {
    name: "by-channel",
    dimensions: ["sessionDefaultChannelGroup"],
    metrics: ["sessions", "totalUsers", "engagedSessions", "conversions"],
    orderByMetric: "sessions",
  },
  {
    name: "by-page",
    dimensions: ["pagePath"],
    metrics: ["screenPageViews", "totalUsers", "averageSessionDuration", "conversions"],
    orderByMetric: "screenPageViews",
    limit: 200,
  },
  {
    name: "by-country",
    dimensions: ["country"],
    metrics: ["sessions", "totalUsers"],
    orderByMetric: "sessions",
  },
  {
    name: "by-date",
    dimensions: ["date"],
    metrics: ["sessions", "totalUsers", "screenPageViews", "conversions"],
  },
  {
    name: "landing-page",
    dimensions: ["landingPage"],
    metrics: ["sessions", "totalUsers", "conversions"],
    orderByMetric: "sessions",
    limit: 200,
  },
];

function parseArgs() {
  const args = process.argv.slice(2);
  const i = args.indexOf("--days");
  const days = i >= 0 && args[i + 1] ? parseInt(args[i + 1], 10) : 28;
  return { days };
}

function createAuth() {
  // ADC（gcloud auth application-default login で作成した自分の認証情報）を自動検出する
  return new google.auth.GoogleAuth({ scopes: SCOPES });
}

function resolvePropertyId(): string {
  const id = (process.env.GA4_PROPERTY_ID || "").replace(/^properties\//, "").trim();
  if (!id) {
    console.error("\n【エラー】GA4_PROPERTY_ID が未設定です。");
    console.error(".env.local に GA4_PROPERTY_ID=123456789 を設定してください（数値のみ）。");
    console.error("GA4 管理画面 → プロパティ設定 → プロパティID で確認できます。\n");
    process.exit(1);
  }
  return id;
}

function dateNDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function toCsv(rows: Array<Record<string, string | number>>, columns: string[]): string {
  const header = columns.join(",");
  const lines = rows.map((r) =>
    columns
      .map((c) => {
        const s = String(r[c] ?? "");
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
      })
      .join(",")
  );
  return [header, ...lines].join("\n") + "\n";
}

async function runReport(
  analyticsdata: ReturnType<typeof google.analyticsdata>,
  property: string,
  startDate: string,
  endDate: string,
  def: ReportDef
) {
  const res = await analyticsdata.properties.runReport({
    property,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      dimensions: def.dimensions.map((name) => ({ name })),
      metrics: def.metrics.map((name) => ({ name })),
      orderBys: def.orderByMetric
        ? [{ metric: { metricName: def.orderByMetric }, desc: true }]
        : undefined,
      limit: def.limit ? String(def.limit) : undefined,
    },
  });
  const rows = res.data.rows ?? [];
  const columns = [...def.dimensions, ...def.metrics];
  return rows.map((row) => {
    const obj: Record<string, string | number> = {};
    def.dimensions.forEach((d, i) => {
      obj[d] = row.dimensionValues?.[i]?.value ?? "";
    });
    def.metrics.forEach((m, i) => {
      const raw = row.metricValues?.[i]?.value ?? "0";
      const num = Number(raw);
      obj[m] = Number.isFinite(num) ? Number(num.toFixed(2)) : raw;
    });
    return { obj, columns };
  });
}

async function main() {
  const { days } = parseArgs();
  const propertyId = resolvePropertyId();
  const property = `properties/${propertyId}`;
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const endDate = dateNDaysAgo(1);
  const startDate = dateNDaysAgo(days + 1);

  console.log("========================================");
  console.log("  GA4 レポート取得");
  console.log("========================================");
  console.log(`  プロパティ: ${property}`);
  console.log(`  期間: ${startDate} 〜 ${endDate}（${days}日間）\n`);

  const auth = createAuth();
  const analyticsdata = google.analyticsdata({ version: "v1beta", auth });

  const summary: Record<string, number> = {};
  for (const def of REPORTS) {
    process.stdout.write(`  取得中: ${def.name} … `);
    try {
      const result = await runReport(analyticsdata, property, startDate, endDate, def);
      const columns = [...def.dimensions, ...def.metrics];
      const rows = result.map((r) => r.obj);
      fs.writeFileSync(path.join(OUT_DIR, `${def.name}.csv`), toCsv(rows, columns), "utf-8");
      fs.writeFileSync(path.join(OUT_DIR, `${def.name}.json`), JSON.stringify(rows, null, 2), "utf-8");
      summary[def.name] = rows.length;
      console.log(`${rows.length} 行 → logs/ga4/${def.name}.csv`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log("失敗");
      console.error(`    [エラー] ${def.name}: ${msg}`);
    }
  }

  const meta = { property, startDate, endDate, days, rowsByReport: summary, generatedAt: new Date().toISOString() };
  fs.writeFileSync(path.join(OUT_DIR, "_meta.json"), JSON.stringify(meta, null, 2), "utf-8");

  console.log("\n完了。logs/ga4/ に CSV と JSON を保存しました。");
}

main().catch((err) => {
  const msg = err instanceof Error ? err.message : String(err);
  if (/could not load the default credentials|application default credentials/i.test(msg)) {
    console.error("\n【エラー】ログイン情報（ADC）が見つかりません。先に次を実行してください:");
    console.error("  gcloud auth application-default login --scopes=openid,https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/webmasters.readonly");
    console.error("  gcloud auth application-default set-quota-project seizenseiri-497212\n");
    process.exit(1);
  }
  console.error("予期しないエラー:", err);
  process.exit(1);
});
