
interface InheritanceRoutingProps {
  prefName: string;
  cityName: string;
}

const OFFICIAL_LINKS = [
  {
    title: "不動産の相続登記・名義変更",
    href: "https://houmukyoku.moj.go.jp/homu/static/kankatsu_index.html",
    label: "法務局 管轄案内",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: "相続税の申告・各種相談",
    href: "https://www.nta.go.jp/about/organization/access/map.htm",
    label: "国税庁 税務署検索",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "未支給年金の請求・手続き",
    href: "https://www.nenkin.go.jp/section/soudan/",
    label: "日本年金機構 全国の窓口",
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
] as const;

/**
 * 相続・名義変更等の公的窓口（.go.jp）への安全な発リンク。誘導ページリスクを避けE-E-A-Tを担保。
 */
export default function InheritanceRouting({ prefName, cityName }: InheritanceRoutingProps) {
  return (
    <section
      className="bg-card rounded-2xl border border-border overflow-hidden"
      aria-labelledby="inheritance-routing-heading"
    >
      <div className="px-5 py-4 border-b border-border bg-primary-light/30">
        <h2 id="inheritance-routing-heading" className="font-bold text-primary text-base">
          {prefName}{cityName}の実家じまいに必要な公的窓口（相続・名義変更）
        </h2>
      </div>
      <div className="p-5 space-y-3">
        {OFFICIAL_LINKS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/30 hover:bg-primary-light/20 hover:border-primary/30 transition"
          >
            <span className="text-primary">{item.icon}</span>
            <div className="min-w-0">
              <span className="font-medium text-foreground block">{item.title}</span>
              <span className="text-xs text-foreground/60">{item.label}</span>
            </div>
            <span className="shrink-0 text-primary" aria-hidden>→</span>
          </a>
        ))}
        <p className="text-xs text-foreground/60 pt-2 border-t border-border/60">
          ※{cityName}を管轄する正確な窓口の所在地や連絡先は、上記の各省庁・公式ページより検索してご確認ください。
        </p>
      </div>
    </section>
  );
}
