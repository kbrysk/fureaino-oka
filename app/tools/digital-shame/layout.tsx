import { pageTitle } from "../../lib/site-brand";
import { getCanonicalUrl, getCanonicalBase } from "../../lib/site-url";
import { generateBreadcrumbSchema } from "../../lib/schema/breadcrumb";

export const metadata = {
  title: pageTitle("デジタル遺品リスク診断"),
  description: "「見られたくないデータ」のリスクを診断。結果をXでシェア、エンディングノートでパスワード処理を記録。",
  alternates: { canonical: getCanonicalUrl("/tools/digital-shame") },
};

const TOOL_NAME = "デジタル遺品リスク診断";
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
