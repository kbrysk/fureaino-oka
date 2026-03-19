"use client";

import OwlCharacter from "./OwlCharacter";

/**
 * モグ隊長の「専門家からのアドバイス」吹き出しブロック。
 * localRiskText を地域固有の助言としてリッチに表示し、信頼感を強化。
 * municipalities で mascot が null の市区町村では undefined になり得るため非表示にする。
 */
interface MascotAdviceBlockProps {
  localRiskText?: string;
  cityName: string;
}

export default function MascotAdviceBlock({ localRiskText, cityName }: MascotAdviceBlockProps) {
  if (!localRiskText?.trim()) {
    return null;
  }

  return (
    <section
      className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary-light/50 to-primary-light/20 p-5"
      aria-labelledby="mascot-advice-heading"
    >
      <h2 id="mascot-advice-heading" className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
        <span aria-hidden>🦉</span>
        専門家からのアドバイス（{cityName}）
      </h2>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <OwlCharacter
          size={88}
          message={localRiskText}
          tone="calm"
          bubblePosition="right"
          className="shrink-0"
        />
      </div>
    </section>
  );
}
