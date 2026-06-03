/**
 * Google Indexing API — OAuth ユーザー認証版
 *
 * サービスアカウントは Search Console UI から「所有者」として追加できない仕様変更があったため、
 * ユーザー（okubo.r.1990@gmail.com）のOAuth認証で Indexing API を呼ぶ実装に切り替え。
 *
 * 初回実行時にブラウザが自動で開き、ユーザー認証 → リフレッシュトークン保存。
 * 次回以降はトークンを使って自動実行可能。
 *
 * 必要なファイル：
 * - credentials/google-indexing-oauth-client.json （ユーザーが Cloud Console で取得・配置）
 * - credentials/google-indexing-oauth-token.json （初回認証時に自動生成）
 */
import fs from "fs";
import path from "path";
import http from "http";
import { exec } from "child_process";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { collectAllUrlsWithPriority, type UrlWithPriority } from "./lib/collect-sitemap-urls";

// ========== 定数 ==========
const DAILY_QUOTA = 200;
const RE_SEND_AFTER_DAYS = 30;
const CLIENT_SECRET_PATH = path.join(process.cwd(), "credentials", "google-indexing-oauth-client.json");
const TOKEN_PATH = path.join(process.cwd(), "credentials", "google-indexing-oauth-token.json");
const LOGS_DIR = path.join(process.cwd(), "logs");
const STATUS_JSON_PATH = path.join(LOGS_DIR, "indexing-status.json");
const REPORT_CSV_PATH = path.join(LOGS_DIR, "indexing-report.csv");
const CSV_HEADER = "URL,Priority,LastSentDate,Status\n";
const SCOPES = ["https://www.googleapis.com/auth/indexing"];
const CALLBACK_PORT = 3838;

// ========== 型 ==========
interface IndexingStatusEntry {
  lastSent: string;
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

// ========== OAuth認証 ==========
async function authorize(): Promise<OAuth2Client> {
  if (!fs.existsSync(CLIENT_SECRET_PATH)) {
    console.error("\n【エラー】OAuth クライアントファイルが見つかりません。");
    console.error("以下のパスに JSON を配置してください:");
    console.error("  " + CLIENT_SECRET_PATH);
    console.error("\n手順は docs/OAUTH_INDEXING_SETUP.md を参照してください。\n");
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(CLIENT_SECRET_PATH, "utf-8"));
  const creds = raw.installed || raw.web;
  if (!creds?.client_id || !creds?.client_secret) {
    console.error("\n【エラー】OAuth JSON の形式が不正です。`installed` または `web` に client_id/client_secret が必要。\n");
    process.exit(1);
  }

  const redirectUri = `http://localhost:${CALLBACK_PORT}/oauth2callback`;
  const oauth2Client = new OAuth2Client(creds.client_id, creds.client_secret, redirectUri);

  // 既存トークンがあれば使う
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
    oauth2Client.setCredentials(token);
    // リフレッシュトークン経由で再取得（必要なら）
    try {
      await oauth2Client.getAccessToken();
      console.log("[認証] 既存トークンで認証成功");
      return oauth2Client;
    } catch (e) {
      console.warn("[認証] 既存トークンが無効、再認証します:", e instanceof Error ? e.message : e);
    }
  }

