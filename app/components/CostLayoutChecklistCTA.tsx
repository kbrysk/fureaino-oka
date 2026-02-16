import Link from "next/link";
import { LINE_ADD_URL } from "../lib/site-brand";

const LINE_GREEN = "#06C755";

interface CostLayoutChecklistCTAProps {
  layoutLabel: string;
}

/**
 * 間取り別：「事前片付けチェックリスト」PDF リスト獲得CTA
 * 安く済ませるコツの延長で、LINE登録 or 診断完了後の特典として訴求
 */
export default function CostLayoutChecklistCTA({ layoutLabel }: CostLayoutChecklistCTAProps) {
  return (
    <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/90 p-5 sm:p-6">
      <h3 className="font-bold text-amber-900 mb-2">
        [{layoutLabel}]専用 自分で捨てれば5万円浮く！「事前片付けチェックリスト」をダウンロード（無料）
      </h3>
      <p className="text-sm text-foreground/75 mb-4">
        業者に頼む前に自分でできることをチェック。分別のコツや「残す・捨てる」の分け方で、見積もりを抑えられます。
      </p>
      <a
        href={LINE_ADD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 text-white py-3 px-5 rounded-xl font-bold text-sm hover:opacity-90 transition"
        style={{ backgroundColor: LINE_GREEN }}
      >
        LINEで無料受け取る
      </a>
      <p className="text-xs text-foreground/50 mt-2">※完全無料　※いつでもブロック可能</p>
    </div>
  );
}
