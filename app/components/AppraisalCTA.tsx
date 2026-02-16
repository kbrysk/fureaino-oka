"use client";

import Link from "next/link";
import type { Asset } from "../lib/types";

interface AppraisalCTAProps {
  /** 登録直後の資産（この資産の査定を促す） */
  asset: Asset;
  /** 査定依頼ボタン押下時のコールバック（モーダル表示など） */
  onRequestAppraisal?: (asset: Asset) => void;
  /** 閉じる */
  onDismiss?: () => void;
}

/**
 * 資産登録直後に表示。「記録」から「査定」への導線。
 * 金額がわからない（wantsAppraisal）の場合は「写真を撮ってAI査定」を強調。
 */
export default function AppraisalCTA({ asset, onRequestAppraisal, onDismiss }: AppraisalCTAProps) {
  const wantsAppraisal = asset.wantsAppraisal;

  return (
    <div className="bg-primary-light/50 rounded-2xl border-2 border-primary/30 p-6 space-y-4">
      <p className="font-bold text-primary text-lg">
        この資産の現在の市場価値を知りたくないですか？
      </p>
      <p className="text-sm text-foreground/70">
        「{asset.name}」の概算を、提携業者が匿名・無料でお伝えします。
      </p>

      {wantsAppraisal ? (
        <>
          <p className="text-sm font-medium text-accent">写真を送るだけで概算がわかります</p>
          <Link
            href="/tools/appraisal"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-accent text-white px-8 py-4 rounded-xl font-bold text-base hover:opacity-90 transition shadow-lg border-2 border-accent"
          >
            <span aria-hidden>📷</span>
            写真を撮ってAI査定（推奨）
          </Link>
          <p className="text-xs text-foreground/50">
            買取業者への問い合わせフォームへ遷移します。無料で査定できます。
          </p>
        </>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        {onRequestAppraisal ? (
          <button
            type="button"
            onClick={() => onRequestAppraisal(asset)}
            className="inline-flex items-center justify-center bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition"
          >
            無料で査定依頼する（提携業者へ）
          </button>
        ) : (
          <Link
            href="/guide"
            className="inline-flex items-center justify-center bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition"
          >
            無料で査定依頼する（提携業者へ）
          </Link>
        )}
        <Link
          href="/tools/appraisal"
          className="inline-flex items-center justify-center border-2 border-primary text-primary px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary-light transition"
        >
          写真で査定を依頼する（無料）
        </Link>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-xs text-foreground/40 hover:text-foreground/60"
        >
          閉じる
        </button>
      )}
    </div>
  );
}
