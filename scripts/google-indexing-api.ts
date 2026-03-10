/**
 * Google Indexing API 自動インデックス・マネージャー
 * 1日200件のクォータを守り、未送信・30日経過URLを優先順位に従って送信する。
 * 送信履歴は CSV で保存し、M&A 時の資産エビデンスとして利用可能。
 */
import fs from "fs";
import path from "path";
import { google } from "googleapis";
import { collectAllUrlsWithPriority, type UrlWithPriority } from "./lib/collect-sitemap-urls";

// ========== 定数 ==========
const DAILY_QUOTA = 200;
const RE_SEND_AFTER_DAYS = 30;
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials", "google-indexing-key.json");
const LOGS_DIR = path.join(process.cwd(), "logs");
const STATUS_JSON_PATH = path.join(LOGS_DIR, "indexing-status.json");
const REPORT_CSV_PATH = path.join(LOGS_DIR, "indexing-report.csv");
const CSV_HEADER = "URL,Priority,LastSentDate,Status\n";

// ========== 型 ==========
interface IndexingStatusEntry {
  lastSent: string; // ISO日付
  status: "SUCCESS" | "ERROR";
}
interface IndexingStatusJson {
  urls: Record<string, IndexingStatusEntry>;
}
interface SendResult {
  url: string;
  priority: UrlWithPriority["priority"];
  status: "SUCCESS" | "ERROR";
  lastSent: string;
}

// ========== 認証 ==========
function ensureCredentials(): void {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error("\n【エラー】認証ファイルが見つかりません。");
    console.error("次のパスに JSON キーを配置してください:");
    console.error("  " + CREDENTIALS_PATH);
    console.error("\n--- Google Cloud 設定手順（3ステップ）---");
    console.error("1. Google Cloud Console で「Indexing API」を有効化し、サービスアカウントを作成します。");
    console.error("2. Search Console で、対象プロパティの「所有者」にサービスアカウントのメールを追加します。");
    console.error("3. サービスアカウントのキー（JSON）をダウンロードし、上記パスに「google-indexing-key.json」として保存します。");
    console.error("\n詳細は docs/GOOGLE-INDEXING-SETUP.md を参照してください。\n");
    process.exit(1);
  }
}

function createAuthClient() {
  return new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });
}

// ========== ログ・ディレクトリ ==========
function ensureLogsDir(): void {
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
    console.log("[準備] ログ用フォルダを作成しました: " + LOGS_DIR);
  }
}

// ========== インデックス状態の読み書き ==========
function loadIndexingStatus(): IndexingStatusJson {
  ensureLogsDir();
  if (!fs.existsSync(STATUS_JSON_PATH)) {
    return { urls: {} };
  }
  try {
    const raw = fs.readFileSync(STATUS_JSON_PATH, "utf-8");
    const data = JSON.parse(raw) as IndexingStatusJson;
    return data.urls ? data : { urls: {} };
  } catch {
    return { urls: {} };
  }
}

function saveIndexingStatus(status: IndexingStatusJson): void {
  ensureLogsDir();
  fs.writeFileSync(STATUS_JSON_PATH, JSON.stringify(status, null, 2), "utf-8");
}

// ========== 送信対象の選定 ==========
function getUrlsToSend(
  allUrls: UrlWithPriority[],
  statusMap: Record<string, IndexingStatusEntry>,
  quota: number
): UrlWithPriority[] {
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - RE_SEND_AFTER_DAYS);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const toSend: UrlWithPriority[] = [];
  for (const item of allUrls) {
    if (toSend.length >= quota) break;
    const entry = statusMap[item.url];
    const neverSent = !entry;
    const expired = entry && entry.lastSent < cutoffStr;
    if (neverSent || expired) {
      toSend.push(item);
    }
  }
  return toSend;
}

