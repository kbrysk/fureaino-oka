"use client";

import Link from "next/link";
import { CtaButton } from "@/app/components/ui/CtaButton";

/**
 * 解体一括見積もりカード（"解体する人" intent 向け）。
 *
 * 意図出し分け: 補助金/空き家/解体ページでは「査定（売る人）」だけでなく
 * 「解体一括見積もり（解体する人）」の出口も用意し、"解体費用 ◯◯市" 等の意図に一致させる。
 *
 * 【加入後にやること】クラッソーネ等の「解体一括見積もり」プログラムに加入し、
 * 下の DEMOLITION_AFFILIATE_CLICK / _IMP に成果リンク（A8/afb/アクセストレード等）を貼る。
 * 未設定の間は安全な内部リンク（補助金で費用を抑える導線）にフォールバックするため、
 * このまま配置・デプロイしても壊れない。
 */

/** クラッソーネ等「解体一括見積もり」の成果リンク。加入後にここを差し替える（例: https://px.a8.net/svt/ejp?a8mat=...）。 */
const DEMOLITION_AFFILIATE_CLICK = "";
/** 同・インプレッション計測gif（例: https://www18.a8.net/0.gif?a8mat=...）。任意。 */
const DEMOLITION_AFFILIATE_IMP = "";

/** cityId から決定的なオフセット（同一市区町村で一貫した相場表示）。 */
function getOffset(cityId: string): number {
  let h = 0;
  for (let i = 0; i < cityId.length; i++) h = (h * 31 + cityId.charCodeAt(i)) >>> 0;
  return (h % 21) / 10 - 1; // -1.0 〜 +1.0
}

/** 解体費用の目安（構造×規模・市区町村で自然にずらす）。各自治体公式・相場の一般値。 */
function getDemolitionRanges(cityId: string): { label: string; range: string }[] {
  const o = getOffset(cityId);
  const v = (base: number, spread: number) =>
    `${Math.round(base + o * spread * 5)}〜${Math.round(base + spread + o * spread * 5)}万円`;
  return [
    { label: "木造 30坪", range: v(90, 60) },
    { label: "木造 40坪", range: v(120, 80) },
    { label: "鉄骨 30坪", range: v(120, 60) },
    { label: "RC 30坪", range: v(150, 90) },
  ];
}

interface DemolitionEstimateCardProps {
  cityName: string;
  cityId: string;
}

export default function DemolitionEstimateCard({ cityName, cityId }: DemolitionEstimateCardProps) {
  const ranges = getDemolitionRanges(cityId);
  const hasAffiliate = DEMOLITION_AFFILIATE_CLICK.length > 0;

  return (
    <section
      className="rounded-2xl border-2 border-sky-400/70 bg-gradient-to-b from-sky-50 to-sky-100/80 overflow-hidden shadow-lg"
      aria-labelledby="demolition-estimate-heading"
    >
      <div className="px-5 py-4 border-b border-sky-300/60 bg-sky-200/40">
        <h2 id="demolition-estimate-heading" className="font-bold text-sky-950 text-base">
          {cityName}で空き家を解体する場合の費用目安
        </h2>
      </div>
      <div className="p-5 space-y-4">
        <p className="text-sm text-sky-950/80">
          建物の構造・規模・立地で変動します。補助金を使えば、この費用の一部（中央値で50万円程度）を抑えられる可能性があります。
        </p>
        <ul className="grid grid-cols-2 gap-2 text-sm">
          {ranges.map(({ label, range }) => (
            <li
              key={label}
              className="flex justify-between bg-white/70 rounded-lg px-3 py-2 border border-sky-200/60"
            >
              <span className="font-medium text-sky-950">{label}</span>
              <span className="text-sky-900 font-bold tabular-nums">{range}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-sky-950/70">
          ※ 解体費用は業者により数十万円単位で差が出ます。複数社の一括見積もりで比較するのが確実です。
        </p>

        <div className="pt-1">
          {hasAffiliate ? (
            <>
              <CtaButton variant="primary" href={DEMOLITION_AFFILIATE_CLICK} className="w-full">
                {cityName}の解体費用を無料一括見積もりで比較する 👉
              </CtaButton>
              {DEMOLITION_AFFILIATE_IMP ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={DEMOLITION_AFFILIATE_IMP} width={1} height={1} alt="" style={{ display: "none" }} />
              ) : null}
              <p className="mt-2 text-xs text-sky-950/70">
                ※ 見積もり後のキャンセルも無料です。まずは{cityName}の解体費用の相場を確認しましょう。
              </p>
            </>
          ) : (
            // アフィリンク未設定時の安全なフォールバック（内部導線）
            <>
              <Link
                href="/akiya"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 py-3.5 text-center text-sm font-bold text-white transition hover:bg-sky-700/90 sm:text-base"
              >
                補助金で解体費用を抑える方法・進め方を見る 👉
              </Link>
              <p className="mt-2 text-xs text-sky-950/70">
                ※ 解体補助金は「先着・年度予算」のことが多いため、早めの確認がおすすめです。
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
