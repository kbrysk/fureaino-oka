"use client";

/**
 * ガイドブック用の解説図・イラスト。サイトカラー（primary / accent / border）のみ使用しトンマナを統一。
 */

const primary = "var(--primary)";

/** 3つのフェーズの流れ（現状把握 → 優先順位 → 実行） */
export function PhaseFlowDiagram() {
  return (
    <figure className="my-6 flex flex-col items-center gap-2" aria-label="3つのフェーズの流れ">
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
        <div className="rounded-xl border-2 border-primary/40 bg-primary-light/80 px-4 py-3 text-center min-w-[120px]">
          <span className="block text-xs font-semibold text-primary">1</span>
          <span className="text-sm font-medium text-foreground">現状把握</span>
        </div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 text-primary" aria-hidden>
          <path d="M9 12h6M12 9l3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="rounded-xl border-2 border-primary/40 bg-primary-light/80 px-4 py-3 text-center min-w-[120px]">
          <span className="block text-xs font-semibold text-primary">2</span>
          <span className="text-sm font-medium text-foreground">優先順位づけ</span>
        </div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 text-primary" aria-hidden>
          <path d="M9 12h6M12 9l3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="rounded-xl border-2 border-primary/40 bg-primary-light/80 px-4 py-3 text-center min-w-[120px]">
          <span className="block text-xs font-semibold text-primary">3</span>
          <span className="text-sm font-medium text-foreground">実行</span>
        </div>
      </div>
      <figcaption className="text-xs text-foreground/50">毎日少しずつ、この順で進めると続けやすい</figcaption>
    </figure>
  );
}

const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0 text-primary" aria-hidden>
    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** デジタル遺産の「残す・共有・消す」を視覚化 */
export function DigitalStepsDiagram() {
  const steps = [
    { label: "残す", sub: "写真・動画など", color: primary },
    { label: "共有", sub: "口座・連絡先など", color: primary },
    { label: "消す", sub: "SNS・サブスクなど", color: primary },
  ];
  return (
    <figure className="my-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4" aria-label="デジタル整理の3ステップ">
      {steps.map((item, i) => (
        <span key={i} className="flex items-center gap-2 sm:gap-4">
          <div className="flex flex-col items-center gap-1">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full border-2 text-sm font-bold text-white sm:h-16 sm:w-16"
              style={{ borderColor: item.color, backgroundColor: item.color }}
            >
              {item.label}
            </div>
            <span className="text-xs text-foreground/60">{item.sub}</span>
          </div>
          {i < steps.length - 1 && <ArrowRight />}
        </span>
      ))}
    </figure>
  );
}

/** 「悩み → 専門家」の流れを簡易図解 */
export function ExpertFlowDiagram() {
  return (
    <figure className="my-6 rounded-xl border border-border bg-card p-4" aria-label="誰に聞くかの流れ">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="rounded-lg bg-primary-light/80 px-4 py-2 text-center">
          <span className="text-xs text-foreground/60">あなたの悩み</span>
          <p className="text-sm font-semibold text-primary">遺言・相続・片付け・不動産…</p>
        </div>
        <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="shrink-0 text-primary" aria-hidden>
          <path d="M4 12h24M20 8l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="grid grid-cols-2 gap-2 text-center sm:flex sm:gap-3">
          {["弁護士", "税理士", "司法書士", "業者"].map((name) => (
            <div key={name} className="rounded-lg border border-primary/30 px-3 py-2 text-xs font-medium text-primary">
              {name}
            </div>
          ))}
        </div>
      </div>
      <figcaption className="mt-2 text-center text-xs text-foreground/50">悩みに合わせて下の早見表で専門家を選ぶ</figcaption>
    </figure>
  );
}

/** 章の冒頭用・小さなフクロウイラスト（画像: public/images/owl-character.png） */
const OWL_IMAGE = "/images/owl-character.png?v=4";

