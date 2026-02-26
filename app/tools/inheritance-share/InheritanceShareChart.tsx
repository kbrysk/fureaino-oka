"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export interface InheritanceShareChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface InheritanceShareChartProps {
  chartData: InheritanceShareChartDataItem[];
}

export default function InheritanceShareChart({ chartData }: InheritanceShareChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          label={({ name, value }) => `${name} ${value}%`}
        >
          {chartData.map((_, i) => (
            <Cell key={i} fill={chartData[i].color} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number | undefined) => value != null ? `${value}%` : ""} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
