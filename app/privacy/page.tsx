import type { Metadata } from "next";
import Link from "next/link";
import { pageTitle, SITE_NAME_FULL } from "../lib/site-brand";

export const metadata: Metadata = {
  title: pageTitle("プライバシーポリシー"),
  description: `${SITE_NAME_FULL}のプライバシーポリシーです。個人情報の収集・利用・第三者提供についてご説明します。`,
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-primary mb-2">プライバシーポリシー</h1>
      <p className="text-sm text-foreground/60 mb-8">制定日：2026年2月</p>

      <article className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm">
        <section>
          <p>
            株式会社Kogera（以下「当社」といいます）は、当社が運営するウェブサイト「{SITE_NAME_FULL}」（以下「本サービス」といいます）の運営にあたり、お客様からお預かりする個人情報の大切さを深く認識し、その保護に取り組むことは、当社にとってもっとも重要な社会的責務であると考えております。
          </p>
          <p>
            当社は、お客様に安心して本サービスをご利用いただき、最良の解決策をご提供できるよう、個人情報の保護に関する法律（個人情報保護法）その他の関係法令を遵守するとともに、以下の通りプライバシーポリシー（以下「本ポリシー」といいます）を定め、全社を挙げて個人情報の適切な取り扱いに努めてまいります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-6 mb-2">第1条（個人情報の取得と利用の考え方）</h2>
          <p>
            当社は、お客様一人ひとりの状況に合わせた最適なご提案を行うため、適法かつ公正な手段により、以下の情報を取得させていただきます。これらは、お客様の課題解決と利便性向上のためにのみ活用されます。
          </p>
          <h3 className="text-base font-bold mt-4 mb-2">お客様ご自身よりご提供いただく情報</h3>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><strong>お客様ご自身の情報</strong>：お名前、生年月日、性別、ご住所など、お客様ご本人を識別し、適切なご連絡を行うための基本情報。</li>
            <li><strong>ご連絡先情報</strong>：メールアドレス、電話番号など、ご相談への回答や重要なお知らせを確実にお届けするための情報。</li>
            <li><strong>ご相談・ご要望の詳細</strong>：お問い合わせフォーム、診断ツール、アンケート等を通じてご入力いただいた、生前整理、不動産、相続等に関する具体的なご状況やご希望条件。</li>
          </ul>
          <h3 className="text-base font-bold mt-4 mb-2">サービスご利用時にシステムが自動的に取得する情報</h3>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><strong>ご利用環境に関する情報</strong>：ご利用の端末情報（PC、スマートフォン等）、OSの種類、ブラウザ情報、IPアドレス、アクセス日時など。</li>
            <li><strong>ご利用状況に関する情報</strong>：本サービス内での閲覧ページ、滞在時間、クリック履歴、Cookie（クッキー）等の識別子。</li>
          </ul>
          <p className="mt-2">
            これらの情報は、システム障害時の迅速な対応、セキュリティの確保、およびお客様にとって使いやすい画面表示への最適化のために利用させていただきます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-6 mb-2">第2条（利用目的の明示）</h2>
          <p>
            当社は、お預かりした個人情報を、あらかじめお客様の同意をいただいた場合や法令に基づく場合を除き、以下の利用目的の達成に必要な範囲内でのみ利用いたします。
          </p>
          <h3 className="text-base font-bold mt-4 mb-2">本サービスの提供および品質向上のため</h3>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>お客様からのお問い合わせ、ご相談に対する迅速かつ適切な回答。</li>
            <li>ガイドブック、資料、診断結果等の送付およびご案内。</li>
            <li>ご本人様確認および不正利用の防止。</li>
          </ul>
          <h3 className="text-base font-bold mt-4 mb-2">お客様への有益な情報提供および課題解決のご提案のため</h3>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>お客様のご状況や関心に合わせた、生前整理・遺品整理・不動産活用に関する最適なプランや解決策のご提案。</li>
            <li>本サービスに関するキャンペーン、セミナー、新機能等のご案内（電子メール、LINE、ダイレクトメール等による配信を含みます）。</li>
            <li>お客様の興味・関心に基づいた、当社または提携パートナー企業の有益な情報の配信（行動ターゲティング広告を含みます）。</li>
          </ul>
          <h3 className="text-base font-bold mt-4 mb-2">パートナー企業との連携による解決策の実行（ご希望の場合）</h3>
          <p>
            お客様が、専門家（整理業者、解体業者、不動産会社、司法書士等）への具体的な相談、見積もり依頼、資料請求等を希望された場合に、お客様のニーズに合致する適切なパートナー企業を選定し、お取次ぎ・紹介を行うため。
          </p>
          <h3 className="text-base font-bold mt-4 mb-2">サービス改善およびマーケティング調査のため</h3>
          <p>
            個人を特定できない形式に加工した統計データ（属性情報、利用傾向等）を作成し、サービスの改善、新商品の開発、および市場調査等のマーケティング資料として活用するため。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-6 mb-2">第3条（個人情報の第三者提供について）</h2>
          <p>
            当社は、お客様のプライバシーを尊重し、原則としてお客様の同意なく個人情報を第三者に提供することはございません。ただし、お客様の利益を最大化し、円滑なサービス提供を行うために必要な以下のケースに限り、情報を提供させていただく場合がございます。
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong>お客様のご依頼に基づくパートナー連携</strong> 本サービスを通じて、提携パートナー企業への紹介、見積もり依頼、資料請求等を希望された場合。（※この場合、お客様の入力情報は当該パートナー企業へ共有され、同企業から直接お客様へご連絡が入る場合がございます。当社は、信頼できるパートナー企業のみを厳選しております。）
            </li>
            <li>
              <strong>業務委託に伴う提供</strong> システム開発・保守、カスタマーサポート、郵送物の発送、メール配信など、当社の業務の一部を外部の専門事業者に委託する場合。（※委託先に対しては、当社と同等の厳格な情報管理を義務付ける契約を締結し、適切な監督を行います。）
            </li>
            <li>
              <strong>事業の承継に伴う提供</strong> 合併、会社分割、事業譲渡その他の事由により、当社の事業が第三者に承継される場合。（※これにより、お客様へのサービス提供が途切れることなく、継続的に行われるよう万全を期します。）
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-6 mb-2">第4条（クッキー（Cookie）等の取り扱い）</h2>
          <p>
            本サービスでは、お客様により便利にご利用いただくため、クッキー（Cookie）およびこれに類する技術を利用しています。これにより、お客様のブラウザを識別し、次回以降の入力の手間を省いたり、お客様のご興味に合わせた情報表示が可能になります。
          </p>
          <p>
            また、当社は、広告配信事業者等のパートナー企業を通じて、お客様の関心に合わせた広告配信を行う場合があります。これらはお客様のブラウザ設定により、無効化（オプトアウト）することが可能です。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-6 mb-2">第5条（安全管理措置）</h2>
          <p>
            当社は、お客様の個人情報を正確かつ最新の状態に保つよう努めるとともに、個人情報への不正アクセス、紛失、破壊、改ざん、漏洩等を防止するため、以下の安全管理措置を講じています。
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><strong>基本方針の策定</strong>：個人データの適正な取り扱いの確保のため、関係法令・ガイドライン等の遵守についての基本方針を策定しています。</li>
            <li><strong>規律の整備</strong>：取得、利用、保存、提供、削除・廃棄等の段階ごとに、取扱方法、責任者・担当者及びその任務等について社内規程を策定しています。</li>
            <li><strong>組織的安全管理措置</strong>：個人情報の取り扱いに関する責任者を設置するとともに、個人情報を取り扱う従業者及び当該従業者が取り扱う個人情報の範囲を明確化しています。</li>
            <li><strong>技術的・物理的セキュリティ</strong>：通信の暗号化（SSL/TLS）、不正アクセス防止システムの導入、アクセス権限の管理等を実施しています。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-6 mb-2">第6条（プライバシーポリシーの改定）</h2>
          <p>
            当社は、法令の改正、社会情勢の変化、および技術の進歩に合わせて、本ポリシーの内容を適宜見直し、継続的な改善に努めます。重要な変更がある場合には、本ウェブサイト上にてわかりやすくお知らせいたします。改定後のプライバシーポリシーは、本ページに掲載した時点から効力を生じるものとします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mt-6 mb-2">第7条（お問い合わせ窓口）</h2>
          <p>
            本ポリシーの内容や、お客様ご自身の個人情報の取り扱い（開示・訂正・利用停止等）に関するご質問・ご意見は、当社のお客様相談窓口にて誠実かつ迅速に対応させていただきます。
          </p>
          <p className="mt-2">
            株式会社Kogera 個人情報お客様相談窓口{" "}
            <Link href="/contact" className="text-primary hover:underline">お問い合わせフォーム</Link>
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
