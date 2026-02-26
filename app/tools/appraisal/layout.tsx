import { pageTitle } from "../../lib/site-brand";

export const metadata = {
  title: pageTitle("資産・査定の目安"),
  description: "持ち物の査定目安を確認。出張無料査定の案内あり。",
};

export default function AppraisalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
