"use client";

import Link from "next/link";
import { LINE_ADD_URL } from "../lib/site-brand";

/** LINE公式グリーン（誘導ボタン用） */
const LINE_GREEN = "#06C755";

const LineIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

/**
 * 追従型フッターバー（スマホ・PC共通）
 * スマホ: 左70% 診断誘導、右30% LINE登録
 * PC: 左50% 無料相談、右50% LINEでガイドを受け取る
 */
export default function MobileFooterBar() {
  return (
    <>
      {/* スマホ: 診断 + LINE（ビューポート内に収め、右端切れ防止） */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 w-full max-w-[100vw] flex border-t border-border bg-card shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-area-pb overflow-hidden"
        aria-label="固定メニュー"
      >
        <Link
          href="/tools/jikka-diagnosis"
          className="min-w-0 flex-[1_1_70%] flex items-center justify-center gap-1 bg-[#e85d04] text-white py-3.5 px-3 font-bold text-sm hover:opacity-95 active:opacity-90 transition shrink"
        >
          <span className="truncate">まずは3分で無料診断</span>
          <span aria-hidden className="shrink-0">&gt;</span>
        </Link>
        <a
          href={LINE_ADD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0 flex-[1_1_30%] flex items-center justify-center gap-1 py-3.5 px-2 font-bold text-sm text-white hover:opacity-95 active:opacity-90 transition shrink"
          style={{ backgroundColor: LINE_GREEN }}
        >
          <span className="shrink-0" aria-hidden>
            <LineIcon />
          </span>
          <span className="truncate">ガイド受け取る</span>
        </a>
      </div>

      {/* PC: 無料相談 + LINE登録 */}
      <div
        className="hidden md:flex fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
        aria-label="固定メニュー（無料相談・LINE登録）"
      >
        <Link
          href="/guide"
          className="flex-1 flex items-center justify-center gap-2 py-4 px-6 font-bold text-primary bg-primary-light hover:bg-primary hover:text-white transition-colors"
        >
          無料相談はこちら
          <span aria-hidden>&gt;</span>
        </Link>
        <a
          href={LINE_ADD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-4 px-6 font-bold text-sm text-white hover:opacity-95 transition"
          style={{ backgroundColor: LINE_GREEN }}
        >
          <LineIcon />
          LINEでガイドを受け取る（無料）
        </a>
      </div>
    </>
  );
}
