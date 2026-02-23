import Link from "next/link";
import OwlCharacter from "./components/OwlCharacter";

/**
 * カスタム404ページ（App Router）
 * 存在しないURLアクセス時に表示。サイトのトーンに合わせた温かみのあるデザイン。
 */
export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 sm:py-24">
      <div className="max-w-md w-full flex flex-col items-center text-center space-y-8">
        {/* ふくろうキャラクター：エラー画面でも温かみを */}
        <OwlCharacter
          size={140}
          message="お探しのページが見つからなかったようです。トップからもう一度探してみてね。"
          tone="calm"
          bubblePosition="above"
        />

        {/* メッセージ */}
        <div className="space-y-2">
          <p className="text-xl font-bold text-primary">
            お探しのページは見つかりませんでした
          </p>
          <p className="text-sm text-foreground/70">
            URLが変更されたか、ページが存在しない可能性があります。
          </p>
        </div>

        {/* 目立つ導線：トップページへ戻る */}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 transition text-center shadow-sm"
        >
          トップページへ戻る
          <span className="text-lg" aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
