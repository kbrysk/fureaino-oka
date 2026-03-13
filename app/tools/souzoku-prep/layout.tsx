import { pageTitle } from "../../lib/site-brand";
import { getCanonicalUrl, getCanonicalBase } from "../../lib/site-url";
import { generateBreadcrumbSchema } from "../../lib/schema/breadcrumb";

export const metadata = {
  title: pageTitle("相続準備力診断"),
  description: "約10問で相続の準備度を診断。結果をLINEで家族に送って準備のきっかけに。",
  alternates: { canonical: getCanonicalUrl("/tools/souzoku-prep") },
};

const TOOL_NAME = "相続準備力診断";
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
