/**
 * 運営者写真（operator.png）をフクロウの形に切り抜く
 * 白〜薄いベージュを透明化し、背景（クリーム色）と同化させる
 * 使い方: node scripts/make-operator-transparent.mjs
 */
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const imagesDir = path.join(projectRoot, "public", "images");
const inputPath = path.join(imagesDir, "operator.png");
const outputPath = path.join(imagesDir, "operator.png");
const tempPath = path.join(imagesDir, "operator-transparent-temp.png");

// 完全に透明にする閾値（この値以上＝背景とみなす）
const FULL_TRANSPARENT_THRESHOLD = 235;
// この値以下は不透明のまま（フクロウの体）
const OPAQUE_THRESHOLD = 208;
// その間はグラデーションで境界をなめらかに

function getAlpha(r, g, b) {
  const avg = (r + g + b) / 3;
  if (avg >= FULL_TRANSPARENT_THRESHOLD) return 0;
  if (avg <= OPAQUE_THRESHOLD) return 255;
  const t = (avg - OPAQUE_THRESHOLD) / (FULL_TRANSPARENT_THRESHOLD - OPAQUE_THRESHOLD);
  return Math.round(255 * (1 - t));
}

async function main() {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const alpha = getAlpha(r, g, b);
    data[i + 3] = alpha;
  }

  const { renameSync, unlinkSync } = await import("fs");
  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(tempPath);

  unlinkSync(inputPath);
  renameSync(tempPath, outputPath);

  console.log("OK: フクロウの形に切り抜きました（背景透明）:", outputPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
