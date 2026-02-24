import Link from "next/link";
import data from "../lib/data/municipalities.json";

type MunicipalityRow = {
  prefId: string;
  cityId: string;
  prefName: string;
  cityName: string;
};

const municipalities = data as MunicipalityRow[];

/** prefName ごとにグループ化 */
function groupByPrefecture(items: MunicipalityRow[]): Map<string, MunicipalityRow[]> {
  const map = new Map<string, MunicipalityRow[]>();
  for (const item of items) {
    const key = item.prefName;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return map;
}

/**
 * 全国の空き家補助金ページへの内部リンク一覧（SEO: 全ページから地域ページへのリンク供給）
 * municipalities.json の追加だけで自動的にリンクが増える。
 */
export default function AreaNavigation() {
  const byPref = groupByPrefecture(municipalities);
  const prefs = Array.from(byPref.entries()).sort(([a], [b]) => a.localeCompare(b, "ja"));

  return (
    <section className="w-full bg-primary-light/30 border-t border-primary/20" aria-labelledby="area-nav-heading">
      <div className="max-w-5xl mx-auto w-full px-4 py-8">
        <h2 id="area-nav-heading" className="text-lg font-bold text-primary mb-6">
          全国の空き家補助金・助成金を探す
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {prefs.map(([prefName, cities]) => (
            <div key={prefName} className="bg-card rounded-xl border border-border p-4 shadow-sm">
              <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border">
                {prefName}
              </h3>
              <ul className="flex flex-col gap-1.5">
                {cities
                  .sort((a, b) => a.cityName.localeCompare(b.cityName, "ja"))
                  .map((city) => (
                    <li key={`${city.prefId}-${city.cityId}`}>
                      <Link
                        href={`/area/${city.prefId}/${city.cityId}/subsidy`}
                        className="text-sm text-primary hover:underline hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/40 rounded"
                      >
                        {city.cityName}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
