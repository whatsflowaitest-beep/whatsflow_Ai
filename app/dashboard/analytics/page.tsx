"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock, MessageSquare, CalendarCheck } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  DailyBarChart,
  ConversionByServiceChart,
  ResponseTimeChart,
  LeadFunnelChart,
} from "@/components/dashboard/ChartCard";
import { mockTopDays } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { PageHeading } from "@/components/dashboard/PageHeading";

const dateRanges = ["Last 7d", "Last 30d", "Last 90d", "Custom"];

const kpiStats = [
  {
    label: "Leads Received",
    value: 142,
    subLabel: "Total this period",
    trend: "up" as const,
    trendValue: "↑ 12% vs previous",
    icon: <MessageSquare className="w-4 h-4" />,
  },
  {
    label: "Conversion Rate",
    value: "62.7%",
    subLabel: "Leads → Booked",
    trend: "up" as const,
    trendValue: "↑ 3.2% vs previous",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    label: "Avg Response Time",
    value: "0.8s",
    subLabel: "AI first reply speed",
    trend: "up" as const,
    trendValue: "↑ 0.1s faster",
    icon: <Clock className="w-4 h-4" />,
  },
  {
    label: "Appointments Booked",
    value: 89,
    subLabel: "Confirmed bookings",
    trend: "up" as const,
    trendValue: "↑ 8 from previous",
    icon: <CalendarCheck className="w-4 h-4" />,
  },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState("Last 30d");

  return (
    <div className="space-y-6">
      <PageHeading 
        title="Analytics"
        description="Track your lead conversion performance and monitor AI response efficiency."
        rightContent={
          <div className="flex gap-1 bg-white border border-[#E2EDE2] rounded-lg p-1">
            {dateRanges.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  "text-xs font-medium px-3 py-1.5 rounded-md transition-all",
                  range === r
                    ? "bg-[#16A34A] text-white"
                    : "text-[#6B7B6B] hover:text-[#0F1F0F]"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiStats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      {/* Row 2: Bar + Conversion by Service */}
      <div className="grid lg:grid-cols-2 gap-4">
        <DailyBarChart />
        <ConversionByServiceChart />
      </div>

      {/* Row 3: Response Time + Funnel */}
      <div className="grid lg:grid-cols-2 gap-4">
        <ResponseTimeChart />
        <LeadFunnelChart />
      </div>

      {/* Row 4: Top performing days */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-[#E2EDE2] shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[#E2EDE2]">
          <h3 className="font-semibold text-[#0F1F0F]">
            Top Performing Days
          </h3>
          <p className="text-xs text-[#6B7B6B] mt-0.5">
            Performance breakdown for the last 7 days
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAF8] border-b border-[#E2EDE2]">
                {["Day", "Leads", "Converted", "Rate", "Bookings"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-[#6B7B6B] px-5 py-3 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockTopDays.map((row, i) => (
                <motion.tr
                  key={row.day}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                  className="border-b border-[#E2EDE2] hover:bg-green-50/40 transition-colors"
                >
                  <td className="px-5 py-3 text-sm font-medium text-[#0F1F0F]">
                    {row.day}
                  </td>
                  <td className="px-5 py-3 text-sm text-[#0F1F0F]">
                    {row.leads}
                  </td>
                  <td className="px-5 py-3 text-sm text-[#0F1F0F]">
                    {row.converted}
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm font-semibold text-[#16A34A]">
                      {row.rate}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-[#0F1F0F]">
                    {row.bookings}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
