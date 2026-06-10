/**
 * 締切・予算先着の全国実態 インフォグラフィック生成（1200x630・OG比）
 *
 * 出力: public/opendata/akiya-hojokin-shimekiri-infographic.png（＋ .svg）
 * 用途: /data/akiya-hojokin-shimekiri-2026 の OG画像／メディアが埋め込める引用ビジュアル。
 *
 * 実行: npx tsx scripts/data-reports/build-shimekiri-infographic.ts
 *
 * データは実値（getSubsidyTimingStats）のみ。捏造しない。
 * バーで4シグナル（予算先着 / 事前申請必須 / 受付期間 / 年度内完工）の出現率を表示する。
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";
import {
  getSubsidyTimingStats,
  STATS_AS_OF,
  STATS_CREDIT,
} from "../../app/lib/data/municipality-stats";

const OUT_DIR = path.join(process.cwd(), "public", "opendata");

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** インフォグラフィック用の短縮ラベル（signal key→短い表現）。 */
const SHORT_LABEL: Record<string, string> = {
  budgetFirst: "予算先着・枠に達し次第終了（早い者勝ち）",
  preApprove: "交付決定前の着工は対象外（事前申請が必須）",
  window: "受付期間・申請期限が区切られている",
  fyComplete: "年度内の工事完了が条件",
};

function buildSvg(): string {
  const W = 1200;
  const H = 630;
  const stats = getSubsidyTimingStats();
  // 出現率の高い順に4シグナルを表示（関数の戻り値をそのまま使う）。
  const top = stats.signals.slice(0, 4);

  const green = "#2f7d5b";
  const ink = "#33312e";
  const sub = "#6b5f51";
  const cream = "#fffdf8";
  const track = "#eee7da";

  const barX = 70;
  const barW = 1060;
  const rowTop0 = 248;
  const rowH = 84;

  const rows = top
    .map((p, i) => {
      const top0 = rowTop0 + i * rowH;
      const label = SHORT_LABEL[p.key] ?? p.label;
      const fillW = Math.max(8, Math.round((barW * p.pct) / 100));
      return `
  <text x="${barX}" y="${top0}" font-family="sans-serif" font-size="30" fill="${ink}">${esc(label)}</text>
  <text x="${barX + barW}" y="${top0}" text-anchor="end" font-family="sans-serif" font-size="34" font-weight="bold" fill="${green}">${p.pct}%</text>
  <rect x="${barX}" y="${top0 + 12}" width="${barW}" height="20" rx="10" fill="${track}"/>
  <rect x="${barX}" y="${top0 + 12}" width="${fillW}" height="20" rx="10" fill="${green}"/>`;
    })
    .join("");

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${cream}"/>
  <rect x="0" y="0" width="${W}" height="14" fill="${green}"/>
  <text x="70" y="86" font-family="sans-serif" font-size="28" fill="${sub}">独自調査 ${esc(STATS_AS_OF)}・${esc(STATS_CREDIT)}</text>
  <text x="70" y="146" font-family="sans-serif" font-size="44" font-weight="bold" fill="${ink}">空き家解体補助金は「早い者勝ち」</text>
  <text x="70" y="200" font-family="sans-serif" font-size="34" font-weight="bold" fill="${green}">確認できた ${esc(stats.analyzed.toLocaleString("ja-JP"))}自治体の締切リスク</text>
  ${rows}
  <text x="70" y="600" font-family="sans-serif" font-size="23" fill="${sub}">生前整理支援センター ふれあいの丘 ｜ fureaino-oka.com ｜ CC BY 4.0</text>
</svg>`;
}

async function main(): Promise<void> {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const svg = buildSvg();
  const svgPath = path.join(OUT_DIR, "akiya-hojokin-shimekiri-infographic.svg");
  const pngPath = path.join(OUT_DIR, "akiya-hojokin-shimekiri-infographic.png");
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
