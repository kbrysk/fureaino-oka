import type { Metadata } from "next";
import Link from "next/link";
import EmailCTA from "../../components/EmailCTA";
import JsonLd from "../../components/JsonLd";
import { pageTitle, SITE_NAME_LOGO } from "../../lib/site-brand";
import { getCanonicalBase, getCanonicalUrl } from "../../lib/site-url";
import {
  getSubsidyConditionStats,
  getCoverageSummary,
  STATS_AS_OF,
  STATS_CREDIT,
  STATS_SOURCE,
  NATIONAL_TOTAL_SOURCE,
} from "../../lib/data/municipality-stats";

/**
 * 【データジャーナリズム / パッシブ被リンク資産】
 * 空き家解体補助金「申請条件」の全国実態調査（844自治体のテキスト分析）
 *
 * 戦略: 記者・士業・消費者が「空き家 補助金 条件」で検索 → 検索上位で見つけ → 引用する。
 * アウトリーチ0で被リンク／サイテーションが積み上がる"情報利得"のある一次統計。
 *
 * 誠実性: 各自治体が公式に公表している条件テキストの「該当語の記載がある割合」を提示。
 *   1自治体が複数条件に該当（重複あり）。捏造はしない。方法論を明記する。
 */

const PAGE_PATH = "/data/akiya-hojokin-joken";
const PUBLISHED = "2026-06-05";
const MODIFIED = "2026-06-05";

export function generateMetadata(): Metadata {
  const s = getSubsidyConditionStats();
  const top = s.patterns[0];
  const title = pageTitle(
    `空き家解体補助金の「申請条件」全国実態調査｜${s.sampleSize}自治体を分析【2026】`
  );
  const description = `空き家の解体補助金は、どんな条件で受けられるのか。全国${s.sampleSize}自治体の公式な申請条件を独自に分析。最も多いのは「${top.label}」（${top.percent}%）。税の滞納・予算先着・着工前申請・指定業者など、条件の出現率を一覧で公開（${STATS_AS_OF}・${STATS_CREDIT}）。`;
  return {
    title,
    description,
    alternates: { canonical: getCanonicalUrl(PAGE_PATH) },
    openGraph: {
      title,
      description,
      type: "article",
      url: getCanonicalUrl(PAGE_PATH),
      images: [`${getCanonicalBase()}/opendata/akiya-hojokin-infographic.png`],
    },
  };
}

