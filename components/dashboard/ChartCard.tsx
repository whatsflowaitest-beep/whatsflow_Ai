"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { mockChartData, mockPieData, mockBarData } from "@/lib/mock-data";

export function LeadConversionsChart() {
  const data = mockChartData.slice(-14);

  return (
    <div className="bg-white rounded-xl border border-[#E2EDE2] shadow-sm p-6">
      <div className="mb-4">
        <h3 className="font-semibold text-[#0F1F0F]">
          Lead Conversions — Last 14 Days
        </h3>
        <p className="text-xs text-[#6B7B6B] mt-0.5">
          Daily leads received vs converted
        </p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16A34A" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F7F0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#6B7B6B" }}
            tickLine={false}
            axisLine={false}
            interval={2}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#6B7B6B" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #E2EDE2",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
          />
          <Area
            type="monotone"
            dataKey="leads"
            stroke="#86EFAC"
            strokeWidth={2}
            fill="url(#colorLeads)"
            name="Leads"
          />
          <Area
            type="monotone"
            dataKey="conversions"
            stroke="#16A34A"
            strokeWidth={2}
            fill="url(#colorConversions)"
            name="Conversions"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LeadSourcesChart() {
  return (
    <div className="bg-white rounded-xl border border-[#E2EDE2] shadow-sm p-6">
      <div className="mb-4">
        <h3 className="font-semibold text-[#0F1F0F]">Lead Sources</h3>
        <p className="text-xs text-[#6B7B6B] mt-0.5">
          Where your leads come from
        </p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={mockPieData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {mockPieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #E2EDE2",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value) => [`${value}%`, ""]}
          />
          <Legend
            wrapperStyle={{ fontSize: "11px" }}
            formatter={(value) => (
              <span style={{ color: "#6B7B6B" }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DailyBarChart() {
  return (
    <div className="bg-white rounded-xl border border-[#E2EDE2] shadow-sm p-6">
      <div className="mb-4">
        <h3 className="font-semibold text-[#0F1F0F]">
          Daily Leads & Conversions
        </h3>
        <p className="text-xs text-[#6B7B6B] mt-0.5">Last 7 days</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={mockBarData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F7F0" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: "#6B7B6B" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#6B7B6B" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #E2EDE2",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Bar dataKey="leads" fill="#D1FAE5" radius={[4, 4, 0, 0]} name="Total Leads" />
          <Bar dataKey="conversions" fill="#16A34A" radius={[4, 4, 0, 0]} name="Conversions" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ConversionByServiceChart() {
  const data = [
    { service: "Dental", rate: 74 },
    { service: "Real Estate", rate: 61 },
    { service: "Salon", rate: 58 },
    { service: "Other", rate: 52 },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#E2EDE2] shadow-sm p-6">
      <div className="mb-4">
        <h3 className="font-semibold text-[#0F1F0F]">
          Conversion by Service Type
        </h3>
        <p className="text-xs text-[#6B7B6B] mt-0.5">
          Conversion rate per service
        </p>
      </div>
      <div className="space-y-4 pt-2">
        {data.map((item) => (
          <div key={item.service}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-medium text-[#0F1F0F]">{item.service}</span>
              <span className="text-[#16A34A] font-semibold">{item.rate}%</span>
            </div>
            <div className="h-2 bg-[#F0F7F0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#16A34A] rounded-full"
                style={{ width: `${item.rate}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ResponseTimeChart() {
  const data = mockChartData.slice(-14).map((d, i) => ({
    ...d,
    responseTime: +(0.5 + Math.random() * 0.6).toFixed(1),
  }));

  return (
    <div className="bg-white rounded-xl border border-[#E2EDE2] shadow-sm p-6">
      <div className="mb-4">
        <h3 className="font-semibold text-[#0F1F0F]">
          Response Time Distribution
        </h3>
        <p className="text-xs text-[#6B7B6B] mt-0.5">AI response speed (seconds)</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="rtGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16A34A" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F7F0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#6B7B6B" }}
            tickLine={false}
            axisLine={false}
            interval={2}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#6B7B6B" }}
            tickLine={false}
            axisLine={false}
            domain={[0, 2]}
          />
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #E2EDE2",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value) => [`${value}s`, "Response Time"]}
          />
          <Area
            type="monotone"
            dataKey="responseTime"
            stroke="#16A34A"
            strokeWidth={2}
            fill="url(#rtGradient)"
            name="Response Time"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LeadFunnelChart() {
  const stages = [
    { label: "Received", value: 142, color: "#86EFAC" },
    { label: "Replied", value: 128, color: "#4ADE80" },
    { label: "Qualified", value: 97, color: "#22C55E" },
    { label: "Booked", value: 89, color: "#16A34A" },
  ];
  const max = stages[0].value;

  return (
    <div className="bg-white rounded-xl border border-[#E2EDE2] shadow-sm p-6">
      <div className="mb-6">
        <h3 className="font-semibold text-[#0F1F0F]">Lead Stage Funnel</h3>
        <p className="text-xs text-[#6B7B6B] mt-0.5">
          From received to booked
        </p>
      </div>
      <div className="space-y-3">
        {stages.map((stage) => (
          <div key={stage.label} className="flex items-center gap-4">
            <span className="text-xs font-medium text-[#6B7B6B] w-20 shrink-0">
              {stage.label}
            </span>
            <div className="flex-1 h-7 bg-[#F0F7F0] rounded-md overflow-hidden">
              <div
                className="h-full rounded-md flex items-center pl-3 transition-all duration-500"
                style={{
                  width: `${(stage.value / max) * 100}%`,
                  backgroundColor: stage.color,
                }}
              >
                <span className="text-xs font-bold text-white drop-shadow-sm">
                  {stage.value}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
