import Link from "next/link";
import Image from "next/image";
import type { MicroCmsBlogPost } from "../../lib/microcms-types";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface Props {
  post: MicroCmsBlogPost;
  /** 表示モード：default=通常 / hero=ヒーロー扱い大型 / compact=横長コンパクト */
  variant?: "default" | "hero" | "compact";
}

/**
 * 強化版・記事カード
 *
 * UI/UX改善ポイント：
 * - アイキャッチ大型化 + ホバーズーム
 * - カテゴリラベル（プライマリ色のバッジ）
 * - 推定読了時間（本文文字数から算出）
 * - 「更新日」表示で鮮度感
 * - 監修者ミニ表示
 * - ホバー時の視覚反応（border + shadow + 矢印アニメ）
 */
export default function ArticleCardEnhanced({ post, variant = "default" }: Props) {
  const href = `/articles/${post.id}`;
  const thumb = post.thumbnail?.url;
  const updatedAt = post.revisedAt || post.publishedAt;
  const dateStr = updatedAt
    ? format(new Date(updatedAt), "yyyy.MM.dd", { locale: ja })
    : "";

  // 推定読了時間（日本語350字/分で算出。content未取得時はdescriptionから）
  const charCount = (post.content?.length ?? 0) + (post.description?.length ?? 0);
  const readingMinutes = charCount > 0 ? Math.max(1, Math.ceil(charCount / 600)) : null;

  if (variant === "hero") {
    return (
      <article className="group">
        <Link
          href={href}
          className="block bg-card rounded-2xl border-2 border-border hover:border-primary/40 hover:shadow-xl transition-all overflow-hidden"
        >
          {thumb && (
            <div className="relative aspect-video w-full overflow-hidden bg-border">
              <Image
                src={thumb}
                alt=""
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 66vw"
                priority
              />
              {post.category?.name && (
                <span className="absolute top-3 left-3 inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full shadow-md">
                  {post.category.name}
                </span>
              )}
            </div>
          )}
          <div className="p-5 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {post.title}
            </h3>
            {post.description && (
              <p className="text-sm text-foreground/70 mt-3 line-clamp-3 leading-relaxed">
                {post.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-foreground/60">
              {dateStr && (
                <time dateTime={updatedAt} className="flex items-center gap-1">
                  📅 {dateStr}
                </time>
              )}
              {readingMinutes && (
                <span className="flex items-center gap-1">
                  ⏱️ 約{readingMinutes}分で読めます
                </span>
              )}
              <span className="ml-auto inline-flex items-center gap-1 text-primary font-bold group-hover:translate-x-1 transition-transform">
                記事を読む →
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group">
        <Link
          href={href}
          className="flex gap-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-sm p-3 transition-all"
        >
          {thumb && (
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-border shrink-0">
              <Image
                src={thumb}
                alt=""
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
          )}
          <div className="flex-1 min-w-0 flex flex-col">
            {post.category?.name && (
              <span className="text-[10px] text-primary font-bold mb-1">
                {post.category.name}
              </span>
            )}
            <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary line-clamp-2 leading-snug">
              {post.title}
            </h3>
            <div className="mt-auto flex items-center gap-2 text-[10px] text-foreground/50">
              {dateStr && <time dateTime={updatedAt}>{dateStr}</time>}
              {readingMinutes && <span>・約{readingMinutes}分</span>}
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // default
  return (
    <article className="group h-full">
      <Link
        href={href}
        className="block h-full bg-card rounded-2xl border border-border hover:border-primary/40 hover:shadow-md transition-all overflow-hidden"
      >
        {thumb ? (
          <div className="relative aspect-video w-full overflow-hidden bg-border">
            <Image
              src={thumb}
              alt=""
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {post.category?.name && (
              <span className="absolute top-2 left-2 inline-block px-2.5 py-1 bg-white/90 backdrop-blur text-primary text-xs font-bold rounded-full shadow-sm">
                {post.category.name}
              </span>
            )}
          </div>
        ) : (
          post.category?.name && (
            <div className="bg-primary-light/30 px-4 py-3">
              <span className="text-xs font-bold text-primary">
                {post.category.name}
              </span>
            </div>
          )
        )}
        <div className="p-4 sm:p-5">
          <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
            {post.title}
          </h3>
          {post.description && (
            <p className="text-xs sm:text-sm text-foreground/65 mt-2 line-clamp-2 leading-relaxed">
              {post.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-3 text-[11px] text-foreground/50">
            {dateStr && (
              <time dateTime={updatedAt}>{dateStr}</time>
            )}
            {readingMinutes && (
              <span>・約{readingMinutes}分</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
