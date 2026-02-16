"use client";

import { useState } from "react";
import { Asset, ContextualCTA, CONTEXTUAL_CTAS } from "../lib/types";

interface Props {
  asset?: Asset;
  concernTags?: string[];
  assets?: Asset[];
}

export function getMatchingCTAs(
  asset: Asset | undefined,
  concernTags: string[] = [],
  allAssets: Asset[] = []
): ContextualCTA[] {
  const matched: ContextualCTA[] = [];
  const seen = new Set<string>();

  for (const cta of CONTEXTUAL_CTAS) {
    const t = cta.trigger;
    const key = cta.headline;
    if (seen.has(key)) continue;

    if (t.crossTagCategory) {
      const hasTag = concernTags.includes(t.crossTagCategory.tag);
      const hasCategory = asset?.category === t.crossTagCategory.category ||
        allAssets.some((a) => a.category === t.crossTagCategory!.category);
      if (hasTag && hasCategory) {
        matched.push(cta);
        seen.add(key);
        continue;
      }
    }

    if (!asset) continue;

    if (t.category && asset.category === t.category) {
      if (t.realEstateVacant && asset.realEstate?.isVacant) {
        matched.push(cta);
        seen.add(key);
        continue;
      }
      if (!t.realEstateVacant) {
        matched.push(cta);
        seen.add(key);
        continue;
      }
    }

    if (t.intent && asset.dispositionIntent === t.intent) {
      matched.push(cta);
      seen.add(key);
      continue;
    }

    if (t.tag && concernTags.includes(t.tag)) {
      matched.push(cta);
      seen.add(key);
    }
  }
  return matched.slice(0, 3);
}

export default function ContextualCTABanner({ asset, concernTags, assets }: Props) {
  const ctas = getMatchingCTAs(asset, concernTags, assets);
  if (ctas.length === 0) return null;

  return (
    <div className="space-y-3 mt-4">
      {ctas.map((cta, i) => (
        <CTACard key={i} cta={cta} />
      ))}
    </div>
  );
}

function CTACard({ cta }: { cta: ContextualCTA }) {
  const [agreed, setAgreed] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (!agreed) return;
    setClicked(true);
    // In production: send lead to partner API
  };

  if (clicked) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <p className="font-bold text-green-700 text-sm">お申し込みを受け付けました</p>
        <p className="text-xs text-green-600 mt-1">提携パートナーより、メールにてご連絡いたします。</p>
      </div>
    );
  }

  return (
    <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-foreground">{cta.headline}</p>
          <p className="text-xs text-foreground/60 mt-0.5">{cta.description}</p>
          {cta.partnerLabel && (
            <p className="text-xs text-foreground/40 mt-1">{cta.partnerLabel}</p>
          )}
        </div>
        <button
          onClick={handleClick}
          disabled={!agreed}
          className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition shrink-0 ${
            agreed
              ? "bg-accent text-white hover:opacity-90 cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {cta.ctaLabel}
        </button>
      </div>
      <label className="flex items-start gap-2 mt-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="w-3.5 h-3.5 accent-accent mt-0.5"
        />
        <span className="text-[11px] text-foreground/50 leading-tight">
          提携パートナーに情報を提供することに同意します。
          <a href="/guide" className="text-accent underline ml-0.5">利用規約</a>
          <span className="mx-0.5">・</span>
          <a href="/guide" className="text-accent underline">プライバシーポリシー</a>
        </span>
      </label>
    </div>
  );
}
