"use client";

import { usePathname } from "next/navigation";
import AreaNavigation from "./AreaNavigation";

/**
 * /dispose 配下では「全国の空き家補助金」ブロックを出さず、テーマの希薄化を防ぐ。
 * 捨て方詳細では特定カテゴリのみ SubsidyBlock をページ内で表示する。
 */
export default function AreaNavigationGate() {
  const pathname = usePathname();
  if (pathname?.startsWith("/dispose")) {
    return null;
  }
  return <AreaNavigation />;
}
