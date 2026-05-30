import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SUPERVISORS } from "../../lib/supervisors";

/**
 * 監修者・運営者プロフィール（大久保亮佑）。
 * 立ち上げ期の総合監修者。記事末尾バイラインのリンク先。
 * 資格・肩書は app/lib/supervisors.ts を単一情報源として参照（虚偽資格の防止）。
 */
const S = SUPERVISORS.okubo;

export const metadata: Metadata = {
  title: `運営者・監修者 ${S.name}｜生前整理支援センター ふれあいの丘`,
  description:
    "「生前整理支援センター ふれあいの丘」運営者・大久保亮佑（生前整理アドバイザー2級／株式会社Kogera代表取締役社長）のプロフィール。実家じまいに直面した自身の経験から、同じように悩むご家族の最初の一歩を支えるためにサービスを立ち上げました。編集・監修方針も掲載。",
  alternates: { canonical: "https://www.fureaino-oka.com/supervisor/okubo" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "大久保亮佑",
  alternateName: "Ryosuke Okubo",
  jobTitle: "生前整理アドバイザー2級",
  image: "https://www.fureaino-oka.com/images/ryosuke-okubo.png",
  url: "https://www.fureaino-oka.com/supervisor/okubo",
  worksFor: { "@type": "Organization", name: "株式会社Kogera" },
  address: { "@type": "PostalAddress", addressRegion: "大阪府", addressCountry: "JP" },
  knowsAbout: ["実家じまい", "生前整理", "空き家対策", "解体補助金", "相続登記", "遺品整理"],
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    name: "生前整理アドバイザー2級",
    credentialCategory: "certification",
    recognizedBy: { "@type": "Organization", name: "一般社団法人 生前整理普及協会" },
  },
};

