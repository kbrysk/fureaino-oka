import type { RealTransactionTableProps, RealTransactionRow } from "../../lib/dispose/types";

const RESULT_TYPE_LABELS: Record<RealTransactionRow["resultType"], string> = {
  buyback: "買取",
  disposal_fee: "処分費用",
  other: "その他",
};

export default function RealTransactionTable({ title, caption, rows }: RealTransactionTableProps) {
  if (rows.length === 0) return null;

  return (
    <section
      className="bg-card rounded-2xl border border-border overflow-hidden"
      aria-labelledby="real-transaction-heading"
    >
      <div className="px-6 py-4 border-b border-border bg-accent/10">
        <h2 id="real-transaction-heading" className="font-bold text-accent">
          {title}
        </h2>
        {caption && (
          <p className="text-xs text-foreground/60 mt-1">{caption}</p>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-foreground">日付・時期</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">品目・状態</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">種別</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">金額・結果</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">備考</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-border/80 hover:bg-primary-light/20 transition"
              >
                <td className="py-3 px-4 text-foreground/90">{row.date}</td>
                <td className="py-3 px-4 text-foreground/90">{row.itemDescription}</td>
                <td className="py-3 px-4">
                  <span className="text-foreground/80">{RESULT_TYPE_LABELS[row.resultType]}</span>
                </td>
                <td className="py-3 px-4 font-medium text-primary">{row.amount}</td>
                <td className="py-3 px-4 text-foreground/60">{row.note ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
