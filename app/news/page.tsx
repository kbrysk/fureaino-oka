import Link from "next/link";
import type { Metadata } from "next";
import { getCanonicalBase } from "@/app/lib/site-url";
import { SITE_NAME_LOGO } from "@/app/lib/site-brand";
import JsonLd from "@/app/components/JsonLd";

/**
 * ニュース／プレスリリース一覧（一次ソースのハブ）。
 * PR配信の発信元・報道関係者の入口。被リンク資産の集約。
 */
const PATH = "/news";

type NewsItem = { href: string; date: string; title: string; summary: string };

const NEWS: NewsItem[] = [
  {
    href: "/news/akiya-hojokin-survey-2026",
    date: "2026-06-04",
    title: "【調査発表】全国1,726自治体を独自調査｜空き家の解体補助金を確認できたのは48.9%、上限額の中央値は50万円",
    summary:
      "全国市区町村の約99%をカバーする空き家解体補助金データを、出典付き・CC BY 4.0で無料公開しました。",
  },
];

export function generateMetadata(): Metadata {
  const base = getCanonicalBase();
  const url = `${base}${PATH}`;
  const title = `ニュース・プレスリリース｜${SITE_NAME_LOGO}`;
  const description =
    "生前整理支援センター ふれあいの丘の調査発表・お知らせ。空き家・解体補助金などの独自調査データを出典付き・無料（CC BY 4.0）で公開しています。報道・引用のご相談も承ります。";
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

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "ニュース・プレスリリース",
    url,
    publisher: { "@type": "Organization", name: SITE_NAME_LOGO, url: base },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: base },
      { "@type": "ListItem", position: 2, name: "ニュース", item: url },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 leading-relaxed text-foreground">
      <JsonLd data={[collectionSchema, breadcrumbSchema]} />

      <nav className="mb-6 text-sm text-foreground/50" aria-label="パンくず">
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-2">/</span>
        <span>ニュース</span>
      </nav>

      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">ニュース・プレスリリース</h1>
        <p className="mt-3 text-base text-foreground/80">
          独自調査の発表・お知らせ。データは出典明記で自由にご利用いただけます（CC BY 4.0）。
          報道・引用のご相談は <Link href="/contact" className="text-primary hover:underline">お問い合わせ</Link> へ。
        </p>
      </header>

      <ul className="space-y-4">
        {NEWS.map((n) => (
          <li key={n.href}>
            <Link
              href={n.href}
              className="group block rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-md"
            >
              <p className="text-sm text-foreground/50">{n.date}</p>
              <h2 className="mt-1 text-base font-bold text-foreground group-hover:text-primary sm:text-lg">
                {n.title}
              </h2>
              <p className="mt-2 text-sm text-foreground/70">{n.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
