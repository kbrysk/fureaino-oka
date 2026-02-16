import { pageTitle } from "../../lib/site-brand";

export const metadata = {
  title: pageTitle("空き家リスク診断"),
  description: "約8問で実家の空き家リスクを診断。結果をLINEで家族に送って会議のきっかけに。",
};

export default function AkiyaRiskLayout({ children }: { children: React.ReactNode }) {
  return children;
}
