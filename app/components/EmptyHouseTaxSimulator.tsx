"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import OwlCharacter from "./OwlCharacter";
import { trackLeadEvent } from "../lib/lead-score";
import { LINE_ADD_URL } from "../lib/site-brand";
// U8: フクロウコメント トーン統一 2026-03

/**
 * 都道府県別・建物種別の年間維持費目安（万円）
 * 固定資産税標準税率1.4%・都市計画税0.3%および地域別の評価水準を反映した概算。
 * 空き家は住宅用地特例の対象外となり、税額が増える場合があります。
 * 出典：総務省「固定資産税の概要」、国土交通省等を参考にした相対水準。
 */
const ESTIMATE_TABLE: Record<string, { 戸建て: number; マンション: number; 土地: number }> = {
  北海道: { 戸建て: 16, マンション: 10, 土地: 5 },
  青森県: { 戸建て: 12, マンション: 8, 土地: 4 },
  岩手県: { 戸建て: 12, マンション: 8, 土地: 4 },
  宮城県: { 戸建て: 18, マンション: 11, 土地: 6 },
  秋田県: { 戸建て: 11, マンション: 7, 土地: 3 },
  山形県: { 戸建て: 12, マンション: 8, 土地: 4 },
  福島県: { 戸建て: 13, マンション: 8, 土地: 4 },
  茨城県: { 戸建て: 15, マンション: 9, 土地: 5 },
  栃木県: { 戸建て: 16, マンション: 10, 土地: 5 },
  群馬県: { 戸建て: 15, マンション: 9, 土地: 5 },
  埼玉県: { 戸建て: 22, マンション: 14, 土地: 9 },
  千葉県: { 戸建て: 21, マンション: 13, 土地: 8 },
  東京都: { 戸建て: 30, マンション: 19, 土地: 13 },
  神奈川県: { 戸建て: 26, マンション: 16, 土地: 11 },
  新潟県: { 戸建て: 14, マンション: 9, 土地: 5 },
  富山県: { 戸建て: 14, マンション: 9, 土地: 5 },
  石川県: { 戸建て: 15, マンション: 9, 土地: 5 },
  福井県: { 戸建て: 13, マンション: 8, 土地: 4 },
  山梨県: { 戸建て: 14, マンション: 9, 土地: 5 },
  長野県: { 戸建て: 15, マンション: 9, 土地: 5 },
  岐阜県: { 戸建て: 16, マンション: 10, 土地: 6 },
  静岡県: { 戸建て: 19, マンション: 12, 土地: 7 },
  愛知県: { 戸建て: 21, マンション: 13, 土地: 8 },
  三重県: { 戸建て: 15, マンション: 9, 土地: 5 },
  滋賀県: { 戸建て: 17, マンション: 11, 土地: 6 },
  京都府: { 戸建て: 22, マンション: 14, 土地: 9 },
  大阪府: { 戸建て: 23, マンション: 15, 土地: 10 },
  兵庫県: { 戸建て: 20, マンション: 12, 土地: 7 },
  奈良県: { 戸建て: 19, マンション: 12, 土地: 7 },
  和歌山県: { 戸建て: 14, マンション: 9, 土地: 5 },
  鳥取県: { 戸建て: 11, マンション: 7, 土地: 4 },
  島根県: { 戸建て: 11, マンション: 7, 土地: 4 },
  岡山県: { 戸建て: 16, マンション: 10, 土地: 6 },
  広島県: { 戸建て: 18, マンション: 11, 土地: 6 },
  山口県: { 戸建て: 14, マンション: 9, 土地: 5 },
  徳島県: { 戸建て: 13, マンション: 8, 土地: 4 },
  香川県: { 戸建て: 15, マンション: 9, 土地: 5 },
  愛媛県: { 戸建て: 14, マンション: 9, 土地: 5 },
  高知県: { 戸建て: 12, マンション: 8, 土地: 4 },
  福岡県: { 戸建て: 19, マンション: 12, 土地: 7 },
  佐賀県: { 戸建て: 13, マンション: 8, 土地: 4 },
  長崎県: { 戸建て: 13, マンション: 8, 土地: 4 },
  熊本県: { 戸建て: 14, マンション: 9, 土地: 5 },
  大分県: { 戸建て: 14, マンション: 9, 土地: 5 },
  宮崎県: { 戸建て: 13, マンション: 8, 土地: 4 },
  鹿児島県: { 戸建て: 13, マンション: 8, 土地: 4 },
  沖縄県: { 戸建て: 14, マンション: 9, 土地: 5 },
};

