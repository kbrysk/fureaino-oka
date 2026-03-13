import { pageTitle } from "../../lib/site-brand";
import { getCanonicalUrl } from "../../lib/site-url";

export const metadata = {
  title: pageTitle("資産・査定の目安"),
  description: "持ち物の査定目安を確認。出張無料査定の案内あり。",
  alternates: { canonical: getCanonicalUrl("/tools/appraisal") },
};

export default function AppraisalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
