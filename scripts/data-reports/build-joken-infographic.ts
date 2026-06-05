/**
 * 申請条件の全国実態 インフォグラフィック生成（1200x630・OG比）
 *
 * 出力: public/opendata/akiya-hojokin-joken-infographic.png（＋ .svg）
 * 用途: /data/akiya-hojokin-joken の OG画像／メディアが埋め込める引用ビジュアル。
 *
 * 実行: npx tsx scripts/data-reports/build-joken-infographic.ts
 *
 * データは実値（getSubsidyConditionStats）のみ。捏造しない。
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";
import {
  getSubsidyConditionStats,
  STATS_AS_OF,
  STATS_CREDIT,
} from "../../app/lib/data/municipality-stats";

const OUT_DIR = path.join(process.cwd(), "public", "opendata");

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** インフォグラフィック用の短縮ラベル（key→短い表現）。 */
const SHORT_LABEL: Record<string, string> = {
  tax: "税の滞納がないこと",
  budget: "予算・先着順（早い者勝ち）",
  danger: "危険・老朽であること",
  contractor: "市内・指定業者での施工",
  owner: "所有者・相続人であること",
  preStart: "着工前の申請が必要",
  quake: "旧耐震（昭和56年以前）等",
};

function buildSvg(): string {
  const W = 1200;
  const H = 630;
  const stats = getSubsidyConditionStats();
  const top = stats.patterns.slice(0, 5);

  const green = "#2f7d5b";
  const ink = "#33312e";
  const sub = "#6b5f51";
  const cream = "#fffdf8";
  const track = "#eee7da";

  const barX = 70;
  const barW = 1060;
  const rowTop0 = 222;
  const rowH = 76;

  const rows = top
    .map((p, i) => {
      const top0 = rowTop0 + i * rowH;
      const label = SHORT_LABEL[p.key] ?? p.label;
      const fillW = Math.max(8, Math.round((barW * p.percent) / 100));
      return `
  <text x="${barX}" y="${top0}" font-family="sans-serif" font-size="30" fill="${ink}">${esc(label)}</text>
  <text x="${barX + barW}" y="${top0}" text-anchor="end" font-family="sans-serif" font-size="34" font-weight="bold" fill="${green}">${p.percent}%</text>
  <rect x="${barX}" y="${top0 + 12}" width="${barW}" height="20" rx="10" fill="${track}"/>
  <rect x="${barX}" y="${top0 + 12}" width="${fillW}" height="20" rx="10" fill="${green}"/>`;
    })
    .join("");

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${cream}"/>
  <rect x="0" y="0" width="${W}" height="14" fill="${green}"/>
  <text x="70" y="86" font-family="sans-serif" font-size="28" fill="${sub}">独自調査 ${esc(STATS_AS_OF)}・${esc(STATS_CREDIT)}</text>
  <text x="70" y="142" font-family="sans-serif" font-size="44" font-weight="bold" fill="${ink}">空き家の解体補助金「申請条件」の全国実態</text>
  <text x="70" y="184" font-family="sans-serif" font-size="28" fill="${sub}">補助金を確認できた ${esc(stats.sampleSize.toLocaleString("ja-JP"))}自治体の公式な申請条件を分析（条件文に記載がある割合）</text>
  ${rows}
  <text x="70" y="600" font-family="sans-serif" font-size="23" fill="${sub}">生前整理支援センター ふれあいの丘 ｜ CC BY 4.0 ｜ www.fureaino-oka.com/data/akiya-hojokin-joken</text>
</svg>`;
}

async function main(): Promise<void> {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const svg = buildSvg();
  const svgPath = path.join(OUT_DIR, "akiya-hojokin-joken-infographic.svg");
  const pngPath = path.join(OUT_DIR, "akiya-hojokin-joken-infographic.png");
  fs.writeFileSync(svgPath, svg, "utf8");
  await sharp(Buffer.from(svg)).png().toFile(pngPath);
  console.log("生成完了:");
  console.log("  " + path.relative(process.cwd(), svgPath));
  console.log("  " + path.relative(process.cwd(), pngPath));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
