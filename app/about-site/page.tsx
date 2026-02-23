import type { Metadata } from "next";
import Link from "next/link";
import { pageTitle, SITE_NAME_LOGO } from "../lib/site-brand";

export const metadata: Metadata = {
  title: pageTitle("生前整理支援センター ふれあいの丘とは"),
  description: `「ふれあいの丘」は、エンディングノート・生前整理・遺品整理・実家じまい・空き家相談まで、あなたの段階に合わせた無料ツールと専門家紹介をご提供するサイトです。`,
};

export default function AboutSitePage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <p className="text-sm text-foreground/60 mb-6">
        <Link href="/" className="hover:text-primary transition">トップ</Link>
        <span className="mx-2">/</span>
        <span>ふれあいの丘とは</span>
      </p>

      <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
        生前整理支援センター ふれあいの丘とは
      </h1>
      <p className="text-foreground/80 leading-relaxed mb-10">
        このサイトは、<strong>「モノの整理」だけでなく「心の整理」も</strong>サポートする、生前整理・実家じまいの総合情報サイトです。何から始めればいいかわからない方から、すでに片付けや売却を検討している方まで、あなたの段階に合わせて使える無料ツールと専門家への窓口を用意しています。
      </p>

      <section className="space-y-8">
        <h2 className="text-xl font-bold text-primary border-b-2 border-primary/20 pb-2">
          このサイトでできること
        </h2>

        {/* Step 1: 考える */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary text-white text-xs font-bold mb-3">Step 1</span>
          <h3 className="text-lg font-bold text-primary mb-2">【考える】エンディングノート・心の整理</h3>
          <p className="text-foreground/80 text-sm leading-relaxed mb-4">
            自分の想いや希望を残したい、資産や連絡先を整理しておきたい方に向けて、デジタル版エンディングノートや書き方ガイドを無料で提供しています。将来の不安を「形に残す」第一歩をサポートします。
          </p>
          <Link href="/ending-note" className="text-primary text-sm font-medium hover:underline">
            エンディングノートを書く →
          </Link>
        </div>

        {/* Step 2: 片付ける */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary text-white text-xs font-bold mb-3">Step 2</span>
          <h3 className="text-lg font-bold text-primary mb-2">【片付ける】生前整理・遺品整理</h3>
          <p className="text-foreground/80 text-sm leading-relaxed mb-4">
            体力があるうちに自分の持ち物を整理したい方、親族の遺品整理でお困りの方に向けて、地域別の粗大ゴミ案内・補助金情報・遺品整理の相場や業者選びのポイントを掲載。プロの選別で大切な思い出を守るための情報をまとめています。
          </p>
          <Link href="/area" className="text-primary text-sm font-medium hover:underline">
            地域別の案内を見る →
          </Link>
        </div>

        {/* Step 3: 解決する */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary text-white text-xs font-bold mb-3">Step 3</span>
          <h3 className="text-lg font-bold text-primary mb-2">【解決する】実家じまい・空き家活用</h3>
          <p className="text-foreground/80 text-sm leading-relaxed mb-4">
            空き家の補助金活用、売却・査定の目安、固定資産税のシミュレーションなど、損をしない家のしまい方に役立つ無料ツールを提供。必要に応じて、税理士・司法書士・不動産・遺品整理業者など専門家への無料相談窓口もご案内しています。
          </p>
          <Link href="/guide" className="text-primary text-sm font-medium hover:underline">
            専門家に相談する →
          </Link>
        </div>

        {/* 無料ツール一覧 */}
        <div className="bg-primary-light/30 rounded-2xl border border-primary/20 p-6">
          <h3 className="text-lg font-bold text-primary mb-2">無料ツールで、まずは自分でできることから</h3>
          <p className="text-foreground/80 text-sm leading-relaxed mb-4">
            実家じまい力診断・空き家リスク診断・法定相続分シミュレーター・空き家税金シミュレーター・資産・査定の目安・法要カレンダー・デジタル遺品リスク診断など、匿名のまま利用できる無料ツールを多数用意しています。
          </p>
          <Link href="/tools" className="inline-block bg-primary text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:opacity-90 transition">
            無料ツール一覧を見る
          </Link>
        </div>

        {/* 運営方針 */}
        <div className="pt-4">
          <h3 className="text-lg font-bold text-primary mb-3">運営方針</h3>
          <p className="text-foreground/80 text-sm leading-relaxed">
            {SITE_NAME_LOGO}は、株式会社Kogeraが運営しています。利用者様からの相談料はいただかず、提携事業者からの紹介料で運営しているため、<strong>サイト上のツール・情報・相談窓口の利用はすべて無料</strong>です。電話勧誘やしつこい営業は行わず、必要な方だけが専門家につながれるよう心がけています。
          </p>
        </div>
      </section>

      <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4">
        <Link
          href="/"
          className="inline-block bg-primary-light text-primary px-5 py-2.5 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
        >
          トップへ戻る
        </Link>
        <Link
          href="/about"
          className="inline-block text-foreground/70 hover:text-primary text-sm font-medium transition"
        >
          運営者情報を見る →
        </Link>
      </div>
    </div>
  );
}
