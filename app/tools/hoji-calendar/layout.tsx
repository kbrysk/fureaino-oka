import { pageTitle } from "../../lib/site-brand";

export const metadata = {
  title: pageTitle("法要カレンダー（命日→三十三回忌）"),
  description: "故人の命日を入力すると、初七日から三十三回忌までの日程表を自動生成。Googleカレンダーに追加可能。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
