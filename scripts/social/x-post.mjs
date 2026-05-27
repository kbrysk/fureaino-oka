/**
 * x-post.mjs — X(旧Twitter)予約投稿の実行スクリプト（公式 X API v2 / 依存ゼロ）
 *
 * 設計: social/x-queue.json の status=approved かつ scheduledAt 到来済みの投稿を
 *       公式 X API v2（POST /2/tweets）で投稿し、status=posted に更新する。
 *       BAN回避のため公式APIのみ使用（ブラウザ操作・cookie偽装・自動フォロー等は一切しない）。
 *
 * 使い方:
 *   node scripts/social/x-post.mjs            # 予約時刻が来た approved を投稿
 *   node scripts/social/x-post.mjs --dry-run  # 投稿せず対象だけ表示（鍵不要・動作確認用）
 *   node scripts/social/x-post.mjs --max 1     # 1回の実行で投稿する最大件数（既定: 全件）
 *
 * 認証（OAuth 1.0a User Context / 自分のアカウントへ投稿する最も簡単な方式）:
 *   .env.local もしくは環境変数(GitHub Actions Secrets)に以下4つ。
 *   X Developer Portal の App → Keys and tokens で発行（Access Token は
 *   "Read and Write" 権限で生成すること）。
 *     X_API_KEY         （API Key / Consumer Key）
 *     X_API_SECRET      （API Key Secret / Consumer Secret）
 *     X_ACCESS_TOKEN    （Access Token）
 *     X_ACCESS_SECRET   （Access Token Secret）
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";

const QUEUE_PATH = path.join(process.cwd(), "social", "x-queue.json");
const ENDPOINT = "https://api.twitter.com/2/tweets";

// .env.local の簡易読込（依存を増やさない・既存スクリプトと同じ流儀）
function loadEnvLocal() {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

// RFC 3986 パーセントエンコード（OAuth署名で必須）
function pctEncode(str) {
  return encodeURIComponent(str).replace(
    /[!*'()]/g,
    (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase()
  );
}

// OAuth 1.0a 署名付き Authorization ヘッダを生成
function buildOAuthHeader(method, url, keys) {
  const oauth = {
    oauth_consumer_key: keys.apiKey,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: keys.accessToken,
    oauth_version: "1.0",
  };
  // POST /2/tweets は本文がJSONのため、署名にはoauthパラメータのみを含める
  const paramString = Object.keys(oauth)
    .sort()
    .map((k) => `${pctEncode(k)}=${pctEncode(oauth[k])}`)
    .join("&");
  const baseString = [method.toUpperCase(), pctEncode(url), pctEncode(paramString)].join("&");
  const signingKey = `${pctEncode(keys.apiSecret)}&${pctEncode(keys.accessSecret)}`;
  const signature = crypto.createHmac("sha1", signingKey).update(baseString).digest("base64");
  oauth.oauth_signature = signature;
  const header =
    "OAuth " +
    Object.keys(oauth)
      .sort()
      .map((k) => `${pctEncode(k)}="${pctEncode(oauth[k])}"`)
      .join(", ");
  return header;
}

async function postTweet(text, keys) {
  const auth = buildOAuthHeader("POST", ENDPOINT, keys);
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`X API ${res.status}: ${JSON.stringify(data)}`);
  }
  return data?.data?.id ?? null;
}

async function main() {
  loadEnvLocal();
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const maxIdx = args.indexOf("--max");
  const max = maxIdx >= 0 ? parseInt(args[maxIdx + 1], 10) : Infinity;

  if (!fs.existsSync(QUEUE_PATH)) {
    console.error(`キューが見つかりません: ${QUEUE_PATH}`);
    process.exit(1);
  }
  const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, "utf8"));
  const now = Date.now();

  const due = queue.posts.filter(
    (p) => p.status === "approved" && !p.postedAt && new Date(p.scheduledAt).getTime() <= now
  );

  if (due.length === 0) {
    console.log("投稿対象なし（approved かつ予約時刻到来済みのものがありません）");
    return;
  }

  const keys = {
    apiKey: process.env.X_API_KEY,
    apiSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessSecret: process.env.X_ACCESS_SECRET,
  };
  if (!dryRun && Object.values(keys).some((v) => !v)) {
    console.error("X APIキーが未設定です（X_API_KEY / X_API_SECRET / X_ACCESS_TOKEN / X_ACCESS_SECRET）。");
    process.exit(1);
  }

  let count = 0;
  let changed = false;
  for (const post of due) {
    if (count >= max) break;
    if (dryRun) {
      console.log(`[dry-run] 投稿予定 ${post.id} @ ${post.scheduledAt}\n${post.text}\n---`);
      count++;
      continue;
    }
    try {
      const tweetId = await postTweet(post.text, keys);
      post.status = "posted";
      post.postedAt = new Date().toISOString();
      post.tweetId = tweetId;
      changed = true;
      count++;
      console.log(`投稿成功 ${post.id} → tweetId=${tweetId}`);
    } catch (e) {
      console.error(`投稿失敗 ${post.id}: ${e.message}`);
    }
  }

  if (changed) {
    fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2) + "\n", "utf8");
    console.log(`キュー更新済み（${count}件 posted）`);
  } else if (dryRun) {
    console.log(`[dry-run] 対象 ${count} 件（実際の投稿・更新はしていません）`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
