/**
 * 指定URLだけを Google Indexing API へ即時送信する単発スクリプト（OAuth方式）。
 *
 * 用途: 新設ページ（/akiya, /data/akiya-hojokin-ranking 等）や、
 *       日次クォータ超過で「未完了」になったURLを、ピンポイントで再送する。
 *
 * 使い方:
 *   node scripts/content/index-specific-urls.mjs "https://..." "https://..." ...
 *   （引数なしの場合は下記 DEFAULT_URLS を送信）
 *
 * 前提: credentials/google-indexing-oauth-client.json と
 *       credentials/google-indexing-oauth-token.json（初回認証済み）が存在すること。
 */
import fs from "fs";
import path from "path";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

const ROOT = process.cwd();
const CLIENT_SECRET_PATH = path.join(ROOT, "credentials", "google-indexing-oauth-client.json");
const TOKEN_PATH = path.join(ROOT, "credentials", "google-indexing-oauth-token.json");

const DEFAULT_URLS = [
  "https://www.fureaino-oka.com/data/akiya-hojokin-ranking",
  "https://www.fureaino-oka.com/akiya",
  "https://www.fureaino-oka.com/tools/empty-house-tax",
  "https://www.fureaino-oka.com/articles/master-guide",
];

function getClient() {
  if (!fs.existsSync(CLIENT_SECRET_PATH) || !fs.existsSync(TOKEN_PATH)) {
    console.error("【エラー】OAuthクライアント/トークンが見つかりません。先に npm run index:run:oauth で認証してください。");
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(CLIENT_SECRET_PATH, "utf-8"));
  const creds = raw.installed || raw.web;
  const oauth2Client = new OAuth2Client(creds.client_id, creds.client_secret);
  oauth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8")));
  return oauth2Client;
}

async function main() {
  const urls = process.argv.slice(2).length > 0 ? process.argv.slice(2) : DEFAULT_URLS;
  const auth = getClient();
  await auth.getAccessToken(); // リフレッシュ
  const indexing = google.indexing({ version: "v3", auth });

  console.log(`Indexing API へ ${urls.length} 件を送信します...\n`);
  let ok = 0;
  let ng = 0;
  for (const url of urls) {
    try {
      await indexing.urlNotifications.publish({ requestBody: { url, type: "URL_UPDATED" } });
      console.log(`  ✓ ${url}`);
      ok++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`  ✗ ${url} → ${msg}`);
      ng++;
    }
  }
  console.log(`\n完了: 成功 ${ok} 件 / 失敗 ${ng} 件`);
  if (ng > 0) {
    console.log("※ 失敗が『Quota exceeded』の場合は本日のクォータ超過です。明日のスケジュール実行で自動送信されます。");
  }
}

main().catch((e) => {
  console.error("実行エラー:", e);
  process.exit(1);
});
