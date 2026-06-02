import Link from "next/link";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/app/lib/site-url";
import { SITE_NAME_LOGO } from "@/app/lib/site-brand";
import JsonLd from "@/app/components/JsonLd";
import {
  getRankingPageData,
  formatYenAsMan,
  STATS_AS_OF,
  STATS_CREDIT,
  STATS_SOURCE,
} from "@/app/lib/data/municipality-stats";
import { DistributionChart } from "./DistributionChart";

/**
 * 【データジャーナリズム型ページ】全国の空き家解体補助金ランキング・調査データ
 *
 * URL: /data/akiya-hojokin-ranking
 * データソース: app/lib/data/municipalities.json（全国1,726自治体）
 * 集計ロジック: app/lib/data/municipality-stats.ts
 *
 * 目的（データの堀 / Data Moat）:
 * - pSEOページの差別化に使う独自統計の「本丸」ページ
 * - 被リンクを生むPR素材
 * - AI Overview 引用源（冒頭200字で主要数値を直接回答・表を多用・H2を疑問文化）
 *
 * サーバーコンポーネント。グラフ部分のみ DistributionChart（"use client"）に分離。
 */

const PAGE_PATH = "/data/akiya-hojokin-ranking";
const LAST_UPDATED = "2026-06-01"; // データ調査の最終更新日（手動更新）

export function generateMetadata(): Metadata {
  const base = getCanonicalBase();
  const url = `${base}${PAGE_PATH}`;
  const { coverage, amountSummary } = getRankingPageData();
  const avgMan = amountSummary.averageYen ? formatYenAsMan(amountSummary.averageYen) : "—";
  const title = `【2026年最新】全国空き家解体補助金ランキング｜${coverage.total.toLocaleString(
    "ja-JP"
  )}自治体 独自調査｜ふれあいの丘`;
  const description = `全国${coverage.total.toLocaleString(
    "ja-JP"
  )}自治体を独自調査。空き家・老朽家屋の解体補助金がある自治体は${
    coverage.withSubsidy
  }自治体（${coverage.withSubsidyPercent}%）、上限額の平均は約${avgMan}。補助金額ランキングTOP30・都道府県別の充実度・金額分布を無料公開（${STATS_AS_OF}・${STATS_CREDIT}）。`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "article",
      url,
    },
  };
}

/** 大きな数字（ヒーロー指標）の表示ユニット。 */
function StatNumber({
  value,
  unit,
  label,
  accent = false,
}: {
  value: string;
  unit?: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 text-center">
      <div
        className={`text-3xl font-bold sm:text-4xl ${accent ? "text-primary" : "text-foreground"}`}
      >
        {value}
        {unit && <span className="ml-1 text-base font-bold">{unit}</span>}
      </div>
      <div className="mt-2 text-xs text-foreground/60 sm:text-sm">{label}</div>
    </div>
  );
}

