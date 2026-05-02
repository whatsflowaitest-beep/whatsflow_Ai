"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-config";
import { timeAgo } from "@/lib/utils";
import { LeadStageBadge } from "@/components/dashboard/leads/LeadStageBadge";
import type { Lead } from "@/types/index";

interface LeadsTableProps {
  limit?: number;
  showViewAll?: boolean;
}

export function LeadsTable({ limit = 5, showViewAll = true }: LeadsTableProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeads() {
      try {
        const data = await apiFetch('/api/leads');
        setLeads(data.slice(0, limit));
      } catch (err) {
        console.error("Failed to load leads:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLeads();
  }, [limit]);

  return (
    <div className="bg-white dark:bg-[#111827] rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm overflow-hidden min-h-[300px] transition-colors duration-300">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] dark:border-[#1F2937]">
        <h3 className="font-semibold text-[#111827] dark:text-[#F9FAFB]">Recent Leads</h3>
        {showViewAll && (
          <Link
            href="/dashboard/leads"
            className="text-sm text-[#22C55E] font-medium hover:underline transition-colors"
          >
            View All →
          </Link>
        )}
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-6 h-6 text-[#22C55E] animate-spin" />
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">No leads found.</p>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Connect WhatsApp to start receiving leads.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-[#0B0F1A] border-b border-[#E5E7EB] dark:border-[#1F2937]">
                {["Name", "Phone", "Status", "Time", "Action"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] px-4 py-3 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, i) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                  className="border-b border-[#E5E7EB] dark:border-[#1F2937] hover:bg-[#F9FAFB] dark:hover:bg-[#0B0F1A] transition-colors duration-300"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#22C55E] flex items-center justify-center shrink-0 shadow-sm">
                        <span className="text-white text-xs font-bold">
                          {lead.name?.charAt(0) || "?"}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-[#111827] dark:text-[#F9FAFB]">
                        {lead.name || "New Contact"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                    {lead.phone}
                  </td>
                  <td className="px-4 py-3">
                    <LeadStageBadge stage={lead.stage as any} />
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                    {timeAgo(lead.updated_at || lead.created_at || lead.lastActivity || lead.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link href="/dashboard/conversations">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#22C55E] dark:hover:text-[#22C55E]"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        View Chat
                      </Button>
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
