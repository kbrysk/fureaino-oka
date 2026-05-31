import Link from "next/link";
import { ARTICLE_CATEGORIES } from "../../lib/article-categories";
import type { MicroCmsCategory, MicroCmsBlogPost } from "../../lib/microcms-types";

interface Props {
  /** microCMS から取得した実カテゴリ */
  categories: MicroCmsCategory[];
  /** カテゴリ別の代表記事マップ（カテゴリslug -> 上位N記事） */
  articlesByCategory: Map<string, MicroCmsBlogPost[]>;
}

/**
 * カテゴリ別ショーケース（記事一覧の2階層目）
 *
 * シナリオで「自分の状況」を見つけられなかったユーザー向けに、
 * 6カテゴリ × 代表記事3本 でテーマ別の入口を提供する。
 *
 * UI/UX設計：
 * - 各カテゴリパネル：カテゴリ名 + 説明 + 代表記事3本 + 「もっと見る」
 * - モバイル: 1列、タブレット: 2列、デスクトップ: 3列
 * - アイコン (絵文字) でカテゴリを視認しやすく
 */

const CATEGORY_ICON_MAP: Record<string, string> = {
  guide: "🧭",
  cleanup: "🧹",
  inheritance: "📜",
  "real-estate": "🏘️",
  digital: "💻",
  mental: "💝",
  shukatsu: "🌸",
};

const CATEGORY_DESCRIPTION_MAP: Record<string, string> = {
  guide: "実家じまいや生前整理の進め方・親への切り出し方・家族会議",
  cleanup: "モノの仕分け・処分・買取・お焚き上げ・業者選び",
  inheritance: "相続手続き・口座凍結・税金・補助金などお金まわり",
  "real-estate": "空き家管理・売却・解体・固定資産税・住み替え",
  digital: "スマホ・パスワード・サブスク解約などデジタル遺品",
  mental: "心の整理・介護・終活・供養・家族との対話",
  shukatsu: "自分の終活・エンディングノート・葬儀・お墓・お焚き上げ",
};

export default function CategoryShowcase({ categories, articlesByCategory }: Props) {
  // 表示順をARTICLE_CATEGORIES（編集者推奨順）に揃える
  const orderedCategories = ARTICLE_CATEGORIES.map((ac) =>
    categories.find((c) => c.id === ac.slug)
  ).filter((c): c is MicroCmsCategory => Boolean(c));
  // 既知の編集者順序に含まれない microCMS カテゴリも末尾に
  for (const c of categories) {
    if (!orderedCategories.find((oc) => oc.id === c.id)) {
      orderedCategories.push(c);
    }
  }

  return (
    <section aria-labelledby="category-showcase-heading">
      <header className="mb-5 sm:mb-7">
        <p className="text-xs font-bold text-primary tracking-wider uppercase mb-2">
          STEP 2：テーマで深掘り
        </p>
        <h2
          id="category-showcase-heading"
          className="text-xl sm:text-2xl font-bold text-foreground"
        >
          知りたいテーマから探す
        </h2>
        <p className="text-sm text-foreground/70 mt-2">
          6つのテーマで、必要な記事をまとめてご覧いただけます。
        </p>
      </header>

      <ul className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
        {orderedCategories.map((cat) => {
          const articles = articlesByCategory.get(cat.id) ?? [];
          const icon = CATEGORY_ICON_MAP[cat.id] ?? "📄";
          const desc = CATEGORY_DESCRIPTION_MAP[cat.id] ?? "";
          return (
            <li key={cat.id}>
              <article className="bg-card border border-border rounded-2xl p-5 h-full flex flex-col hover:border-primary/40 hover:shadow-md transition-all">
                {/* カテゴリヘッダー */}
                <Link
                  href={`/articles/category/${cat.id}`}
                  className="group block mb-4"
                  aria-label={`${cat.name}カテゴリの全記事を見る`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className="text-2xl select-none"
                      aria-hidden="true"
                    >
                      {icon}
                    </span>
                    <h3 className="text-lg font-bold text-primary group-hover:underline">
                      {cat.name}
                    </h3>
                  </div>
                  {desc && (
                    <p className="text-xs text-foreground/60 leading-relaxed">
                      {desc}
                    </p>
                  )}
                </Link>

                {/* このカテゴリの代表記事3本 */}
                {articles.length > 0 ? (
                  <ul className="space-y-2 mb-3 flex-1">
                    {articles.slice(0, 3).map((a) => (
                      <li key={a.id}>
                        <Link
                          href={`/articles/${a.id}`}
                          className="block py-2 px-3 rounded-lg hover:bg-primary-light/30 transition text-sm text-foreground/80 hover:text-primary leading-snug line-clamp-2"
                        >
                          <span className="inline-block w-1.5 h-1.5 bg-primary/40 rounded-full mr-2 align-middle" />
                          {a.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-foreground/50 mb-3 flex-1">
                    記事を準備中です
                  </p>
                )}

                {/* もっと見るボタン */}
                <Link
                  href={`/articles/category/${cat.id}`}
                  className="mt-auto inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-primary-light/40 hover:bg-primary hover:text-white border border-primary/20 hover:border-primary text-sm font-bold text-primary transition"
                >
                  {cat.name}の記事をすべて見る →
                </Link>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
