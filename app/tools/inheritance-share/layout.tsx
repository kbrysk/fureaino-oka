import { pageTitle } from "../../lib/site-brand";

export const metadata = {
  title: pageTitle("法定相続分シミュレーター"),
  description: "家族構成を入力すると民法の法定相続分を円グラフで表示。家系図をエンディングノートへ保存。",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
