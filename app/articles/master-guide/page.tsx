import type { Metadata } from "next";
import Link from "next/link";
import { pageTitle } from "../../lib/site-brand";
import { getCanonicalUrl, getCanonicalBase } from "../../lib/site-url";
import { generateBreadcrumbSchema } from "../../lib/schema/breadcrumb";
import { generateHowToSchema } from "../../lib/schema/howto";
import { generateFaqSchema } from "../../lib/faq/schema";
import type { FaqItem } from "../../lib/faq/schema";
import MasterGuideFaqAccordion from "../../components/MasterGuideFaqAccordion";
import { PageLead } from "../../components/PageLead";
import ArticleInlineAppraisalCTA from "../../components/articles/ArticleInlineAppraisalCTA";
import { LINE_ADD_URL } from "../../lib/site-brand";

export const metadata: Metadata = {
  title: pageTitle("【2026年最新】実家じまい・生前整理のはじめかた完全ガイド｜何から始めるかがわかる"),
  description:
    "「そろそろ実家をどうにかしないと」と思いながら何から手をつければいいか分からない方へ。片付け・補助金・相続・業者選びまでの全手順を3ステップで解説。無料診断ツールで今すぐ現状確認できます。",
  alternates: {
    canonical: getCanonicalUrl("/articles/master-guide"),
  },
  openGraph: {
    title: "実家じまい・生前整理のはじめかた完全ガイド｜ふれあいの丘",
    description: "片付け・補助金・相続・業者選びまでの全手順を3ステップで解説。",
    url: getCanonicalUrl("/articles/master-guide"),
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
  const base = getCanonicalBase();
  const breadcrumb = generateBreadcrumbSchema([
    { name: "ホーム", url: `${base}/` },
    { name: "記事", url: `${base}/articles` },
    { name: "実家じまい・生前整理のはじめかた", url: `${base}/articles/master-guide` },
  ]);
  const faqSchema = generateFaqSchema(FAQ_ITEMS, {
    url: getCanonicalUrl("/articles/master-guide"),
  });

  const howToSchema = generateHowToSchema({
    name: "実家じまい・生前整理のはじめかた",
    description: "実家じまいや生前整理を、何から始めればいいか迷っている方のための3ステップガイドです。",
    url: `${base}/articles/master-guide`,
    steps: [
      {
        name: "Step 1：エンディングノートで想いを整理する",
        text: "財産・医療・葬儀の希望を書き残すことで、家族の負担を大きく減らせます。まずはデジタルエンディングノートで現状を整理しましょう。",
        url: `${base}/ending-note`,
      },
      {
        name: "Step 2：生前整理・遺品整理を進める",
        text: "体力があるうちに、地域の専門業者に相談しながら計画的に進めましょう。地域ページで費用相場と業者情報を確認できます。",
        url: `${base}/area`,
      },
      {
        name: "Step 3：空き家・実家の処分を検討する",
        text: "補助金の活用・売却・解体など、損をしない選択肢を専門家と確認します。まず維持費のシミュレーターで現状を把握しましょう。",
        url: `${base}/tools/empty-house-tax`,
      },
    ],
  });

  return (
    <div className="space-y-10 sm:space-y-12 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* セクション1：ヒーロー */}
      <section className="rounded-2xl bg-gradient-to-b from-primary-light/10 to-transparent border border-primary/10 p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
          実家じまい・生前整理、何から始める？
        </h1>
        <PageLead text="実家じまい・生前整理を何から始めるかを、3ステップでわかりやすく解説します。" />
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

      {/* セクション2.5：生前整理アドバイザー2級が教える「進め方」（監修者の専門性を本文で示す） */}
      <section aria-labelledby="seizenseiri-method-heading" className="rounded-2xl border border-primary/15 bg-gradient-to-b from-primary-light/10 to-transparent p-6 sm:p-8">
        <p className="text-xs font-bold text-primary/70 mb-2 tracking-wide">生前整理アドバイザー2級 監修</p>
        <h2 id="seizenseiri-method-heading" className="text-xl sm:text-2xl font-bold text-primary mb-3">
          そもそも「生前整理」とは？後悔しない進め方の基本
        </h2>
        <p className="text-foreground/85 leading-relaxed mb-6">
          生前整理は、元気なうちに<strong>「モノ・心・情報」</strong>を整理し、これからの人生をより豊かにするための前向きな活動です。
          「人生の終わりの準備」ではありません。大切なのは、片付けそのものより
          <strong>「自分にとって何が必要かを見つめ直す時間」</strong>を持つことです。生前整理アドバイザー協会で学ぶ基本の考え方を、順にご紹介します。
        </p>

        {/* 3領域 */}
        <div className="grid gap-4 sm:grid-cols-3 mb-7">
          <div className="rounded-xl bg-white border border-primary/15 p-4">
            <p className="text-2xl mb-1" aria-hidden>📦</p>
            <h3 className="font-bold text-foreground mb-1">モノの整理</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">家財・日用品・思い出の品。「量」を減らすことより、自分の基準で選び直すことが目的です。</p>
          </div>
          <div className="rounded-xl bg-white border border-primary/15 p-4">
            <p className="text-2xl mb-1" aria-hidden>💝</p>
            <h3 className="font-bold text-foreground mb-1">心の整理</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">モノを通して人生を振り返り、これからどう生きたいかを考える。生前整理のいちばん大切な部分です。</p>
          </div>
          <div className="rounded-xl bg-white border border-primary/15 p-4">
            <p className="text-2xl mb-1" aria-hidden>🗂️</p>
            <h3 className="font-bold text-foreground mb-1">情報の整理</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">預貯金・保険・契約・スマホのIDなど。家族が困らないよう「在りか」をまとめておきます。</p>
          </div>
        </div>

        {/* 使う・使わない */}
        <div className="rounded-xl bg-amber-50/60 border border-amber-200/60 p-5 mb-7">
          <h3 className="font-bold text-amber-900/90 mb-2">コツ：「いる・いらない」ではなく「使う・使わない」で分ける</h3>
          <p className="text-sm text-foreground/80 leading-relaxed">
            「いるか・いらないか」で考えると、手が止まり、罪悪感も生まれます。生前整理では
            <strong>「今の自分が使っているか・使っていないか」</strong>という事実で分けます。
            判断がぐっと軽くなり、後悔も減ります。使っていないけれど手放せない思い出の品は、無理に捨てず「残す」と決めてよいのです。
          </p>
        </div>

        {/* 5つの実践法 */}
        <h3 className="font-bold text-foreground mb-3">生前整理アドバイザー協会で学ぶ「5つの実践法」</h3>
        <ol className="space-y-2.5 mb-2">
          {[
            ["①分ける（4分類）", "全部を一度に片付けようとせず、まず「使う・使わない・移す・保留」のように分けるだけ。判断と作業を切り分けます。"],
            ["②思い入れ箱", "捨てられない思い出の品は、決めた大きさの箱1つに入る分だけ残す。「全部捨てる」でなく「選んで残す」ことで心が軽くなります。"],
            ["③ベストショットアルバム", "大量の写真は、お気に入りだけを選んで1冊に。残った人にとっても見やすく、思い出が引き継がれます。"],
            ["④人生振り返りノート", "自分の歩みを年表のように書き出す。これからやりたいことが見え、整理の目的がはっきりします。"],
            ["⑤お焚き上げ", "人形・手紙など、ゴミとして手放しにくい物は供養して手放す方法も。気持ちの区切りになります。"],
          ].map(([t, d]) => (
            <li key={t} className="flex gap-3">
              <span className="shrink-0 font-bold text-primary">{t}</span>
              <span className="text-sm text-foreground/75 leading-relaxed">{d}</span>
            </li>
          ))}
        </ol>
        <p className="text-sm text-foreground/70 leading-relaxed mt-4">
          そして何より<strong>「小さく始める」</strong>こと。1日5分、引き出し1つからで十分です。完璧を目指さず、続けられる範囲で進めるのが、後悔しない生前整理のいちばんのコツです。
        </p>
      </section>

      {/* セクション2.6：運営者・大久保の現場視点（Experience＝一次体験の明示） */}
      <section aria-labelledby="okubo-voice-heading" className="rounded-2xl border-l-4 border-primary bg-card p-6 sm:p-7">
        <h2 id="okubo-voice-heading" className="text-base sm:text-lg font-bold text-primary mb-3">
          運営者・大久保からのひとこと
        </h2>
        <div className="space-y-3 text-foreground/85 leading-relaxed text-sm sm:text-base">
          <p>
            生前整理の相談を受けていて、いちばん多いのが<strong>「何から手をつければいいか分からない」</strong>という声です。
            実は、多くの方がつまずくのは「片付けの技術」ではなく、<strong>親子で話を切り出すこと</strong>と、
            <strong>判断の基準が決まっていないこと</strong>の2つです。
          </p>
          <p>
            だから私たちは、いきなり「捨てましょう」とは言いません。まずは
            <strong>「使っているか・使っていないか」だけ</strong>を一緒に確認し、思い出の品は無理に手放さなくていいとお伝えします。
            親御さんが「これはまだ使う」と言うなら、それは残してよいのです。整理は喧嘩のためではなく、家族が安心するために行うものだからです。
          </p>
          <p>
            そして、片付けが進むと必ず出てくるのが<strong>「空き家になった実家をどうするか」「固定資産税はいくらか」</strong>といった、
            お金と不動産の悩みです。生前整理は、片付けだけで終わりません。だからこのサイトでは、片付けの先にある
            税金・補助金・売却の判断材料まで、ひとつなぎでご用意しています。
          </p>
        </div>
        <p className="mt-4 text-xs text-foreground/55">
          ふれあいの丘 総合監修・運営者　大久保 亮佑（株式会社Kogera 代表取締役／生前整理アドバイザー2級）
          <br />
          ※相続税・不動産・登記など専門領域は、各分野の有資格者・公的情報に基づいてご案内しています。
        </p>
      </section>

      {/* セクション2.7：このサイトだからできること（独自性＝information gain） */}
      <section aria-labelledby="unique-heading" className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-border bg-primary-light/30">
          <h2 id="unique-heading" className="font-bold text-primary text-lg sm:text-xl">
            ふれあいの丘だからできること
          </h2>
        </div>
        <div className="p-5 sm:p-6 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-2xl mb-1" aria-hidden>📊</p>
            <h3 className="font-bold text-foreground mb-1">全国1,726自治体の独自調査</h3>
            <p className="text-sm text-foreground/70 leading-relaxed mb-2">
              空き家の解体補助金がある自治体は全体の<strong>48.9%</strong>。市区町村ごとの補助額を独自に調べて公開しています。
            </p>
            <Link href="/data/akiya-hojokin-ranking" className="text-sm font-bold text-primary hover:underline">補助金ランキングを見る →</Link>
          </div>
          <div>
            <p className="text-2xl mb-1" aria-hidden>🧮</p>
            <h3 className="font-bold text-foreground mb-1">独自の試算ツール</h3>
            <p className="text-sm text-foreground/70 leading-relaxed mb-2">
              「今の固定資産税」「特定空家になった場合」「解体した場合」を<strong>3パターンで比較</strong>。営業されずに自分で数字を確かめられます。
            </p>
            <Link href="/tools/empty-house-tax" className="text-sm font-bold text-primary hover:underline">固定資産税を試算する →</Link>
          </div>
          <div>
            <p className="text-2xl mb-1" aria-hidden>🔗</p>
            <h3 className="font-bold text-foreground mb-1">片付け〜売却まで横断</h3>
            <p className="text-sm text-foreground/70 leading-relaxed mb-2">
              片付け・補助金・相続・空き家売却を<strong>1か所で</strong>。葬儀・査定・解体がバラバラな大手と違い、連続した悩みに伴走します。
            </p>
            <Link href="/akiya" className="text-sm font-bold text-primary hover:underline">空き家・不動産の判断へ →</Link>
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

      {/* 大型導線：不動産無料査定（ノムコム A8） — 全記事の集約地点で配置 */}
      <ArticleInlineAppraisalCTA variant="jikka" />

      {/* セクション5：よくある質問 */}
      <MasterGuideFaqAccordion items={FAQ_ITEMS} heading="よくある質問" />

      {/* セクション6：LINE誘導 */}
      <section className="rounded-2xl border-2 border-[#06C755]/40 bg-[#06C755]/5 p-6 sm:p-8" aria-labelledby="master-guide-line-heading">
        <h2 id="master-guide-line-heading" className="font-bold text-primary text-lg sm:text-xl mb-2">
          無料ガイドブック（PDF）をLINEでお届けします
        </h2>
        <p className="text-foreground/80 text-base mb-6">
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