export default function Page() {
  const data = getRankingPageData();
  const { coverage, amountSummary, nationalRanking, prefCoverageRanking, distribution, prefAmountRanking } =
    data;

  const base = getCanonicalBase();
  const url = `${base}${PAGE_PATH}`;

  const avgMan = amountSummary.averageYen ? formatYenAsMan(amountSummary.averageYen) : "—";
  const medianMan = amountSummary.medianYen ? formatYenAsMan(amountSummary.medianYen) : "—";
  const maxMan = amountSummary.maxYen ? formatYenAsMan(amountSummary.maxYen) : "—";
  const topEntry = amountSummary.topEntry;

  // 構造化データ: Dataset（Google Dataset Search / AI 引用）
  const datasetSchema = {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    name: `全国 空き家解体補助金 調査データ（${coverage.total}自治体）`,
    description: `全国${coverage.total}自治体の空き家・老朽家屋の解体補助金（有無・上限額・制度名）を集計した独自データセット。補助金あり${coverage.withSubsidy}自治体（${coverage.withSubsidyPercent}%）、上限額の全国平均${avgMan}・中央値${medianMan}。補助金額ランキング・都道府県別充実度・金額分布を含む。`,
    url,
    sameAs: url,
    creator: { "@type": "Organization", name: SITE_NAME_LOGO, url: base },
    publisher: { "@type": "Organization", name: SITE_NAME_LOGO, url: base },
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    dateModified: LAST_UPDATED,
    temporalCoverage: "2026-06",
    // Googleの Dataset 検証器は spatialCoverage に Place 型を期待する
    // （Country は schema.org 上は Place のサブタイプだが Google が認識せず警告になる）。
    // 日本全体を表す Place ＋ 緯度経度の外接ボックスで明示する。
    spatialCoverage: {
      "@type": "Place",
      name: "日本",
      geo: {
        "@type": "GeoShape",
        // 日本のおおよその外接矩形（南西端〜北東端）
        box: "24.0 122.9 45.6 153.9",
      },
    },
    keywords: ["空き家 解体 補助金", "空き家 補助金 ランキング", "老朽家屋 除却 助成", "解体費用 補助"],
    measurementTechnique: "各自治体公式サイトの公表情報を収集・正規化・集計",
    variableMeasured: ["補助金の有無", "補助金上限額", "都道府県別カバレッジ"],
  };

  // 構造化データ: Organization（提供元）
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME_LOGO,
    url: base,
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 leading-relaxed text-foreground">
      <JsonLd data={[datasetSchema, orgSchema]} />

      {/* パンくず */}
      <nav className="mb-6 text-sm text-foreground/50" aria-label="パンくず">
        <Link href="/" className="hover:underline">
          ホーム
        </Link>
        <span className="mx-2">/</span>
        <span>空き家解体補助金 調査データ</span>
      </nav>

      {/* ヘッダー */}
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 inline-block rounded bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {STATS_CREDIT}・独自調査データ
        </p>
        <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
          全国{coverage.total.toLocaleString("ja-JP")}自治体の
          <br className="hidden sm:block" />
          空き家解体補助金を独自調査
          <span className="mt-2 block text-lg font-bold text-primary sm:text-xl">
            【2026年最新】補助金ランキング・調査データ
          </span>
        </h1>
        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
          <div>
            <dt className="text-foreground/50">調査対象</dt>
            <dd className="mt-0.5 font-bold">{coverage.total.toLocaleString("ja-JP")}自治体</dd>
          </div>
          <div>
            <dt className="text-foreground/50">調査時点</dt>
            <dd className="mt-0.5 font-bold">{STATS_AS_OF}</dd>
          </div>
          <div>
            <dt className="text-foreground/50">出典</dt>
            <dd className="mt-0.5 font-bold">{STATS_SOURCE}</dd>
          </div>
          <div>
            <dt className="text-foreground/50">最終更新</dt>
            <dd className="mt-0.5 font-bold">{LAST_UPDATED}</dd>
          </div>
        </dl>
      </header>

      {/* AI Overview 想定: 冒頭で主要数値を直接回答（約200字） */}
      <section className="mb-10 rounded-2xl bg-primary/5 p-6" aria-label="調査の要点">
        <p className="text-base leading-relaxed text-foreground/90">
          {SITE_NAME_LOGO}が全国
          <strong>{coverage.total.toLocaleString("ja-JP")}自治体</strong>
          を独自に調査したところ、空き家・老朽家屋の<strong>解体補助金がある自治体は{coverage.withSubsidy}自治体（全体の約{coverage.withSubsidyPercent}%）</strong>
          でした。金額を確認できた{coverage.withParsedAmount}自治体では、補助金<strong>上限額の全国平均は約{avgMan}</strong>、
          <strong>中央値は{medianMan}</strong>。最高額は
          {topEntry && (
            <>
              <strong>
                {topEntry.prefName}{topEntry.cityName}の{maxMan}
              </strong>
            </>
          )}
          でした（{STATS_AS_OF}・{STATS_CREDIT}）。金額は目安であり、最新・正確な額は各自治体公式でご確認ください。
        </p>
      </section>

      {/* ヒーロー指標（大きな数字） */}
      <section className="mb-12" aria-label="主要指標">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatNumber
            value={`${coverage.withSubsidyPercent}`}
            unit="%"
            label="解体補助金がある自治体の割合"
            accent
          />
          <StatNumber
            value={coverage.withSubsidy.toLocaleString("ja-JP")}
            unit="自治体"
            label={`補助金あり（全${coverage.total.toLocaleString("ja-JP")}自治体中）`}
          />
          <StatNumber value={avgMan} label="上限額の全国平均（目安）" accent />
          <StatNumber value={maxMan} label="補助金額の最高（全国1位）" />
        </div>
      </section>

      {/* 調査方法 */}
      <section className="mb-12">
        <h2 className="mb-4 border-l-4 border-primary pl-3 text-xl font-bold sm:text-2xl">
          この調査データはどうやって作られていますか？
        </h2>
        <div className="rounded-xl border border-border bg-card p-5 text-sm leading-relaxed">
          <p>
            {SITE_NAME_LOGO}が運営する地域別ページのために収集している、全国
            {coverage.total.toLocaleString("ja-JP")}
            自治体の「空き家・老朽家屋の解体（除却）補助金」情報を集計しました。各自治体の公式サイトで公表されている制度名・上限額をもとに正規化し、上限額が数値で読み取れる
            {coverage.withParsedAmount}
            自治体について金額統計を算出しています。
          </p>
          <p className="mt-2">
            「費用の○分の1以内」「○○円/㎡」「詳細は窓口へ」のように上限額が一意に定まらない制度は、件数（補助金の有無）には含めつつ、金額統計（平均・中央値・ランキング・分布）からは除外しています。
          </p>
          <p className="mt-2 text-foreground/60">
            出典: {STATS_SOURCE}　／　集計・整形: {STATS_CREDIT}　／　基準時点: {STATS_AS_OF}
          </p>
        </div>
      </section>

      {/* 金額ランキング TOP30 */}
      <section className="mb-12">
        <h2 className="mb-2 border-l-4 border-amber-500 pl-3 text-xl font-bold sm:text-2xl">
          空き家解体補助金が高いのはどこ？ 全国ランキングTOP30
        </h2>
        <p className="mb-4 text-sm text-foreground/60">
          公表されている上限額（目安）の高い順。金額が一意に読み取れる{nationalRanking.poolSize}自治体が対象です。
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <caption className="sr-only">全国の空き家解体補助金 上限額ランキング TOP30</caption>
            <thead className="bg-primary-light/30">
              <tr className="text-left">
                <th scope="col" className="px-3 py-2 font-bold">順位</th>
                <th scope="col" className="px-3 py-2 font-bold">都道府県</th>
                <th scope="col" className="px-3 py-2 font-bold">市区町村</th>
                <th scope="col" className="px-3 py-2 text-right font-bold">上限額（目安）</th>
                <th scope="col" className="hidden px-3 py-2 font-bold md:table-cell">制度名</th>
              </tr>
            </thead>
            <tbody>
              {nationalRanking.rows.map((r) => (
                <tr key={`${r.prefId}-${r.cityId}`} className="border-t border-border">
                  <td className="px-3 py-2 font-bold text-foreground/80">{r.rank}</td>
                  <td className="px-3 py-2">{r.prefName}</td>
                  <td className="px-3 py-2 font-medium">
                    <Link
                      href={`/area/${r.prefId}/${r.cityId}/subsidy`}
                      className="text-primary hover:underline"
                    >
                      {r.cityName}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-right font-bold text-primary">
                    {formatYenAsMan(r.amountYen)}
                  </td>
                  <td className="hidden px-3 py-2 text-xs text-foreground/60 md:table-cell">
                    {r.subsidyName ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-foreground/50">
          ※ 上限額は各自治体公式の最大交付額（または定額）を機械抽出した目安です。費用割合・面積単価・世帯条件等で実際の交付額は変動します。
        </p>
      </section>

      {/* 都道府県別の充実度 */}
      <section className="mb-12">
        <h2 className="mb-2 border-l-4 border-emerald-500 pl-3 text-xl font-bold sm:text-2xl">
          補助金が充実している都道府県はどこ？
        </h2>
        <p className="mb-4 text-sm text-foreground/60">
          都道府県別に「補助金がある市区町村数」が多い順のTOP15。割合は各都道府県でデータを把握している自治体に対する比率です。
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <caption className="sr-only">都道府県別 解体補助金の充実度ランキング</caption>
            <thead className="bg-primary-light/30">
              <tr className="text-left">
                <th scope="col" className="px-3 py-2 font-bold">順位</th>
                <th scope="col" className="px-3 py-2 font-bold">都道府県</th>
                <th scope="col" className="px-3 py-2 text-right font-bold">補助金あり</th>
                <th scope="col" className="px-3 py-2 text-right font-bold">割合</th>
                <th scope="col" className="px-3 py-2 text-right font-bold">平均上限額（目安）</th>
              </tr>
            </thead>
            <tbody>
              {prefCoverageRanking.rows.slice(0, 15).map((r) => (
                <tr key={r.prefId} className="border-t border-border">
                  <td className="px-3 py-2 font-bold text-foreground/80">{r.rank}</td>
                  <td className="px-3 py-2 font-medium">
                    <Link href={`/area/${r.prefId}`} className="text-primary hover:underline">
                      {r.prefName}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-right">
                    {r.withSubsidy}
                    <span className="text-foreground/40">/{r.total}</span>
                  </td>
                  <td className="px-3 py-2 text-right">{r.coveragePercent}%</td>
                  <td className="px-3 py-2 text-right text-foreground/80">
                    {r.averageAmountYen ? formatYenAsMan(r.averageAmountYen) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 平均額が高い/低い都道府県 */}
      <section className="mb-12">
        <h2 className="mb-2 border-l-4 border-sky-500 pl-3 text-xl font-bold sm:text-2xl">
          補助金の上限額が高い都道府県・低い都道府県は？
        </h2>
        <p className="mb-4 text-sm text-foreground/60">
          金額を確認できた自治体が3つ以上ある都道府県を対象に、上限額（目安）の平均が高い順・低い順に並べたものです。
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-bold text-foreground/90">上限額の平均が高い 都道府県 TOP5</h3>
            <ol className="space-y-2 text-sm">
              {prefAmountRanking.highest.map((r, i) => (
                <li key={r.prefId} className="flex items-center justify-between">
                  <span>
                    <span className="mr-2 font-bold text-primary">{i + 1}</span>
                    {r.prefName}
                    <span className="ml-1 text-xs text-foreground/40">（n={r.sampleSize}）</span>
                  </span>
                  <span className="font-bold">{formatYenAsMan(r.averageYen)}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 font-bold text-foreground/90">上限額の平均が低い 都道府県 TOP5</h3>
            <ol className="space-y-2 text-sm">
              {prefAmountRanking.lowest.map((r, i) => (
                <li key={r.prefId} className="flex items-center justify-between">
                  <span>
                    <span className="mr-2 font-bold text-foreground/50">{i + 1}</span>
                    {r.prefName}
                    <span className="ml-1 text-xs text-foreground/40">（n={r.sampleSize}）</span>
                  </span>
                  <span className="font-bold text-foreground/70">{formatYenAsMan(r.averageYen)}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <p className="mt-3 text-xs text-foreground/50">
          ※ 都市部の不燃化特区など高額制度の有無に左右されます。n はその都道府県で金額を確認できた自治体数です。
        </p>
      </section>

      {/* 金額分布 */}
      <section className="mb-12">
        <h2 className="mb-2 border-l-4 border-purple-500 pl-3 text-xl font-bold sm:text-2xl">
          補助金額はいくらの自治体が多い？（金額分布）
        </h2>
        <p className="mb-4 text-sm text-foreground/60">
          金額を確認できた{distribution.total}自治体を上限額の帯ごとに集計。最も多いのは
          {(() => {
            const top = [...distribution.buckets].sort((a, b) => b.count - a.count)[0];
            return top ? `「${top.label}」（${top.count}自治体・${top.percent}%）` : "—";
          })()}
          の層です。
        </p>
        <DistributionChart
          data={distribution.buckets.map((b) => ({
            label: b.label,
            count: b.count,
            percent: b.percent,
          }))}
        />
        <div className="mt-4 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <caption className="sr-only">補助金上限額の分布</caption>
            <thead className="bg-primary-light/30">
              <tr className="text-left">
                <th scope="col" className="px-3 py-2 font-bold">上限額の帯</th>
                <th scope="col" className="px-3 py-2 text-right font-bold">自治体数</th>
                <th scope="col" className="px-3 py-2 text-right font-bold">割合</th>
              </tr>
            </thead>
            <tbody>
              {distribution.buckets.map((b) => (
                <tr key={b.label} className="border-t border-border">
                  <td className="px-3 py-2">{b.label}</td>
                  <td className="px-3 py-2 text-right font-medium">{b.count.toLocaleString("ja-JP")}</td>
                  <td className="px-3 py-2 text-right">{b.percent}%</td>
                </tr>
              ))}
              <tr className="border-t border-border bg-primary-light/10 font-bold">
                <td className="px-3 py-2">合計</td>
                <td className="px-3 py-2 text-right">{distribution.total.toLocaleString("ja-JP")}</td>
                <td className="px-3 py-2 text-right">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA: あなたの市区町村を調べる */}
      <section className="mb-8 rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary-light/20 to-amber-50/40 p-6 sm:p-7">
        <h2 className="mb-3 text-lg font-bold sm:text-xl">
          あなたの市区町村の解体補助金を調べる
        </h2>
        <p className="mb-5 text-sm leading-relaxed text-foreground/75 sm:text-base">
          補助金の有無・上限額・申請条件は市区町村ごとに大きく異なります。お住まい（または実家）の地域ページで、最新の制度と「全国での位置づけ」を確認できます。
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/area"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white transition hover:opacity-90 sm:text-base"
          >
            地域から補助金を調べる
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/tools/empty-house-tax"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary px-6 py-3.5 text-sm font-bold text-primary transition hover:bg-primary/5 sm:text-base"
          >
            固定資産税を試算する
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* 引用・出典・免責 */}
      <section className="mb-10">
        <h2 className="mb-4 border-l-4 border-foreground/40 pl-3 text-xl font-bold sm:text-2xl">
          このデータの引用・利用について
        </h2>
        <div className="space-y-3 rounded-xl border border-border bg-card p-5 text-sm leading-relaxed">
          <p>
            本調査データは、出典を明記の上で記事執筆・報道・自治体や研究機関の資料などに自由にご利用いただけます（CC BY 4.0）。
          </p>
          <p className="rounded bg-primary-light/20 p-3 text-xs text-foreground/70">
            出典表記例：「全国{coverage.total.toLocaleString("ja-JP")}自治体 空き家解体補助金 調査データ（{STATS_AS_OF}・{STATS_CREDIT}） / {SITE_NAME_LOGO}」
          </p>
          <p className="text-foreground/70">
            本データは各自治体公式の公表情報をもとに集計した
            <strong>目安</strong>です。補助金の有無・上限額・申請条件は年度や予算により変更されます。実際の申請・金額については、必ず各自治体の公式窓口で最新情報をご確認ください。介護・相続・税務など個別の判断は、該当領域の専門家へご相談ください。
          </p>
        </div>
      </section>

      {/* フッター（メタ情報） */}
      <footer className="mt-12 border-t border-border pt-6 text-xs text-foreground/50">
        <p>
          発行: {SITE_NAME_LOGO} ／ ライセンス: CC BY 4.0 ／ 最終更新: {LAST_UPDATED}
        </p>
        <p className="mt-1">
          調査: 全国{coverage.total.toLocaleString("ja-JP")}自治体（{STATS_AS_OF}・{STATS_CREDIT}・出典 {STATS_SOURCE}）
        </p>
      </footer>
    </main>
  );
}
