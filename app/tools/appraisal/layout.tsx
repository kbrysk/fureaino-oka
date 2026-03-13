import { pageTitle } from "../../lib/site-brand";
import { getCanonicalUrl, getCanonicalBase } from "../../lib/site-url";
import { generateBreadcrumbSchema } from "../../lib/schema/breadcrumb";

export const metadata = {
  title: pageTitle("資産・査定の目安"),
  description: "持ち物の査定目安を確認。出張無料査定の案内あり。",
  alternates: { canonical: getCanonicalUrl("/tools/appraisal") },
};

const TOOL_NAME = "資産・査定の目安";
const SLUG = "appraisal";

export default function AppraisalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const base = getCanonicalBase();
  const breadcrumb = generateBreadcrumbSchema([
    { name: "ホーム", url: `${base}/` },
    { name: "無料ツール", url: `${base}/tools` },
    { name: TOOL_NAME, url: `${base}/tools/${SLUG}` },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  );
}
