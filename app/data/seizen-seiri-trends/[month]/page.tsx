import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getCanonicalBase } from "@/app/lib/site-url";
import { ClusterChart, RegionChart, TrendingChart } from "./TrendChart";

/**
 * 終活・生前整理 検索トレンドレポート（月次）
 *
 * データソース: app/lib/data/trend-reports/YYYY-MM.json
 *   (生成元: scripts/data-reports/trend-analyze.ts)
 *
 * URL: /data/seizen-seiri-trends/[YYYY-MM]/
 */

type Cluster =
  | "core"
  | "parent_struggle"
  | "parent_child_gap"
  | "money_law"
  | "disposal"
  | "trouble";

type KeywordAnalysis = {
  keyword: string;
  label: string;
  cluster: Cluster;
  kwId: string | null;
  monthlyVolume: number | null;
  ymylSensitive: boolean;
  periodAverage: number;
  recent30Avg: number;
  prior60Avg: number;
  liftRatio: number;
  liftPercent: number;
  topRelated: Array<{ query: string; value: number }>;
  risingRelated: Array<{ query: string; value: number }>;
  topRegions: Array<{ name: string; value: number }>;
};

type ClusterSummary = {
  cluster: Cluster;
  label: string;
  description: string;
  keywordCount: number;
  averagePeriodInterest: number;
  averageLiftPercent: number;
  topKeyword: { keyword: string; periodAverage: number } | null;
};

type RegionAggregate = {
  name: string;
  averageValue: number;
  topKeywords: string[];
};

type AnalyzedReport = {
  generated_at: string;
  report_month: string;
  geo: string;
  hl: string;
  keyword_count: number;
  success_count: number;
  summary: {
    averagePeriodInterest: number;
    averageLiftPercent: number;
    trendingCount: number;
    decliningCount: number;
  };
  trending_top10: KeywordAnalysis[];
  declining_top5: KeywordAnalysis[];
  clusters: ClusterSummary[];
  parent_child_gap_signals: KeywordAnalysis[];
  regions_top: RegionAggregate[];
  rising_related_queries: Array<{
    query: string;
    sourceKeyword: string;
    value: number;
  }>;
  keyword_details: KeywordAnalysis[];
};

const REPORTS_DIR = path.join(process.cwd(), "app", "lib", "data", "trend-reports");