  // 新規認証フロー
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // refresh_token を確実に取得
    scope: SCOPES,
  });

  console.log("\n========================================");
  console.log("  OAuth 認証が必要です");
  console.log("========================================");
  console.log("\nブラウザが自動で開きます。okubo.r.1990@gmail.com で認証してください。");
  console.log("\n手動で開く場合は以下のURLにアクセス:");
  console.log(authUrl);
  console.log("\n「テスト中アプリ」警告が出たら：");
  console.log("  →「詳細を表示」→「プロジェクトに移動（安全ではありません）」→「許可」");
  console.log("\n認証完了を待っています...\n");

  // ブラウザを開く
  const opener =
    process.platform === "win32"
      ? `start "" "${authUrl}"`
      : process.platform === "darwin"
      ? `open "${authUrl}"`
      : `xdg-open "${authUrl}"`;
  exec(opener);

  // ローカル HTTP サーバーでコールバック受信
  const code: string = await new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const reqUrl = new URL(req.url || "", `http://localhost:${CALLBACK_PORT}`);
        if (!reqUrl.pathname.includes("oauth2callback")) {
          res.statusCode = 404;
          res.end();
          return;
        }
        const c = reqUrl.searchParams.get("code");
        const err = reqUrl.searchParams.get("error");
        if (err) {
          res.statusCode = 400;
          res.end("認証エラー: " + err);
          server.close();
          reject(new Error("OAuth error: " + err));
          return;
        }
        if (!c) {
          res.statusCode = 400;
          res.end("No code parameter");
          return;
        }
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(
          "<html><body style='font-family:sans-serif;text-align:center;padding:50px;'>" +
            "<h1>✅ 認証成功</h1>" +
            "<p>このタブを閉じてターミナルに戻ってください。</p>" +
            "</body></html>"
        );
        server.close();
        resolve(c);
      } catch (e) {
        reject(e);
      }
    });
    server.on("error", reject);
    server.listen(CALLBACK_PORT, () => {
      console.log(`[OAuth] コールバックサーバー起動: http://localhost:${CALLBACK_PORT}`);
    });
  });

  console.log("[認証] 認証コード受信、アクセストークンを取得中...");
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  fs.mkdirSync(path.dirname(TOKEN_PATH), { recursive: true });
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2), "utf-8");
  console.log("[認証] トークンを保存しました: " + TOKEN_PATH);
  return oauth2Client;
}

// ========== ログ・ディレクトリ ==========
function ensureLogsDir(): void {
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  }
}

function loadIndexingStatus(): IndexingStatusJson {
  if (!fs.existsSync(STATUS_JSON_PATH)) return { urls: {} };
  try {
    return JSON.parse(fs.readFileSync(STATUS_JSON_PATH, "utf-8"));
  } catch {
    return { urls: {} };
  }
}

function saveIndexingStatus(status: IndexingStatusJson): void {
  fs.writeFileSync(STATUS_JSON_PATH, JSON.stringify(status, null, 2), "utf-8");
}

