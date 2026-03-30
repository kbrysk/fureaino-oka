import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { pageTitle, SITE_NAME_FULL } from "../lib/site-brand";
import { siteName, organization } from "../lib/constants/site-metadata";
import { getCanonicalUrl } from "../lib/site-url";

export const metadata: Metadata = {
  title: pageTitle("会社概要・運営者情報"),
  description: `${SITE_NAME_FULL}の運営者情報と会社概要。想い・ストーリーと、運営法人・お問い合わせ先をご案内します。`,
  alternates: { canonical: getCanonicalUrl("/company") },
};

export default function CompanyPage() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "大久保亮佑",
    jobTitle: "代表取締役社長",
    worksFor: {
      "@type": "Organization",
      name: "株式会社Kogera",
    },
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Script
        id="company-person-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <p className="text-sm text-foreground/60 mb-6">
        <Link href="/" className="hover:text-primary transition">トップ</Link>
        <span className="mx-2">/</span>
        <span>会社概要・運営者情報</span>
      </p>

      {/* ========== セクション1：想い・ストーリー（感情のフック） ========== */}
      <header className="mb-10">
        <h1 className="text-2xl font-bold text-primary mb-2">運営者情報</h1>
        <h2 className="text-xl font-bold text-primary mb-6">モノを捨てるのではなく、家族の心を整えるために</h2>
      </header>

      {/* センター長プロフィール（緑の服・眼鏡のふくろう） */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-8">
        <div className="relative w-[200px] sm:w-[220px] md:w-[180px] flex-shrink-0 flex items-end">
          <Image
            src="/images/ryosuke-okubo.png"
            alt="株式会社Kogera 代表取締役社長 大久保亮佑"
            width={400}
            height={400}
            className="w-full h-auto object-contain object-bottom drop-shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
            sizes="(max-width: 640px) 220px, 180px"
            priority
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-primary font-bold text-lg">
            株式会社Kogera 代表取締役社長
          </p>
          <p className="text-2xl font-bold text-foreground mt-1">
            大久保亮佑
          </p>
        </div>
      </div>

      <article className="space-y-10 text-gray-700 leading-relaxed">
        <section>
          <p>
            「実家の片付け、そろそろ考えないといけないけれど、何から話せばいいんだろう……」
          </p>
          <p className="mt-4">
            私自身、そんな漠然とした不安を抱えた一人の息子として、このサービスを立ち上げました。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-4">
            私が向き合ってきた「実家じまい」の現実
          </h2>
          <p>
            数年前、久しぶりに田舎の実家に帰ったとき、私は何から手をつければいいのか、まったく分かりませんでした。
          </p>
          <p className="mt-4">
            大学進学以降、実家を離れていたため、かれこれ20年近く、家のどこに何があるのかさえ把握できていない状態でした。目の前には物が溢れた部屋があるのに、「これは残すべきか」「誰に相談すればいいのか」という判断の基準が何もない。
          </p>
          <p className="mt-4">具体的に困ったのは、3つのことです。</p>
          <p>
            まず、情報がどこにもなかった。誰に聞けばいいのか分からず、ようやく得た情報が正確かどうかも判断できない。ネットで調べても、自分の状況に当てはまる答えが見つからない。
          </p>
          <p className="mt-4">
            次に、何をいつまでにやるべきか見えなかった。実家の片付けには期限も正解もないように見えて、何もしないとどうなるのかも分からない。そのまま放置してしまいそうになる感覚は、今でも覚えています。
          </p>
          <p className="mt-4">
            そして、お金のことが一切分からなかった。実家を処分しないまま放置すると税負担が増えること、自治体によっては解体費用の助成金が使えること——こうした知識が最初はゼロでした。
          </p>
          <p className="mt-4">
            私の場合は、たまたま教えてくれる人がいたので何とか乗り越えられました。でも、そういう人がいなければ、どこから動けばよかったか分からなかったと思います。
          </p>
          <p className="mt-4">
            「ふれあいの丘」は、あのときの自分のような方に、最初の一歩を示すために作りました。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-4">
            「何から始めればいいか分からない」に寄り添いたい
          </h2>
          <p>
            「生前整理支援センター - ふれあいの丘」は、かつて地域の方々に親しまれた公共施設の名前を受け継いでいます。私たちが目指すのは、あの頃のような「誰でも安心して立ち寄れる場所」です。
          </p>
          <p className="mt-4">
            生前整理は、決して「終わりのための準備」ではありません。むしろ、これからの家族の時間をより豊かに、笑顔で過ごすための「未来への準備」だと、私たちは信じています。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-4">
            常に、利用者様と共に歩むサービスでありたい
          </h2>
          <p>
            このサービスは、まだ完成されたものではありません。
            実際に悩み、立ち止まっている皆様の声をお聞きしながら、常にアップデートし続けていきたいと考えています。
          </p>
          <p className="mt-4">
            「こんな機能があったら助かる」「この部分が分かりにくかった」など、どんな些細なことでも構いません。皆様の率直なお声を、ぜひお聞かせください。
          </p>
          <p className="mt-4">
            一人で抱え込むには、生前整理はあまりに重い課題です。
            でも、誰かと一緒に一歩を踏み出すことができれば、それはきっと家族の新しい絆を作るきっかけになります。
          </p>
          <p className="mt-4">
            私たちが、その最初の一歩を支える道標となれるよう、誠心誠意取り組んでまいります。
          </p>
        </section>

        <p className="text-right font-medium text-foreground pt-4">
          <span className="block">大久保亮佑</span>
          <span className="block">株式会社Kogera 代表取締役社長</span>
        </p>
      </article>

      {/* ========== セクション2：会社概要（理性のトラストシグナル） ========== */}
      <section className="mt-12 pt-10 border-t border-border bg-gray-100 rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg font-bold text-primary mb-6">会社概要</h2>
        <dl className="space-y-4 text-sm">
          <div className="flex flex-col sm:flex-row sm:py-2 border-b border-gray-200 last:border-0">
            <dt className="sm:w-36 flex-shrink-0 font-medium text-foreground/80">運営法人</dt>
            <dd className="text-foreground mt-0.5 sm:mt-0">{organization.name}</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:py-2 border-b border-gray-200 last:border-0">
            <dt className="sm:w-36 flex-shrink-0 font-medium text-foreground/80">代表者</dt>
            <dd className="text-foreground mt-0.5 sm:mt-0">代表取締役社長 大久保亮佑</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:py-2 border-b border-gray-200 last:border-0">
            <dt className="sm:w-36 flex-shrink-0 font-medium text-foreground/80">サービス名</dt>
            <dd className="text-foreground mt-0.5 sm:mt-0">{siteName}</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:py-2 border-b border-gray-200 last:border-0">
            <dt className="sm:w-36 flex-shrink-0 font-medium text-foreground/80">所在地</dt>
            <dd className="text-foreground mt-0.5 sm:mt-0">
              〒104-0061
              <br />
              東京都中央区銀座1丁目12番4号 N&E BLD.6F
              <p className="mt-1.5 text-sm text-foreground/70">※サービスはオンラインにて全国対応しております</p>
            </dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:py-2 border-b border-gray-200 last:border-0">
            <dt className="sm:w-36 flex-shrink-0 font-medium text-foreground/80">お問い合わせ</dt>
            <dd className="mt-0.5 sm:mt-0">
              <Link href="/contact" className="text-primary font-medium underline hover:no-underline">
                お問い合わせフォームはこちら
              </Link>
            </dd>
          </div>
        </dl>
      </section>

      <div className="mt-10 pt-8 border-t border-border">
        <Link
          href="/"
          className="inline-block bg-primary-light text-primary px-5 py-2.5 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
        >
          トップへ戻る
        </Link>
      </div>
    </div>
  );
}
