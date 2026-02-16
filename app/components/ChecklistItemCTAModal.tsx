"use client";

import Link from "next/link";

interface Props {
  category: string;
  label: string;
  onClose: () => void;
}

const CATEGORY_CTA: Record<string, { label: string; href: string }> = {
  "財産・お金": { label: "預貯金・不動産の整理をプロに相談", href: "/guide" },
  "持ち物": { label: "買取・処分の見積もりを取る", href: "/tools/appraisal" },
  "デジタル": { label: "デジタル遺品の整理を相談する", href: "/guide" },
  "書類・手続き": { label: "遺言書・エンディングノートをプロに相談", href: "/guide" },
  "人間関係": { label: "エンディングノートの書き方を確認", href: "/ending-note" },
};

export default function ChecklistItemCTAModal({ category, label, onClose }: Props) {
  const cta = CATEGORY_CTA[category] ?? { label: "この項目をプロに頼む（見積もり）", href: "/guide" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-card rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm text-foreground/60 mb-1">「{label}」を完了しました</p>
        <h3 className="font-bold text-lg text-primary mb-2">この項目をプロに頼みませんか？</h3>
        <p className="text-sm text-foreground/60 mb-4">
          作業代行や見積もりを提携業者に無料で依頼できます。
        </p>
        <div className="flex gap-3">
          <Link
            href={cta.href}
            className="flex-1 text-center bg-accent text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition"
          >
            {cta.label}
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 rounded-xl border border-border text-sm hover:bg-background"
          >
            今はしない
          </button>
        </div>
      </div>
    </div>
  );
}
