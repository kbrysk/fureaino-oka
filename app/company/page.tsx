import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pageTitle, SITE_NAME_FULL } from "../lib/site-brand";
import { siteName, organization } from "../lib/constants/site-metadata";

export const metadata: Metadata = {
  title: pageTitle("会社概要・運営者情報"),
  description: `${SITE_NAME_FULL}の運営者情報と会社概要。想い・ストーリーと、運営法人・お問い合わせ先をご案内します。`,
};

export default function CompanyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
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
            src="/images/operator.png"
            alt="運営者（ふれあいの丘 センター長）"
            width={400}
            height={400}
            className="w-full h-auto object-contain object-bottom drop-shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
            sizes="(max-width: 640px) 220px, 180px"
            priority
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-primary font-bold text-lg">
            生前整理支援センター ふれあいの丘 センター長
          </p>
          <dl className="mt-3 space-y-1 text-sm text-foreground/80 leading-relaxed">
            <div>
              <dt className="inline font-medium text-foreground">趣味：</dt>
              <dd className="inline">町中華の食べ歩き、読書、休日の家族でのお出かけ、スポーツ観戦。</dd>
            </div>
            <div>
              <dt className="inline font-medium text-foreground">好きなもの：</dt>
              <dd className="inline">コーヒー、落ち着いて食べるごはん、子どもと過ごす時間。</dd>
            </div>
          </dl>
          <p className="mt-3 text-sm text-foreground/70 italic">
            穏やかめのお父さんです。相談は堅苦しくなく、お気軽に。
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
            私が向き合ってきた「生前整理」の現実
          </h2>
          <p>
            この活動の原点は、私の親が、その親（私にとっての祖父）との間で直面していた「生前整理」の問題にあります。
          </p>
          <p className="mt-4">
            祖父が亡くなった後、残された膨大な遺品の整理に追われ、精神的にも肉体的にも疲弊していく親の姿を、私は間近で見てきました。生前に十分な会話ができていなかったことで、何が大切で、何をどう整理すべきかの判断がつかず、家族の間で何度も立ち止まってしまったのです。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-4">
            いざ自分が向き合おうとした時、道標がなかった
          </h2>
          <p>
            その後、月日が流れ、いよいよ私自身が両親との生前整理について考えなければならない時期が来ました。
          </p>
          <p className="mt-4">
            しかし、いざ「何から始めればいいのか」を調べようとした時、目の前には膨大な広告や、どこか冷たい事務的な情報ばかりが溢れていました。家族の思い出や感情が詰まった「家」を整理するのに、単なる作業の手順だけを知りたいわけではない。
          </p>
          <p className="mt-4">
            「どうすれば親を傷つけずに切り出せるのか」「将来、家族が困らないために今できることは何なのか」
          </p>
          <p className="mt-4">
            そうした切実な問いに応えてくれる場所が、どこにも見当たりませんでした。
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
          生前整理支援センター ふれあいの丘 センター長
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
            <dt className="sm:w-36 flex-shrink-0 font-medium text-foreground/80">サービス名</dt>
            <dd className="text-foreground mt-0.5 sm:mt-0">{siteName}</dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:py-2 border-b border-gray-200 last:border-0">
            <dt className="sm:w-36 flex-shrink-0 font-medium text-foreground/80">所在地</dt>
            <dd className="text-foreground mt-0.5 sm:mt-0">※オンラインにて全国対応</dd>
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
