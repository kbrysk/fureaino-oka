import type { Metadata } from "next";
import Link from "next/link";
import { SUPERVISORS } from "../../lib/supervisors";

/**
 * 監修者プロフィール（大久保亮佑）— 立ち上げ期の総合監修者。
 * 資格・肩書は app/lib/supervisors.ts を単一情報源として参照（虚偽資格の防止）。
 * 経歴本文は [ご確認] の箇所をご本人に確認・加筆いただく前提のドラフト。
 * 現状 robots: noindex（経歴確定までドラフト）。確定後に解除。
 */
const S = SUPERVISORS.okubo;

export const metadata: Metadata = {
  title: `監修者紹介 ${S.name}｜生前整理支援センター ふれあいの丘`,
  description:
    "ふれあいの丘の総合監修者・大久保亮佑のプロフィール。生前整理アドバイザー2級。ご家族の「心の整理」から実家じまいまでを支えるメディアの編集方針を監修しています。",
  robots: { index: false, follow: false }, // 経歴確定までドラフト。確定後に解除。
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "大久保亮佑",
  jobTitle: "生前整理アドバイザー2級",
  worksFor: { "@type": "Organization", name: "株式会社Kogera" },
  knowsAbout: ["生前整理", "実家じまい", "家族の合意形成"],
};

export default function OkuboSupervisorPage() {
  return (
    <article className="max-w-3xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <nav className="text-xs text-foreground/60 mb-3" aria-label="パンくず">
        <Link href="/" className="hover:underline">ホーム</Link> ＞ 監修者紹介
      </nav>

      <header className="bg-card border border-border rounded-2xl p-6 flex flex-wrap gap-5 items-center">
        <div className="w-28 h-28 rounded-full bg-primary-light flex items-center justify-center shrink-0" aria-hidden>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="24" r="13" fill="#cfe0d6" />
            <path d="M12 56 a20 18 0 0 1 40 0 z" fill="#cfe0d6" />
          </svg>
        </div>
        <div className="flex-1 min-w-[220px]">
          <p className="text-sm font-bold text-accent">{S.role}</p>
          <h1 className="text-2xl font-bold mt-1">{S.name}</h1>
          <ul className="flex flex-wrap gap-2 mt-3">
            {S.credentials.map((c) => (
              <li key={c} className="bg-primary-light text-primary text-xs font-bold rounded-full px-3 py-1">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <section className="bg-card border border-border rounded-2xl p-6 mt-4 space-y-4 leading-8">
        <p>
          「生前整理支援センター ふれあいの丘」を運営する株式会社Kogeraの代表として、また生前整理アドバイザー2級として、ご家族の「心の整理」から実家じまいまでを支えるメディアづくりに取り組んでいます。
        </p>
        <p>
          ［ご確認：ここに大久保様ご自身の言葉で、生前整理に取り組むことになったきっかけ・想い・ご家族の経験などを2〜3段落で記載してください。実体験に基づく一次情報は、Googleが重視するE-E-A-T（特にExperience＝経験）の観点でも大きな価値になります。］
        </p>
        <p>
          当サイトでは、ご家族の人生に深く関わる情報を扱うからこそ、共感に寄り添うトーンと、公的機関の出典に基づく正確さの両立を編集方針として大切にしています。法務・税務・不動産・解体といった専門分野は、それぞれの分野の専門家が監修します。
        </p>
      </section>

      <section className="bg-card border border-border rounded-2xl p-6 mt-4">
        <h2 className="font-bold mb-2">監修している領域</h2>
        <p className="leading-8">
          生前整理全般／実家じまいの進め方／親子コミュニケーション・家族会議／サイト全体の編集方針・トーン
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Link href="/articles" className="bg-primary-light text-primary text-sm font-bold rounded-full px-4 py-2">
            ▸ 監修記事一覧
          </Link>
          <Link href="/company" className="bg-primary-light text-primary text-sm font-bold rounded-full px-4 py-2">
            ▸ 運営会社情報
          </Link>
        </div>
      </section>

      <p className="text-xs text-foreground/50 mt-6">
        ※本ページはドラフトです。［ご確認］の経歴・お写真はご本人にご確認・加筆いただく前提です。村上充恵様の監修開始後は、総合監修者の表示を村上様へ切り替えます（app/lib/supervisors.ts の CURRENT_GENERAL_SUPERVISOR）。
      </p>
    </article>
  );
}
