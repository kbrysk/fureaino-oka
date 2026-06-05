"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ClusterDatum = {
  label: string;
  averagePeriodInterest: number;
  averageLiftPercent: number;
};

export function ClusterChart({ data }: { data: ClusterDatum[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11 }}
            angle={-25}
            textAnchor="end"
            interval={0}
            height={70}
          />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(value, name) => {
              const num = typeof value === "number" ? value : Number(value ?? 0);
              if (name === "averageLiftPercent" || name === "前期比 (%)") {
                return [`${num > 0 ? "+" : ""}${num}%`, "前期比"];
              }
              return [num, "平均関心度"];
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar
            dataKey="averagePeriodInterest"
            name="平均関心度"
            fill="#6366f1"
          />
          <Bar
            dataKey="averageLiftPercent"
            name="前期比 (%)"
            fill="#10b981"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

type TrendingDatum = {
  keyword: string;
  liftPercent: number;
  periodAverage: number;
};

export function TrendingChart({ data }: { data: TrendingDatum[] }) {
  const colors = [
    "#dc2626",
    "#ea580c",
    "#d97706",
    "#ca8a04",
    "#65a30d",
    "#16a34a",
    "#0891b2",
    "#2563eb",
    "#7c3aed",
    "#c026d3",
  ];
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 60, left: 100, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis
            dataKey="keyword"
            type="category"
            tick={{ fontSize: 11 }}
            width={90}
          />
          <Tooltip
            formatter={(value) => {
              const num = typeof value === "number" ? value : Number(value ?? 0);
              return [`${num > 0 ? "+" : ""}${num}%`, "前期比"];
            }}
          />
          <Bar dataKey="liftPercent" name="前期比 (%)">
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

type RegionDatum = { name: string; averageValue: number };

export function RegionChart({ data }: { data: RegionDatum[] }) {
  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontSize: 11 }}
            width={50}
          />
          <Tooltip
            formatter={(value) => {
              const num = typeof value === "number" ? value : Number(value ?? 0);
              return [num, "平均関心度"];
            }}
          />
          <Bar dataKey="averageValue" name="平均関心度" fill="#0ea5e9" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
