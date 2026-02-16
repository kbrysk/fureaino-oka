import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getArticleBySlug, getArticleSlugs } from "../../lib/articles";
import ArticleFooterCTA from "../../components/ArticleFooterCTA";
import ArticleLineCTATop from "../../components/ArticleLineCTATop";
import ArticleBodyWithOwl from "../../components/ArticleBodyWithOwl";
import ArticleSituationCTA from "../../components/ArticleSituationCTA";
import { pageTitle, SITE_NAME_FULL } from "../../lib/site-brand";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: pageTitle("記事が見つかりません") };
  return {
    title: pageTitle(article.title),
    description: article.description,
    ...(article.eyecatch && {
      openGraph: { images: [{ url: article.eyecatch, width: 800, height: 450, alt: article.title }] },
    }),
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const baseUrl =
    typeof process.env.NEXT_PUBLIC_SITE_URL === "string"
      ? process.env.NEXT_PUBLIC_SITE_URL
      : null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    author: { "@type": "Organization", name: SITE_NAME_FULL },
    publisher: { "@type": "Organization", name: SITE_NAME_FULL },
    ...(article.eyecatch && { image: article.eyecatch }),
    ...(baseUrl && {
      mainEntityOfPage: { "@type": "WebPage", "@id": `${baseUrl}/articles/${slug}` },
    }),
  };

  return (
    <article className="space-y-8" itemScope itemType="https://schema.org/Article">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header>
        <span className="text-sm text-foreground/50" aria-label="カテゴリ">
          {article.category}
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-primary mt-1" itemProp="headline">
          {article.title}
        </h1>
        <time className="text-sm text-foreground/50" dateTime={article.date} itemProp="datePublished">
          {article.date}
        </time>
      </header>
      {article.eyecatch && (
        <figure className="rounded-xl overflow-hidden border border-border aspect-video relative w-full">
          <Image
            src={article.eyecatch}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
            priority
          />
        </figure>
      )}
      <ArticleLineCTATop />
      <ArticleBodyWithOwl
        body={article.body ?? ""}
        owlMessages={article.owlMessages}
        images={article.images}
      />
      <div className="pt-8">
        <ArticleSituationCTA />
      </div>
      <footer className="pt-8 border-t border-border space-y-8">
        <ArticleFooterCTA slug={slug} category={article.category} />
        <div>
          <p className="text-sm text-foreground/60 mb-3">関連リンク</p>
          <ul className="flex flex-wrap gap-3">
            <li>
              <Link href="/guide" className="text-primary hover:underline">
                はじめかた
              </Link>
            </li>
            <li>
              <Link href="/checklist" className="text-primary hover:underline">
                チェックリスト
              </Link>
            </li>
            <li>
              <Link href="/articles" className="text-primary hover:underline">
                記事一覧
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </article>
  );
}
