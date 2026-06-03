import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCanonicalBase } from "@/app/lib/site-url";
import { SITE_NAME_LOGO } from "@/app/lib/site-brand";
import JsonLd from "@/app/components/JsonLd";
import {
  getPrefectureReport,
  getAllPrefectureSlugs,
  formatYenAsMan,
  STATS_AS_OF,
  STATS_CREDIT,
  STATS_SOURCE,
  NATIONAL_MUNICIPALITY_TOTAL,
  NATIONAL_TOTAL_SOURCE,
} from "@/app/lib/data/municipality-stats";
import { CitationKit } from "../CitationKit";

/**
 * 【データジャーナリズム型・都道府県別】○○県の空き家解体補助金 調査データ（pSEO 47面）
 *
 * URL: /data/akiya-hojokin-ranking/[prefecture]
 * 目的: 地方紙・自治体系メディア・地域ブロガーの「引用面」を増やし、被リンクを獲得する。
 *       各県の実統計（確認できた数・中央値・市区町村ランキング・全国比較）で裏付け、
 *       テンプレだけの薄いページにしない。誠実性（「確認できた」表現）を全国版と統一。
 */

const NATIONAL_PATH = "/data/akiya-hojokin-ranking";
const LAST_UPDATED = "2026-06-01";
const NEXT_UPDATE = "2026-09";
const DATA_VERSION = "2026.06";

