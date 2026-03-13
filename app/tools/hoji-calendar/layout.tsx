import { pageTitle } from "../../lib/site-brand";
import { getCanonicalUrl, getCanonicalBase } from "../../lib/site-url";
import { generateBreadcrumbSchema } from "../../lib/schema/breadcrumb";

const TOOL_TITLE = "法要カレンダー（命日→三十三回忌）";
const TOOL_DESCRIPTION = "故人の命日を入力すると、初七日から三十三回忌までの日程表を自動生成。Googleカレンダーに追加可能。";

export const metadata = {
  title: pageTitle("法要カレンダー（命日→三十三回忌）"),
  description: TOOL_DESCRIPTION,
  alternates: { canonical: getCanonicalUrl("/tools/hoji-calendar") },
  openGraph: {
    title: `${TOOL_TITLE}【無料】｜ふれあいの丘`,
    description: TOOL_DESCRIPTION,
    url: getCanonicalUrl("/tools/hoji-calendar"),
  },
};

const TOOL_NAME = TOOL_TITLE;
const SLUG = "hoji-calendar";

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
