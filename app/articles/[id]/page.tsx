import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBlogPost, getBlogPostIds } from "../../lib/microcms";
import { pageTitle, SITE_NAME_FULL } from "../../lib/site-brand";
import { getCanonicalBase } from "../../lib/site-url";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import ArticleLineCTABanner from "../../components/articles/ArticleLineCTABanner";
import ArticleEeaatProfile from "../../components/articles/ArticleEeaatProfile";
import ArticleBodyContentMicroCms from "../../components/articles/ArticleBodyContentMicroCms";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const ids = await getBlogPostIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getBlogPost(id);
  if (!post) return { title: pageTitle("記事が見つかりません") };

  const title = post.title;
  const description =
    post.description ?? (post.body ? post.body.replace(/<[^>]+>/g, "").slice(0, 160) + "…" : undefined);
  const base = getCanonicalBase();
  const ogImage = post.ogpImage?.url ?? post.thumbnail?.url;
  const url = `${base}/articles/${id}`;

  return {
    title: pageTitle(title),
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: SITE_NAME_FULL,
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      }),
      publishedTime: post.publishedAt,
      modifiedTime: post.revisedAt ?? post.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;
  const post = await getBlogPost(id);
  if (!post) notFound();

  const base = getCanonicalBase();
  const dateStr = post.publishedAt
    ? format(new Date(post.publishedAt), "yyyy年M月d日", { locale: ja })
    : "";
  const thumb = post.thumbnail?.url;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description ?? undefined,
    datePublished: post.publishedAt,
    dateModified: post.revisedAt ?? post.publishedAt,
    author: { "@type": "Organization", name: "株式会社Kogera 生前整理支援センター ふれあいの丘" },
    publisher: { "@type": "Organization", name: SITE_NAME_FULL },
    ...(thumb && { image: thumb }),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${base}/articles/${id}` },
  };

  return (
    <article className="max-w-3xl mx-auto py-8 px-4" itemScope itemType="https://schema.org/Article">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-sm text-foreground/60 mb-6">
        <Link href="/" className="hover:text-primary transition">トップ</Link>
        <span className="mx-2">/</span>
        <Link href="/articles" className="hover:text-primary transition">記事一覧</Link>
        <span className="mx-2">/</span>
        <span className="line-clamp-1">{post.title}</span>
      </nav>

      <header>
        {post.category?.name && (
          <span className="inline-block text-xs font-medium text-primary bg-primary-light px-2 py-0.5 rounded mb-2">
            {post.category.name}
          </span>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-primary mt-1" itemProp="headline">
          {post.title}
        </h1>
        {dateStr && (
          <time
            className="text-sm text-foreground/50 block mt-2"
            dateTime={post.publishedAt}
            itemProp="datePublished"
          >
            {dateStr}
          </time>
        )}
      </header>

      {thumb && (
        <figure className="mt-6 rounded-xl overflow-hidden border border-border aspect-video relative w-full">
          <Image
            src={thumb}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
            priority
          />
        </figure>
      )}

      <ArticleLineCTABanner />

      <div className="mt-8">
        <ArticleBodyContentMicroCms body={post.body} />
      </div>

      <ArticleLineCTABanner />

      <footer className="mt-10">
        <ArticleEeaatProfile />
        <div className="mt-8 pt-6 border-t border-border">
          <Link href="/articles" className="text-primary font-medium hover:underline">
            ← 記事一覧へ戻る
          </Link>
        </div>
      </footer>
    </article>
  );
}
