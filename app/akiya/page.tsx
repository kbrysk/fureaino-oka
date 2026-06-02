import type { Metadata } from "next";
import Link from "next/link";
import EmptyHouseTaxSimulator from "../components/EmptyHouseTaxSimulator";
import ArticleInlineAppraisalCTA from "../components/articles/ArticleInlineAppraisalCTA";
import { pageTitle } from "../lib/site-brand";
import { getCanonicalUrl, getCanonicalBase } from "../lib/site-url";
import { generateBreadcrumbSchema } from "../lib/schema/breadcrumb";
import {
  getCoverageSummary,
  getAmountStatsSummary,
  formatYenAsMan,
  STATS_AS_OF,
  STATS_CREDIT,
} from "../lib/data/municipality-stats";

/**
 * 【ピラー②：空き家・不動産処分ハブ】＝収益の心臓部
 *
 * MASTER_STRATEGY_2026 / PANEL_02 の核心：
 *  「②空き家ハブが収益の主戦場。最強CTRの tax-simulator・47位の解体補助金・
 *    空き家系記事・査定アフィが全てここに集まる。今このハブが存在しないことが
 *    最大の機会損失」
 *
 * このページは、サイトの最重要資産（tax-simulator・補助金データ・空き家記事・
 * 不動産査定アフィ）を1つのトピッククラスターに束ねる中核ピラー。
 * 「空き家・実家をどうするか（売る/貸す/解体/管理）」の意思決定に伴走し、
 * 最終的に不動産査定（¥5,000実証ルート）へ合流させる。
 */

const PAGE_PATH = "/akiya";

export function generateMetadata(): Metadata {
  const url = getCanonicalUrl(PAGE_PATH);
  const title =
    "空き家・実家をどうする？売る・貸す・解体・管理の判断ガイド｜固定資産税シミュレーター";
  const description =
    "相続した空き家・実家を「売る／貸す／解体する／管理する」の4つの選択肢から、損しない判断を。固定資産税が今いくらか・特定空家で6倍になる前にを1分で試算。全国1,726自治体の解体補助金データ・無料査定にも対応。";
  return {
    title: pageTitle(title),
    description,
    alternates: { canonical: url },
    openGraph: { title: pageTitle(title), description, url, type: "website" },
  };
}

const CHOICES = [
  {
    icon: "💰",
    key: "sell",
    title: "売る（売却）",
    lead: "解体費用がかからず、買主が活用方法を決める。相続から3年以内なら3,000万円特別控除を使える可能性。",
    pros: ["まとまった現金になる", "固定資産税・管理の負担から解放", "古家付き土地でも売れる"],
    cons: ["立地・状態で価格が大きく変わる", "売れるまで時間がかかることも"],
    next: { label: "まず無料査定で価値を知る", href: "#appraisal-section" },
  },
  {
    icon: "🏚️",
    key: "demolish",
    title: "解体して更地",
    lead: "木造30坪で90万〜150万円が目安。自治体の解体補助金で自己負担を減らせる場合も。ただし更地は住宅用地特例が外れ固定資産税が上がる。",
    pros: ["危険・倒壊リスクを解消", "更地は売りやすくなることも", "補助金で費用を圧縮できる場合"],
    cons: ["解体費用がかかる", "更地化で固定資産税が最大6倍に"],
    next: { label: "地域の解体補助金を調べる", href: "/area" },
  },
  {
    icon: "🔑",
    key: "rent",
    title: "貸す（賃貸・活用）",
    lead: "家賃収入で固定資産税を相殺できる可能性。リフォーム費用・空室リスク・管理の手間を見極めて。",
    pros: ["保有しながら収入を得られる", "資産を手放さずに済む"],
    cons: ["リフォーム初期費用", "空室・滞納・管理のリスク"],
    next: { label: "活用の選択肢を詳しく読む", href: "/articles/akiya-katsuyou" },
  },
  {
    icon: "🛡️",
    key: "manage",
    title: "管理して保有",
    lead: "すぐ決められない時の選択。ただし放置は「特定空家」指定→固定資産税6倍・行政指導のリスク。管理委託の費用も発生。",
    pros: ["時間をかけて判断できる", "思い出の家を残せる"],
    cons: ["固定資産税・管理費が続く", "放置で特定空家のリスク"],
    next: { label: "空き家管理の方法と費用", href: "/articles/akiya-kanri" },
  },
];

