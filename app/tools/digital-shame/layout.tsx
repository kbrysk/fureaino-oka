import { pageTitle } from "../../lib/site-brand";
import { getCanonicalUrl, getCanonicalBase } from "../../lib/site-url";
import { generateBreadcrumbSchema } from "../../lib/schema/breadcrumb";

const TOOL_TITLE = "デジタル遺品リスク診断";
const TOOL_DESCRIPTION = "「見られたくないデータ」のリスクを診断。結果をXでシェア、エンディングノートでパスワード処理を記録。";

export const metadata = {
  title: pageTitle("デジタル遺品リスク診断"),
  description: TOOL_DESCRIPTION,
  alternates: { canonical: getCanonicalUrl("/tools/digital-shame") },
  openGraph: {
    title: `${TOOL_TITLE}【無料】｜ふれあいの丘`,
    description: TOOL_DESCRIPTION,
    url: getCanonicalUrl("/tools/digital-shame"),
  },
};

const TOOL_NAME = TOOL_TITLE;
const SLUG = "digital-shame";

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
