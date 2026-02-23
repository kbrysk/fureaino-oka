/**
 * 記事内広告用プレースホルダー（h2 直前に挿入する AdSense 枠）
 */
export default function AdSlotInArticle() {
  return (
    <div
      className="my-6 rounded-xl border border-border bg-foreground/[0.03] py-6 flex items-center justify-center min-h-[90px]"
      role="presentation"
      aria-hidden
    >
      <span className="text-xs text-foreground/30">Ad</span>
    </div>
  );
}
