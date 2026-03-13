import Link from "next/link";
import EmptyHouseTaxSimulator from "../../components/EmptyHouseTaxSimulator";
import { RegionalCTASelector } from "../../components/RegionalCTASelector";
import { getPrefectureIds } from "../../lib/utils/city-loader";
import { PREFECTURE_ID_TO_NAME } from "../../lib/prefecture-ids";
import { pageTitle } from "../../lib/site-brand";
import { getCanonicalUrl, getCanonicalBase } from "../../lib/site-url";
import { generateBreadcrumbSchema } from "../../lib/schema/breadcrumb";

const TOOL_TITLE = "空き家税金シミュレーター";
const TOOL_DESCRIPTION = "空き家の固定資産税・維持費の目安を無料でシミュレーション。";

export const metadata = {
  title: pageTitle("空き家税金シミュレーター"),
  description: TOOL_DESCRIPTION,
  alternates: { canonical: getCanonicalUrl("/tools/empty-house-tax") },
  openGraph: {
    title: `${TOOL_TITLE}【無料】｜ふれあいの丘`,
    description: TOOL_DESCRIPTION,
    url: getCanonicalUrl("/tools/empty-house-tax"),
  },
};

export default function EmptyHouseTaxPage() {
  const base = getCanonicalBase();
  const prefIds = getPrefectureIds();
  const prefectures = prefIds.map((id) => ({ id, name: PREFECTURE_ID_TO_NAME[id] ?? id }));
  const breadcrumb = generateBreadcrumbSchema([
    { name: "ホーム", url: `${base}/` },
    { name: "無料ツール", url: `${base}/tools` },
    { name: "空き家税金シミュレーター", url: `${base}/tools/empty-house-tax` },
  ]);
  return (
    <div className="space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <div>
        <h1 className="text-2xl font-bold text-primary">
          空き家税金シミュレーター
        </h1>
        <p className="text-foreground/60 mt-1">
          空き家の固定資産税・維持費の目安を無料でシミュレーション。都道府県と建物種別で概算します。
        </p>
        <p className="text-sm text-foreground/70 mt-2">
          お住まいの地域別のシミュレーションは
          <Link href="/area" className="text-primary hover:underline ml-1">地域一覧</Link>
          から市区町村を選ぶと、その地域の維持費目安が初期値で表示されます。
        </p>
      </div>
      <EmptyHouseTaxSimulator compact={false} />
      <div className="bg-card rounded-xl p-5 border border-border">
        <p className="text-sm text-foreground/60">
          実際の税額は評価額・自治体により異なります。空き家の場合は特例措置（更地より軽減など）の対象になる場合もあります。売却・活用のご相談は
          <Link href="/articles/master-guide" className="text-primary hover:underline ml-1">はじめかた</Link>
          から提携サービスをご案内しています。
        </p>
      </div>
      <RegionalCTASelector
        targetPage="subsidy"
        labelText="維持費を減らすための補助金をお住まいの地域で確認しましょう"
        prefectures={prefectures}
      />
      <Link
        href="/tools"
        className="inline-block text-primary font-medium hover:underline"
      >
        ← ツール一覧へ
      </Link>
    </div>
  );
}
