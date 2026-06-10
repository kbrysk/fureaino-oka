import Link from "next/link";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/app/lib/site-url";
import { SITE_NAME_LOGO } from "@/app/lib/site-brand";
import JsonLd from "@/app/components/JsonLd";
import {
  getCoverageSummary,
  getAllPrefectureSlugs,
  STATS_AS_OF,
  STATS_CREDIT,
} from "@/app/lib/data/municipality-stats";

/**
 * /data ハブ（データ室 / Data Room）
 *
 * 目的（被リンク獲得の発見性）:
 * - 独自調査データの一覧ハブ。サイト内の内部リンクを集約し、各データレポートのクロール・発見性を高める。
 * - 報道・引用したい人の入口（プレスルーム的役割）。
 * - 47都道府県別ページへの内部リンクの親（リンクエクイティ配分）。
 */

const PATH = "/data";

export function generateMetadata(): Metadata {
  const base = getCanonicalBase();
  const url = `${base}${PATH}`;
  const c = getCoverageSummary();
  const title = `独自調査データ室｜空き家・生前整理の全国データを無料公開｜ふれあいの丘`;
  const description = `全国${c.nationalTotal.toLocaleString("ja-JP")}市区町村の約${c.coveragePercent}%にあたる${c.total.toLocaleString("ja-JP")}自治体を独自調査した空き家解体補助金データなど、引用自由（CC BY 4.0）の一次データを公開。報道・研究・記事執筆にご利用ください（${STATS_AS_OF}・${STATS_CREDIT}）。`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, type: "website", url },
  };
}

export default function Page() {
  const base = getCanonicalBase();
  const url = `${base}${PATH}`;
  const c = getCoverageSummary();
  const prefs = getAllPrefectureSlugs();

  const reports = [
    {
      href: "/data/akiya-hojokin-ranking",
      title: "全国 空き家解体補助金 調査データ・ランキング",
      desc: `全国${c.total.toLocaleString("ja-JP")}自治体（全国の約${c.coveragePercent}%）を独自調査。解体補助金を確認できたのは${c.withSubsidy}自治体（${c.withSubsidyPercent}%）。金額ランキング・都道府県別・分布・オープンデータ。`,
    },
    {
      href: "/data/akiya-hojokin-joken",
      title: "空き家解体補助金「申請条件」の全国実態調査",
      desc: `補助金を確認できた${c.withSubsidy}自治体の公式な申請条件を独自分析。税の滞納・予算先着・着工前申請・指定業者など、条件の出現率を一覧で公開。`,
    },
    {
      href: "/data/akiya-hojokin-shimekiri-2026",
      title: "空き家解体補助金「締切・予算先着」実態調査2026",
      desc: `「もらえるのに間に合わない」自治体を独自分析。予算先着・年度内完工・着工前申請・受付期間限定など“時間切れリスク”の出現率を一覧で公開。`,
    },
    {
      href: "/data/akiya-subsidy-map-2026",
      title: "全国 空き家・解体補助金マップ 2026",
      desc: `全国${c.total.toLocaleString("ja-JP")}市区町村（全国の約${c.coveragePercent}%）の補助金を独自集計。都道府県別カバレッジ・最大支給額ランキング・地域格差をグラフで可視化（CSV/JSON公開）。`,
    },
    {
      href: "/data/seizen-seiri-trends",
      title: "生前整理・終活 検索トレンド データ",
      desc: "生前整理・終活に関する検索関心の推移をまとめた独自トレンドデータ。",
    },
  ];

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "独自調査データ室",
    url,
    isPartOf: { "@type": "WebSite", url: base, name: SITE_NAME_LOGO },
    publisher: { "@type": "Organization", name: SITE_NAME_LOGO, url: base },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: base },
      { "@type": "ListItem", position: 2, name: "データ室", item: url },
    ],
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 leading-relaxed text-foreground">
      <JsonLd data={[collectionSchema, breadcrumbSchema]} />

      <nav className="mb-6 text-sm text-foreground/50" aria-label="パンくず">
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-2">/</span>
        <span>データ室</span>
      </nav>

      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">独自調査データ室</h1>
        <p className="mt-3 text-base text-foreground/80">
          {SITE_NAME_LOGO}が、全国の自治体公式情報などをもとに独自集計した一次データを公開しています。
          出典を明記いただければ、記事・報道・研究・自治体資料などに自由にご利用いただけます（CC BY 4.0）。
        </p>
      </header>

      {/* 主要レポート */}
      <section className="mb-12" aria-label="調査レポート">
        <div className="grid gap-4 sm:grid-cols-2">
          {reports.map((rep) => (
            <Link
              key={rep.href}
              href={rep.href}
              className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <h2 className="text-base font-bold text-foreground group-hover:text-primary sm:text-lg">{rep.title}</h2>
              <p className="mt-2 flex-1 text-sm text-foreground/70">{rep.desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                データを見る <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 都道府県別（47面ハブ） */}
      <section className="mb-12">
        <h2 className="mb-2 border-l-4 border-primary pl-3 text-xl font-bold sm:text-2xl">
          都道府県別の空き家解体補助金データ
        </h2>
        <p className="mb-4 text-sm text-foreground/60">
          各都道府県の市区町村別ランキング・中央値・全国比較を確認できます。
        </p>
        <div className="flex flex-wrap gap-2">
          {prefs.map((p) => (
            <Link
              key={p.prefId}
              href={`/data/akiya-hojokin-ranking/${p.prefId}`}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground/80 transition hover:border-primary/40 hover:text-primary"
            >
              {p.prefName}
            </Link>
          ))}
        </div>
      </section>

      {/* 引用について */}
      <section className="mb-10 rounded-2xl bg-primary/5 p-6">
        <h2 className="mb-2 text-lg font-bold">報道・引用される方へ</h2>
        <p className="text-sm leading-relaxed text-foreground/80">
          各データページに、引用文（本文・図表キャプション・参考文献）のワンクリックコピー、埋め込みカード、オープンデータ（CSV/JSON・全件に公式URL付き）をご用意しています。
          最新の調査発表は <Link href="/news" className="text-primary underline hover:no-underline">ニュース・プレスリリース</Link>、
          取材・データのご相談は <Link href="/contact" className="text-primary underline hover:no-underline">お問い合わせ</Link> へお気軽にどうぞ。
        </p>
      </section>
    </main>
  );
}
