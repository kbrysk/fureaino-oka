import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/app/lib/site-url";
import { CoverageChart, TopAmountChart } from "./SubsidyChart";

/**
 * 全国補助金マップ 2026
 * 全国1,741市区町村のうち約99%にあたる1,726市区町村の解体・空き家対策補助金を編集部が独自集計。
 *
 * データソース: app/lib/data/subsidy-map.json
 *   (生成元: scripts/data-reports/subsidy-map-gen.ts)
 */

type PrefSummary = {
  prefId: string;
  prefName: string;
  totalCities: number;
  withSubsidyCount: number;
  coverageRate: number;
  averageMaxAmountYen: number | null;
  medianMaxAmountYen: number | null;
  topCity: { cityName: string; maxAmountYen: number } | null;
};

type CityEntry = {
  prefId: string;
  cityId: string;
  prefName: string;
  cityName: string;
  hasSubsidy: boolean;
  subsidyName?: string;
  maxAmountText?: string;
  maxAmountYen: number | null;
  amountType: string;
  officialUrl?: string;
};

type SubsidyMapData = {
  generated_at: string;
  report_version: string;
  data_source: {
    name: string;
    total_cities: number;
    with_subsidy_count: number;
    coverage_rate_national: number;
    quantified_count: number;
    full_amount_count: number;
    note: string;
  };
  summary_stats: {
    averageMaxAmountYen: number | null;
    medianMaxAmountYen: number | null;
    maxAmountYen: number | null;
    minAmountYen: number | null;
  };
  full_coverage_prefs: string[];
  low_coverage_prefs: Array<{ prefName: string; coverageRate: number }>;
  pref_summaries: PrefSummary[];
  coverage_ranking: PrefSummary[];
  top_amount_ranking: CityEntry[];
  bottom_amount_ranking: CityEntry[];
  all_city_entries: CityEntry[];
};

const DATA_PATH = path.join(
  process.cwd(),
  "app",
  "lib",
  "data",
  "subsidy-map.json"
);

function loadData(): SubsidyMapData {
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8")) as SubsidyMapData;
}

function formatYen(yen: number | null): string {
  if (yen === null) return "—";
  if (yen >= 10000) {
    return `${Math.round(yen / 10000).toLocaleString()}万円`;
  }
  return `${yen.toLocaleString()}円`;
}

function formatDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

const PAGE_PATH = "/data/akiya-subsidy-map-2026";

export const metadata: Metadata = {
  title:
    "全国 空き家・解体補助金マップ 2026｜1,726市区町村を独自調査・カバレッジと支給額を可視化｜ふれあいの丘",
  description:
    "ふれあいの丘編集部が全国1,741市区町村のうち約99%にあたる1,726市区町村の解体・空き家対策補助金を独自集計。補助金を確認できたのは48.9%。都道府県別カバレッジ・最大支給額ランキング・地域格差を可視化（CC BY 4.0・引用歓迎）。",
  alternates: {
    canonical: `${getCanonicalBase()}${PAGE_PATH}/`,
  },
  openGraph: {
    title: "全国 空き家・解体補助金マップ 2026",
    description:
      "全国1,726市区町村（全国の約99%）を独自調査。解体補助金を確認できたのは48.9%。地域格差・最大支給額ランキングを可視化。",
    type: "article",
    url: `${getCanonicalBase()}${PAGE_PATH}/`,
  },
};

