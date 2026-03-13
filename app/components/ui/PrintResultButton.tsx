"use client";

// U4: 診断結果 印刷・PDF保存ボタン 2026-03

type PrintResultButtonProps = {
  toolName: string;
};

export function PrintResultButton({ toolName }: PrintResultButtonProps) {
  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `${toolName}の診断結果 - ふれあいの丘`;
    window.print();
    document.title = originalTitle;
  };

  return (
    <button
      onClick={handlePrint}
      className={[
        "no-print flex items-center gap-2",
        "min-h-[48px] px-6 py-3",
        "rounded-lg font-bold",
        "bg-white border border-gray-300",
        "text-gray-700 hover:bg-gray-50",
        "transition-colors duration-200",
      ].join(" ")}
      type="button"
      aria-label={`${toolName}の診断結果を印刷またはPDFで保存する`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
        />
      </svg>
      印刷する／PDFで保存する
    </button>
  );
}
