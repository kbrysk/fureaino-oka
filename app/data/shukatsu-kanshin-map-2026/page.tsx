import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import EmailCTA from "../../components/EmailCTA";
import JsonLd from "../../components/JsonLd";
import { pageTitle, SITE_NAME_LOGO } from "../../lib/site-brand";
import { getCanonicalBase, getCanonicalUrl } from "../../lib/site-url";

/**
 * 【データジャーナリズム / パッシブ被リンク資産】
 * 終活への関心は地域でこう違う ― Google Trends 都道府県マップ＆親子の検索温度差2026
 *
 * 戦略: 介護・福祉・自治体（地域包括支援センター・社協）という、空き家補助金とは
 *   別レイヤーの被リンク層を狙う。記者・自治体・研究者が「終活 地域差」「終活 関心 都道府県」
 *   などで参照しやすい、地域×世代の断面データを提供する。
 *
 * 役割分担: 月次の時系列トレンドは /data/seizen-seiri-trends（別ページ）。
 *   本ページは同じ一次データを「地域差」と「親子の温度差」という断面で読み解く補完資産。
 *
 * 誠実性: Google Trends は『相対的な関心度（0〜100の指数）であって絶対検索回数ではない』。
 *   この点を本文・方法論に明記。データに無い数値は作らず、JSONに実在するフィールドのみ可視化する。
 */

const PAGE_PATH = "/data/shukatsu-kanshin-map-2026";
const REPORT_MONTH = "2026-05";
const PUBLISHED = "2026-06-10";
const MODIFIED = "2026-06-10";

type RegionAggregate = {
  name: string;
  averageValue: number;
  topKeywords: string[];
};

type KeywordAnalysis = {
  keyword: string;
  label: string;
  cluster: string;
  periodAverage: number;
  liftPercent: number;
  topRegions: Array<{ name: string; value: number }>;
};

type ClusterSummary = {
  cluster: string;
  label: string;
  description: string;
  keywordCount: number;
  averagePeriodInterest: number;
  averageLiftPercent: number;
  topKeyword: { keyword: string; periodAverage: number } | null;
};

type TrendReport = {
  report_month: string;
  geo: string;
  hl: string;
  keyword_count: number;
  regions_top: RegionAggregate[];
  parent_child_gap_signals: KeywordAnalysis[];
  clusters: ClusterSummary[];
  rising_related_queries: Array<{
    query: string;
    sourceKeyword: string;
    value: number;
  }>;
};

const REPORTS_DIR = path.join(process.cwd(), "app", "lib", "data", "trend-reports");

function loadReport(month: string): TrendReport {
  const file = path.join(REPORTS_DIR, `${month}.json`);
  return JSON.parse(fs.readFileSync(file, "utf-8")) as TrendReport;
}

export function generateMetadata(): Metadata {
  const report = loadReport(REPORT_MONTH);
  const top = report.regions_top[0];
  const title = pageTitle(
    `終活への関心は地域でこう違う｜Google Trends 都道府県マップ＆親子の検索温度差2026`
  );
  const description = `終活・生前整理への関心は、住む地域でどう違うのか。${SITE_NAME_LOGO}が、Google Trendsの相対的な関心度（0〜100の指数）を全国47都道府県を対象に独自集計し、地域差と「親の片付け」に関する検索の温度差を分析（上位${report.regions_top.length}都道府県を掲載）。関心度が最も高いのは${top.name}（全KW平均${top.averageValue}）。引用・転載歓迎（CC BY 4.0）。`;
  return {
    title,
    description,
    alternates: { canonical: getCanonicalUrl(PAGE_PATH) },
    openGraph: {
      title,
      description,
      type: "article",
      url: getCanonicalUrl(PAGE_PATH),
    },
  };
}

