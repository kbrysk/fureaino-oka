import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import {
  getRegionBySlug,
  getRegionSlugs,
  getNeighborRegions,
} from "../../lib/regions";
import { getAreaIds } from "../../lib/area-data";
import { pageTitle } from "../../lib/site-brand";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  return getRegionSlugs();
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const region = getRegionBySlug(slug);
  if (!region) return { title: pageTitle("粗大ゴミ・遺品整理") };
  return {
    title: pageTitle(`${region.city_name}で安く遺品整理・粗大ゴミを処分する裏技`),
    description: `${region.city_name}の粗大ゴミ・遺品整理のやり方比較。行政回収と不用品回収業者の違いと、優良業者相場の見方。`,
  };
}

export default async function RegionPage({ params }: Props) {
  const { slug } = await params;
  const region = getRegionBySlug(slug);
  if (!region) notFound();
  const areaIds = getAreaIds(region.prefecture, region.city);
  if (areaIds) {
    permanentRedirect(`/area/${areaIds.prefectureId}/${areaIds.cityId}/garbage`);
  }

  const neighbors = getNeighborRegions(region, 12);
  const hasSubsidy = region.subsidy_amount === "あり";

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold text-primary">
          {region.city_name}で安く遺品整理・粗大ゴミを処分する裏技
        </h1>
        <p className="text-foreground/60 mt-1">
          行政回収と不用品回収業者を比較し、{region.city}でお得に処分する方法をご案内します。
        </p>
      </header>

      {/* Subsidy Info（補助金ありの場合のみ強調） */}
      {hasSubsidy && (
        <div className="rounded-2xl border-2 border-green-500 bg-green-50 p-5 text-green-900">
          <p className="font-bold text-lg">
            {region.city_name}は解体補助金が出ます！
          </p>
          <p className="text-sm mt-1 text-green-800/90">
            空き家の解体や除却時に自治体の補助制度を利用できる場合があります。窓口で要件をご確認ください。
          </p>
          <Link
            href={areaIds ? `/area/${areaIds.prefectureId}/${areaIds.cityId}/subsidy` : `/area/${encodeURIComponent(region.prefecture)}/${encodeURIComponent(region.city)}/subsidy`}
            className="mt-3 inline-block text-green-700 font-medium underline hover:no-underline"
          >
            {region.city}の補助金詳細を見る
          </Link>
        </div>
      )}

      {/* Comparison Table: 行政回収 vs 不用品回収業者 */}
      <section className="bg-card rounded-2xl border border-border overflow-hidden">
        <h2 className="sr-only">{region.city_name}の処分方法比較</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary-light/30 border-b border-border">
                <th className="text-left p-4 font-bold text-primary">比較項目</th>
                <th className="text-left p-4 font-bold text-primary">行政回収（安いが手続きあり）</th>
                <th className="text-left p-4 font-bold text-primary">不用品回収業者（即日・楽）</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-4 font-medium text-foreground/80">料金の目安</td>
                <td className="p-4">1点数百円〜数千円（自治体により異なる）</td>
                <td className="p-4">一式1万円〜（量・業者により変動）</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-4 font-medium text-foreground/80">申込〜回収</td>
                <td className="p-4">申込→券購入→指定日に出し置き。数日〜数週間かかる場合あり</td>
                <td className="p-4">見積もり→即日〜数日で回収可能</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-4 font-medium text-foreground/80">自分でやる場合</td>
                <td className="p-4">
                  <details className="group">
                    <summary className="cursor-pointer list-none font-medium text-primary hover:underline">
                      自分でやる場合（申込先・電話番号）
                    </summary>
                    <div className="mt-2 pl-2 border-l-2 border-primary/30 text-foreground/70">
                      {region.garbage_center_phone ? (
                        <p>清掃・粗大ゴミ窓口: {region.garbage_center_phone}</p>
                      ) : (
                        <p>窓口・申込方法は{region.city}の公式HPでご確認ください。</p>
                      )}
                      {region.bulkyWasteUrl && (
                        <Link
                          href={region.bulkyWasteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline hover:no-underline mt-1 inline-block"
                        >
                          粗大ゴミ案内ページへ
                        </Link>
                      )}
                    </div>
                  </details>
                </td>
                <td className="p-4">—</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-foreground/80">向いている人</td>
                <td className="p-4">時間に余裕があり、少ない点数を安く出したい方</td>
                <td className="p-4">まとめて・早く・楽に処分したい方、遺品整理で大量に出る方</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Primary CTA */}
      <div className="rounded-2xl bg-primary text-white p-6 text-center">
        <p className="font-bold text-lg mb-2">
          {region.city_name}対応の優良回収業者・買取店の相場を見る
        </p>
        <p className="text-white/80 text-sm mb-4">
          複数社の無料見積もりで比較すると、安心して依頼できます。
        </p>
        <Link
          href="/guide"
          className="inline-block bg-accent text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition"
        >
          無料で見積もりを依頼する
        </Link>
      </div>

      {/* 近隣の市区町村の相場を見る（内部リンク・ローマ字URLでクロール効率化） */}
      {neighbors.length > 0 && (
        <section className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-bold text-lg text-primary mb-4">
            近隣の市区町村の相場を見る
          </h2>
          <ul className="flex flex-wrap gap-2">
            {neighbors.map((r) => {
              const neighborIds = getAreaIds(r.prefecture, r.city);
              const href = neighborIds
                ? `/area/${neighborIds.prefectureId}/${neighborIds.cityId}/garbage`
                : `/region/${encodeURIComponent(r.prefecture)}/${encodeURIComponent(r.city)}`;
              return (
                <li key={`${r.prefecture}-${r.city}`}>
                  <Link
                    href={href}
                    className="inline-block px-4 py-2 rounded-xl border border-border bg-background text-sm font-medium hover:bg-primary-light hover:border-primary/50 hover:text-primary transition"
                  >
                    {r.city_name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/area" className="text-foreground/60 hover:text-primary hover:underline">
          ← 地域一覧（全国）へ
        </Link>
        <Link
          href={areaIds ? `/area/${areaIds.prefectureId}/${areaIds.cityId}/garbage` : `/area/${encodeURIComponent(region.prefecture)}/${encodeURIComponent(region.city)}`}
          className="text-primary font-medium hover:underline"
        >
          {region.city}の粗大ゴミ・遺品整理（詳細）
        </Link>
      </div>

      <footer className="pt-8 mt-8 border-t border-border text-sm text-foreground/60">
        <p className="font-medium text-foreground/80 mb-1">監修</p>
        <p>
          整理収納・生前整理に関する記載は、整理収納アドバイザー／税理士の監修を受けております。
        </p>
      </footer>
    </div>
  );
}
