"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface AreaLocalNavProps {
  prefectureId: string;
  cityId: string;
}

const TABS: { href: string; label: string }[] = [
  { href: "", label: "🏠 総合トップ" },
  { href: "/subsidy", label: "💰 補助金を探す" },
  { href: "/garbage", label: "🗑️ 粗大ゴミ・遺品整理" },
  { href: "/cost", label: "📊 費用相場を見る" },
];

/**
 * 地域Hub/Spoke用の追従型ローカルナビ。usePathname で現在地を判定しアクティブを反転。
 */
export default function AreaLocalNav({ prefectureId, cityId }: AreaLocalNavProps) {
  const pathname = usePathname() ?? "";
  const base = `/area/${prefectureId}/${cityId}`;
  const isActive = (segment: string) => {
    if (segment === "") return pathname === base || pathname === `${base}/`;
    return pathname.startsWith(`${base}${segment}`);
  };

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80"
      aria-label="地域内ナビゲーション"
    >
      <div className="max-w-5xl mx-auto px-4 py-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mb-1">
          {TABS.map((tab) => {
            const href = `${base}${tab.href}`;
            const active = isActive(tab.href);
            return (
              <Link
                key={href}
                href={href}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                  active
                    ? "bg-primary text-white shadow-md"
                    : "bg-background border border-border text-foreground/80 hover:bg-primary-light/50 hover:border-primary/30 hover:text-primary"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
