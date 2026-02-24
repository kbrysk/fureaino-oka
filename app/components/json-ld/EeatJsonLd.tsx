import { baseUrl, organization, siteName } from "../../lib/constants/site-metadata";

const ORGANIZATION_ID = `${baseUrl}/#organization`;
const WEBSITE_ID = `${baseUrl}/#website`;

/**
 * E-E-A-T 用ナレッジグラフ：Organization と WebSite を連結した JSON-LD。
 * 電話番号は非公開のため含めず、url / logo / name で実体を証明する。
 */
export default function EeatJsonLd() {
  const graph = [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: organization.name,
      url: organization.url,
      logo: organization.logo,
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
