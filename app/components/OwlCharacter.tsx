"use client";

import Image from "next/image";

/**
 * 知恵の番人「ふくろう（不苦労）」キャラクター
 * 伴走者として「言いにくいこと」を代弁し、CVRを高める機能するキャラ。
 * 画像: public/images/owl-character.png
 */
const OWL_IMAGE = "/images/owl-character.png?v=4";
/** next/image 用（クエリ付きは localPatterns 未対応のためクエリなし） */
const OWL_IMAGE_SRC = "/images/owl-character.png";

interface OwlCharacterProps {
  /** 表示サイズ（一辺の目安px） */
  size?: number;
  /** モバイル時の表示サイズ（指定時のみ、md以上で size を使用） */
  sizeMobile?: number;
  /** 吹き出しの文言（省略時はキャラのみ）・string または ReactNode で改行を制御可能 */
  message?: React.ReactNode;
  /** 吹き出しのトーン: 警告＝もったいない / 安心＝計算しました */
  tone?: "warning" | "calm";
  /** 冷や汗をかいている（危機感の演出） */
  sweat?: boolean;
  /** 吹き出しの位置: above＝キャラの上（しっぽ下向き） / right＝キャラの右（しっぽ左向き・フクロウを指す） */
  bubblePosition?: "above" | "right";
  /** 背景の光に馴染むよう影を約10%に抑える（ヒーロー等で使用） */
  softShadow?: boolean;
  className?: string;
  /** FV で表示する場合は true。LCP 用に next/image で priority + fetchPriority="high" を付与 */
  priority?: boolean;
}

export default function OwlCharacter({
  size = 120,
  sizeMobile,
  message,
  tone = "calm",
  sweat = false,
  bubblePosition = "above",
  softShadow = false,
  className = "",
  priority = false,
}: OwlCharacterProps) {
  const bubbleClasses =
    tone === "warning"
      ? "bg-orange-100 text-foreground border border-orange-300"
      : "bg-primary-light text-primary border border-primary/30";
  /* しっぽは吹き出し本体と同じ塗り色（継ぎ目なし） */
  const tailColor = tone === "warning" ? "border-t-orange-100" : "border-t-primary-light";
  const tailColorLeft = tone === "warning" ? "border-r-orange-100" : "border-r-primary-light";
  /* モバイル時は吹き出し・アイコンを極小化（FV見切れ防止） */
  const bubblePadding = "py-1.5 px-3 md:py-3 md:px-4";
  const bubbleText = "text-[10px] md:text-sm font-medium leading-tight md:leading-normal max-w-[280px] text-center";

  return (
    <div
      className={`flex gap-3 ${className} ${
        bubblePosition === "right" ? "flex-row items-center" : "flex-col items-center"
      }`}
    >
      {message && bubblePosition === "above" && (
        <div className={`relative rounded-2xl ${bubblePadding} ${bubbleText} ${bubbleClasses}`}>
          <span className="relative z-10">{message}</span>
        </div>
      )}
      <div
        className={`relative shrink-0 overflow-hidden rounded-2xl ${softShadow ? "shadow-[0_2px_12px_rgba(0,0,0,0.1)]" : ""} ${sizeMobile != null ? "max-md:!w-8 max-md:!h-8" : ""}`}
        style={{ width: size, height: size }}
      >
        {priority ? (
          <Image
            src={OWL_IMAGE_SRC}
            alt="ふれあいの丘 マスコットキャラクター フクロウ"
            width={size}
            height={size}
            className="h-full w-full object-contain object-center"
            priority
            fetchPriority="high"
            sizes={`${size}px`}
          />
        ) : (
          <Image
            src={OWL_IMAGE_SRC}
            alt="ふれあいの丘 マスコットキャラクター フクロウ"
            width={size}
            height={size}
            className="h-full w-full object-contain object-center"
            loading="lazy"
            aria-hidden
          />
        )}
        {sweat && (
          <span className="absolute inset-0 flex items-start justify-center pt-1 text-lg opacity-80" aria-hidden>💦</span>
        )}
      </div>
      {message && bubblePosition === "right" && (
        <div className={`relative rounded-2xl pl-4 pr-3 py-1.5 md:pl-5 md:pr-4 md:py-3 text-[10px] md:text-sm font-medium leading-tight md:leading-normal max-w-[280px] ${bubbleClasses}`}>
          {/* しっぽ：吹き出し本体と同色で少し重ねて表示し、継ぎ目をなくす */}
          <div
            className={`absolute left-0 top-1/2 w-0 h-0 border-y-[8px] border-y-transparent border-r-[10px] ${tailColorLeft}`}
            style={{ transform: "translate(-50%, -50%)" }}
          />
          <span className="relative z-10">{message}</span>
        </div>
      )}
    </div>
  );
}