export function ChapterOwl({ chapterNumber }: { chapterNumber?: number }) {
  const size = 72;
  return (
    <div className="mb-4 flex justify-center print:mb-3" aria-hidden>
      <div className="relative overflow-hidden rounded-2xl" style={{ width: size, height: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={OWL_IMAGE}
          alt=""
          width={size}
          height={size}
          className="h-full w-full object-contain object-center"
          style={{ width: size, height: size }}
        />
      </div>
      {chapterNumber != null && (
        <span className="sr-only">第{chapterNumber}章</span>
      )}
    </div>
  );
}

/** セクション用の小さなアイコン（書類・キッチン・衣類など） */
export function SectionIcon({ type }: { type: "document" | "kitchen" | "clothes" | "photo" | "bedroom" | "garage" | "digital" }) {
  const size = 40;
  const stroke = primary;
  const icons: Record<typeof type, React.ReactNode> = {
    document: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
        <path d="M10 9H8" />
      </svg>
    ),
    kitchen: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="M4.93 4.93l2.83 2.83" />
        <path d="M16.24 16.24l2.83 2.83" />
        <path d="M2 12h4" />
        <path d="M18 12h4" />
        <path d="M4.93 19.07l2.83-2.83" />
        <path d="M16.24 7.76l2.83-2.83" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
    clothes: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2v6l6 4 6-4V2" />
        <path d="M6 8v14" />
        <path d="M18 8v14" />
        <path d="M6 22h12" />
      </svg>
    ),
    photo: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <circle cx="8.5" cy="9.5" r="2.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    ),
    bedroom: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9v12" />
        <path d="M21 9v12" />
        <path d="M3 9a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3" />
        <path d="M7 15h10" />
      </svg>
    ),
    garage: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20V8l8-4 8 4v12" />
        <path d="M4 12h16" />
        <path d="M9 20v-6" />
        <path d="M15 20v-6" />
      </svg>
    ),
    digital: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-4a2 2 0 0 0-2 2v6" />
        <path d="M14 12h4" />
        <rect x="2" y="4" width="10" height="16" rx="2" />
        <path d="M6 8h.01" />
      </svg>
    ),
  };
  return <span className="guidebook-section-icon inline-flex shrink-0 items-center justify-center text-primary" aria-hidden>{icons[type]}</span>;
}

