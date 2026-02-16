import Link from "next/link";
import { getAreaData } from "../lib/area-data";
import JapanMapNav from "../components/JapanMapNav";
import { pageTitle } from "../lib/site-brand";

export const metadata = {
  title: pageTitle("地域別 粗大ゴミ・遺品整理"),
  description:
    "全国の市区町村別に粗大ゴミ申し込み・補助金・遺品整理相場を掲載。お住まいの地域を選んでご確認ください。",
};

export default function AreaIndexPage() {
  const areas = getAreaData();
  const byPrefecture = areas.reduce<Record<string, typeof areas>>((acc, row) => {
    if (!acc[row.prefecture]) acc[row.prefecture] = [];
    acc[row.prefecture].push(row);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">地域別 粗大ゴミ・遺品整理</h1>
        <p className="text-foreground/60 mt-1">
          全国の市区町村から選ぶと、粗大ゴミの申し込み・補助金・遺品整理相場の案内と相談先がわかります。
        </p>
      </div>

      <JapanMapNav />

      <div className="space-y-6">
        {Object.entries(byPrefecture).map(([prefecture, rows]) => (
          <div key={prefecture} id={prefecture}>
            <h2 className="font-bold text-lg text-foreground/80 mb-3">{prefecture}</h2>
            <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {rows.map((r) => (
                <li key={r.city} className="flex flex-col gap-2 bg-card rounded-xl border border-border p-4">
                  <Link
                    href={`/area/${encodeURIComponent(r.prefecture)}/${encodeURIComponent(r.city)}`}
                    className="font-bold text-foreground hover:text-primary transition"
                  >
                    {r.city}
                  </Link>
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/area/${encodeURIComponent(r.prefecture)}/${encodeURIComponent(r.city)}/subsidy`}
                      className="block w-full text-center bg-primary text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:opacity-90 transition"
                    >
                      {r.city}の補助金・助成金を調べる
                    </Link>
                    <Link
                      href={`/area/${encodeURIComponent(r.prefecture)}/${encodeURIComponent(r.city)}/cleanup`}
                      className="block w-full text-center bg-primary-light text-primary border border-primary/30 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-primary/10 transition"
                    >
                      {r.city}の片付け相場を見る
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* トピッククラスター：実家じまい・費用・診断への送客 */}
      <section className="bg-primary-light/30 rounded-2xl border border-primary/20 p-6">
        <h2 className="font-bold text-primary mb-3">実家じまい・遺品整理の費用と進め方</h2>
        <p className="text-sm text-foreground/70 mb-4">
          地域別の案内に加え、間取り別の費用相場や進め方の全体像・無料診断もご利用いただけます。
        </p>
        <ul className="grid gap-3 sm:grid-cols-3">
          <li>
            <Link
              href="/cost"
              className="block py-3 px-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary-light/30 transition font-medium text-foreground/90 text-sm"
            >
              間取り別 遺品整理費用相場
            </Link>
          </li>
          <li>
            <Link
              href="/guide"
              className="block py-3 px-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary-light/30 transition font-medium text-foreground/90 text-sm"
            >
              実家じまいの進め方 全手順
            </Link>
          </li>
          <li>
            <Link
              href="/tools/jikka-diagnosis"
              className="block py-3 px-4 rounded-xl border-2 border-primary bg-primary-light/30 hover:bg-primary hover:text-white transition font-medium text-primary text-sm"
            >
              実家じまい力診断（3分）
            </Link>
          </li>
        </ul>
      </section>

      <Link href="/tools" className="inline-block text-primary font-medium hover:underline">
        ← 無料ツール一覧へ
      </Link>
    </div>
  );
}
