import Link from "next/link";
import { LINE_ADD_URL } from "../lib/site-brand";
import type { CtaType } from "../lib/dispose-items";

const LINE_GREEN = "#06C755";

interface DisposeItemLineCTAProps {
  itemName: string;
  ctaType?: CtaType;
}

/**
 * 捨て方辞典 品目ページ用 CTA
 * ctaType: buy_sell=買取訴求, memorial=想い・供養訴求, difficult=処理困難物業者マッチング
 */
export default function DisposeItemLineCTA({ itemName, ctaType = "default" }: DisposeItemLineCTAProps) {
  const defaultHeading = `${itemName}だけでなく、実家の整理をまるごと診断する`;
  const defaultLead = "遺品整理・実家じまいの進め方や、無料の診断・ガイドブックをLINEでお届けしています。";

  let heading = defaultHeading;
  let lead = defaultLead;

  if (ctaType === "buy_sell") {
    heading = "売れるものは売ってから。実家の整理をまるごと診断する";
    lead = "着物・骨董・楽器・ピアノなど、買取できる品目は査定がおすすめ。実家全体の「残す・売る・捨てる」を無料診断で整理できます。";
  } else if (ctaType === "memorial") {
    heading = "想いを大切に。実家の整理をまるごと相談する";
    lead = "供養から遺品整理まで、気持ちに寄り添った進め方をご提案します。無料診断で、仏壇・人形だけでなく家全体の整理の優先順位を一緒に整理できます。";
  } else if (ctaType === "difficult") {
    heading = "金庫・消火器など、処理困難物もまとめて相談する";
    lead = "自治体で回収できないものは、対応可能な業者への依頼が必要です。当センターでは処理困難物に対応した片付け業者のマッチングをご案内しています。";
  }

  return (
    <div className="rounded-2xl border-2 border-[#06C755]/40 bg-[#06C755]/5 p-6 sm:p-8 text-center">
      <h2 className="text-lg font-bold text-primary mb-2">{heading}</h2>
      <p className="text-sm text-foreground/70 mb-4">{lead}</p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/tools/jikka-diagnosis"
          className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition"
        >
          3分で無料診断する
        </Link>
        <Link
          href="/guide"
          className="inline-block bg-primary-light text-primary border border-primary/30 px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition"
        >
          はじめかた・相談窓口
        </Link>
        <a
          href={LINE_ADD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition"
          style={{ backgroundColor: LINE_GREEN }}
        >
          LINEでガイドを受け取る
        </a>
      </div>
      <p className="text-xs text-foreground/50 mt-3">※完全無料　※いつでもブロック可能</p>
    </div>
  );
}
