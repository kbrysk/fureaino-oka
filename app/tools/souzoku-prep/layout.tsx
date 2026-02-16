import { pageTitle } from "../../lib/site-brand";

export const metadata = {
  title: pageTitle("相続準備力診断"),
  description: "約10問で相続の準備度を診断。結果をLINEで家族に送って準備のきっかけに。",
};

export default function SouzokuPrepLayout({ children }: { children: React.ReactNode }) {
  return children;
}
