"use client";

import { useState } from "react";
import Link from "next/link";
import OwlCharacter from "./OwlCharacter";
import { trackLeadEvent } from "../lib/lead-score";

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

/** 税金以外の維持費目安（戸建て・マンション：保険・管理・草刈り等の年間万円） */
const MAINTENANCE_EXTRA: Record<"戸建て" | "マンション" | "土地", number> = {
  戸建て: 5,
  マンション: 3,
  土地: 2,
};

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
  const [propertyType, setPropertyType] = useState<"戸建て" | "マンション" | "土地">("戸建て");

  const key = prefecture && ESTIMATE_TABLE[prefecture] ? prefecture : null;
  const taxEstimate = key ? ESTIMATE_TABLE[key][propertyType] : null;
  const extra = MAINTENANCE_EXTRA[propertyType];
  const total = taxEstimate !== null ? taxEstimate + extra : null;
  const showResult = key !== null && total !== null;

  return (
    <div className={`bg-card rounded-2xl border border-border ${compact ? "p-5" : "p-6"}`}>
      <h3 className={`font-bold text-primary ${compact ? "text-base" : "text-lg"} mb-3`}>
        空き家の維持費、年間いくら？
      </h3>
      <p className="text-sm text-foreground/60 mb-4">
        都道府県と建物種別を選ぶと、<strong>固定資産税・都市計画税</strong>を中心とした年間維持費の目安がわかります。空き家は住宅用地特例の対象外となり、税額が高くなる場合があります。
      </p>
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={prefecture}
          onChange={(e) => setPrefecture(e.target.value)}
          className="border border-border rounded-lg px-3 py-2 bg-background text-sm min-w-[140px]"
        >
          <option value="">都道府県を選ぶ</option>
          {PREFECTURES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <div className="flex gap-2">
          {PROPERTY_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setPropertyType(t)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
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
      {showResult && total !== null && (
        <div className="space-y-4 mb-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <OwlCharacter
              size={compact ? 80 : 100}
              message={
                total >= 25
                  ? "ホー、これはもったいない！ 早めの対策を考えましょう"
                  : `ホー、私が計算しておきました。年間約${total}万円かかりますよ`
              }
              tone={total >= 25 ? "warning" : "calm"}
              sweat={true}
              bubblePosition="right"
            />
            <div className="flex-1 w-full bg-primary-light rounded-xl p-4 border border-primary/20 space-y-2">
              <p className="text-sm text-foreground/70">
                推定 <strong className="text-primary text-lg">年間約{total}万円</strong> 程度
                {key && (
                  <span>
                    （{initialCityLabel ? `${initialCityLabel}（${key}）` : key}・{propertyType}の目安）
                  </span>
                )}
              </p>
              {!compact && (
                <p className="text-xs text-foreground/60">
                  内訳の目安：税金（固定資産税・都市計画税）約{taxEstimate}万円 ＋ 管理・保険・その他約{extra}万円。実際は評価額・市区町村により異なります。
                </p>
              )}
              <p className="text-xs text-foreground/50">
                あくまで目安です。
                {compact ? (
                  <Link href="/tools/empty-house-tax" className="text-primary underline ml-1">
                    シミュレーターで詳細を見る
                  </Link>
                ) : (
                  " 市区町村の固定資産税課税明細でご確認ください。"
                )}
              </p>
            </div>
          </div>

          {/* 危機感の醸成：10年損失を赤字でデカデカ＋特大査定ボタン（バックエンド収益の要） */}
          <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-5 text-center">
            <p className="text-xl sm:text-2xl font-bold text-red-600 mb-3">
              10年放置すると合計で{total * 10}万円（推定）の損失です！
            </p>
            <Link
              href="/guide"
              onClick={() => {
                if (total * 10 >= 100) {
                  trackLeadEvent("empty_house_sim_10y_loss_100_plus", {
                    ten_year_loss_yen: total * 10 * 10000,
                  });
                }
                trackLeadEvent("appraisal_button_click", { source: "empty_house_sim" });
              }}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-xl font-bold text-base sm:text-lg hover:opacity-90 transition"
            >
              実家の資産価値を今すぐ無料で調べる（不動産査定）
            </Link>
          </div>

          {/* SEO内部リンク：選択した都道府県の補助金情報へ */}
          {key && (
            <Link
              href={`/area#${encodeURIComponent(key)}`}
              className="block rounded-2xl border-2 border-primary/30 bg-primary-light/30 p-5 text-center hover:bg-primary-light/50 hover:border-primary/50 transition"
            >
              <p className="font-bold text-primary">
                {key}の空き家補助金情報はこちら
              </p>
              <p className="text-sm text-foreground/60 mt-1">
                地域を選ぶと補助金・片付け相場の案内へ
              </p>
            </Link>
          )}
        </div>
      )}
      {!compact && (
        <Link
          href="/tools/empty-house-tax"
          className="inline-block text-primary text-sm font-medium hover:underline"
        >
          さらに詳しく計算する →
        </Link>
      )}
    </div>
  );
}