/** 写真・イラスト用のイラスト枠（キャプション付き・サイトカラーで表示される） */
export function GuidebookImagePlaceholder({ caption, alt = "イメージ", variant = "default" }: { caption: string; alt?: string; variant?: "intro" | "mindset" | "family" | "asset" | "default" }) {
  const Illustration = () => {
    const viewBox = "0 0 280 160";
    if (variant === "intro") {
      return (
        <svg viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full object-contain" preserveAspectRatio="xMidYMid meet">
          <rect width="280" height="160" fill="var(--primary-light)" fillOpacity={0.5} />
          <rect x="40" y="40" width="80" height="80" rx="8" fill="var(--primary)" fillOpacity={0.3} stroke="var(--primary)" strokeWidth="2" />
          <rect x="100" y="50" width="80" height="60" rx="6" fill="var(--primary)" fillOpacity={0.4} stroke="var(--primary)" strokeWidth="1.5" />
          <rect x="160" y="70" width="80" height="50" rx="6" fill="var(--primary)" fillOpacity={0.25} stroke="var(--primary)" strokeWidth="1.5" />
          <path d="M70 100 L90 80 L110 95 L150 65 L170 85" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.8} />
        </svg>
      );
    }
    if (variant === "mindset") {
      return (
        <svg viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full object-contain" preserveAspectRatio="xMidYMid meet">
          <rect width="280" height="160" fill="var(--primary-light)" fillOpacity={0.5} />
          <circle cx="100" cy="90" r="35" fill="var(--primary)" fillOpacity={0.35} stroke="var(--primary)" strokeWidth="2" />
          <circle cx="180" cy="90" r="35" fill="var(--primary)" fillOpacity={0.35} stroke="var(--primary)" strokeWidth="2" />
          <path d="M85 90 L95 90 M175 90 L185 90" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" opacity={0.7} />
          <path d="M100 75 Q100 60 115 60 Q130 75 115 85" stroke="var(--primary)" strokeWidth="1.5" fill="none" opacity={0.7} />
          <path d="M180 75 Q180 60 195 60 Q210 75 195 85" stroke="var(--primary)" strokeWidth="1.5" fill="none" opacity={0.7} />
        </svg>
      );
    }
    if (variant === "family") {
      return (
        <svg viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full object-contain" preserveAspectRatio="xMidYMid meet">
          <rect width="280" height="160" fill="var(--primary-light)" fillOpacity={0.5} />
          <rect x="50" y="70" width="60" height="70" rx="8" fill="var(--primary)" fillOpacity={0.4} stroke="var(--primary)" strokeWidth="2" />
          <circle cx="80" cy="55" r="22" fill="var(--primary)" fillOpacity={0.4} stroke="var(--primary)" strokeWidth="2" />
          <rect x="170" y="70" width="60" height="70" rx="8" fill="var(--primary)" fillOpacity={0.4} stroke="var(--primary)" strokeWidth="2" />
          <circle cx="200" cy="55" r="22" fill="var(--primary)" fillOpacity={0.4} stroke="var(--primary)" strokeWidth="2" />
          <path d="M110 105 L170 105" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" opacity={0.8} />
          <circle cx="140" cy="90" r="15" fill="var(--accent)" fillOpacity={0.5} stroke="var(--accent)" strokeWidth="1.5" />
        </svg>
      );
    }
    if (variant === "asset") {
      return (
        <svg viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full object-contain" preserveAspectRatio="xMidYMid meet">
          <rect width="280" height="160" fill="var(--primary-light)" fillOpacity={0.5} />
          <rect x="30" y="50" width="100" height="70" rx="6" fill="var(--card)" stroke="var(--primary)" strokeWidth="2" />
          <path d="M50 70 L90 70 M50 85 L80 85 M50 100 L70 100" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" opacity={0.7} />
          <rect x="150" y="40" width="100" height="80" rx="6" fill="var(--card)" stroke="var(--primary)" strokeWidth="2" />
          <circle cx="180" cy="65" r="8" fill="var(--primary)" fillOpacity={0.3} />
          <path d="M165 90 L195 90 M175 100 L185 100" stroke="var(--primary)" strokeWidth="1" strokeLinecap="round" opacity={0.6} />
        </svg>
      );
    }
    return (
      <svg viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full object-contain" preserveAspectRatio="xMidYMid meet">
        <rect width="280" height="160" fill="var(--primary-light)" fillOpacity={0.5} />
        <rect x="60" y="40" width="160" height="80" rx="8" fill="var(--card)" stroke="var(--primary)" strokeWidth="2" />
        <circle cx="120" cy="80" r="20" fill="var(--primary)" fillOpacity={0.2} stroke="var(--primary)" strokeWidth="1.5" />
        <path d="M155 65 L185 80 L155 95 Z" fill="var(--primary)" fillOpacity={0.3} stroke="var(--primary)" strokeWidth="1" />
      </svg>
    );
  };

  return (
    <figure className="my-6 overflow-hidden rounded-xl border-2 border-border bg-primary-light/20">
      <div className="flex aspect-video min-h-[140px] w-full items-center justify-center overflow-hidden bg-primary-light/30" aria-label={alt}>
        <div className="h-full w-full max-w-md">
          <Illustration />
        </div>
      </div>
      <figcaption className="border-t border-border bg-card px-4 py-2 text-center text-sm text-foreground/70">
        {caption}
      </figcaption>
    </figure>
  );
}
