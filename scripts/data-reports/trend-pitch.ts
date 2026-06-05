/**
 * 検索トレンドレポート 記者向けピッチメール生成
 *
 * 入力: app/lib/data/trend-reports/YYYY-MM.json
 * 出力: logs/data-reports/trends/YYYY-MM-pitch.md
 *
 * 用途: 編集部から終活・シニア・経済・地方紙の記者に送る初回コンタクト用ドラフト
 * 原則:
 *   - リンク掲載依頼ではなく、データ提供のお知らせとして書く
 *   - 「相互リンク」「SEO」「被リンク」の語を使わない
 *   - 出典明記とCC BY 4.0の自由利用を明示
 */
import fs from "node:fs";
import path from "node:path";

const PUBLIC_DATA_DIR = path.join(
  process.cwd(),
  "app",
  "lib",
  "data",
  "trend-reports"
);
const OUT_DIR = path.join(process.cwd(), "logs", "data-reports", "trends");
const REPORT_MONTH =
  process.env.REPORT_MONTH || new Date().toISOString().slice(0, 7);
const SITE_BASE = "https://www.fureaino-oka.com";

type AnalyzedReport = {
  report_month: string;
  keyword_count: number;
  trending_top10: Array<{
    keyword: string;
    label: string;
    cluster: string;
    liftPercent: number;
    periodAverage: number;
  }>;
  clusters: Array<{
    cluster: string;
    label: string;
    averagePeriodInterest: number;
    averageLiftPercent: number;
  }>;
  parent_child_gap_signals: Array<{
    keyword: string;
    label: string;
    liftPercent: number;
    periodAverage: number;
  }>;
  regions_top: Array<{
    name: string;
    averageValue: number;
    topKeywords: string[];
  }>;
  rising_related_queries: Array<{
    query: string;
    sourceKeyword: string;
    value: number;
  }>;
};

function formatMonth(month: string): string {
  const [y, m] = month.split("-");
  return `${y}年${parseInt(m, 10)}月`;
}

function formatLift(lift: number): string {
  return `${lift > 0 ? "+" : ""}${lift.toFixed(1)}%`;
}

function main() {
  const file = path.join(PUBLIC_DATA_DIR, `${REPORT_MONTH}.json`);
  if (!fs.existsSync(file)) {
    console.error(`データがありません: ${file}`);
    process.exit(1);
  }
  const data: AnalyzedReport = JSON.parse(fs.readFileSync(file, "utf-8"));
  const monthLabel = formatMonth(REPORT_MONTH);
  const reportUrl = `${SITE_BASE}/data/seizen-seiri-trends/${REPORT_MONTH}/`;
  const datasetUrl = `${SITE_BASE}/data/seizen-seiri-trends/${REPORT_MONTH}/dataset.json`;

  const topCluster = [...data.clusters].sort(
    (a, b) => b.averageLiftPercent - a.averageLiftPercent
  )[0];

  const topRegion = data.regions_top[0];

  const top3 = data.trending_top10.slice(0, 3);

  const pitchSubject = `【調査リリース】終活・生前整理 検索トレンド ${monthLabel}版（ふれあいの丘 編集部）`;

  const pitchBody = `件名: ${pitchSubject}

ご担当者様

突然のご連絡失礼いたします。
生前整理・終活・実家じまいに関する情報メディアを運営しております、
ふれあいの丘編集部です。

このたび、当編集部が継続観測している終活・生前整理関連キーワード${data.keyword_count}語の
${monthLabel}検索動向を集計し、月次レポートとして公開いたしました。

【${monthLabel}版 主な発見】

1. 急上昇キーワード TOP3
${top3
  .map(
    (k, i) =>
      `   ${i + 1}. 「${k.label}」 前期比 ${formatLift(k.liftPercent)}（平均関心度 ${k.periodAverage}）`
  )
  .join("\n")}

2. 6クラスタの中で前期比が最も大きく上昇したのは
   「${topCluster.label}」（前期比 ${formatLift(topCluster.averageLiftPercent)}）

3. ${topRegion ? `関心度が最も高い都道府県は ${topRegion.name}（全KW平均 ${topRegion.averageValue}）。
   ${topRegion.topKeywords.length > 0 ? `特に「${topRegion.topKeywords[0]}」「${topRegion.topKeywords[1] ?? ""}」の関心が高い傾向` : ""}` : "都道府県別データを集計"}

【データの特徴】

- ふれあいの丘編集部の独自クラスタ定義（生前整理コア／親世代の悩み／親子の温度差／
  制度・お金・法律／処分・買取・整理／トラブル・消費者保護）に基づく構造化集計
- 「親が片付けを嫌がる」「実家が片付かない」など、親子のすれ違いを示すシグナルを
  独自に観測している点が他社調査にない切り口

【レポート全文・データセット（無料公開）】

レポート: ${reportUrl}
データセット（JSON, CC BY 4.0）: ${datasetUrl}

出典を明記いただければ、記事・資料・研究等での引用や再配布を自由に行っていただけます。
取材時の解説者コメントや、追加データの抽出依頼にも対応いたします。

【データの留意点】

- 数値は Google Trends の相対指数（0〜100）であり、絶対的な検索回数ではありません
- 検索動向から因果関係を断定するものではありません
- 介護・相続・税務・遺言など個別の判断は、専門家・自治体公式窓口へのご相談を推奨しています

ご不明点・追加のご質問はお気軽にお寄せください。
よろしくお願いいたします。

---
生前整理支援センター ふれあいの丘 編集部
${SITE_BASE}/
お問い合わせ: ${SITE_BASE}/contact
`;

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, `${REPORT_MONTH}-pitch.md`);
  fs.writeFileSync(outPath, pitchBody, "utf-8");

  // 短い1行サマリ（Dataset schema description にも使える）
  const summaryPath = path.join(OUT_DIR, `${REPORT_MONTH}-summary.txt`);
  const summary = `${monthLabel}の終活・生前整理関連検索トレンド集計レポート。急上昇TOP1「${top3[0]?.label}」が前期比${formatLift(top3[0]?.liftPercent ?? 0)}。「${topCluster.label}」クラスタが前期比${formatLift(topCluster.averageLiftPercent)}と最大の伸び。${topRegion ? `関心度トップ地域は${topRegion.name}。` : ""}`;
  fs.writeFileSync(summaryPath, summary, "utf-8");

  console.log("========================================");
  console.log(`  ピッチメール ドラフト生成`);
  console.log("========================================");
  console.log(`\n件名: ${pitchSubject}\n`);
  console.log(`出力:`);
  console.log(`  ${path.relative(process.cwd(), outPath)}`);
  console.log(`  ${path.relative(process.cwd(), summaryPath)}`);
}

main();
