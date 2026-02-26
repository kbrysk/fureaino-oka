"use client";

import { useState } from "react";
import { Asset, DispositionIntent } from "../lib/types";
import FukuchanCTA from "./FukuchanCTA";

interface Props {
  asset: Asset;
  newIntent: DispositionIntent;
  onClose: () => void;
}

const INTENT_OFFERS: Partial<Record<DispositionIntent, {
  headline: string;
  description: string;
  ctaLabel: string;
  partnerLabel: string;
}>> = {
  "売却を検討中": {
    headline: "そのお品物、捨てる前にプロの無料査定に出してみませんか？",
    description: "出張料・査定料・キャンセル料はすべて完全無料。状態が悪いものでも、思わぬ価値がつくかもしれません。",
    ctaLabel: "まずは完全無料で査定を依頼する",
    partnerLabel: "提携：出張買取専門店",
  },
  "処分に困っている": {
    headline: "処分のプロに匿名で相談できます",
    description: "遺品整理・不用品回収の専門業者が、最適な処分方法をご提案。複数社比較で安心。",
    ctaLabel: "匿名で相談する",
    partnerLabel: "提携：遺品整理・不用品回収",
  },
};

export default function IntentChangeModal({ asset, newIntent, onClose }: Props) {
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const offer = INTENT_OFFERS[newIntent];

  if (!offer) {
    onClose();
    return null;
  }

  const handleSubmit = () => {
    if (!agreed) return;
    setSubmitted(true);
    // In production: send lead to partner API
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-card rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {submitted ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-2xl text-green-600">
              &#10003;
            </div>
            <h3 className="text-xl font-bold">お申し込みを受け付けました</h3>
            <p className="text-foreground/60 text-sm">
              提携パートナーより、匿名のままメールにてご連絡いたします。
            </p>
            <button
              onClick={onClose}
              className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition"
            >
              閉じる
            </button>
          </div>
        ) : newIntent === "売却を検討中" ? (
          <div className="space-y-5">
            <p className="text-sm text-foreground/50 mb-1">
              「{asset.name}」を「{newIntent}」に変更しました
            </p>
            <FukuchanCTA />
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl border border-border text-sm hover:bg-background"
            >
              閉じる
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <p className="text-sm text-foreground/50 mb-1">
                「{asset.name}」を「{newIntent}」に変更しました
              </p>
              <h3 className="text-xl font-bold">{offer.headline}</h3>
              <p className="text-foreground/60 text-sm mt-2">{offer.description}</p>
            </div>

            <div className="bg-background rounded-xl p-4">
              <p className="text-sm font-medium mb-1">対象アイテム</p>
              <p className="text-foreground/70">
                <span className="text-xs text-foreground/40 mr-2">{asset.category}</span>
                {asset.name}
              </p>
              {asset.estimatedAmount !== null && (
                <p className="text-xs text-foreground/50 mt-1">
                  概算金額：{asset.estimatedAmount.toLocaleString()}円
                </p>
              )}
            </div>

            <div className="bg-primary-light/50 rounded-xl p-4 space-y-1">
              <p className="text-sm font-medium text-primary">安心ポイント</p>
              <ul className="text-xs text-foreground/60 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-primary">&#10003;</span>
                  個人情報は提供されません（匿名対応）
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">&#10003;</span>
                  営業電話は一切ありません
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">&#10003;</span>
                  完全無料・売却や処分の義務はありません
                </li>
              </ul>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 accent-accent mt-0.5"
              />
              <span className="text-xs text-foreground/50 leading-tight">
                提携パートナーに情報を提供することに同意します。
                <a href="/guide" className="text-accent underline ml-0.5">利用規約</a>
                <span className="mx-0.5">・</span>
                <a href="/guide" className="text-accent underline">プライバシーポリシー</a>
              </span>
            </label>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={!agreed}
                className={`flex-1 py-3 rounded-xl font-bold text-base transition ${
                  agreed
                    ? "bg-accent text-white hover:opacity-90"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {offer.ctaLabel}
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-xl border border-border text-sm hover:bg-background"
              >
                今はしない
              </button>
            </div>

            <p className="text-[10px] text-foreground/30 text-center">
              {offer.partnerLabel}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
