"use client";

import Link from "next/link";
// U1: CTAボタン色統一（赤・オレンジ→グリーン）2026-03

/**
 * 統一CTAボタン（U1: ボタン色・サイズ統一）。
 * - variant='primary': 最重要アクション（無料相談・診断開始・見積もり依頼等）。既存のプライマリ色（bg-primary）を使用。
 * - variant='secondary': 補助アクション（詳しく見る・一覧・キャンセル等）。白背景＋グレーボーダー。
 */
export type CtaButtonProps = {
  variant: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

const baseClasses = "inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-lg font-bold transition";
const primaryClasses =
  "bg-primary text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
const secondaryClasses =
  "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

export function CtaButton({
  variant,
  children,
  onClick,
  href,
  className = "",
  type = "button",
  disabled = false,
}: CtaButtonProps) {
  const variantClasses = variant === "primary" ? primaryClasses : secondaryClasses;
  const combined = `${baseClasses} ${variantClasses} ${className}`.trim();

  if (href !== undefined && href !== "") {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a href={href} className={combined} target="_blank" rel="nofollow noopener noreferrer" onClick={onClick}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={combined} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={combined} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