const CLUSTER_ARTICLES = [
  { href: "/articles/akiya-souzoku-4sentakushi", title: "実家を相続したら｜売却・賃貸・解体・所有の4選択肢を4軸で判断", tag: "判断軸" },
  { href: "/articles/tokutei-akiya", title: "特定空き家とは？指定基準・固定資産税6倍への影響と今できる対策", tag: "リスク" },
  { href: "/articles/jikka-kotei-shisanzei-taisaku", title: "実家の固定資産税対策ガイド｜住宅用地特例・改正空家法の影響", tag: "税金" },
  { href: "/articles/akiya-kaitai-hiyou", title: "空き家の解体費用はいくら？相場・補助金・解体後の固定資産税", tag: "費用" },
  { href: "/articles/akiya-kaitai-hojokin", title: "空き家の解体補助金とは？対象条件・補助額の目安・申請の流れ", tag: "補助金" },
  { href: "/articles/akiya-shobun", title: "空き家の処分方法まとめ｜売却・解体・譲渡の選び方と対処", tag: "処分" },
  { href: "/articles/fudosan-baikyaku-nagare", title: "不動産売却の流れ完全ガイド｜査定〜引き渡しの全7ステップ", tag: "売却" },
  { href: "/articles/fudosan-satei", title: "実家・空き家の不動産査定｜机上査定と訪問査定の違い・複数社比較のコツ", tag: "査定" },
  { href: "/articles/akiya-bank-toha", title: "空き家バンクとは｜国・自治体の仕組みと登録の流れ・メリット", tag: "活用" },
  { href: "/articles/akiya-katsuyou", title: "空き家活用の方法まとめ｜賃貸・民泊・売却との比較", tag: "活用" },
];

const TOOLS = [
  { href: "/tools/empty-house-tax", icon: "🧮", title: "空き家固定資産税シミュレーター", sub: "今の税額・特定空家化・解体後を3パターン比較" },
  { href: "/tools/akiya-risk", icon: "⚠️", title: "空き家リスク診断", sub: "約8問で特定空家リスクを診断" },
  { href: "/tools/appraisal", icon: "📷", title: "写真で査定（AI）", sub: "写真を送るだけで概算がわかる" },
];

