import { pageTitle } from "../../lib/site-brand";
import { getCanonicalUrl, getCanonicalBase } from "../../lib/site-url";
import { generateBreadcrumbSchema } from "../../lib/schema/breadcrumb";

const TOOL_TITLE = "実家じまい力診断";
const TOOL_DESCRIPTION =
  "実家のリスクを無料で診断。約10問に答えるだけで、実家の危険度スコアと今すぐ取るべき対策がわかります。診断結果はLINEで家族に送って家族会議のきっかけに。所要時間：約3分。";

export const metadata = {
  title: pageTitle("【無料】実家じまい力診断｜約10問でリスク度と優先対策がわかる"),
  description: TOOL_DESCRIPTION,
  alternates: { canonical: getCanonicalUrl("/tools/jikka-diagnosis") },
  openGraph: {
    title: `${TOOL_TITLE}【無料】｜ふれあいの丘`,
    description: TOOL_DESCRIPTION,
    url: getCanonicalUrl("/tools/jikka-diagnosis"),
  },
};

const TOOL_NAME = TOOL_TITLE;
const SLUG = "jikka-diagnosis";

export default function Layout({ children }: { children: React.ReactNode }) {
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
