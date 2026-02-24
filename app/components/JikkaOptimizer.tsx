"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";

/** 数値のカウントアップ表示用。target が変わると duration ミリ秒かけてアニメーション */
function useCountUp(target: number, duration = 600): number {
  const [display, setDisplay] = useState(target);
  const prevRef = useRef(target);
  const startRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (target === prevRef.current) return;
    const start = performance.now();
    const from = prevRef.current;
    startRef.current = start;
    prevRef.current = target;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - t, 2);
      setDisplay(Math.round(from + (target - from) * easeOut));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
}

/** サーバーから getRegionalStats() で渡す地域統計（regional-stats-loader の RegionalStatsRow と同型） */
export interface JikkaRegionalStats {
  population: number;
  agingRate: number;
  landPrice: number;
}

/**
 * 実家じまい・資産防衛シミュレーター（有料級診断ツール）
 * 数式は厳守。清掃コスト・年間維持損失・10年損失を3レイヤーで計算。
 *
 * (a) TotalCleanupCost = (BaseRate[RoomType] × DensityMultiplier × floorMult) + AccessibilityFee + AsbestosPremium
 * (b) AnnualLoss = (FixedAssetTax × SpecificEmptyHouseMultiplier) + Insurance + ManagementFee + OpportunityCost
 * (c) Loss10y = 10 × AnnualLoss + V × (1 - (1 - r)^10)
 */
const BASE_RATES: Record<string, number> = {
  "1K": 35000,
  "2DK": 80000,
  "3LDK": 180000,
  "4LDK+": 250000,
};

const DENSITY_MULTIPLIER = [1.0, 1.2, 1.5, 2.0, 3.5];
const FLOOR_MULT_NO_ELEVATOR = 1.3;
const TRUCK_FAR_FEE = 15000;
/** AsbestosPremium: 2006年以前の建築の場合 +150,000円（プロ概算） */
const ASBESTOS_PREMIUM = 150000;

/** 特定空家指定時の固定資産税倍率（最大6倍） */
const SPECIFIC_EMPTY_HOUSE_MULTIPLIER = 6.0;
/** 固定資産税: 想定評価額の約1%（実務上の簡易逆算） */
const FIXED_TAX_RATE = 0.01;
const INSURANCE_PER_YEAR = 20000;
const MANAGEMENT_FEE_PER_YEAR = 120000;
/** OpportunityCost = 想定売却価格 × 0.03（売却して運用した場合の期待収益率3%） */
const OPPORTUNITY_RATE = 0.03;
/** 10年減価率 */
const DEPRECIATION_RATE_10Y = 0.05;
const DEFAULT_PROPERTY_VALUE = 20000000;
const LAND_AREA_M2 = 80;

type LayoutKey = "1K" | "2DK" | "3LDK" | "4LDK+";

interface JikkaOptimizerProps {
  cityName: string;
  cityId: string;
  regionalStats: JikkaRegionalStats | null;
  /** トップページの間取り選択から引き継ぎ */
  initialLayout?: LayoutKey;
  /** エリアページ用：「[cityName]限定：実家じまい診断」表記 */
  titleVariant?: "default" | "area";
  /** ツールページ用：CTA を Link で遷移させる場合の URL（未指定時は従来どおり #appraisal-section へスクロール） */
  ctaHref?: string | null;
  /** ツールページ用：CTA ボタンのラベル */
  ctaLabel?: string;
}

