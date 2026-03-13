import { getCanonicalBase } from "../site-url";

export type BreadcrumbItem = {
  name: string;
  url: string;
};

/**
 * BreadcrumbList 用 JSON-LD オブジェクトを生成する。
 * url は絶対URLであること。相対 path の場合は getCanonicalBase() と結合して呼び出す側で渡す。
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): Record<string, unknown> {
  const base = getCanonicalBase();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${base}${item.url === "/" ? "" : item.url}`,
    })),
  };
}