function getUrlsToSend(
  allUrls: UrlWithPriority[],
  statusMap: Record<string, IndexingStatusEntry>,
  quota: number
): UrlWithPriority[] {
  const cutoff = new Date();
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
  auth: OAuth2Client,
  url: string,
  type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"
): Promise<{ success: boolean; errorMsg?: string }> {
  const indexing = google.indexing({ version: "v3", auth });
  try {
    await indexing.urlNotifications.publish({
      requestBody: { url, type },
    });
    return { success: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { success: false, errorMsg: msg };
  }
}

// ========== CSV ==========
function ensureReportCsvExists(): void {
  if (!fs.existsSync(REPORT_CSV_PATH)) {
    fs.writeFileSync(REPORT_CSV_PATH, CSV_HEADER, "utf-8");
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

// ========== メイン ==========
async function run(dryRun: boolean, matches: string[] = []): Promise<void> {
  console.log("========================================");
  console.log("  Google Indexing API 自動送信 (OAuth)");
  console.log("========================================\n");

  ensureLogsDir();

  console.log("[1/4] サイトマップから URL を収集しています…");
  const allUrls = await collectAllUrlsWithPriority();
  const topCount = allUrls.filter((u) => u.priority === "Top").length;
  const highCount = allUrls.filter((u) => u.priority === "High").length;
  const normalCount = allUrls.length - topCount - highCount;
  console.log(
    `       合計 ${allUrls.length} 件（記事=Top: ${topCount} / 補助金LP=High: ${highCount} / その他: ${normalCount}）\n`
  );

  // --match <substr> 指定時は、その文字列を含むURLだけに絞って優先送信する
  // （新規ページ群を狙って即インデックス申請したいとき用。例: --match /data/）
  const pool =
    matches.length > 0 ? allUrls.filter((u) => matches.some((m) => u.url.includes(m))) : allUrls;
  if (matches.length > 0) {
    console.log(`       フィルタ(--match=${matches.join(", ")}): ${pool.length} 件に限定\n`);
  }

  const statusMap = loadIndexingStatus().urls;
  const toSend = getUrlsToSend(pool, statusMap, DAILY_QUOTA);
  const toSendTop = toSend.filter((u) => u.priority === "Top").length;
  const toSendHigh = toSend.filter((u) => u.priority === "High").length;
  const toSendNormal = toSend.length - toSendTop - toSendHigh;

  console.log("[2/4] 送信対象の選定結果");
  console.log(`       本日送信予定: ${toSend.length} 件（上限 ${DAILY_QUOTA} 件）`);
  console.log(`       記事(Top): ${toSendTop} / 補助金LP(High): ${toSendHigh} / その他: ${toSendNormal}\n`);

  if (dryRun) {
    console.log("[Dry Run] 実際の送信は行いません。");
    if (toSend.length > 0) {
      console.log("送信予定の先頭10件:");
      toSend.slice(0, 10).forEach((u, i) => console.log(`  ${i + 1}. [${u.priority}] ${u.url}`));
    }
    return;
  }

  if (toSend.length === 0) {
    console.log("送信対象がありません。未送信または30日経過したURLがありません。\n");
    return;
  }

  // OAuth 認証（初回はブラウザフロー）
  const auth = await authorize();

  console.log("\n[3/4] 送信を開始します…\n");
  const today = new Date().toISOString().slice(0, 10);
  const results: SendResult[] = [];
  const updatedStatus = loadIndexingStatus();
  let successCount = 0;
  let errorCount = 0;
  const firstErrors: string[] = [];

  for (let i = 0; i < toSend.length; i++) {
    const item = toSend[i];
    const shortUrl = item.url.length > 60 ? item.url.slice(0, 57) + "..." : item.url;
    process.stdout.write(`       ${String(i + 1).padStart(3)}/${toSend.length} [${item.priority.padEnd(6)}] ${shortUrl}`);
    const { success, errorMsg } = await sendUrlToIndexingApi(auth, item.url, "URL_UPDATED");
    const status = success ? "SUCCESS" : "ERROR";
    results.push({ url: item.url, priority: item.priority, status, lastSent: today });
    updatedStatus.urls[item.url] = { lastSent: today, status };
    if (success) {
      successCount++;
      process.stdout.write(" ✓\n");
    } else {
      errorCount++;
      process.stdout.write(" ✗\n");
      if (firstErrors.length < 3 && errorMsg) firstErrors.push(`${item.url} → ${errorMsg}`);
    }
  }

  saveIndexingStatus(updatedStatus);
  appendToReportCsv(results);

  console.log("\n[4/4] 完了");
  console.log(`       成功: ${successCount} 件、エラー: ${errorCount} 件`);
  console.log(`       状態ファイル: ${STATUS_JSON_PATH}`);
  console.log(`       証拠ログ（CSV）: ${REPORT_CSV_PATH}`);
  if (firstErrors.length > 0) {
    console.log("\n[エラー詳細（先頭3件）]:");
    firstErrors.forEach((e) => console.log("  " + e));
  }
}

const dryRun = process.argv.includes("--dry-run");
// --match <substr> を複数指定可能（指定文字列を含むURLだけに絞って送信）
const matches: string[] = [];
{
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--match" && argv[i + 1]) matches.push(argv[i + 1]);
  }
}
run(dryRun, matches).catch((e) => {
  console.error("実行エラー:", e);
  process.exit(1);
});
