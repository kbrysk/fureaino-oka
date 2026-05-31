import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getBlogList, getTags } from "../../../lib/microcms";
import { pageTitle } from "../../../lib/site-brand";
import { getCanonicalUrl } from "../../../lib/site-url";
import { ARTICLE_TAGS } from "../../../lib/article-tags";
import ArticleCardEnhanced from "../../../components/articles/ArticleCardEnhanced";

interface Props {
  params: Promise<{ tagSlug: string }>;
}

export const revalidate = 600;

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.map((t) => ({ tagSlug: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tagSlug } = await params;
  const tags = await getTags();
  const tag = tags.find((t) => t.id === tagSlug);
  const def = ARTICLE_TAGS.find((t) => t.slug === tagSlug);
  if (!tag) {
    return {
      title: pageTitle("記事一覧"),
      alternates: { canonical: getCanonicalUrl(`/articles/tag/${tagSlug}`) },
    };
  }
  return {
    title: pageTitle(def?.title ?? `${tag.name}｜記事一覧`),
    description: def?.leadText?.slice(0, 160) ?? `${tag.name}に関する記事一覧。`,
    alternates: { canonical: getCanonicalUrl(`/articles/tag/${tagSlug}`) },
  };
}

export default async function ArticlesTagPage({ params }: Props) {
  const { tagSlug } = await params;
  const [tags, listRes] = await Promise.all([
    getTags(),
    getBlogList(100, 0, { tagId: tagSlug }),
  ]);
  const contents = listRes.contents ?? [];
  const tag = tags.find((t) => t.id === tagSlug);
  if (!tag) notFound();

  const def = ARTICLE_TAGS.find((t) => t.slug === tagSlug);
  const otherTags = tags.filter((t) => t.id !== tagSlug).slice(0, 8);

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
        <span className="text-foreground/80">#{def?.shortLabel ?? tag.name}</span>
      </nav>

      {/* ヒーロー（タグ別LP） */}
      <header className="bg-gradient-to-br from-accent/10 to-primary-light/30 border-2 border-primary/20 rounded-3xl p-6 sm:p-10">
        <p className="text-xs font-bold text-primary tracking-wider uppercase mb-2">
          # SITUATION TAG
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-snug">
          {def?.title ?? tag.name}
        </h1>
        {def?.leadText && (
          <p className="text-sm sm:text-base text-foreground/75 mt-4 leading-relaxed max-w-2xl">
            {def.leadText}
          </p>
        )}
        <p className="text-xs text-foreground/60 mt-3">
          {contents.length}本の記事があります
        </p>

        {/* このタグ専用のCTAツール */}
        {def?.toolHref && def?.toolLabel && (
          <div className="mt-5">
            <Link
              href={def.toolHref}
              className="inline-flex items-center px-5 py-3 bg-primary text-white rounded-full font-bold text-sm hover:bg-primary/90 hover:shadow-md transition shadow"
            >
              🎯 {def.toolLabel} →
            </Link>
          </div>
        )}
      </header>

      {/* 記事リスト */}
      {contents.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <p className="text-foreground/60 mb-4">
            このタグの記事はまだありません。
          </p>
          <Link
            href="/articles"
            className="inline-block px-5 py-2.5 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary/90 transition"
          >
            ← 他の状況を見る
          </Link>
        </div>
      ) : (
        <section aria-labelledby="tag-articles-heading">
          <h2 id="tag-articles-heading" className="sr-only">
            「{tag.name}」の記事
          </h2>
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

      {/* 他の状況タグ */}
      {otherTags.length > 0 && (
        <section
          aria-labelledby="other-tags-heading"
          className="bg-card border-2 border-border rounded-2xl p-5 sm:p-6"
        >
          <h2
            id="other-tags-heading"
            className="text-base sm:text-lg font-bold text-foreground mb-4"
          >
            他の状況も見る
          </h2>
          <ul className="flex flex-wrap gap-2">
            {otherTags.map((t) => {
              const td = ARTICLE_TAGS.find((tag) => tag.slug === t.id);
              return (
                <li key={t.id}>
                  <Link
                    href={`/articles/tag/${t.id}`}
                    className="inline-flex items-center px-4 py-2 rounded-xl bg-primary-light/20 border border-primary/20 hover:bg-primary hover:text-white text-sm font-medium transition"
                  >
                    # {td?.shortLabel ?? t.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* 戻り */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/articles"
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          ← 記事一覧トップへ戻る
        </Link>
      </div>
    </div>
  );
}
