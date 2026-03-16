import Link from "next/link";
import data from "../lib/data/municipalities.json";
import { PREFECTURE_ID_TO_NAME } from "../lib/prefecture-ids";

type MunicipalityRow = {
  prefId: string;
  prefName: string;
};

const municipalities = data as MunicipalityRow[];

function getUniquePrefectures(): { id: string; name: string }[] {
  const seen = new Set<string>();
  const unique: { id: string; name: string }[] = [];

  for (const row of municipalities) {
    if (seen.has(row.prefId)) continue;
    seen.add(row.prefId);
    const nameFromMap = PREFECTURE_ID_TO_NAME[row.prefId];
    unique.push({
      id: row.prefId,
      name: nameFromMap || row.prefName,
    });
  }

  const orderedIds = Object.keys(PREFECTURE_ID_TO_NAME);

  unique.sort((a, b) => {
    const ia = orderedIds.indexOf(a.id);
    const ib = orderedIds.indexOf(b.id);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.name.localeCompare(b.name, "ja");
  });

  return unique;
}

/**
 * 全国の空き家解体補助金ページへの内部リンク一覧（SEO: 全ページから都道府県ページへのリンク供給）
 * municipalities.json の追加だけで自動的にリンクが増える。
 */
export default function AreaNavigation() {
  const prefectures = getUniquePrefectures();

  return (
    <section className="w-full bg-primary-light/30 border-t border-primary/20" aria-labelledby="area-nav-heading">
      <div className="max-w-5xl mx-auto w-full px-4 py-8 space-y-4">
        <header>
          <h2 id="area-nav-heading" className="text-lg sm:text-xl font-bold text-primary">
            全国の空き家解体補助金を地域から探す
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-700">
            お住まいの都道府県を選択すると、市区町村ごとの補助金情報をご確認いただけます。
          </p>
        </header>
        <nav aria-label="全国の都道府県一覧">
          <ul className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {prefectures.map((pref) => (
              <li key={pref.id}>
                <Link
                  href={`/area/${pref.id}`}
                  className="block w-full text-center bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm sm:text-base text-gray-800 hover:bg-green-50 hover:border-green-300 hover:text-primary transition focus:outline-none focus:ring-2 focus:ring-primary/60"
                >
                  {pref.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
