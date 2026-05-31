import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogList, getCategories } from "../../../lib/microcms";
import { pageTitle } from "../../../lib/site-brand";
import { getCanonicalUrl } from "../../../lib/site-url";
import { ARTICLE_CATEGORIES } from "../../../lib/article-categories";
import { ARTICLE_SITUATIONS } from "../../../lib/article-situations";
import ArticleCardEnhanced from "../../../components/articles/ArticleCardEnhanced";

interface Props {
  params: Promise<{ categorySlug: string }>;
}

export const revalidate = 600;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ categorySlug: c.id }));
}

const CATEGORY_ICON_MAP: Record<string, string> = {
  guide: "🧭",
  cleanup: "🧹",
  inheritance: "📜",
  "real-estate": "🏘️",
  digital: "💻",
  mental: "💝",
  shukatsu: "🌸",
};

export async function generateMetadata({ params }: Props) {
  const { categorySlug } = await params;
  const [categories] = await Promise.all([getCategories()]);
  const category = categories.find((c) => c.id === categorySlug);
  const def = ARTICLE_CATEGORIES.find((c) => c.slug === categorySlug);
  if (!category) {
    return {
      title: pageTitle("記事一覧"),
      alternates: { canonical: getCanonicalUrl(`/articles/category/${categorySlug}`) },
    };
  }
  return {
    title: pageTitle(`${category.name}の記事一覧`),
    description: def?.description ?? `${category.name}に関する記事一覧。生前整理・実家じまい・終活のコラム。`,
    alternates: { canonical: getCanonicalUrl(`/articles/category/${categorySlug}`) },
  };
}

export default async function ArticlesCategoryPage({ params }: Props) {
  const { categorySlug } = await params;
  const [categories, listRes] = await Promise.all([
    getCategories(),
    getBlogList(100, 0, { categoryId: categorySlug }),
  ]);
  const contents = listRes.contents ?? [];
  const category = categories.find((c) => c.id === categorySlug);
  if (!category) notFound();

  const def = ARTICLE_CATEGORIES.find((c) => c.slug === categorySlug);
  const icon = CATEGORY_ICON_MAP[categorySlug] ?? "📄";

  // 他のカテゴリも全て取得して、サイドに並べる
  const otherCategories = categories.filter((c) => c.id !== categorySlug);

  // 関連シナリオを見つける（このカテゴリが含まれるシナリオ）
  const relatedSituations = ARTICLE_SITUATIONS.filter((s) =>
    s.relatedCategories.includes(categorySlug)
  );

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* パンくず */}
      <nav className="text-xs text-foreground/60" aria-label="パンくず">
        <Link href="/" className="hover:text-primary hover:underline">
          ホーム
        </Link>
        <span className="mx-2">/</span>
        <Link href="/articles" className="hover:text-primary hover:underline">
          記事一覧
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground/80">{category.name}</span>
      </nav>

      {/* ヒーロー */}
      <header className="bg-gradient-to-br from-primary-light/30 to-card border-2 border-primary/20 rounded-3xl p-6 sm:p-10">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-4xl sm:text-5xl" aria-hidden="true">
            {icon}
          </span>
          <div>
            <p className="text-xs font-bold text-primary tracking-wider uppercase">
              CATEGORY
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {category.name}
            </h1>
          </div>
        </div>
        {def?.description && (
          <p className="text-sm sm:text-base text-foreground/75 leading-relaxed">
            {def.description}
          </p>
        )}
        <p className="text-xs text-foreground/60 mt-3">
          このカテゴリには{contents.length}本の記事があります
        </p>
      </header>

      {/* 関連シナリオへの誘導 */}
      {relatedSituations.length > 0 && (
        <section
          aria-labelledby="related-situations-heading"
          className="bg-card border border-border rounded-2xl p-5"
        >
          <h2
            id="related-situations-heading"
            className="text-sm font-bold text-foreground/75 mb-3"
          >
            🎯 このテーマに関連する状況別ガイド
          </h2>
          <ul className="flex flex-wrap gap-2">
            {relatedSituations.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/articles/situation/${s.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary-light/30 border border-primary/20 hover:bg-primary hover:text-white text-xs sm:text-sm font-medium transition"
                >
                  <span aria-hidden="true">{s.iconEmoji}</span>
                  {s.shortLabel}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 記事一覧 */}
      {contents.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <p className="text-foreground/60 mb-4">
            このカテゴリの記事はまだありません。
          </p>
          <Link
            href="/articles"
            className="inline-block px-5 py-2.5 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary/90 transition"
          >
            ← 他のカテゴリを見る
          </Link>
        </div>
      ) : (
        <section aria-labelledby="articles-heading">
          <h2 id="articles-heading" className="sr-only">
            {category.name}の記事
          </h2>
          {/* 最初の1本はヒーロー */}
          <div className="space-y-5">
            <ArticleCardEnhanced post={contents[0]} variant="hero" />
            {contents.length > 1 && (
              <ul className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {contents.slice(1).map((post) => (
                  <li key={post.id}>
                    <ArticleCardEnhanced post={post} variant="default" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* 他のカテゴリ誘導 */}
      {otherCategories.length > 0 && (
        <section
          aria-labelledby="other-categories-heading"
          className="bg-card border-2 border-border rounded-2xl p-5 sm:p-6"
        >
          <h2
            id="other-categories-heading"
            className="text-base sm:text-lg font-bold text-foreground mb-4"
          >
            他のテーマも見る
          </h2>
          <ul className="flex flex-wrap gap-2">
            {otherCategories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/articles/category/${c.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary-light/20 border border-primary/20 hover:bg-primary hover:text-white text-sm font-medium transition"
                >
                  <span aria-hidden="true">{CATEGORY_ICON_MAP[c.id] ?? "📄"}</span>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* CTA */}
      <section className="text-center">
        <Link
          href="/articles"
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          ← 記事一覧トップへ戻る
        </Link>
      </section>
    </div>
  );
}
