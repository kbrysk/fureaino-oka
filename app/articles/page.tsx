import Link from "next/link";
import { getBlogList, getCategories, getTags } from "../lib/microcms";
import { pageTitle } from "../lib/site-brand";
import { getCanonicalUrl } from "../lib/site-url";
import { ARTICLE_TAGS } from "../lib/article-tags";
import ArticleCardEnhanced from "../components/articles/ArticleCardEnhanced";
import SituationNavigator from "../components/articles/SituationNavigator";
import CategoryShowcase from "../components/articles/CategoryShowcase";
import ArticleSearchBar from "../components/articles/ArticleSearchBar";
import type { MicroCmsBlogPost } from "../lib/microcms-types";

export const metadata = {
  title: pageTitle("記事一覧"),
  description:
    "生前整理・実家じまい・遺品整理・終活の記事まとめ。あなたの状況に合わせた5つのシナリオから、最適な情報をすぐに見つけられます。生前整理アドバイザー2級・大久保亮佑監修。",
  alternates: { canonical: getCanonicalUrl("/articles") },
};

// ISR: microCMSの記事公開を10分ごとに自動反映
export const revalidate = 600;

/** カテゴリ別に記事をグループ化 */
function groupByCategory(
  posts: MicroCmsBlogPost[]
): Map<string, MicroCmsBlogPost[]> {
  const map = new Map<string, MicroCmsBlogPost[]>();
  for (const p of posts) {
    const catId = p.category?.id;
    if (!catId) continue;
    if (!map.has(catId)) map.set(catId, []);
    map.get(catId)!.push(p);
  }
  return map;
}

