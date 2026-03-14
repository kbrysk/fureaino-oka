// S3: データ入力状況管理ページ 2026-03
// アクセスURL: /admin/data-status（本番では robots で /admin/ を disallow）

import Link from "next/link";
import { getMunicipalityDataOrDefault } from "@/app/lib/data/municipalities";

const PRIORITY_CITIES: { prefecture: string; city: string; name: string; prefName: string }[] = [
  { prefecture: "mie", city: "tsu", name: "津市", prefName: "三重県" },
  { prefecture: "kagoshima", city: "kagoshima", name: "鹿児島市", prefName: "鹿児島県" },
  { prefecture: "toyama", city: "toyama", name: "富山市", prefName: "富山県" },
  { prefecture: "tokyo", city: "setagaya", name: "世田谷区", prefName: "東京都" },
  { prefecture: "tokyo", city: "hachioji", name: "八王子市", prefName: "東京都" },
  { prefecture: "aichi", city: "takahama", name: "高浜市", prefName: "愛知県" },
  { prefecture: "aichi", city: "nishio", name: "西尾市", prefName: "愛知県" },
  { prefecture: "osaka", city: "ikeda", name: "池田市", prefName: "大阪府" },
  { prefecture: "fukuoka", city: "kitakyushu", name: "北九州市", prefName: "福岡県" },
  { prefecture: "hiroshima", city: "hiroshima", name: "広島市", prefName: "広島県" },
  { prefecture: "kumamoto", city: "minamata", name: "水俣市", prefName: "熊本県" },
  { prefecture: "akita", city: "kazuno", name: "鹿角市", prefName: "秋田県" },
  { prefecture: "fukuoka", city: "nakagawa", name: "那珂川市", prefName: "福岡県" },
  { prefecture: "mie", city: "yokkaichi", name: "四日市市", prefName: "三重県" },
  { prefecture: "hyogo", city: "nishinomiya", name: "西宮市", prefName: "兵庫県" },
  { prefecture: "tokyo", city: "machida", name: "町田市", prefName: "東京都" },
  { prefecture: "shizuoka", city: "fujinomiya", name: "富士宮市", prefName: "静岡県" },
  { prefecture: "shiga", city: "kusatsu", name: "草津市", prefName: "滋賀県" },
];

export const dynamic = "force-dynamic";
export const metadata = {
  title: "データ入力状況（管理用）",
  robots: "noindex, nofollow",
};

export default async function DataStatusPage() {
  const results = await Promise.all(
    PRIORITY_CITIES.map(async (row) => {
      const data = await getMunicipalityDataOrDefault(row.prefecture, row.city, {
        prefName: row.prefName,
        cityName: row.name,
      });
      return { ...row, isDefault: !!data._isDefault, subsidyName: data.subsidy?.name };
    })
  );

  const withData = results.filter((r) => !r.isDefault).length;
  const needInput = results.filter((r) => r.isDefault).length;

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">
        補助金データ入力状況（優先18市区町村）
      </h1>
      <p className="text-sm text-foreground/70 mb-6">
        Search Consoleで「順位10位以内・表示15回以上・クリック0回」の市区町村。実データ入力でCTR改善を目指します。
      </p>

      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary/10 border-b border-border">
              <th className="text-left p-3 font-bold">市区町村</th>
              <th className="text-left p-3 font-bold">状態</th>
              <th className="text-left p-3 font-bold">補助金名（入力済み時）</th>
              <th className="text-left p-3 font-bold">リンク</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={`${r.prefecture}-${r.city}`} className="border-b border-border last:border-0">
                <td className="p-3 font-medium">{r.name}（{r.prefName}）</td>
                <td className="p-3">
                  {r.isDefault ? (
                    <span className="text-red-600 font-medium">要入力</span>
                  ) : (
                    <span className="text-green-600 font-medium">入力済み</span>
                  )}
                </td>
                <td className="p-3 text-foreground/80">{r.subsidyName ?? "—"}</td>
                <td className="p-3">
                  <Link
                    href={`/area/${r.prefecture}/${r.city}/subsidy`}
                    className="text-primary hover:underline"
                  >
                    補助金ページ
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-primary-light/30 rounded-lg border border-primary/20">
        <p className="font-medium text-primary mb-1">集計</p>
        <p className="text-sm text-foreground/80">
          実データあり: <strong>{withData}</strong>/18市区町村　／　要入力: <strong>{needInput}</strong>/18市区町村
        </p>
      </div>

      <p className="mt-6 text-xs text-foreground/50">
        入力手順はプロジェクトルートの DATA_INPUT_GUIDE.md を参照してください。
      </p>
    </main>
  );
}
