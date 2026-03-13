import Link from "next/link";
import { getAreaData, getAreaIds } from "../lib/area-data";
import { PREFECTURE_ID_TO_NAME } from "../lib/prefecture-ids";
import JapanMapNav from "../components/JapanMapNav";
import { PrefectureSelector } from "../components/ui/PrefectureSelector";
import { pageTitle } from "../lib/site-brand";
import { getCanonicalUrl, getCanonicalBase } from "../lib/site-url";
import { generateBreadcrumbSchema } from "../lib/schema/breadcrumb";

export const metadata = {
  title: pageTitle("全国の実家じまい・空き家補助金を地域から探す｜都道府県・市区町村別"),
  description:
    "全国47都道府県・主要市区町村の空き家補助金・遺品整理費用相場・粗大ゴミ申込方法をまとめて掲載。お住まいの地域を選ぶだけで、補助金の条件・申請方法・費用の目安が確認できます。",
  alternates: { canonical: getCanonicalUrl("/area") },
};

export default function AreaIndexPage() {
  const base = getCanonicalBase();
  const breadcrumb = generateBreadcrumbSchema([
    { name: "ホーム", url: `${base}/` },
    { name: "地域一覧", url: `${base}/area` },
  ]);

  const areas = getAreaData();
  const byPrefecture = areas.reduce<Record<string, typeof areas>>((acc, row) => {
    if (!acc[row.prefecture]) acc[row.prefecture] = [];
    acc[row.prefecture].push(row);
    return acc;
  }, {});

  const prefectures = Object.entries(PREFECTURE_ID_TO_NAME).map(([id, name]) => ({ id, name }));

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div>
        <h1 className="text-2xl font-bold text-primary">地域別 粗大ゴミ・遺品整理</h1>
        <p className="text-foreground/60 mt-1">
          全国の市区町村から選ぶと、粗大ゴミの申し込み・補助金・遺品整理相場の案内と相談先がわかります。
        </p>
      </div>

      <PrefectureSelector prefectures={prefectures} placeholder="都道府県を選んでください" targetPath="area" />

      <JapanMapNav />

      <div className="mt-8 pt-8 border-t border-gray-200 space-y-6">
        <p className="text-sm text-gray-500 mb-4">または都道府県一覧から選ぶ</p>
        {Object.entries(byPrefecture).map(([prefecture, rows]) => {
          const firstIds = rows[0] ? getAreaIds(rows[0].prefecture, rows[0].city) : null;
          const prefId = firstIds?.prefectureId;
          return (
          <div key={prefecture} id={prefecture}>
            <h2 className="font-bold text-lg text-foreground/80 mb-3">
              {prefId ? (
                <Link href={`/area/${prefId}`} className="hover:text-primary hover:underline">
                  {prefecture}
                </Link>
              ) : (
                prefecture
              )}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {rows.map((r) => {
                const ids = getAreaIds(r.prefecture, r.city);
                if (!ids) return null;
                return (
                <li key={r.city} className="flex flex-col gap-2 bg-card rounded-xl border border-border p-4">
                  <Link
                    href={`/area/${ids.prefectureId}/${ids.cityId}`}
                    className="font-bold text-foreground hover:text-primary transition"
                  >
                    {r.city}
                  </Link>
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/area/${ids.prefectureId}/${ids.cityId}/subsidy`}
                      className="block w-full text-center bg-primary text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:opacity-90 transition"
                    >
                      {r.city}の補助金・助成金を調べる
                    </Link>
                    <Link
                      href={`/area/${ids.prefectureId}/${ids.cityId}/cleanup`}
                      className="block w-full text-center bg-primary-light text-primary border border-primary/30 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-primary/10 transition"
                    >
                      {r.city}の片付け相場を見る
                    </Link>
                  </div>
                </li>
              );})}
            </ul>
          </div>
          );
        })}
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
              href="/articles/master-guide"
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
