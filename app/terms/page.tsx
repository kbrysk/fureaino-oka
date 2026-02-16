import type { Metadata } from "next";
import Link from "next/link";
import { pageTitle, SITE_NAME_FULL } from "../lib/site-brand";

export const metadata: Metadata = {
  title: pageTitle("利用規約"),
  description: `${SITE_NAME_FULL}の利用規約です。サービスの利用条件、禁止行為、免責事項をご確認ください。`,
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-primary mb-2">利用規約</h1>
      <p className="text-sm text-foreground/60 mb-8">制定日：2026年2月</p>

      <article className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm">
        <section>
          <p>
            この利用規約（以下「本規約」といいます）は、株式会社Kogera（以下「当社」といいます）が運営する「{SITE_NAME_FULL}」（以下「本サービス」といいます）の利用条件を定めるものです。本サービスをご利用になる皆さま（以下「ユーザー」といいます）には、本規約に従って本サービスをご利用いただきます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-6 mb-2">第1条（適用および同意）</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>本規約は、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されます。</li>
            <li>ユーザーは、本サービスを利用することによって、本規約のすべての記載内容に同意したものとみなされます。</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-6 mb-2">第2条（本サービスの内容と範囲）</h2>
          <p>
            当社は、ユーザーの生前整理・終活・不動産活用に関する課題解決を支援するため、以下のサービスを提供します。なお、当社は事業の拡大や改善に伴い、サービス内容を随時追加・変更できるものとします。
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>情報提供サービス</strong> 生前整理、実家じまい、相続、空き家活用に関する記事、ガイドブック、ニュース等の配信。</li>
            <li><strong>診断・シミュレーション機能</strong> 「実家じまい力診断」「空き家リスク診断」「相続準備力診断」「法定相続分シミュレーター」等のツール提供。</li>
            <li><strong>マッチング・紹介支援（パートナー連携）</strong> ユーザーの要望に基づき、適切な専門事業者（遺品整理業者、不動産会社、解体業者、士業、買取業者等。以下「提携パートナー」といいます）を選定し、紹介・取次を行うサービス。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-6 mb-2">第3条（契約の主体と責任分界点）</h2>
          <p className="text-foreground/80"><strong>【重要】本条は、当社が紹介・取次を行う上での法的責任範囲を定めるものです。</strong></p>
          <h3 className="text-base font-bold mt-4 mb-2">契約の当事者</h3>
          <p>
            本サービスを通じて、ユーザーが提携パートナーに対し見積もり依頼、業務委託、不動産売買等の契約を行う場合、当該契約は「ユーザーと提携パートナーの間」で直接成立します。当社は契約の当事者、代理人、連帯保証人にはならず、当該契約について一切の責任を負いません。
          </p>
          <h3 className="text-base font-bold mt-4 mb-2">トラブルの解決</h3>
          <p>
            提携パートナーによる業務の遂行（見積もり金額、作業品質、接客態度、契約不履行等）に関して万が一トラブルが生じた場合、ユーザーと提携パートナーとの間で解決するものとし、当社はこれに関与しません。ただし、当社は本サービスの品質維持のため、ユーザーからの報告を受け付け、提携パートナーへの指導等、適切な措置を講じるよう努めます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-6 mb-2">第4条（診断ツール等の利用に関する免責）</h2>
          <p>
            本サービスで提供する診断結果、シミュレーション数値、および記事コンテンツは、一般的な目安や情報提供を目的としています。個別の事情による税額計算、法的判断、不動産査定額等は、条件により変動する可能性があります。したがって、最終的な判断や手続きにあたっては、必ず弁護士・税理士・司法書士等の専門家に個別にご相談ください。本サービスの情報を利用して行われた行為の結果について、当社は責任を負いかねます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-6 mb-2">第5条（禁止事項）</h2>
          <p>ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>直接取引の勧誘</strong> 本サービスを通じて知り得た提携パートナーに対し、本サービスを介さずに直接取引を持ちかける行為、または提携パートナーからの同様の勧誘に応じる行為（当社の正当な収益機会を損なうため）。</li>
            <li><strong>不正な目的での利用</strong> 競合他社がリサーチ目的で利用する行為、営業活動、勧誘活動、または反社会的勢力に対する利益供与等の行為。</li>
            <li><strong>サービスの妨害</strong> 当社のサーバーやネットワークに過度の負担をかける行為、不正アクセス、有害なプログラムの送信、またはシステムをリバースエンジニアリングする行為。</li>
            <li><strong>知的財産権の侵害</strong> 本サービスに含まれるコンテンツ（文章、画像、診断ロジック、デザイン等）を、当社の事前の許諾なく転載、複製、改変、販売、公衆送信する行為。</li>
            <li>その他、当社が不適切と判断する行為。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-6 mb-2">第6条（ユーザー情報の取扱いとデータの権利）</h2>
          <p>
            <strong>個人情報の取扱い</strong> 当社は、ユーザーの個人情報を別途定める「<Link href="/privacy" className="text-primary hover:underline">プライバシーポリシー</Link>」に従い、適切に取り扱います。
          </p>
          <p className="mt-2">
            <strong>統計データの利用権</strong> 当社は、ユーザーが本サービスに入力した情報（診断回答、属性、行動履歴等）を、個人を特定できない形式の統計データに加工した上で、当社の裁量により利用（市場調査、出版、新サービス開発、第三者への提供・販売等）できるものとします。ユーザーはこれに対し、著作者人格権等の権利を行使しないものとします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-6 mb-2">第7条（本サービスの停止・変更・終了）</h2>
          <p>
            当社は、以下のいずれかの事由に該当する場合、ユーザーに事前に通知することなく、本サービスの全部または一部の提供を停止または中断できるものとします。
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>システム保守、点検、修理、変更を定期的または緊急に行う場合。</li>
            <li>地震、火災、停電、天災地変等の不可抗力によりサービスの提供が困難となった場合。</li>
            <li>その他、運用上または技術上、当社がサービスの一時的な中断が必要と判断した場合。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-6 mb-2">第8条（損害賠償の制限）</h2>
          <p>
            当社の債務不履行または不法行為によりユーザーに損害が生じた場合、当社は、当社の故意または重過失がある場合に限り、その責任を負います。なお、当社が責任を負う場合であっても、その範囲は、ユーザーに生じた「通常かつ直接の損害」に限られるものとし、予見の有無を問わず特別の事情から生じた損害（逸失利益等）については責任を負わないものとします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-6 mb-2">第9条（反社会的勢力の排除）</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              ユーザーは、現在および将来にわたり、自らが暴力団、暴力団員、暴力団準構成員、総会屋等、その他これらに準ずる者（以下「反社会的勢力」といいます）に該当しないこと、および反社会的勢力と関係を持たないことを表明し、保証するものとします。
            </li>
            <li>
              当社は、ユーザーが前項に違反すると判断した場合、何らの通知催告を要せず、ただちに本サービスの利用停止等の措置を講じることができるものとします。
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-6 mb-2">第10条（利用規約の変更）</h2>
          <p>
            当社は、必要と判断した場合には、ユーザーへの個別通知を行うことなく、本規約を変更することができるものとします。変更後の規約は、本ウェブサイト上に掲示した時点から効力を生じるものとし、ユーザーが本サービスを利用し続けた場合、変更後の規約に同意したものとみなします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-6 mb-2">第11条（準拠法・裁判管轄）</h2>
          <p>
            本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、訴額の如何にかかわらず、当社の本店所在地を管轄する地方裁判所を第一審の専属的合意管轄裁判所とします。
          </p>
        </section>

        <p className="text-foreground/60 pt-8">以上</p>
        <p className="font-medium">株式会社Kogera</p>
      </article>

      <p className="mt-8">
        <Link href="/" className="text-primary font-medium hover:underline">← トップへ戻る</Link>
      </p>
    </div>
  );
}
