import { pageTitle } from "../../lib/site-brand";

export const metadata = {
  title: pageTitle("デジタル遺品リスク診断"),
  description: "「見られたくないデータ」のリスクを診断。結果をXでシェア、エンディングノートでパスワード処理を記録。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
