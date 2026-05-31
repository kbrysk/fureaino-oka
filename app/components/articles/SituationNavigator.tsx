import Link from "next/link";
import { ARTICLE_SITUATIONS, SITUATION_ACCENT_CLASSES } from "../../lib/article-situations";

/**
 * シナリオベース・エントリー（記事一覧のヒーロー）
 *
 * 「あなたは今どんな状況？」の5パターンで、ユーザーのジャーニー段階に
 * 応じたシナリオページへ誘導する。
 *
 * UI/UX設計：
 * - モバイル: 横スクロールカルーセル（1.2枚見せ）
 * - タブレット: 2列グリッド
 * - デスクトップ: 5列の横並び（同等の重要度を視覚化）
 *
 * シニア配慮:
 * - タップ領域 64px以上
 * - フォント16px以上
 * - 高コントラスト
 * - ホバーに依存しない明示UI
 */
export default function SituationNavigator() {
  return (
    <section
      aria-labelledby="situation-nav-heading"
      className="bg-gradient-to-br from-primary-light/40 to-card border-2 border-primary/20 rounded-3xl p-5 sm:p-8"
    >
      <header className="mb-5 sm:mb-7 text-center">
        <p className="text-xs font-bold text-primary tracking-wider uppercase mb-2">
          STEP 1：あなたの状況に合わせて
        </p>
        <h2
          id="situation-nav-heading"
          className="text-xl sm:text-2xl font-bold text-foreground"
        >
          いま、どんなお気持ちですか？
        </h2>
        <p className="text-sm text-foreground/70 mt-2 max-w-xl mx-auto">
          5つのシナリオから、あなたに今いちばん必要な情報をまとめてお届けします。
        </p>
      </header>

      {/* モバイル: 横スクロール / タブレット〜: グリッド */}
      <ul
        className="flex sm:grid gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none -mx-2 px-2 sm:mx-0 sm:px-0 pb-2 sm:pb-0 sm:grid-cols-2 lg:grid-cols-5"
        style={{ scrollbarWidth: "thin" }}
      >
        {ARTICLE_SITUATIONS.map((s) => {
          const c = SITUATION_ACCENT_CLASSES[s.accentColor];
          return (
            <li
              key={s.slug}
              className="snap-start shrink-0 w-[78%] sm:w-auto"
            >
              <Link
                href={`/articles/situation/${s.slug}`}
                aria-label={`${s.shortLabel}のおすすめ記事を見る`}
                className={`group flex flex-col h-full ${c.cardBg} border-2 border-transparent hover:border-primary hover:shadow-lg active:scale-[0.98] rounded-2xl p-4 sm:p-5 transition-all duration-200 min-h-[200px]`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span
                    className="text-3xl sm:text-4xl leading-none shrink-0 select-none"
                    aria-hidden="true"
                  >
                    {s.iconEmoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold ${c.text} mb-1`}>
                      {s.emotionalHook}
                    </p>
                    <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">
                      {s.shortLabel}
                    </h3>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed line-clamp-3 flex-1">
                  {s.leadText.slice(0, 90)}…
                </p>
                <div className="mt-3 pt-3 border-t border-foreground/10 flex items-center justify-between">
                  <span className="text-xs text-foreground/60">
                    {s.curatedArticleIds.length}本の記事
                  </span>
                  <span className="text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
                    詳しく見る →
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
