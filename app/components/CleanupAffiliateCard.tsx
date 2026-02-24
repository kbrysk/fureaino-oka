"use client";

/** アールクリーニング A8 直リンク（計測漏れ防止のため <a> 直リンク・next/image 不使用） */
const A8_CLEANUP_CLICK = "https://px.a8.net/svt/ejp?a8mat=4AXE4D+BUADWY+4X26+NTRMQ";
const A8_CLEANUP_IMP = "https://www12.a8.net/0.gif?a8mat=4AXE4D+BUADWY+4X26+NTRMQ";

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
          <a
            href={A8_CLEANUP_CLICK}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="flex flex-col items-center justify-center w-full py-4 px-5 rounded-xl font-bold text-white bg-orange-500 border-2 border-orange-600/80 shadow-md hover:bg-orange-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <span className="text-lg drop-shadow-sm">【業界最安値水準】アールクリーニングに無料相談する 👉</span>
          </a>
          <p className="text-center text-xs text-amber-950/80 mt-2">
            ※お見積り後のキャンセルも無料です。まずは{cityName}の実家の片付けにいくらかかるか確認してみましょう。
          </p>
        </div>
      </div>
      {/* A8 インプレッション計測（next/image 不使用・計測漏れ防止） */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={A8_CLEANUP_IMP}
        width={1}
        height={1}
        alt=""
        style={{ border: 0, display: "none" }}
      />
    </section>
  );
}
