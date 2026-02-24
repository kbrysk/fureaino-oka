"use client";

import Link from "next/link";

const WAKEGAI_KEYWORDS = /老朽|放置|特定空家|倒壊|危険/;

/** A8.net インプレッション計測用 1px 画像（レイアウト崩れなし・隠し要素） */
const A8_IMP_NOMU = "https://www13.a8.net/0.gif?a8mat=4AXE4D+D2CGOI+5M76+BWVTE";
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
  const impSrc = isWakegai
    ? "https://www13.a8.net/0.gif?a8mat=4AXDCK+E6TXTE+5J56+5YRHE"
    : "https://www13.a8.net/0.gif?a8mat=4AXE4D+D2CGOI+5M76+BWVTE";

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
      className="rounded-2xl border-2 border-primary/20 bg-gradient-to-b from-primary-light/30 to-white overflow-hidden"
      aria-labelledby="real-estate-appraisal-heading"
    >
      <div className="px-5 py-4 border-b border-primary/20 bg-primary-light/40">
        <h2 id="real-estate-appraisal-heading" className="font-bold text-primary text-base">
          {cityName}の不動産を大手ブランドの安心感で売却
        </h2>
      </div>
      <div className="p-5 space-y-4">
        <p className="text-sm text-foreground/80 leading-relaxed">
          野村不動産グループの「ノムコム」が、あなたの実家の適正価値を算出。3,000万円控除の特例を最大限活かすなら今です。
        </p>
        <p className="text-xs text-primary/90 font-medium">
          相続空き家の3,000万円控除の特例期限が迫っています。早めの査定が数百万の差を生みます。
        </p>
        <Link
          href={href}
          rel="nofollow"
          className="flex justify-center w-full py-3.5 px-5 rounded-xl font-bold text-white bg-primary hover:opacity-90 border border-primary transition"
        >
          {cityName}の土地・建物の相場を無料で確認
        </Link>
      </div>
      <div className="h-px overflow-hidden" aria-hidden>
        {/* A8インプレッション計測用1px画像（ノムコム） */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={impSrc} alt="" width={1} height={1} className="block w-px h-px" />
      </div>
    </section>
  );
}
