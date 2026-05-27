/**
 * set-eyecatch.mjs — 記事のアイキャッチ（OGP）画像を microCMS に設定する。
 *
 * 仕組み:
 *   1. ローカル画像を microCMS メディアにアップロード（Management API）
 *   2. blogs の該当記事の "thumbnail" フィールドにアップロード先URLを設定（PATCH）
 *   ※ サイトのカード・本文ヒーロー・OGP はいずれも post.thumbnail を参照しているため、
 *      thumbnail を設定すれば全箇所＋SNSのOGPに反映される。
 *
 * 使い方:
 *   node scripts/content/set-eyecatch.mjs <kw_id> [画像パス]
 *   例: node scripts/content/set-eyecatch.mjs P1-004
 *       node scripts/content/set-eyecatch.mjs P1-004 assets/ogp/jikka-jimai-guide.png
 *   画像パス省略時は assets/ogp/<slug>.(png|jpg|jpeg|webp) を自動探索。
 *
 * 前提:
 *   - content/pipeline/<kw_id>/meta.json が存在（slug取得用）
 *   - .env.local に MICROCMS_SERVICE_DOMAIN / MICROCMS_WRITE_API_KEY
 *     （メディアアップロード権限が必要。無ければ MICROCMS_MEDIA_API_KEY を使用）
 */
import fs from "fs";
import path from "path";

function loadEnvLocal() {
  const p = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

function findImage(slug, explicit) {
  if (explicit) {
    if (!fs.existsSync(explicit)) { console.error(`【エラー】画像が見つかりません: ${explicit}`); process.exit(2); }
    return explicit;
  }
  const dir = path.join(process.cwd(), "assets", "ogp");
  for (const ext of ["png", "jpg", "jpeg", "webp"]) {
    const p = path.join(dir, `${slug}.${ext}`);
    if (fs.existsSync(p)) return p;
  }
  console.error(`【エラー】assets/ogp/${slug}.(png|jpg|jpeg|webp) が見つかりません。画像を保存するかパスを指定してください。`);
  process.exit(2);
}

function mimeOf(file) {
  const e = file.toLowerCase().split(".").pop();
  return e === "jpg" || e === "jpeg" ? "image/jpeg" : e === "webp" ? "image/webp" : "image/png";
}

async function main() {
  loadEnvLocal();
  const args = process.argv.slice(2);
  const kwId = args.find((a) => !a.startsWith("--"));
  const imgArg = args.filter((a) => !a.startsWith("--") && a !== kwId)[0];
  if (!kwId) { console.error("使い方: node scripts/content/set-eyecatch.mjs <kw_id> [画像パス]"); process.exit(2); }

  const metaPath = path.join(process.cwd(), "content", "pipeline", kwId, "meta.json");
  if (!fs.existsSync(metaPath)) { console.error(`【エラー】meta.json が見つかりません: ${metaPath}`); process.exit(2); }
  const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
  const slug = meta.slug;
  if (!slug) { console.error("【エラー】meta.json に slug がありません。"); process.exit(2); }

  const imgPath = findImage(slug, imgArg);
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  const mediaKey = process.env.MICROCMS_MEDIA_API_KEY || process.env.MICROCMS_WRITE_API_KEY;
  const writeKey = process.env.MICROCMS_WRITE_API_KEY;
  if (!serviceDomain || !writeKey) { console.error("【未設定】MICROCMS_SERVICE_DOMAIN / MICROCMS_WRITE_API_KEY が必要です。"); process.exit(1); }

  const { createClient, createManagementClient } = await import("microcms-js-sdk");

  // 1) メディアアップロード
  const buf = fs.readFileSync(imgPath);
  const blob = new Blob([buf], { type: mimeOf(imgPath) });
  const fileName = `${slug}.${imgPath.toLowerCase().split(".").pop()}`;
  console.log(`アップロード: ${imgPath} (${(buf.length / 1024).toFixed(0)}KB) -> microCMS media`);

  const mgmt = createManagementClient({ serviceDomain, apiKey: mediaKey });
  let mediaUrl;
  try {
    const res = await mgmt.uploadMedia({ data: blob, name: fileName });
    mediaUrl = typeof res === "string" ? res : res.url;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("【メディアアップロード失敗】", msg);
    console.error("→ APIキーに『メディア(media)』のアップロード権限が必要です。microCMS管理画面 → API設定 → APIキーで付与するか、MICROCMS_MEDIA_API_KEY を .env.local に設定してください。");
    process.exit(1);
  }
  if (!mediaUrl) { console.error("【中止】アップロード結果にURLがありません。"); process.exit(1); }
  console.log(`メディアURL: ${mediaUrl}`);

  // 2) thumbnail フィールドに設定（既存=公開維持のPATCH）
  const w = createClient({ serviceDomain, apiKey: writeKey });
  try {
    await w.update({ endpoint: "blogs", contentId: slug, content: { thumbnail: mediaUrl } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("【thumbnail設定失敗】", msg);
    process.exit(1);
  }
  console.log(`完了: ${slug} の thumbnail を設定しました。`);
  console.log(`確認: https://www.fureaino-oka.com/articles/${slug} （ISR最大10分で反映）`);
}

main().catch((e) => { console.error("予期しないエラー:", e); process.exit(1); });
