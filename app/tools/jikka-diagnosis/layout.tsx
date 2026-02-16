import { pageTitle } from "../../lib/site-brand";

export const metadata = {
  title: pageTitle("実家じまい力診断"),
  description:
    "約10問で実家のリスク度がわかります。結果をLINEで家族に送って、会議のきっかけに。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
