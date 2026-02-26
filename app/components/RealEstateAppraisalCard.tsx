"use client";

import Link from "next/link";

const WAKEGAI_KEYWORDS = /老朽|放置|特定空家|倒壊|危険/;

/** ノムコム（野村不動産ソリューションズ）A8 */
const NOMU_CLICK_URL = "https://px.a8.net/svt/ejp?a8mat=4AXE4D+D2CGOI+5M76+BWVTE";
const NOMU_IMP_URL = "https://www12.a8.net/0.gif?a8mat=4AXE4D+D2CGOI+5M76+BWVTE";

/** ワケガイ A8 インプレッション */
const A8_IMP_WAKEGAI = "https://www13.a8.net/0.gif?a8mat=4AXDCK+E6TXTE+5J56+5YRHE";

function useVariant(localRiskText: string | null | undefined): "wakegai" | "nomu" {
  if (typeof localRiskText !== "string" || !localRiskText) return "nomu";
  return WAKEGAI_KEYWORDS.test(localRiskText) ? "wakegai" : "nomu";
}

interface RealEstateAppraisalCardProps {
  cityName: string;
  cityId: string;
  localRiskText?: string | null;
}

export default function RealEstateAppraisalCard({ cityName, cityId, localRiskText }: RealEstateAppraisalCardProps) {
  const variant = useVariant(localRiskText);
  const type = variant;
  const href = `/api/affiliate/appraisal?area=${encodeURIComponent(cityId)}&type=${type}`;

  const isWakegai = localRiskText && WAKEGAI_KEYWORDS.test(localRiskText);
  const impSrc = isWakegai ? A8_IMP_WAKEGAI : NOMU_IMP_URL;

  if (variant === "wakegai") {
    return (
      <section
        className="rounded-2xl border-2 border-amber-200/80 bg-gradient-to-b from-amber-50/90 to-white overflow-hidden"
        aria-labelledby="real-estate-appraisal-heading"
      >
        <div className="px-5 py-4 border-b border-amber-200/60 bg-amber-100/50">
          <h2 id="real-estate-appraisal-heading" className="font-bold text-amber-950 text-base">
            {cityName}の放置空き家・ボロボロの実家でも即現金化
          </h2>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-foreground/80 leading-relaxed">
            他社で断られた古い家や再建築不可物件でも、ワケガイなら現状のまま買い取ります。固定資産税の負担から解放されましょう。
          </p>
          <p className="text-xs text-amber-900/80 font-medium">
            相続空き家の3,000万円控除の特例期限が迫っています。早めの査定が数百万の差を生みます。
          </p>
          <Link
            href={href}
            rel="nofollow"
            className="flex justify-center w-full py-3.5 px-5 rounded-xl font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 border border-amber-500/60 transition"
          >
            {cityName}の訳あり物件を30秒で無料査定
          </Link>
        </div>
        <div className="h-px overflow-hidden" aria-hidden>
          {/* A8インプレッション計測用1px画像 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={impSrc} alt="" width={1} height={1} className="block w-px h-px" />
        </div>
      </section>
    );
  }

  return (
    <section
      id="appraisal-section"
      className="relative rounded-xl border-2 border-orange-400 bg-orange-50 shadow-sm p-6 overflow-hidden"
      aria-labelledby="real-estate-appraisal-heading"
    >
      <div className="border-0">
        <h2 id="real-estate-appraisal-heading" className="text-lg md:text-xl font-bold text-gray-800 mb-3">
          解体や片付けの前に、まずは{cityName}の実家の『今の価値』を知りませんか？
        </h2>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-foreground/80 leading-relaxed">
          大手・野村不動産グループの「ノムコム」が、あなたの実家の適正価値を算出。売却すれば片付け費用を相殺できるかもしれません。3,000万円控除の特例を活かすなら今がチャンスです。
        </p>
        <p className="text-xs text-foreground/70">
          完全無料・Webから約60秒で入力完了。査定を受けるだけなら売却義務はありません。
        </p>
        <div className="flex flex-col items-center mt-4">
          <span className="text-red-600 font-bold text-sm mb-2 animate-pulse">
            ＼ 3,000万円控除の特例期限が迫っています ／
          </span>
          <a
            href={NOMU_CLICK_URL}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="w-full md:w-4/5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg py-4 px-6 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex justify-center items-center"
          >
            {cityName}の土地・建物の相場を無料で確認 👉
          </a>
          <span className="text-gray-500 text-xs mt-3 text-center">
            ※ノムコム（野村不動産ソリューションズ）の公式サイトへ移動します
          </span>
        </div>
      </div>
      {/* A8 インプレッション（レイアウトに影響しないよう絶対配置・非表示） */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={NOMU_IMP_URL}
        alt=""
        width={1}
        height={1}
        style={{ border: 0 }}
        className="absolute bottom-0 left-0 w-px h-px opacity-0 pointer-events-none"
      />
    </section>
  );
}