export default function AkiyaPillarPage() {
  const base = getCanonicalBase();
  const coverage = getCoverageSummary();
  const amount = getAmountStatsSummary();
  const avgMan = amount.averageYen ? formatYenAsMan(amount.averageYen) : "—";

  const breadcrumb = generateBreadcrumbSchema([
    { name: "ホーム", url: `${base}/` },
    { name: "空き家・不動産", url: `${base}${PAGE_PATH}` },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12 sm:space-y-16 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* ヒーロー */}
      <header>
        <nav className="text-sm text-foreground/60 mb-4">
          <Link href="/" className="hover:text-primary">トップ</Link>
          <span className="mx-2">/</span>
          <span>空き家・不動産</span>
        </nav>
        <h1 className="text-2xl sm:text-4xl font-bold text-primary leading-tight mb-4">
          空き家・実家を「どうする？」<br className="hidden sm:inline" />
          売る・貸す・解体・管理を、損せず決める
        </h1>
        <p className="text-base sm:text-lg text-foreground/80 leading-relaxed">
          相続した実家、住む人のいなくなった空き家——
          <strong>固定資産税を払い続けるか、売るか、解体するか。</strong>
          判断を先延ばしにすると「特定空家」に指定され、固定資産税が最大6倍になることも。
          このページで、あなたの状況に合った「次の一歩」を、営業されずに自分で確かめられます。
        </p>
      </header>

      {/* データの堀：全国補助金サマリ（AI Overview/信頼の主要数値） */}
      <section className="rounded-2xl border border-primary/20 bg-primary-light/10 p-5 sm:p-6">
        <p className="text-xs font-bold text-foreground/50 mb-3">
          ふれあいの丘 独自調査（全国{coverage.total.toLocaleString("ja-JP")}自治体・{STATS_AS_OF}）
        </p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-primary">{coverage.withSubsidy}</p>
            <p className="text-xs text-foreground/60 mt-1">自治体に解体補助金<br />（全体の{coverage.withSubsidyPercent}%）</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-primary">約{avgMan}</p>
            <p className="text-xs text-foreground/60 mt-1">補助金上限額の<br />全国平均</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-700">最大6倍</p>
            <p className="text-xs text-foreground/60 mt-1">特定空家指定で<br />固定資産税が上昇</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 justify-center">
          <Link href="/data/akiya-hojokin-ranking" className="text-sm font-bold text-primary hover:underline">
            全国の解体補助金ランキングを見る →
          </Link>
          <Link href="/area" className="text-sm font-bold text-primary hover:underline">
            お住まいの地域の補助金を調べる →
          </Link>
        </div>
      </section>

      {/* 最強ツール埋め込み：固定資産税シミュレーター（収束1で強化済） */}
      <section aria-labelledby="sim-heading">
        <h2 id="sim-heading" className="text-xl sm:text-2xl font-bold text-foreground mb-2">
          まず「今いくら？特定空家になるといくら？」を試算
        </h2>
        <p className="text-sm text-foreground/70 mb-4 leading-relaxed">
          建物の情報を選ぶと、今の固定資産税に加え、特定空家に指定された場合・解体して更地にした場合の3パターンを比較できます。
        </p>
        <EmptyHouseTaxSimulator compact={false} />
      </section>

      {/* 4つの選択肢 */}
      <section aria-labelledby="choices-heading">
        <h2 id="choices-heading" className="text-xl sm:text-2xl font-bold text-foreground mb-2">
          空き家・実家、4つの選択肢を比較する
        </h2>
        <p className="text-sm text-foreground/70 mb-5 leading-relaxed">
          正解は人によって違います。それぞれのメリット・デメリットと「次の一歩」を整理しました。
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {CHOICES.map((c) => (
            <article key={c.key} className="rounded-2xl border border-border bg-card p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl select-none" aria-hidden>{c.icon}</span>
                <h3 className="text-lg font-bold text-foreground">{c.title}</h3>
              </div>
              <p className="text-sm text-foreground/75 leading-relaxed mb-3">{c.lead}</p>
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div>
                  <p className="font-bold text-emerald-700 mb-1">メリット</p>
                  <ul className="space-y-0.5 text-foreground/70 list-disc list-inside">
                    {c.pros.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-red-700 mb-1">注意点</p>
                  <ul className="space-y-0.5 text-foreground/70 list-disc list-inside">
                    {c.cons.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                </div>
              </div>
              <Link
                href={c.next.href}
                className="mt-auto inline-flex items-center justify-center gap-1 rounded-lg bg-primary-light/40 hover:bg-primary hover:text-white border border-primary/20 px-4 py-2.5 text-sm font-bold text-primary transition"
              >
                {c.next.label} <span aria-hidden>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* 査定CTA（収益の出口） */}
      <ArticleInlineAppraisalCTA variant="akiya" />

      {/* 記事クラスター */}
      <section aria-labelledby="cluster-heading">
        <h2 id="cluster-heading" className="text-xl sm:text-2xl font-bold text-foreground mb-2">
          空き家・不動産処分をもっと深く知る
        </h2>
        <p className="text-sm text-foreground/70 mb-5">
          判断に必要な知識を、テーマ別の記事で詳しく解説しています。
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {CLUSTER_ARTICLES.map((a) => (
            <li key={a.href}>
              <Link
                href={a.href}
                className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:shadow-sm transition"
              >
                <span className="shrink-0 mt-0.5 text-[10px] font-bold text-primary bg-primary-light/50 rounded px-2 py-0.5">
                  {a.tag}
                </span>
                <span className="text-sm font-medium text-foreground/85 group-hover:text-primary leading-snug">
                  {a.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ツール群 */}
      <section aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="text-xl sm:text-2xl font-bold text-foreground mb-5">
          無料の診断・試算ツール
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {TOOLS.map((t) => (
            <li key={t.href}>
              <Link
                href={t.href}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 hover:-translate-y-0.5 hover:shadow-md transition"
              >
                <span className="text-3xl mb-2 leading-none select-none" aria-hidden>{t.icon}</span>
                <span className="font-bold text-foreground group-hover:text-primary">{t.title}</span>
                <span className="mt-1 text-xs text-foreground/60 leading-relaxed">{t.sub}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 関連ピラーへの導線 */}
      <nav aria-label="関連ガイド" className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-base font-bold text-foreground mb-3">関連するガイド</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/articles/master-guide" className="text-primary hover:underline">
              実家じまい・生前整理のはじめかた完全ガイド
            </Link>
          </li>
          <li>
            <Link href="/area" className="text-primary hover:underline">
              全国の市区町村別 補助金・粗大ゴミ・費用相場
            </Link>
          </li>
          <li>
            <Link href="/data/akiya-hojokin-ranking" className="text-primary hover:underline">
              【全国調査】空き家解体補助金ランキング（1,726自治体）
            </Link>
          </li>
        </ul>
      </nav>

      <footer className="pt-6 border-t border-border text-xs text-foreground/50 leading-relaxed">
        <p>
          ※本ページの税額・補助金額は{STATS_AS_OF}の概算・目安です（{STATS_CREDIT}）。実際の金額は評価額・市区町村により異なります。正確な情報は各自治体の窓口・固定資産税の課税明細でご確認ください。個別の相続税・節税の判断は税理士等の専門家へご相談ください。
        </p>
      </footer>
    </div>
  );
}
