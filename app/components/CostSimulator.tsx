"use client";

/**
 * 解体・片付け費用シミュレーター
 *
 * 計算式（LaTeX）:
 * TotalCost = (Area × UnitPrice × StructureFactor) + DisposalCost - SubsidyAmount
 *
 * - Area: 坪数（20, 30, 40, 50〜）
 * - UnitPrice: 地域単価（regionalStats.landPrice から換算した相場）
 * - StructureFactor: 木造1.0, 鉄骨1.2, RC1.5
 * - DisposalCost: 荷物量（少・中・多）
 * - SubsidyAmount: subsidyInfo から抽出した補助金上限（差し引いて実質負担額を表示）
 */

import { useMemo, useState } from "react";
import Link from "next/link";

export interface CostSimulatorRegionalStats {
  landPrice: number;
}

export interface CostSimulatorSubsidyInfo {
  maxAmount: string;
}

export interface CostSimulatorProps {
  cityName: string;
  cityId: string;
  prefId: string;
  regionalStats: CostSimulatorRegionalStats | null;
  subsidyInfo?: CostSimulatorSubsidyInfo | null;
  /** 坂・路地など重機搬入困難な地域（長崎など）でデフォルトチェックを推奨 */
  hasNarrowAccess?: boolean;
  /** 豪雪地帯（札幌・新潟など）で冬期割増の注釈を表示 */
  hasSnowRegion?: boolean;
}

const AREA_OPTIONS = [
  { value: 20, label: "20坪" },
  { value: 30, label: "30坪" },
  { value: 40, label: "40坪" },
  { value: 50, label: "50坪以上" },
] as const;

const STRUCTURE_OPTIONS = [
  { value: "wood", factor: 1.0, label: "木造" },
  { value: "steel", factor: 1.2, label: "鉄骨" },
  { value: "rc", factor: 1.5, label: "RC（鉄筋コンクリート）" },
] as const;

const DISPOSAL_OPTIONS = [
  { value: "low", yen: 100000, label: "少なめ（ほぼ空）" },
  { value: "mid", yen: 250000, label: "普通（家具・家電あり）" },
  { value: "high", yen: 450000, label: "多い（遺品・不用品が多い）" },
] as const;

/** 全国平均の解体単価（円/坪）。地域は landPrice で補正。 */
const BASE_UNIT_PRICE_PER_TSUBO = 28000;
const LAND_PRICE_BASE = 20000000;
const REGIONAL_FACTOR_MIN = 0.85;
const REGIONAL_FACTOR_MAX = 1.25;

/** 手壊し（重機搬入困難）時の割増率 */
const HAND_DEMOLITION_MULTIPLIER = 1.28;

/**
 * subsidyInfo.maxAmount から最大補助金額（円）を抽出する。
 * 例: "通常型は上限50万円、地域連携型は上限150万円" → 1500000
 */
function parseSubsidyMaxYen(maxAmount: string | undefined): number {
  if (!maxAmount || /—|－|詳細確認中|お問い合わせ/.test(maxAmount)) return 0;
  const matches = maxAmount.match(/(\d+)\s*万/g);
  if (!matches?.length) return 0;
  const values = matches.map((m) => parseInt(m.replace(/\D/g, ""), 10) * 10000);
  return Math.max(0, ...values);
}