export default async function ArticlesPage() {
  const [listRes, categories, tags] = await Promise.all([
    getBlogList(100, 0),
    getCategories(),
    getTags(),
  ]);
  const contents = listRes.contents ?? [];

  // データ前処理
  const articlesByCategory = groupByCategory(contents);
  const latestArticles = contents.slice(0, 6); // 新着6本
  const featuredArticle = contents[0] ?? null; // ヒーロー大型用

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* パンくず */}
      <nav className="text-xs text-foreground/60" aria-label="パンくず">
        <Link href="/" className="hover:text-primary hover:underline">
          ホーム
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground/80">記事一覧</span>
      </nav>

      {/* ページタイトル + 検索 */}
      <header className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            記事一覧
          </h1>
          <p className="text-sm sm:text-base text-foreground/65 mt-2 max-w-2xl">
            生前整理・実家じまい・遺品整理・終活に関する{contents.length}本の記事を、
            あなたの状況に合わせてお届けします。
          </p>
        </div>
        <ArticleSearchBar posts={contents} />
      </header>

      {/* STEP 1: シナリオベース・エントリー（最重要） */}
      <SituationNavigator />

      {/* STEP 2: カテゴリ別ショーケース */}
      <CategoryShowcase
        categories={categories}
        articlesByCategory={articlesByCategory}
      />

      {/* 注目の1本（編集者選定） */}
      {featuredArticle && (
        <section aria-labelledby="featured-heading">
          <header className="mb-5">
            <p className="text-xs font-bold text-primary tracking-wider uppercase mb-2">
              📌 編集部の注目記事
            </p>
            <h2
              id="featured-heading"
              className="text-xl sm:text-2xl font-bold text-foreground"
            >
              いま読んでおきたい1本
            </h2>
          </header>
          <ArticleCardEnhanced post={featuredArticle} variant="hero" />
        </section>
      )}

      {/* 状況タグナビ（既存LP接続） */}
      {tags.length > 0 && (
        <section
          aria-labelledby="situation-tags-heading"
          className="bg-card border-2 border-border rounded-2xl p-5 sm:p-7"
        >
          <header className="mb-4">
            <p className="text-xs font-bold text-primary tracking-wider uppercase mb-2">
              💬 お悩みから探す
            </p>
            <h2
              id="situation-tags-heading"
              className="text-lg sm:text-xl font-bold text-foreground"
            >
              今のあなたの状況に近いものは？
            </h2>
            <p className="text-xs text-foreground/60 mt-1">
              タップすると、その状況に最適化された記事まとめへ移動します。
            </p>
          </header>
          <ul className="flex flex-wrap gap-2 sm:gap-3">
            {tags.map((tag) => {
              const def = ARTICLE_TAGS.find((t) => t.slug === tag.id);
              const label = def?.shortLabel ?? tag.name;
              return (
                <li key={tag.id}>
                  <Link
                    href={`/articles/tag/${tag.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary-light/30 border border-primary/20 hover:bg-primary hover:text-white hover:border-primary text-sm font-medium text-foreground/90 transition min-h-[44px]"
                  >
                    <span className="text-primary group-hover:text-white">#</span>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* CTA: 診断ツール挟み込み */}
      <section className="bg-gradient-to-r from-primary-light/40 via-card to-primary-light/40 border-2 border-primary/20 rounded-2xl p-5 sm:p-7 text-center">
        <h2 className="text-base sm:text-lg font-bold text-foreground">
          記事を読む前に、自分の状況を3分でチェック
        </h2>
        <p className="text-xs sm:text-sm text-foreground/70 mt-2 mb-4">
          無料の診断ツールで、あなたに合う進め方と必要な記事をご提案します。
        </p>
        <Link
          href="/tools/jikka-diagnosis"
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full font-bold text-sm sm:text-base hover:bg-primary/90 hover:shadow-lg transition shadow-md"
        >
          🔎 実家じまい力診断（無料・3分）
        </Link>
      </section>

      {/* 新着記事 */}
      <section aria-labelledby="latest-heading">
        <header className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold text-primary tracking-wider uppercase mb-2">
              ✨ NEW
            </p>
            <h2
              id="latest-heading"
              className="text-xl sm:text-2xl font-bold text-foreground"
            >
              新着の記事
            </h2>
          </div>
          <p className="text-xs text-foreground/60">
            最新 {Math.min(latestArticles.length, 6)} 本
          </p>
        </header>
        <ul className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latestArticles.map((post) => (
            <li key={post.id}>
              <ArticleCardEnhanced post={post} variant="default" />
            </li>
          ))}
        </ul>
      </section>

      {/* 全記事一覧（コンパクト形式） */}
      {contents.length > 6 && (
        <section aria-labelledby="all-articles-heading">
          <header className="mb-5">
            <h2
              id="all-articles-heading"
              className="text-xl sm:text-2xl font-bold text-foreground"
            >
              すべての記事（{contents.length}本）
            </h2>
            <p className="text-sm text-foreground/60 mt-1">
              更新日が新しい順に並んでいます。
            </p>
          </header>
          <ul className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            {contents.slice(6).map((post) => (
              <li key={post.id}>
                <ArticleCardEnhanced post={post} variant="compact" />
              </li>
            ))}
          </ul>
        </section>
      )}

      {contents.length === 0 && (
        <p className="text-foreground/50 bg-card border border-border rounded-xl p-8 text-center">
          記事は準備中です。
        </p>
      )}

      {/* 関連ツール・ハブ */}
      <section
        aria-labelledby="related-tools-heading"
        className="bg-card rounded-2xl border-2 border-border p-6 sm:p-8"
      >
        <header className="mb-5 text-center">
          <h2
            id="related-tools-heading"
            className="text-lg sm:text-xl font-bold text-foreground"
          >
            あわせて使える無料ツール・ガイド
          </h2>
          <p className="text-sm text-foreground/65 mt-2">
            記事と一緒に活用すると、より具体的な行動に移せます。
          </p>
        </header>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <li>
            <Link
              href="/cost"
              className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 border-border hover:border-primary/40 hover:bg-primary-light/20 transition text-center"
            >
              <span className="text-3xl" aria-hidden="true">💰</span>
              <span className="font-bold text-sm text-foreground">
                費用相場
              </span>
              <span className="text-xs text-foreground/60">
                間取り別の料金目安
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/checklist"
              className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 border-border hover:border-primary/40 hover:bg-primary-light/20 transition text-center"
            >
              <span className="text-3xl" aria-hidden="true">📝</span>
              <span className="font-bold text-sm text-foreground">
                チェックリスト
              </span>
              <span className="text-xs text-foreground/60">
                生前整理のやることリスト
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/articles/master-guide"
              className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 border-border hover:border-primary/40 hover:bg-primary-light/20 transition text-center"
            >
              <span className="text-3xl" aria-hidden="true">📖</span>
              <span className="font-bold text-sm text-foreground">
                進め方ガイド
              </span>
              <span className="text-xs text-foreground/60">
                実家じまいの全手順
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/tools/jikka-diagnosis"
              className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 border-primary bg-primary-light/30 hover:bg-primary hover:text-white transition text-center"
            >
              <span className="text-3xl" aria-hidden="true">🔎</span>
              <span className="font-bold text-sm">
                実家じまい力診断
              </span>
              <span className="text-xs opacity-80">
                3分で必要な対策がわかる
              </span>
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
