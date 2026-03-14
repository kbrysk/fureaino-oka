// S2: 解体費用・実家じまい費用テーブル 2026-03
// Search Console「解体費用 ○○市」CTR改善のためのファーストビューコンポーネント

type CostBreakdownTableProps = {
  cityName: string;
};

export function CostBreakdownTable({ cityName }: CostBreakdownTableProps) {
  return (
    <section aria-label={`${cityName}の実家じまい・解体費用の目安`}>
      {/* セクションタイトル */}
      <h2 className="text-lg font-bold text-gray-800 mb-3">
        {cityName}の費用目安（間取り別）
      </h2>

      {/* 解体費用テーブル */}
      <div className="mb-6">
        <h3 className="text-base font-bold text-gray-700 mb-2">
          ▍建物解体費用の相場
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-primary/10">
                <th className="text-left p-3 border border-gray-200 font-bold text-gray-700">
                  建物の規模
                </th>
                <th className="text-right p-3 border border-gray-200 font-bold text-gray-700">
                  費用目安
                </th>
                <th className="text-right p-3 border border-gray-200 font-bold text-gray-700">
                  補助金適用後
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { size: "木造 20〜30坪", min: "60万円〜", after: "30万円〜" },
                { size: "木造 30〜40坪", min: "90万円〜", after: "60万円〜" },
                { size: "木造 40〜50坪", min: "120万円〜", after: "90万円〜" },
                { size: "鉄骨・RC造", min: "180万円〜", after: "150万円〜" },
              ].map((row, i) => (
                <tr
                  key={row.size}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="p-3 border border-gray-200 text-gray-700">
                    {row.size}
                  </td>
                  <td className="p-3 border border-gray-200 text-right font-medium text-gray-800">
                    {row.min}
                  </td>
                  <td className="p-3 border border-gray-200 text-right font-medium text-primary">
                    {row.after}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          ※ 補助金適用後は自治体の上限額（50〜100万円）を差し引いた目安です。
          実際の金額は業者に見積もりを取ってください。
        </p>
      </div>

      {/* 遺品整理・片付け費用テーブル */}
      <div className="mb-4">
        <h3 className="text-base font-bold text-gray-700 mb-2">
          ▍遺品整理・実家片付け費用の相場
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-primary/10">
                <th className="text-left p-3 border border-gray-200 font-bold text-gray-700">
                  間取り
                </th>
                <th className="text-right p-3 border border-gray-200 font-bold text-gray-700">
                  費用目安
                </th>
                <th className="text-right p-3 border border-gray-200 font-bold text-gray-700">
                  作業日数
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: "1K・1DK", cost: "3〜8万円", days: "半日〜1日" },
                { type: "1LDK・2DK", cost: "8〜15万円", days: "1〜2日" },
                { type: "2LDK・3DK", cost: "15〜25万円", days: "1〜2日" },
                { type: "3LDK以上", cost: "25万円〜", days: "2〜3日" },
              ].map((row, i) => (
                <tr
                  key={row.type}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="p-3 border border-gray-200 text-gray-700">
                    {row.type}
                  </td>
                  <td className="p-3 border border-gray-200 text-right font-medium text-gray-800">
                    {row.cost}
                  </td>
                  <td className="p-3 border border-gray-200 text-right text-gray-600">
                    {row.days}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          ※ 荷物の量・種類・アクセス条件によって変動します。
          複数業者から無料見積もりを取ることをお勧めします。
        </p>
      </div>
    </section>
  );
}
