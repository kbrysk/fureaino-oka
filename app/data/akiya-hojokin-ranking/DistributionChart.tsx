"use client";

/**
 * 補助金額分布の横棒グラフ（クライアントコンポーネント）。
 * データページ本体はサーバーコンポーネントのまま、グラフ部分のみクライアント分離する。
 * （recharts は "use client" が必須のため）
 *
 * 正確な数値はページ本体の表で提示しているため、グラフは視覚補助（aria-hidden）として扱う。
 */

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Datum = { label: string; count: number; percent: number };

const COLORS = ["#94a3b8", "#60a5fa", "#34d399", "#fbbf24", "#f87171"];

export function DistributionChart({ data }: { data: Datum[] }) {
  return (
    <div className="h-72 w-full" aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 56, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis dataKey="label" type="category" tick={{ fontSize: 12 }} width={84} />
          <Tooltip
            formatter={(value, _name, item) => {
              const count = typeof value === "number" ? value : Number(value ?? 0);
              const pct = (item?.payload as Datum | undefined)?.percent ?? 0;
              return [`${count.toLocaleString("ja-JP")}自治体（${pct}%）`, "該当数"];
            }}
          />
          <Bar dataKey="count" name="自治体数" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
