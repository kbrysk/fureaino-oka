import Link from "next/link";
import {
  getNationalContextForCity,
  formatYenAsMan,
  STATS_AS_OF,
  STATS_CREDIT,
} from "@/app/lib/data/municipality-stats";

/**
 * 【全国比較ウィジェット】個別の市区町村 subsidy ページに差し込む小コンポーネント。
 *
 * 「この市の補助金は全国◯位／全国平均は△△万円／補助金がある自治体は全体の□%」を表示し、
 * 各 pSEO ページに“その地域固有の独自データ”を持たせる。
 * これにより「市名を差し替えただけのページ」ではなくなり、Thin Content 判定を回避できる
 * （= データの堀 / Data Moat を個別ページにも展開する）。
 *
 * ─────────────────────────────────────────────────────────────
 * 【組み込み方】（メイン担当が実施）
 *   1. app/area/[prefecture]/[city]/subsidy/page.tsx の上部 import に追加:
 *        import SubsidyNationalContext from "@/app/components/SubsidyNationalContext";
 *      （相対パスを使う既存スタイルに合わせる場合）
 *        import SubsidyNationalContext from "../../../../components/SubsidyNationalContext";
 *
 *   2. ヒーローセクション（最大金額カード）の直後あたり、
 *      RealEstateAppraisalCard の前など本文上部に配置:
 *        <SubsidyNationalContext prefId={ids.prefectureId} cityId={ids.cityId} />
 *
 *      ※ prefId / cityId は data 取得に使っている正規化済みID（ids.prefectureId / ids.cityId）。
 *      ※ _isDefault（未登録）の地域では target が見つからず控えめな全国サマリのみ表示する。
 * ─────────────────────────────────────────────────────────────
 *
 * サーバーコンポーネント（同期集計のみ）。クライアント JS は不要。
 *
 * @param prefId 都道府県スラッグ（例: "hokkaido"）
 * @param cityId 市区町村スラッグ（例: "sapporo"）
 * @param className 追加クラス（任意）
 */
export default function SubsidyNationalContext({
  prefId,
  cityId,
  className = "",
}: {
  prefId: string;
  cityId: string;
  className?: string;
}) {
  const ctx = getNationalContextForCity(prefId, cityId);

  const avgMan = ctx.nationalAverageYen ? formatYenAsMan(ctx.nationalAverageYen) : null;
  const cityMan = ctx.cityAmountYen ? formatYenAsMan(ctx.cityAmountYen) : null;
  const cityLabel = ctx.cityName || "この地域";

  // この市の上限額が全国平均より上か下か（金額が読み取れる場合のみ）
  const vsAverage =
    ctx.cityAmountYen != null && ctx.nationalAverageYen != null
      ? ctx.cityAmountYen >= ctx.nationalAverageYen
        ? "above"
        : "below"
      : null;

  return (
    <section
      className={`rounded-2xl border border-border bg-card p-5 sm:p-6 ${className}`}
      aria-label={`${cityLabel}の解体補助金 全国比較`}
    >
      <div className="mb-4 flex items-center gap-2">
        <span
          className="inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary"
          aria-hidden
        >
          {STATS_CREDIT}・全国比較
        </span>
        <h2 className="text-base font-bold text-foreground sm:text-lg">
          {cityLabel}の補助金は全国でどのくらい？
        </h2>
      </div>

      {/* 指標カード */}
      <dl className="grid grid-cols-3 gap-3 text-center">
        {/* この市の全国順位（金額が読み取れる場合のみ） */}
        <div className="rounded-xl border border-border bg-background p-3">
          <dt className="text-xs text-foreground/55">全国順位（上限額）</dt>
          <dd className="mt-1 font-bold text-primary">
            {ctx.nationalRank != null ? (
              <>
                <span className="text-2xl">{ctx.nationalRank}</span>
                <span className="ml-0.5 text-xs font-medium text-foreground/55">
                  / {ctx.nationalRankPool.toLocaleString("ja-JP")}
                </span>
              </>
            ) : (
              <span className="text-sm text-foreground/60">対象外</span>
            )}
          </dd>
        </div>

        {/* 都道府県内順位 */}
        <div className="rounded-xl border border-border bg-background p-3">
          <dt className="text-xs text-foreground/55">{ctx.prefName || "県内"}順位</dt>
          <dd className="mt-1 font-bold text-foreground/90">
            {ctx.prefectureRank != null ? (
              <>
                <span className="text-2xl">{ctx.prefectureRank}</span>
                <span className="ml-0.5 text-xs font-medium text-foreground/55">
                  / {ctx.prefectureRankPool.toLocaleString("ja-JP")}
                </span>
              </>
            ) : (
              <span className="text-sm text-foreground/60">対象外</span>
            )}
          </dd>
        </div>

        {/* 全国平均との比較 */}
        <div className="rounded-xl border border-border bg-background p-3">
          <dt className="text-xs text-foreground/55">全国平均（目安）</dt>
          <dd className="mt-1 font-bold text-foreground/90">
            <span className="text-2xl">{avgMan ?? "—"}</span>
          </dd>
        </div>
      </dl>

      {/* 説明文（差し替えテストに合格する固有データ文） */}
      <p className="mt-4 text-sm leading-relaxed text-foreground/75">
        全国{ctx.nationalTotal.toLocaleString("ja-JP")}自治体のうち、空き家解体補助金がある自治体は
        <strong>{ctx.nationalWithSubsidy.toLocaleString("ja-JP")}自治体（約{ctx.nationalCoveragePercent}%）</strong>です。
        {cityMan && avgMan ? (
          <>
            {cityLabel}の上限額の目安は<strong>{cityMan}</strong>で、全国平均（{avgMan}）を
            <strong>{vsAverage === "above" ? "上回ります" : "下回ります"}</strong>。
            {ctx.nationalRank != null && (
              <>金額が確認できた{ctx.nationalRankPool.toLocaleString("ja-JP")}自治体中、全国{ctx.nationalRank}位です。</>
            )}
          </>
        ) : ctx.hasSubsidy ? (
          <>{cityLabel}には補助金制度がありますが、上限額が金額として一意に定まらないため順位集計の対象外です（詳細は本ページ内をご確認ください）。</>
        ) : (
          <>{cityLabel}の最新の制度状況は、本ページ内の案内および自治体公式でご確認ください。</>
        )}
      </p>

      {/* データページへの導線 */}
      <p className="mt-3 text-xs text-foreground/55">
        <Link href="/data/akiya-hojokin-ranking" className="text-primary hover:underline">
          全国の補助金ランキング・調査データを見る →
        </Link>
      </p>

      <p className="mt-2 text-[11px] leading-snug text-foreground/45">
        {STATS_AS_OF}・{STATS_CREDIT}（出典：各自治体公式）。金額は目安です。最新・正確な額は各自治体公式でご確認ください。
      </p>
    </section>
  );
}
