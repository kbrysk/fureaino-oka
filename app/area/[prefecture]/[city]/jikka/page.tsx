import Link from "next/link";
import { notFound } from "next/navigation";
import { getAreaById } from "../../../../lib/area-data";
import {
  getMunicipalityDataOrDefault,
  getMunicipalitiesByPrefecture,
} from "../../../../lib/data/municipalities";
import { getCanonicalUrl } from "../../../../lib/site-url";
import { pageTitle } from "../../../../lib/site-brand";

export const dynamicParams = true;
export const revalidate = 86400;

/**
 * 指示文書 #02 Phase1（愛知県）: municipalities.json の愛知県エントリを対象とする。
 * 大府市 (obu)・清須市 (kiyosu) は既存ページのため除外。半田市 (handa) は Phase1 リストに含まれないため除外。
 */
const EXCLUDED_AICHI_JIKKA = new Set(["obu", "kiyosu", "handa"]);

const AICHI_JIKKA_CITY_IDS = new Set(
  getMunicipalitiesByPrefecture("aichi")
    .filter((m) => !EXCLUDED_AICHI_JIKKA.has(m.cityId))
    .map((m) => m.cityId)
);

interface Props {
  params: Promise<{ prefecture: string; city: string }>;
}

export async function generateStaticParams() {
  return Array.from(AICHI_JIKKA_CITY_IDS)
    .sort()
    .map((city) => ({
      prefecture: "aichi",
      city,
    }));
}

export async function generateMetadata({ params }: Props) {
  const { prefecture, city } = await params;
  if (prefecture !== "aichi" || !AICHI_JIKKA_CITY_IDS.has(city)) {
    return { title: pageTitle("実家じまい完全ガイド"), alternates: { canonical: getCanonicalUrl(`/area/${prefecture}/${city}/jikka`) } };
  }
  const area = getAreaById(prefecture, city);
  const fallbackNames = { prefName: area?.prefecture ?? prefecture, cityName: area?.city ?? city };
  const data = await getMunicipalityDataOrDefault(prefecture, city, fallbackNames);
  const canonical = getCanonicalUrl(`/area/${prefecture}/${city}/jikka`);
  const titlePart = `【2026年最新】${data.cityName}の実家じまい完全ガイド｜費用・業者・補助金を徹底解説`;
  const description = `${data.cityName}で実家じまいをお考えの方へ。遺品整理・解体・不動産売却の費用相場と業者の選び方、使える補助金を地域の実情に合わせて解説。まず何をすべきかがわかります。`;
  return {
    title: pageTitle(titlePart),
    description,
    alternates: { canonical },
  };
}

function hasInternalAreaRoutes(prefecture: string, city: string): boolean {
  return getAreaById(prefecture, city) !== null;
}

