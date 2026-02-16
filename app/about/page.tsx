import type { Metadata } from "next";
import Link from "next/link";
import { pageTitle, SITE_NAME_FULL } from "../lib/site-brand";

export const metadata: Metadata = {
  title: pageTitle("運営者の想い"),
  description: `「モノを捨てるのではなく、家族の心を整えるために」。${SITE_NAME_FULL}を運営する私たちの想いと、このサービスを立ち上げた背景をご紹介します。`,
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <p className="text-sm text-foreground/60 mb-6">
        <Link href="/" className="hover:text-primary transition">トップ</Link>
        <span className="mx-2">/</span>
        <span>運営者の想い</span>
      </p>

      <h1 className="text-2xl font-bold text-primary mb-8">
        モノを捨てるのではなく、家族の心を整えるために
      </h1>

      {/* 運営者画像（後ほど差し替え） */}
      <div className="mb-10 rounded-2xl overflow-hidden border border-border bg-muted/50 aspect-[4/3] flex items-center justify-center">
        {/* 画像を追加する場合は、この中を <Image src="/images/operator.jpg" alt="運営者" width={800} height={600} className="w-full h-full object-cover" /> などに差し替えてください */}
        <span className="text-sm text-foreground/40" aria-hidden>
          運営者写真
        </span>
      </div>

      <article className="space-y-10 text-foreground/85 leading-relaxed">
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
