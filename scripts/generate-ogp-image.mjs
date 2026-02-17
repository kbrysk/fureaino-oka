/**
 * サイト全体のOGP画像（1200x630）を静的PNGとして生成する。
 * 本番で readFile が使えない環境（Vercel サーバーレス等）を避け、確実に表示させるため。
 *
 * 使い方: node scripts/generate-ogp-image.mjs
 * 出力: public/opengraph-image.png
 */
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const WIDTH = 1200;
const HEIGHT = 630;

const SITE_NAME = "生前整理支援センター ふれあいの丘";
const MAIN_COPY =
  "モノの整理だけでなく、心の整理も。エンディングノートから始まる生前整理。";
const SUB_COPY =
  "『何から始める？』の計画作りから、実家の片付け、不動産売却まで。あなたのペースで進めるトータルサポート。";

async function main() {
  const owlPath = join(root, "public", "images", "owl-character.png");
  let owlBase64 = "";
  try {
    const buf = await readFile(owlPath);
    owlBase64 = buf.toString("base64");
  } catch (e) {
    console.warn("owl-character.png を読み込めません。フクロウなしで生成します。", e.message);
  }

  // 左側: フクロウエリア（緑背景） 380px
  // 右側: テキストエリア
  const owlWidth = 280;
  const leftBg = "#e8f0ec";
  const rightBg = "#f8f6f3";
  const textColor = "#2d2d2d";
  const siteColor = "#5b8a72";
  const subColor = "#6b7280";
  const badgeBg = "#fef3c7";
  const badgeBorder = "#fcd34d";
  const badgeText = "#92400e";

  const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <style>
      .site-name { font: bold 26px sans-serif; fill: ${siteColor}; }
      .main-copy { font: bold 36px sans-serif; fill: ${textColor}; }
      .sub-copy { font: 20px sans-serif; fill: ${subColor}; }
      .badge { font: bold 18px sans-serif; fill: ${badgeText}; }
    </style>
  </defs>
  <!-- 右側ベース -->
  <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="${rightBg}"/>
  <!-- 左側（フクロウエリア） -->
  <rect x="0" y="0" width="380" height="${HEIGHT}" fill="${leftBg}"/>
  ${
    owlBase64
      ? `<image xlink:href="data:image/png;base64,${owlBase64}" x="50" y="${(HEIGHT - owlWidth) / 2}" width="${owlWidth}" height="${owlWidth}" preserveAspectRatio="xMidYMid meet"/>`
      : ""
  }
  <!-- 右側テキスト -->
  <rect x="428" y="184" width="120" height="36" rx="18" fill="${badgeBg}" stroke="${badgeBorder}" stroke-width="2"/>
  <text x="488" y="208" text-anchor="middle" class="badge">完全無料</text>
  <text x="428" y="270" class="site-name">${escapeXml(SITE_NAME)}</text>
  <text x="428" y="330" class="main-copy">${escapeXml(MAIN_COPY)}</text>
  <text x="428" y="380" class="sub-copy">${escapeXml(SUB_COPY)}</text>
</svg>
`;

  const outPath = join(root, "public", "opengraph-image.png");
  const svgBuffer = Buffer.from(svg);
  await sharp(svgBuffer)
    .resize(WIDTH, HEIGHT)
    .png()
    .toFile(outPath);
  console.log("Generated:", outPath);
}

function escapeXml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
