import { getCanonicalBase } from "../site-url";

export type LocalBusinessPageType = "subsidy" | "garbage" | "cost" | "city";

export function generateLocalBusinessSchema(options: {
  cityName: string;
  prefectureName: string;
  prefecture: string;
  city: string;
  pageType: LocalBusinessPageType;
}) {
  const { cityName, prefectureName, prefecture, city, pageType } = options;

  const serviceNames: Record<LocalBusinessPageType, string> = {
    subsidy: "空き家解体補助金申請サポート",
    garbage: "遺品整理・粗大ゴミ回収",
    cost: "実家じまい・生前整理費用相談",
    city: "実家じまい・生前整理総合サポート",
  };

  const base = getCanonicalBase();

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `生前整理支援センター ふれあいの丘（${cityName}対応）`,
    description: `${cityName}（${prefectureName}）の実家じまい・生前整理・${serviceNames[pageType]}に関する情報を提供しています。`,
    url: `${base}/area/${prefecture}/${city}`,
    areaServed: {
      "@type": "City",
      name: cityName,
      containedInPlace: {
        "@type": "State",
        name: prefectureName,
      },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: cityName,
      addressRegion: prefectureName,
      addressCountry: "JP",
    },
    provider: {
      "@type": "Organization",
      name: "生前整理支援センター ふれあいの丘",
      url: base,
    },
  };
}
