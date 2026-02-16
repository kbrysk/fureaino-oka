"use client";

import { LINE_ADD_URL } from "../lib/site-brand";

const LINE_GREEN = "#06C755";

/**
 * 記事：目次の直上（リード文の直後）に表示。読む時間がない層にPDFを提示して離脱防止。
 */
export default function ArticleLineCTATop() {
  return (
    <div className="my-8 rounded-xl border-2 border-amber-200 bg-amber-50/90 p-5 sm:p-6">
      <p className="text-center text-sm font-bold text-amber-900 mb-2">＼ 読む時間がない方へ ／</p>
      <p className="text-sm text-foreground/85 mb-4">
        この記事の要点と、実家じまいの手順をまとめた<strong>「完全ガイドブック（PDF）」</strong>を無料プレゼント中！
      </p>
      <a
        href={LINE_ADD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full text-white py-3.5 px-4 rounded-xl font-bold text-sm hover:opacity-90 transition"
        style={{ backgroundColor: LINE_GREEN }}
      >
        <span aria-hidden>LINE</span>
        LINEで今すぐ受け取る（無料）
      </a>
      <p className="text-xs text-foreground/50 mt-3 text-center">
        ※完全無料　※いつでもブロック可能
      </p>
    </div>
  );
}
