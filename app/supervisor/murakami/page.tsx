import type { Metadata } from "next";
import Link from "next/link";

/**
 * 監修者プロフィール（村上充恵 様）— 実装オプション（ドラフト）
 *
 * これは「監修者の見せ方」の実Next.js版オプションです。ナビ・フッター等の共有コンポーネントは
 * 改変しておらず、このページ単体（未配線）として追加しています。/supervisor/murakami で表示できます。
 * 本番化の前に、お写真・ふりがな・経歴の細部を村上様にご確認いただく前提のたたき台です。
 *
 * 注意:
 *  - 現状 robots: noindex（ドラフトのため検索インデックスを抑止）。本番化時に解除。
 *  - フッターの総合監修クレジット等の統合は docs/SUPERVISOR_DEMO_OPTIONS_AND_DECISIONS.md の手順参照。
 */

const PERSON_NAME = "村上 充恵";
const PERSON_TITLE = "総合監修者（編集方針）／生前整理アドバイザー指導員";

export const metadata: Metadata = {
  title: "監修者紹介 村上充恵｜生前整理支援センター ふれあいの丘",
  description:
    "ふれあいの丘の総合監修者・村上充恵のプロフィール。生前整理普及協会認定指導員・AFP・介護離職防止対策アドバイザー。介護離職・実家じまいを自ら経験した当事者として、生前整理の編集方針を総合監修しています。",
  robots: { index: false, follow: false }, // ドラフトのため。本番化時に解除。
};

const CREDENTIALS = [
  "(一社)生前整理普及協会 認定指導員",
  "AFP（日本FP協会）",
  "介護離職防止対策アドバイザー",
  "神奈川大学エクステンション講座 講師",
  "ル・リアン横浜 主宰",
];

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "村上充恵",
  jobTitle: "生前整理アドバイザー指導員",
  description:
    "生前整理普及協会認定指導員・AFP・介護離職防止対策アドバイザー。介護離職・実家じまいを自ら経験。",
  knowsAbout: ["生前整理", "実家じまい", "介護離職予防", "家族会議", "終活"],
};

export default function MurakamiSupervisorPage() {
  return (
    <article className="max-w-3xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <nav className="text-xs text-foreground/60 mb-3" aria-label="パンくず">
        <Link href="/" className="hover:underline">ホーム</Link> ＞ 監修者紹介
      </nav>

      {/* ヘッダー */}
      <header className="bg-card border border-border rounded-2xl p-6 flex flex-wrap gap-5 items-center">
        <div className="w-28 h-28 rounded-full bg-primary-light flex items-center justify-center shrink-0" aria-hidden>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="24" r="13" fill="#cfe0d6" />
            <path d="M12 56 a20 18 0 0 1 40 0 z" fill="#cfe0d6" />
          </svg>
        </div>
        <div className="flex-1 min-w-[220px]">
          <p className="text-sm font-bold text-accent">{PERSON_TITLE}</p>
          <h1 className="text-2xl font-bold mt-1">{PERSON_NAME}</h1>
          <ul className="flex flex-wrap gap-2 mt-3">
            {CREDENTIALS.map((c) => (
              <li key={c} className="bg-primary-light text-primary text-xs font-bold rounded-full px-3 py-1">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* プロフィール本文（提案書の事実のみ・たたき台） */}
      <section className="bg-card border border-border rounded-2xl p-6 mt-4 space-y-4 leading-8">
        <p>生前整理という分野に、私は専門家としてだけでなく、一人の家族として向き合ってきました。</p>
        <p>
          親の認知症の気配に気づいたとき、私は介護離職という大きな決断をしました。そこから1年弱をかけて実家を片づけ、有料老人ホームへの入居、家族信託の契約、そして叔母と両親3名の見送りを経験しました。これらは、どれだけ知識を積んでも、本やセミナーだけでは決して分からない、人生をかけて通り抜けてきた時間です。
        </p>
        <p>
          その経験を社会に還元したいという想いから、(一社)生前整理普及協会の認定指導員として、また神奈川大学エクステンション講座の講師として、生前整理の考え方をお伝えしています。AFP（ファイナンシャル・プランナー）、介護離職防止対策アドバイザーとしての視点も交え、「ル・リアン横浜」では実際にご家族のご相談にも向き合っています。
        </p>
        <p>
          「ふれあいの丘」では、生前整理から実家じまいへと続くご家族の歩みに、当事者の気持ちと専門家の知見の両面から寄り添えるよう、サイト全体の編集方針を総合監修しています。今、親のこと・実家のことで迷っている方が、「まずは一歩から」踏み出せるように——そんなメディアになることを願っています。
        </p>
      </section>

      {/* 監修領域 */}
      <section className="bg-card border border-border rounded-2xl p-6 mt-4">
        <h2 className="font-bold mb-2">監修している領域</h2>
        <p className="leading-8">
          生前整理全般／介護離職予防／親子コミュニケーション・家族会議／生前整理普及協会メソッド（思い入れ箱・ベストショットアルバム・4分類シート 等）／サイト全体の編集方針・トーン
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <a
            href="#"
            className="bg-accent text-white text-sm font-bold rounded-full px-4 py-2"
          >
            ▸ ル・リアン横浜のご相談はこちら
          </a>
          <Link
            href="/articles"
            className="bg-primary-light text-primary text-sm font-bold rounded-full px-4 py-2"
          >
            ▸ 村上が監修した記事一覧
          </Link>
        </div>
      </section>

      <p className="text-xs text-foreground/50 mt-6">
        ※本ページはドラフト（実装オプション）です。お写真・ふりがな・文面は村上様にご確認・ご修正いただく前提のたたき台です。
      </p>
    </article>
  );
}
