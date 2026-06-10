import type { Metadata } from "next";
import Link from "next/link";
import EmailCTA from "../../components/EmailCTA";
import JsonLd from "../../components/JsonLd";
import { pageTitle, SITE_NAME_LOGO } from "../../lib/site-brand";
import { getCanonicalBase, getCanonicalUrl } from "../../lib/site-url";
import {
  getSubsidyTimingStats,
  getCoverageSummary,
  STATS_AS_OF,
  STATS_CREDIT,
  STATS_SOURCE,
  NATIONAL_TOTAL_SOURCE,
} from "../../lib/data/municipality-stats";

/**
 * 【データジャーナリズム / パッシブ被リンク資産】
 * 空き家解体補助金の「締切・予算先着」実態調査2026（844自治体のテキスト分析）
 *
 * 角度: 金額ではなく「いつまでに動かないと貰えないか＝時間切れリスク」。
 * 補助金あり自治体の applicationPeriod / notes / conditions の実テキストから、
 * (1)予算先着で終了 (2)年度内完工が条件 (3)交付決定前の着工は不可（事前申請必須）
 * (4)受付期間が区切られている、の出現率を集計して「もらえるのに間に合わない」を可視化する。
 *
 * 戦略: 記者・士業・空き家所有者が「空き家 補助金 締切 / 先着」で検索 → 上位で見つけ → 引用する。
 * 誠実性: 各自治体が公式に公表しているテキストの「該当語の記載がある割合」を提示。
 *   1自治体が複数シグナルに該当（重複あり）。捏造はしない。方法論を明記する。
 */

const PAGE_PATH = "/data/akiya-hojokin-shimekiri-2026";
const PUBLISHED = "2026-06-10";
const MODIFIED = "2026-06-10";

export function generateMetadata(): Metadata {
  const s = getSubsidyTimingStats();
  const top = s.signals[0];
  const title = pageTitle(
    `空き家解体補助金「締切・予算先着」実態調査｜${s.analyzed}自治体を分析【2026】`
  );
  const description = `空き家の解体補助金は「もらえるのに間に合わない」ことがある。全国${s.analyzed}自治体の公式な申請期間・条件を独自に分析。最多は「${top.label}」（${top.pct}%）。予算先着・年度内完工・着工前申請など“時間切れリスク”の出現率を一覧で公開（${STATS_AS_OF}・${STATS_CREDIT}）。`;
  return {
    title,
    description,
    alternates: { canonical: getCanonicalUrl(PAGE_PATH) },
    openGraph: {
      title,
      description,
      type: "article",
      url: getCanonicalUrl(PAGE_PATH),
      images: [`${getCanonicalBase()}/opendata/akiya-hojokin-joken-infographic.png`],
    },
  };
}

