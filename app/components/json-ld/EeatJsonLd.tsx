import { baseUrl, organization, siteName } from "../../lib/constants/site-metadata";

const ORGANIZATION_ID = `${baseUrl}/#organization`;
const WEBSITE_ID = `${baseUrl}/#website`;

/**
 * E-E-A-T 用ナレッジグラフ：Organization と WebSite を連結した JSON-LD（全ページ共通の単一ソース）。
 *
 * 【重要】Organization は必ずこの1ノードに集約する。
 * 以前は layout.tsx の <head> にもインライン Organization を出力しており、
 * 同一 @id(#organization) に url が「/」と「/company」で矛盾した2ノードが並び、
 * Ahrefs / Google で「Organization が重複」と検出されていた（2026-06 修正）。
 * url は組織の公式サイト＝ルート(baseUrl)に統一する。
 * 電話番号は非公開のため含めず、url / logo / name / sameAs で実体を証明する。
 */
export default function EeatJsonLd() {
  const graph = [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: organization.name,
      alternateName: "Kogera Inc.",
      url: baseUrl,
      logo: organization.logo,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        areaServed: "JP",
        availableLanguage: "Japanese",
      },
      knowsAbout: [
        "実家じまい",
        "生前整理",
        "遺品整理",
        "空き家の解体補助金",
        "空き家対策",
        "固定資産税",
        "不用品回収",
      ],
      sameAs: ["https://x.com/fureaino_oka"],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: baseUrl,
      name: siteName,
      publisher: { "@id": ORGANIZATION_ID },
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