export default async function AreaJikkaPage({ params }: Props) {
  const { prefecture, city } = await params;
  if (prefecture !== "aichi" || !AICHI_JIKKA_CITY_IDS.has(city)) {
    notFound();
  }

  const area = getAreaById(prefecture, city);
  const fallbackNames = { prefName: area?.prefecture ?? prefecture, cityName: area?.city ?? city };
  const data = await getMunicipalityDataOrDefault(prefecture, city, fallbackNames);
  const cityName = data.cityName;
  const hasArea = hasInternalAreaRoutes(prefecture, city);

  const subsidyHref = hasArea ? `/area/${prefecture}/${city}/subsidy` : null;
  const costHref = hasArea ? `/area/${prefecture}/${city}/cost` : null;
  const taxSimulatorHref = hasArea ? `/tax-simulator/${prefecture}/${city}` : null;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "実家じまいにかかる費用はどのくらいですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "作業の内容と量によって大きく異なります。遺品整理だけであれば数万円〜数十万円、解体を伴う場合は100万円〜300万円以上になることもあります。まずは無料見積もりを取ることをおすすめします。",
        },
      },
      {
        "@type": "Question",
        name: "遠方に住んでいても実家じまいはできますか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "できます。多くの業者がオンラインでの相談・見積もりに対応しています。現地への立ち会いが難しい場合は、その旨を業者に伝えると対応してもらえます。",
        },
      },
      {
        "@type": "Question",
        name: `${cityName}で使える補助金はありますか？`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `空き家の解体や改修に使える補助金が設けられている場合があります。詳しくは${cityName}の補助金ページをご確認ください。`,
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="space-y-8 max-w-3xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary leading-snug">
            {cityName}の実家じまい完全ガイド【2026年最新版】
          </h1>
        </div>

        <section className="prose prose-neutral dark:prose-invert max-w-none">
          <h2 className="text-xl font-bold text-foreground">{cityName}で実家じまいを考えている方へ</h2>
          <p className="text-base text-foreground/90 leading-relaxed">
            親の家をどうするか、一人で抱え込んでいませんか。
            {cityName}で実家じまいに取り組む方が増えています。「何から始めればいいかわからない」という方のために、このページでは実家じまいの流れを順番に解説します。
          </p>

          <hr className="my-8 border-border" />

          <h2 className="text-xl font-bold text-foreground">実家じまいとは何か</h2>
          <p className="text-base text-foreground/90 leading-relaxed">
            実家じまいとは、親が高齢になったり、亡くなったりしたあとに、実家の片付け・整理・処分までを行うことです。
            具体的には次のような作業が含まれます。
          </p>
          <ul className="list-disc list-inside space-y-1 text-base text-foreground/90">
            <li>家の中の荷物・家財の整理と処分（遺品整理）</li>
            <li>建物の解体または売却</li>
            <li>相続登記などの手続き</li>
          </ul>
          <p className="text-base text-foreground/90 leading-relaxed">
            一度に全部やる必要はありません。まずは「どの状態か」を確認することが大切です。
          </p>

          <hr className="my-8 border-border" />

          <h2 className="text-xl font-bold text-foreground">{cityName}での実家じまい：3つのステップ</h2>

          <h3 className="text-lg font-bold text-foreground mt-6">ステップ1：現状を確認する</h3>
          <p className="text-base text-foreground/90 leading-relaxed">まず、実家の状況を把握します。</p>
          <ul className="list-disc list-inside space-y-1 text-base text-foreground/90">
            <li>建物の築年数・状態（雨漏り・傾きなどがないか）</li>
            <li>荷物の量（部屋数・押し入れの数）</li>
            <li>相続登記が完了しているか</li>
          </ul>

          <h3 className="text-lg font-bold text-foreground mt-6">ステップ2：処分方法を決める</h3>
          <p className="text-base text-foreground/90 leading-relaxed">{cityName}では、主に以下の3つの方法が選ばれています。</p>
          <p className="text-base text-foreground/90 leading-relaxed mt-4">
            <strong>① そのまま売る</strong>
            <br />
            建物付きで不動産会社に売却する方法です。片付けの手間が少なく済む場合があります。
          </p>
          <p className="text-base text-foreground/90 leading-relaxed mt-4">
            <strong>② 解体して土地を売る</strong>
            <br />
            建物を取り壊してから土地を売る方法です。{cityName}では解体費用の補助金が使える場合があります。
            <br />
            → 補助金の詳細は
            {subsidyHref ? (
              <Link href={subsidyHref} className="text-primary underline">
                {cityName}の補助金ページ
              </Link>
            ) : (
              <>{cityName}の補助金ページ</>
            )}
            をご確認ください。
          </p>
          <p className="text-base text-foreground/90 leading-relaxed mt-4">
            <strong>③ 賃貸・活用する</strong>
            <br />
            空き家として貸し出す方法です。管理の手間はかかりますが、売却を急がなくて済みます。
          </p>

          <h3 className="text-lg font-bold text-foreground mt-6">ステップ3：業者に相談する</h3>
          <p className="text-base text-foreground/90 leading-relaxed">
            どの方法を選ぶにしても、専門業者への相談が必要です。
            複数の業者から見積もりを取り、比較することをおすすめします。
          </p>

          <hr className="my-8 border-border" />

          <h2 className="text-xl font-bold text-foreground">よくある質問（FAQ）</h2>

          <h3 className="text-lg font-bold text-foreground mt-6">Q. 実家じまいにかかる費用はどのくらいですか？</h3>
          <p className="text-base text-foreground/90 leading-relaxed">
            作業の内容と量によって大きく異なります。
            <br />
            遺品整理だけであれば数万円〜数十万円、解体を伴う場合は100万円〜300万円以上になることもあります。
            <br />
            まずは無料見積もりを取ることをおすすめします。
          </p>

          <h3 className="text-lg font-bold text-foreground mt-6">Q. 遠方に住んでいても実家じまいはできますか？</h3>
          <p className="text-base text-foreground/90 leading-relaxed">
            できます。多くの業者がオンラインでの相談・見積もりに対応しています。
            <br />
            現地への立ち会いが難しい場合は、その旨を業者に伝えると対応してもらえます。
          </p>

          <h3 className="text-lg font-bold text-foreground mt-6">Q. 親が存命中でも実家じまいの準備はできますか？</h3>
          <p className="text-base text-foreground/90 leading-relaxed">
            できます。むしろ親が元気なうちに一緒に進めることをおすすめします。
            <br />
            本人の意思を確認しながら進めることで、後のトラブルを防ぐことができます。
          </p>

          <h3 className="text-lg font-bold text-foreground mt-6">Q. {cityName}で使える補助金はありますか？</h3>
          <p className="text-base text-foreground/90 leading-relaxed">
            空き家の解体や改修に使える補助金が設けられている場合があります。
            <br />
            詳しくは
            {subsidyHref ? (
              <Link href={subsidyHref} className="text-primary underline">
                {cityName}の補助金ページ
              </Link>
            ) : (
              <>{cityName}の補助金ページ</>
            )}
            をご覧ください。
          </p>

          <hr className="my-8 border-border" />

          <h2 className="text-xl font-bold text-foreground">{cityName}の実家じまいに関連するページ</h2>
          <ul className="list-disc list-inside space-y-2 text-base text-foreground/90">
            <li className="text-foreground/90">
              {/* INSTRUCTION-010: cleanup は noindex のため内部リンクを除去 */}
              {cityName}の遺品整理ガイド
            </li>
            <li>
              {costHref ? (
                <Link href={costHref} className="text-primary underline">
                  {cityName}の解体費用と補助金
                </Link>
              ) : (
                <>{cityName}の解体費用と補助金</>
              )}
            </li>
            {taxSimulatorHref ? (
              <li>
                <Link href={taxSimulatorHref} className="text-primary underline">
                  費用シミュレーター
                </Link>
              </li>
            ) : null}
          </ul>
        </section>
      </div>
    </>
  );
}
