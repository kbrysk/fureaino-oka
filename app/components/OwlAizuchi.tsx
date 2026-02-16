"use client";

/**
 * ふくろうが相槌を打つUI（チャット風）
 * 画像: public/images/owl-character.png
 */
const OWL_IMAGE = "/images/owl-character.png?v=4";

interface OwlAizuchiProps {
  /** 相槌の文言 */
  message: string;
  /** 表示位置（左＝コンテンツ側、右＝ふくろう側） */
  position?: "left" | "right";
  /** サイズ */
  size?: "s" | "m";
  className?: string;
}

const AIZUCHI_MESSAGES = [
  "うんうん",
  "なるほど",
  "そうなんですね",
  "その通りだホー",
  "いいですね",
  "わかります",
  "まずは一歩からで大丈夫です",
];

export default function OwlAizuchi({
  message,
  position = "right",
  size = "m",
  className = "",
}: OwlAizuchiProps) {
  const avatarSize = size === "s" ? 36 : 48;
  const isRight = position === "right";

  return (
    <div
      className={`flex items-end gap-2 max-w-sm ${isRight ? "ml-auto flex-row-reverse" : ""} ${className}`}
      role="complementary"
      aria-label="ふくろうの相槌"
    >
      <div className="relative shrink-0 overflow-hidden rounded-2xl" style={{ width: avatarSize, height: avatarSize }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={OWL_IMAGE}
          alt=""
          width={avatarSize}
          height={avatarSize}
          className="h-full w-full object-contain object-center"
          style={{ width: avatarSize, height: avatarSize }}
          aria-hidden
        />
      </div>
      {/* 吹き出し（しっぽはアバター側に向く・本体と同色で重ねて継ぎ目なし） */}
      <div
        className={`relative rounded-2xl px-4 py-2.5 text-sm font-medium bg-card border border-border shadow-sm ${
          isRight ? "rounded-tr-sm pl-5" : "rounded-tl-sm pr-5"
        }`}
      >
        <span className="relative z-10">{message}</span>
        {/* しっぽ：吹き出し本体（bg-card）と同色で2px内側に重ね、枠線との二重線を防ぐ */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent ${
            isRight
              ? "right-0 -translate-x-[2px] border-l-[8px] border-l-card"
              : "left-0 translate-x-[2px] border-r-[8px] border-r-card"
          }`}
        />
      </div>
    </div>
  );
}

export { AIZUCHI_MESSAGES };
