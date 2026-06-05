import type { Metadata } from "next";
import Link from "next/link";
import ArticleInlineAppraisalCTA from "../../components/articles/ArticleInlineAppraisalCTA";
import EmailCTA from "../../components/EmailCTA";
import JsonLd from "../../components/JsonLd";
import { pageTitle, SITE_NAME_LOGO } from "../../lib/site-brand";
import { getCanonicalBase, getCanonicalUrl } from "../../lib/site-url";
import {
  getCoverageSummary,
  getAmountStatsSummary,
  getAllPrefectureSlugs,
  formatYenAsMan,
  STATS_AS_OF,
  STATS_CREDIT,
  NATIONAL_TOTAL_SOURCE,
} from "../../lib/data/municipality-stats";

/**
 * 【リッチ・ピラー】空き家の解体補助金 完全ガイド（情報意図のヘッドターム「空き家 解体 補助金」）
 *
 * 戦略: 勝てるクラスタ（補助金・解体・税金）の決定版。量産でなく、独自データ（全国1,726自治体）を
 * 統合し、この主題で最も完全・信頼できる資料にすることで上位表示を狙う。
 * クラスタ内部リンク（データレポート・47県・area・税シミュ・/akiya）のハブも兼ねる。
 *
 * 法務: 編集部が公的機関（総務省・国土交通省・各自治体）の情報をもとに作成。
 * 税務・登記・解体の個別判断は各分野の専門家へ。資格クレジット（生前整理アドバイザー2級）は
 * 専門外の税務・解体には付けない。誠実性: 「確認できた」表現で不在を断定しない。
 */

const PAGE_PATH = "/akiya/kaitai-hojokin";
const PUBLISHED = "2026-06-04";
const MODIFIED = "2026-06-04";

export function generateMetadata(): Metadata {
  const c = getCoverageSummary();
  const a = getAmountStatsSummary();
  const medianMan = a.medianYen ? formatYenAsMan(a.medianYen) : "—";
  const title = pageTitle(
    `空き家の解体補助金 完全ガイド｜全国${c.total.toLocaleString("ja-JP")}自治体データで相場・条件・申請の流れを解説【2026】`
  );
  const description = `空き家の解体補助金を全国${c.total.toLocaleString("ja-JP")}自治体（全国の約${c.coveragePercent}%）の独自調査データで解説。確認できたのは${c.withSubsidyPercent}%、上限額の中央値は${medianMan}。対象条件・申請の流れ・必要書類・注意点・解体費用相場・「解体か売却か」の判断まで、この1ページで分かります。`;
  return {
    title,
    description,
    alternates: { canonical: getCanonicalUrl(PAGE_PATH) },
    openGraph: {
      title,
      description,
      type: "article",
      url: getCanonicalUrl(PAGE_PATH),
      images: [`${getCanonicalBase()}/opendata/akiya-hojokin-infographic.png`],
    },
  };
}

const FAQ: { q: string; a: string }[] = [
  {
    q: "空き家の解体補助金は全国どこでももらえますか？",
    a: "いいえ。全国1,726自治体を調査したところ、解体補助金を確認できたのは844自治体（48.9%）でした。お住まい（または実家）の市区町村に制度があるかを、まず公式サイトや窓口で確認する必要があります。",
  },
  {
    q: "解体補助金はいくらもらえますか？",
    a: "上限額を金額として確認できた532自治体では、上限額の中央値は50万円（平均は約64万円）でした。補助率は解体費用の3分の1〜2分の1が中心です。金額・条件は自治体ごとに大きく異なります。",
  },
  {
    q: "申請のタイミングはいつですか？",
    a: "多くの自治体で『着工（解体工事の開始）前の申請・交付決定』が条件です。工事を始めた後・終わった後の申請は対象外になるケースがほとんどなので、必ず工事前に自治体へ確認してください。",
  },
  {
    q: "補助金がない自治体ではどうすればよいですか？",
    a: "解体して更地にする以外に、古家付きのまま売却する選択肢もあります。解体費用を払う前に、まずは無料査定で『そのまま売った場合の価格』を把握し、解体費用と比較するのがおすすめです。",
  },
  {
    q: "空き家を放置すると固定資産税が6倍になるって本当ですか？",
    a: "「特定空家等」や「管理不全空家」に指定され、自治体の勧告を受けると、住宅用地の特例（固定資産税の軽減）が外れ、土地の固定資産税が最大で約6倍になる場合があります（出典：国土交通省・総務省）。個別の税額は市区町村・税理士にご確認ください。",
  },
];

