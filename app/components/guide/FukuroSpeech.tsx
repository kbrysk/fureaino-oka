"use client";

const OWL_IMAGE = "/images/owl-character.png?v=4";

export interface FukuroSpeechProps {
  message: string;
  owlSize?: number;
  className?: string;
}

export default function FukuroSpeech({ message, owlSize = 48, className = "" }: FukuroSpeechProps) {
  return (
    <div className={`flex items-start gap-3 max-w-full ${className}`} role="complementary" aria-label="ふくろうのアドバイス">
      <div className="relative shrink-0 overflow-hidden rounded-xl" style={{ width: owlSize, height: owlSize }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={OWL_IMAGE} alt="" width={owlSize} height={owlSize} className="h-full w-full object-contain object-center" style={{ width: owlSize, height: owlSize }} aria-hidden />
      </div>
      <div className="relative rounded-2xl px-4 py-2.5 text-sm font-medium bg-primary-light/50 border border-primary/20 text-foreground/90 rounded-tl-sm flex-1 min-w-0">
        <span className="relative z-10">{message}</span>
        <div className="absolute top-4 left-0 w-0 h-0 border-y-[6px] border-y-transparent border-r-[8px] border-r-primary-light/50 -translate-x-[2px]" aria-hidden />
      </div>
    </div>
  );
}
