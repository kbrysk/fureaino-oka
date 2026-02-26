import Link from "next/link";
import { LINE_ADD_URL } from "../../lib/site-brand";

const LINE_GREEN = "#06C755";

export interface ContextualCTAProps {
  /** 品目名（例: 仏壇） */
  itemName: string;
  /** カテゴリID（将来の文言出し分け用） */
  categoryId: string;
}

/**
 * 文脈特化型CTA。「いま見ている品物だけをまずどうにかしたい」ユーザー向けの低ハードル相談ブロック。
 * ページ全体の「実家まるごと」CTAとは別に、品目に寄り添った訴求を行う。
 */
export default function ContextualCTA({ itemName }: ContextualCTAProps) {
  const heading = `${itemName}の処分・供養にかかる費用をまずは無料相談`;
  const lead = "この品目だけの処分方法・相場・供養の流れを、専門家が無料でアドバイスします。";

  return (
    <section
      className="rounded-2xl border-2 border-primary/40 bg-primary-light/30 p-6 sm:p-8"
      aria-labelledby="contextual-cta-heading"
    >
      <h2 id="contextual-cta-heading" className="text-lg font-bold text-primary mb-2">
        {heading}
      </h2>
      <p className="text-sm text-foreground/70 mb-4">{lead}</p>
      <div className="flex flex-wrap gap-3 justify-center items-center">
        <Link
          href="/guide"
          className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition shadow-sm"
        >
          <span aria-hidden className="text-lg leading-none">📞</span>
          無料相談の流れを見る
        </Link>
        <a
          href={LINE_ADD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition"
          style={{ backgroundColor: LINE_GREEN }}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
          LINEで相談する
        </a>
      </div>
    </section>
  );
}
