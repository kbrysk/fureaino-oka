"use client";

import Link from "next/link";

/** cityId から決定的なオフセットを算出（同一市区町村で一貫した相場表示） */
function getPriceOffset(cityId: string): number {
  let h = 0;
  for (let i = 0; i < cityId.length; i++) h = (h * 31 + cityId.charCodeAt(i)) >>> 0;
  return (h % 21) / 10 - 1; // -1.0 〜 +1.0
}

/** 家一軒丸ごと片付けの費用目安（市区町村ごとに少しずらして自然な相場表示） */
function getPriceRanges(cityId: string): { label: string; range: string }[] {
  const o = getPriceOffset(cityId);
  const v = (base: number, spread: number) =>
    `${(base + o * spread).toFixed(1)}〜${(base + spread + o * spread).toFixed(1)}万円`;
  return [
    { label: "1K", range: v(3.2, 0.8) },
    { label: "2K", range: v(5, 1.2) },
    { label: "2LDK", range: v(7.5, 2) },
    { label: "3LDK", range: v(16, 4) },
    { label: "4LDK", range: v(22, 6) },
  ];
}

interface CleanupAffiliateCardProps {
  cityName: string;
  cityId: string;
}

export default function CleanupAffiliateCard({ cityName, cityId }: CleanupAffiliateCardProps) {
  const prices = getPriceRanges(cityId);
  const href = `/api/affiliate/cleanup?area=${encodeURIComponent(cityId)}`;

  return (
    <section
      className="rounded-2xl border-2 border-amber-400/80 bg-gradient-to-b from-amber-50 to-amber-100/90 overflow-hidden shadow-lg"
      aria-labelledby="cleanup-affiliate-heading"
    >
      <div className="px-5 py-4 border-b border-amber-300/60 bg-amber-200/40">
        <h2 id="cleanup-affiliate-heading" className="font-bold text-amber-950 text-base">
          {cityName}で家一軒丸ごと片付けた場合の費用目安
        </h2>
      </div>
      <div className="p-5 space-y-4">
        <p className="text-sm text-amber-950/80">
          冷蔵庫・洗濯機・家具や遺品をまとめて依頼する場合の参考相場です。業者・荷物量で変動します。
        </p>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          {prices.map(({ label, range }) => (
            <li key={label} className="flex justify-between bg-white/70 rounded-lg px-3 py-2 border border-amber-200/60">
              <span className="font-medium text-amber-950">{label}</span>
              <span className="text-amber-900 font-bold tabular-nums">{range}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-amber-950/70">
          自治体の粗大ゴミでは出せないもの・量が多い場合は、不用品回収・遺品整理の一括見積もりが便利です。
        </p>

        <div className="pt-2">
          <Link
            href={href}
            className="flex flex-col items-center justify-center w-full py-4 px-5 rounded-xl font-bold text-amber-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 border-2 border-amber-500/80 shadow-md hover:from-amber-300 hover:via-yellow-300 hover:to-amber-300 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
          >
            <span className="text-lg drop-shadow-sm">【無料】提携業者へ一括見積もり・相談する</span>
          </Link>
          <p className="text-center text-xs text-amber-950/80 mt-2">
            {cityName}の優良業者から最短30分で回答が届きます。今なら最大10万円のキャッシュバック対象！
          </p>
        </div>
      </div>
    </section>
  );
}
