"use client";

import { useState, useMemo } from "react";
import JikkaOptimizer from "@/app/components/JikkaOptimizer";
import type { JikkaRegionalStats } from "@/app/components/JikkaOptimizer";
import { getOptimalCtaUrl } from "@/app/lib/utils/cta-router";

export interface OptimizerAreaOption {
  prefectureId: string;
  prefectureName: string;
  cityId: string;
  cityName: string;
}

interface OptimizerToolClientProps {
  prefectures: { prefectureId: string; prefectureName: string }[];
  citiesByPrefecture: Record<string, { cityId: string; cityName: string }[]>;
  statsMap: Record<string, JikkaRegionalStats>;
  initialLayout?: "1K" | "2DK" | "3LDK" | "4LDK+";
}

export default function OptimizerToolClient({
  prefectures,
  citiesByPrefecture,
  statsMap,
  initialLayout,
}: OptimizerToolClientProps) {
  const [selectedPrefId, setSelectedPrefId] = useState<string>("");
  const [selectedCityId, setSelectedCityId] = useState<string>("");

  const cities = selectedPrefId ? citiesByPrefecture[selectedPrefId] ?? [] : [];
  const selectedCityName = useMemo(() => {
    if (!selectedPrefId || !selectedCityId) return null;
    const list = citiesByPrefecture[selectedPrefId];
    return list?.find((c) => c.cityId === selectedCityId)?.cityName ?? null;
  }, [selectedPrefId, selectedCityId, citiesByPrefecture]);

  const statsKey = selectedPrefId && selectedCityId ? `${selectedPrefId}-${selectedCityId}` : "";
  const regionalStats = statsKey ? (statsMap[statsKey] ?? null) : null;
  const hasSelection = Boolean(selectedPrefId && selectedCityId);
  const ctaUrl = getOptimalCtaUrl(selectedPrefId || undefined, selectedCityId || undefined);
  const ctaLabel = selectedCityName ? `${selectedCityName}の無料査定を依頼する` : "地域を選択して査定相場を見る";

  return (
    <div className="space-y-6">
      <section id="area-selector" className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-bold text-slate-800 text-lg mb-4">診断する地域を選ぶ</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="min-w-[140px]">
            <label htmlFor="optimizer-pref" className="block text-sm font-medium text-slate-700 mb-1">
              都道府県
            </label>
            <select
              id="optimizer-pref"
              value={selectedPrefId}
              onChange={(e) => {
                setSelectedPrefId(e.target.value);
                setSelectedCityId("");
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">選択してください</option>
              {prefectures.map((p) => (
                <option key={p.prefectureId} value={p.prefectureId}>
                  {p.prefectureName}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[180px]">
            <label htmlFor="optimizer-city" className="block text-sm font-medium text-slate-700 mb-1">
              市区町村
            </label>
            <select
              id="optimizer-city"
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              disabled={!selectedPrefId}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">選択してください</option>
              {cities.map((c) => (
                <option key={c.cityId} value={c.cityId}>
                  {c.cityName}
                </option>
              ))}
            </select>
          </div>
        </div>
        {!hasSelection && (
          <p className="mt-4 text-sm text-slate-500 italic" role="status">
            地域を選択すると、より精緻な診断が可能です
          </p>
        )}
      </section>

      <section>
        <JikkaOptimizer
          cityName={selectedCityName ?? "全国"}
          cityId={selectedCityId || "default"}
          regionalStats={regionalStats}
          initialLayout={initialLayout}
          ctaHref={ctaUrl}
          ctaLabel={ctaLabel}
        />
      </section>
    </div>
  );
}
