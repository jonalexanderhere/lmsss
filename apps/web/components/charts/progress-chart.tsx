"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type ProgressChartProps = {
  data: Array<{
    week: string;
    networking: number;
    cybersecurity: number;
    sysadmin: number;
  }>;
};

export function ProgressChart({ data }: ProgressChartProps) {
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="networking" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="cyber" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="week" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              background: "rgba(15, 23, 42, 0.96)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 18
            }}
          />
          <Area dataKey="networking" stroke="#2dd4bf" fill="url(#networking)" strokeWidth={2} />
          <Area dataKey="cybersecurity" stroke="#38bdf8" fill="url(#cyber)" strokeWidth={2} />
          <Area dataKey="sysadmin" stroke="#f59e0b" fillOpacity={0} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
