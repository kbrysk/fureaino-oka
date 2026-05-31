import Link from "next/link";
import { ARTICLE_SITUATIONS, SITUATION_ACCENT_CLASSES } from "../../lib/article-situations";

/**
 * シナリオベース・エントリー v2
 *
 * v1の致命欠点を修正：
 * - 5列横並びでテキスト折り返し崩壊 → 3列+2列の2行構成に
 * - カード高さ不足 → min-height 240px
 * - 文字小さすぎ → text-lg sm:text-xl に拡大
 * - 「STEP 1」事務的バッジ削除
 *
 * デバイス別：
 * - モバイル(< 640px): 1列縦並び
 * - タブレット(640-1024px): 2列グリッド
 * - デスクトップ(> 1024px): 3列+2列の2段組（最後の2枚を中央揃え）
 */
export default function SituationNavigator() {
  // 上段3枚 + 下段2枚に分割
  const topRow = ARTICLE_SITUATIONS.slice(0, 3);
  const bottomRow = ARTICLE_SITUATIONS.slice(3);

  return (
    <section aria-labelledby="situation-nav-heading">
      <header className="mb-6 sm:mb-8 text-center">
        <h2
          id="situation-nav-heading"
          className="text-2xl sm:text-3xl font-bold text-foreground"
        >
          いま、どんなお気持ちですか？
        </h2>
        <p className="text-sm sm:text-base text-foreground/70 mt-3 max-w-xl mx-auto leading-relaxed">
          5つの状況から、あなたに今いちばん必要な情報を<br className="hidden sm:inline" />
          まとめてお届けします。
        </p>
      </header>

      <div className="space-y-4 sm:space-y-5">
        {/* 上段：3枚 */}
        <ul className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topRow.map((s) => (
            <SituationCard key={s.slug} situation={s} />
          ))}
        </ul>
        {/* 下段：2枚（中央寄せのため max-w を制限） */}
        <ul className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-2 lg:max-w-[66.66%] lg:mx-auto">
          {bottomRow.map((s) => (
            <SituationCard key={s.slug} situation={s} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function SituationCard({ situation: s }: { situation: typeof ARTICLE_SITUATIONS[number] }) {
  const c = SITUATION_ACCENT_CLASSES[s.accentColor];
  return (
    <li>
      <Link
        href={`/articles/situation/${s.slug}`}
        aria-label={`${s.shortLabel}のおすすめ記事を見る`}
        className={`group flex flex-col h-full ${c.cardBg} border-2 border-foreground/5 hover:border-primary hover:shadow-lg active:scale-[0.99] rounded-2xl p-6 transition-all duration-200 min-h-[240px]`}
      >
        {/* アイコン */}
        <div className="text-5xl mb-3 leading-none select-none" aria-hidden="true">
          {s.iconEmoji}
        </div>
        {/* 感情フック */}
        <p className={`text-xs font-bold ${c.text} mb-2 tracking-wide`}>
          {s.emotionalHook}
        </p>
        {/* タイトル：2行までで切れる */}
        <h3 className="text-lg sm:text-xl font-bold text-foreground leading-snug mb-3">
          {s.shortLabel}
        </h3>
        {/* 説明 */}
        <p className="text-sm text-foreground/70 leading-relaxed flex-1">
          {s.leadText.slice(0, 65)}…
        </p>
        {/* フッター */}
        <div className="mt-4 pt-3 border-t border-foreground/10 flex items-center justify-between">
          <span className="text-xs text-foreground/55">
            {s.curatedArticleIds.length}本の厳選記事
          </span>
          <span className="text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
            見る →
          </span>
        </div>
      </Link>
    </li>
  );
}
