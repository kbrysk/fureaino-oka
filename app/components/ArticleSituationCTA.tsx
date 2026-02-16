import Link from "next/link";
import { ARTICLE_TAGS } from "../lib/article-tags";

/**
 * 記事詳細の「回遊パーツ」: 今のあなたの状況に近いものは？（タグ選択）＋ 診断ツール
 * PDF改善提案: 記事読み終わりユーザーを逃がさず、状況別タグページ or 診断へ誘導
 */
export default function ArticleSituationCTA() {
  const displayTags = ARTICLE_TAGS.slice(0, 8);

  return (
    <section className="bg-card rounded-2xl border border-border p-6 sm:p-8">
      <h2 className="font-bold text-primary mb-2">今のあなたの状況に近いものは？</h2>
      <p className="text-sm text-foreground/60 mb-4">
        気になるボタンを押すと、その状況に合った記事まとめページへ移動できます。
      </p>
      <ul className="flex flex-wrap gap-3 mb-6">
        {displayTags.map((tag) => (
          <li key={tag.slug}>
            <Link
              href={`/articles/tag/${tag.slug}`}
              className="inline-block px-4 py-2.5 rounded-xl bg-primary-light/30 border border-primary/20 hover:bg-primary hover:text-white hover:border-primary transition font-medium text-sm text-foreground/90"
            >
              {tag.shortLabel ?? tag.name}
            </Link>
          </li>
        ))}
      </ul>
      <p className="text-sm font-bold text-foreground/80 mb-2">または、リスクを数字で確認する</p>
      <Link
        href="/tools/jikka-diagnosis"
        className="inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition"
      >
        実家じまい力診断（無料・3分）
      </Link>
    </section>
  );
}
