"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockLeads } from "@/lib/mock-data";
import { timeAgo } from "@/lib/utils";
import { LeadStageBadge } from "@/components/dashboard/leads/LeadStageBadge";

interface LeadsTableProps {
  limit?: number;
  showViewAll?: boolean;
}

export function LeadsTable({ limit = 5, showViewAll = true }: LeadsTableProps) {
  const leads = mockLeads.slice(0, limit);

  return (
    <div className="bg-white rounded-xl border border-[#E2EDE2] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2EDE2]">
        <h3 className="font-semibold text-[#0F1F0F]">Recent Leads</h3>
        {showViewAll && (
          <Link
            href="/dashboard/leads"
            className="text-sm text-[#16A34A] font-medium hover:underline"
          >
            View All →
          </Link>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F8FAF8] border-b border-[#E2EDE2]">
              {["Name", "Phone", "Service", "Status", "Time", "Action"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-[#6B7B6B] px-4 py-3 uppercase tracking-wide"
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
                className="border-b border-[#E2EDE2] hover:bg-green-50/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${lead.avatarColor}`}
                    >
                      <span className="text-white text-xs font-bold">
                        {lead.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-[#0F1F0F]">
                      {lead.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-[#6B7B6B]">
                  {lead.phone}
                </td>
                <td className="px-4 py-3 text-sm text-[#0F1F0F]">
                  {lead.service}
                </td>
                <td className="px-4 py-3">
                  <LeadStageBadge stage={lead.stage} />
                </td>
                <td className="px-4 py-3 text-sm text-[#6B7B6B]">
                  {timeAgo(lead.lastActivity)}
                </td>
                <td className="px-4 py-3">
                  <Link href="/dashboard/conversations">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-[#6B7B6B] hover:text-[#16A34A]"
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
      </div>
    </div>
  );
}