export default function Page() {
  const data = loadData();
  const canonicalUrl = `${getCanonicalBase()}${PAGE_PATH}/`;
  const datasetUrl = `${getCanonicalBase()}${PAGE_PATH}/dataset.json`;

  // Dataset schema
  const datasetSchema = {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    name: "全国空き家・解体補助金マップ 2026",
    description: `全国${data.data_source.total_cities}市区町村の解体・空き家対策補助金を集計したデータセット。都道府県別カバレッジ・最大支給額ランキング・地域格差を含む。`,
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
    keywords: [
      "空き家補助金",
      "解体補助金",
      "実家じまい",
      "空き家対策",
      "都道府県別",
      "全国市区町村",
    ],
    spatialCoverage: "JP",
    dateCreated: data.generated_at,
    dateModified: data.generated_at,
    isAccessibleForFree: true,
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: datasetUrl,
      },
    ],
  };

  const topCity = data.top_amount_ranking[0];
  const lowCoveragePrefList = data.low_coverage_prefs;

  // BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: getCanonicalBase() + "/" },
      { "@type": "ListItem", position: 2, name: "全国補助金マップ 2026", item: canonicalUrl },
    ],
  };

  // Article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "全国空き家・解体補助金マップ 2026",
    description: `全国${data.data_source.total_cities}市区町村の解体・空き家対策補助金を編集部が独自集計。`,
    url: canonicalUrl,
    datePublished: data.generated_at,
    dateModified: data.generated_at,
    author: { "@type": "Organization", name: "ふれあいの丘 編集部", url: getCanonicalBase() },
    publisher: {
      "@type": "Organization",
      name: "生前整理支援センター ふれあいの丘",
      url: getCanonicalBase(),
      logo: { "@type": "ImageObject", url: `${getCanonicalBase()}/opengraph-image.png` },
    },
    image: `${canonicalUrl}opengraph-image`,
    mainEntityOfPage: canonicalUrl,
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 leading-relaxed text-gray-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:underline">
          ホーム
        </Link>
        <span className="mx-2">/</span>
        <span>全国補助金マップ 2026</span>
      </nav>

      <header className="mb-10 border-b pb-6">
        <p className="mb-2 inline-block rounded bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          ふれあいの丘 編集部 独自データ
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
          全国空き家・解体補助金マップ
          <br />
          <span className="text-emerald-600">2026</span>
        </h1>
        <p className="mt-4 text-gray-700">
          全国{data.data_source.total_cities}市区町村の解体補助金・空き家対策補助金を、ふれあいの丘編集部が独自に集計しました。
          都道府県別カバレッジ、最大支給額ランキング、地域格差を可視化し、データセット（CSV/JSON）を無料で公開しています。
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          <div>
            <dt className="text-gray-500">調査対象</dt>
            <dd className="mt-1 font-bold">{data.data_source.total_cities}市区町村</dd>
          </div>
          <div>
            <dt className="text-gray-500">補助金あり</dt>
            <dd className="mt-1 font-bold">
              {data.data_source.with_subsidy_count}件 (
              {data.data_source.coverage_rate_national}%)
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">最高支給額</dt>
            <dd className="mt-1 font-bold text-red-600">
              {formatYen(data.summary_stats.maxAmountYen)}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">発行日</dt>
            <dd className="mt-1 font-bold">{formatDate(data.generated_at)}</dd>
          </div>
        </dl>
      </header>

      {/* エグゼクティブサマリ */}
      <section className="mb-12 rounded-lg bg-amber-50 p-6">
        <h2 className="mb-3 text-xl font-bold text-amber-900">
          📌 今回の主な発見
        </h2>
        <ul className="space-y-3 text-gray-800">
          {topCity && (
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-amber-700">▶</span>
              <span>
                補助金最高額は <strong>{topCity.prefName}{topCity.cityName}</strong>{" "}
                の <strong className="text-red-600">{formatYen(topCity.maxAmountYen)}</strong>
                （{topCity.subsidyName}）
              </span>
            </li>
          )}
          {data.full_coverage_prefs.length > 0 && (
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-amber-700">▶</span>
              <span>
                カバレッジ <strong>100%</strong>（全市区町村で補助金あり）の都道府県:{" "}
                <strong>{data.full_coverage_prefs.join("、")}</strong>
              </span>
            </li>
          )}
          {lowCoveragePrefList.length > 0 && (
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-amber-700">▶</span>
              <span>
                カバレッジ <strong>10%未満</strong>（補助金がほとんどない）の都道府県:{" "}
                {lowCoveragePrefList
                  .map((p) => `${p.prefName}（${p.coverageRate}%）`)
                  .join("、")}
              </span>
            </li>
          )}
          <li className="flex items-start">
            <span className="mr-2 mt-1 text-amber-700">▶</span>
            <span>
              全国の平均最大支給額は{" "}
              <strong>{formatYen(data.summary_stats.averageMaxAmountYen)}</strong>
              、中央値は{" "}
              <strong>{formatYen(data.summary_stats.medianMaxAmountYen)}</strong>
            </span>
          </li>
        </ul>
      </section>

      {/* 集計方法 */}
      <section className="mb-12">
        <h2 className="mb-4 border-l-4 border-emerald-500 pl-3 text-2xl font-bold">
          集計方法
        </h2>
        <div className="rounded border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed">
          <p>
            ふれあいの丘編集部が継続的に整備している
            <strong>全国市区町村補助金データベース</strong>を集計しました。
            対象は解体補助金・空き家対策補助金です。
          </p>
          <p className="mt-2">
            最大支給額は文字列パース（「最大XXX万円」「上限XXX万円」等の数値抽出）で取得した自治体のみを対象に金額ランキングを作成。
            「全額」「条件次第」など定量化が難しい制度（{data.data_source.full_amount_count}件）は別途カウントしています。
          </p>
          <p className="mt-2 text-gray-600">
            データソース: ふれあいの丘 全国市区町村補助金データベース /
            一次情報は各自治体公式ページ / 集計日: {formatDate(data.generated_at)}
          </p>
        </div>
      </section>

      {/* 都道府県別カバレッジ */}
      <section className="mb-12">
        <h2 className="mb-4 border-l-4 border-emerald-500 pl-3 text-2xl font-bold">
          🗾 都道府県別 補助金カバレッジ率
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          各都道府県内の市区町村のうち、解体・空き家対策補助金がある自治体の割合。
          四国・九州が高く、北日本が低い傾向が観測されました。
        </p>
        <CoverageChart
          data={data.coverage_ranking.map((p) => ({
            prefName: p.prefName,
            coverageRate: p.coverageRate,
            withSubsidyCount: p.withSubsidyCount,
            totalCities: p.totalCities,
          }))}
        />
      </section>

      {/* 最大支給額TOP15 */}
      <section className="mb-12">
        <h2 className="mb-4 border-l-4 border-red-500 pl-3 text-2xl font-bold">
          💰 補助金 最大支給額ランキング TOP15
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          単独の制度として最大金額の上限が明示されている自治体のうち、上位15件。
          条件付き加算等で実際の支給額は変動します。
        </p>
        <TopAmountChart
          data={data.top_amount_ranking
            .filter((c) => c.maxAmountYen !== null)
            .map((c) => ({
              prefName: c.prefName,
              cityName: c.cityName,
              maxAmountYen: c.maxAmountYen!,
              subsidyName: c.subsidyName,
            }))}
        />
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="px-3 py-2">順位</th>
                <th className="px-3 py-2">都道府県</th>
                <th className="px-3 py-2">市区町村</th>
                <th className="px-3 py-2 text-right">最大支給額</th>
                <th className="px-3 py-2">制度名</th>
              </tr>
            </thead>
            <tbody>
              {data.top_amount_ranking.slice(0, 30).map((c, i) => (
                <tr key={`${c.prefId}-${c.cityId}`} className="border-b">
                  <td className="px-3 py-2 font-bold">{i + 1}</td>
                  <td className="px-3 py-2">{c.prefName}</td>
                  <td className="px-3 py-2">
                    <Link
                      href={`/area/${c.prefId}/${c.cityId}/subsidy`}
                      className="text-emerald-600 hover:underline"
                    >
                      {c.cityName}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-right font-bold">
                    {formatYen(c.maxAmountYen)}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-600">
                    {c.subsidyName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 都道府県別 詳細 */}
      <section className="mb-12">
        <h2 className="mb-4 border-l-4 border-sky-500 pl-3 text-2xl font-bold">
          47都道府県別 サマリ
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="px-3 py-2">都道府県</th>
                <th className="px-3 py-2 text-right">市区町村数</th>
                <th className="px-3 py-2 text-right">補助金あり</th>
                <th className="px-3 py-2 text-right">カバレッジ</th>
                <th className="px-3 py-2 text-right">平均最大額</th>
                <th className="px-3 py-2 text-right">代表自治体</th>
              </tr>
            </thead>
            <tbody>
              {data.pref_summaries.map((p) => (
                <tr key={p.prefId} className="border-b">
                  <td className="px-3 py-2 font-medium">{p.prefName}</td>
                  <td className="px-3 py-2 text-right">{p.totalCities}</td>
                  <td className="px-3 py-2 text-right">{p.withSubsidyCount}</td>
                  <td className="px-3 py-2 text-right">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-bold ${
                        p.coverageRate >= 80
                          ? "bg-green-100 text-green-700"
                          : p.coverageRate >= 50
                            ? "bg-lime-100 text-lime-700"
                            : p.coverageRate >= 25
                              ? "bg-yellow-100 text-yellow-700"
                              : p.coverageRate >= 10
                                ? "bg-orange-100 text-orange-700"
                                : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.coverageRate}%
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right text-xs">
                    {formatYen(p.averageMaxAmountYen)}
                  </td>
                  <td className="px-3 py-2 text-right text-xs text-gray-600">
                    {p.topCity
                      ? `${p.topCity.cityName} (${formatYen(p.topCity.maxAmountYen)})`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ダウンロード */}
      <section className="mb-12 rounded-lg border-2 border-emerald-200 bg-emerald-50 p-6">
        <h2 className="mb-3 text-xl font-bold text-emerald-900">
          📥 データセット ダウンロード
        </h2>
        <p className="mb-4 text-sm text-gray-700">
          全国{data.data_source.total_cities}市区町村の補助金データ全件・都道府県別サマリ・ランキングを
          JSON形式でダウンロードできます。出典明記の上、研究・記事執筆・自治体資料への引用など自由にご利用ください（CC BY 4.0）。
        </p>
        <a
          href={`${PAGE_PATH}/dataset.json`}
          download
          className="inline-block rounded bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
        >
          JSONデータをダウンロード
        </a>
        <p className="mt-3 text-xs text-gray-600">
          出典表記例: 「全国空き家・解体補助金マップ 2026 /
          生前整理支援センター ふれあいの丘」
        </p>
      </section>

      {/* 編集部コメント */}
      <section className="mb-12">
        <h2 className="mb-4 border-l-4 border-gray-500 pl-3 text-2xl font-bold">
          編集部から
        </h2>
        <div className="space-y-3 text-sm leading-relaxed">
          <p>
            本データは、ふれあいの丘編集部が継続的に整備している全国市区町村の補助金データベースを集計したものです。
            申請条件・受付期間・予算上限は変更される可能性があるため、実際に申請を検討される場合は、必ず各自治体公式窓口でご確認ください。
          </p>
          <p>
            空き家の解体・売却・相続等のご判断は、地域包括支援センター、税理士、司法書士、行政書士、宅地建物取引士、市区町村の空き家対策窓口など、
            該当領域の専門家にご相談ください。本データは情報整理を目的とし、特定の意思決定を促すものではありません。
          </p>
          <p>
            本データの取材・解説者コメントのご依頼は、
            <Link href="/contact" className="text-emerald-600 underline">
              お問い合わせフォーム
            </Link>
            より承ります。
          </p>
        </div>
      </section>

      {/* フッター */}
      <footer className="mt-12 border-t pt-6 text-xs text-gray-500">
        <p>
          発行: 生前整理支援センター ふれあいの丘 編集部 / ライセンス: CC BY 4.0 /
          最終更新: {formatDate(data.generated_at)}
        </p>
        <p className="mt-1">
          一次情報: 各市区町村公式ページ / 集計: ふれあいの丘編集部
        </p>
      </footer>
    </main>
  );
}
