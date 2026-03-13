"use client";

import { useState } from "react";
import Link from "next/link";

export type RegionalCTASelectorProps = {
  targetPage: "subsidy" | "garbage" | "cost";
  labelText?: string;
  prefectures: Array<{ id: string; name: string }>;
};

const BUTTON_LABELS: Record<RegionalCTASelectorProps["targetPage"], (prefectureName: string) => string> = {
  subsidy: (name) => `${name}の補助金情報を見る →`,
  garbage: (name) => `${name}の粗大ゴミ情報を見る →`,
  cost: (name) => `${name}の費用相場を見る →`,
};

/**
 * 診断結果画面用：都道府県選択→エリアページへの誘導CTA。
 * 選択後にのみボタンを表示する。
 */
export function RegionalCTASelector({ targetPage, labelText, prefectures }: RegionalCTASelectorProps) {
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>("");

  const selected = selectedPrefecture.trim();
  const found = selected ? prefectures.find((p) => p.id === selected) : null;
  const prefectureName = found?.name ?? selected;

  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6" aria-labelledby="regional-cta-heading">
      {labelText && (
        <h2 id="regional-cta-heading" className="text-base font-bold text-foreground/90 mb-2">
          {labelText}
        </h2>
      )}
      <p className="text-sm text-foreground/70 mb-3">
        {targetPage === "subsidy" && "お住まいの都道府県を選んで補助金を確認する"}
        {targetPage === "garbage" && "お住まいの都道府県を選んで粗大ゴミ・遺品整理情報を確認する"}
        {targetPage === "cost" && "お住まいの都道府県を選んで費用相場を確認する"}
      </p>
      <select
        value={selectedPrefecture}
        onChange={(e) => setSelectedPrefecture(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        aria-label="都道府県を選択"
      >
        <option value="">都道府県を選んでください</option>
        {prefectures.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      {selected && (
        <div className="mt-4">
          <Link
            href={`/area/${selected}`}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-primary text-white px-6 py-3.5 font-bold text-sm hover:opacity-90 transition"
          >
            {BUTTON_LABELS[targetPage](prefectureName)}
          </Link>
        </div>
      )}
    </section>
  );
}
