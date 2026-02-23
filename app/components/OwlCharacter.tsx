"use client";

/**
 * 知恵の番人「ふくろう（不苦労）」キャラクター
 * 伴走者として「言いにくいこと」を代弁し、CVRを高める機能するキャラ。
 * 画像: public/images/owl-character.png
 */
const OWL_IMAGE = "/images/owl-character.png?v=4";

interface OwlCharacterProps {
  /** 表示サイズ（一辺の目安px） */
  size?: number;
  /** 吹き出しの文言（省略時はキャラのみ） */
  message?: string;
  /** 吹き出しのトーン: 警告＝もったいない / 安心＝計算しました */
  tone?: "warning" | "calm";
  /** 冷や汗をかいている（危機感の演出） */
  sweat?: boolean;
  /** 吹き出しの位置: above＝キャラの上（しっぽ下向き） / right＝キャラの右（しっぽ左向き・フクロウを指す） */
  bubblePosition?: "above" | "right";
  /** 背景の光に馴染むよう影を約10%に抑える（ヒーロー等で使用） */
  softShadow?: boolean;
  className?: string;
}

export default function OwlCharacter({
  size = 120,
  message,
  tone = "calm",
  sweat = false,
  bubblePosition = "above",
  softShadow = false,
  className = "",
}: OwlCharacterProps) {
  const bubbleClasses =
    tone === "warning"
      ? "bg-orange-100 text-foreground border border-orange-300"
      : "bg-primary-light text-primary border border-primary/30";
  /* しっぽは吹き出し本体と同じ塗り色（継ぎ目なし） */
  const tailColor = tone === "warning" ? "border-t-orange-100" : "border-t-primary-light";
  const tailColorLeft = tone === "warning" ? "border-r-orange-100" : "border-r-primary-light";

  return (
    <div
      className={`flex gap-3 ${className} ${
        bubblePosition === "right" ? "flex-row items-center" : "flex-col items-center"
      }`}
    >
      {message && bubblePosition === "above" && (
        <div className={`relative rounded-2xl px-4 py-3 text-sm font-medium max-w-[280px] text-center ${bubbleClasses}`}>
          <span className="relative z-10">{message}</span>
        </div>
      )}
      <div
        className={`relative shrink-0 overflow-hidden rounded-2xl ${softShadow ? "shadow-[0_2px_12px_rgba(0,0,0,0.1)]" : ""}`}
        style={{ width: size, height: size }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={OWL_IMAGE}
          alt="ふくろう"
          width={size}
          height={size}
          className="h-full w-full object-contain object-center"
          style={{ width: size, height: size }}
          aria-hidden
        />
        {sweat && (
          <span className="absolute inset-0 flex items-start justify-center pt-1 text-lg opacity-80" aria-hidden>💦</span>
        )}
      </div>
      {message && bubblePosition === "right" && (
        <div className={`relative rounded-2xl pl-5 pr-4 py-3 text-sm font-medium max-w-[280px] ${bubbleClasses}`}>
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
