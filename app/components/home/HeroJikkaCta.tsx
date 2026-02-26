"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LayoutSlug = "1K" | "2DK" | "3LDK" | "4LDK+";

/** 30秒診断用：間取り選択で診断専用ページへ遷移 */
export default function HeroJikkaCta() {
  const router = useRouter();
  const [layout, setLayout] = useState<LayoutSlug>("2DK");

  const optimizerUrl = `/tool/optimizer?layout=${layout}`;

  const handleLayoutChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value as LayoutSlug;
      setLayout(value);
      router.push(`/tool/optimizer?layout=${value}`);
    },
    [router]
  );

  return (
    <div className="w-full pt-4 pb-1 flex flex-col items-start gap-2 md:pt-10 md:pb-2 md:gap-3">
      <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full">
        <label htmlFor="hero-layout" className="text-xs md:text-sm font-medium text-slate-700 shrink-0">
          間取り
        </label>
        <select
          id="hero-layout"
          value={layout}
          onChange={handleLayoutChange}
          className="rounded-lg border-2 border-slate-300 bg-white px-3 py-1 md:py-2 text-xs md:text-sm font-medium text-slate-800 focus:ring-2 focus:ring-primary focus:border-primary min-w-[100px]"
          aria-label="間取りを選んで診断へ"
        >
          <option value="1K">1K</option>
          <option value="2DK">2DK</option>
          <option value="3LDK">3LDK</option>
          <option value="4LDK+">4LDK+</option>
        </select>
      </div>
      <div className="relative inline-block w-full md:w-auto md:min-w-[300px]">
        <span className="hero-cta-ribbon absolute -top-0.5 left-2 -rotate-12 z-10 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-primary bg-primary-light border border-primary/40 shadow-md rounded" aria-hidden>100%完全無料</span>
        <Link
          href={optimizerUrl}
          className="hero-cta-button animate-soft-pulse relative inline-block w-full overflow-hidden text-center bg-gradient-to-r from-[#f26601] to-[#ff8c3a] text-white px-4 py-2.5 md:px-6 md:py-3.5 sm:py-4 rounded-xl text-sm md:text-base sm:text-lg font-bold transition-all duration-300 shadow-[0_20px_40px_-15px_rgba(242,102,1,0.4)] hover:shadow-[0_24px_48px_-12px_rgba(242,102,1,0.5)] hover:brightness-105"
        >
          【無料】あなたの実家はあと何年で『赤字』になる？（30秒診断）
        </Link>
      </div>
    </div>
  );
}
