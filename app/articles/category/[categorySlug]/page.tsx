import { notFound } from "next/navigation";
import Link from "next/link";
import { ARTICLE_CATEGORIES, getArticleCategoryBySlug } from "../../../lib/article-categories";
import { getArticlesByCategorySlug } from "../../../lib/articles";
import { pageTitle } from "../../../lib/site-brand";

interface Props {
  params: Promise<{ categorySlug: string }>;
}

export async function generateStaticParams() {
  return ARTICLE_CATEGORIES.map((c) => ({ categorySlug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { categorySlug } = await params;
  const category = getArticleCategoryBySlug(categorySlug);
  if (!category) return { title: pageTitle("記事一覧") };
  return {
    title: pageTitle(`${category.name}｜記事一覧`),
    description: category.description,
  };
}

export default async function ArticlesCategoryPage({ params }: Props) {
  const { categorySlug } = await params;
  const category = getArticleCategoryBySlug(categorySlug);
  if (!category) notFound();
  const articles = getArticlesByCategorySlug(categorySlug);

  return (
    <div className="space-y-8">
      <p className="text-sm text-foreground/50">
        <Link href="/articles" className="hover:text-primary">記事一覧</Link>
        <span className="mx-2">/</span>
        <span>{category.name}</span>
      </p>
      <div>
        <h1 className="text-2xl font-bold text-primary">{category.name}</h1>
        <p className="text-foreground/60 mt-1">{category.description}</p>
      </div>
      {articles.length === 0 ? (
        <p className="text-foreground/50">このカテゴリの記事はまだありません。</p>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2">
          {articles.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/articles/${a.slug}`}
                className="block bg-card rounded-xl p-6 border border-border hover:shadow-md hover:border-primary/30 transition"
              >
                <h2 className="font-bold text-lg text-primary">{a.title}</h2>
                <p className="text-sm text-foreground/60 mt-2 line-clamp-2">{a.description}</p>
                <time className="text-xs text-foreground/40 mt-2 block" dateTime={a.date}>
                  {a.date}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-3">
        <Link href="/articles" className="inline-block text-primary font-medium hover:underline">
          ← 記事一覧へ
        </Link>
        <Link href="/guide" className="inline-block text-primary font-medium hover:underline">
          実家じまいの進め方 全手順
        </Link>
      </div>
    </div>
  );
}
