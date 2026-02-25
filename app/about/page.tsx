import { redirect } from "next/navigation";

/**
 * 運営者情報は /company に統合しました。
 * SEO の評価を引き継ぐため、恒久的に /company へリダイレクトします。
 */
export default function AboutPage() {
  redirect("/company");
}
