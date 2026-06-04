import Link from "next/link";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/app/lib/site-url";
import { SITE_NAME_LOGO } from "@/app/lib/site-brand";
import JsonLd from "@/app/components/JsonLd";
import {
  getCoverageSummary,
  getAmountStatsSummary,
  formatYenAsMan,
  STATS_AS_OF,
  STATS_CREDIT,
  NATIONAL_TOTAL_SOURCE,
} from "@/app/lib/data/municipality-stats";

/**
 * プレスリリース発表ページ（一次ソース）。
 * PR配信各社が「発信元」としてリンクしやすく、NewsArticleとしてインデックスされる被リンク資産。
 */
const PATH = "/news/akiya-hojokin-survey-2026";
const PUBLISHED = "2026-06-04";
const MODIFIED = "2026-06-04";

export function generateMetadata(): Metadata {
  const base = getCanonicalBase();
  const url = `${base}${PATH}`;
  const c = getCoverageSummary();
  const title = `【調査発表】空き家の解体補助金を確認できたのは全国の${c.withSubsidyPercent}%｜1,726自治体 独自調査｜ふれあいの丘`;
  const description = `生前整理支援センター ふれあいの丘が全国${c.nationalTotal.toLocaleString("ja-JP")}市区町村の約${c.coveragePercent}%にあたる${c.total.toLocaleString("ja-JP")}自治体を調査。空き家の解体補助金を確認できたのは${c.withSubsidy}自治体（${c.withSubsidyPercent}%）。出典付き・無料公開（CC BY 4.0）。`;
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

export default function Page() {
  const base = getCanonicalBase();
  const url = `${base}${PATH}`;
  const dataUrl = `${base}/data/akiya-hojokin-ranking`;
  const c = getCoverageSummary();
  const a = getAmountStatsSummary();
  const medianMan = a.medianYen ? formatYenAsMan(a.medianYen) : "—";
  const avgMan = a.averageYen ? formatYenAsMan(a.averageYen) : "—";
  const maxMan = a.maxYen ? formatYenAsMan(a.maxYen) : "—";
  const top = a.topEntry;

  const newsSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: `空き家の解体補助金を確認できたのは全国の${c.withSubsidyPercent}%｜全国1,726自治体 独自調査`,
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
    description: `全国${c.total}自治体を調査し、空き家の解体補助金を確認できたのは${c.withSubsidy}自治体（${c.withSubsidyPercent}%）。上限額の中央値は${medianMan}。`,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: base },
      { "@type": "ListItem", position: 2, name: "ニュース", item: `${base}/news` },
      { "@type": "ListItem", position: 3, name: "空き家解体補助金 全国調査", item: url },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 leading-relaxed text-foreground">
      <JsonLd data={[newsSchema, breadcrumbSchema]} />

      <nav className="mb-6 text-sm text-foreground/50" aria-label="パンくず">
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/news" className="hover:underline">ニュース</Link>
        <span className="mx-2">/</span>
        <span>空き家解体補助金 全国調査</span>
      </nav>

      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-sm text-foreground/50">プレスリリース ｜ {PUBLISHED}</p>
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
          全国1,726自治体を独自調査｜空き家の「解体補助金」を確認できたのは{c.withSubsidyPercent}%、上限額の中央値は{medianMan}
        </h1>
        <p className="mt-3 text-base text-foreground/80">
          生前整理支援センター ふれあいの丘が、全国市区町村の約{c.coveragePercent}%をカバーする空き家解体補助金データを、出典（各自治体公式）付き・CC BY 4.0で無料公開しました。
        </p>
      </header>

      {/* インフォグラフィック */}
      <figure className="mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${base}/opendata/akiya-hojokin-infographic.png`}
          alt={`空き家解体補助金 全国調査（${STATS_AS_OF}・${STATS_CREDIT}）`}
          className="w-full rounded-xl border border-border"
        />
      </figure>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-bold">調査の主なポイント</h2>
        <ul className="space-y-2 text-base">
          <li>・空き家の解体補助金を<strong>確認できたのは{c.total.toLocaleString("ja-JP")}自治体のうち{c.withSubsidy}自治体（{c.withSubsidyPercent}%）</strong>。</li>
          <li>・金額を確認できた{c.withParsedAmount}自治体では、上限額の<strong>中央値{medianMan}</strong>（平均約{avgMan}）。</li>
          {top && (
            <li>・最高額は<strong>{top.prefName}{top.cityName}の{maxMan}</strong>（不燃化特区など都市部の特例制度を含む）。</li>
          )}
          <li>・「補助金がある自治体の割合」という全国統計はこれまで一般に公開されておらず、本調査が一次データとなります。</li>
        </ul>
        <p className="mt-3 rounded-lg bg-primary/5 p-3 text-sm text-foreground/75">
          ※「確認できた」は公式情報で制度の存在を確認できた件数を指し、確認できなかった自治体は補助金の不在を意味しません。母数の全国市区町村数（{c.nationalTotal.toLocaleString("ja-JP")}）の出典は{NATIONAL_TOTAL_SOURCE}。
        </p>
      </section>

      <section className="mb-8 text-base leading-relaxed text-foreground/85">
        <p>
          背景には、相続した実家が「特定空家」等に指定されると固定資産税の住宅用地特例が外れて税負担が大きく増えるなど、空き家の早期対応が家計の関心事になっていることがあります。一方で、解体には数十万〜数百万円の費用がかかり、自治体ごとに補助金の有無・上限額・条件が大きく異なるため、横断的に比較できる情報が求められていました。
        </p>
        <p className="mt-3">
          本データは各自治体公式サイトの公表情報をもとに収集・正規化し、全データに出典となる公式URLを付与しています。記事・報道・研究・自治体資料などに、出典を明記の上で自由にご利用いただけます（CC BY 4.0）。CSV/JSONのオープンデータ、コピペ用の引用文・図版も提供しています。
        </p>
      </section>

      <section className="mb-8 rounded-2xl border-2 border-primary/30 bg-primary-light/10 p-6 text-center">
        <p className="mb-3 font-bold">調査データ・ランキング・オープンデータはこちら</p>
        <Link
          href="/data/akiya-hojokin-ranking"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white transition hover:opacity-90 sm:text-base"
        >
          全国 空き家解体補助金 調査データを見る <span aria-hidden>→</span>
        </Link>
        <p className="mt-3 text-sm text-foreground/60">
          <Link href="/data" className="text-primary hover:underline">都道府県別データ（47面）</Link>
          {" ／ "}
          <a href={`${base}/opendata/akiya-hojokin-2026.csv`} className="text-primary hover:underline">オープンデータ（CSV）</a>
        </p>
      </section>

      <section className="mb-8 text-sm leading-relaxed text-foreground/70">
        <h2 className="mb-2 text-base font-bold text-foreground">会社概要・お問い合わせ</h2>
        <p>名称：株式会社Kogera（生前整理支援センター ふれあいの丘）／ サイト：{base}</p>
        <p>本メディアは生前整理アドバイザー2級の運営者が編集に携わり、公的機関の情報を出典として制作しています。</p>
        <p className="mt-1">
          本件のお問い合わせ：<Link href="/contact" className="text-primary hover:underline">お問い合わせフォーム</Link>
        </p>
      </section>

      <p className="text-xs text-foreground/45">
        引用表記例：「全国{c.total.toLocaleString("ja-JP")}自治体 空き家解体補助金 調査データ（{STATS_AS_OF}・{STATS_CREDIT}）／ {SITE_NAME_LOGO}」
      </p>
    </main>
  );
}
