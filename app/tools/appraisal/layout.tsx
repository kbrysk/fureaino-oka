import { pageTitle } from "../../lib/site-brand";
import { getCanonicalUrl, getCanonicalBase } from "../../lib/site-url";
import { generateBreadcrumbSchema } from "../../lib/schema/breadcrumb";

const TOOL_TITLE = "資産・査定の目安";
const TOOL_DESCRIPTION = "持ち物の査定目安を確認。出張無料査定の案内あり。";

export const metadata = {
  title: pageTitle("資産・査定の目安"),
  description: TOOL_DESCRIPTION,
  alternates: { canonical: getCanonicalUrl("/tools/appraisal") },
  openGraph: {
    title: `${TOOL_TITLE}【無料】｜ふれあいの丘`,
    description: TOOL_DESCRIPTION,
    url: getCanonicalUrl("/tools/appraisal"),
  },
};

const TOOL_NAME = TOOL_TITLE;
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
