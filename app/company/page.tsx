import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "../components/JsonLd";
import { siteName, organization } from "../lib/constants/site-metadata";
import { getCanonicalBase, getCanonicalUrl } from "../lib/site-url";

const COMPANY_PATH = "/company";
const companyPageUrl = getCanonicalUrl(COMPANY_PATH);
const canonicalBase = getCanonicalBase();

export const metadata: Metadata = {
  title: "運営者情報 | 生前整理支援センター ふれあいの丘",
  description:
    "「生前整理支援センター ふれあいの丘」運営者の大久保亮佑(株式会社Kogera 代表取締役社長)のご紹介。実家じまいに直面した自身の経験と、生前整理アドバイザー2級として学んだ知見をもとに、ご家族の最初の一歩を支えるサイトを運営しています。",
  alternates: { canonical: companyPageUrl },
  openGraph: {
    title: "運営者情報 | 生前整理支援センター ふれあいの丘",
    description:
      "実家じまいに悩むご家族の最初の一歩を支えるため、生前整理支援センター ふれあいの丘を運営しています。",
    url: companyPageUrl,
    type: "profile",
    images: [
      {
        url: `${canonicalBase}/og-image.png?v=2`,
        width: 1200,
        height: 630,
        alt: "生前整理支援センター ふれあいの丘",
      },
    ],
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "大久保 亮佑",
  alternateName: "Ryosuke Okubo",
  givenName: "亮佑",
  familyName: "大久保",
  jobTitle: "代表取締役社長",
  worksFor: {
    "@type": "Organization",
    name: "株式会社Kogera",
    url: companyPageUrl,
  },
  url: companyPageUrl,
  address: {
    "@type": "PostalAddress",
    addressRegion: "大阪府",
    addressCountry: "JP",
  },
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      name: "生前整理アドバイザー2級",
      credentialCategory: "certificate",
      dateCreated: "2026-05",
      recognizedBy: {
        "@type": "Organization",
        name: "一般社団法人 生前整理普及協会",
      },
    },
  ],
  knowsAbout: [
    "実家じまい",
    "生前整理",
    "空き家対策",
    "解体補助金",
    "相続登記",
    "遺品整理",
  ],
  description:
    "株式会社Kogera 代表取締役社長。実家じまいに直面した自身の経験から、生前整理支援センター ふれあいの丘を立ち上げる。",
};

