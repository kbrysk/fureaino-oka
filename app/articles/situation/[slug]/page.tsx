import { notFound } from "next/navigation";
import Link from "next/link";
import { ARTICLE_SITUATIONS, getSituation, SITUATION_ACCENT_CLASSES } from "../../../lib/article-situations";
import { getBlogList } from "../../../lib/microcms";
import { pageTitle } from "../../../lib/site-brand";
import { getCanonicalUrl } from "../../../lib/site-url";
import ArticleCardEnhanced from "../../../components/articles/ArticleCardEnhanced";
import type { MicroCmsBlogPost } from "../../../lib/microcms-types";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 600;

export async function generateStaticParams() {
  return ARTICLE_SITUATIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const s = getSituation(slug);
  if (!s) {
    return {
      title: pageTitle("シナリオ別ガイド"),
      alternates: { canonical: getCanonicalUrl(`/articles/situation/${slug}`) },
    };
  }
  return {
    title: pageTitle(s.fullTitle),
    description: s.leadText.slice(0, 160),
    alternates: { canonical: getCanonicalUrl(`/articles/situation/${slug}`) },
  };
}

export default async function ArticleSituationPage({ params }: Props) {
  const { slug } = await params;
  const situation = getSituation(slug);
  if (!situation) notFound();

  // microCMSから全記事取得（curated順に並べ替えるため）
  const listRes = await getBlogList(100, 0);
  const allPosts = listRes.contents ?? [];
  const postsById = new Map(allPosts.map((p) => [p.id, p]));

  // キュレーション記事を順序通り取得
  const curatedPosts: MicroCmsBlogPost[] = situation.curatedArticleIds
    .map((id) => postsById.get(id))
    .filter((p): p is MicroCmsBlogPost => Boolean(p));

  // 他のシナリオへのブリッジ用に、関連するシナリオを抽出
  const relatedSituations = ARTICLE_SITUATIONS.filter((s) => s.slug !== slug).slice(0, 3);

  const c = SITUATION_ACCENT_CLASSES[situation.accentColor];

  return (
    <article className="space-y-10 sm:space-y-12">
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
        <span className="text-foreground/80">{situation.shortLabel}</span>
      </nav>

      {/* ヒーロー */}
      <header
        className={`${c.cardBg} ${c.ring} ring-2 rounded-3xl p-6 sm:p-10 text-center`}
      >
        <p className="text-3xl sm:text-5xl mb-3" aria-hidden="true">
          {situation.iconEmoji}
        </p>
        <p className={`text-xs sm:text-sm font-bold ${c.text} tracking-wider uppercase mb-2`}>
          {situation.emotionalHook}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-snug max-w-2xl mx-auto">
          {situation.fullTitle}
        </h1>
        <p className="text-sm sm:text-base text-foreground/75 mt-5 leading-relaxed max-w-2xl mx-auto">
          {situation.leadText}
        </p>
      </header>

      {/* おすすめ記事（最重要・大きく見せる） */}
      <section aria-labelledby="curated-heading">
        <header className="mb-5 sm:mb-6">
          <h2
            id="curated-heading"
            className="text-xl sm:text-2xl font-bold text-foreground"
          >
            この状況の方におすすめの記事（{curatedPosts.length}本）
          </h2>
          <p className="text-sm text-foreground/65 mt-1">
            生前整理普及協会の理念に基づき、運営者・大久保亮佑が厳選した順序です。
          </p>
        </header>

        {curatedPosts.length > 0 ? (
          <div className="space-y-5">
            {/* 1記事目：ヒーロー大型 */}
            <ArticleCardEnhanced post={curatedPosts[0]} variant="hero" />

            {/* 2記事目以降：2列グリッド */}
            {curatedPosts.length > 1 && (
              <ul className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {curatedPosts.slice(1).map((p) => (
                  <li key={p.id}>
                    <ArticleCardEnhanced post={p} variant="default" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <p className="text-foreground/50 bg-card border border-border rounded-xl p-6">
            記事は準備中です。下の他のシナリオをご覧ください。
          </p>
        )}
      </section>

      {/* CTA：ツールへの誘導 */}
      <section className="bg-primary-light/30 border-2 border-primary/20 rounded-2xl p-6 text-center">
        <h2 className="text-lg sm:text-xl font-bold text-foreground">
          自分の状況を整理したい方へ
        </h2>
        <p className="text-sm text-foreground/70 mt-2 mb-4">
          無料の診断ツールやチェックリストで、次の一歩を具体化できます。
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/tools/jikka-diagnosis"
            className="inline-flex items-center px-5 py-3 bg-primary text-white rounded-full font-bold text-sm hover:bg-primary/90 transition"
          >
            🔎 実家じまい力診断（3分・無料）
          </Link>
          <Link
            href="/checklist"
            className="inline-flex items-center px-5 py-3 bg-card border-2 border-primary text-primary rounded-full font-bold text-sm hover:bg-primary-light/30 transition"
          >
            ✅ 生前整理チェックリスト
          </Link>
        </div>
      </section>

      {/* 他のシナリオへのブリッジ */}
      <section aria-labelledby="other-situations-heading">
        <h2
          id="other-situations-heading"
          className="text-lg sm:text-xl font-bold text-foreground mb-4"
        >
          他の状況の方はこちら
        </h2>
        <ul className="grid gap-3 sm:gap-4 sm:grid-cols-3">
          {relatedSituations.map((rs) => {
            const rc = SITUATION_ACCENT_CLASSES[rs.accentColor];
            return (
              <li key={rs.slug}>
                <Link
                  href={`/articles/situation/${rs.slug}`}
                  className={`block ${rc.cardBg} border border-border hover:border-primary/40 hover:shadow-md rounded-2xl p-4 transition-all`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl" aria-hidden="true">
                      {rs.iconEmoji}
                    </span>
                    <h3 className="text-sm font-bold text-foreground leading-snug">
                      {rs.shortLabel}
                    </h3>
                  </div>
                  <p className="text-xs text-foreground/60 line-clamp-2">
                    {rs.emotionalHook}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 戻る */}
      <div>
        <Link
          href="/articles"
          className="inline-block text-sm font-medium text-primary hover:underline"
        >
          ← 記事一覧トップへ戻る
        </Link>
      </div>
    </article>
  );
}
