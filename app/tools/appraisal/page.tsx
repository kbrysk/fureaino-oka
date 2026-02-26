"use client";

import { useState } from "react";
import Link from "next/link";
import FukuchanCTA from "../../components/FukuchanCTA";

/**
 * カテゴリ別の査定目安（一般的な買取相場の目安・生前整理で処分される品目中心）
 * 相場は状態・ブランド・時期により変動します。複数社査定で差が出る場合があります。
 */
const APPRAISAL_DATA = [
  {
    id: "furniture",
    label: "家具・家電",
    description: "状態・年式・メーカーで大きく変わります。",
    items: [
      { name: "冷蔵庫・洗濯機", range: "0.3〜2万円", note: "年式が新いほど高値" },
      { name: "テレビ", range: "0〜1.5万円", note: "40型以上・4Kは査定対象になりやすい" },
      { name: "エアコン", range: "0.5〜3万円", note: "取り外し費が別途かかる場合あり" },
      { name: "ソファ・食卓", range: "0〜数万円", note: "ブランド品は要査定" },
      { name: "その他家電", range: "0〜1万円前後", note: "小型は買取不可の場合あり" },
    ],
  },
  {
    id: "clothes",
    label: "衣類・着物",
    description: "素材・ブランド・保存状態で幅があります。",
    items: [
      { name: "普段着・洋服", range: "0円（買取対象外が多い）", note: "高級ブランドは除く" },
      { name: "着物（反物・留袖等）", range: "1〜30万円程度", note: "種類・仕立てで大きく変動" },
      { name: "帯・小物", range: "0.5〜10万円程度", note: "金糸・名品は高値" },
      { name: "ブランドバッグ・靴", range: "数千〜数十万円", note: "人気モデルは高値" },
    ],
  },
  {
    id: "jewelry",
    label: "貴金属・宝石・骨董",
    description: "相場変動が大きいため、専門鑑定が有効です。",
    items: [
      { name: "金・プラチナ（地金）", range: "日々の相場で変動", note: "重量×相場で概算可能" },
      { name: "宝石・アクセサリー", range: "数千〜数十万円", note: "鑑定書の有無で査定が変わる" },
      { name: "骨董・陶磁器", range: "要鑑定", note: "窯・作者で価値が決まる" },
      { name: "コレクション（切手・カード等）", range: "0〜要査定", note: "希少品は専門業者へ" },
    ],
  },
  {
    id: "realestate",
    label: "不動産",
    description: "立地・築年数・面積で大きく異なります。一括査定が有効です。",
    items: [
      { name: "戸建て・マンション", range: "地域・条件により数百万〜数億円", note: "複数社の査定で差が出やすい" },
      { name: "土地", range: "用途・接道で大きく変動", note: "実家じまい時は売却・活用の比較を" },
    ],
  },
] as const;

export default function AppraisalPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">資産・査定の目安</h1>
        <p className="text-foreground/60 mt-1">
          持ち物の査定目安を確認できます。一般的な買取相場を参考にした目安です。複数社で比較すると査定額に差が出ることもあります。
        </p>
      </div>

      <div className="grid gap-4">
        {APPRAISAL_DATA.map((c) => (
          <div
            key={c.id}
            className={`bg-card rounded-xl border-2 transition overflow-hidden ${
              selected === c.id ? "border-primary bg-primary-light/20" : "border-border hover:border-primary/40"
            }`}
          >
            <button
              type="button"
              onClick={() => setSelected(selected === c.id ? null : c.id)}
              className="w-full text-left p-5"
            >
              <span className="font-bold text-primary">{c.label}</span>
              <p className="text-sm text-foreground/60 mt-1">{c.description}</p>
            </button>
            {selected === c.id && (
              <div className="px-5 pb-5 pt-0 border-t border-border/50">
                <ul className="space-y-3 mt-3">
                  {c.items.map((item) => (
                    <li key={item.name} className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm">
                      <span className="font-medium text-foreground/80">{item.name}</span>
                      <span className="text-primary font-medium shrink-0">{item.range}</span>
                      {item.note && (
                        <span className="w-full text-xs text-foreground/50 mt-0.5">{item.note}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-foreground/50">
        上記は一般的な買取相場の目安です。実際の査定額は状態・時期・業者により異なります。正確な価格は複数社の無料査定をご利用ください。
      </p>

      <FukuchanCTA />

      <Link href="/tools" className="inline-block text-primary font-medium hover:underline">
        ← ツール一覧へ
      </Link>
    </div>
  );
}
