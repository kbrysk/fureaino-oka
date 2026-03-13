import { pageTitle } from "../../lib/site-brand";
import { getCanonicalUrl } from "../../lib/site-url";

export const metadata = {
  title: pageTitle("デジタル遺品リスク診断"),
  description: "「見られたくないデータ」のリスクを診断。結果をXでシェア、エンディングノートでパスワード処理を記録。",
  alternates: { canonical: getCanonicalUrl("/tools/digital-shame") },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