export default function OkuboSupervisorPage() {
  return (
    <article className="max-w-3xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <nav className="text-xs text-foreground/60 mb-3" aria-label="パンくず">
        <Link href="/" className="hover:underline">ホーム</Link> ＞ 運営者・監修者紹介
      </nav>

      <p className="text-primary font-bold text-lg">モノを捨てるのではなく、家族の心を整えるために</p>

      {/* ヘッダー */}
      <header className="bg-card border border-border rounded-2xl p-6 flex flex-wrap gap-5 items-center mt-3">
        {S.photoSrc ? (
          <div className="w-28 h-28 rounded-full overflow-hidden shrink-0 ring-4 ring-primary-light">
            <Image
              src={S.photoSrc}
              alt={S.photoAlt ?? `${S.name}の顔写真`}
              width={112}
              height={112}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        ) : (
          <div className="w-28 h-28 rounded-full bg-primary-light flex items-center justify-center shrink-0" aria-hidden>
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="24" r="13" fill="#cfe0d6" />
              <path d="M12 56 a20 18 0 0 1 40 0 z" fill="#cfe0d6" />
            </svg>
          </div>
        )}
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
        <p>「実家の片付け、そろそろ考えないといけないけれど、何から話せばいいんだろう……」</p>
        <p>私自身、そんな漠然とした不安を抱えた一人の息子として、このサービスを立ち上げました。</p>
      </section>

      <h2 className="text-xl font-bold text-primary border-l-4 border-primary pl-3 mt-8 mb-3">
        私が向き合ってきた「実家じまい」の現実
      </h2>
      <div className="space-y-4 leading-8">
        <p>
          数年前、久しぶりに田舎の実家に帰ったとき、私は何から手をつければいいのか、まったく分かりませんでした。大学進学以降20年近く実家を離れていたため、家のどこに何があるのかさえ把握できていない状態。目の前には物が溢れた部屋があるのに、「これは残すべきか」「誰に相談すればいいのか」という判断の基準が何もありませんでした。
        </p>
        <p>具体的に困ったのは、3つのことです。</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>情報がどこにもなかった</strong>：誰に聞けばいいか分からず、得た情報が正確かも判断できない。ネットで調べても自分の状況に当てはまる答えが見つからない。</li>
          <li><strong>何をいつまでにやるべきか見えなかった</strong>：期限も正解もないように見え、放置してしまいそうになる感覚は今でも覚えています。</li>
          <li><strong>お金のことが一切分からなかった</strong>：放置すると税負担が増えること、自治体によっては解体費用の助成金が使えること——こうした知識が最初はゼロでした。</li>
        </ul>
        <p>
          私の場合はたまたま教えてくれる人がいて何とか乗り越えられましたが、そういう人がいなければ、どこから動けばよかったか分からなかったと思います。「ふれあいの丘」は、あのときの自分のような方に、最初の一歩を示すために作りました。
        </p>
      </div>

      <h2 className="text-xl font-bold text-primary border-l-4 border-primary pl-3 mt-8 mb-3">
        生前整理アドバイザー2級を取得した理由
      </h2>
      <div className="space-y-4 leading-8">
        <p>
          2026年5月、私は一般社団法人 生前整理普及協会の認定講座を受講し、生前整理アドバイザー2級を取得しました。サイトを運営する以上、利用者の方々と同じ目線で「生前整理とは何か」を体系的に理解しておきたかったからです。
        </p>
        <p>
          講座を通じて学んだのは、生前整理が「亡くなる準備のための終活」ではなく、「これからの人生をより良く生きるための整理」だという考え方でした。「捨てる」ではなく「手放す」という言葉の選び方、思い出のものを最初に整理することの意味——学んだ一つひとつの考え方が、このサイトの設計思想に反映されています。
        </p>
      </div>

      <h2 className="text-xl font-bold text-primary border-l-4 border-primary pl-3 mt-8 mb-3">
        「ふれあいの丘」という名前に込めた想い
      </h2>
      <div className="space-y-4 leading-8">
        <p>
          「生前整理支援センター - ふれあいの丘」は、かつて地域の方々に親しまれた公共施設の名前を受け継いでいます。私たちが目指すのは、あの頃のような「誰でも安心して立ち寄れる場所」です。
        </p>
        <p>
          生前整理は、決して「終わりのための準備」ではありません。むしろ、これからの家族の時間をより豊かに、笑顔で過ごすための「未来への準備」だと、私たちは信じています。
        </p>
      </div>

      <h2 className="text-xl font-bold text-primary border-l-4 border-primary pl-3 mt-8 mb-3">
        私自身が学び続けていること
      </h2>
      <div className="space-y-4 leading-8">
        <p>
          「ふれあいの丘」を運営することは、利用者の皆さまに何かを「教える」立場になることではなく、実家じまいという誰もが初めて直面する課題について、共に学び・考える場を提供することだと考えています。
        </p>
        <p>
          生前整理アドバイザー2級は、その学びの最初の一歩でした。協会の認定講座を通じて「モノ」「心」「情報」の3つの整理を体系的に学び、ご家族との対話の進め方や、思い出のものとどう向き合うかについて多くの示唆を得ました。今後も准1級・1級と段階的に学びを深めていく予定です。
        </p>
        <p>
          また、相続登記の義務化（2024年4月施行）や改正空き家対策特別措置法、空き家3,000万円特別控除の活用など、実家じまいに関わる制度・法律の変化についても継続的に学んでいます。これらの知識は、コンテンツに反映するだけでなく、各領域の専門家の方々と建設的な対話をするための基礎としても重要だと考えています。
        </p>
        <div className="bg-primary-light/50 border border-border rounded-xl p-4">
          <p className="font-bold mb-1">取得済み資格</p>
          <ul className="list-disc pl-6">
            <li>生前整理アドバイザー2級（一般社団法人 生前整理普及協会・2026年5月取得）</li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-primary border-l-4 border-primary pl-3 mt-8 mb-3">
        サイトの編集・監修方針
      </h2>
      <div className="space-y-4 leading-8">
        <p>
          「ふれあいの丘」が扱う内容は、相続・税務・不動産・解体工事・生前整理など、ご家族の人生に関わる重要な意思決定を伴う領域です。だからこそ、情報の正確性と中立性には最大限の責任を持って取り組んでいます。
        </p>
        <p className="font-bold">編集の基本姿勢</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>一次情報の重視</strong>：補助金等の制度情報は、各自治体の公式情報を必ず一次情報源として確認しています。</li>
          <li><strong>情報の鮮度管理</strong>：法改正・制度変更があった際には、関連記事を順次更新しています。</li>
          <li><strong>中立性の確保</strong>：業者紹介の一部に成果報酬型のアフィリエイトプログラムを利用していますが、報酬の有無に関わらず、利用者にとって最適な選択肢を提示することを編集方針の根幹としています。</li>
        </ul>
        <p className="font-bold mt-2">監修体制の構築方針</p>
        <p>
          実家じまいは、生前整理・介護・相続・税務・解体・不動産売却など多岐にわたる専門領域が交差します。当サイトでは、各領域について有資格の専門家による監修体制を段階的に整えてまいります。現在、生前整理領域については生前整理普及協会公認指導員の方からのご助言をいただきながらコンテンツを設計しています。今後、法務（司法書士）、税務（税理士）、不動産売却（宅地建物取引士）、解体工事（建設業有資格者）の各領域についても、信頼できる専門家との連携を進め、監修体制が整った領域から順次、各記事に監修者情報を明記してまいります。
        </p>
      </div>

      <h2 className="text-xl font-bold text-primary border-l-4 border-primary pl-3 mt-8 mb-3">
        常に、利用者様と共に歩むサービスでありたい
      </h2>
      <div className="space-y-4 leading-8">
        <p>
          このサービスは、まだ完成されたものではありません。実際に悩み、立ち止まっている皆さまの声をお聞きしながら、常にアップデートし続けていきたいと考えています。「こんな機能があったら助かる」「この部分が分かりにくかった」など、どんな些細なことでも、ぜひ率直なお声をお聞かせください。
        </p>
        <p>
          一人で抱え込むには、生前整理はあまりに重い課題です。でも、誰かと一緒に一歩を踏み出すことができれば、それはきっと家族の新しい絆を作るきっかけになります。私たちが、その最初の一歩を支える道標となれるよう、誠心誠意取り組んでまいります。
        </p>
      </div>

      <section className="bg-card border border-border rounded-2xl p-6 mt-8">
        <h2 className="font-bold mb-2">プロフィール</h2>
        <p className="leading-8">
          <strong>大久保 亮佑</strong>（おおくぼ りょうすけ / Ryosuke Okubo）
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>株式会社Kogera 代表取締役社長</li>
          <li>生前整理アドバイザー2級（一般社団法人 生前整理普及協会・2026年5月取得）</li>
        </ul>
        <p className="text-sm text-foreground/70 mt-3 leading-relaxed">
          大阪府在住。実家じまいに直面した自身の経験から、同じように悩むご家族の最初の一歩を支えるべく、2026年2月に「生前整理支援センター ふれあいの丘」を立ち上げる。
        </p>
        <p className="text-sm text-foreground/70 mt-2">
          活動領域：実家じまい・生前整理・空き家対策・解体補助金・相続登記・遺品整理
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Link href="/articles" className="bg-primary-light text-primary text-sm font-bold rounded-full px-4 py-2">
            ▸ 監修記事一覧
          </Link>
          <Link href="/company" className="bg-primary-light text-primary text-sm font-bold rounded-full px-4 py-2">
            ▸ 運営会社情報
          </Link>
          <Link href="/contact" className="bg-primary-light text-primary text-sm font-bold rounded-full px-4 py-2">
            ▸ お問い合わせ
          </Link>
        </div>
      </section>

      <p className="text-xs text-foreground/50 mt-6">
        ※村上充恵 様の監修開始後は、総合監修者の表示を村上様へ切り替えます（app/lib/supervisors.ts の CURRENT_GENERAL_SUPERVISOR）。
      </p>
    </article>
  );
}
