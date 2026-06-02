import Link from "next/link";

/**
 * 「持ち続ける（固定資産税・管理）vs 売却」比較ブロック。
 *
 * 【戦略的意図 — PANEL_04 / MASTER_STRATEGY_2026】
 *   「査定CV記事は『固定資産税を払い続ける vs 売る』比較で査定へ橋渡しする」
 *   ——空き家・不動産系の記事で、読者が「保有を続けるコスト」を直視した直後に
 *   査定CTA（直後の ArticleInlineAppraisalCTA）へ自然につながるよう、
 *   意思決定の論理（損失の時間軸）を可視化する。
 *
 * microCMS本文には手を入れず、記事テンプレ側で real-estate カテゴリに自動注入する。
 * これにより既存の空き家系記事すべての「査定への橋渡し」が一括で強化される。
 *
 * YMYL配慮：金額は一般的な「目安」とし、正確な税額・控除の判断は専門家・自治体へ誘導。
 */
export default function ArticleSellVsHoldComparison() {
  return (
    <section
      aria-labelledby="sell-vs-hold-heading"
      className="my-8 rounded-2xl border border-border bg-card overflow-hidden"
    >
      <div className="px-5 sm:px-6 py-4 border-b border-border bg-primary-light/30">
        <h2
          id="sell-vs-hold-heading"
          className="text-lg sm:text-xl font-bold text-foreground"
        >
          「持ち続ける」と「売る」、どちらが損しない？
        </h2>
        <p className="text-sm text-foreground/65 mt-1 leading-relaxed">
          空き家・実家は、保有を続けるだけで毎年コストがかかります。一度、両方を並べて比べてみましょう。
        </p>
      </div>

      <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {/* 持ち続ける */}
        <div className="p-5 sm:p-6 bg-amber-50/40">
          <p className="text-xs font-bold text-amber-700 mb-2 tracking-wide">
            このまま持ち続けると
          </p>
          <ul className="space-y-2.5 text-sm text-foreground/80">
            <li className="flex gap-2">
              <span aria-hidden className="text-amber-600 shrink-0">●</span>
              <span><strong>固定資産税・都市計画税</strong>が毎年かかり続ける</span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden className="text-amber-600 shrink-0">●</span>
              <span><strong>管理・草刈り・修繕・保険</strong>などの維持費（年5万円〜が目安）</span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden className="text-amber-600 shrink-0">●</span>
              <span>放置で<strong>「特定空家」に指定</strong>されると固定資産税が最大6倍に</span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden className="text-amber-600 shrink-0">●</span>
              <span>建物は年々老朽化し、<strong>売却価格が下がっていく</strong>ことも</span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden className="text-amber-600 shrink-0">●</span>
              <span>相続から3年を過ぎると<strong>3,000万円特別控除</strong>が使えなくなる場合がある</span>
            </li>
          </ul>
        </div>

        {/* 売る */}
        <div className="p-5 sm:p-6">
          <p className="text-xs font-bold text-emerald-700 mb-2 tracking-wide">
            売却を選ぶと
          </p>
          <ul className="space-y-2.5 text-sm text-foreground/80">
            <li className="flex gap-2">
              <span aria-hidden className="text-emerald-600 shrink-0">●</span>
              <span><strong>毎年の固定資産税・維持費の負担から解放</strong>される</span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden className="text-emerald-600 shrink-0">●</span>
              <span>まとまった<strong>現金</strong>になり、相続人で分けやすくなる</span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden className="text-emerald-600 shrink-0">●</span>
              <span>相続から3年以内なら<strong>3,000万円特別控除</strong>を活かせる可能性</span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden className="text-emerald-600 shrink-0">●</span>
              <span>古家付き土地のままでも売れるため、<strong>解体費が不要</strong>なケースも</span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden className="text-emerald-600 shrink-0">●</span>
              <span><strong>査定を受けるだけなら無料</strong>で、売る義務はない</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="px-5 sm:px-6 py-4 bg-primary-light/10 border-t border-border">
        <p className="text-sm text-foreground/75 leading-relaxed">
          判断の第一歩は、<strong>「保有を続けるといくらかかるか」</strong>と
          <strong>「売るといくらになるか」</strong>の両方の数字を知ること。まずは
          <Link href="/tools/empty-house-tax" className="text-primary font-bold hover:underline mx-1">
            固定資産税シミュレーター
          </Link>
          で維持費の目安を、そして下記の無料査定で売却価格の目安を確かめてみてください。
        </p>
      </div>
    </section>
  );
}
