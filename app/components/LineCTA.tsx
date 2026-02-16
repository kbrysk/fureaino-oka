"use client";

import Link from "next/link";
import { LINE_ADD_URL } from "../lib/site-brand";

/**
 * リスト取り用：公式LINE登録CTA（ガイドブック特典・診断レポート受け取り）
 */
export default function LineCTA() {
  return (
    <div className="rounded-2xl border-2 border-[#06C755]/40 bg-[#06C755]/5 p-6 sm:p-8">
      <h3 className="text-lg font-bold text-primary mb-1">LINEで無料特典を受け取る</h3>
      <p className="text-sm text-foreground/70 mb-4">
        失敗しない実家じまい 完全ガイドブック（PDF）をプレゼント。診断結果の詳細レポートもLINEでお届けします。
      </p>
      <a
        href={LINE_ADD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 bg-[#06C755] text-white px-6 py-4 rounded-xl font-bold hover:opacity-90 transition"
      >
        <span className="text-xl" aria-hidden>LINE</span>
        無料で友だち追加する
      </a>
    </div>
  );
}
