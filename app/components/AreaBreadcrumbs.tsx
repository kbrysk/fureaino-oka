import Link from "next/link";

const BASE_URL =
  (typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL?.trim()
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
    : "") || "https://www.fureaino-oka.com";

export type AreaBreadcrumbPage = "main" | "subsidy" | "cleanup" | "garbage" | "cost";

interface AreaBreadcrumbsProps {
  prefecture: string;
  city: string;
  /** URL用ローマ字ID（指定時はパスに使用） */
  prefectureId?: string;
  cityId?: string;
  page: AreaBreadcrumbPage;
}

const PAGE_LABELS: Record<AreaBreadcrumbPage, string> = {
  main: "",
  subsidy: "補助金を探す",
  cleanup: "遺品整理・相場",
  garbage: "粗大ゴミ・遺品整理",
  cost: "費用相場を見る",
};

/**
 * 地域L3ページ用パンくず＋BreadcrumbList JSON-LD（SEO: 階層の明示・検索結果のパンくず表示）
 */
export default function AreaBreadcrumbs({ prefecture, city, prefectureId, cityId, page }: AreaBreadcrumbsProps) {
  const p = prefectureId ?? encodeURIComponent(prefecture);
  const c = cityId ?? encodeURIComponent(city);

  const items: { name: string; path: string }[] = [
    { name: "ホーム", path: "/" },
    { name: "地域一覧", path: "/area" },
    { name: prefecture, path: `/area/${p}` },
    { name: city, path: `/area/${p}/${c}` },
  ];
  if (page !== "main") {
    const label = PAGE_LABELS[page];
    const segment =
      page === "subsidy" ? "subsidy" : page === "garbage" ? "garbage" : page === "cost" ? "cost" : "cleanup";
    items.push({
      name: label,
      path: `/area/${p}/${c}/${segment}`,
    });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${BASE_URL}${crumb.path === "/" ? "" : crumb.path}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="パンくず" className="text-sm text-foreground/60 mb-4">
        <ol className="flex flex-wrap items-center gap-1.5 [&_a]:hover:text-primary [&_a]:hover:underline">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i === items.length - 1 ? (
                <span className="text-foreground/80 font-medium" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path}>{item.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
