import { pageTitle } from "../../lib/site-brand";
import { getCanonicalUrl, getCanonicalBase } from "../../lib/site-url";
import { generateBreadcrumbSchema } from "../../lib/schema/breadcrumb";

export const metadata = {
  title: pageTitle("空き家リスク診断"),
  description: "約8問で実家の空き家リスクを診断。結果をLINEで家族に送って会議のきっかけに。",
  alternates: { canonical: getCanonicalUrl("/tools/akiya-risk") },
};

const TOOL_NAME = "空き家リスク診断";
const SLUG = "akiya-risk";

export default function AkiyaRiskLayout({ children }: { children: React.ReactNode }) {
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