export default function Page() {
  const base = getCanonicalBase();
  const url = getCanonicalUrl(PAGE_PATH);
  const c = getCoverageSummary();
  const a = getAmountStatsSummary();
  const medianMan = a.medianYen ? formatYenAsMan(a.medianYen) : "—";
  const avgMan = a.averageYen ? formatYenAsMan(a.averageYen) : "—";
  const maxMan = a.maxYen ? formatYenAsMan(a.maxYen) : "—";
  const top = a.topEntry;
  const prefs = getAllPrefectureSlugs();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "空き家の解体補助金 完全ガイド｜全国1,726自治体データで相場・条件・申請を解説",
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    image: [`${base}/opendata/akiya-hojokin-infographic.png`],
    author: { "@type": "Organization", name: SITE_NAME_LOGO, url: base },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME_LOGO,
      url: base,
      logo: { "@type": "ImageObject", url: `${base}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: base },
      { "@type": "ListItem", position: 2, name: "空き家・不動産", item: `${base}/akiya` },
      { "@type": "ListItem", position: 3, name: "空き家の解体補助金 完全ガイド", item: url },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 leading-relaxed text-foreground">
      <JsonLd data={[articleSchema, faqSchema, breadcrumbSchema]} />

      <nav className="mb-6 text-sm text-foreground/50" aria-label="パンくず">
        <Link href="/" className="hover:underline">ホーム</Link>
        <span className="mx-2">/</span>
        <Link href="/akiya" className="hover:underline">空き家・不動産</Link>
        <span className="mx-2">/</span>
        <span>空き家の解体補助金 完全ガイド</span>
      </nav>

      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
          空き家の解体補助金 完全ガイド【2026】
          <span className="mt-2 block text-base font-bold text-primary sm:text-lg">
            全国{c.total.toLocaleString("ja-JP")}自治体の独自データで、相場・条件・申請の流れまで
          </span>
        </h1>
        <p className="mt-4 text-base text-foreground/85">
          「実家を解体したいけれど、費用が高い」「補助金は使えるの？」——そんな方へ。
          このページでは、{SITE_NAME_LOGO}が全国{c.nationalTotal.toLocaleString("ja-JP")}市区町村の約{c.coveragePercent}%にあたる
          {c.total.toLocaleString("ja-JP")}自治体を独自に調査した一次データをもとに、空き家の解体補助金の
          <strong>相場・対象条件・申請の流れ・注意点</strong>、そして<strong>「解体すべきか売却すべきか」の判断</strong>まで、
          できるだけわかりやすくまとめました（{STATS_AS_OF}・{STATS_CREDIT}）。
        </p>
        <p className="mt-2 text-xs text-foreground/50">
          本記事は編集部が公的機関（総務省・国土交通省・各自治体）の情報をもとに作成しています。制度・税務・解体の個別の判断は、各自治体の窓口や税理士・司法書士・解体業者など各分野の専門家にご相談ください。
        </p>
      </header>

      {/* 結論（要点）*/}
      <section className="mb-10 rounded-2xl bg-primary/5 p-6" aria-label="この記事の要点">
        <h2 className="mb-3 text-lg font-bold">まず結論：解体補助金の全国実態（独自調査）</h2>
        <ul className="space-y-2 text-base">
          <li>・解体補助金を<strong>確認できたのは全国の{c.withSubsidyPercent}%</strong>（{c.total.toLocaleString("ja-JP")}自治体中{c.withSubsidy}自治体）。<strong>無い自治体も約半数</strong>あります。</li>
          <li>・上限額の<strong>中央値は{medianMan}</strong>（金額を確認できた{c.withParsedAmount}自治体／平均は約{avgMan}）。補助率は費用の1/3〜1/2が中心。</li>
          <li>・申請は<strong>原則「着工前」</strong>。工事後の申請は対象外になりがち。</li>
          <li>・補助金が無い・足りない場合は<strong>「解体せず売却」</strong>も有力。まず費用と査定額を比較しましょう。</li>
        </ul>
        <p className="mt-3 text-sm">
          → お住まいの地域の制度は
          <Link href="/data/akiya-hojokin-ranking" className="text-primary font-medium hover:underline">全国調査データ・ランキング</Link>
          や
          <Link href="/data" className="text-primary font-medium hover:underline">都道府県別データ（47面）</Link>
          で確認できます。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 border-l-4 border-primary pl-3 text-xl font-bold sm:text-2xl">そもそも「空き家の解体補助金」とは？</h2>
        <p className="text-base text-foreground/85">
          空き家の解体補助金とは、老朽化した危険な空き家などを取り壊す（除却する）際に、その費用の一部を自治体が補助する制度の総称です。
          放置された空き家は、倒壊・火災・衛生・景観などの面で周辺に悪影響を及ぼすため、国（空家等対策の推進に関する特別措置法）と各自治体が、
          自主的な解体・活用を後押ししています。実施するかどうか・金額・条件は<strong>市区町村ごとに大きく異なる</strong>のが特徴で、
          だからこそ「自分の地域はどうか」を個別に確認することが何より重要です。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 border-l-4 border-primary pl-3 text-xl font-bold sm:text-2xl">解体補助金の主な種類</h2>
        <p className="mb-3 text-base text-foreground/85">名称は自治体で異なりますが、代表的なものは次のとおりです。</p>
        <ul className="space-y-2 text-base">
          <li><strong>① 老朽危険空家等 除却補助</strong>：倒壊の恐れがある危険な空き家の解体を対象にする、最も一般的なタイプ。</li>
          <li><strong>② 特定空家等 除却補助</strong>：法に基づき「特定空家等」に判定された建物の除却を対象に、補助率・上限が手厚いことも。</li>
          <li><strong>③ 利活用・跡地活用型</strong>：解体後の土地を地域のために活用する（売却・住宅再建・広場化など）ことを条件にするタイプ。</li>
          <li><strong>④ 不燃化特区・密集市街地型</strong>：都市部の木造密集地で、防災のために高額（数百万円規模）の助成が出る場合があります（例：最高は{top ? `${top.prefName}${top.cityName}の${maxMan}` : "都市部の特例制度"}）。</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 border-l-4 border-amber-500 pl-3 text-xl font-bold sm:text-2xl">補助金額の相場はいくら？（全国データ）</h2>
        <p className="text-base text-foreground/85">
          {SITE_NAME_LOGO}が金額を確認できた{c.withParsedAmount}自治体を集計すると、上限額の<strong>中央値は{medianMan}</strong>、
          平均は約{avgMan}でした。補助率は「解体費用の3分の1〜2分の1以内」とする例が中心で、
          上限は<strong>50万〜100万円</strong>の自治体が多くを占めます。一方、{top ? `${top.prefName}${top.cityName}の${maxMan}` : "都市部"}のように、
          不燃化特区など特例制度では数百万円規模になることもあります（金額は目安。最新・正確な額は各自治体公式でご確認ください）。
        </p>
        <p className="mt-3 text-sm">
          → 金額ランキング・都道府県別の充実度・分布は
          <Link href="/data/akiya-hojokin-ranking" className="text-primary font-medium hover:underline">全国調査データ</Link>
          にまとめています。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 border-l-4 border-primary pl-3 text-xl font-bold sm:text-2xl">補助の対象になる空き家の条件</h2>
        <p className="mb-3 text-base text-foreground/85">自治体により異なりますが、よくある共通条件は次のとおりです。</p>
        <ul className="space-y-2 text-base">
          <li>・1年以上使用されていない（空き家である）こと。</li>
          <li>・一定の老朽度・危険度があること（耐震性が低い、倒壊の恐れ等）。木造が対象の制度が多い。</li>
          <li>・建物・土地の所有者、またはその相続人であること（委任状で代理申請が可能な場合も）。</li>
          <li>・市区町村税の滞納がないこと。</li>
          <li>・市内の登録業者・建設業許可業者に解体を依頼すること（指定がある場合）。</li>
        </ul>
        <p className="mt-3 text-sm">
          → 全国{c.total.toLocaleString("ja-JP")}自治体の申請条件を分析した
          <Link href="/data/akiya-hojokin-joken" className="text-primary font-medium hover:underline">「申請条件」の全国実態調査</Link>
          では、どの条件がどれだけの割合で課されているかを公開しています。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 border-l-4 border-primary pl-3 text-xl font-bold sm:text-2xl">申請の流れと必要書類</h2>
        <p className="mb-3 text-base text-foreground/85">
          最大の注意点は<strong>「必ず工事の前に申請・交付決定を受ける」</strong>こと。流れの一例です。
        </p>
        <ol className="space-y-2 text-base list-decimal list-inside">
          <li>自治体の窓口・公式サイトで、制度の有無・要件・予算枠を確認する。</li>
          <li>解体業者から見積もりを取る（複数社の比較がおすすめ）。</li>
          <li><strong>着工前に</strong>交付申請（申請書・見積書・登記事項証明書・現況写真・付近見取図など）。</li>
          <li>自治体の審査・現地調査 → 交付決定の通知を受ける。</li>
          <li>解体工事を実施し、完了後に実績報告（解体証明・領収書・完了写真）。</li>
          <li>金額の確定後、補助金が交付される。</li>
        </ol>
        <p className="mt-3 text-sm text-foreground/60">※ 必要書類・順序は自治体により異なります。必ず事前に窓口でご確認ください。</p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 border-l-4 border-rose-500 pl-3 text-xl font-bold sm:text-2xl">見落としがちな注意点</h2>
        <ul className="space-y-2 text-base">
          <li><strong>・先着・年度予算制が多い</strong>：予算枠に達すると年度途中で受付終了になることも。早めの確認・申請を。</li>
          <li><strong>・着工後はNG</strong>：見積もり前・解体前に申請するのが鉄則。</li>
          <li><strong>・併用の可否</strong>：国・県・市の制度や、跡地活用の補助との併用可否は要確認。</li>
          <li><strong>・更地にすると固定資産税が上がる</strong>：住宅を取り壊すと「住宅用地の特例」が外れ、土地の固定資産税が上がる点に注意（売却の予定や時期と合わせて検討）。</li>
        </ul>
      </section>

      {/* 解体費用相場 */}
      <section className="mb-10">
        <h2 className="mb-3 border-l-4 border-sky-500 pl-3 text-xl font-bold sm:text-2xl">解体費用の相場と、補助金で抑えられる額</h2>
        <p className="text-base text-foreground/85">
          木造住宅（30坪）の解体費用は、立地や付帯工事にもよりますが<strong>おおよそ90万〜150万円</strong>が目安です
          （鉄骨造・RC造はさらに高くなります）。ここに中央値{medianMan}の補助金を使えれば、実質負担を大きく抑えられる可能性があります。
          まずは複数社の見積もりで費用を把握し、補助金の対象・条件と合わせて検討しましょう。
        </p>
        <p className="mt-3 text-sm">
          → お住まいの地域の解体費用の目安は
          <Link href="/akiya" className="text-primary font-medium hover:underline">空き家・不動産の総合ページ</Link>
          や各地域ページでも確認できます。
        </p>
      </section>

      {/* 解体 vs 売却 + 査定CTA */}
      <section className="mb-10">
        <h2 className="mb-3 border-l-4 border-primary pl-3 text-xl font-bold sm:text-2xl">「解体する」と「売却する」どちらが得？</h2>
        <p className="text-base text-foreground/85">
          解体は数十万〜数百万円の出費です。一方で、古家付きのまま売却すれば解体費用がかからず、解体後より早く現金化できることもあります。
          「特定空家等」に指定され勧告を受けると<strong>土地の固定資産税が最大6倍</strong>になり得るため、放置はリスクですが、
          だからといって急いで解体するのが最適とは限りません。<strong>解体費用と、そのまま売った場合の価格を比較</strong>してから決めるのが堅実です。
          税額や売却の個別判断は、税理士・不動産の専門家にもご相談ください。
        </p>
      </section>

      <ArticleInlineAppraisalCTA variant="akiya" />

      {/* 自分の市区町村を調べる（47県内部リンクハブ） */}
      <section className="my-10">
        <h2 className="mb-3 border-l-4 border-emerald-500 pl-3 text-xl font-bold sm:text-2xl">お住まいの市区町村の補助金を調べる</h2>
        <p className="mb-4 text-base text-foreground/85">
          補助金の有無・上限額・条件は市区町村ごとに異なります。都道府県を選ぶと、市区町村別ランキング・中央値・全国比較が見られます。
        </p>
        <div className="flex flex-wrap gap-2">
          {prefs.map((p) => (
            <Link
              key={p.prefId}
              href={`/data/akiya-hojokin-ranking/${p.prefId}`}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground/80 transition hover:border-primary/40 hover:text-primary"
            >
              {p.prefName}
            </Link>
          ))}
        </div>
        <p className="mt-4 text-sm">
          固定資産税の影響は
          <Link href="/tools/empty-house-tax" className="text-primary font-medium hover:underline">空き家の固定資産税シミュレーター</Link>
          で試算できます。
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="mb-4 border-l-4 border-primary pl-3 text-xl font-bold sm:text-2xl">よくある質問</h2>
        <div className="space-y-4">
          {FAQ.map((f) => (
            <div key={f.q} className="rounded-xl border border-border bg-card p-5">
              <p className="font-bold text-foreground">Q. {f.q}</p>
              <p className="mt-2 text-base text-foreground/85">A. {f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Zero-Party */}
      <EmailCTA
        variant="inline"
        heading="空き家・解体補助金の進め方ガイドを無料でお届け"
        description="補助金の申請の流れ・必要書類・解体前の注意点をまとめた無料PDFと、空き家の費用・税金の最新情報をメールでお送りします（いつでも配信停止できます）。"
        source="guide_kaitai_hojokin"
      />

      {/* 出典・関連 */}
      <section className="mt-10 border-t border-border pt-6 text-sm text-foreground/60">
        <p className="mb-2 font-medium text-foreground/80">出典・参考</p>
        <ul className="space-y-1">
          <li>・全国の補助金データ：{STATS_CREDIT}（{STATS_AS_OF}・出典＝各自治体公式サイト）／母数 {NATIONAL_TOTAL_SOURCE}</li>
          <li>・空家等対策の推進に関する特別措置法、固定資産税の住宅用地特例：国土交通省・総務省</li>
        </ul>
        <p className="mt-3">
          関連：
          <Link href="/data/akiya-hojokin-ranking" className="text-primary hover:underline">全国 空き家解体補助金 調査データ</Link>
          {" / "}
          <Link href="/news/akiya-hojokin-survey-2026" className="text-primary hover:underline">調査発表（プレスリリース）</Link>
          {" / "}
          <Link href="/akiya" className="text-primary hover:underline">空き家・不動産の総合ページ</Link>
        </p>
      </section>
    </main>
  );
}
