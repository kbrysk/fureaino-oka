"use client";

import { useState } from "react";
import { Asset } from "../lib/types";

interface Props {
  asset: Asset;
  onClose: () => void;
}

export default function AppraisalModal({ asset, onClose }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = () => {
    if (!agreed) return;
    // In production, send to API
    setSubmitted(true);
  };

  const categoryLabels: Record<string, string> = {
    "貴金属・美術品": "鑑定士",
    "不動産": "不動産査定業者",
    "衣類": "買取専門業者",
    "車・バイク": "中古車査定業者",
    "家具・家電": "リサイクル業者",
  };

  const expertLabel = categoryLabels[asset.category] || "専門の査定業者";

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
            <h3 className="text-xl font-bold">査定依頼を受け付けました</h3>
            <p className="text-foreground/60">
              提携の{expertLabel}から、匿名のままお見積りをお送りします。
              メールをご確認ください。
            </p>
            <button
              onClick={onClose}
              className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition"
            >
              閉じる
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-bold">無料査定のご案内</h3>
              <p className="text-foreground/60 mt-1">
                提携の{expertLabel}が、匿名・無料で概算見積りをお出しします。
              </p>
            </div>

            <div className="bg-background rounded-xl p-4">
              <p className="text-sm font-medium mb-1">査定対象</p>
              <p className="text-foreground/70">
                <span className="text-xs text-foreground/40 mr-2">{asset.category}</span>
                {asset.name}
              </p>
              {asset.realEstate && (
                <p className="text-xs text-foreground/50 mt-1">
                  {asset.realEstate.type} / {asset.realEstate.location || "所在地未入力"}
                  {asset.realEstate.builtYear && ` / 築${asset.realEstate.builtYear}年`}
                </p>
              )}
            </div>

            <div className="bg-primary-light/50 rounded-xl p-4 space-y-2">
              <p className="text-sm font-medium text-primary">安心ポイント</p>
              <ul className="text-xs text-foreground/60 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-primary">&#10003;</span>
                  お名前や住所などの個人情報は送信されません
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">&#10003;</span>
                  査定結果はメールでお届け（営業電話なし）
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">&#10003;</span>
                  完全無料・査定後の売却義務はありません
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
                匿名・無料で査定を依頼する
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-xl border border-border text-sm hover:bg-background"
              >
                あとで
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
