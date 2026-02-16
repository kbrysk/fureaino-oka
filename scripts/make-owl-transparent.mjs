/**
 * フクロウ画像の白い背景を透明化する（背景色と同化させるため）
 * 使い方: node scripts/make-owl-transparent.mjs
 */
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const imagesDir = path.join(projectRoot, "public", "images");
const inputPath = path.join(imagesDir, "owl-character.png");
const tempPath = path.join(imagesDir, "owl-character-transparent-temp.png");

// この値以上を白とみなして透明化（250＝ほぼ白のみ。248でオフホワイトも含める）
const WHITE_THRESHOLD = 248;

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
    const a = data[i + 3];
    // 白〜オフホワイトを透明に
    if (r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD) {
      data[i + 3] = 0;
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(tempPath);

  const { renameSync, unlinkSync } = await import("fs");
  unlinkSync(inputPath);
  renameSync(tempPath, inputPath);

  console.log("OK: 白背景を透明化して上書きしました:", inputPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
