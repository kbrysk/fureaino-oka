import { pageTitle } from "../../lib/site-brand";
import { getCanonicalUrl, getCanonicalBase } from "../../lib/site-url";
import { generateBreadcrumbSchema } from "../../lib/schema/breadcrumb";

const TOOL_TITLE = "相続準備力診断";
const TOOL_DESCRIPTION = "約10問で相続の準備度を診断。結果をLINEで家族に送って準備のきっかけに。";

export const metadata = {
  title: pageTitle("相続準備力診断"),
  description: TOOL_DESCRIPTION,
  alternates: { canonical: getCanonicalUrl("/tools/souzoku-prep") },
  openGraph: {
    title: `${TOOL_TITLE}【無料】｜ふれあいの丘`,
    description: TOOL_DESCRIPTION,
    url: getCanonicalUrl("/tools/souzoku-prep"),
  },
};

const TOOL_NAME = TOOL_TITLE;
const SLUG = "souzoku-prep";

export default function SouzokuPrepLayout({ children }: { children: React.ReactNode }) {
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
