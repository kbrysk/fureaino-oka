import Link from "next/link";
import Image from "next/image";
import type { MicroCmsBlogPost } from "../../lib/microcms-types";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface ArticleCardMicroCmsProps {
  post: MicroCmsBlogPost;
}

export default function ArticleCardMicroCms({ post }: ArticleCardMicroCmsProps) {
  const href = `/articles/${post.id}`;
  const thumb = post.thumbnail?.url;
  const dateStr = post.publishedAt
    ? format(new Date(post.publishedAt), "yyyy.MM.dd", { locale: ja })
    : "";

  return (
    <li>
      <Link
        href={href}
        className="block bg-card rounded-xl p-6 border border-border hover:shadow-md hover:border-primary/30 transition"
      >
        {thumb ? (
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-border mb-4">
            <Image
              src={thumb}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ) : null}
        <span className="text-xs text-foreground/50">{post.category?.name ?? ""}</span>
        <h2 className="font-bold text-lg mt-1 text-primary line-clamp-2">{post.title}</h2>
        {post.description ? (
          <p className="text-sm text-foreground/60 mt-2 line-clamp-2">{post.description}</p>
        ) : null}
        {dateStr ? (
          <time className="text-xs text-foreground/40 mt-2 block" dateTime={post.publishedAt}>
            {dateStr}
          </time>
        ) : null}
      </Link>
    </li>
  );
}
