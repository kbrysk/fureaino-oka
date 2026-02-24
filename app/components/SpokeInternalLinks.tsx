import Link from "next/link";
import { AREA_ID_MAP } from "../lib/area-id-map.generated";

const MAX_NEARBY = 12;

export type SpokeType = "subsidy" | "garbage" | "cost";

const THEME_LABELS: Record<SpokeType, string> = {
  subsidy: "補助金・助成金",
  garbage: "粗大ゴミ・遺品整理",
  cost: "費用相場",
};

export interface SpokeInternalLinksProps {
  prefId: string;
  cityId: string;
  prefName: string;
  cityName: string;
  currentSpoke: SpokeType;
}

/**
 * ベネフィット駆動型・内部リンク。Spoke ページ最下部に配置し、
 * PageRank を Hub/兄弟 Spoke/近隣に還流させつつ「次に何をすべきか」を明確に提示する。
 */
export default function SpokeInternalLinks({
  prefId,
  cityId,
  prefName,
  cityName,
  currentSpoke,
}: SpokeInternalLinksProps) {
  const base = `/area/${prefId}/${cityId}`;
  const themeLabel = THEME_LABELS[currentSpoke];

  const siblingLinks: { href: string; label: string }[] =
    currentSpoke === "garbage"
      ? [
          { href: `${base}/subsidy`, label: "💰 補助金・助成金を活用して解体費用を抑える" },
          { href: `${base}/cost`, label: "📊 損をしないための最新の費用相場をチェックする" },
        ]
      : currentSpoke === "subsidy"
        ? [
            { href: `${base}/garbage`, label: "🗑️ 自分でできる粗大ゴミ・遺品整理の手順を見る" },
            { href: `${base}/cost`, label: "📊 補助金適用前の、実際の解体費用相場を調べる" },
        ]
        : [
            { href: `${base}/subsidy`, label: `💰 ${cityName}で使える補助金・助成金を探す` },
            { href: `${base}/garbage`, label: "🗑️ 費用を安くする！粗大ゴミ・遺品整理のコツ" },
          ];

  const prefNorm = prefId.toLowerCase().trim();
  const cityNorm = cityId.toLowerCase().trim();
  const nearby = AREA_ID_MAP.filter(
    (e) =>
      e.prefectureId.toLowerCase() === prefNorm &&
      e.cityId.toLowerCase() !== cityNorm
  )
    .sort((a, b) => a.cityId.localeCompare(b.cityId))
    .slice(0, MAX_NEARBY);

  return (
    <nav className="space-y-10" aria-label="関連ページへの導線">
      {/* セクションA: 兄弟・親への還流（ベネフィット文言） */}
      <section
        className="rounded-2xl border border-border bg-muted/20 p-5 sm:p-6"
        aria-labelledby="spoke-benefit-heading"
      >
        <h2
          id="spoke-benefit-heading"
          className="text-base font-bold text-foreground mb-4"
        >
          {cityName}の実家じまいをさらに安く・スムーズに進めるために
        </h2>
        <ul className="flex flex-col sm:flex-row flex-wrap gap-3">
          <li>
            <Link
              href={base}
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-2.5 text-sm font-medium hover:bg-primary/20 border border-primary/20 transition"
            >
              🏠 {cityName}の空き家対策・実家じまい総合ガイドに戻る
            </Link>
          </li>
          {siblingLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:border-primary/30 hover:text-primary transition"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* セクションB: 近隣エリア・同テーマ（SEO・横の繋がり） */}
      {nearby.length > 0 && (
        <section
          className="rounded-2xl border border-border bg-card p-5 sm:p-6"
          aria-labelledby="spoke-nearby-heading"
        >
          <h2
            id="spoke-nearby-heading"
            className="text-base font-bold text-foreground mb-4"
          >
            {prefName}の近隣エリアで【{themeLabel}】の情報を探す
          </h2>
          <ul className="flex flex-wrap gap-2 sm:gap-3">
            {nearby.map((entry) => (
              <li key={entry.cityId}>
                <Link
                  href={`/area/${entry.prefectureId}/${entry.cityId}/${currentSpoke}`}
                  className="inline-flex rounded-full bg-muted/60 text-foreground px-3 py-2 text-sm font-medium hover:bg-primary-light hover:text-primary border border-transparent hover:border-primary/20 transition"
                >
                  {entry.city}の{themeLabel}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </nav>
  );
}
