/** Search Console 構造化データ: item は必ず絶対URL。相対の場合はこのベースで補完 */
const CANONICAL_ORIGIN_FALLBACK = "https://www.fureaino-oka.com";

/**
 * パンくずリスト用 JSON-LD（schema.org/BreadcrumbList）。
 * 各 ListItem に item（絶対URL）を必須出力。Google リッチリザルト仕様に完全準拠。
 */
interface BreadcrumbJsonLdProps {
  itemListElements: { name: string; item: string }[];
}

function toAbsoluteItem(item: string): string {
  if (!item || typeof item !== "string") return CANONICAL_ORIGIN_FALLBACK + "/";
  const trimmed = item.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed.replace(/\?.*$/, "");
  const base = CANONICAL_ORIGIN_FALLBACK;
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${base}${path === "/" ? "" : path}`.replace(/\?.*$/, "");
}

export default function BreadcrumbJsonLd({ itemListElements }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: itemListElements.map((element, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: element.name,
      item: toAbsoluteItem(element.item),
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
