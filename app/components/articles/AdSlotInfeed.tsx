/**
 * インフィード広告用プレースホルダー（AdSense 審査・本番用枠）
 * 一覧の 3 番目・7 番目などに配置し、自然な形で広告を挿入できるようにする
 */
export default function AdSlotInfeed() {
  return (
    <div
      className="rounded-2xl border border-border bg-primary-light/30 p-8 flex items-center justify-center min-h-[120px]"
      role="presentation"
      aria-hidden
    >
      <span className="text-sm text-foreground/40">Ad</span>
    </div>
  );
}
