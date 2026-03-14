// S4: 補助金適用後の解体費用目安セクション 2026-03
// 目的：「解体費用 ○○市」クエリをsubsidyページで取り込む
// 重複コンテンツ回避：補助金なし/あり比較＋動的計算でcostページと差別化

type SubsidyCostSectionProps = {
  cityName: string;
  maxSubsidyAmount: number | null;
};

export function SubsidyCostSection({
  cityName,
  maxSubsidyAmount,
}: SubsidyCostSectionProps) {
  const subsidyLabel = maxSubsidyAmount
    ? `最大${(maxSubsidyAmount / 10000).toFixed(0)}万円`
    : "最大100万円程度";

  const rows = [
    {
      size: "木造 20〜30坪",
      baseCost: "60〜100万円",
      afterSubsidy: maxSubsidyAmount
        ? `${Math.max(0, 60 - maxSubsidyAmount / 10000).toFixed(0)}〜${Math.max(0, 100 - maxSubsidyAmount / 10000).toFixed(0)}万円`
        : "0〜数万円",
    },
    {
      size: "木造 30〜40坪",
      baseCost: "90〜150万円",
      afterSubsidy: maxSubsidyAmount
        ? `${Math.max(0, 90 - maxSubsidyAmount / 10000).toFixed(0)}〜${Math.max(0, 150 - maxSubsidyAmount / 10000).toFixed(0)}万円`
        : "数万〜50万円",
    },
    {
      size: "木造 40〜50坪",
      baseCost: "120〜200万円",
      afterSubsidy: maxSubsidyAmount
        ? `${Math.max(0, 120 - maxSubsidyAmount / 10000).toFixed(0)}〜${Math.max(0, 200 - maxSubsidyAmount / 10000).toFixed(0)}万円`
        : "20〜100万円",
    },
    {
      size: "鉄骨・RC造",
      baseCost: "180万円〜",
      afterSubsidy: maxSubsidyAmount
        ? `${Math.max(0, 180 - maxSubsidyAmount / 10000).toFixed(0)}万円〜`
        : "80万円〜",
    },
  ];

  return (
    <section
      id="cost-estimate"
      aria-label={`${cityName}の解体費用と補助金適用後の実質負担`}
      className="py-2"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        {cityName}の解体費用と補助金適用後の実質負担
      </h2>

      <p className="text-base text-gray-600 mb-4">
        {cityName}の補助金（{subsidyLabel}）を使うか使わないかで、
        解体費用の実質負担が大きく変わります。
        申請前に費用の差を確認してください。
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
          <p className="text-xs text-red-600 font-bold mb-1">補助金なしの場合</p>
          <p className="text-2xl font-bold text-red-700">90〜150万円</p>
          <p className="text-xs text-gray-500 mt-1">木造30〜40坪の目安</p>
        </div>
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-center">
          <p className="text-xs text-primary font-bold mb-1">{cityName}の補助金あり</p>
          <p className="text-2xl font-bold text-primary">
            {maxSubsidyAmount
              ? `${Math.max(0, 90 - maxSubsidyAmount / 10000).toFixed(0)}〜${Math.max(0, 150 - maxSubsidyAmount / 10000).toFixed(0)}万円`
              : "大幅に節約可能"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            同条件・補助金（{subsidyLabel}）適用後
          </p>
        </div>
      </div>

      <div className="overflow-x-auto mb-3">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary/10">
              <th className="text-left p-3 border border-gray-200 font-bold text-gray-700 min-w-[120px]">
                建物の規模
              </th>
              <th className="text-right p-3 border border-gray-200 font-bold text-gray-700">
                解体費用の目安
              </th>
              <th className="text-right p-3 border border-gray-200 font-bold text-primary">
                補助金適用後
                <span className="block text-xs font-normal">（{subsidyLabel}控除）</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.size}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="p-3 border border-gray-200 text-gray-700">{row.size}</td>
                <td className="p-3 border border-gray-200 text-right text-gray-800">
                  {row.baseCost}
                </td>
                <td className="p-3 border border-gray-200 text-right font-bold text-primary">
                  {row.afterSubsidy}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">
        ※ 費用は目安です。建物の構造・立地・廃材量により変動します。
        補助金の上限額・対象条件は上記の申請条件をご確認ください。
      </p>
    </section>
  );
}
