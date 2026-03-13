// U3: 診断進捗インジケーター 2026-03

type DiagnosisProgressProps = {
  current: number; // 現在の質問番号（1始まり）
  total: number;   // 総質問数
};

export function DiagnosisProgress({ current, total }: DiagnosisProgressProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full mb-6" role="status" aria-label={`${total}問中${current}問目`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">質問の進捗</span>
        <span className="text-sm font-medium text-gray-700">
          {current}問目 / {total}問中
        </span>
      </div>
      <div
        className="w-full bg-gray-200 rounded-full h-2"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
      >
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
