import Link from "next/link";

export type TocItem = {
  id: string;
  label: string;
};

export type TableOfContentsProps = {
  items: TocItem[];
};

/**
 * ページ内目次。アンカーリンクで各セクションへスクロール。
 * スマホ2列・PC3〜4列のflex、背景は薄いグレー。
 */
export function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="このページの目次"
      className="rounded-2xl border border-border bg-gray-50/90 dark:bg-gray-900/30 p-4 sm:p-5"
    >
      <p className="text-sm font-bold text-foreground/80 mb-3">このページの内容</p>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 sm:gap-y-2.5 list-none p-0 m-0">
        {items.map((item) => (
          <li key={item.id} className="min-w-0">
            <Link
              href={`#${item.id}`}
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
            >
              <span aria-hidden className="text-primary/70 shrink-0">▶</span>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
