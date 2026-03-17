import Link from "next/link";
import { notFound } from "next/navigation";
import data from "../../lib/data/municipalities.json";
import { pageTitle } from "../../lib/site-brand";
import { getCanonicalUrl, getCanonicalBase } from "../../lib/site-url";
import { generateBreadcrumbSchema } from "../../lib/schema/breadcrumb";
import { PREFECTURE_ID_TO_NAME } from "../../lib/prefecture-ids";

type MunicipalityRow = {
  prefId: string;
  cityId: string;
  prefName: string;
  cityName: string;
  subsidy?: {
    hasSubsidy?: boolean | null;
    name?: string;
    maxAmount?: string;
  } | null;
};

const municipalities = data as MunicipalityRow[];

const PREF_IDS = Array.from(new Set(municipalities.map((m) => m.prefId)));

export const dynamicParams = true;
export const revalidate = 86400;

function getPrefectureName(prefId: string): string | null {
  const fromMap = PREFECTURE_ID_TO_NAME[prefId];
  if (fromMap) return fromMap;
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
  const currentYear = new Date().getFullYear();
  const prefIdNorm = prefecture.toLowerCase().trim();
  const citiesInPref = municipalities.filter((m) => m.prefId.toLowerCase() === prefIdNorm);
  const totalCities = citiesInPref.length;
  const withSubsidyCount = citiesInPref.filter((r) => r.subsidy?.hasSubsidy === true).length;
  const prefName = getPrefectureName(prefecture);
  const baseTitle = prefName
    ? `【${currentYear}年最新】${prefName}の空き家解体補助金一覧｜市区町村ごとに比較`
    : "都道府県別 空き家解体補助金一覧";
  const description = prefName
    ? `${prefName}全${totalCities}市区町村の空き家解体補助金を一覧で比較。補助金あり${withSubsidyCount}市区町村の上限額・申請条件・窓口情報をまとめています。`
    : "全国の都道府県ごとに、空き家解体補助金・解体費用補助制度を一覧で確認できます。補助金の有無・上限額・申請条件を市区町村ごとにまとめています。";
  return {
    title: pageTitle(baseTitle),
    description,
    alternates: { canonical: getCanonicalUrl(`/area/${prefecture}/`) },
  };
}

function classifySubsidyStatus(row: MunicipalityRow): "has" | "none" | "unknown" {
  const has = row.subsidy?.hasSubsidy;
  if (has === true) return "has";
  if (has === false) return "none";
  return "unknown";
}

function getNeighborPrefectures(currentPrefId: string): { id: string; name: string }[] {
  const REGION_GROUPS: string[][] = [
    ["hokkaido"],
    ["aomori", "iwate", "miyagi", "akita", "yamagata", "fukushima"],
    ["ibaraki", "tochigi", "gunma", "saitama", "chiba", "tokyo", "kanagawa", "yamanashi", "nagano"],
    ["niigata", "toyama", "ishikawa", "fukui", "gifu", "shizuoka", "aichi", "mie"],
    ["shiga", "kyoto", "osaka", "hyogo", "nara", "wakayama"],
    ["tottori", "shimane", "okayama", "hiroshima", "yamaguchi"],
    ["tokushima", "kagawa", "ehime", "kochi"],
    ["fukuoka", "saga", "nagasaki", "kumamoto", "oita", "miyazaki", "kagoshima", "okinawa"],
  ];

  const group = REGION_GROUPS.find((g) => g.includes(currentPrefId)) ?? [];
  return group
    .filter((id) => id !== currentPrefId)
    .map((id) => ({ id, name: PREFECTURE_ID_TO_NAME[id] ?? id }))
    .filter((p) => !!p.name)
    .slice(0, 6);
}

/**
 * 都道府県トップページ（空き家解体補助金まとめ）
 * /area/tokyo など。municipalities.json にデータがある都道府県のみ静的生成。
 */
