"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAreaCta } from "./AreaCtaContext";

/** 画面最下部に固定される追従型 CTA。現在 URL とエリア名に応じてラベル・遷移先を切り替える。 */
export default function GlobalStickyCTA() {
  const pathname = usePathname() ?? "";
  const { cityName } = useAreaCta();

  const segments = pathname.split("/").filter(Boolean);
  const isAreaCityPage = segments[0] === "area" && segments.length >= 3;

  const href = isAreaCityPage ? `${pathname}#appraisal-section` : "/tool/optimizer";
  const label = isAreaCityPage
    ? cityName
      ? `${cityName}の実家じまい・無料査定はこちら 👉`
      : "このエリアの実家じまい・無料査定はこちら 👉"
    : "あなたの実家の損失リスクを無料診断 👉";

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] w-full px-4 py-3 safe-area-pb bg-white/95 backdrop-blur border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]"
      aria-label="メインのご案内"
    >
      <Link
        href={href}
        className="block w-full max-w-2xl mx-auto py-3.5 px-4 rounded-xl font-bold text-center text-white bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
      >
        {label}
      </Link>
    </div>
  );
}
