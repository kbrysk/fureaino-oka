/**
 * Search Console レポート取得スクリプト
 * 自分の Google アカウントの認証情報（ADC: Application Default Credentials）で
 * Search Analytics（クエリ・ページ・国・デバイス別の表示回数/クリック/CTR/平均順位）を取得して
 * logs/gsc/ に CSV と JSON で保存する。Claude が読んでサイトの検索パフォーマンスを分析する用途。
 *
 * ※ サービスアカウントを使わない理由: 2026年4月以降、新規サービスアカウントを GA4/GSC に
 *    追加できない Google 側のバグがあるため、ADC（自分のアカウント）方式を採用している。
 *
 * 使い方:
 *   npx tsx scripts/gsc-report.ts                 # 直近28日、query/page/country/device を取得
 *   npx tsx scripts/gsc-report.ts --days 90       # 期間を変更
 *   npx tsx scripts/gsc-report.ts --dimensions query,page --days 28
 *
 * 事前準備（1回だけ）:
 *   1. Google Cloud CLI（gcloud）をインストール
 *   2. 自分のアカウントでログイン（GSC/GA4 のオーナー権限を持つアカウント）:
 *      gcloud auth application-default login --scopes=openid,https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/webmasters.readonly
 *      gcloud auth application-default set-quota-project seizenseiri-497212
 *   3. Google Cloud Console で「Google Search Console API」を有効化（済）
 *   4. 必要なら .env.local に GSC_SITE_URL を設定（既定: getCanonicalBase()）
 *      - URL プレフィックスプロパティ: "https://www.fureaino-oka.com/"
 *      - ドメインプロパティ: "sc-domain:fureaino-oka.com"
 */
import fs from "fs";
import path from "path";
import { google } from "googleapis";
import { getCanonicalBase } from "../app/lib/site-url";

const OUT_DIR = path.join(process.cwd(), "logs", "gsc");
const SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"];

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag: string, fallback: string) => {
    const i = args.indexOf(flag);
    return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
  };
  const days = parseInt(get("--days", "28"), 10);
  const dimensions = get("--dimensions", "query,page,country,device")
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);
  return { days, dimensions };
}

function createAuth() {
  // ADC（gcloud auth application-default login で作成した自分の認証情報）を自動検出する
  return new google.auth.GoogleAuth({ scopes: SCOPES });
}

function resolveSiteUrl(): string {
  const fromEnv =
    typeof process.env.GSC_SITE_URL === "string" && process.env.GSC_SITE_URL.trim();
  if (fromEnv) return fromEnv;
  // URL プレフィックスプロパティとして正規ドメイン（末尾スラッシュ付き）を既定にする
  return getCanonicalBase().replace(/\/$/, "") + "/";
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
        const v = r[c] ?? "";
        const s = String(v);
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
      })
      .join(",")
  );
  return [header, ...lines].join("\n") + "\n";
}

async function fetchDimension(
  searchconsole: ReturnType<typeof google.searchconsole>,
  siteUrl: string,
  startDate: string,
  endDate: string,
  dimension: string
) {
  const res = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: [dimension],
      rowLimit: 1000,
      dataState: "all",
    },
  });
  const rows = res.data.rows ?? [];
  return rows.map((row) => ({
    [dimension]: row.keys?.[0] ?? "",
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: row.ctr != null ? Number((row.ctr * 100).toFixed(2)) : 0,
    position: row.position != null ? Number(row.position.toFixed(1)) : 0,
  }));
}

async function main() {
  const { days, dimensions } = parseArgs();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const siteUrl = resolveSiteUrl();
  const endDate = dateNDaysAgo(1); // GSC は当日データが未確定なので前日まで
  const startDate = dateNDaysAgo(days + 1);

  console.log("========================================");
  console.log("  Search Console レポート取得");
  console.log("========================================");
  console.log(`  プロパティ: ${siteUrl}`);
  console.log(`  期間: ${startDate} 〜 ${endDate}（${days}日間）`);
  console.log(`  ディメンション: ${dimensions.join(", ")}\n`);

  const auth = createAuth();
  const searchconsole = google.searchconsole({ version: "v1", auth });

  const summary: Record<string, number> = {};
  for (const dimension of dimensions) {
    process.stdout.write(`  取得中: ${dimension} … `);
    try {
      const rows = await fetchDimension(searchconsole, siteUrl, startDate, endDate, dimension);
      const columns = [dimension, "clicks", "impressions", "ctr", "position"];
      const csvPath = path.join(OUT_DIR, `${dimension}.csv`);
      const jsonPath = path.join(OUT_DIR, `${dimension}.json`);
      fs.writeFileSync(csvPath, toCsv(rows, columns), "utf-8");
      fs.writeFileSync(jsonPath, JSON.stringify(rows, null, 2), "utf-8");
      summary[dimension] = rows.length;
      console.log(`${rows.length} 行 → logs/gsc/${dimension}.csv`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log("失敗");
      console.error(`    [エラー] ${dimension}: ${msg}`);
    }
  }

  const meta = { siteUrl, startDate, endDate, days, dimensions, rowsByDimension: summary, generatedAt: new Date().toISOString() };
  fs.writeFileSync(path.join(OUT_DIR, "_meta.json"), JSON.stringify(meta, null, 2), "utf-8");

  console.log("\n完了。logs/gsc/ に CSV と JSON を保存しました。");
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
