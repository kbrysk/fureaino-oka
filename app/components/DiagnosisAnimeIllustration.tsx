"use client";

/**
 * 診断コンテンツ用・アニメ風イラスト（フラットカラー＋太めの輪郭）
 * variant ごとに別シーンを表示
 */
type Variant = "jikka" | "akiya" | "souzoku";

interface DiagnosisAnimeIllustrationProps {
  variant: Variant;
  className?: string;
  size?: number;
}

export default function DiagnosisAnimeIllustration({
  variant,
  className = "",
  size = 140,
}: DiagnosisAnimeIllustrationProps) {
  const common = {
    stroke: "#1a1a1a",
    strokeWidth: 2,
    fill: "none",
  };

  if (variant === "akiya") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden
      >
        {/* 空き家：家＋時計＋雲（さびしい雰囲気） */}
        <rect x="35" y="55" width="70" height="55" rx="4" fill="#8B9A8E" stroke={common.stroke} strokeWidth={common.strokeWidth} />
        <path d="M70 35 L95 55 L70 55 L45 55 Z" fill="#6B7B6E" stroke={common.stroke} strokeWidth={common.strokeWidth} />
        <rect x="58" y="75" width="24" height="28" rx="2" fill="#5C8B76" stroke={common.stroke} strokeWidth={common.strokeWidth} />
        <circle cx="70" cy="89" r="6" fill="#1a1a1a" />
        <line x1="70" y1="89" x2="70" y2="83" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="70" y1="89" x2="74" y2="90" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        {/* 時計（アニメ風） */}
        <circle cx="105" cy="45" r="18" fill="#E8F0EC" stroke={common.stroke} strokeWidth={common.strokeWidth} />
        <circle cx="105" cy="45" r="14" fill="#fff" stroke={common.stroke} strokeWidth="1.2" />
        <line x1="105" y1="45" x2="105" y2="35" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
        <line x1="105" y1="45" x2="112" y2="45" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
        {/* 雲 */}
        <ellipse cx="35" cy="38" rx="14" ry="8" fill="#B0BEC5" stroke={common.stroke} strokeWidth={common.strokeWidth} />
        <ellipse cx="42" cy="35" rx="10" ry="6" fill="#CFD8DC" stroke={common.stroke} strokeWidth="1.2" />
      </svg>
    );
  }

  if (variant === "souzoku") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden
      >
        {/* 書類＋チェックマーク＋ペン（相続準備） */}
        <rect x="40" y="45" width="60" height="75" rx="6" fill="#FFF8E1" stroke={common.stroke} strokeWidth={common.strokeWidth} />
        <line x1="48" y1="58" x2="92" y2="58" stroke="#B0BEC5" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="48" y1="68" x2="88" y2="68" stroke="#B0BEC5" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="48" y1="78" x2="85" y2="78" stroke="#B0BEC5" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M52 92 L58 98 L72 82" stroke="#5C8B76" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M52 92 L58 98 L72 82" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* ペン */}
        <rect x="88" y="35" width="8" height="35" rx="2" fill="#5C8B76" stroke={common.stroke} strokeWidth={common.strokeWidth} />
        <path d="M90 30 L94 35 L92 35 L92 38 Z" fill="#37474F" stroke={common.stroke} strokeWidth="1" />
        {/* ハート（家族・想い） */}
        <path d="M28 75 C28 68 34 62 42 62 C48 62 52 66 54 72 C56 66 60 62 66 62 C74 62 80 68 80 75 C80 85 54 98 54 98 C54 98 28 85 28 75 Z" fill="#E8A4B8" stroke={common.stroke} strokeWidth={common.strokeWidth} />
      </svg>
    );
  }

  /* jikka: 実家＋家族の輪 */
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect x="40" y="60" width="60" height="50" rx="4" fill="#8B9A8E" stroke={common.stroke} strokeWidth={common.strokeWidth} />
      <path d="M70 38 L98 60 L70 60 L42 60 Z" fill="#6B7B6E" stroke={common.stroke} strokeWidth={common.strokeWidth} />
      <rect x="62" y="78" width="16" height="24" rx="2" fill="#5C8B76" stroke={common.stroke} strokeWidth={common.strokeWidth} />
      {/* 人（丸＋体） */}
      <circle cx="52" cy="42" r="10" fill="#E8F0EC" stroke={common.stroke} strokeWidth={common.strokeWidth} />
      <ellipse cx="52" cy="58" rx="8" ry="10" fill="#E8F0EC" stroke={common.stroke} strokeWidth={common.strokeWidth} />
      <circle cx="88" cy="42" r="10" fill="#E8F0EC" stroke={common.stroke} strokeWidth={common.strokeWidth} />
      <ellipse cx="88" cy="58" rx="8" ry="10" fill="#E8F0EC" stroke={common.stroke} strokeWidth={common.strokeWidth} />
      <path d="M62 50 Q70 44 78 50" stroke="#5C8B76" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
