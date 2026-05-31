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

export const revalidate = 600;

/**
 * 編集者が明示的に選定した「いま読んでおきたい」3記事のslug。
 * v1の「最新記事の自動表示」は嘘の編集セレクションになるため廃止。
 */
const EDITORS_PICK_SLUGS = [
  "oya-nakunattara-tetsuzuki-junban", // 親が亡くなったら（最重要シナリオ代表）
  "seizenseiri-hub",                  // 生前整理とは何か（ハブ）
  "oyakoko-imadekiru-koto",           // 親孝行で今できること（情緒）
];

const TAG_ICON_MAP: Record<string, string> = {
  "long-distance": "🚄",
  "save-money": "💰",
  "no-time": "⏰",
  "parent-stubborn": "👴",
  "family-conflict": "👥",
  "gomi-yashiki": "📦",
  "akiya-long": "🏚️",
  "digital-worry": "💻",
  "inheritance-deadline": "📅",
  "guilt-cannot-throw": "💝",
  "hajimete": "🌱",
  "sudden-death": "🕊️",
  "sosenkuyo": "🙏",
};

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

  const articlesByCategory = groupByCategory(contents);
  const postsById = new Map(contents.map((p) => [p.id, p]));
  const editorsPick = EDITORS_PICK_SLUGS
    .map((id) => postsById.get(id))
    .filter((p): p is MicroCmsBlogPost => Boolean(p));
  const recentPosts = contents.slice(0, 8);

  // タグ別の記事数を集計
  const tagArticleCount = new Map<string, number>();
  for (const p of contents) {
    for (const t of p.tags ?? []) {
      tagArticleCount.set(t.id, (tagArticleCount.get(t.id) ?? 0) + 1);
    }
  }

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* パンくず */}
      <nav className="text-xs text-foreground/60" aria-label="パンくず">
        <Link href="/" className="hover:text-primary hover:underline">
          ホーム
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground/80">記事一覧</span>
      </nav>

      {/* ─────────────────────────────────────
          【ヒーロー】1画面1テーマ：シナリオ選択に集中
          ───────────────────────────────────── */}
      <section className="space-y-8">
        <header>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
            記事一覧
          </h1>
          <p className="text-sm sm:text-base text-foreground/65 mt-3 max-w-2xl">
            生前整理・実家じまい・遺品整理・終活に関する{contents.length}本の記事を、
            あなたの状況に合わせてお届けします。
          </p>
        </header>

        {/* シナリオナビ（主役） */}
        <SituationNavigator />

        {/* 検索バー：シナリオの下に「または検索で探す」として配置 */}
        <div className="max-w-2xl mx-auto pt-2">
          <p className="text-center text-sm text-foreground/55 mb-3">
            ─── または、キーワードで探す ───
          </p>
          <ArticleSearchBar posts={contents} />
        </div>
      </section>

      {/* ─────────────────────────────────────
          【セクション2】編集者が選ぶ「いま読んでおきたい」3本
          ───────────────────────────────────── */}
      {editorsPick.length > 0 && (
        <section aria-labelledby="editors-pick-heading">
          <header className="mb-6 sm:mb-8 text-center">
            <p className="text-xs font-bold text-primary tracking-widest uppercase mb-2">
              EDITOR'S PICK
            </p>
            <h2
              id="editors-pick-heading"
              className="text-2xl sm:text-3xl font-bold text-foreground"
            >
              編集部が選ぶ、いま読んでおきたい記事
            </h2>
            <p className="text-sm text-foreground/65 mt-2 max-w-xl mx-auto">
              生前整理アドバイザー2級の運営がまず読んでいただきたい3本を厳選しました。
            </p>
          </header>
          {/* 1本目を大型、残り2本を中サイズに */}
          {editorsPick.length === 1 ? (
            <ArticleCardEnhanced post={editorsPick[0]} variant="hero" />
          ) : (
            <div className="grid gap-5 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ArticleCardEnhanced post={editorsPick[0]} variant="hero" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                {editorsPick.slice(1, 3).map((p) => (
                  <ArticleCardEnhanced key={p.id} post={p} variant="default" />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ─────────────────────────────────────
          【セクション3】カテゴリ別ショーケース（6テーマ）
          ───────────────────────────────────── */}
      <CategoryShowcase
        categories={categories}
        articlesByCategory={articlesByCategory}
      />

      {/* ─────────────────────────────────────
          【セクション4】お悩みタグ（チップ+アイコン+件数）
          ───────────────────────────────────── */}
      {tags.length > 0 && (
        <section aria-labelledby="situation-tags-heading">
          <header className="mb-6 sm:mb-8 text-center">
            <h2
              id="situation-tags-heading"
              className="text-2xl sm:text-3xl font-bold text-foreground"
            >
              お悩みから探す
            </h2>
            <p className="text-sm text-foreground/65 mt-2">
              今のあなたの状況に近いタグから、関連記事へ。
            </p>
          </header>
          <ul className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {tags.map((tag) => {
              const def = ARTICLE_TAGS.find((t) => t.slug === tag.id);
              const label = def?.shortLabel ?? tag.name;
              const icon = TAG_ICON_MAP[tag.id] ?? "🏷️";
              const count = tagArticleCount.get(tag.id) ?? 0;
              return (
                <li key={tag.id}>
                  <Link
                    href={`/articles/tag/${tag.id}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border-2 border-border hover:border-primary hover:shadow-md hover:bg-primary-light/20 transition-all min-h-[64px]"
                  >
                    <span className="text-2xl shrink-0" aria-hidden="true">
                      {icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground leading-tight">
                        {label}
                      </p>
                      <p className="text-xs text-foreground/55 mt-0.5">
                        {count}本の記事
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* ─────────────────────────────────────
          【セクション5】CTA：診断ツール（ストロングCTA）
          ───────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary-light/40 via-card to-primary-light/40 border-2 border-primary/20 rounded-3xl p-6 sm:p-10 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          自分の状況を3分でチェックしませんか？
        </h2>
        <p className="text-sm sm:text-base text-foreground/70 mt-3 mb-6 max-w-xl mx-auto">
          無料の診断ツールで、あなたに合う進め方と必要な記事をご提案します。
        </p>
        <Link
          href="/tools/jikka-diagnosis"
          className="inline-flex items-center gap-2 px-7 py-4 bg-primary text-white rounded-full font-bold text-base sm:text-lg hover:bg-primary/90 hover:shadow-xl transition shadow-md min-h-[56px]"
        >
          🔎 実家じまい力診断（無料・3分）
        </Link>
      </section>

      {/* ─────────────────────────────────────
          【セクション6】新着記事
          ───────────────────────────────────── */}
      <section aria-labelledby="latest-heading">
        <header className="mb-6 sm:mb-8 flex items-end justify-between">
          <div>
            <h2
              id="latest-heading"
              className="text-2xl sm:text-3xl font-bold text-foreground"
            >
              新着の記事
            </h2>
            <p className="text-sm text-foreground/65 mt-2">
              最新の{Math.min(recentPosts.length, 8)}本をお届けします
            </p>
          </div>
        </header>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recentPosts.map((post) => (
            <li key={post.id}>
              <ArticleCardEnhanced post={post} variant="default" />
            </li>
          ))}
        </ul>
      </section>

      {/* ─────────────────────────────────────
          【セクション7】全記事一覧（compact）
          ───────────────────────────────────── */}
      {contents.length > 8 && (
        <section aria-labelledby="all-articles-heading">
          <header className="mb-6 sm:mb-8">
            <h2
              id="all-articles-heading"
              className="text-2xl sm:text-3xl font-bold text-foreground"
            >
              すべての記事（{contents.length}本）
            </h2>
            <p className="text-sm text-foreground/65 mt-2">
              更新日が新しい順に並んでいます。
            </p>
          </header>
          <ul className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contents.slice(8).map((post) => (
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

      {/* ─────────────────────────────────────
          【セクション8】あわせて使える無料ツール
          ───────────────────────────────────── */}
      <section
        aria-labelledby="related-tools-heading"
        className="bg-card rounded-3xl border-2 border-border p-6 sm:p-10"
      >
        <header className="mb-6 sm:mb-8 text-center">
          <h2
            id="related-tools-heading"
            className="text-2xl sm:text-3xl font-bold text-foreground"
          >
            あわせて使える無料ツール
          </h2>
          <p className="text-sm text-foreground/65 mt-2">
            記事と一緒に活用すると、より具体的な行動に移せます。
          </p>
        </header>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ToolCard
            href="/cost"
            icon="💰"
            title="費用相場"
            desc="間取り別の料金目安"
          />
          <ToolCard
            href="/checklist"
            icon="📝"
            title="チェックリスト"
            desc="生前整理のやることリスト"
          />
          <ToolCard
            href="/articles/master-guide"
            icon="📖"
            title="進め方ガイド"
            desc="実家じまいの全手順"
          />
          <ToolCard
            href="/tools/jikka-diagnosis"
            icon="🔎"
            title="実家じまい力診断"
            desc="3分で必要な対策がわかる"
            primary
          />
        </ul>
      </section>
    </div>
  );
}

function ToolCard({
  href,
  icon,
  title,
  desc,
  primary,
}: {
  href: string;
  icon: string;
  title: string;
  desc: string;
  primary?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={`flex flex-col items-center gap-2 py-5 px-4 rounded-2xl border-2 transition text-center min-h-[140px] justify-center ${
          primary
            ? "border-primary bg-primary-light/30 hover:bg-primary hover:text-white"
            : "border-border hover:border-primary/40 hover:bg-primary-light/20"
        }`}
      >
        <span className="text-4xl" aria-hidden="true">
          {icon}
        </span>
        <span className={`font-bold text-base ${primary ? "" : "text-foreground"}`}>
          {title}
        </span>
        <span className={`text-xs ${primary ? "opacity-80" : "text-foreground/60"}`}>
          {desc}
        </span>
      </Link>
    </li>
  );
}
