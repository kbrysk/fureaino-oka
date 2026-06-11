import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPrefectureIds } from "../../../lib/utils/city-loader";
import { getMunicipalitiesByPrefecture } from "../../../lib/data/municipalities";
import CleanupAffiliateCard from "../../../components/CleanupAffiliateCard";
import JsonLd from "../../../components/JsonLd";
import { pageTitle } from "../../../lib/site-brand";
import { getCanonicalUrl } from "../../../lib/site-url";

/**
 * 県単位 cleanup ハブ（HCS対策 2026-06）
 * 市区町村別の薄い cleanup/garbage ページ（noindex済み）の需要の受け皿として、
 * 「{県名} 粗大ごみ」「{県名} 遺品整理」系クエリを1枚の厚いページで取りに行く。
 * - 県内全市区町村の自治体公式・粗大ごみ案内リンクを一覧化（電話番号は非掲載＝遵守ルール）
 * - 遺品整理・実家片付けの相場と業者選び、FAQ（FAQPage構造化データ付き）
 */

export const dynamicParams = true;
export const revalidate = 86400;

interface Props {
  params: Promise<{ prefecture: string }>;
}

export async function generateStaticParams() {
  return getPrefectureIds().map((prefecture) => ({ prefecture }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { prefecture } = await params;
  const munis = getMunicipalitiesByPrefecture(prefecture);
  if (munis.length === 0) {
    return { title: pageTitle("粗大ごみ・遺品整理ガイド"), robots: { index: false, follow: true } };
  }
  const prefName = munis[0].prefName;
  const canonical = getCanonicalUrl(`/area/${prefecture}/cleanup`);
  const currentYear = new Date().getFullYear();
  const title = pageTitle(`${prefName}の粗大ごみの出し方・遺品整理ガイド【${currentYear}年版】`);
  const description = `${prefName}の粗大ごみの出し方と遺品整理・実家片付けの費用相場を解説。県内${munis.length}市区町村の自治体公式案内へのリンクを一覧にまとめました。申込方法・持ち込み・業者選びのポイントも紹介します。`;
  return {
    title,
    description: description.length > 120 ? description.slice(0, 119) + "…" : description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
  };
}

function buildFaqJsonLd(prefName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `${prefName}で粗大ごみを出すにはどうすればよいですか？`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "多くの自治体では「事前申込→粗大ごみ処理券（シール）の購入→指定日に収集場所へ排出」という流れです。品目・手数料・申込方法は市区町村ごとに異なるため、お住まいの自治体の公式案内をご確認ください。",
        },
      },
      {
        "@type": "Question",
        name: `${prefName}での遺品整理の費用はどのくらいですか？`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "部屋数・荷物の量・作業内容によって大きく異なります。1Kで数万円〜十数万円、2LDKで20〜40万円程度、3LDK以上では40万円を超えることもあります。複数業者の無料見積もりで比較することをおすすめします。",
        },
      },
      {
        "@type": "Question",
        name: "実家の片付けで出た粗大ごみは自治体回収と業者依頼のどちらがよいですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "数点だけなら自治体回収が割安です。家一軒分など量が多い場合や、搬出・分別も任せたい場合は、買取やリサイクルに対応した遺品整理業者へまとめて依頼すると負担を減らせます。",
        },
      },
    ],
  };
}