function loadReport(month: string): AnalyzedReport | null {
  const file = path.join(REPORTS_DIR, `${month}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8")) as AnalyzedReport;
}

export async function generateStaticParams() {
  if (!fs.existsSync(REPORTS_DIR)) return [];
  return fs
    .readdirSync(REPORTS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({ month: f.replace(".json", "") }));
}

function formatMonth(month: string): string {
  const [y, m] = month.split("-");
  return `${y}年${parseInt(m, 10)}月`;
}

function formatDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

function liftBadge(lift: number) {
  if (lift >= 50) return "bg-red-100 text-red-700";
  if (lift >= 10) return "bg-orange-100 text-orange-700";
  if (lift <= -10) return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-600";
}

function formatLift(lift: number): string {
  return `${lift > 0 ? "+" : ""}${lift.toFixed(1)}%`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ month: string }>;
}): Promise<Metadata> {
  const { month } = await params;
  const report = loadReport(month);
  if (!report) return { title: "ページが見つかりません" };
  const monthLabel = formatMonth(month);
  const title = `終活・生前整理 検索トレンドレポート ${monthLabel}版`;
  const description = `${monthLabel}の終活・生前整理関連キーワード20語のGoogle検索トレンドを編集部が独自に集計。急上昇TOP10、6クラスタ別の関心推移、都道府県別ランキング、親子の温度差シグナルを含む独自データセットを無料公開。CSV/JSON形式のダウンロードに対応。`;
  return {
    title: `${title} | ふれあいの丘`,
    description,
    alternates: {
      canonical: `${getCanonicalBase()}/data/seizen-seiri-trends/${month}/`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${getCanonicalBase()}/data/seizen-seiri-trends/${month}/`,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ month: string }>;
}) {
  const { month } = await params;
  const report = loadReport(month);
  if (!report) notFound();

  const monthLabel = formatMonth(month);
  const canonicalUrl = `${getCanonicalBase()}/data/seizen-seiri-trends/${month}/`;
  const datasetUrl = `${getCanonicalBase()}/data/seizen-seiri-trends/${month}/dataset.json`;

  // Dataset 構造化データ（Google Dataset Search 対応）
  const datasetSchema = {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    name: `終活・生前整理 検索トレンドレポート ${monthLabel}版`,
    description: `${monthLabel}の終活・生前整理関連キーワード${report.keyword_count}語のGoogle検索トレンドを集計したデータセット。急上昇判定・クラスタ別関心度・都道府県別ランキング・関連クエリ急上昇を含む。`,
    url: canonicalUrl,
    sameAs: canonicalUrl,
    creator: {
      "@type": "Organization",
      name: "生前整理支援センター ふれあいの丘",
      url: getCanonicalBase(),
    },
    publisher: {
      "@type": "Organization",
      name: "生前整理支援センター ふれあいの丘",
      url: getCanonicalBase(),
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    keywords: report.keyword_details.map((k) => k.keyword),
    dateCreated: report.generated_at,
    dateModified: report.generated_at,
    isAccessibleForFree: true,
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: datasetUrl,
      },
    ],
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 leading-relaxed text-gray-800">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />

      {/* パンくず */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:underline">
          ホーム
        </Link>
        <span className="mx-2">/</span>
        <Link href="/data/seizen-seiri-trends" className="hover:underline">
          検索トレンドレポート
        </Link>
        <span className="mx-2">/</span>
        <span>{monthLabel}版</span>
      </nav>

      {/* ヘッダー */}
      <header className="mb-10 border-b pb-6">
        <p className="mb-2 inline-block rounded bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          ふれあいの丘 編集部 独自データ
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
          終活・生前整理 検索トレンドレポート
          <br />
          <span className="text-indigo-600">{monthLabel}版</span>
        </h1>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          <div>
            <dt className="text-gray-500">調査対象KW数</dt>
            <dd className="mt-1 font-bold">{report.keyword_count}語</dd>
          </div>
          <div>
            <dt className="text-gray-500">調査地域</dt>
            <dd className="mt-1 font-bold">日本（JP）</dd>
          </div>
          <div>
            <dt className="text-gray-500">調査期間</dt>
            <dd className="mt-1 font-bold">直近90日</dd>
          </div>
          <div>
            <dt className="text-gray-500">発行日</dt>
            <dd className="mt-1 font-bold">{formatDate(report.generated_at)}</dd>
          </div>
        </dl>
      </header>

      {/* エグゼクティブサマリ */}
      <section className="mb-12 rounded-lg bg-amber-50 p-6">
        <h2 className="mb-3 text-xl font-bold text-amber-900">
          📌 今月の主な発見
        </h2>
        <ul className="space-y-2 text-gray-800">
          {report.trending_top10.slice(0, 3).map((kw) => (
            <li key={kw.keyword} className="flex items-start">
              <span className="mr-2 mt-1 text-amber-700">▶</span>
              <span>
                <strong>「{kw.label}」</strong> の検索が前期比{" "}
                <strong className="text-red-600">{formatLift(kw.liftPercent)}</strong>{" "}
                と大きく上昇（平均関心度 {kw.periodAverage}）
              </span>
            </li>
          ))}
          {report.regions_top[0] && (
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-amber-700">▶</span>
              <span>
                関心度が最も高い都道府県は{" "}
                <strong>{report.regions_top[0].name}</strong>{" "}
                （全KW平均 {report.regions_top[0].averageValue}）。地方圏で特に
                強い関心が観測されている
              </span>
            </li>
          )}
        </ul>
      </section>

      {/* 調査方法 */}
      <section className="mb-12">
        <h2 className="mb-4 border-l-4 border-indigo-500 pl-3 text-2xl font-bold">
          調査方法
        </h2>
        <div className="rounded border border-gray-200 bg-gray-50 p-4 text-sm">
          <p>
            生前整理・終活・実家じまい・親世代の悩みなど6クラスタにわたる主要キーワード
            {report.keyword_count}
            語について、Google
            Trends APIで直近90日の関心度推移・関連クエリ・都道府県別の関心度を取得しました。
          </p>
          <p className="mt-2">
            前期比（lift）は「直近30日の平均関心度」÷「それ以前60日の平均関心度」で算出。
            関心度は Google Trends の相対指数（0〜100）であり、絶対的な検索回数ではありません。
          </p>
          <p className="mt-2 text-gray-600">
            出典: Google Trends（{report.geo} / {report.hl}） /
            キーワード定義: ふれあいの丘 編集部
          </p>
        </div>
      </section>

      {/* 急上昇TOP10 */}
      <section className="mb-12">
        <h2 className="mb-4 border-l-4 border-red-500 pl-3 text-2xl font-bold">
          🔥 急上昇キーワード TOP10
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          前期比（直近30日 ÷ 過去60日）の大きい順。グラフは前期比の%表示。
        </p>
        <TrendingChart
          data={report.trending_top10.map((k) => ({
            keyword: k.label,
            liftPercent: k.liftPercent,
            periodAverage: k.periodAverage,
          }))}
        />
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="px-3 py-2">順位</th>
                <th className="px-3 py-2">キーワード</th>
                <th className="px-3 py-2">クラスタ</th>
                <th className="px-3 py-2 text-right">前期比</th>
                <th className="px-3 py-2 text-right">平均関心度</th>
              </tr>
            </thead>
            <tbody>
              {report.trending_top10.map((kw, i) => (
                <tr key={kw.keyword} className="border-b">
                  <td className="px-3 py-2 font-bold">{i + 1}</td>
                  <td className="px-3 py-2">{kw.label}</td>
                  <td className="px-3 py-2 text-xs text-gray-500">
                    {report.clusters.find((c) => c.cluster === kw.cluster)?.label}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-bold ${liftBadge(kw.liftPercent)}`}
                    >
                      {formatLift(kw.liftPercent)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">{kw.periodAverage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* クラスタ別 */}
      <section className="mb-12">
        <h2 className="mb-4 border-l-4 border-emerald-500 pl-3 text-2xl font-bold">
          📊 6クラスタ別の関心傾向
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          ふれあいの丘編集部が定義する6つの関心クラスタごとに、平均関心度と前期比を集計。
        </p>
        <ClusterChart data={report.clusters} />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {report.clusters.map((c) => (
            <div key={c.cluster} className="rounded border border-gray-200 p-4">
              <h3 className="font-bold">{c.label}</h3>
              <p className="mt-1 text-xs text-gray-500">{c.description}</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <div>
                  <span className="text-gray-500">平均関心度</span>{" "}
                  <strong>{c.averagePeriodInterest}</strong>
                </div>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-bold ${liftBadge(c.averageLiftPercent)}`}
                >
                  {formatLift(c.averageLiftPercent)}
                </span>
              </div>
              {c.topKeyword && (
                <p className="mt-2 text-xs text-gray-600">
                  代表KW: <strong>{c.topKeyword.keyword}</strong>（
                  {c.topKeyword.periodAverage}）
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 親子温度差シグナル */}
      <section className="mb-12">
        <h2 className="mb-4 border-l-4 border-rose-500 pl-3 text-2xl font-bold">
          💞 親子の温度差シグナル
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          「親が片付けを嫌がる」「実家が片付かない」など、親世代と子世代のすれ違いを示す検索動向。
          ふれあいの丘編集部が独自に注目している切り口です。
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {report.parent_child_gap_signals.map((kw) => (
            <div
              key={kw.keyword}
              className="rounded border border-rose-200 bg-rose-50 p-4"
            >
              <h3 className="font-bold">{kw.label}</h3>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span>平均関心度 {kw.periodAverage}</span>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-bold ${liftBadge(kw.liftPercent)}`}
                >
                  {formatLift(kw.liftPercent)}
                </span>
              </div>
              {kw.topRelated.length > 0 && (
                <div className="mt-3 text-xs text-gray-600">
                  関連:{" "}
                  {kw.topRelated
                    .slice(0, 2)
                    .map((r) => r.query)
                    .join(" / ")}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 都道府県 */}
      <section className="mb-12">
        <h2 className="mb-4 border-l-4 border-sky-500 pl-3 text-2xl font-bold">
          🗾 関心度が高い都道府県 TOP15
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          全{report.keyword_count}
          KWの関心度を都道府県別に平均した値（Google
          Trendsの相対指数）。上位は地方圏が占める傾向が観測されました。
        </p>
        <RegionChart
          data={report.regions_top
            .slice(0, 15)
            .map((r) => ({ name: r.name, averageValue: r.averageValue }))}
        />
      </section>

      {/* 関連クエリ急上昇 */}
      <section className="mb-12">
        <h2 className="mb-4 border-l-4 border-purple-500 pl-3 text-2xl font-bold">
          🚀 急上昇している関連検索クエリ
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          各主要KWに紐づく「rising」（Google Trends の急上昇クエリ）を集約。
          数値が高いほど、最近の急上昇度合いが大きい。
        </p>
        <ul className="grid gap-2 md:grid-cols-2">
          {report.rising_related_queries.slice(0, 20).map((q, i) => (
            <li
              key={`${q.query}-${i}`}
              className="rounded border border-gray-200 p-3 text-sm"
            >
              <div className="font-bold">{q.query}</div>
              <div className="mt-1 text-xs text-gray-500">
                from「{q.sourceKeyword}」/ score {q.value}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ダウンロード */}
      <section className="mb-12 rounded-lg border-2 border-indigo-200 bg-indigo-50 p-6">
        <h2 className="mb-3 text-xl font-bold text-indigo-900">
          📥 データセット ダウンロード
        </h2>
        <p className="mb-4 text-sm text-gray-700">
          本レポートのデータは、出典明記の上で自由にご利用いただけます（CC BY 4.0）。
          研究・記事執筆・自治体資料への引用など、お気軽にお使いください。
        </p>
        <a
          href={`/data/seizen-seiri-trends/${month}/dataset.json`}
          download
          className="inline-block rounded bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
        >
          JSONデータをダウンロード
        </a>
        <p className="mt-3 text-xs text-gray-600">
          出典表記例: 「終活・生前整理 検索トレンドレポート {monthLabel}版 /
          生前整理支援センター ふれあいの丘」
        </p>
      </section>

      {/* 編集部コメント・免責 */}
      <section className="mb-12">
        <h2 className="mb-4 border-l-4 border-gray-500 pl-3 text-2xl font-bold">
          編集部から
        </h2>
        <div className="space-y-3 text-sm leading-relaxed">
          <p>
            本レポートは、ふれあいの丘編集部が独自に観測している
            {report.keyword_count}
            語のキーワード群について、Google
            Trendsの公開データを集計したものです。
            記事化や引用は、出典を明記の上で自由に行っていただけます。
          </p>
          <p>
            なお、検索データから因果関係を断定することはできません。介護・相続・税務・遺言など
            個別のご判断は、必ず地域包括支援センター、税理士、司法書士、行政書士、自治体公式窓口など
            該当領域の専門家にご相談ください。
          </p>
          <p>
            本レポートに関する取材・解説者コメントのご依頼は、
            <Link href="/contact" className="text-indigo-600 underline">
              お問い合わせフォーム
            </Link>
            より承ります。
          </p>
        </div>
      </section>

      {/* フッター（メタ情報） */}
      <footer className="mt-12 border-t pt-6 text-xs text-gray-500">
        <p>
          発行: 生前整理支援センター ふれあいの丘 編集部 /
          ライセンス: CC BY 4.0 / 最終更新: {formatDate(report.generated_at)}
        </p>
        <p className="mt-1">
          出典: Google Trends（直近90日, {report.geo}, {report.hl}）
        </p>
      </footer>
    </main>
  );
}
