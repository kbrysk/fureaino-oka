import Link from "next/link";
import { getArticlesIndex } from "../lib/articles";
import { ARTICLE_CATEGORIES } from "../lib/article-categories";
import { ARTICLE_TAGS } from "../lib/article-tags";
import { pageTitle } from "../lib/site-brand";

export const metadata = {
  title: pageTitle("記事一覧"),
  description:
    "生前整理・実家の片付け・終活に関する記事。進め方、処分、資産、デジタル遺品まで。",
};

export default function ArticlesPage() {
  const articles = getArticlesIndex();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">記事一覧</h1>
        <p className="text-foreground/60 mt-1">
          生前整理の進め方やお悩みに役立つコラムです。
        </p>
      </div>

      {/* カテゴリ（縦軸）ナビ：6カテゴリでディレクトリ分け */}
      <section className="bg-card rounded-2xl border border-border p-4 sm:p-6">
        <h2 className="text-sm font-bold text-foreground/70 mb-3">カテゴリから探す</h2>
        <ul className="flex flex-wrap gap-2">
          {ARTICLE_CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/articles/category/${c.slug}`}
                className="inline-block px-4 py-2 rounded-xl bg-primary-light/20 border border-primary/20 hover:bg-primary hover:text-white hover:border-primary transition text-sm font-medium text-foreground/90"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 状況に近いものは？（横軸タグ） */}
      <section className="bg-primary-light/20 rounded-2xl border border-primary/20 p-4 sm:p-6">
        <h2 className="text-sm font-bold text-primary mb-2">今のあなたの状況に近いものは？</h2>
        <p className="text-xs text-foreground/60 mb-3">
          ボタンを押すと、その状況に合った記事まとめページへ移動します。
        </p>
        <ul className="flex flex-wrap gap-2">
          {ARTICLE_TAGS.map((tag) => (
            <li key={tag.slug}>
              <Link
                href={`/articles/tag/${tag.slug}`}
                className="inline-block px-4 py-2.5 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary-light/30 transition text-sm font-medium text-foreground/90"
              >
                {tag.shortLabel ?? tag.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ul className="grid gap-6 md:grid-cols-2">
        {articles.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/articles/${a.slug}`}
              className="block bg-card rounded-xl p-6 border border-border hover:shadow-md hover:border-primary/30 transition"
            >
              <span className="text-xs text-foreground/50">{a.category}</span>
              <h2 className="font-bold text-lg mt-1 text-primary">{a.title}</h2>
              <p className="text-sm text-foreground/60 mt-2 line-clamp-2">
                {a.description}
              </p>
              <time className="text-xs text-foreground/40 mt-2 block" dateTime={a.date}>
                {a.date}
              </time>
            </Link>
          </li>
        ))}
      </ul>
      {articles.length === 0 && (
        <p className="text-foreground/50">記事は準備中です。</p>
      )}

      {/* トピッククラスター：費用・捨て方・はじめかた・診断への送客 */}
      <section className="bg-card rounded-2xl border border-border p-6">
        <h2 className="font-bold text-primary mb-3">あわせて役立つコンテンツ</h2>
        <p className="text-sm text-foreground/70 mb-4">
          間取り別の費用相場、品目別の捨て方、進め方の全体像、無料診断ができます。
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <li>
            <Link
              href="/cost"
              className="block py-3 px-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary-light/30 transition font-medium text-foreground/90 text-sm"
            >
              間取り別 遺品整理費用相場
            </Link>
          </li>
          <li>
            <Link
              href="/dispose"
              className="block py-3 px-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary-light/30 transition font-medium text-foreground/90 text-sm"
            >
              捨て方辞典（品目別）
            </Link>
          </li>
          <li>
            <Link
              href="/guide"
              className="block py-3 px-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary-light/30 transition font-medium text-foreground/90 text-sm"
            >
              実家じまいの進め方 全手順
            </Link>
          </li>
          <li>
            <Link
              href="/tools/jikka-diagnosis"
              className="block py-3 px-4 rounded-xl border-2 border-primary bg-primary-light/30 hover:bg-primary hover:text-white transition font-medium text-primary text-sm"
            >
              実家じまい力診断（3分）
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
