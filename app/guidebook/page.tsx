import type { Metadata } from "next";
import { guidebookTitle, guidebookSubtitle } from "../../content/guidebook/data";
import GuidebookGate from "./GuidebookGate";
import { pageTitle } from "../lib/site-brand";

export const metadata: Metadata = {
  title: pageTitle(`${guidebookTitle}（無料PDF）`),
  description: `メールアドレスを登録いただいた方に、${guidebookTitle}をPDFでお送りします。${guidebookSubtitle}、専門家マップ・費用の目安・付録まで。`,
};

/**
 * ガイドブックはウェブ上では表示しない。メール登録者にのみPDFで送付するゲートページ。
 */
export default function GuidebookPage() {
  return (
    <div className="guidebook py-8">
      <GuidebookGate />
    </div>
  );
}