export default function Page() {
  const base = getCanonicalBase();
  const url = getCanonicalUrl(PAGE_PATH);
  const s = getSubsidyConditionStats();
  const cov = getCoverageSummary();
  const top3 = s.patterns.slice(0, 3);

  const citationText = `空き家の解体補助金で最も多い申請条件は「${s.patterns[0].label}」で、全国${s.sampleSize}自治体の${s.patterns[0].percent}%が条件として挙げている（出典：${SITE_NAME_LOGO}「空き家解体補助金 申請条件の全国実態調査」${STATS_AS_OF}、${base}${PAGE_PATH}）。`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `空き家解体補助金「申請条件」の全国実態調査（${s.sampleSize}自治体分析）`,
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    image: [`${base}/opendata/akiya-hojokin-infographic.png`],
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
    name: "空き家解体補助金 申請条件の全国実態（自治体別）",
    description: `全国${cov.total.toLocaleString("ja-JP")}市区町村のうち解体補助金を確認できた${s.sampleSize}自治体について、公式に公表されている申請条件のテキストを横断分析し、条件の出現率を集計した独自データ。各記録は各自治体公式情報に基づく。`,
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
      { "@type": "ListItem", position: 3, name: "解体補助金 申請条件の全国実態", item: url },
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
        <span>解体補助金 申請条件の全国実態</span>
      </nav>

      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
          空き家の解体補助金、「申請条件」の全国実態調査
          <span className="mt-2 block text-base font-bold text-primary sm:text-lg">
            補助金を確認できた{s.sampleSize}自治体の公式な申請条件を独自分析【2026】
          </span>
        </h1>
        <p className="mt-4 text-base text-foreground/85">
          「空き家の解体補助金は、どんな条件を満たせば受けられるのか？」——{SITE_NAME_LOGO}は、全国{cov.total.toLocaleString("ja-JP")}市区町村のうち
          解体補助金を確認できた<strong>{s.sampleSize}自治体</strong>について、各自治体が公式に公表している<strong>申請条件のテキストを横断分析</strong>し、
          どんな条件がどれだけの割合で課されているのかを集計しました。横断的に比較できる統計はこれまで一般に公開されておらず、本調査が一次データとなります（{STATS_AS_OF}・{STATS_CREDIT}）。
        </p>
      </header>

      {/* 主要数値 */}
      <section className="mb-10" aria-label="主要数値">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {top3.map((p) => (
            <div key={p.key} className="rounded-2xl bg-primary/5 p-5 text-center">
              <p className="text-3xl font-bold text-primary">{p.percent}<span className="text-lg">%</span></p>
              <p className="mt-2 text-sm font-medium text-foreground/80">{p.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-foreground/50">
          ※ {s.sampleSize}自治体の公式な申請条件テキストの分析。1自治体が複数の条件に該当（割合は重複あり）。
        </p>
      </section>

      {/* 一覧表 */}
      <section className="mb-12">
        <h2 className="mb-3 border-l-4 border-primary pl-3 text-xl font-bold sm:text-2xl">
          申請条件の出現率ランキング（全{s.sampleSize}自治体）
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">空き家解体補助金 申請条件の出現率</caption>
            <thead>
              <tr className="border-b-2 border-border text-left">
                <th className="px-2 py-2">申請条件</th>
                <th className="px-2 py-2 text-right">割合</th>
                <th className="px-2 py-2 text-right">自治体数</th>
              </tr>
            </thead>
            <tbody>
              {s.patterns.map((p) => (
                <tr key={p.key} className="border-b border-border/60 align-top">
                  <td className="px-2 py-2.5">
                    <span className="font-medium text-foreground/90">{p.label}</span>
                    <span className="mt-0.5 block text-xs text-foreground/45">判定: {p.matchNote}</span>
                  </td>
                  <td className="px-2 py-2.5 text-right font-bold text-primary">{p.percent}%</td>
                  <td className="px-2 py-2.5 text-right text-foreground/70">{p.count.toLocaleString("ja-JP")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 読み解き */}
      <section className="mb-12">
        <h2 className="mb-3 border-l-4 border-primary pl-3 text-xl font-bold sm:text-2xl">データから分かること</h2>
        <ul className="space-y-2 text-base text-foreground/85">
          <li>・<strong>「税の滞納がないこと」と「予算・先着順」が二大条件</strong>（いずれも約75%）。補助金は<strong>早い者勝ち</strong>になりやすく、年度予算に達すると締め切られます。</li>
          <li>・<strong>約7割が「危険・老朽空き家であること」</strong>を要件に。きれいに使える家は対象外のことが多く、<strong>「特定空家等」級の老朽度</strong>が目安になります。</li>
          <li>・<strong>約3割が「交付決定前の着工は対象外」</strong>と明記。<strong>工事を始める前の申請が鉄則</strong>です。</li>
          <li>・<strong>約4割が「市内・指定業者」での施工</strong>を条件に。業者選びにも制約があります。</li>
        </ul>
      </section>

      {/* 申請前チェックリスト（実用＋Zero-Party導線） */}
      <section className="mb-12 rounded-2xl border border-primary/20 bg-primary/5 p-6">
        <h2 className="mb-3 text-lg font-bold">申請前に確認したい条件チェックリスト</h2>
        <ul className="space-y-2 text-base">
          <li>☐ 市区町村税の滞納はないか</li>
          <li>☐ 今年度の予算枠は残っているか（先着順のことが多い）</li>
          <li>☐ 対象になる老朽度・築年（昭和56年以前など）を満たすか</li>
          <li>☐ <strong>工事の前に</strong>交付申請・交付決定を受けられるか</li>
          <li>☐ 市内・指定／登録業者で解体する必要はないか</li>
          <li>☐ 申請者は所有者・相続人か（代理申請の可否）</li>
        </ul>
        <p className="mt-3 text-sm text-foreground/70">
          条件・申請の流れの詳しい解説は
          <Link href="/akiya/kaitai-hojokin" className="font-medium text-primary hover:underline">空き家の解体補助金 完全ガイド</Link>
          、お住まいの地域の制度は
          <Link href="/data/akiya-hojokin-ranking" className="font-medium text-primary hover:underline">全国調査データ</Link>
          で確認できます。
        </p>
      </section>

      {/* 引用について */}
      <section className="mb-12">
        <h2 className="mb-3 border-l-4 border-emerald-500 pl-3 text-xl font-bold sm:text-2xl">このデータの引用について</h2>
        <p className="mb-3 text-base text-foreground/85">
          本データは出典を明記の上、記事・報道・研究・自治体資料などに自由にご利用いただけます（CC BY 4.0）。コピペ用の引用文です。
        </p>
        <blockquote className="rounded-xl border border-border bg-card p-4 text-sm text-foreground/80">
          {citationText}
        </blockquote>
        <p className="mt-3 text-sm">
          元データ（CSV・全自治体の制度名・上限額・公式URL付き）：
          <a href={`${base}/opendata/akiya-hojokin-2026.csv`} className="text-primary hover:underline">akiya-hojokin-2026.csv</a>
        </p>
      </section>

      {/* 方法論 */}
      <section className="mb-12" id="methodology">
        <h2 className="mb-3 border-l-4 border-foreground/30 pl-3 text-xl font-bold sm:text-2xl">調査方法（方法論）</h2>
        <ul className="space-y-1.5 text-sm text-foreground/70">
          <li>・対象：全国{cov.total.toLocaleString("ja-JP")}市区町村（全国{cov.nationalTotal.toLocaleString("ja-JP")}の約{cov.coveragePercent}%）のうち、解体補助金を確認でき、かつ申請条件の記載がある{s.sampleSize}自治体。</li>
          <li>・方法：各自治体が公式に公表している「申請条件・対象・申請期間・備考」のテキストを収集・正規化し、条件を表す語の<strong>記載有無</strong>で分類・集計。</li>
          <li>・割合は各条件で<strong>独立に算出</strong>（1自治体が複数条件に該当するため合計は100%を超えます）。</li>
          <li>・「記載がある割合」を示すもので、記載のない自治体に当該条件が無いことを断定するものではありません。</li>
          <li>・出典：{STATS_SOURCE}／母数の市区町村数は {NATIONAL_TOTAL_SOURCE}。基準時点：{STATS_AS_OF}。調査主体：{STATS_CREDIT}。</li>
        </ul>
      </section>

      {/* Zero-Party */}
      <EmailCTA
        variant="inline"
        heading="空き家・解体補助金の進め方ガイドを無料でお届け"
        description="申請条件・必要書類・着工前の注意点をまとめた無料PDFと、空き家の費用・税金の最新情報をメールでお送りします（いつでも配信停止できます）。"
        source="data_kaitai_hojokin_joken"
      />

      {/* 関連 */}
      <section className="mt-10 border-t border-border pt-6 text-sm text-foreground/60">
        <p className="mb-2 font-medium text-foreground/80">関連データ・ガイド</p>
        <ul className="space-y-1">
          <li>・<Link href="/data/akiya-hojokin-ranking" className="text-primary hover:underline">全国 空き家解体補助金 調査データ（金額ランキング・都道府県別）</Link></li>
          <li>・<Link href="/akiya/kaitai-hojokin" className="text-primary hover:underline">空き家の解体補助金 完全ガイド（相場・条件・申請の流れ）</Link></li>
          <li>・<Link href="/data" className="text-primary hover:underline">独自調査データ室</Link></li>
        </ul>
      </section>
    </main>
  );
}
