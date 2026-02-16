"use client";

import { LINE_ADD_URL } from "../lib/site-brand";

const LINE_GREEN = "#06C755";

/**
 * 問い合わせ送信完了後のサンクスページ用：返信待ちの間にLINEでチェックシートを案内
 */
export default function ContactThanksLineCTA() {
  return (
    <div className="mt-8 rounded-2xl border-2 border-[#06C755]/30 bg-[#06C755]/5 p-6 text-center">
      <p className="text-center text-sm font-bold text-primary mb-2">＼ お待ちの間に ／</p>
      <p className="text-sm text-foreground/85 mb-4">
        公式LINEでは、よくある質問や、すぐに使える「生前整理チェックシート」を即時配信しています。
      </p>
      <a
        href={LINE_ADD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 text-white py-4 px-6 rounded-xl font-bold hover:opacity-90 transition"
        style={{ backgroundColor: LINE_GREEN }}
      >
        <span aria-hidden>LINE</span>
        チェックシートをダウンロードする
      </a>
      <p className="text-xs text-foreground/50 mt-3">※完全無料　※いつでもブロック可能</p>
    </div>
  );
}