export default function CostSimulator({
  cityName,
  cityId,
  prefId,
  regionalStats,
  subsidyInfo,
  hasNarrowAccess = false,
  hasSnowRegion = false,
}: CostSimulatorProps) {
  const [areaIndex, setAreaIndex] = useState(0);
  const [structureIndex, setStructureIndex] = useState(0);
  const [disposalIndex, setDisposalIndex] = useState(1);
  const [handDemolition, setHandDemolition] = useState(hasNarrowAccess);

  const areaTsubo = AREA_OPTIONS[areaIndex].value;
  const structure = STRUCTURE_OPTIONS[structureIndex];
  const disposal = DISPOSAL_OPTIONS[disposalIndex];

  const { totalCost, breakdown, unitPricePerTsubo, subsidyAmount } = useMemo(() => {
    const landPrice = regionalStats?.landPrice ?? LAND_PRICE_BASE;
    const regionalFactor = Math.min(
      REGIONAL_FACTOR_MAX,
      Math.max(REGIONAL_FACTOR_MIN, landPrice / LAND_PRICE_BASE)
    );
    const unitPricePerTsubo = Math.round(BASE_UNIT_PRICE_PER_TSUBO * regionalFactor);

    const structureFactor = structure.factor;
    const demolitionMult = handDemolition ? HAND_DEMOLITION_MULTIPLIER : 1.0;

    const demolitionBase = areaTsubo * unitPricePerTsubo * structureFactor * demolitionMult;
    const disposalCost = disposal.yen;
    const rawTotal = Math.round(demolitionBase + disposalCost);

    const subsidyAmount = parseSubsidyMaxYen(subsidyInfo?.maxAmount);
    const totalCost = Math.max(0, rawTotal - subsidyAmount);

    const breakdown = {
      demolitionBase: Math.round(demolitionBase),
      disposalCost,
      subsidyAmount,
      rawTotal,
    };

    return {
      totalCost,
      breakdown,
      unitPricePerTsubo,
      subsidyAmount,
    };
  }, [areaIndex, structureIndex, disposalIndex, handDemolition, regionalStats, subsidyInfo, areaTsubo, structure]);

  const formatYen = (n: number) => (n >= 10000 ? `${Math.round(n / 10000)}万円` : `${n.toLocaleString()}円`);

  return (
    <section
      className="rounded-2xl border-2 border-blue-200 bg-white p-6 sm:p-8 shadow-sm"
      aria-labelledby="cost-simulator-heading"
    >
      <h2 id="cost-simulator-heading" className="text-xl sm:text-2xl font-bold text-blue-900 mb-2">
        {cityName}の解体・片付け 費用の目安（30秒で概算）
      </h2>
      <p className="text-base text-gray-600 mb-6">
        坪数・構造・荷物量を選ぶと、おおよその費用がわかります。補助金がある場合は差し引いた「実質負担額」を表示します。
      </p>

      <div className="space-y-6">
        <div>
          <label htmlFor="cost-area" className="block text-lg font-semibold text-gray-800 mb-2">
            建物の広さ（坪数）
          </label>
          <select
            id="cost-area"
            className="w-full max-w-xs text-lg py-3 px-4 rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            value={areaIndex}
            onChange={(e) => setAreaIndex(Number(e.target.value))}
          >
            {AREA_OPTIONS.map((opt, i) => (
              <option key={opt.value} value={i}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="cost-structure" className="block text-lg font-semibold text-gray-800 mb-2">
            建物の構造
          </label>
          <select
            id="cost-structure"
            className="w-full max-w-xs text-lg py-3 px-4 rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            value={structureIndex}
            onChange={(e) => setStructureIndex(Number(e.target.value))}
          >
            {STRUCTURE_OPTIONS.map((opt, i) => (
              <option key={opt.value} value={i}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="cost-disposal" className="block text-lg font-semibold text-gray-800 mb-2">
            家の中の荷物の量
          </label>
          <select
            id="cost-disposal"
            className="w-full max-w-xs text-lg py-3 px-4 rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            value={disposalIndex}
            onChange={(e) => setDisposalIndex(Number(e.target.value))}
          >
            {DISPOSAL_OPTIONS.map((opt, i) => (
              <option key={opt.value} value={i}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-start gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={handDemolition}
              onChange={(e) => setHandDemolition(e.target.checked)}
              className="w-5 h-5 rounded border-2 border-gray-400 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-lg text-gray-800">重機が入れない（手壊し・坂や路地でクレーン不可）</span>
          </label>
          {hasNarrowAccess && (
            <span className="inline-block text-sm font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded">
              {cityName}は坂・階段が多い地域のため、該当する場合はチェックをおすすめします
            </span>
          )}
        </div>

        {hasSnowRegion && (
          <p className="text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            ※{cityName}は積雪地域のため、冬期は搬出・資材運搬が難しく、業者によっては割増となる場合があります。見積もり時にご確認ください。
          </p>
        )}

        <div className="rounded-xl bg-blue-50 border-2 border-blue-200 p-6">
          <p className="text-lg font-semibold text-blue-900 mb-1">概算 実質負担額</p>
          <p className="text-3xl sm:text-4xl font-bold text-blue-700">{formatYen(totalCost)}</p>
          {subsidyAmount > 0 && (
            <p className="text-base text-gray-700 mt-2">
              補助金 {formatYen(subsidyAmount)} を差し引いています（条件により変動します）
            </p>
          )}
          <details className="mt-3 text-sm text-gray-600">
            <summary className="cursor-pointer font-medium">内訳を見る</summary>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>解体工事（{areaTsubo}坪 × 約{formatYen(unitPricePerTsubo)}/坪 × {structure.label}）: 約{formatYen(breakdown.demolitionBase)}</li>
              <li>片付け・処分費: {formatYen(breakdown.disposalCost)}</li>
              {breakdown.subsidyAmount > 0 && (
                <li>補助金控除: －{formatYen(breakdown.subsidyAmount)}</li>
              )}
            </ul>
          </details>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed">
          この金額はあくまで概算であり、確定ではありません。実際の費用は現地調査・業者見積もりで異なります。アスベストの有無・撤去物の種類・立地条件などにより変動します。
        </p>

        <Link
          href="/articles/master-guide"
          className="inline-flex items-center justify-center w-full sm:w-auto text-lg font-bold py-4 px-8 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-md"
          id="cta-cost-simulator-estimate"
          data-ga-cta="cost_simulator_estimate"
          data-event-name="cta_estimate_request"
        >
          この地域の優良業者から、正確な見積もりを取り寄せる（無料）
        </Link>
      </div>
    </section>
  );
}