export function generateStaticParams() {
  return getAllPrefectureSlugs().map((p) => ({ prefecture: p.prefId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ prefecture: string }>;
}): Promise<Metadata> {
  const { prefecture } = await params;
  const r = getPrefectureReport(prefecture);
  if (!r) return { title: "データが見つかりません" };

  const base = getCanonicalBase();
  const url = `${base}${NATIONAL_PATH}/${r.prefId}`;
  const medianMan = r.medianYen ? formatYenAsMan(r.medianYen) : "—";
  const title = `${r.prefName}の空き家解体補助金 一覧・ランキング｜${r.total}自治体 独自調査【2026年】｜ふれあいの丘`;
  const description = `${r.prefName}の${r.total}自治体を独自調査。空き家・老朽家屋の解体補助金を確認できたのは${r.withSubsidy}自治体（${r.withSubsidyPercent}%）、上限額の中央値は${medianMan}。市区町村別の補助金額ランキングと申請窓口を無料公開（${STATS_AS_OF}・${STATS_CREDIT}）。`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "article",
      url,
      images: [`${base}/opendata/akiya-hojokin-infographic.png`],
    },
  };
}

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
      <div className={`text-3xl font-bold sm:text-4xl ${accent ? "text-primary" : "text-foreground"}`}>
        {value}
        {unit && <span className="ml-1 text-base font-bold">{unit}</span>}
      </div>
      <div className="mt-2 text-xs text-foreground/60 sm:text-sm">{label}</div>
    </div>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ prefecture: string }>;
}) {
  const { prefecture } = await params;
  const r = getPrefectureReport(prefecture);
  if (!r) notFound();

  const base = getCanonicalBase();
  const url = `${base}${NATIONAL_PATH}/${r.prefId}`;
  const nationalUrl = `${base}${NATIONAL_PATH}`;

  const medianMan = r.medianYen ? formatYenAsMan(r.medianYen) : "—";
  const avgMan = r.averageYen ? formatYenAsMan(r.averageYen) : "—";
  const maxMan = r.maxYen ? formatYenAsMan(r.maxYen) : "—";
  const natMedianMan = r.national.medianYen ? formatYenAsMan(r.national.medianYen) : "—";

  // 全国平均との比較（県の確認割合 vs 全国）
  const vsNational =
    r.withSubsidyPercent > r.national.withSubsidyPercent
      ? `全国平均（${r.national.withSubsidyPercent}%）より高め`
      : r.withSubsidyPercent < r.national.withSubsidyPercent
        ? `全国平均（${r.national.withSubsidyPercent}%）より低め`
        : `全国平均（${r.national.withSubsidyPercent}%）と同水準`;

  // 他都道府県（回遊・内部リンク）
  const otherPrefs = getAllPrefectureSlugs().filter((p) => p.prefId !== r.prefId);

  // 構造化データ
  const datasetSchema = {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    name: `${r.prefName} 空き家解体補助金 調査データ（${r.total}自治体）`,
    description: `${r.prefName}の${r.total}自治体を調査し、空き家・老朽家屋の解体補助金（有無・上限額・制度名・公式URL）を集計した独自データ。解体補助金を確認できたのは${r.withSubsidy}自治体（${r.withSubsidyPercent}%）、上限額の中央値${medianMan}。市区町村別ランキングを含む。`,
    url,
    isPartOf: nationalUrl,
    creator: { "@type": "Organization", name: SITE_NAME_LOGO, url: base },
    publisher: { "@type": "Organization", name: SITE_NAME_LOGO, url: base },
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    dateModified: LAST_UPDATED,
    temporalCoverage: "2026-06",
    spatialCoverage: { "@type": "Place", name: r.prefName },
    keywords: [`${r.prefName} 空き家 解体 補助金`, `${r.prefName} 空き家 補助金`, "老朽家屋 除却 助成"],
    measurementTechnique: "各自治体公式サイトの公表情報を収集・正規化・集計",
    distribution: [
      { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: `${base}/opendata/akiya-hojokin-2026.csv` },
      { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: `${base}/opendata/akiya-hojokin-2026.json` },
    ],
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: base },
      { "@type": "ListItem", position: 2, name: "空き家解体補助金 調査データ", item: nationalUrl },
      { "@type": "ListItem", position: 3, name: r.prefName, item: url },
    ],
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 leading-relaxed text-foreground">
      <JsonLd data={[datasetSchema, breadcrumbSchema]} />

      {/* パンくず */}
      <nav className="mb-6 text-sm text-foreground/50" aria-label="パンくず">
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href={NATIONAL_PATH} className="hover:underline">空き家解体補助金 調査データ</Link>
        <span className="mx-2">/</span>
        <span>{r.prefName}</span>
      </nav>

      {/* ヘッダー */}
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 inline-block rounded bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {STATS_CREDIT}・独自調査データ
        </p>
        <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
          {r.prefName}の空き家解体補助金
          <span className="mt-2 block text-lg font-bold text-primary sm:text-xl">
            【2026年】{r.total}自治体を独自調査・市区町村別ランキング
          </span>
        </h1>
        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
          <div>
            <dt className="text-foreground/50">調査対象</dt>
            <dd className="mt-0.5 font-bold">{r.prefName}内 {r.total}自治体</dd>
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
            <dt className="text-foreground/50">最終更新／次回</dt>
            <dd className="mt-0.5 font-bold">
              {LAST_UPDATED}
              <span className="ml-1 text-xs font-normal text-foreground/50">（次回 {NEXT_UPDATE} 予定）</span>
            </dd>
          </div>
        </dl>
      </header>

      {/* 要点（AI Overview 想定・誠実な言い切り） */}
      <section className="mb-10 rounded-2xl bg-primary/5 p-6" aria-label="調査の要点">
        <p className="text-base leading-relaxed text-foreground/90">
          {SITE_NAME_LOGO}が<strong>{r.prefName}の{r.total}自治体</strong>を調査したところ、空き家・老朽家屋の
          <strong>解体補助金を確認できたのは{r.withSubsidy}自治体（{r.withSubsidyPercent}%）</strong>で、{vsNational}でした。
          金額を数値で確認できた{r.withParsedAmount}自治体では、上限額の<strong>中央値は{medianMan}</strong>
          （全国の中央値は{natMedianMan}）。
          {r.topEntry && (
            <>
              {r.prefName}内で最も高いのは<strong>{r.topEntry.cityName}の{maxMan}</strong>でした。
            </>
          )}
          （{STATS_AS_OF}・{STATS_CREDIT}）。金額は目安であり、最新・正確な額は各自治体公式でご確認ください。「確認できなかった」自治体は補助金がないことを意味しません。
        </p>
      </section>

      {/* 主要指標 */}
      <section className="mb-12" aria-label="主要指標">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatNumber value={`${r.withSubsidyPercent}`} unit="%" label={`解体補助金を確認できた割合（県内${r.total}自治体中）`} accent />
          <StatNumber value={r.withSubsidy.toLocaleString("ja-JP")} unit="自治体" label="解体補助金を確認できた数" />
          <StatNumber value={medianMan} label="県内 上限額の中央値（目安）" accent />
          <StatNumber value={maxMan} label="県内 最高額（目安）" />
        </div>
      </section>

      {/* 市区町村ランキング */}
      <section className="mb-12">
        <h2 className="mb-2 border-l-4 border-amber-500 pl-3 text-xl font-bold sm:text-2xl">
          {r.prefName}で解体補助金が手厚い市区町村は？（金額ランキング）
        </h2>
        {r.cityRanking.length > 0 ? (
          <>
            <p className="mb-4 text-sm text-foreground/60">
              {r.prefName}内で上限額を金額として確認できた{r.withParsedAmount}自治体を、上限額（目安）の高い順に並べました。市区町村名から各市区町村の詳細（申請窓口・条件）を確認できます。
            </p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <caption className="sr-only">{r.prefName}の市区町村別 解体補助金 上限額ランキング</caption>
                <thead className="bg-primary-light/30">
                  <tr className="text-left">
                    <th scope="col" className="px-3 py-2 font-bold">順位</th>
                    <th scope="col" className="px-3 py-2 font-bold">市区町村</th>
                    <th scope="col" className="px-3 py-2 text-right font-bold">上限額（目安）</th>
                    <th scope="col" className="hidden px-3 py-2 font-bold md:table-cell">制度名</th>
                  </tr>
                </thead>
                <tbody>
                  {r.cityRanking.map((c) => (
                    <tr key={`${c.prefId}-${c.cityId}`} className="border-t border-border">
                      <td className="px-3 py-2 font-bold text-foreground/80">{c.rank}</td>
                      <td className="px-3 py-2 font-medium">
                        <Link href={`/area/${c.prefId}/${c.cityId}/subsidy`} className="text-primary hover:underline">
                          {c.cityName}
                        </Link>
                      </td>
                      <td className="px-3 py-2 text-right font-bold text-primary">{formatYenAsMan(c.amountYen)}</td>
                      <td className="hidden px-3 py-2 text-xs text-foreground/60 md:table-cell">{c.subsidyName ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-foreground/50">
              ※ 上限額は各自治体公式の最大交付額（または定額）を機械抽出した目安です。費用割合・面積単価・世帯条件等で実際の交付額は変動します。
            </p>
          </>
        ) : (
          <p className="rounded-xl border border-border bg-card p-5 text-sm text-foreground/70">
            {r.prefName}では、上限額を金額として一意に確認できた自治体が現時点でありません（「費用の○分の1以内」など金額が一意に定まらない制度や、公式情報で確認できなかった自治体を含みます）。各市区町村の最新情報は
            <Link href={`/area/${r.prefId}`} className="text-primary hover:underline">{r.prefName}の地域ページ</Link>
            からご確認ください。
          </p>
        )}
      </section>

      {/* 全国の中での位置づけ */}
      <section className="mb-12">
        <h2 className="mb-2 border-l-4 border-sky-500 pl-3 text-xl font-bold sm:text-2xl">
          {r.prefName}の補助金は全国と比べてどう？
        </h2>
        <div className="rounded-xl border border-border bg-card p-5 text-sm leading-relaxed">
          <ul className="space-y-2">
            <li>
              ・解体補助金を確認できた割合：<strong>{r.prefName} {r.withSubsidyPercent}%</strong> ／ 全国 {r.national.withSubsidyPercent}%（{vsNational}）
            </li>
            <li>
              ・上限額の中央値：<strong>{r.prefName} {medianMan}</strong> ／ 全国 {natMedianMan}
            </li>
            {r.national.prefAmountRank && (
              <li>
                ・平均上限額の高さ：金額を確認できた都道府県の中で<strong>全国 {r.national.prefAmountRank}位</strong>（{r.national.prefAmountTotalRanked}都道府県中／平均約{avgMan}）
              </li>
            )}
          </ul>
          <p className="mt-3">
            全国{NATIONAL_MUNICIPALITY_TOTAL.toLocaleString("ja-JP")}市区町村を横断した
            <Link href={NATIONAL_PATH} className="text-primary hover:underline">全国版の調査データ・ランキング</Link>
            もあわせてご覧ください。
          </p>
        </div>
      </section>

      {/* 引用・データ提供キット（県スコープ・被リンク） */}
      <section className="mb-10">
        <h2 className="mb-2 border-l-4 border-foreground/40 pl-3 text-xl font-bold sm:text-2xl">
          このデータを引用・利用する（出典明記で自由利用OK）
        </h2>
        <p className="mb-5 text-sm text-foreground/60">
          {r.prefName}の調査データは、出典を明記の上で記事・報道・研究・自治体資料などに自由にご利用いただけます（CC BY 4.0）。
        </p>
        <CitationKit
          reportUrl={url}
          csvUrl={`${base}/opendata/akiya-hojokin-2026.csv`}
          jsonUrl={`${base}/opendata/akiya-hojokin-2026.json`}
          region={{ name: r.prefName, isNational: false }}
          stats={{
            total: r.total.toLocaleString("ja-JP"),
            nationalTotal: NATIONAL_MUNICIPALITY_TOTAL.toLocaleString("ja-JP"),
            coveragePercent: String(r.national.coveragePercent),
            withSubsidy: r.withSubsidy.toLocaleString("ja-JP"),
            withSubsidyPercent: String(r.withSubsidyPercent),
            parsedN: r.withParsedAmount.toLocaleString("ja-JP"),
            medianMan,
            averageMan: avgMan,
            maxMan,
            topPref: r.prefName,
            topCity: r.topEntry?.cityName ?? "",
            asOf: STATS_AS_OF,
            credit: STATS_CREDIT,
            version: DATA_VERSION,
          }}
        />
        <p className="mt-4 rounded-lg border border-border bg-card p-4 text-xs leading-relaxed text-foreground/70">
          本データは各自治体公式の公表情報をもとに集計した<strong>目安</strong>です。母数の全国市区町村数（{NATIONAL_MUNICIPALITY_TOTAL.toLocaleString("ja-JP")}）の出典は{NATIONAL_TOTAL_SOURCE}。補助金の有無・上限額・条件は年度や予算で変わります。実際の申請・金額は各自治体公式でご確認ください。誤りのご指摘は <Link href="/contact" className="text-primary hover:underline">お問い合わせ</Link> からお寄せください。
        </p>
      </section>

      {/* CTA（地域導線・末尾に1つ） */}
      <section className="mb-10 rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary-light/20 to-amber-50/40 p-6 sm:p-7">
        <h2 className="mb-3 text-lg font-bold sm:text-xl">{r.prefName}の市区町村別に補助金・窓口を調べる</h2>
        <p className="mb-5 text-sm leading-relaxed text-foreground/75 sm:text-base">
          補助金の有無・上限額・申請条件は市区町村ごとに異なります。{r.prefName}の地域ページで、お住まい（または実家）の最新の制度と「全国での位置づけ」を確認できます。
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href={`/area/${r.prefId}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white transition hover:opacity-90 sm:text-base">
            {r.prefName}の地域ページへ <span aria-hidden>→</span>
          </Link>
          <Link href="/tools/empty-house-tax" className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary px-6 py-3.5 text-sm font-bold text-primary transition hover:bg-primary/5 sm:text-base">
            固定資産税を試算する <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* 他都道府県（回遊・内部リンク） */}
      <section className="mb-10">
        <h2 className="mb-3 border-l-4 border-emerald-500 pl-3 text-lg font-bold sm:text-xl">
          他の都道府県の調査データ
        </h2>
        <div className="flex flex-wrap gap-2">
          {otherPrefs.map((p) => (
            <Link
              key={p.prefId}
              href={`${NATIONAL_PATH}/${p.prefId}`}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground/80 transition hover:border-primary/40 hover:text-primary"
            >
              {p.prefName}
            </Link>
          ))}
        </div>
      </section>

      <footer className="mt-12 border-t border-border pt-6 text-xs text-foreground/50">
        <p>発行: {SITE_NAME_LOGO} ／ ライセンス: CC BY 4.0 ／ 最終更新: {LAST_UPDATED}（次回 {NEXT_UPDATE} 予定）／ データ版 v{DATA_VERSION}</p>
        <p className="mt-1">調査: {r.prefName} {r.total}自治体（{STATS_AS_OF}・{STATS_CREDIT}・出典 {STATS_SOURCE}）</p>
      </footer>
    </main>
  );
}
