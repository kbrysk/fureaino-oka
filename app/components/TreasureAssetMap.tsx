"use client";

import Link from "next/link";

/**
 * お宝埋蔵金マップ：資産3件以上でアンロック（PLG＝「片付け＝損」を「発掘＝得」に書き換え、共有でバイラル）
 */
function formatAmount(amount: number): string {
  if (amount >= 100_000_000) return `${(amount / 100_000_000).toFixed(1)}億円`;
  if (amount >= 10_000) return `${Math.round(amount / 10_000).toLocaleString()}万円`;
  return `${amount.toLocaleString()}円`;
}

function buildLineShareUrl(text: string, url: string): string {
  return `https://line.me/R/msg/text/?${encodeURIComponent(`${text}\n\n${url}`)}`;
}

interface TreasureAssetMapProps {
  totalValue: number;
  assetCount: number;
}

export default function TreasureAssetMap({ totalValue, assetCount }: TreasureAssetMapProps) {
  if (assetCount < 3 || totalValue <= 0) return null;

  const appUrl = typeof window !== "undefined" ? window.location.origin + "/assets" : "";
  const shareText = `うちの実家、推定で${formatAmount(totalValue)}の価値があった！このアプリで資産を可視化したよ。`;

  return (
    <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-white text-center border-2 border-primary">
      <p className="text-white/90 text-sm font-medium mb-1">実家の推定資産マップ</p>
      <p className="text-3xl font-bold mb-2">{formatAmount(totalValue)}</p>
      <p className="text-white/80 text-sm mb-4">
        {assetCount}件の資産を登録しました。「片付け＝損」じゃない、発掘した価値です。
      </p>
      <p className="text-white/90 text-sm font-medium mb-3">うちの実家、実は価値があった！ 結果を共有する</p>
      <div className="flex flex-wrap gap-2 justify-center">
        <a
          href={buildLineShareUrl(shareText, appUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#06C755] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition"
        >
          LINEで共有
        </a>
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(`${shareText}\n${appUrl}`)}
          className="px-5 py-2.5 rounded-xl border-2 border-white/50 font-bold text-sm hover:bg-white/10 transition"
        >
          コピーしてSNSで共有
        </button>
      </div>
      <Link
        href="/guide"
        className="mt-4 inline-block text-white/90 text-sm font-medium hover:underline"
      >
        無料で査定を比較する →
      </Link>
    </div>
  );
}