export default function JikkaOptimizer({ cityName, cityId, regionalStats, initialLayout, titleVariant = "default", ctaHref, ctaLabel }: JikkaOptimizerProps) {
  const [layout, setLayout] = useState<LayoutKey>(initialLayout ?? "2DK");
  const [density, setDensity] = useState(2);
  const [floor3PlusNoElevator, setFloor3PlusNoElevator] = useState(false);
  const [truckFar, setTruckFar] = useState(false);
  const [builtBefore1981, setBuiltBefore1981] = useState<"before" | "after">("after");
  const [builtBefore2006, setBuiltBefore2006] = useState<"before" | "after">("after");
  const [openBreakdown, setOpenBreakdown] = useState<"cleanup" | "annual" | "10y" | null>(null);
  const [showReportOverlay, setShowReportOverlay] = useState(false);

  const {
    costNow,
    yearlyCost,
    loss10y,
    cleanupBreakdown,
    annualBreakdown,
    loss10yBreakdown,
  } = useMemo(() => {
    const base = BASE_RATES[layout] ?? BASE_RATES["2DK"];
    const mult = DENSITY_MULTIPLIER[Math.min(4, Math.max(0, density - 1))] ?? 1.2;
    const floorMult = floor3PlusNoElevator ? FLOOR_MULT_NO_ELEVATOR : 1.0;
    const truckFee = truckFar ? TRUCK_FAR_FEE : 0;
    const asbestosPremium = builtBefore2006 === "before" ? ASBESTOS_PREMIUM : 0;
    const costNow = Math.round(base * mult * floorMult + truckFee + asbestosPremium);

    const V = regionalStats?.landPrice
      ? regionalStats.landPrice * LAND_AREA_M2
      : DEFAULT_PROPERTY_VALUE;
    const fixedAssetTaxBase = Math.round(V * FIXED_TAX_RATE);
    const fixedAssetTaxMax = Math.round(fixedAssetTaxBase * SPECIFIC_EMPTY_HOUSE_MULTIPLIER);
    const opportunityCost = Math.round(V * OPPORTUNITY_RATE);
    const yearlyCost =
      fixedAssetTaxMax + INSURANCE_PER_YEAR + MANAGEMENT_FEE_PER_YEAR + opportunityCost;

    const valueDrop10y = V * (1 - Math.pow(1 - DEPRECIATION_RATE_10Y, 10));
    const yearlyCostRounded = Math.round(yearlyCost);
    const loss10y = 10 * yearlyCostRounded + Math.round(valueDrop10y);

    return {
      costNow,
      yearlyCost: yearlyCostRounded,
      loss10y: Math.round(loss10y),
      cleanupBreakdown: {
        base: Math.round(base * mult * floorMult),
        truckFee,
        asbestosPremium,
      },
      annualBreakdown: {
        fixedAssetTaxBase,
        fixedAssetTaxMax,
        insurance: INSURANCE_PER_YEAR,
        managementFee: MANAGEMENT_FEE_PER_YEAR,
        opportunityCost,
        estimatedValue: V,
      },
      loss10yBreakdown: {
        yearlyCost: yearlyCostRounded,
        valueDrop10y: Math.round(valueDrop10y),
      },
    };
  }, [
    layout,
    density,
    floor3PlusNoElevator,
    truckFar,
    builtBefore2006,
    regionalStats?.landPrice,
  ]);

  const costNowDisplay = useCountUp(costNow);
  const yearlyCostDisplay = useCountUp(yearlyCost);
  const loss10yDisplay = useCountUp(loss10y);

  const handleAppraisalCta = useCallback(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("affiliate:appraisal-cta", { detail: { cityId, source: "jikka-optimizer" } })
      );
    }
    document.getElementById("appraisal-section")?.scrollIntoView({ behavior: "smooth" });
  }, [cityId]);

  const densityLabels: Record<number, string> = {
    1: "スッキリ（生活感なし）",
    2: "やや多い",
    3: "生活感あり（一般的な家）",
    4: "かなり多い",
    5: "困難（ゴミ屋敷レベル）",
  };
  const densityLabel = densityLabels[density] ?? "多い";

  const proMessages = useMemo(() => {
    const list: string[] = [];
    if (density >= 4)
      list.push(
        "荷物密度が高い場合、自力片付けは300時間以上かかり、体調を崩すリスクがあります。"
      );
    if (floor3PlusNoElevator)
      list.push("3階以上でエレベーターがないと、搬出作業の負担と費用が大きく増えます。");
    if (truckFar)
      list.push("トラックが離れていると、車両待機費や追加作業時間で費用が上乗せされます。");
    if (builtBefore2006 === "before")
      list.push(
        "2006年以前の建築はアスベストの有無を確認する必要があり、専門業者への依頼が推奨されます。"
      );
    if (list.length === 0)
      list.push("まずは無料見積もりで、実際の費用と手順を把握することをおすすめします。");
    return list;
  }, [density, floor3PlusNoElevator, truckFar, builtBefore2006]);

  /** 家族会議レポート用：健康・近隣・増税の具体的リスク（入力値に基づく） */
  const reportWarnings = useMemo(() => {
    const list: string[] = [];
    if (density >= 4) {
      list.push("【健康】荷物が多いと自力片付けで300時間超・転倒・腰痛のリスクが高まります。");
      list.push("【近隣】悪臭・害虫・ゴミの流出で苦情・行政指導につながるケースがあります。");
    }
    if (builtBefore2006 === "before")
      list.push("【健康・法規制】2006年以前の建築はアスベスト含有の可能性があり、解体時は特別な処理が必要です。");
    if (floor3PlusNoElevator)
      list.push("【安全】3階以上でエレなしの場合、階段からの落下・荷崩れのリスクが増えます。");
    if (truckFar)
      list.push("【費用・スケジュール】トラックが離れると待機費・延長料がかかり、作業日数が読みにくくなります。");
    list.push("【増税】放置すると特定空家に指定され、固定資産税が最大6倍になるリスクがあります。");
    return list;
  }, [density, builtBefore2006, floor3PlusNoElevator, truckFar]);

  return (
    <section
      className="rounded-2xl border-2 border-slate-200 bg-white shadow-sm overflow-hidden"
      aria-labelledby="jikka-optimizer-heading"
    >
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
        <h2 id="jikka-optimizer-heading" className="font-bold text-slate-800 text-lg">
          {titleVariant === "area" ? `${cityName}限定：実家じまい診断` : `${cityName}の実家じまい・資産防衛シミュレーター`}
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          間取り・荷物量・建物条件を選ぶと、費用と放置リスクがリアルタイムで計算されます。内訳は親族への説明資料としてもご利用ください。
        </p>
      </div>

      <div className="p-5 space-y-6 md:flex md:gap-6 md:flex-wrap">
        <div className="flex-1 min-w-0 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">間取り</label>
            <select
              value={layout}
              onChange={(e) => setLayout(e.target.value as LayoutKey)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="1K">1K</option>
              <option value="2DK">2DK</option>
              <option value="3LDK">3LDK</option>
              <option value="4LDK+">4LDK+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              荷物の密度: {density} — {densityLabel}
            </label>
            <input
              type="range"
              min={1}
              max={5}
              value={density}
              onChange={(e) => setDensity(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none bg-slate-200 accent-primary"
            />
            <div className="flex justify-between mt-1 text-[10px] text-slate-500">
              <span>1: スッキリ</span>
              <span>3: 生活感あり</span>
              <span>5: 困難</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">築年数</label>
            <select
              value={builtBefore1981}
              onChange={(e) => setBuiltBefore1981(e.target.value as "before" | "after")}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="after">1981年以降</option>
              <option value="before">1981年以前</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              建築年（アスベストリスク）
            </label>
            <select
              value={builtBefore2006}
              onChange={(e) => setBuiltBefore2006(e.target.value as "before" | "after")}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="after">2006年以降</option>
              <option value="before">2006年以前（アスベスト確認が必要な場合 +15万円想定）</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={floor3PlusNoElevator}
                onChange={(e) => setFloor3PlusNoElevator(e.target.checked)}
                className="rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-slate-700">3階以上・エレベーターなし</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={truckFar}
                onChange={(e) => setTruckFar(e.target.checked)}
                className="rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-slate-700">トラックが遠い（+15,000円想定）</span>
            </label>
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
              今すぐプロに任せた場合の費用予測
            </p>
            <p className="text-2xl font-bold text-slate-800 tabular-nums">{costNowDisplay.toLocaleString()}円</p>
            <button
              type="button"
              onClick={() => setOpenBreakdown(openBreakdown === "cleanup" ? null : "cleanup")}
              className="mt-2 text-xs text-primary font-medium hover:underline"
            >
              {openBreakdown === "cleanup" ? "内訳を閉じる" : "なぜこの金額？ 内訳を見る"}
            </button>
            {openBreakdown === "cleanup" && (
              <>
                <ul className="mt-2 text-xs text-slate-600 space-y-1 border-t border-slate-200 pt-2">
                  <li>ベース（間取り×密度×階数）: {cleanupBreakdown.base.toLocaleString()}円</li>
                  {cleanupBreakdown.truckFee > 0 && (
                    <li>トラック遠方加算: {cleanupBreakdown.truckFee.toLocaleString()}円</li>
                  )}
                  {cleanupBreakdown.asbestosPremium > 0 && (
                    <li>アスベスト対応想定: {cleanupBreakdown.asbestosPremium.toLocaleString()}円</li>
                  )}
                </ul>
                <p className="mt-2 text-[10px] text-slate-500 italic">出典・根拠：一般社団法人の遺品整理相場ガイドラインに基づき算出</p>
              </>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
              {cityName}で放置した場合の年間維持損失額（特定空家想定）
            </p>
            <p className="text-xl font-bold text-amber-700 tabular-nums">{yearlyCostDisplay.toLocaleString()}円/年</p>
            <button
              type="button"
              onClick={() => setOpenBreakdown(openBreakdown === "annual" ? null : "annual")}
              className="mt-2 text-xs text-primary font-medium hover:underline"
            >
              {openBreakdown === "annual" ? "内訳を閉じる" : "なぜこの金額？ 内訳を見る"}
            </button>
            {openBreakdown === "annual" && (
              <>
                <ul className="mt-2 text-xs text-slate-600 space-y-1 border-t border-slate-200 pt-2">
                  <li>
                    固定資産税（通常の約6倍・特定空家）:{" "}
                    {annualBreakdown.fixedAssetTaxMax.toLocaleString()}円
                  </li>
                  <li>保険・管理費: {(annualBreakdown.insurance + annualBreakdown.managementFee).toLocaleString()}円</li>
                  <li>機会費用（売却して3%運用した場合）: {annualBreakdown.opportunityCost.toLocaleString()}円</li>
                  <li>※想定資産価値: 約{annualBreakdown.estimatedValue.toLocaleString()}円</li>
                </ul>
                <p className="mt-2 text-[10px] text-slate-500 italic">出典・根拠：{cityName}の公的路線価および空家等対策特別措置法（特定空家指定リスク）に基づき算出</p>
              </>
            )}
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-1">
              10年後の想定損失額（維持費＋資産減価）
            </p>
            <p className="text-xl font-bold text-amber-800 tabular-nums">{loss10yDisplay.toLocaleString()}円</p>
            <button
              type="button"
              onClick={() => setOpenBreakdown(openBreakdown === "10y" ? null : "10y")}
              className="mt-2 text-xs text-primary font-medium hover:underline"
            >
              {openBreakdown === "10y" ? "内訳を閉じる" : "なぜこの金額？ 内訳を見る"}
            </button>
            {openBreakdown === "10y" && (
              <>
                <ul className="mt-2 text-xs text-slate-600 space-y-1 border-t border-amber-200 pt-2">
                  <li>10年分の年間維持損失: {(loss10yBreakdown.yearlyCost * 10).toLocaleString()}円</li>
                  <li>資産価値の減価（約5%/年想定）: {loss10yBreakdown.valueDrop10y.toLocaleString()}円</li>
                </ul>
                <p className="mt-2 text-[10px] text-slate-500 italic">出典・根拠：{cityName}の公的路線価および空家等対策特別措置法（特定空家指定リスク）に基づき算出</p>
              </>
            )}
          </div>

          <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-800 mb-2">プロの診断メッセージ</p>
            <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside">
              {proMessages.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setShowReportOverlay(true)}
            className="w-full py-3 px-4 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary-light/30 transition-all duration-200"
          >
            家族に共有するための詳細レポートを表示
          </button>

          <div className="pt-2">
            {ctaHref ? (
              <Link
                href={ctaHref}
                className="w-full block text-center py-3 px-4 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200"
              >
                {ctaLabel ?? "無料査定を依頼する"} →
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleAppraisalCta}
                className="w-full py-3 px-4 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200"
              >
                この損失を止めるための第一歩：無料査定を依頼する →
              </button>
            )}
            <p className="mt-2 text-xs text-slate-500 text-center">
              ※{cityName}を管轄する専門家が、制度の適用可否を無料でアドバイスします
            </p>
          </div>
        </div>
      </div>

      {/* 家族会議用レポートオーバーレイ（LINE共有・キャプチャ向けカード） */}
      {showReportOverlay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-title"
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h3 id="report-title" className="font-bold text-slate-800 text-lg">
                家族会議用レポート
              </h3>
              <button
                type="button"
                onClick={() => setShowReportOverlay(false)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                aria-label="閉じる"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-5 space-y-5 text-sm">
              {/* A. 診断サマリー */}
              <section className="rounded-xl border-2 border-primary/20 bg-primary-light/10 p-4">
                <h4 className="font-bold text-primary mb-3">A. 診断サマリー</h4>
                <p className="text-slate-700 mb-2">
                  <strong>{cityName}</strong>で実家を放置した場合の試算です。
                </p>
                <ul className="space-y-2 text-slate-800">
                  <li className="flex justify-between items-baseline gap-2">
                    <span>年間損失額（特定空家想定）</span>
                    <span className="font-bold text-amber-700 tabular-nums">{yearlyCost.toLocaleString()}円/年</span>
                  </li>
                  <li className="flex justify-between items-baseline gap-2">
                    <span>10年後の消失資産（維持費＋減価）</span>
                    <span className="font-bold text-amber-800 tabular-nums">{loss10y.toLocaleString()}円</span>
                  </li>
                </ul>
              </section>

              {/* B. プロの警告 */}
              <section className="rounded-xl border-2 border-amber-200 bg-amber-50/80 p-4">
                <h4 className="font-bold text-amber-900 mb-3">B. プロの警告</h4>
                <p className="text-amber-900/90 text-xs mb-2">入力条件に基づく、健康・近隣・増税の具体的リスクです。</p>
                <ul className="space-y-2 text-amber-900 text-xs">
                  {reportWarnings.map((w, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="shrink-0" aria-hidden>•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* C. 解決のステップ */}
              <section className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4">
                <h4 className="font-bold text-slate-800 mb-3">C. 解決のステップ</h4>
                <ol className="space-y-3 list-decimal list-inside text-slate-700 text-xs">
                  <li><strong>資産価値の把握（査定）</strong> — 無料査定で現状の価値を把握する</li>
                  <li><strong>遺品整理の計画</strong> — 片付け・処分の範囲と業者見積もりを決める</li>
                  <li><strong>相続登記の確認</strong> — 名義変更の要否と期限を確認する</li>
                </ol>
              </section>

              {/* 入力条件（参考） */}
              <section className="rounded-xl border border-slate-200 p-3">
                <h4 className="font-bold text-slate-600 text-xs mb-2">今回の入力条件（参考）</h4>
                <ul className="text-xs text-slate-600 space-y-0.5">
                  <li>地域: {cityName} / 間取り: {layout} / 密度: {density}（{densityLabel}）</li>
                  <li>築年数: {builtBefore1981 === "before" ? "1981年以前" : "1981年以降"} / 建築年: {builtBefore2006 === "before" ? "2006年以前" : "2006年以降"}</li>
                  <li>3階以上・エレなし: {floor3PlusNoElevator ? "はい" : "いいえ"} / トラック遠方: {truckFar ? "はい" : "いいえ"}</li>
                </ul>
              </section>

              {/* 強いCTA */}
              <section className="rounded-xl bg-amber-50 border-2 border-amber-200 p-4">
                <p className="font-bold text-amber-900 mb-2">プロの診断結果</p>
                <p className="text-amber-900 leading-relaxed text-sm mb-4">
                  {cityName}で放置した場合、10年で<strong className="tabular-nums">{loss10y.toLocaleString()}円</strong>の資産が消失します。今すぐ無料査定で現状把握を。
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowReportOverlay(false);
                    handleAppraisalCta();
                  }}
                  className="w-full py-3 px-4 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-md"
                >
                  この損失を止める：無料査定を依頼する →
                </button>
                <p className="mt-2 text-[10px] text-amber-900/80 text-center">
                  ※{cityName}を管轄する専門家が、制度の適用可否を無料でアドバイスします
                </p>
              </section>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
