import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getArticleTagBySlug, getArticleTagSlugs } from "../../../lib/article-tags";
import { getArticlesByTagSlug } from "../../../lib/articles";
import { pageTitle } from "../../../lib/site-brand";

const MIN_ARTICLES_FOR_INDEX = 3;

interface Props {
  params: Promise<{ tagSlug: string }>;
}

export async function generateStaticParams() {
  return getArticleTagSlugs().map((tagSlug) => ({ tagSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tagSlug } = await params;
  const tag = getArticleTagBySlug(tagSlug);
  if (!tag) return { title: pageTitle("記事一覧") };
  const articles = getArticlesByTagSlug(tagSlug);
  const noindex = articles.length < MIN_ARTICLES_FOR_INDEX;
  return {
    title: pageTitle(tag.title),
    description: tag.leadText.slice(0, 160),
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}

export default async function ArticlesTagPage({ params }: Props) {
  const { tagSlug } = await params;
  const tag = getArticleTagBySlug(tagSlug);
  if (!tag) notFound();
  const articles = getArticlesByTagSlug(tagSlug);

  return (
    <div className="space-y-8">
      <p className="text-sm text-foreground/50">
        <Link href="/articles" className="hover:text-primary">記事一覧</Link>
        <span className="mx-2">/</span>
        <span>{tag.name}</span>
      </p>
      <div>
        <h1 className="text-2xl font-bold text-primary">{tag.title}</h1>
        <p className="text-foreground/70 mt-3 leading-relaxed max-w-2xl">{tag.leadText}</p>
      </div>

      {/* Pick Up 3（先頭3件を「まず読むべき」として強調） */}
      {articles.length > 0 && (
        <section>
          <h2 className="font-bold text-lg text-primary mb-4">まず読むべきおすすめ記事</h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {articles.slice(0, 3).map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/articles/${a.slug}`}
                  className="block bg-primary-light/30 rounded-xl border border-primary/20 p-5 hover:border-primary/50 transition"
                >
                  <h3 className="font-bold text-primary">{a.title}</h3>
                  <p className="text-sm text-foreground/60 mt-1 line-clamp-2">{a.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* CTA: この状況のリスクを診断する */}
      {tag.toolHref && tag.toolLabel && (
        <section className="bg-primary-light/40 rounded-2xl border border-primary/20 p-6 text-center">
          <p className="font-bold text-primary mb-2">この状況を数字で確認する</p>
          <Link
            href={tag.toolHref}
            className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition"
          >
            {tag.toolLabel}
          </Link>
        </section>
      )}

      {/* その他の記事（4件目以降） */}
      {articles.length > 3 && (
        <section>
          <h2 className="font-bold text-lg text-foreground/90 mb-4">その他の記事</h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {articles.slice(3).map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/articles/${a.slug}`}
                  className="block bg-card rounded-xl p-5 border border-border hover:shadow-md hover:border-primary/30 transition"
                >
                  <h3 className="font-bold text-primary">{a.title}</h3>
                  <p className="text-sm text-foreground/60 mt-1 line-clamp-2">{a.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {articles.length === 0 && (
        <p className="text-foreground/50">このタグの記事はまだありません。</p>
      )}

      <div className="flex flex-wrap gap-3">
        <Link href="/articles" className="inline-block text-primary font-medium hover:underline">
          ← 記事一覧へ
        </Link>
        <Link href="/tools/jikka-diagnosis" className="inline-block text-primary font-medium hover:underline">
          実家じまい力診断（無料）
        </Link>
      </div>
    </div>
  );
}
