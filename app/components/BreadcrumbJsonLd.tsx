/**
 * パンくずリスト用 JSON-LD（schema.org/BreadcrumbList）。
 * クローラビリティ・検索結果のパンくず表示のため絶対URLで item を渡すこと。
 */
interface BreadcrumbJsonLdProps {
  itemListElements: { name: string; item: string }[];
}

export default function BreadcrumbJsonLd({ itemListElements }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: itemListElements.map((element, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: element.name,
      item: element.item,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