export default function CompanyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <JsonLd data={personSchema} />

      <p className="text-sm text-foreground/60 mb-6">
        <Link href="/" className="hover:text-primary transition">
          トップ
        </Link>
        <span className="mx-2">/</span>
        <span>運営者情報</span>
      </p>

      <header className="mb-10">
        <h1 className="text-2xl font-bold text-primary mb-2">運営者情報</h1>
        <p className="text-xl font-bold text-primary mb-6">
          モノを捨てるのではなく、家族の心を整えるために
        </p>
      </header>

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
          <p className="text-primary font-bold text-lg">株式会社Kogera 代表取締役社長</p>
          <p className="text-2xl font-bold text-foreground mt-1">大久保亮佑</p>
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
          <p className="mt-4">
            2026年5月、私は一般社団法人 生前整理普及協会の認定講座を受講し、生前整理アドバイザー2級を取得しました。受講を決めた理由は、サイトを運営する以上、利用者の方々と同じ目線で「生前整理とは何か」を体系的に理解しておきたかったからです。
          </p>
          <p className="mt-4">
            講座を通じて学んだのは、生前整理が「亡くなる準備のための終活」ではなく、「これからの人生をより良く生きるための整理」だという考え方でした。「捨てる」ではなく「手放す」という言葉の選び方、思い出のものを最初に整理することの意味——講座で学んだ一つひとつの考え方が、このサイトの設計思想に反映されています。
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
          <h2 className="text-lg font-bold text-primary mb-4">私自身が学び続けていること</h2>
          <p>
            「ふれあいの丘」を運営するということは、利用者の皆さまに何かを「教える」立場になるということではないと考えています。むしろ、実家じまいという、誰もが初めて直面する課題について、共に学び・考える場を提供することが私の役割です。
          </p>
          <p className="mt-4">
            生前整理アドバイザー2級は、その学びの最初の一歩でした。一般社団法人 生前整理普及協会の認定講座を通じて、「モノ」「心」「情報」の3つの整理を体系的に学び、ご家族との対話の進め方や、思い出のものとどう向き合うかについて多くの示唆を得ました。今後も準1級・1級と段階的に学びを深めていく予定です。
          </p>
          <p className="mt-4">
            また、生前整理だけでなく、相続登記の義務化(2024年4月施行)や改正空き家対策特別措置法、空き家3000万円特別控除の活用など、実家じまいに関わる制度・法律の変化についても継続的に学んでいます。これらの知識は、サイトのコンテンツに反映するだけでなく、各領域の専門家の方々と建設的な対話をするための基礎としても重要だと考えています。
          </p>
          <h3 className="text-base font-bold text-primary mt-6 mb-2">取得済み資格</h3>
          <ul className="list-none space-y-2 pl-0">
            <li>・生前整理アドバイザー2級(一般社団法人 生前整理普及協会・2026年5月取得)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-primary mb-4">サイトの編集・監修方針</h2>
          <p>
            「ふれあいの丘」が扱う内容は、相続・税務・不動産・解体工事・生前整理など、ご家族の人生に関わる重要な意思決定を伴う領域です。だからこそ、情報の正確性と中立性には最大限の責任を持って取り組んでいます。
          </p>
          <h3 className="text-base font-bold text-primary mt-6 mb-2">編集の基本姿勢</h3>
          <ul className="list-none space-y-2 pl-0">
            <li>・一次情報の重視: 補助金等の制度情報については、各自治体の公式情報を必ず一次情報源として確認しています</li>
            <li>・情報の鮮度管理: 法改正・制度変更があった際には、関連記事を順次更新しています</li>
            <li>
              ・中立性の確保:
              業者紹介の一部に成果報酬型のアフィリエイトプログラムを利用していますが、報酬の有無に関わらず、利用者にとって最適な選択肢を提示することを編集方針の根幹としています
            </li>
          </ul>
          <h3 className="text-base font-bold text-primary mt-6 mb-2">監修体制の構築方針</h3>
          <p className="mt-2">
            実家じまいというテーマは、生前整理・介護・相続・税務・解体・不動産売却など、多岐にわたる専門領域が交差します。当サイトでは、これら各領域について、有資格の専門家による監修体制を段階的に整えてまいります。
          </p>
          <p className="mt-4">
            現在、生前整理領域については生前整理普及協会公認指導員の方からのご助言をいただきながらコンテンツを設計しております。今後さらに、法務(司法書士)、税務(税理士)、不動産売却(宅地建物取引士)、解体工事(建設業有資格者)の各領域についても、信頼できる専門家との連携を進めてまいります。
          </p>
          <p className="mt-4">
            監修体制が整った領域から順次、各記事に監修者情報を明記してまいります。
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

        <section aria-labelledby="profile-heading" className="space-y-5">
          <h2 id="profile-heading" className="text-lg font-bold text-primary mb-4">
            プロフィール
          </h2>
          <p className="text-lg font-bold text-foreground">
            大久保 亮佑(おおくぼ りょうすけ / Ryosuke Okubo)
          </p>
          <ul className="list-none space-y-2 pl-0">
            <li>・株式会社Kogera 代表取締役社長</li>
            <li>・生前整理アドバイザー2級(一般社団法人 生前整理普及協会・2026年5月取得)</li>
          </ul>
          <p>
            大阪府在住。実家じまいに直面した自身の経験から、同じように悩むご家族の最初の一歩を支えるべく、2026年2月に「生前整理支援センター ふれあいの丘」を立ち上げる。
          </p>
          <ul className="list-none space-y-2 pl-0">
            <li>活動領域: 実家じまい・生前整理・空き家対策・解体補助金・相続登記・遺品整理</li>
          </ul>
        </section>

        <p className="text-right font-medium text-foreground pt-4">
          <span className="block">大久保亮佑</span>
          <span className="block">株式会社Kogera 代表取締役社長</span>
        </p>
      </article>

      <section className="mt-12 pt-10 border-t border-border bg-gray-100 rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg font-bold text-primary mb-6">会社概要</h2>
        <table className="w-full text-sm border-collapse">
          <tbody className="align-top">
            <tr className="border-b border-gray-200">
              <th scope="row" className="py-3 sm:py-4 pr-4 sm:w-36 text-left font-medium text-foreground/80 align-top">
                運営法人
              </th>
              <td className="py-3 sm:py-4 text-foreground">{organization.name}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th scope="row" className="py-3 sm:py-4 pr-4 sm:w-36 text-left font-medium text-foreground/80 align-top">
                代表者
              </th>
              <td className="py-3 sm:py-4 text-foreground">代表取締役社長 大久保亮佑</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th scope="row" className="py-3 sm:py-4 pr-4 sm:w-36 text-left font-medium text-foreground/80 align-top">
                サービス名
              </th>
              <td className="py-3 sm:py-4 text-foreground">{siteName}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th scope="row" className="py-3 sm:py-4 pr-4 sm:w-36 text-left font-medium text-foreground/80 align-top">
                所在地
              </th>
              <td className="py-3 sm:py-4 text-foreground">
                〒104-0061
                <br />
                東京都中央区銀座1丁目12番4号 N&E BLD.6F
                <p className="mt-1.5 text-sm text-foreground/70">※サービスはオンラインにて全国対応しております</p>
              </td>
            </tr>
            <tr>
              <th scope="row" className="py-3 sm:py-4 pr-4 sm:w-36 text-left font-medium text-foreground/80 align-top">
                お問い合わせ
              </th>
              <td className="py-3 sm:py-4">
                <Link href="/contact" className="text-primary font-medium underline hover:no-underline">
                  お問い合わせフォームはこちら
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
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
