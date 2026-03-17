/**
 * 2026年度版・鮮度シグナル用バナー（subsidy ページの H1 直下に配置）
 */
export default function UpdateBanner() {
  return (
    <div
      className="my-4 rounded"
      style={{
        backgroundColor: "#E6F1FB",
        fontSize: "13px",
        borderLeft: "3px solid #378ADD",
        padding: "10px 14px",
        borderRadius: "4px",
      }}
    >
      <p className="font-medium text-gray-900 mb-1">
        🗓 2026年度版（2026年3月更新）
      </p>
      <p className="text-gray-800 leading-relaxed">
        本ページの補助金情報は2026年4月の改定情報を先行掲載しています。最新の確定情報は各自治体の公式ページでご確認ください。
      </p>
    </div>
  );
}
