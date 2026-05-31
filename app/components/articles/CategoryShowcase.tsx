import Link from "next/link";
import Image from "next/image";
import { ARTICLE_CATEGORIES } from "../../lib/article-categories";
import type { MicroCmsCategory, MicroCmsBlogPost } from "../../lib/microcms-types";

interface Props {
  categories: MicroCmsCategory[];
  articlesByCategory: Map<string, MicroCmsBlogPost[]>;
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

const CATEGORY_DESCRIPTION_MAP: Record<string, string> = {
  guide: "実家じまい・生前整理の進め方・家族会議",
  cleanup: "モノの仕分け・処分・買取・お焚き上げ",
  inheritance: "相続手続き・口座凍結・税金・補助金",
  "real-estate": "空き家管理・売却・解体・固定資産税",
  digital: "スマホ・パスワード・サブスク解約",
  mental: "心の整理・介護・終活・供養",
  shukatsu: "自分の終活・エンディングノート・葬儀",
};

/**
 * カテゴリショーケース v2
 *
 * v1欠点修正：
 * - 代表記事3本を「点表示」→「サムネ付き」に変更（視認性UP）
 * - カード高さを揃える
 * - 「もっと見る」ボタン大型化
 */
export default function CategoryShowcase({ categories, articlesByCategory }: Props) {
  const orderedCategories = ARTICLE_CATEGORIES.map((ac) =>
    categories.find((c) => c.id === ac.slug)
  ).filter((c): c is MicroCmsCategory => Boolean(c));
  for (const c of categories) {
    if (!orderedCategories.find((oc) => oc.id === c.id)) {
      orderedCategories.push(c);
    }
  }

  return (
    <section aria-labelledby="category-showcase-heading">
      <header className="mb-6 sm:mb-8 text-center">
        <h2
          id="category-showcase-heading"
          className="text-2xl sm:text-3xl font-bold text-foreground"
        >
          テーマで深掘りする
        </h2>
        <p className="text-sm sm:text-base text-foreground/70 mt-2">
          6つのテーマで、必要な記事をまとめてご覧いただけます。
        </p>
      </header>

      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {orderedCategories.map((cat) => {
          const articles = articlesByCategory.get(cat.id) ?? [];
          const icon = CATEGORY_ICON_MAP[cat.id] ?? "📄";
          const desc = CATEGORY_DESCRIPTION_MAP[cat.id] ?? "";
          return (
            <li key={cat.id}>
              <article className="bg-card border border-border rounded-2xl p-5 sm:p-6 h-full flex flex-col hover:border-primary/40 hover:shadow-md transition-all">
                {/* カテゴリヘッダー */}
                <Link
                  href={`/articles/category/${cat.id}`}
                  className="group block mb-4 pb-4 border-b border-border"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl select-none" aria-hidden="true">
                      {icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-primary group-hover:underline leading-tight">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-foreground/55 mt-0.5">
                        {articles.length}本の記事
                      </p>
                    </div>
                  </div>
                  {desc && (
                    <p className="text-sm text-foreground/65 leading-relaxed">
                      {desc}
                    </p>
                  )}
                </Link>

                {/* 代表記事3本（サムネ付き） */}
                {articles.length > 0 ? (
                  <ul className="space-y-3 mb-5 flex-1">
                    {articles.slice(0, 3).map((a) => (
                      <li key={a.id}>
                        <Link
                          href={`/articles/${a.id}`}
                          className="flex gap-3 group/article hover:bg-primary-light/20 -mx-2 px-2 py-2 rounded-lg transition"
                        >
                          {a.thumbnail?.url ? (
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-border shrink-0">
                              <Image
                                src={a.thumbnail.url}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-primary-light/40 shrink-0 flex items-center justify-center text-2xl">
                              📄
                            </div>
                          )}
                          <p className="text-sm font-medium text-foreground/85 group-hover/article:text-primary line-clamp-3 leading-snug flex-1">
                            {a.title}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-foreground/50 mb-5 flex-1">
                    記事を準備中です
                  </p>
                )}

                {/* もっと見る */}
                <Link
                  href={`/articles/category/${cat.id}`}
                  className="mt-auto inline-flex items-center justify-center w-full py-3 px-4 rounded-xl bg-primary-light/40 hover:bg-primary hover:text-white border-2 border-primary/20 hover:border-primary text-sm font-bold text-primary transition"
                >
                  {cat.name}をすべて見る →
                </Link>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
