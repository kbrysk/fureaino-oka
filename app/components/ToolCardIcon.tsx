"use client";

import type React from "react";

/**
 * 無料ツール一覧用：各ツールの内容がビジュアルで分かるイラスト
 * OwlAizuchi・サイトカラーに合わせた丸みのあるシンプルなアイコン
 */

const iconClass = "w-full h-full";

function InheritanceIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={iconClass} aria-hidden>
      <circle cx="32" cy="32" r="28" className="fill-primary/15 stroke-primary/50" strokeWidth="2" />
      <path d="M32 4 L32 60 M4 32 L60 32" className="stroke-primary/40" strokeWidth="1.5" />
      <circle cx="32" cy="20" r="8" className="fill-primary" />
      <circle cx="20" cy="44" r="6" className="fill-primary/70" />
      <circle cx="44" cy="44" r="6" className="fill-primary/70" />
    </svg>
  );
}

function HojiIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={iconClass} aria-hidden>
      <rect x="8" y="12" width="48" height="40" rx="4" className="fill-primary/15 stroke-primary/50" strokeWidth="2" />
      <rect x="14" y="18" width="8" height="6" rx="1" className="fill-primary/30" />
      <rect x="26" y="18" width="8" height="6" rx="1" className="fill-primary/30" />
      <rect x="38" y="18" width="8" height="6" rx="1" className="fill-primary/30" />
      <path d="M20 36 L44 36 M20 44 L36 44" className="stroke-primary/50" strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="52" r="4" className="fill-primary" />
    </svg>
  );
}

function DigitalShameIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={iconClass} aria-hidden>
      <rect x="16" y="8" width="32" height="48" rx="6" className="fill-primary/15 stroke-primary/50" strokeWidth="2" />
      <circle cx="32" cy="22" r="4" className="fill-primary/40" />
      <rect x="22" y="32" width="20" height="4" rx="1" className="fill-primary/30" />
      <path d="M28 44 L36 44 M28 50 L34 50" className="stroke-primary/50" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="48" cy="48" r="8" className="fill-primary/20 stroke-primary" strokeWidth="2" />
      <path d="M45 48 L47 50 L51 46" className="stroke-primary" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function JikkaIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={iconClass} aria-hidden>
      <path d="M32 8 L52 24 L52 52 L12 52 L12 24 Z" className="fill-primary/15 stroke-primary/50" strokeWidth="2" strokeLinejoin="round" />
      <rect x="28" y="32" width="8" height="20" className="fill-primary/40" />
      <circle cx="32" cy="20" r="4" className="fill-primary" />
      <path d="M20 28 L24 32 L20 36" className="stroke-primary/60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AkiyaIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={iconClass} aria-hidden>
      <path d="M32 6 L58 22 L58 54 L6 54 L6 22 Z" className="fill-primary/15 stroke-primary/50" strokeWidth="2" strokeLinejoin="round" />
      <rect x="26" y="32" width="12" height="22" className="fill-primary/40" />
      <circle cx="32" cy="18" r="5" className="fill-primary" />
      <path d="M18 38 L22 42 M42 38 L38 42" className="stroke-primary/50" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SouzokuIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={iconClass} aria-hidden>
      <rect x="12" y="8" width="40" height="48" rx="2" className="fill-primary/15 stroke-primary/50" strokeWidth="2" />
      <path d="M18 20 L46 20 M18 28 L40 28 M18 36 L44 36 M18 44 L38 44" className="stroke-primary/50" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="50" cy="50" r="10" className="fill-primary/20 stroke-primary" strokeWidth="2" />
      <path d="M46 50 L49 53 L54 48" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EmptyHouseTaxIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={iconClass} aria-hidden>
      <rect x="10" y="18" width="44" height="32" rx="4" className="fill-primary/15 stroke-primary/50" strokeWidth="2" />
      <path d="M18 26 L28 26 M18 32 L26 32 M18 38 L24 38" className="stroke-primary/60" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="34" y="34" width="16" height="10" rx="2" className="fill-primary/50" />
      <path d="M38 40 L46 40 M42 36 L42 44" className="stroke-white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AppraisalIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={iconClass} aria-hidden>
      <path d="M20 44 L24 28 L28 36 L32 24 L36 32 L40 22 L44 28" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="10" y="46" width="44" height="4" rx="1" className="fill-primary/30" />
      <circle cx="32" cy="16" r="6" className="fill-primary/20 stroke-primary" strokeWidth="2" />
    </svg>
  );
}

function ChecklistIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={iconClass} aria-hidden>
      <rect x="14" y="8" width="36" height="48" rx="4" className="fill-primary/15 stroke-primary/50" strokeWidth="2" />
      <path d="M22 22 L26 26 L34 18" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 32 L26 36 L34 28" className="stroke-primary/60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 42 L26 46 L34 38" className="stroke-primary/40" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AreaIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={iconClass} aria-hidden>
      <path d="M8 24 Q32 8 56 24 L56 52 Q32 40 8 52 Z" className="fill-primary/15 stroke-primary/50" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="32" cy="28" r="6" className="fill-primary" />
      <rect x="26" y="40" width="12" height="8" rx="1" className="fill-primary/40" />
    </svg>
  );
}

const ICONS: Record<string, () => React.ReactElement> = {
  "inheritance-share": InheritanceIcon,
  "hoji-calendar": HojiIcon,
  "digital-shame": DigitalShameIcon,
  "jikka-diagnosis": JikkaIcon,
  "akiya-risk": AkiyaIcon,
  "souzoku-prep": SouzokuIcon,
  "empty-house-tax": EmptyHouseTaxIcon,
  "appraisal": AppraisalIcon,
  "checklist": ChecklistIcon,
  "area": AreaIcon,
};

interface ToolCardIconProps {
  slug: string;
  className?: string;
}

export default function ToolCardIcon({ slug, className = "" }: ToolCardIconProps) {
  const Icon = ICONS[slug] ?? ChecklistIcon;
  return (
    <div className={`flex items-center justify-center rounded-xl bg-primary-light/30 border border-primary/20 overflow-hidden flex-shrink-0 ${className}`} style={{ width: 72, height: 72 }}>
      <Icon />
    </div>
  );
}
