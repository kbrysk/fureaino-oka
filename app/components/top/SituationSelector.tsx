"use client";

// U7: トップページ 3択分岐型ファーストビュー 2026-03

import Link from "next/link";
import { useState } from "react";

type Situation = "jikka" | "akiya" | "ending";

type SituationItem = {
  id: Situation;
  emoji: string;
  label: string;
  sublabel: string;
};

type RecommendItem = {
  title: string;
  description: string;
  url: string;
  type: "tool" | "guide" | "area" | "page";
};

const SITUATIONS: SituationItem[] = [
  {
    id: "jikka",
    emoji: "🏠",
    label: "親の実家をどうするか悩んでいる",
    sublabel: "実家じまい・売却・空き家対策",
  },
  {
    id: "akiya",
    emoji: "📋",
    label: "空き家・相続の問題を抱えている",
    sublabel: "補助金・相続手続き・費用の把握",
  },
  {
    id: "ending",
    emoji: "📝",
    label: "自分自身の終活を始めたい",
    sublabel: "エンディングノート・生前整理・遺言",
  },
];

const RECOMMENDATIONS: Record<Situation, RecommendItem[]> = {
  jikka: [
    { title: "実家じまい力診断", description: "10問でリスクと優先対策がわかる", url: "/tools/jikka-diagnosis", type: "tool" },
    { title: "実家じまいのはじめかた", description: "何から手をつければいいかを3ステップで解説", url: "/articles/master-guide", type: "guide" },
    { title: "費用の目安を確認する", description: "間取り別の相場と業者選びのポイント", url: "/cost", type: "page" },
    { title: "地域の補助金を探す", description: "市区町村別の解体補助金情報", url: "/area", type: "area" },
  ],
  akiya: [
    { title: "空き家リスク診断", description: "放置するといくら損する？8問でわかる", url: "/tools/akiya-risk", type: "tool" },
    { title: "空き家税金シミュレーター", description: "維持費・固定資産税を自動計算", url: "/tools/empty-house-tax", type: "tool" },
    { title: "地域の補助金を探す", description: "解体費用を最大数百万円補助", url: "/area", type: "area" },
    { title: "相続準備力診断", description: "相続の準備状況を無料診断", url: "/tools/souzoku-prep", type: "tool" },
  ],
  ending: [
    { title: "デジタルエンディングノート", description: "スマホで書けて家族と共有できる", url: "/ending-note", type: "page" },
    { title: "生前整理チェックリスト", description: "何を整理したかを記録・管理する", url: "/checklist", type: "page" },
    { title: "デジタル遺品リスク診断", description: "SNS・サブスクの整理状況を診断", url: "/tools/digital-shame", type: "tool" },
    { title: "法定相続分シミュレーター", description: "相続人と相続分を自動計算", url: "/tools/inheritance-share", type: "tool" },
  ],
};

const TYPE_LABEL: Record<string, string> = {
  tool: "無料ツール",
  guide: "ガイド",
  area: "地域情報",
  page: "ページ",
};

export function SituationSelector() {
  const [selected, setSelected] = useState<Situation | null>(null);
  const recommendations = selected ? RECOMMENDATIONS[selected] : [];

  return (
    <div className="w-full">
      <p className="text-center text-lg font-bold text-gray-700 mb-6">
        今、どんなことでお困りですか？
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {SITUATIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSelected(s.id)}
            className={[
              "flex flex-col items-center gap-2",
              "min-h-[80px] px-4 py-4",
              "rounded-xl border-2 font-medium",
              "text-center transition-all duration-200",
              "hover:border-primary hover:bg-primary/5",
              selected === s.id
                ? "border-primary bg-primary/10 text-primary"
                : "border-gray-200 bg-white text-gray-700",
            ].join(" ")}
            aria-pressed={selected === s.id}
          >
            <span className="text-2xl" aria-hidden="true">
              {s.emoji}
            </span>
            <span className="text-sm font-bold leading-snug">{s.label}</span>
            <span className="text-xs text-gray-500 font-normal">{s.sublabel}</span>
          </button>
        ))}
      </div>

      {selected && recommendations.length > 0 && (
        <div className="border-t border-gray-100 pt-6">
          <p className="text-sm font-medium text-gray-500 mb-3">▼ あなたへのおすすめ</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommendations.map((rec) => (
              <Link
                key={rec.url}
                href={rec.url}
                className={[
                  "flex items-start gap-3 p-4",
                  "rounded-lg border border-gray-200",
                  "bg-white hover:bg-gray-50",
                  "transition-colors duration-200",
                ].join(" ")}
              >
                <span
                  className={[
                    "text-xs px-2 py-0.5 rounded-full shrink-0 mt-0.5",
                    "bg-primary/10 text-primary font-medium",
                  ].join(" ")}
                >
                  {TYPE_LABEL[rec.type]}
                </span>
                <div>
                  <div className="text-sm font-bold text-gray-900">{rec.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{rec.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
