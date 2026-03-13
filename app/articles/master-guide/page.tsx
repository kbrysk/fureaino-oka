import type { Metadata } from "next";
import Link from "next/link";
import { pageTitle } from "../../lib/site-brand";
import { getCanonicalUrl } from "../../lib/site-url";
import { generateFaqSchema } from "../../lib/faq/schema";
import type { FaqItem } from "../../lib/faq/schema";
import MasterGuideFaqAccordion from "../../components/MasterGuideFaqAccordion";
import { LINE_ADD_URL } from "../../lib/site-brand";

export const metadata: Metadata = {
  title: pageTitle("実家じまい・生前整理のはじめかた完全ガイド【2026年最新】"),
  description:
    "実家じまい・生前整理を何から始めればいいか迷っていませんか？片付け・補助金・相続・業者選びまで、全手順をわかりやすく解説。無料診断ツールで今すぐ自分の状況を確認できます。",
  alternates: {
    canonical: getCanonicalUrl("/articles/master-guide"),
  },
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "生前整理と遺品整理の違いは何ですか？",
    answer:
      "生前整理は本人が元気なうちに自分の意思で行うもの、遺品整理は亡くなった後に遺族が行うものです。生前整理をしておくことで、遺族の負担を大幅に減らせます。",
  },
  {
    question: "何歳から始めるのが適切ですか？",
    answer:
      "「体が動くうちに」が基本です。60代前半で着手される方が最も多く、判断力・体力が十分なうちに進めることで、後悔のない整理ができます。",
  },
  {
    question: "費用はどのくらいかかりますか？",
    answer:
      "生前整理・遺品整理を業者に依頼する場合、間取りによって異なりますが1K〜1DKで3〜8万円、2LDK〜3LDKで10〜25万円が目安です。お住まいの地域の相場は地域ページでご確認いただけます。",
  },
  {
    question: "補助金は使えますか？",
    answer:
      "空き家の解体には自治体の補助金が使える場合があります。補助額・条件は市区町村によって異なります。地域ページから該当自治体の補助金情報をご確認ください。",
  },
];

