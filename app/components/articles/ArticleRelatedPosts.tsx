import Link from "next/link";
import Image from "next/image";
import type { MicroCmsBlogPost } from "../../lib/microcms-types";

interface Props {
  /** 現在の記事ID（除外用） */
  currentId: string;
  /** 現在の記事のカテゴリID（同カテゴリ優先） */
  currentCategoryId?: string;
  /** 現在の記事のタグID配列（同タグ優先） */
  currentTagIds?: string[];
  /** 候補記事プール（取得済み配列） */
  candidates: MicroCmsBlogPost[];
}

/**
 * 関連記事3本セレクションロジック：
 * 1. 同カテゴリ × 同タグ含むものを最優先
 * 2. 同カテゴリのみ
 * 3. 同タグのみ
 * 4. 残りから最新順
 *
 * 結果：常に3本（候補不足時は2本以下）
 *
 * 「回遊率3倍化」プロジェクトの一環として、すべての記事ページ末尾に固定表示。
 * 既存の `/articles` 一覧への単一導線では離脱率が高いという課題への直接対策。
 */
export default function ArticleRelatedPosts({
  currentId,
  currentCategoryId,
  currentTagIds = [],
  candidates,
}: Props) {
  const tagSet = new Set(currentTagIds);
  const pool = candidates.filter((p) => p.id !== currentId);

  const scored = pool.map((p) => {
    let score = 0;
    if (currentCategoryId && p.category?.id === currentCategoryId) score += 10;
    const pTagIds = (p.tags ?? []).map((t) => t.id);
    const tagMatches = pTagIds.filter((id) => tagSet.has(id)).length;
    score += tagMatches * 5;
    // 公開日が新しいほど微加点（同点時の解決用）
    const ts = p.publishedAt ? new Date(p.publishedAt).getTime() : 0;
    score += ts / 1e15; // very small tie-breaker
    return { post: p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const picks = scored.slice(0, 3).map((s) => s.post);

  if (picks.length === 0) return null;

  return (
    <section
      aria-labelledby="related-posts-heading"
      className="mt-10 pt-8 border-t-2 border-primary/20"
    >
      <header className="mb-5 sm:mb-6 flex items-end justify-between gap-4">
        <h2
          id="related-posts-heading"
          className="text-xl sm:text-2xl font-bold text-foreground"
        >
          次に読みたい関連記事
        </h2>
        <Link
          href="/articles"
          className="text-sm text-primary hover:underline whitespace-nowrap"
        >
          記事一覧 →
        </Link>
      </header>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {picks.map((p) => (
          <li key={p.id}>
            <Link
              href={`/articles/${p.id}`}
              className="group block h-full bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-md transition-all"
            >
              {p.thumbnail?.url ? (
                <div className="relative aspect-video bg-border">
                  <Image
                    src={p.thumbnail.url}
                    alt=""
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-primary-light/30 flex items-center justify-center text-3xl">
                  📄
                </div>
              )}
              <div className="p-4">
                {p.category?.name && (
                  <p className="text-xs font-bold text-primary mb-1">
                    {p.category.name}
                  </p>
                )}
                <p className="text-sm sm:text-base font-bold text-foreground/90 leading-snug line-clamp-3 group-hover:text-primary transition">
                  {p.title}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
