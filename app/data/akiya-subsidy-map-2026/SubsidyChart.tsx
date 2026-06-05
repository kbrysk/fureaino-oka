"use client";

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

type CoverageDatum = {
  prefName: string;
  coverageRate: number;
  withSubsidyCount: number;
  totalCities: number;
};

export function CoverageChart({ data }: { data: CoverageDatum[] }) {
  return (
    <div className="h-[700px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 60, left: 80, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            type="number"
            tick={{ fontSize: 11 }}
            domain={[0, 100]}
            unit="%"
          />
          <YAxis
            dataKey="prefName"
            type="category"
            tick={{ fontSize: 10 }}
            width={70}
            interval={0}
          />
          <Tooltip
            formatter={(value, _, item) => {
              const datum = item?.payload as CoverageDatum | undefined;
              if (!datum) return [String(value), "カバレッジ"];
              return [
                `${datum.coverageRate}% (${datum.withSubsidyCount}/${datum.totalCities}市区町村)`,
                "補助金あり",
              ];
            }}
          />
          <Bar dataKey="coverageRate" name="補助金あり (%)">
            {data.map((d, i) => {
              const color =
                d.coverageRate >= 80
                  ? "#16a34a"
                  : d.coverageRate >= 50
                    ? "#65a30d"
                    : d.coverageRate >= 25
                      ? "#ca8a04"
                      : d.coverageRate >= 10
                        ? "#ea580c"
                        : "#dc2626";
              return <Cell key={i} fill={color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

type AmountDatum = {
  prefName: string;
  cityName: string;
  maxAmountYen: number;
  subsidyName?: string;
};

export function TopAmountChart({ data }: { data: AmountDatum[] }) {
  const colors = [
    "#dc2626", "#ea580c", "#d97706", "#ca8a04", "#65a30d",
    "#16a34a", "#0891b2", "#2563eb", "#7c3aed", "#c026d3",
  ];
  const chartData = data.slice(0, 15).map((d) => ({
    label: `${d.prefName}${d.cityName}`,
    amountManYen: Math.round(d.maxAmountYen / 10000),
  }));
  return (
    <div className="h-[480px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 80, left: 100, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            type="number"
            tick={{ fontSize: 11 }}
            unit="万円"
          />
          <YAxis
            dataKey="label"
            type="category"
            tick={{ fontSize: 10 }}
            width={90}
            interval={0}
          />
          <Tooltip
            formatter={(value) => {
              const num = typeof value === "number" ? value : Number(value ?? 0);
              return [`${num.toLocaleString()}万円`, "最大支給額"];
            }}
          />
          <Bar dataKey="amountManYen" name="最大支給額（万円）">
            {chartData.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
