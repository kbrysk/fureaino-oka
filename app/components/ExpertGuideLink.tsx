import Link from "next/link";

export type ExpertGuideLinkVariant = "narrow" | "snow" | "default";

const COPY_BY_VARIANT: Record<ExpertGuideLinkVariant, string> = {
  narrow:
    "坂道での搬出は想像以上に体力を削ります。安全に進めるための全手順をガイドで確認しましょう。",
  snow:
    "雪解けを待つ今がチャンス。倒壊リスクを避け、補助金を活用する具体策を公開中。",
  default:
    "損をしない『実家の片付け』完全ガイド：整理のプロが教える失敗しない5つのステップ",
};

interface ExpertGuideLinkProps {
  variant?: ExpertGuideLinkVariant;
}

/**
 * 地域ページ（Spoke）からハブ記事（/articles/master-guide）への誘導ブロック。
 * 地域特性（坂・階段 / 豪雪）に応じた動的文言で、トピッククラスターの Link Juice を強化する。
 */
export default function ExpertGuideLink({ variant = "default" }: ExpertGuideLinkProps) {
  const copy = COPY_BY_VARIANT[variant];

  return (
    <aside
      className="bg-slate-50 border border-slate-200 p-8 my-10 rounded-xl shadow-inner"
      aria-labelledby="expert-guide-link-heading"
    >
      <p id="expert-guide-link-heading" className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
        この記事の監修：実家じまい専門家チーム（全国176都市調査済み）
      </p>
      <p className="text-lg text-slate-800 mb-4 font-medium">{copy}</p>
      <Link
        href="/articles/master-guide"
        className="inline-flex items-center gap-2 rounded-xl bg-slate-700 text-white px-5 py-3 font-bold text-sm hover:bg-slate-800 transition"
      >
        <span>実家じまい・完全ガイドを読む</span>
        <span aria-hidden>→</span>
      </Link>
    </aside>
  );
}
