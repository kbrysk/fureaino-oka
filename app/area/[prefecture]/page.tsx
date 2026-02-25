import Link from "next/link";
import { notFound } from "next/navigation";
import data from "../../lib/data/municipalities.json";
import PrefectureSummary from "../../components/PrefectureSummary";
import { getCityPathsByPrefecture } from "../../lib/utils/city-loader";
import { pageTitle } from "../../lib/site-brand";

type MunicipalityRow = {
  prefId: string;
  prefName: string;
  cityName: string;
};

const municipalities = data as MunicipalityRow[];

const PREF_IDS = Array.from(new Set(municipalities.map((m) => m.prefId)));

/** ISR: ビルド時は代表都道府県のみ事前生成し、それ以外はオンデマンド生成。 */
export const dynamicParams = true;
export const revalidate = 86400;

/** 代表都道府県のみ（東京・神奈川・大阪など先頭5件）。 */
const SAMPLE_PREF_IDS = PREF_IDS.slice(0, 5);

function getPrefectureName(prefId: string): string | null {
  const first = municipalities.find((m) => m.prefId.toLowerCase() === prefId.toLowerCase());
  return first?.prefName ?? null;
}

interface Props {
  params: Promise<{ prefecture: string }>;
}

export async function generateStaticParams() {
  return SAMPLE_PREF_IDS.map((prefecture) => ({ prefecture }));
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
  const prefIdNorm = prefId.toLowerCase().trim();
  const prefName = getPrefectureName(prefId);
  const hasData = municipalities.some((m) => m.prefId.toLowerCase() === prefIdNorm);

  if (!hasData) notFound();

  const allCities = getCityPathsByPrefecture(prefIdNorm);

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

      <section className="mt-12 mb-8" aria-labelledby="all-cities-heading">
        <div className="mb-6">
          <h2 id="all-cities-heading" className="text-2xl font-bold text-gray-900 border-b-2 border-primary pb-2">
            {prefName ?? prefId}のすべての市区町村から探す
          </h2>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            ご実家や空き家のある地域を選択して、<strong>解体費用の相場</strong>や<strong>粗大ゴミ処分の手順</strong>、使える<strong>補助金・助成金制度</strong>を確認しましょう。
          </p>
        </div>

        <nav aria-label={`${prefName ?? prefId}の市区町村一覧`}>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {allCities.map(({ prefId: pId, cityId, cityName }) => (
              <li key={cityId}>
                <Link
                  href={`/area/${pId}/${cityId}`}
                  className="block w-full text-center py-3 px-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-primary hover:bg-primary-light transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <span className="text-base font-medium text-gray-800">{cityName}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
        <Link href="/area" className="inline-block text-foreground/60 text-sm hover:text-primary hover:underline">
          ← 地域一覧（全国）へ
        </Link>
      </div>
    </div>
  );
}
