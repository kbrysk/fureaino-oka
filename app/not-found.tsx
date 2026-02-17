import Link from "next/link";

/**
 * カスタム404ページ（Not Found）
 * URL誤入力時などに表示。トーンは優しさ・安心感で統一。
 */
export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 text-center">
      <p className="text-primary font-medium mb-2" aria-hidden>
        404
      </p>
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
        お探しのページは見つかりませんでした
      </h1>
      <p className="text-foreground/80 text-sm sm:text-base max-w-md mb-8">
        アドレスが変わったか、ページが存在しない可能性があります。
        トップページからお探しください。
      </p>
      <Link
        href="/"
        className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition"
      >
        トップページへ戻る
      </Link>
    </div>
  );
}
