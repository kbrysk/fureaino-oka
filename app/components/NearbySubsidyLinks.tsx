import Link from "next/link";

/**
 * 記事末尾の回遊用：同一都道府県内の他市区町村への補助金ページリンク。
 * 「〇〇の近くの自治体の補助金もチェックする」で滞在・回遊率を向上。
 */
interface NearbySubsidyLinksProps {
  cityName: string;
  prefId: string;
  neighbours: { cityId: string; cityName: string }[];
}

export default function NearbySubsidyLinks({ cityName, prefId, neighbours }: NearbySubsidyLinksProps) {
  if (neighbours.length === 0) return null;

  return (
    <section className="rounded-2xl border border-border bg-muted/30 p-5" aria-labelledby="nearby-subsidy-heading">
      <h2 id="nearby-subsidy-heading" className="text-sm font-bold text-foreground/90 mb-3">
        {cityName}の近くの自治体の補助金もチェックする
      </h2>
      <ul className="flex flex-wrap gap-2">
        {neighbours.map(({ cityId, cityName: name }) => (
          <li key={cityId}>
            <Link
              href={`/area/${prefId}/${cityId}/subsidy`}
              className="inline-block px-4 py-2 rounded-xl bg-card border border-border text-sm font-medium text-foreground/90 hover:bg-primary-light hover:text-primary hover:border-primary/30 transition"
            >
              {name}の補助金
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
