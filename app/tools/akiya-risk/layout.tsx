import { pageTitle } from "../../lib/site-brand";
import { getCanonicalUrl, getCanonicalBase } from "../../lib/site-url";
import { generateBreadcrumbSchema } from "../../lib/schema/breadcrumb";

const TOOL_TITLE = "空き家リスク診断";
const TOOL_DESCRIPTION =
  "空き家を放置し続けると固定資産税が最大6倍に。無料の空き家リスク診断（約8問・3分）で、あなたの実家が空き家予備軍かどうかをチェック。診断後に具体的な解決策と補助金情報を確認できます。";

export const metadata = {
  title: pageTitle("【無料】空き家リスク診断｜放置するといくら損する？約8問でわかる"),
  description: TOOL_DESCRIPTION,
  alternates: { canonical: getCanonicalUrl("/tools/akiya-risk") },
  openGraph: {
    title: `${TOOL_TITLE}【無料】｜ふれあいの丘`,
    description: TOOL_DESCRIPTION,
    url: getCanonicalUrl("/tools/akiya-risk"),
  },
};

const TOOL_NAME = TOOL_TITLE;
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