// ========== Indexing API 送信 ==========
async function sendUrlToIndexingApi(
  auth: ReturnType<typeof createAuthClient>,
  url: string,
  type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"
): Promise<{ success: boolean }> {
  const indexing = google.indexing({ version: "v3", auth });
  try {
    await indexing.urlNotifications.publish({
      requestBody: { url, type },
    });
    return { success: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[APIエラー] " + url + " → " + msg);
    return { success: false };
  }
}

// ========== CSV レポート（M&A 証拠用） ==========
function ensureReportCsvExists(): void {
  if (!fs.existsSync(REPORT_CSV_PATH)) {
    fs.writeFileSync(REPORT_CSV_PATH, CSV_HEADER, "utf-8");
    console.log("[準備] 送信レポートを新規作成しました: " + REPORT_CSV_PATH);
  }
}

function appendToReportCsv(results: SendResult[]): void {
  ensureLogsDir();
  ensureReportCsvExists();
  const lines = results.map(
    (r) => `"${r.url.replace(/"/g, '""')}",${r.priority},${r.lastSent},${r.status}`
  );
  fs.appendFileSync(REPORT_CSV_PATH, lines.join("\n") + "\n", "utf-8");
}

// ========== メイン実行 ==========
async function run(dryRun: boolean): Promise<void> {
  console.log("========================================");
  console.log("  Google Indexing API 自動送信");
  console.log("========================================\n");

  // 本番送信時のみ認証ファイルを必須とする（Dry Run ではサマリーのみ表示可能）
  if (!dryRun) {
    ensureCredentials();
  }
  ensureLogsDir();

  console.log("[1/4] サイトマップからURLを収集しています…");
  const allUrls = await collectAllUrlsWithPriority();
  const highCount = allUrls.filter((u) => u.priority === "High").length;
  const normalCount = allUrls.length - highCount;
  console.log(`       合計 ${allUrls.length} 件（補助金LP・最優先: ${highCount} 件、通常: ${normalCount} 件）\n`);

  const statusMap = loadIndexingStatus().urls;
  const toSend = getUrlsToSend(allUrls, statusMap, DAILY_QUOTA);
  const toSendHigh = toSend.filter((u) => u.priority === "High").length;
  const toSendNormal = toSend.length - toSendHigh;

  console.log("[2/4] 送信対象の選定結果");
  console.log(`       本日送信予定: ${toSend.length} 件（上限 ${DAILY_QUOTA} 件）`);
  console.log(`       うち 補助金LP（最優先）: ${toSendHigh} 件、通常: ${toSendNormal} 件\n`);

  if (dryRun) {
    console.log("[Dry Run] 実際の送信は行いません。");
    if (toSend.length > 0) {
      console.log("送信予定の先頭5件:");
      toSend.slice(0, 5).forEach((u, i) => console.log(`  ${i + 1}. [${u.priority}] ${u.url}`));
    }
    console.log("\n実行するには --dry-run を付けずにコマンドを実行してください。\n");
    return;
  }

  if (toSend.length === 0) {
    console.log("送信対象がありません。未送信または30日経過したURLがありません。\n");
    return;
  }

  console.log("[3/4] 上記の件数を確認のうえ、送信を開始します…\n");
  const auth = createAuthClient();
  const today = new Date().toISOString().slice(0, 10);
  const results: SendResult[] = [];
  const updatedStatus = { ...loadIndexingStatus() };

  for (let i = 0; i < toSend.length; i++) {
    const item = toSend[i];
    process.stdout.write(`       送信中 ${i + 1}/${toSend.length}: ${item.url.slice(0, 60)}…`);
    const { success } = await sendUrlToIndexingApi(auth, item.url, "URL_UPDATED");
    const status = success ? "SUCCESS" : "ERROR";
    results.push({ url: item.url, priority: item.priority, status, lastSent: today });
    updatedStatus.urls[item.url] = { lastSent: today, status };
    console.log(" " + status);
  }

  saveIndexingStatus(updatedStatus);
  appendToReportCsv(results);

  console.log("\n[4/4] 完了");
  const ok = results.filter((r) => r.status === "SUCCESS").length;
  const ng = results.length - ok;
  console.log(`       成功: ${ok} 件、エラー: ${ng} 件`);
  console.log(`       状態ファイル: ${STATUS_JSON_PATH}`);
  console.log(`       証拠ログ（CSV）: ${REPORT_CSV_PATH}\n`);
}

// ========== エントリポイント ==========
const dryRun = process.argv.includes("--dry-run");
run(dryRun).catch((err) => {
  console.error("予期しないエラー:", err);
  process.exit(1);
});
