import { redirect } from "next/navigation";

/**
 * /guide は next.config の redirect で /articles/master-guide へ転送される。
 * このファイルは型チェック通過のため存在する（実際のリクエストは redirect で処理され、本ページは到達しない）。
 */
export default function GuidePage() {
  redirect("/articles/master-guide");
}
