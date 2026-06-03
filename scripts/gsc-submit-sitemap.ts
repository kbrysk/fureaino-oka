/**
 * Search Console API でサイトマップを送信（再送信）するスクリプト。
 * 認証は ADC（gcloud auth application-default login で作成した自分=オーナーの認証情報）。
 *
 * ※ 送信には「書き込み」スコープ（webmasters）が必要。
 *    レポート取得は webmasters.readonly で足りるが、送信は不可。
 *    ADC を読み取り専用スコープで作成している場合は、下記で作り直してから実行する:
 *      gcloud auth application-default login --scopes=openid,https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/webmasters
 *      gcloud auth application-default set-quota-project seizenseiri-497212
 *
 * 使い方:
 *   npx tsx scripts/gsc-submit-sitemap.ts
 *   npx tsx scripts/gsc-submit-sitemap.ts https://www.fureaino-oka.com/sitemap.xml https://www.fureaino-oka.com/sitemap/main.xml
 *
 * 環境変数:
 *   GSC_SITE_URL  プロパティ。URLプレフィックス="https://www.fureaino-oka.com/"（既定）/ ドメイン="sc-domain:fureaino-oka.com"
 */
import { google } from "googleapis";
import { getCanonicalBase } from "../app/lib/site-url";

const SCOPES = ["https://www.googleapis.com/auth/webmasters"];

function resolveSiteUrl(): string {
  const fromEnv = typeof process.env.GSC_SITE_URL === "string" && process.env.GSC_SITE_URL.trim();
  if (fromEnv) return fromEnv;
  return getCanonicalBase().replace(/\/$/, "") + "/";
}

function errMsg(e: unknown): string {
  if (e && typeof e === "object" && "message" in e) return String((e as { message: unknown }).message);
  return String(e);
}

async function main() {
  const args = process.argv.slice(2);
  const siteUrl = resolveSiteUrl();
  const base = getCanonicalBase().replace(/\/$/, "");
  const feedpaths = args.filter((a) => a.startsWith("http"));
  const targets = feedpaths.length ? feedpaths : [`${base}/sitemap.xml`];

  console.log("========================================");
  console.log("  Search Console サイトマップ送信");
  console.log("========================================");
  console.log(`  プロパティ: ${siteUrl}`);
  console.log(`  送信対象: ${targets.join(", ")}\n`);

  const auth = new google.auth.GoogleAuth({ scopes: SCOPES });
  const sc = google.searchconsole({ version: "v1", auth });

  let anyFailed = false;
  for (const feedpath of targets) {
    process.stdout.write(`  送信: ${feedpath} … `);
    try {
      await sc.sitemaps.submit({ siteUrl, feedpath });
      console.log("OK");
    } catch (e) {
      anyFailed = true;
      console.log("失敗");
      console.error(`    [エラー] ${errMsg(e)}`);
    }
  }

  // 送信後の登録状況を表示
  try {
    const list = await sc.sitemaps.list({ siteUrl });
    const sitemaps = list.data.sitemap ?? [];
    console.log(`\n  登録済みサイトマップ（${sitemaps.length}件）:`);
    for (const s of sitemaps) {
      console.log(
        `   - ${s.path}\n     最終送信=${s.lastSubmitted ?? "-"} / 最終取得=${s.lastDownloaded ?? "-"} / エラー=${s.errors ?? 0} / 警告=${s.warnings ?? 0}`
      );
    }
  } catch (e) {
    console.error(`  一覧取得に失敗: ${errMsg(e)}`);
  }

  if (anyFailed) {
    console.error(
      "\n  一部の送信に失敗しました。『insufficient』『permission』『scope』を含む場合は、" +
        "書き込みスコープでADCを作り直してください:\n" +
        "    gcloud auth application-default login --scopes=openid,https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/webmasters\n" +
        "    gcloud auth application-default set-quota-project seizenseiri-497212\n"
    );
    process.exit(1);
  }
  console.log("\n完了。");
}

main().catch((err) => {
  const msg = err instanceof Error ? err.message : String(err);
  if (/could not load the default credentials|application default credentials/i.test(msg)) {
    console.error("\n【エラー】ログイン情報（ADC）が見つかりません。先に次を実行してください:");
    console.error(
      "  gcloud auth application-default login --scopes=openid,https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/webmasters"
    );
    console.error("  gcloud auth application-default set-quota-project seizenseiri-497212\n");
    process.exit(1);
  }
  console.error("予期しないエラー:", msg);
  process.exit(1);
});
