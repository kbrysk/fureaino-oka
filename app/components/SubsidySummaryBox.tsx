export type SubsidySummaryBoxProps = {
  cityName: string;
  hasRealData: boolean;
};

/**
 * 補助金ページのファーストビュー用サマリーボックス。
 * このページでわかること・補助金を受け取れる可能性チェックを表示。
 * hasRealData が false のときは「詳細データは現在調査中」の注意を表示する。
 */
export function SubsidySummaryBox({ cityName, hasRealData }: SubsidySummaryBoxProps) {
  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <div className="bg-blue-50/90 dark:bg-blue-950/30 p-5 sm:p-6 space-y-5">
        <div>
          <p className="text-sm font-bold text-foreground/90 mb-3">このページでわかること</p>
          <ul className="space-y-2 text-sm text-foreground/85" aria-label="このページでわかること">
            <li className="flex items-start gap-2">
              <span aria-hidden className="text-primary shrink-0 mt-0.5">✓</span>
              <span>{cityName}の補助金を受け取れる条件</span>
            </li>
            <li className="flex items-start gap-2">
              <span aria-hidden className="text-primary shrink-0 mt-0.5">✓</span>
              <span>申請方法と必要書類</span>
            </li>
            <li className="flex items-start gap-2">
              <span aria-hidden className="text-primary shrink-0 mt-0.5">✓</span>
              <span>固定資産税リスクとその回避策</span>
            </li>
          </ul>
        </div>

        <div className="border-t border-border pt-5">
          <p className="text-sm font-bold text-foreground/90 mb-3">
            ＼補助金を受け取れる可能性チェック／
          </p>
          <ul className="space-y-2 text-sm text-foreground/85" aria-label="補助金対象の可能性チェック">
            <li className="flex items-start gap-2">
              <span aria-hidden className="shrink-0 mt-0.5 border border-foreground/50 rounded w-4 h-4 inline-block bg-white" />
              <span>昭和56年（1981年）以前に建てられた建物がある</span>
            </li>
            <li className="flex items-start gap-2">
              <span aria-hidden className="shrink-0 mt-0.5 border border-foreground/50 rounded w-4 h-4 inline-block bg-white" />
              <span>空き家の所有者または相続人である</span>
            </li>
            <li className="flex items-start gap-2">
              <span aria-hidden className="shrink-0 mt-0.5 border border-foreground/50 rounded w-4 h-4 inline-block bg-white" />
              <span>{cityName}に税金の滞納がない</span>
            </li>
          </ul>
          <p className="mt-3 text-xs text-foreground/70">
            → 3つ全て当てはまる場合、対象の可能性があります
          </p>
        </div>
      </div>

      {!hasRealData && (
        <div
          className="border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 px-5 py-4 text-sm leading-relaxed"
          role="note"
        >
          <p>
            ※ この地域の詳細データは現在調査中です。
            最新情報は{cityName}の担当窓口（建築指導課・空き家対策担当）へ
            直接お問い合わせください。
          </p>
        </div>
      )}
    </div>
  );
}
