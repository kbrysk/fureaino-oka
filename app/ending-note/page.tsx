import type { Metadata } from "next";
import { pageTitle } from "../lib/site-brand";
import { getCanonicalUrl } from "../lib/site-url";
import EndingNoteApp from "../components/ending-note/EndingNoteApp";

export const metadata: Metadata = {
  title: pageTitle("【無料】デジタルエンディングノート｜スマホで書けて家族と共有できる"),
  description:
    "紙のエンディングノートと違い、いつでも編集・更新できるデジタル版。連絡先・資産・医療希望・葬儀の希望・家族へのメッセージを一か所で管理。完全無料で今すぐ書き始められます。",
  alternates: { canonical: getCanonicalUrl("/ending-note") },
};

/**
 * エンディングノートページ（Server Component）
 * SEO用の静的シェルとクライアントアプリを分離。
 */
export default function EndingNotePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-primary">エンディングノート</h1>
        <p className="text-foreground/60 mt-1">大切な人へ想いを残しましょう</p>
        <p className="text-sm text-foreground/50 mt-2 max-w-2xl">
          エンディングノートの書き方：無理に一度に書かず、ステップごとに「連絡先」「資産のメモ」「医療・葬儀の希望」「家族へのメッセージ」を分けて記入することが大切です。
          いつでも編集・追記でき、保存はご利用の端末内のみで行われます。
        </p>
      </header>

      <EndingNoteApp />
    </div>
  );
}
