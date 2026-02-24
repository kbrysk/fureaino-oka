import Link from "next/link";
import { notFound } from "next/navigation";
import data from "../../lib/data/municipalities.json";
import PrefectureSummary from "../../components/PrefectureSummary";
import { pageTitle } from "../../lib/site-brand";

type MunicipalityRow = {
  prefId: string;
  prefName: string;
  cityName: string;
};

const municipalities = data as MunicipalityRow[];

const PREF_IDS = Array.from(new Set(municipalities.map((m) => m.prefId)));

function getPrefectureName(prefId: string): string | null {
  const first = municipalities.find((m) => m.prefId.toLowerCase() === prefId.toLowerCase());
  return first?.prefName ?? null;
}

interface Props {
  params: Promise<{ prefecture: string }>;
}

export async function generateStaticParams() {
  return PREF_IDS.map((prefecture) => ({ prefecture }));
}

export async function generateMetadata({ params }: Props) {
  const { prefecture } = await params;
  const prefName = getPrefectureName(prefecture);
  if (!prefName) return { title: pageTitle("地域別 粗大ゴミ・遺品整理") };
  return {
    title: pageTitle(`${prefName}の空き家補助金・実家整理の総合ガイド（2026年最新）`),
    description: `${prefName}の市区町村別・空き家解体補助金・粗大ゴミ申し込み・遺品整理相場の案内。補助金が手厚い自治体ピックアップと不用品処分の公式リンク。`,
  };
}

/**
 * 都道府県トップページ（地域ポータル）
 * /area/tokyo など。municipalities.json にデータがある都道府県のみ静的生成。
 */
export default async function AreaPrefecturePage({ params }: Props) {
  const { prefecture: prefId } = await params;
  const prefName = getPrefectureName(prefId);
  const hasData = municipalities.some((m) => m.prefId.toLowerCase() === prefId.toLowerCase());

  if (!hasData) notFound();

  return (
    <div className="space-y-8">
      <nav className="text-sm text-foreground/60">
        <ol className="flex flex-wrap items-center gap-1.5 [&_a]:hover:text-primary [&_a]:hover:underline">
          <li><Link href="/">ホーム</Link></li>
          <li><span aria-hidden>/</span></li>
          <li><Link href="/area">地域一覧</Link></li>
          <li><span aria-hidden>/</span></li>
          <li><span className="text-foreground/80 font-medium" aria-current="page">{prefName ?? prefId}</span></li>
        </ol>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-primary">
          {prefName ?? prefId}の空き家補助金・実家整理の総合ガイド（2026年最新）
        </h1>
        <p className="text-foreground/60 mt-1">
          {prefName}の市区町村別に、空き家解体補助金・粗大ゴミの申し込み・遺品整理の相場をまとめています。
        </p>
      </div>

      <PrefectureSummary prefId={prefId} prefName={prefName ?? undefined} />

      <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
        <Link href="/area" className="inline-block text-foreground/60 text-sm hover:text-primary hover:underline">
          ← 地域一覧（全国）へ
        </Link>
      </div>
    </div>
  );
}
