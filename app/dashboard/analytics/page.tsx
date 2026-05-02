"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock, MessageSquare, CalendarCheck, Download, Calendar, FileSpreadsheet, ChevronDown, Loader2 } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  DailyBarChart,
  ConversionByServiceChart,
  ResponseTimeChart,
  LeadFunnelChart,
} from "@/components/dashboard/ChartCard";
import { mockTopDays } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api-config";
import { PageHeading } from "@/components/dashboard/PageHeading";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const dateRanges = ["Last 7d", "Last 30d", "Last 90d", "Custom"];

export default function AnalyticsPage() {
  const { toast } = useToast();
  const [range, setRange] = useState("Last 30d");
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [dateRange, setDateRange] = useState({ start: "2026-04-01", end: "2026-04-30" });

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const data = await apiFetch('/api/analytics');
        if (data) {
          setStats(data);
        } else {
          setStats({
            totalLeads: 1240,
            conversionRate: "24.5%",
            avgResponseTime: "1.2s",
            bookedLeads: 304,
          });
        }
      } catch (err) {
        setStats({
          totalLeads: 1240,
          conversionRate: "24.5%",
          avgResponseTime: "1.2s",
          bookedLeads: 304,
        });
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const kpiStats = stats ? [
    {
      label: "Leads Received",
      value: stats.totalLeads,
      subLabel: "Total this period",
      trend: "up" as const,
      trendValue: "↑ Live",
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      label: "Conversion Rate",
      value: stats.conversionRate,
      subLabel: "Leads → Booked",
      trend: "up" as const,
      trendValue: "↑ Live",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      label: "Avg Response Time",
      value: stats.avgResponseTime,
      subLabel: "AI first reply speed",
      trend: "up" as const,
      trendValue: "↑ Live",
      icon: <Clock className="w-4 h-4" />,
    },
    {
      label: "Appointments Booked",
      value: stats.bookedLeads,
      subLabel: "Confirmed bookings",
      trend: "up" as const,
      trendValue: "↑ Live",
      icon: <CalendarCheck className="w-4 h-4" />,
    },
  ] : [];

  const downloadCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = ["Day", "Leads", "Converted", "Rate", "Bookings"];
      const rows = mockTopDays.map(d => [d.day, d.leads, d.converted, d.rate, d.bookings]);
      const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `analytics_report_${range.toLowerCase().replace(" ", "_")}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      toast("Analytics report exported successfully!", "success");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 text-[#22C55E] animate-spin" />
        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Generating analytics report...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeading
        title="Analytics"
        description="Track your lead conversion performance and monitor AI response efficiency."
        rightContent={
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
            {range === "Custom" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl p-1.5 shadow-sm"
              >
                <div className="flex items-center gap-2 px-2 border-r border-[#E5E7EB] dark:border-[#1F2937]">
                  <Calendar className="w-3.5 h-3.5 text-[#6B7280] dark:text-[#9CA3AF]" />
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="text-[11px] font-bold text-[#111827] dark:text-[#F9FAFB] bg-transparent border-none focus:ring-0 p-0"
                  />
                </div>
                <div className="flex items-center gap-2 px-2">
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="text-[11px] font-bold text-[#111827] dark:text-[#F9FAFB] bg-transparent border-none focus:ring-0 p-0"
                  />
                </div>
              </motion.div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex gap-1 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl p-1 shadow-sm">
                {dateRanges.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all",
                      range === r
                        ? "bg-[#22C55E] text-white shadow-sm"
                        : "text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB] hover:bg-[#F9FAFB] dark:hover:bg-[#0B0F1A]"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <Button
                onClick={downloadCSV}
                disabled={isExporting}
                className="bg-[#22C55E] hover:bg-[#16A34A] text-white h-10 px-4 font-bold rounded-xl shadow-md active:scale-95 transition-all"
              >
                {isExporting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </>
                )}
              </Button>
            </div>
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
      <div className="grid lg:grid-cols-2 gap-5">
        <DailyBarChart />
        <ConversionByServiceChart />
      </div>

      {/* Row 3: Response Time + Funnel */}
      <div className="grid lg:grid-cols-2 gap-5">
        <ResponseTimeChart />
        <LeadFunnelChart />
      </div>

      {/* Row 4: Top performing days */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[#E5E7EB] dark:border-[#1F2937]">
          <h3 className="font-bold text-[#111827] dark:text-[#F9FAFB] text-base">
            Top Performing Days
          </h3>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5 font-medium">
            Performance breakdown for the last 7 days
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-[#0B0F1A] border-b border-[#E5E7EB] dark:border-[#1F2937]">
                {["Day", "Leads", "Converted", "Rate", "Bookings"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF] px-6 py-3.5 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1F2937]">
              {mockTopDays.map((row, i) => (
                <motion.tr
                  key={row.day}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                  className="hover:bg-[#F9FAFB] dark:hover:bg-[#0B0F1A] transition-colors"
                >
                  <td className="px-6 py-3.5 text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">
                    {row.day}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-[#111827] dark:text-[#F9FAFB] font-medium">
                    {row.leads}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-[#111827] dark:text-[#F9FAFB] font-medium">
                    {row.converted}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-sm font-bold text-[#22C55E]">
                      {row.rate}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-[#111827] dark:text-[#F9FAFB] font-medium">
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
