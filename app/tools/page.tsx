import { pageTitle, SITE_NAME_FULL } from "../lib/site-brand";
import { getCanonicalUrl, getCanonicalBase } from "../lib/site-url";
import { generateBreadcrumbSchema } from "../lib/schema/breadcrumb";
import ToolsPageClient from "./ToolsPageClient";

export const metadata = {
  title: pageTitle("無料ツール"),
  description:
    `空き家の維持費シミュレーション、資産・査定の目安など、生前整理に役立つ無料ツール。${SITE_NAME_FULL}。`,
  alternates: { canonical: getCanonicalUrl("/tools") },
};

export default function ToolsPage() {
  const base = getCanonicalBase();
  const breadcrumb = generateBreadcrumbSchema([
    { name: "ホーム", url: `${base}/` },
    { name: "無料ツール", url: `${base}/tools` },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <ToolsPageClient />
    </>
  );
}