export default async function AreaPrefecturePage({ params }: Props) {
  const { prefecture: prefId } = await params;
  const prefIdNorm = prefId.toLowerCase().trim();
  const prefName = getPrefectureName(prefIdNorm);
  const hasData = municipalities.some((m) => m.prefId.toLowerCase() === prefIdNorm);

  if (!hasData) notFound();

  const citiesInPref = municipalities.filter((m) => m.prefId.toLowerCase() === prefIdNorm);
  const totalCities = citiesInPref.length;

  const enriched = citiesInPref.map((row) => {
    const status = classifySubsidyStatus(row);
    return {
      ...row,
      status,
      hasSubsidy: status === "has",
      isUnknown: status === "unknown",
    };
  });

  const withSubsidyCount = enriched.filter((c) => c.status === "has").length;

  const sorted = enriched.sort((a, b) => {
    const rank = { has: 0, unknown: 1, none: 2 } as const;
    const ra = rank[a.status];
    const rb = rank[b.status];
    if (ra !== rb) return ra - rb;
    return a.cityName.localeCompare(b.cityName, "ja");
  });

  const base = getCanonicalBase();
  const prefectureName = prefName ?? prefId;
  const breadcrumb = generateBreadcrumbSchema([
    { name: "ホーム", url: `${base}/` },
    { name: `${prefectureName}の空き家解体補助金`, url: `${base}/area/${prefId}` },
  ]);

  const neighborPrefs = getNeighborPrefectures(prefIdNorm);

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <nav className="text-sm text-foreground/60">
        <ol className="flex flex-wrap items-center gap-1.5 [&_a]:hover:text-primary [&_a]:hover:underline">
          <li><Link href="/">トップ</Link></li>
          <li><span aria-hidden>/</span></li>
          <li><span className="text-foreground/80 font-medium" aria-current="page">{prefectureName}の空き家解体補助金</span></li>
        </ol>
      </nav>

      <header className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          {prefectureName}の空き家解体補助金一覧
        </h1>
        <p className="text-base text-foreground/80 leading-relaxed">
          {prefectureName}内の市区町村ごとの空き家解体補助金情報をまとめています。
          補助金の有無・上限額・申請条件を確認し、お住まいの市区町村の補助金ページへお進みください。
        </p>
      </header>

      <section aria-label="補助金制度の概要" className="bg-primary-light/20 border border-primary/20 rounded-2xl p-4 sm:p-5">
        <p className="text-base text-foreground/80">
          補助金制度あり:
          <span className="mx-1 font-semibold text-primary">
            {withSubsidyCount}市区町村
          </span>
          /
          <span className="ml-1 font-semibold">
            全{totalCities}市区町村中
          </span>
        </p>
      </section>

      <section aria-label={`${prefectureName}の市区町村別 空き家解体補助金一覧`} className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          市区町村ごとの補助金情報
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {sorted.map((city) => {
            const statusLabel =
              city.status === "has" ? "補助金あり" : city.status === "none" ? "制度なし" : "調査中";
            const badgeClass =
              city.status === "has"
                ? "bg-green-100 text-green-700"
                : city.status === "none"
                  ? "bg-gray-100 text-gray-500"
                  : "bg-yellow-100 text-yellow-700";
            const subsidyName = city.subsidy?.name;
            const maxAmount = city.subsidy?.maxAmount;

            return (
              <Link
                key={city.cityId}
                href={`/area/${city.prefId}/${city.cityId}/subsidy`}
                className="block border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md hover:border-primary/40 transition focus:outline-none focus:ring-2 focus:ring-primary h-full"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-base text-gray-900">
                      {city.cityName}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {subsidyName ?? `${city.cityName}の空き家解体補助金`}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0 max-w-[55%]">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${badgeClass}`}>
                      {statusLabel}
                    </span>
                    {city.status === "has" && maxAmount && (
                      <span className="text-sm font-medium text-green-700">
                        上限額: {maxAmount}
                      </span>
                    )}
                    <span className="text-base text-primary" aria-hidden>
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-3 bg-card border border-primary/20 rounded-2xl p-4 sm:p-5">
        <h2 className="text-xl font-bold text-primary">
          補助金の申請方法がわからない方はこちら
        </h2>
        <p className="text-base text-foreground/80">
          「どの補助金が使えるのか」「書類をどう書けばよいか」など、具体的な進め方に不安がある場合は、無料診断ツールから状況を整理してみてください。
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/tools/jikka-diagnosis"
            className="inline-flex items-center justify-center rounded-xl bg-primary text-white px-6 py-3 text-base font-semibold hover:opacity-90 transition w-full sm:w-auto"
          >
            実家じまい力診断を試す
          </Link>
          <Link
            href="/tools/empty-house-tax"
            className="inline-flex items-center justify-center rounded-xl border border-primary/40 bg-primary-light/20 text-primary px-6 py-3 text-base font-semibold hover:bg-primary-light/40 transition w-full sm:w-auto"
          >
            空き家の税金・維持費を試算する
          </Link>
        </div>
      </section>

      {neighborPrefs.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">
            近隣都道府県の空き家解体補助金
          </h2>
          <p className="text-base text-foreground/75">
            ご実家や物件が近隣にある場合は、周辺の都道府県の補助金制度もあわせてご確認ください。
          </p>
          <div className="flex flex-wrap gap-2">
            {neighborPrefs.map((p) => (
              <Link
                key={p.id}
                href={`/area/${p.id}`}
                className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-base text-gray-800 hover:border-primary hover:bg-primary-light/40 hover:text-primary transition"
              >
                {p.name}の補助金一覧
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
        <Link href="/area" className="inline-block text-foreground/60 text-sm hover:text-primary hover:underline">
          ← 地域一覧（全国）へ
        </Link>
      </div>
    </div>
  );
}