export default function Page() {
  const base = getCanonicalBase();
  const url = getCanonicalUrl(PAGE_PATH);
  const s = getSubsidyTimingStats();
  const cov = getCoverageSummary();
  const top3 = s.signals.slice(0, 3);
  const budget = s.signals.find((x) => x.key === "budgetFirst") ?? s.signals[0];

  const citationText = `空き家の解体補助金は「もらえるのに間に合わない」ことがある。全国${s.analyzed}自治体の公式な申請期間・条件を分析したところ、${budget.pct}%が「${budget.label}」に該当した（出典：${SITE_NAME_LOGO}「空き家解体補助金 締切・予算先着の全国実態調査2026」${STATS_AS_OF}、${base}${PAGE_PATH}）。`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `空き家解体補助金「締切・予算先着」の全国実態調査2026（${s.analyzed}自治体分析）`,
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    image: [`${base}/opendata/akiya-hojokin-joken-infographic.png`],
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
    name: "空き家解体補助金 締切・予算先着の全国実態（自治体別）2026",
    description: `全国${cov.total.toLocaleString("ja-JP")}市区町村のうち解体補助金を確認できた${s.analyzed}自治体について、公式に公表されている申請期間・条件・備考のテキストを横断分析し、予算先着・年度内完工・着工前申請・受付期間限定など“時間切れリスク”の出現率を集計した独自データ。各記録は各自治体公式情報に基づく。`,
    creator: { "@type": "Organization", name: SITE_NAME_LOGO, url: base },
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    dateModified: MODIFIED,
    url,
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "text/csv",
        contentUrl: `${base}/opendata/akiya-hojokin-2026.csv`,
      },
    ],
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: base },
      { "@type": "ListItem", position: 2, name: "独自調査データ室", item: `${base}/data` },
      { "@type": "ListItem", position: 3, name: "解体補助金 締切・予算先着の全国実態2026", item: url },
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
        <span>解体補助金 締切・予算先着の全国実態2026</span>
      </nav>

      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
          空き家解体補助金の「締切・予算先着」実態調査2026
          <span className="mt-2 block text-base font-bold text-primary sm:text-lg">
            もらえるのに「間に合わない」自治体——確認できた{s.analyzed}自治体の申請期間・条件を独自分析
          </span>
        </h1>
        <p className="mt-4 text-base text-foreground/85">
          「空き家の解体補助金は<strong>いつまでに動けば貰えるのか？</strong>」——多くの所有者がつまずくのは金額ではなく
          <strong>時間切れ</strong>です。{SITE_NAME_LOGO}は、全国{cov.total.toLocaleString("ja-JP")}市区町村のうち
          解体補助金を確認できた<strong>{s.analyzed}自治体</strong>について、各自治体が公式に公表している
          <strong>申請期間・申請条件・備考のテキストを横断分析</strong>し、「予算先着で締め切られる」「年度内の工事完了が必要」
          「工事を始める前の申請が必須」など、<strong>動き出すのが遅れると貰えなくなる条件</strong>がどれだけの割合で課されているかを集計しました（{STATS_AS_OF}・{STATS_CREDIT}）。
        </p>
      </header>

      {/* 主要数値 */}
      <section className="mb-10" aria-label="主要数値">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {top3.map((p) => (
            <div key={p.key} className="rounded-2xl bg-primary/5 p-5 text-center">
              <p className="text-3xl font-bold text-primary">{p.pct}<span className="text-lg">%</span></p>
              <p className="mt-2 text-sm font-medium text-foreground/80">{p.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-foreground/50">
          ※ 補助金を確認できた{s.analyzed}自治体の公式な申請期間・条件テキストの分析。1自治体が複数のシグナルに該当（割合は重複あり）。
        </p>
      </section>

      {/* 一覧表 */}
      <section className="mb-12">
        <h2 className="mb-3 border-l-4 border-primary pl-3 text-xl font-bold sm:text-2xl">
          “時間切れリスク”シグナルの出現率（全{s.analyzed}自治体）
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">空き家解体補助金 締切・予算先着シグナルの出現率</caption>
            <thead>
              <tr className="border-b-2 border-border text-left">
                <th className="px-2 py-2">時間切れにつながる条件</th>
                <th className="px-2 py-2 text-right">割合</th>
                <th className="px-2 py-2 text-right">自治体数</th>
              </tr>
            </thead>
            <tbody>
              {s.signals.map((p) => (
                <tr key={p.key} className="border-b border-border/60 align-top">
                  <td className="px-2 py-2.5">
                    <span className="font-medium text-foreground/90">{p.label}</span>
                    <span className="mt-0.5 block text-xs text-foreground/45">判定: {p.matchNote}</span>
                  </td>
                  <td className="px-2 py-2.5 text-right font-bold text-primary">{p.pct}%</td>
                  <td className="px-2 py-2.5 text-right text-foreground/70">{p.count.toLocaleString("ja-JP")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* なぜ早い者勝ちなのか */}
      <section className="mb-12">
        <h2 className="mb-3 border-l-4 border-primary pl-3 text-xl font-bold sm:text-2xl">なぜ「早い者勝ち」になるのか</h2>
        <p className="mb-3 text-base text-foreground/85">
          解体補助金は多くが<strong>単年度の予算事業</strong>です。自治体はその年度に使える予算枠を決め、申請が枠に達した時点で受付を打ち切ります。
          今回の分析でも、確認できた{s.analyzed}自治体のうち<strong>{budget.pct}%</strong>が
          「{budget.label}」に該当しました。つまり、制度として補助金が「ある」自治体でも、
          動き出すのが遅れれば<strong>その年度はもう申請できない</strong>ことが珍しくありません。
        </p>
        <ul className="space-y-2 text-base text-foreground/85">
          <li>・<strong>予算先着</strong>が最多——年度の早い時期に枠が埋まり、「なくなり次第終了」「予算件数に達し次第終了」と明記されています。</li>
          <li>・<strong>交付決定前の着工は対象外</strong>が約{(s.signals.find((x) => x.key === "preApprove")?.pct ?? 0)}%。先に工事を契約・着手すると、後から申請しても補助の対象外になります。<strong>申請→交付決定→着工</strong>の順番が鉄則です。</li>
          <li>・<strong>受付期間が区切られている</strong>自治体も多く、令和◯年度のうち申請期間・期限が定められています。締切を過ぎれば翌年度まで待つことになります。</li>
          <li>・一部の自治体は<strong>年度内（年度末まで）の工事完了</strong>まで条件にしています。申請だけでなく、解体工事そのものを期限までに終える段取りが必要です。</li>
        </ul>
        <p className="mt-3 text-sm text-foreground/70">
          補助金の有無・上限額そのものは
          <Link href="/data/akiya-hojokin-ranking" className="font-medium text-primary hover:underline">金額ランキング・都道府県別データ</Link>
          、申請条件の全体像は
          <Link href="/data/akiya-hojokin-joken" className="font-medium text-primary hover:underline">「申請条件」の全国実態調査</Link>
          で確認できます。
        </p>
      </section>

      {/* 都道府県で予算先着が多い上位 */}
      <section className="mb-12">
        <h2 className="mb-3 border-l-4 border-primary pl-3 text-xl font-bold sm:text-2xl">
          「予算先着」の記載が多い都道府県 上位{s.prefectureTop.length}
        </h2>
        <p className="mb-4 text-sm text-foreground/60">
          補助金を確認できた自治体のうち、「予算先着・予算枠に達し次第終了」の記載がある割合が高い都道府県です（分析対象が5自治体以上の県のみ）。
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">予算先着の記載が多い都道府県</caption>
            <thead>
              <tr className="border-b-2 border-border text-left">
                <th className="px-2 py-2">都道府県</th>
                <th className="px-2 py-2 text-right">予算先着の割合</th>
                <th className="px-2 py-2 text-right">該当／分析数</th>
              </tr>
            </thead>
            <tbody>
              {s.prefectureTop.map((r, i) => (
                <tr key={r.prefId} className="border-b border-border/60">
                  <td className="px-2 py-2.5">
                    <span className="mr-2 inline-block w-5 text-right font-bold text-foreground/50">{i + 1}</span>
                    <span className="font-medium text-foreground/90">{r.prefName}</span>
                  </td>
                  <td className="px-2 py-2.5 text-right font-bold text-primary">{r.pct}%</td>
                  <td className="px-2 py-2.5 text-right text-foreground/70">{r.count}／{r.analyzed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-foreground/50">
          ※ 各自治体公式の記載有無に基づく集計。割合が高い＝制度が手厚い／薄いを意味するものではなく、「早めに動く必要がある自治体が多い県」を示します。
        </p>
      </section>

      {/* 間に合わせるためのチェックリスト（実用＋Zero-Party導線） */}
      <section className="mb-12 rounded-2xl border border-primary/20 bg-primary/5 p-6">
        <h2 className="mb-3 text-lg font-bold">「間に合わない」を避けるための確認チェックリスト</h2>
        <ul className="space-y-2 text-base">
          <li>☐ 今年度の<strong>予算枠は残っているか</strong>（先着・なくなり次第終了が多い）</li>
          <li>☐ <strong>申請の受付期間・締切</strong>はいつまでか（単年度・期間限定のことがある）</li>
          <li>☐ <strong>工事を始める前に</strong>交付申請・交付決定を受けられるか（着工後は対象外が多い）</li>
          <li>☐ <strong>年度内（年度末まで）に工事完了</strong>が必要か。逆算した解体スケジュールは組めるか</li>
          <li>☐ 事前の現地調査・老朽度判定など、申請前に必要な手続きはないか</li>
          <li>☐ 申請者は所有者・相続人か（相続登記が済んでいるか）</li>
        </ul>
        <p className="mt-3 text-sm text-foreground/70">
          補助金は制度・手続きが自治体ごとに大きく異なります。最新の受付状況・締切は必ず各自治体公式でご確認ください。
          申請の流れや費用の全体像は
          <Link href="/akiya/kaitai-hojokin" className="font-medium text-primary hover:underline">空き家の解体補助金 完全ガイド</Link>
          で解説しています。
        </p>
      </section>

      {/* 引用について */}
      <section className="mb-12">
        <h2 className="mb-3 border-l-4 border-emerald-500 pl-3 text-xl font-bold sm:text-2xl">このデータの引用について</h2>
        <p className="mb-4 text-base text-foreground/85">
          本データは出典を明記の上、記事・報道・研究・自治体資料などに自由にご利用いただけます（CC BY 4.0）。下記の引用文・埋め込みコード・CSVをご活用ください。
        </p>

        <p className="mb-1 text-sm font-medium text-foreground/80">コピペ用の引用文</p>
        <blockquote className="mb-4 rounded-xl border border-border bg-card p-4 text-sm text-foreground/80">
          {citationText}
        </blockquote>

        <p className="mb-1 text-sm font-medium text-foreground/80">引用リンクの埋め込みコード（HTML）</p>
        <pre className="mb-4 overflow-x-auto rounded-xl border border-border bg-muted/30 p-4 text-xs text-foreground/70">
          <code>{`<p>出典：<a href="${url}">空き家解体補助金「締切・予算先着」実態調査2026（${SITE_NAME_LOGO}調べ）</a>（CC BY 4.0）</p>`}</code>
        </pre>

        <p className="text-sm">
          元データ（CSV・全自治体の制度名・上限額・公式URL付き）：
          <a href={`${base}/opendata/akiya-hojokin-2026.csv`} className="text-primary hover:underline">akiya-hojokin-2026.csv</a>
        </p>
        <p className="mt-2 text-xs text-foreground/50">
          出典クレジット：{SITE_NAME_LOGO}（{base}{PAGE_PATH}）／ライセンス：CC BY 4.0
        </p>
      </section>

      {/* 方法論 */}
      <section className="mb-12" id="methodology">
        <h2 className="mb-3 border-l-4 border-foreground/30 pl-3 text-xl font-bold sm:text-2xl">調査方法（方法論）</h2>
        <ul className="space-y-1.5 text-sm text-foreground/70">
          <li>・対象：全国{cov.total.toLocaleString("ja-JP")}市区町村（全国{cov.nationalTotal.toLocaleString("ja-JP")}の約{cov.coveragePercent}%）のうち、解体補助金を確認でき、かつ申請期間・条件・備考のいずれかに本文がある<strong>{s.analyzed}自治体</strong>。</li>
          <li>・方法：各自治体が公式に公表している「申請期間・申請条件・備考・制度名」のテキストを収集・正規化し、時間切れにつながる条件を表す語の<strong>記載有無</strong>で分類・集計。</li>
          <li>・割合は各シグナルで<strong>独立に算出</strong>（1自治体が複数シグナルに該当するため合計は100%を超えます）。</li>
          <li>・「記載がある割合」を示すもので、記載のない自治体に当該条件が無いこと（＝締切・先着が無いこと）を断定するものではありません。最新の受付状況・締切は必ず各自治体公式でご確認ください。</li>
          <li>・出典：{STATS_SOURCE}／母数の市区町村数は {NATIONAL_TOTAL_SOURCE}。基準時点：{STATS_AS_OF}。調査主体：{STATS_CREDIT}。</li>
        </ul>
      </section>

      {/* Zero-Party */}
      <EmailCTA
        variant="inline"
        heading="空き家・解体補助金の「間に合う」進め方ガイドを無料でお届け"
        description="予算先着・締切・着工前申請の注意点と、申請から解体完了までの逆算スケジュールをまとめた無料PDFを、空き家の費用・税金の最新情報とあわせてお送りします（いつでも配信停止できます）。"
        source="data_kaitai_hojokin_shimekiri"
      />

      {/* 関連 */}
      <section className="mt-10 border-t border-border pt-6 text-sm text-foreground/60">
        <p className="mb-2 font-medium text-foreground/80">関連データ・ガイド</p>
        <ul className="space-y-1">
          <li>・<Link href="/data/akiya-hojokin-ranking" className="text-primary hover:underline">全国 空き家解体補助金 調査データ（金額ランキング・都道府県別）</Link></li>
          <li>・<Link href="/data/akiya-hojokin-joken" className="text-primary hover:underline">空き家解体補助金「申請条件」の全国実態調査</Link></li>
          <li>・<Link href="/akiya/kaitai-hojokin" className="text-primary hover:underline">空き家の解体補助金 完全ガイド（相場・条件・申請の流れ）</Link></li>
          <li>・<Link href="/data" className="text-primary hover:underline">独自調査データ室</Link></li>
        </ul>
      </section>
    </main>
  );
}