const PREFECTURES = Object.keys(ESTIMATE_TABLE);
const PROPERTY_TYPES = ["戸建て", "マンション", "土地"] as const;
type PropertyType = (typeof PROPERTY_TYPES)[number];

/** 税金以外の維持費目安（戸建て・マンション：保険・管理・草刈り等の年間万円） */
const MAINTENANCE_EXTRA: Record<PropertyType, number> = {
  戸建て: 5,
  マンション: 3,
  土地: 2,
};

/* ───────────────────────────────────────────────────────────
 * 解像度向上モデル（2026-06）
 * 「都道府県＋建物種別」だけの粗い試算から、築年数・規模・状態を加味し、
 * かつ全7専門家パネルが最大のCV要素と指摘した
 *  ①特定空家に指定された場合（住宅用地特例が外れ土地税が最大6倍）
 *  ②解体して更地にした場合（建物税ゼロ・住宅用地特例が外れる）
 * の3シナリオ比較を提示する。すべて「目安/概算」と明記。
 * ─────────────────────────────────────────────────────────── */

/** 規模係数（延床・敷地の大小で税額をスケール） */
const SIZE_OPTIONS = [
  { key: "small", label: "コンパクト", hint: "〜25坪/1〜2LDK", factor: 0.7 },
  { key: "standard", label: "標準", hint: "25〜40坪/3〜4LDK", factor: 1.0 },
  { key: "large", label: "広め", hint: "40坪〜/5LDK〜・大きな土地", factor: 1.4 },
] as const;
type SizeKey = (typeof SIZE_OPTIONS)[number]["key"];

/** 築年数区分（特定空家リスク・建物評価に影響） */
const AGE_OPTIONS = [
  { key: "u30", label: "〜30年", riskBuilding: 0 },
  { key: "30to50", label: "30〜50年", riskBuilding: 1 },
  { key: "o50", label: "50年以上", riskBuilding: 2 },
] as const;
type AgeKey = (typeof AGE_OPTIONS)[number]["key"];

/** 現在の状態（特定空家リスクに影響） */
const STATE_OPTIONS = [
  { key: "living", label: "人が住んでいる", riskState: 0 },
  { key: "managed", label: "空き家（管理している）", riskState: 1 },
  { key: "vacant", label: "空き家（ほぼ放置）", riskState: 3 },
] as const;
type StateKey = (typeof STATE_OPTIONS)[number]["key"];

/** 建物:土地の税額按分（住宅用地特例適用済みのテーブル値を分解する目安比率） */
const LAND_RATIO: Record<PropertyType, number> = {
  戸建て: 0.45, // 戸建ては土地の比重が中程度
  マンション: 0.2, // 区分所有は土地持分が小さい
  土地: 1.0, // 土地のみ
};

/** 住宅用地特例（小規模住宅用地）が外れたときの土地税の倍率。よく知られる「最大6倍」。 */
const SPECIAL_LAND_MULTIPLIER = 6;

