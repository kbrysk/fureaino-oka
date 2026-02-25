import { pageTitle, SITE_NAME_FULL } from "../lib/site-brand";
import ToolsPageClient from "./ToolsPageClient";

export const metadata = {
  title: pageTitle("無料ツール"),
  description:
    `空き家の維持費シミュレーション、資産・査定の目安など、生前整理に役立つ無料ツール。${SITE_NAME_FULL}。`,
};

export default function ToolsPage() {
  return <ToolsPageClient />;
}
