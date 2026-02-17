import { notFound } from "next/navigation";
import Link from "next/link";
import { getAreaById, getAreaIdSlugs, getAreaIds } from "../../../lib/area-data";
import EmptyHouseTaxSimulator from "../../../components/EmptyHouseTaxSimulator";
import { pageTitle } from "../../../lib/site-brand";

interface Props {
  params: Promise<{ prefecture: string; city: string }>;
}

export async function generateStaticParams() {
  return getAreaIdSlugs().map(({ prefectureId, cityId }) => ({
    prefecture: prefectureId,
    city: cityId,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { prefecture, city } = await params;
  const area = getAreaById(prefecture, city);
  if (!area) return { title: pageTitle("空き家税金シミュレーション") };
  return {
    title: pageTitle(`${area.city}の空き家税金シミュレーション | 固定資産税はいくら?`),
    description: `${area.prefecture}${area.city}の空き家・固定資産税・維持費の目安を無料でシミュレーション。地域別の維持費目安がわかります。`,
  };
}

export default async function TaxSimulatorAreaPage({ params }: Props) {
  const { prefecture, city } = await params;
  const area = getAreaById(prefecture, city);
  if (!area) notFound();
  const ids = getAreaIds(area.prefecture, area.city)!;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">
          {area.city}の空き家税金シミュレーション
        </h1>
        <p className="text-foreground/60 mt-1">
          {area.prefecture}{area.city}の固定資産税・維持費の目安を無料でシミュレーション。都道府県と建物種別で概算します。
        </p>
      </div>

      <EmptyHouseTaxSimulator
        compact={false}
        initialPrefecture={area.prefecture}
        initialCityLabel={area.city}
      />

      <div className="bg-card rounded-xl p-5 border border-border">
        <p className="text-sm text-foreground/60">
          実際の税額は評価額・自治体により異なります。{area.city}の空き家については特例措置の対象になる場合もあります。売却・活用のご相談は
          <Link href="/guide" className="text-primary hover:underline ml-1">はじめかた</Link>
          から提携サービスをご案内しています。
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/area/${ids.prefectureId}/${ids.cityId}`}
          className="inline-block text-primary font-medium hover:underline"
        >
          ← {area.city}の粗大ゴミ・遺品整理ページへ
        </Link>
        <Link href="/tools/empty-house-tax" className="inline-block text-foreground/60 text-sm hover:text-primary hover:underline">
          シミュレーターTOP
        </Link>
        <Link href="/area" className="inline-block text-foreground/60 text-sm hover:text-primary hover:underline">
          地域一覧
        </Link>
      </div>
    </div>
  );
}