interface TaxScenarios {
  /** 現在の年間固定資産税＋都市計画税の目安（万円） */
  current: number;
  /** 特定空家に指定された場合の目安（万円・住宅用地特例が外れ土地税が上昇） */
  specifiedAkiya: number;
  /** 解体して更地にした場合の目安（万円・建物税ゼロ／住宅用地特例も外れる） */
  demolished: number;
  /** 内訳：建物分・土地分（現状） */
  buildingPart: number;
  landPart: number;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** 入力から3シナリオの税額目安を算出 */
function computeScenarios(
  baseTax: number,
  type: PropertyType,
  sizeFactor: number
): TaxScenarios {
  const current = baseTax * sizeFactor;
  const landRatio = LAND_RATIO[type];
  const landPart = current * landRatio; // 住宅用地特例適用後の土地税（目安）
  const buildingPart = current - landPart;
  // 特定空家：土地の住宅用地特例が外れ、土地税が最大6倍（建物税は変わらない）
  const specifiedAkiya = buildingPart + landPart * SPECIAL_LAND_MULTIPLIER;
  // 解体更地：建物税ゼロ、ただし住宅用地特例も外れて土地税が最大6倍
  const demolished = landPart * SPECIAL_LAND_MULTIPLIER;
  return {
    current: round1(current),
    specifiedAkiya: round1(specifiedAkiya),
    demolished: round1(demolished),
    buildingPart: round1(buildingPart),
    landPart: round1(landPart),
  };
}

/** 特定空家リスク判定（築年数＋状態のスコア） */
function judgeAkiyaRisk(
  age: AgeKey,
  state: StateKey,
  type: PropertyType
): { level: "低" | "中" | "高"; color: string; text: string } {
  if (type === "土地") {
    return { level: "低", color: "text-foreground/60", text: "土地のみのため特定空家の対象外です。ただし住宅用地特例が無く、固定資産税は更地評価です。" };
  }
  const ageScore = AGE_OPTIONS.find((a) => a.key === age)?.riskBuilding ?? 0;
  const stateScore = STATE_OPTIONS.find((s) => s.key === state)?.riskState ?? 0;
  const score = ageScore + stateScore;
  if (score >= 4) {
    return { level: "高", color: "text-red-700", text: "築年数が古く管理が行き届いていないと、特定空家に指定されるリスクが高い状態です。指定されると固定資産税が大幅に上がる可能性があります。" };
  }
  if (score >= 2) {
    return { level: "中", color: "text-amber-700", text: "状態によっては特定空家に指定される可能性があります。早めに売却・解体・活用の方向性を検討すると安心です。" };
  }
  return { level: "低", color: "text-emerald-700", text: "現時点で特定空家のリスクは低めです。ただし将来空き家になり放置すると、リスクは上がります。" };
}

interface EmptyHouseTaxSimulatorProps {
  compact?: boolean;
  /** 地域LP用：初期表示の都道府県（例: 東京都） */
  initialPrefecture?: string;
  /** 地域LP用：表示用の市区町村名（例: 世田谷区） */
  initialCityLabel?: string;
}

export default function EmptyHouseTaxSimulator({
  compact = false,
  initialPrefecture = "",
  initialCityLabel,
}: EmptyHouseTaxSimulatorProps) {
  const [prefecture, setPrefecture] = useState(initialPrefecture);
  const [propertyType, setPropertyType] = useState<PropertyType>("戸建て");
  const [size, setSize] = useState<SizeKey>("standard");
  const [age, setAge] = useState<AgeKey>("30to50");
  const [state, setState] = useState<StateKey>("vacant");

  const key = prefecture && ESTIMATE_TABLE[prefecture] ? prefecture : null;
  const baseTax = key ? ESTIMATE_TABLE[key][propertyType] : null;
  const sizeFactor = SIZE_OPTIONS.find((s) => s.key === size)?.factor ?? 1.0;
  const extra = round1(MAINTENANCE_EXTRA[propertyType] * sizeFactor);

  const scenarios = baseTax !== null ? computeScenarios(baseTax, propertyType, sizeFactor) : null;
  const risk = judgeAkiyaRisk(age, state, propertyType);
  const showResult = key !== null && scenarios !== null;

  // 「現状の年間維持費（税＋管理）」と「特定空家化した場合の年間維持費」
  const totalNow = scenarios ? round1(scenarios.current + extra) : null;
  const totalAkiya = scenarios ? round1(scenarios.specifiedAkiya + extra) : null;
  // 特定空家化で増える年間負担（10年損失の根拠）
  const yearlyIncrease =
    scenarios && propertyType !== "土地"
      ? round1(scenarios.specifiedAkiya - scenarios.current)
      : 0;
  const akiyaMultiplier =
    scenarios && scenarios.current > 0
      ? round1(scenarios.specifiedAkiya / scenarios.current)
      : null;

  const selectCls =
    "border border-border rounded-lg px-3 py-2.5 bg-background text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div className={`bg-card rounded-2xl border border-border ${compact ? "p-5" : "p-6"}`}>
      <h3 className={`font-bold text-primary ${compact ? "text-base" : "text-lg"} mb-3`}>
        空き家の固定資産税、年間いくら？特定空家になるといくら？
      </h3>
      <p className="text-base text-foreground/80 mb-4">
        建物の情報を選ぶと、<strong>今の固定資産税</strong>に加え、
        <strong className="text-amber-700">「特定空家に指定された場合」「解体して更地にした場合」</strong>
        の3パターンを比較できます。住宅用地特例が外れると土地の税金が最大6倍になることも。
      </p>

      {/* 入力フォーム（解像度向上：都道府県＋種別＋規模＋築年数＋状態） */}
      <div className="grid gap-3 sm:grid-cols-2 mb-2">
        <label className="block">
          <span className="text-xs font-bold text-foreground/60 mb-1 block">都道府県</span>
          <select
            value={prefecture}
            onChange={(e) => setPrefecture(e.target.value)}
            className={selectCls}
          >
            <option value="">都道府県を選ぶ</option>
            {PREFECTURES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
        <div className="block">
          <span className="text-xs font-bold text-foreground/60 mb-1 block">建物の種別</span>
          <div className="flex gap-2">
            {PROPERTY_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setPropertyType(t)}
                className={`flex-1 px-2 py-2.5 rounded-lg text-sm font-medium transition ${
                  propertyType === t
                    ? "bg-primary text-white"
                    : "bg-background border border-border hover:bg-primary-light"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="text-xs font-bold text-foreground/60 mb-1 block">規模</span>
          <select value={size} onChange={(e) => setSize(e.target.value as SizeKey)} className={selectCls}>
            {SIZE_OPTIONS.map((s) => (
              <option key={s.key} value={s.key}>{s.label}（{s.hint}）</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-bold text-foreground/60 mb-1 block">築年数</span>
          <select value={age} onChange={(e) => setAge(e.target.value as AgeKey)} className={selectCls}>
            {AGE_OPTIONS.map((a) => (
              <option key={a.key} value={a.key}>築{a.label}</option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="text-xs font-bold text-foreground/60 mb-1 block">現在の状態</span>
          <select value={state} onChange={(e) => setState(e.target.value as StateKey)} className={selectCls}>
            {STATE_OPTIONS.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>

      {showResult && scenarios !== null && totalNow !== null && totalAkiya !== null && (
        <div className="space-y-4 mb-4 mt-5">
          {/* 特定空家リスク判定 */}
          {propertyType !== "土地" && (
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-sm font-bold text-foreground/70 mb-1">
                {initialCityLabel ? `${initialCityLabel}の` : ""}この建物の「特定空家」リスク判定
              </p>
              <p className="flex items-baseline gap-2">
                <span className={`text-2xl font-extrabold ${risk.color}`}>リスク{risk.level}</span>
                <span className="text-xs text-foreground/50">（築年数・管理状態から）</span>
              </p>
              <p className="text-sm text-foreground/70 leading-relaxed mt-1">{risk.text}</p>
            </div>
          )}

          {/* 3シナリオ比較表 */}
          <div className="rounded-2xl border-2 border-primary/20 overflow-hidden">
            <div className="px-4 py-2.5 bg-primary-light/40 flex items-center gap-2">
              <OwlCharacter size={compact ? 44 : 52} message="" tone="calm" bubblePosition="right" />
              <p className="text-sm font-bold text-primary">
                {initialCityLabel ? `${initialCityLabel}（${key}）` : key}・{propertyType}の年間固定資産税の目安（3パターン比較）
              </p>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                <tr className="bg-white">
                  <td className="px-4 py-3 text-foreground/80">
                    <span className="font-bold">① 今のまま</span>
                    <span className="block text-xs text-foreground/50">住宅用地特例あり</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-lg font-bold text-foreground/80">約{scenarios.current}万円</span>
                    <span className="block text-xs text-foreground/50">/年</span>
                  </td>
                </tr>
                {propertyType !== "土地" && (
                  <tr className="bg-amber-50/60">
                    <td className="px-4 py-3 text-foreground/80">
                      <span className="font-bold text-amber-800">② 特定空家に指定</span>
                      <span className="block text-xs text-amber-700/80">住宅用地特例が外れる</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-lg font-bold text-amber-800">約{scenarios.specifiedAkiya}万円</span>
                      <span className="block text-xs text-amber-700/80">
                        /年{akiyaMultiplier ? `（約${akiyaMultiplier}倍）` : ""}
                      </span>
                    </td>
                  </tr>
                )}
                <tr className="bg-white">
                  <td className="px-4 py-3 text-foreground/80">
                    <span className="font-bold">③ 解体して更地</span>
                    <span className="block text-xs text-foreground/50">建物税ゼロ・特例も外れる</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-lg font-bold text-foreground/80">約{scenarios.demolished}万円</span>
                    <span className="block text-xs text-foreground/50">/年（解体費は別途）</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="px-4 py-2.5 text-xs text-foreground/50 bg-white border-t border-border">
              ※標準税率（固定資産税1.4%＋都市計画税0.3%）と地域水準・住宅用地特例（最大1/6）をもとにした概算です。実際の税額は評価額・市区町村により異なります。正確な額は固定資産税の課税明細でご確認ください。
            </p>
          </div>

          {/* 10年損失のメッセージ（特定空家化で増える負担×10年） */}
          <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-5 text-center">
            {propertyType !== "土地" && yearlyIncrease > 0 ? (
              <p className="text-lg sm:text-2xl font-bold text-red-700 mb-1">
                もし特定空家に指定されたら、税金だけで10年で約{round1(yearlyIncrease * 10)}万円の負担増
              </p>
            ) : (
              <p className="text-lg sm:text-2xl font-bold text-red-700 mb-1">
                10年保有し続けると、維持費だけで約{round1(totalNow * 10)}万円
              </p>
            )}
            <p className="text-sm text-red-700/80 mb-4">
              さらに、相続した空き家の売却には<strong>「3,000万円特別控除」の3年期限</strong>があります。期限を過ぎると、最大数百万円分の節税機会を逃すことも。
            </p>

            {/* Primary CTA：不動産の一括査定（アフィリエイト導線） */}
            <div className="flex flex-col items-center justify-center w-full mb-4">
              {/* アフィリエイター視点: マイクロコピーでクリックの心理的ハードルを下げる */}
              <span className="text-accent font-bold text-sm sm:text-base mb-1">
                ＼たった60秒・完全無料／
              </span>

              <a
                href="https://px.a8.net/svt/ejp?a8mat=4AXE4D+D2CGOI+5M76+BWVTE"
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                onClick={() => {
                  if (totalNow !== null && totalNow * 10 >= 100) {
                    trackLeadEvent("empty_house_sim_10y_loss_100_plus", {
                      ten_year_loss_yen: totalNow * 10 * 10000,
                    });
                  }
                  if (akiyaMultiplier !== null && akiyaMultiplier >= 2) {
                    trackLeadEvent("empty_house_sim_akiya_risk_high", {
                      akiya_multiplier: akiyaMultiplier,
                    });
                  }
                  trackLeadEvent("appraisal_button_click", { source: "empty_house_sim_affiliate" });
                }}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px] bg-accent text-white px-8 py-4 rounded-xl font-bold text-base sm:text-lg hover:opacity-90 hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                不動産の一括査定はこちら（無料）
              </a>

              {/* ユーザー利益＆Googleアルゴリズム視点: 遷移先の透明性確保と計測ビーコン */}
              <div className="flex flex-col items-center mt-2 relative">
                <span className="text-xs text-gray-500">
                  ※提携先のノムコム（野村不動産ソリューションズ）のサイトへ移動します
                </span>
                <Image
                  src="https://www14.a8.net/0.gif?a8mat=4AXE4D+D2CGOI+5M76+BWVTE"
                  alt=""
                  width={1}
                  height={1}
                  className="absolute opacity-0 pointer-events-none"
                  unoptimized
                />
              </div>
            </div>

            {/* Secondary CTA：LINEで対策ガイドを受け取る */}
            <p className="text-base text-foreground/80 mb-2">詳しい対策ガイドをLINEで受け取る（無料）</p>
            <a
              href={LINE_ADD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-[#06C755] text-white px-6 py-3 rounded-xl font-bold text-base hover:opacity-90 transition border-2 border-[#06C755]/80"
            >
              LINEで今すぐ受け取る
            </a>
          </div>

          {/* SEO内部リンク：解体補助金で負担を減らす導線（特定空家②・解体③の文脈に直結） */}
          {key && (
            <Link
              href={`/area#${encodeURIComponent(key)}`}
              className="block rounded-2xl border-2 border-primary/30 bg-primary-light/30 p-5 text-center hover:bg-primary-light/50 hover:border-primary/50 transition"
            >
              <p className="font-bold text-primary">
                解体を選ぶなら、{key}の解体補助金を確認
              </p>
              <p className="text-base text-foreground/80 mt-1">
                市区町村の補助金で解体費用の自己負担を減らせる場合があります
              </p>
            </Link>
          )}
        </div>
      )}
      {!compact && (
        <Link
          href="/tools/empty-house-tax"
          className="inline-block text-primary text-base font-medium hover:underline"
        >
          さらに詳しく計算する →
        </Link>
      )}
    </div>
  );
}
