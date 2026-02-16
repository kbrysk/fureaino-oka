"use client";

import { useEffect } from "react";
import { LINE_ADD_URL } from "../lib/site-brand";

const LINE_GREEN = "#06C755";

interface LineGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 無料ガイドブック：LINE登録QR/リンク用モーダル
 */
export default function LineGuideModal({ isOpen, onClose }: LineGuideModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="line-guide-title">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="relative bg-card rounded-2xl shadow-xl max-w-md w-full p-6 border border-border">
        <h2 id="line-guide-title" className="text-lg font-bold text-primary mb-2">
          無料ガイドブックを受け取る
        </h2>
        <p className="text-sm text-foreground/70 mb-4">
          実家じまいの手順や、失敗しないやることリストをまとめたPDFをLINEでお届けします。
        </p>
        <a
          href={LINE_ADD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full text-white py-4 px-6 rounded-xl font-bold hover:opacity-90 transition mb-3"
          style={{ backgroundColor: LINE_GREEN }}
        >
          <span aria-hidden>LINE</span>
          友だち追加してガイドブックを受け取る
        </a>
        <p className="text-xs text-foreground/50 text-center mb-4">※完全無料　※いつでもブロック可能</p>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-lg border border-border text-foreground/70 hover:bg-primary-light hover:text-primary transition text-sm font-medium"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