export default function Page() {
  const base = getCanonicalBase();
  const url = getCanonicalUrl(PAGE_PATH);
  const report = loadReport(REPORT_MONTH);

  const regions = report.regions_top;
  const topRegion = regions[0];
  const maxRegionValue = Math.max(...regions.map((r) => r.averageValue));
  const gapSignals = report.parent_child_gap_signals;
  const trendsUrl = `${base}/data/seizen-seiri-trends/${REPORT_MONTH}/`;

  const citationText = `終活・生前整理への関心度（Google Trendsの相対指数、0〜100）を都道府県別に集計すると、最も高いのは${topRegion.name}（観測キーワード${report.keyword_count}語の平均${topRegion.averageValue}）だった。関心度は相対的な指数であり、絶対的な検索回数ではない（出典：${SITE_NAME_LOGO}「終活への関心は地域でこう違う ― Google Trends 都道府県マップ＆親子の検索温度差2026」、${base}${PAGE_PATH}）。`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `終活への関心は地域でこう違う ― Google Trends 都道府県マップ＆親子の検索温度差2026`,
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    author: { "@type": "Organization", name: SITE_NAME_LOGO, url: base },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME_LOGO,
      url: base,
      logo: { "@type": "ImageObject", url: `${base}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "終活・生前整理 検索関心の地域差・親子の検索温度差（2026年5月）",
    description: `終活・生前整理に関する${report.keyword_count}語のキーワードについて、Google Trendsの相対的な関心度（0〜100の指数）を都道府県別に平均し、関心度の地域差を集計した独自データ。あわせて「親が片付けを嫌がる」など親世代と子世代のすれ違いを示す検索シグナルを収録。`,
    creator: { "@type": "Organization", name: SITE_NAME_LOGO, url: base },
    publisher: { "@type": "Organization", name: SITE_NAME_LOGO, url: base },
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    dateModified: MODIFIED,
    url,
    keywords: regions.map((r) => r.name),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: base },
      { "@type": "ListItem", position: 2, name: "独自調査データ室", item: `${base}/data` },
      { "@type": "ListItem", position: 3, name: "終活への関心 地域差マップ2026", item: url },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 leading-relaxed text-foreground">
      <JsonLd data={[articleSchema, datasetSchema, breadcrumbSchema]} />

      <nav className="mb-6 text-sm text-foreground/50" aria-label="パンくず">
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/data" className="hover:underline">データ室</Link>
        <span className="mx-2">/</span>
        <span>終活への関心 地域差マップ2026</span>
      </nav>

      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
          終活への関心は、地域でこう違う
          <span className="mt-2 block text-base font-bold text-primary sm:text-lg">
            Google Trends 都道府県マップ＆「親の片付け」を巡る検索の温度差 2026
          </span>
        </h1>
        <p className="mt-4 text-base text-foreground/85">
          「終活や生前整理への関心は、住んでいる地域や世代でどれくらい違うのか？」——{SITE_NAME_LOGO}は、
          終活・生前整理・実家じまい・親世代の悩みなど<strong>{report.keyword_count}語</strong>のキーワードについて、
          Google Trendsの<strong>相対的な関心度（0〜100の指数）</strong>を全国47都道府県を対象に取得し、
          関心度が高い都道府県と、親子のすれ違いを映す検索ワードという2つの断面で独自集計しました
          （本ページに掲載しているのは関心度が高い上位{regions.length}都道府県です）。
          関心度が最も高いのは<strong>{topRegion.name}</strong>（観測キーワードの平均{topRegion.averageValue}）。
          数値は相対的な指数であって、絶対的な検索回数ではありません（{REPORT_MONTH}時点・{SITE_NAME_LOGO}調べ）。
          なお「世代差」は年齢別の検索データそのものではなく、「親が片付けを嫌がる」など
          <strong>子世代が検索すると考えられるワード</strong>から読み取った編集部の解釈です。
        </p>
      </header>

      {/* 役割の明示（既存トレンドページとのカニバリ回避） */}
      <section className="mb-10 rounded-2xl border border-border bg-card p-5 text-sm text-foreground/75">
        <p>
          <strong>このページの役割：</strong>
          月ごとの時系列（急上昇・前期比）は
          <Link href="/data/seizen-seiri-trends" className="font-medium text-primary hover:underline">
            検索トレンドレポート（月次）
          </Link>
          で扱っています。本ページはその月次データを重複させるのではなく、
          <strong>「地域差」と「親子の温度差」という断面</strong>で読み解く<strong>補完的なデータ資産</strong>です。
        </p>
      </section>

      {/* 主要数値 */}
      <section className="mb-10" aria-label="主要数値">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {regions.slice(0, 3).map((r) => (
            <div key={r.name} className="rounded-2xl bg-primary/5 p-5 text-center">
              <p className="text-3xl font-bold text-primary">{r.averageValue}</p>
              <p className="mt-2 text-sm font-medium text-foreground/80">{r.name}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-foreground/50">
          ※ 関心度は Google Trends の相対指数（0〜100）。{report.keyword_count}語のキーワードを都道府県別に平均した値で、絶対的な検索回数ではありません。
        </p>
      </section>

      {/* 都道府県ランキング（ヒートマップ的な表） */}
      <section className="mb-12">
        <h2 className="mb-3 border-l-4 border-primary pl-3 text-xl font-bold sm:text-2xl">
          終活への関心度が高い都道府県ランキング（上位{regions.length}）
        </h2>
        <p className="mb-4 text-sm text-foreground/60">
          全国47都道府県を対象に、{report.keyword_count}語の関心度を都道府県別に平均した値（相対指数0〜100）の高い順。
          ここでは関心度が高い上位{regions.length}都道府県を掲載しています。
          バーの長さは最高値（{topRegion.name}＝{maxRegionValue}）を基準とした相対表示です。
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">終活・生前整理 検索関心度の都道府県ランキング</caption>
            <thead>
              <tr className="border-b-2 border-border text-left">
                <th className="px-2 py-2">順位</th>
                <th className="px-2 py-2">都道府県</th>
                <th className="px-2 py-2">関心度（相対指数・ヒートバー）</th>
                <th className="px-2 py-2 text-right">平均</th>
                <th className="px-2 py-2">関心の高いワード</th>
              </tr>
            </thead>
            <tbody>
              {regions.map((r, i) => (
                <tr key={r.name} className="border-b border-border/60 align-top">
                  <td className="px-2 py-2.5 font-bold text-foreground/70">{i + 1}</td>
                  <td className="px-2 py-2.5 font-medium text-foreground/90">{r.name}</td>
                  <td className="px-2 py-2.5">
                    <span
                      className="block h-3 rounded bg-primary/70"
                      style={{ width: `${Math.round((r.averageValue / maxRegionValue) * 100)}%` }}
                      aria-hidden
                    />
                  </td>
                  <td className="px-2 py-2.5 text-right font-bold text-primary">{r.averageValue}</td>
                  <td className="px-2 py-2.5 text-xs text-foreground/55">
                    {r.topKeywords.join(" / ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-foreground/50">
          ※ 各都道府県の「関心の高いワード」は、その地域で相対的に関心度が高かった代表キーワードです。
        </p>
      </section>

      {/* 読み解き（地域差） */}
      <section className="mb-12">
        <h2 className="mb-3 border-l-4 border-primary pl-3 text-xl font-bold sm:text-2xl">データから分かること（地域差）</h2>
        <ul className="space-y-2 text-base text-foreground/85">
          <li>・関心度が最も高いのは<strong>{topRegion.name}</strong>（平均{topRegion.averageValue}）で、上位には地方圏が多く並びます。終活・生前整理は都市部だけのテーマではないことがうかがえます。</li>
          <li>・地域によって「関心の高いワード」が異なります。たとえば{regions[0].name}では「{regions[0].topKeywords[0]}」、{regions[1].name}では「{regions[1].topKeywords[0]}」が上位に入り、<strong>地域ごとに入り口となる悩みが違う</strong>傾向が見られます。</li>
          <li>・これは「その地域で当該テーマへの<strong>相対的な関心が高い</strong>」ことを示すもので、人口や絶対的な検索回数の多さを意味するものではありません。</li>
        </ul>
      </section>

      {/* 親世代と子世代で分かれるワード */}
      <section className="mb-12">
        <h2 className="mb-3 border-l-4 border-rose-500 pl-3 text-xl font-bold sm:text-2xl">
          親世代と子世代で関心が分かれるワード
        </h2>
        <p className="mb-4 text-sm text-foreground/60">
          「親が片付けを嫌がる」「実家が片付かない」「高齢の親が物を捨てない」——
          これらは、<strong>子世代の側から検索されると考えられる</strong>、親子のすれ違い（温度差）を映すワードです。
          いずれも検索ボリュームが小さいニッチな言い回しのため関心度の数値は安定しませんが、
          こうした検索語が実在すること自体が、<strong>「親に切り出せない・進まない」という子世代の悩み</strong>の存在を示唆しています。
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {gapSignals.map((kw) => (
            <div key={kw.keyword} className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <h3 className="font-bold text-foreground/90">{kw.label}</h3>
              <p className="mt-2 text-sm text-foreground/70">
                {kw.periodAverage > 0
                  ? `関心度（相対指数）: ${kw.periodAverage}`
                  : "関心度（相対指数）: ニッチな検索語のため、安定した時系列データは得られていません（検索の現場で実在する悩みの“言い回し”として収録）"}
              </p>
              {kw.topRegions.length > 0 && (
                <p className="mt-1 text-xs text-foreground/55">
                  特に関心が高い地域: {kw.topRegions.map((tr) => tr.name).join(" / ")}
                </p>
              )}
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-foreground/70">
          終活・生前整理が「親世代が主役」のテーマである一方で、検索の現場では
          <strong>子世代が「どう声をかけるか」で立ち止まっている</strong>様子が読み取れます。
          世代でテーマの入り口が分かれている、という断面です。
        </p>
      </section>

      {/* 引用について（CC BY 4.0） */}
      <section className="mb-12">
        <h2 className="mb-3 border-l-4 border-emerald-500 pl-3 text-xl font-bold sm:text-2xl">このデータの引用について</h2>
        <p className="mb-4 text-base text-foreground/85">
          本データは出典を明記の上、記事・報道・研究・自治体や社協・地域包括支援センターの資料などに自由にご利用いただけます（CC BY 4.0）。
          下記の引用文をそのままご活用ください。
        </p>

        <p className="mb-1 text-sm font-medium text-foreground/80">コピペ用の引用文</p>
        <blockquote className="mb-4 rounded-xl border border-border bg-card p-4 text-sm text-foreground/80">
          {citationText}
        </blockquote>

        <p className="mb-1 text-sm font-medium text-foreground/80">出典表記例</p>
        <p className="text-sm text-foreground/80">
          {SITE_NAME_LOGO}「終活への関心は地域でこう違う ― Google Trends 都道府県マップ＆親子の検索温度差2026」（
          <a href={url} className="text-primary hover:underline">{base}{PAGE_PATH}</a>
          ）／データ出典：Google Trends（{report.geo} / {report.hl}）
        </p>
      </section>

      {/* 方法論 */}
      <section className="mb-12" id="methodology">
        <h2 className="mb-3 border-l-4 border-foreground/30 pl-3 text-xl font-bold sm:text-2xl">調査方法（方法論）</h2>
        <ul className="space-y-1.5 text-sm text-foreground/70">
          <li>・対象：終活・生前整理・実家じまい・親世代の悩み・制度／お金・処分／買取・消費者トラブルなど{report.clusters.length}クラスタ計{report.keyword_count}語のキーワード（{SITE_NAME_LOGO}編集部が定義）。</li>
          <li>・方法：各キーワードについて Google Trends の都道府県別の関心度を全国47都道府県で取得し、キーワードを横断して都道府県ごとに平均。関心度が高い順にランキング化しました（本ページでは上位{regions.length}都道府県を掲載）。</li>
          <li>・<strong>関心度は Google Trends の相対指数（0〜100）であり、絶対的な検索回数・検索ボリュームではありません。</strong>地域内の相対的な関心の高さを示します。</li>
          <li>・<strong>「世代差（親子の温度差）」は、年齢別に分解した検索データではありません。</strong>「親が片付けを嫌がる」など、子世代が検索すると考えられるワードの関心度から読み取った編集部の解釈です。</li>
          <li>・対象期間：{REPORT_MONTH}時点の集計（直近の関心度をもとにした断面）。地域差・世代差は観測された相関であり、因果関係を断定するものではありません。</li>
          <li>・出典：Google Trends（{report.geo} / {report.hl}）。キーワード定義・集計：{SITE_NAME_LOGO} 編集部。基準時点：{REPORT_MONTH}。</li>
        </ul>
      </section>

      {/* Zero-Party */}
      <EmailCTA
        variant="inline"
        heading="終活・生前整理の進め方ガイドを無料でお届け"
        description="「親にどう切り出すか」「何から手をつけるか」をまとめた無料PDFと、終活・実家じまいの最新情報をメールでお送りします（いつでも配信停止できます）。"
        source="data_shukatsu_kanshin"
      />

      {/* 関連 */}
      <section className="mt-10 border-t border-border pt-6 text-sm text-foreground/60">
        <p className="mb-2 font-medium text-foreground/80">関連データ・ガイド</p>
        <ul className="space-y-1">
          <li>・<Link href="/data/seizen-seiri-trends" className="text-primary hover:underline">終活・生前整理 検索トレンドレポート（月次・急上昇／前期比）</Link>（本ページは地域×世代の断面、こちらは月次の時系列）</li>
          <li>・<a href={trendsUrl} className="text-primary hover:underline">{REPORT_MONTH}版の月次トレンドレポートを見る</a></li>
          <li>・<Link href="/data" className="text-primary hover:underline">独自調査データ室（一次データ一覧）</Link></li>
        </ul>
      </section>
    </main>
  );
}
