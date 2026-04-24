"use client";

import { motion } from "framer-motion";
import { MessageSquare, CheckCircle2, MessagesSquare, CalendarCheck } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { LeadsTable } from "@/components/dashboard/LeadsTable";
import { LeadConversionsChart, LeadSourcesChart } from "@/components/dashboard/ChartCard";
import { mockConversations } from "@/lib/mock-data";
import { timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { PageHeading } from "@/components/dashboard/PageHeading";
import Link from "next/link";

const stats = [
  {
    label: "Total Leads",
    value: 142,
    subLabel: "+12 today",
    trend: "up" as const,
    trendValue: "↑ 8.5% from last week",
    icon: <MessageSquare className="w-4 h-4" />,
  },
  {
    label: "Converted",
    value: 89,
    subLabel: "62.7% conversion rate",
    trend: "up" as const,
    trendValue: "↑ 3.2% from last week",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  {
    label: "Active Chats",
    value: 7,
    subLabel: "Right now",
    trend: "neutral" as const,
    trendValue: "AI handling all",
    icon: <MessagesSquare className="w-4 h-4" />,
  },
  {
    label: "Booked Today",
    value: 11,
    subLabel: "Appointments",
    trend: "up" as const,
    trendValue: "↑ 2 from yesterday",
    icon: <CalendarCheck className="w-4 h-4" />,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeading 
        title="Performance Overview"
        description="Monitor your WhatsApp automation health, lead conversion metrics, and active conversations in real-time."
        rightContent={
          <div className="flex items-center gap-2 bg-white border border-[#E2EDE2] p-1 rounded-xl shadow-sm">
            <button className="px-4 py-1.5 bg-[#DCFCE7] text-[#16A34A] text-xs font-bold rounded-lg shadow-sm">Real-time</button>
            <button className="px-4 py-1.5 text-[#6B7B6B] text-xs font-bold hover:text-[#0F1F0F] transition-colors">Historical</button>
          </div>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <LeadConversionsChart />
        </div>
        <div>
          <LeadSourcesChart />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent Leads Table */}
        <div className="lg:col-span-2">
          <LeadsTable limit={5} showViewAll={true} />
        </div>

        {/* Active Conversations Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-[#E2EDE2] shadow-sm"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2EDE2]">
            <h3 className="font-semibold text-[#0F1F0F]">Active Chats</h3>
            <Link
              href="/dashboard/conversations"
              className="text-sm text-[#16A34A] font-medium hover:underline"
            >
              View All →
            </Link>
          </div>
          <div className="divide-y divide-[#E2EDE2]">
            {mockConversations.map((conv) => (
              <Link
                key={conv.id}
                href="/dashboard/conversations"
                className="flex items-start gap-3 px-5 py-4 hover:bg-[#F8FAF8] transition-colors"
              >
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                    <span className="text-[#16A34A] text-xs font-bold">
                      {conv.leadName.split(" ").map((n: string) => n[0]).join("")}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white",
                      conv.aiActive ? "bg-[#16A34A]" : "bg-orange-400"
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-semibold text-[#0F1F0F] truncate">
                      {conv.leadName}
                    </span>
                    <span className="text-[10px] text-[#6B7B6B] shrink-0 ml-2">
                      {timeAgo(conv.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7B6B] truncate">
                    {conv.lastMessage}
                  </p>
                  <p className="text-[10px] mt-0.5">
                    <span
                      className={cn(
                        "font-medium",
                        conv.aiActive ? "text-[#16A34A]" : "text-orange-500"
                      )}
                    >
                      {conv.aiActive ? "● AI Active" : "● Needs Attention"}
                    </span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
