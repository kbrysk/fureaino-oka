import Link from "next/link";
import { LINE_ADD_URL } from "../lib/site-brand";

const LINE_GREEN = "#06C755";

interface CostLayoutLineCTAProps {
  layoutLabel: string;
}

/**
 * 戦略B：間取り別費用ページ用 CTA
 * 「あなたの家の正確な見積もりを3分で診断」→ 診断ツール＋LINE誘導
 */
export default function CostLayoutLineCTA({ layoutLabel }: CostLayoutLineCTAProps) {
  return (
    <div className="rounded-2xl border-2 border-[#06C755]/40 bg-[#06C755]/5 p-6 sm:p-8 text-center">
      <h2 className="text-lg font-bold text-primary mb-2">
        {layoutLabel}だけじゃない。あなたの家の正確な見積もりを3分で診断
      </h2>
      <p className="text-sm text-foreground/70 mb-4">
        実家じまい力診断で荷物量・リスクをチェックし、結果と対策アドバイスをLINEで受け取れます。
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/tools/jikka-diagnosis"
          className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition"
        >
          3分で無料診断する
        </Link>
        <a
          href={LINE_ADD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition"
          style={{ backgroundColor: LINE_GREEN }}
        >
          LINEで結果を受け取る
        </a>
      </div>
      <p className="text-xs text-foreground/50 mt-3">※完全無料　※いつでもブロック可能</p>
    </div>
  );
}