export default async function PrefectureCleanupHubPage({ params }: Props) {
  const { prefecture } = await params;
  const munis = getMunicipalitiesByPrefecture(prefecture);
  if (munis.length === 0) notFound();
  const prefName = munis[0].prefName;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <JsonLd data={buildFaqJsonLd(prefName)} />

      <nav className="text-sm text-foreground/60">
        <ol className="flex flex-wrap gap-1">
          <li>
            <Link href="/" className="hover:text-primary hover:underline">トップ</Link>
            <span className="mx-1">›</span>
          </li>
          <li>
            <Link href="/area" className="hover:text-primary hover:underline">地域から探す</Link>
            <span className="mx-1">›</span>
          </li>
          <li>
            <Link href={`/area/${prefecture}`} className="hover:text-primary hover:underline">{prefName}</Link>
            <span className="mx-1">›</span>
          </li>
          <li className="text-foreground/80">粗大ごみ・遺品整理</li>
        </ol>
      </nav>

      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          {prefName}の粗大ごみの出し方・遺品整理ガイド
        </h1>
        <p className="text-foreground/70 mt-3 leading-relaxed">
          {prefName}内{munis.length}市区町村の粗大ごみ公式案内へのリンクを一覧にまとめました。
          実家の片付け・遺品整理で大量の不用品が出る場合の費用相場と業者選びのポイントもあわせて解説します。
        </p>
      </header>

      <section className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 className="font-bold text-primary">粗大ごみの出し方（基本の流れ）</h2>
        </div>
        <div className="p-6 space-y-3 text-sm text-foreground/80 leading-relaxed">
          <ol className="list-decimal list-inside space-y-2">
            <li><strong>事前申込</strong>：自治体の粗大ごみ受付（Web・電話）へ品目と点数を申し込む</li>
            <li><strong>処理券の購入</strong>：コンビニ等で「粗大ごみ処理券（シール）」を購入して貼付</li>
            <li><strong>指定日に排出</strong>：収集日の朝、指定場所へ出す（持ち込みできる自治体もあり）</li>
          </ol>
          <p className="text-xs text-foreground/50">
            ※ 品目・手数料・申込方法は市区町村で異なります。下の一覧からお住まいの自治体の公式案内をご確認ください。
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-primary mb-4">
          {prefName}の市区町村別 粗大ごみ公式案内一覧
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {munis.map((m) => (
            <div key={m.cityId} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="font-bold text-gray-900">{m.cityName}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <a
                  href={m.garbage.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  公式の粗大ごみ案内
                </a>
                <Link
                  href={`/area/${m.prefId}/${m.cityId}`}
                  className="text-primary hover:underline"
                >
                  {m.cityName}の片付け・補助金情報
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 className="font-bold text-primary">遺品整理・実家片付けの費用相場（{prefName}）</h2>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-foreground/70 leading-relaxed">
            家一軒分の片付けになると、粗大ごみの自治体回収だけでは対応しきれないことがあります。
            遺品整理業者へ依頼する場合の相場は、部屋数・荷物量によって次が目安です。
          </p>
          <ul className="text-sm text-foreground/70 space-y-1 list-disc list-inside">
            <li>1K：数万円〜十数万円</li>
            <li>2LDK：20〜40万円程度</li>
            <li>3LDK〜4LDK：40万円〜（荷物量で変動）</li>
          </ul>
          <p className="text-xs text-foreground/50">
            業者・作業内容により異なります。必ず複数社の無料見積もりでご確認ください。
          </p>
        </div>
      </section>

      <section className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-primary-light/30">
          <h2 className="font-bold text-primary">業者選び 3つのポイント</h2>
        </div>
        <div className="p-6">
          <ul className="text-sm text-foreground/80 space-y-3 list-disc list-inside leading-relaxed">
            <li><strong>一般廃棄物収集運搬の許可</strong>（または許可業者との提携）を確認する</li>
            <li><strong>見積もりの内訳</strong>（人件費・車両費・処分費）が明確な業者を選ぶ</li>
            <li><strong>買取・リサイクル対応</strong>があると処分費を抑えられる</li>
          </ul>
        </div>
      </section>

      <CleanupAffiliateCard cityName={prefName} cityId={prefecture} />

      <section>
        <h2 className="text-xl font-bold text-primary mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900">Q. {prefName}で粗大ごみを出すにはどうすればよいですか？</h3>
            <p className="text-sm text-foreground/70 mt-2 leading-relaxed">
              A. 多くの自治体では「事前申込→処理券購入→指定日に排出」の流れです。品目・手数料は市区町村ごとに異なるため、上の一覧から公式案内をご確認ください。
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900">Q. 遺品整理の費用はどのくらいかかりますか？</h3>
            <p className="text-sm text-foreground/70 mt-2 leading-relaxed">
              A. 1Kで数万円〜、2LDKで20〜40万円程度、3LDK以上で40万円〜が目安です。複数業者の無料見積もり比較をおすすめします。
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900">Q. 自治体回収と業者依頼はどちらがよいですか？</h3>
            <p className="text-sm text-foreground/70 mt-2 leading-relaxed">
              A. 数点なら自治体回収が割安です。家一軒分の片付けや搬出・分別も任せたい場合は業者へまとめて依頼すると負担を減らせます。
            </p>
          </div>
        </div>
      </section>

      <div className="bg-primary rounded-2xl p-6 text-white text-center">
        <p className="font-bold mb-2">実家の片付け、何から始めるか迷っていませんか？</p>
        <p className="text-sm text-white/80 mb-4">
          無料チェックリストで「やること」を整理してから見積もり依頼をすると、ムダなく進められます。
        </p>
        <Link
          href="/checklist"
          className="inline-block bg-accent text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition mr-2"
        >
          生前整理チェックリストを見る
        </Link>
        <Link
          href="/articles/master-guide"
          className="inline-block bg-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition"
        >
          実家じまいのはじめかたを読む
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/area" className="inline-block text-foreground/60 text-sm hover:text-primary hover:underline">
          ← 地域一覧（全国）へ
        </Link>
        <Link href={`/area/${prefecture}`} className="inline-block text-primary font-medium hover:underline">
          ← {prefName}の市区町村一覧へ
        </Link>
      </div>

      <footer className="pt-8 mt-8 border-t border-border text-sm text-foreground/60">
        <p className="font-medium text-foreground/80 mb-1">監修</p>
        <p>整理収納・遺品整理に関する記載は整理収納アドバイザーの監修を受けております。</p>
      </footer>
    </div>
  );
}
