"use client";

import { LINE_ADD_URL } from "../lib/site-brand";

const LINE_GREEN = "#06C755";

/**
 * 診断結果画面の直下に配置。結果保存＋対策アドバイス＋相談チケットでLINE誘導。
 */
export default function DiagnosisResultLineCTA() {
  return (
    <div className="rounded-2xl border-2 border-[#06C755]/40 bg-[#06C755]/5 p-6 text-center">
      <h3 className="font-bold text-primary text-lg mb-2">診断結果を保存しませんか？</h3>
      <p className="text-sm text-foreground/80 mb-4">
        この結果と、あなたに合った「今後の対策アドバイス」をLINEにお送りします。
        また、今なら<strong>「専門家への相談チケット（無料）」</strong>も付いてきます。
      </p>
      <a
        href={LINE_ADD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 text-white py-4 px-6 rounded-xl font-bold text-base hover:opacity-90 transition"
        style={{ backgroundColor: LINE_GREEN }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
        結果をLINEに送る
      </a>
      <p className="text-xs text-foreground/50 mt-3">※完全無料　※いつでもブロック可能</p>
    </div>
  );
}