export default function MasterGuidePage() {
  const faqSchema = generateFaqSchema(FAQ_ITEMS, {
    url: getCanonicalUrl("/articles/master-guide"),
  });

  return (
    <div className="space-y-10 sm:space-y-12 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* セクション1：ヒーロー */}
      <section className="rounded-2xl bg-gradient-to-b from-primary-light/10 to-transparent border border-primary/10 p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
          実家じまい・生前整理、何から始める？
        </h1>
        <p className="text-foreground/85 leading-relaxed mb-6">
          「そろそろ考えないと」と思いながら、何から手をつければいいか分からない——
          このページでは、全体の流れを3ステップで整理します。
        </p>
        <Link
          href="/tools/jikka-diagnosis"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white px-6 py-4 font-bold hover:opacity-90 transition"
        >
          まず30秒で現状診断する <span aria-hidden>→</span>
        </Link>
      </section>

      {/* セクション2：3ステップの全体像 */}
      <section aria-label="実家じまいの3ステップ">
        <h2 className="sr-only">3ステップの全体像</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="relative flex flex-col bg-card rounded-xl sm:rounded-2xl border-2 border-primary/20 p-4 sm:p-5 md:p-6 text-left shadow-sm hover:shadow-md hover:border-primary/30 transition-all min-w-0">
            <span className="absolute -top-2.5 sm:-top-3 left-4 sm:left-5 px-2 py-0.5 rounded-full bg-primary text-white text-[10px] sm:text-xs font-bold">
              Step 1
            </span>
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 mt-0.5 sm:mt-1">
              <span
                className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/15 text-primary shrink-0"
                aria-hidden
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </span>
              <h3 className="font-bold text-primary text-sm sm:text-base md:text-lg">
                【考える】エンディングノートで想いを整理する
              </h3>
            </div>
            <p className="text-base text-foreground/85 leading-relaxed flex-1">
              財産・医療・葬儀の希望を書き残すことで、家族の負担を大きく減らせます。
            </p>
            <Link href="/ending-note" className="mt-3 text-primary text-sm font-medium hover:underline inline-flex items-center gap-1">
              エンディングノートを書く <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="relative flex flex-col bg-card rounded-xl sm:rounded-2xl border-2 border-primary/20 p-4 sm:p-5 md:p-6 text-left shadow-sm hover:shadow-md hover:border-primary/30 transition-all min-w-0">
            <span className="absolute -top-2.5 sm:-top-3 left-4 sm:left-5 px-2 py-0.5 rounded-full bg-primary text-white text-[10px] sm:text-xs font-bold">
              Step 2
            </span>
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 mt-0.5 sm:mt-1">
              <span
                className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/15 text-primary shrink-0"
                aria-hidden
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </span>
              <h3 className="font-bold text-primary text-sm sm:text-base md:text-lg">
                【片付ける】生前整理・遺品整理を進める
              </h3>
            </div>
            <p className="text-base text-foreground/85 leading-relaxed flex-1">
              地域の業者に相談して、体力があるうちに計画的に進めましょう。
            </p>
            <Link href="/area" className="mt-3 text-primary text-sm font-medium hover:underline inline-flex items-center gap-1">
              地域の業者・費用を調べる <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="relative flex flex-col bg-card rounded-xl sm:rounded-2xl border-2 border-primary/20 p-4 sm:p-5 md:p-6 text-left shadow-sm hover:shadow-md hover:border-primary/30 transition-all min-w-0">
            <span className="absolute -top-2.5 sm:-top-3 left-4 sm:left-5 px-2 py-0.5 rounded-full bg-primary text-white text-[10px] sm:text-xs font-bold">
              Step 3
            </span>
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 mt-0.5 sm:mt-1">
              <span
                className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/15 text-primary shrink-0"
                aria-hidden
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </span>
              <h3 className="font-bold text-primary text-sm sm:text-base md:text-lg">
                【解決する】空き家・実家の処分を検討する
              </h3>
            </div>
            <p className="text-base text-foreground/85 leading-relaxed flex-1">
              補助金の活用・売却・解体など、損をしない選択肢を専門家と確認しましょう。
            </p>
            <Link href="/tools/empty-house-tax" className="mt-3 text-primary text-sm font-medium hover:underline inline-flex items-center gap-1">
              維持費を試算する <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* セクション3：無料診断ツール一覧 */}
      <section className="rounded-2xl border border-border bg-card overflow-hidden" aria-labelledby="master-guide-tools-heading">
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-border bg-primary-light/30">
          <h2 id="master-guide-tools-heading" className="font-bold text-primary text-lg sm:text-xl">
            まず、あなたの状況を無料で診断する
          </h2>
        </div>
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/tools/jikka-diagnosis"
            className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary-light/10 transition"
          >
            <span className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0" aria-hidden>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            </span>
            <div className="min-w-0 flex-1">
              <span className="font-bold text-foreground block">実家じまい力診断</span>
              <span className="text-sm text-foreground/70">約10問でリスク度を診断</span>
            </div>
            <span className="text-primary shrink-0" aria-hidden>→</span>
          </Link>
          <Link
            href="/tools/akiya-risk"
            className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary-light/10 transition"
          >
            <span className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0" aria-hidden>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </span>
            <div className="min-w-0 flex-1">
              <span className="font-bold text-foreground block">空き家リスク診断</span>
              <span className="text-sm text-foreground/70">約8問で空き家リスクを診断</span>
            </div>
            <span className="text-primary shrink-0" aria-hidden>→</span>
          </Link>
          <Link
            href="/tools/souzoku-prep"
            className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary-light/10 transition"
          >
            <span className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0" aria-hidden>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </span>
            <div className="min-w-0 flex-1">
              <span className="font-bold text-foreground block">相続準備力診断</span>
              <span className="text-sm text-foreground/70">約10問で相続の準備度を診断</span>
            </div>
            <span className="text-primary shrink-0" aria-hidden>→</span>
          </Link>
          <Link
            href="/tools/digital-shame"
            className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary-light/10 transition"
          >
            <span className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0" aria-hidden>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </span>
            <div className="min-w-0 flex-1">
              <span className="font-bold text-foreground block">デジタル遺品リスク診断</span>
              <span className="text-sm text-foreground/70">見られたくないデータのリスクを診断</span>
            </div>
            <span className="text-primary shrink-0" aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* セクション4：地域から探す */}
      <section className="rounded-2xl border border-border bg-card p-6 sm:p-8" aria-labelledby="master-guide-area-heading">
        <h2 id="master-guide-area-heading" className="font-bold text-primary text-lg sm:text-xl mb-3">
          お住まいの地域で業者・補助金を調べる
        </h2>
        <p className="text-foreground/85 leading-relaxed mb-6">
          全国の市区町村ごとに、粗大ゴミの出し方・補助金情報・遺品整理の相場をまとめています。
        </p>
        <Link
          href="/area"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-white px-6 py-4 font-bold hover:opacity-90 transition"
        >
          地域を選んで調べる <span aria-hidden>→</span>
        </Link>
      </section>

      {/* セクション5：よくある質問 */}
      <MasterGuideFaqAccordion items={FAQ_ITEMS} heading="よくある質問" />

      {/* セクション6：LINE誘導 */}
      <section className="rounded-2xl border-2 border-[#06C755]/40 bg-[#06C755]/5 p-6 sm:p-8" aria-labelledby="master-guide-line-heading">
        <h2 id="master-guide-line-heading" className="font-bold text-primary text-lg sm:text-xl mb-2">
          無料ガイドブック（PDF）をLINEでお届けします
        </h2>
        <p className="text-foreground/80 text-sm sm:text-base mb-6">
          失敗しない実家じまいの進め方やチェックリストを、LINEで無料で受け取れます。
        </p>
        <a
          href={LINE_ADD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#06C755] text-white px-6 py-4 rounded-xl font-bold hover:opacity-90 transition"
        >
          LINEで無料受け取る <span aria-hidden>→</span>
        </a>
      </section>
    </div>
  );
}
