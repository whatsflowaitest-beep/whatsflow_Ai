"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Pencil,
  Trash2,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  Download,
  Users,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadStageBadge } from "./LeadStageBadge";
import { LeadUrgencyBadge } from "./LeadUrgencyBadge";
import { timeAgo, cn } from "@/lib/utils";
import type { Lead, SortConfig } from "@/types/index";

const COLUMNS: { key: keyof Lead | "actions"; label: string; sortable?: boolean }[] = [
  { key: "name", label: "Avatar + Name", sortable: true },
  { key: "phone", label: "Phone" },
  { key: "service", label: "Service", sortable: true },
  { key: "urgency", label: "Urgency", sortable: true },
  { key: "stage", label: "Stage", sortable: true },
  { key: "source", label: "Source", sortable: true },
  { key: "lastActivity", label: "Last Activity", sortable: true },
  { key: "actions", label: "Actions" },
];

const PAGE_SIZE = 10;

interface Props {
  leads: Lead[];
  page: number;
  setPage: (p: number) => void;
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  sortConfig: SortConfig;
  onSort: (key: keyof Lead) => void;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onBulkDelete: () => void;
  onClearFilters: () => void;
  onAddLead: () => void;
}

export function LeadsTable({
  leads,
  page,
  setPage,
  selectedIds,
  toggleSelect,
  selectAll,
  clearSelection,
  sortConfig,
  onSort,
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
  onClearFilters,
  onAddLead,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(leads.length / PAGE_SIZE));
  const paged = leads.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const allPageSelected =
    paged.length > 0 && paged.every((l) => selectedIds.has(l.id));
  const somePageSelected =
    paged.some((l) => selectedIds.has(l.id)) && !allPageSelected;

  function handleToggleAll() {
    if (allPageSelected) {
      const next = new Set(selectedIds);
      paged.forEach((l) => next.delete(l.id));
      selectAll(Array.from(next));
    } else {
      selectAll([...Array.from(selectedIds), ...paged.map((l) => l.id)]);
    }
  }

  function SortIcon({ colKey }: { colKey: keyof Lead }) {
    if (sortConfig.key !== colKey) return <ChevronsUpDown className="w-3 h-3 opacity-30 ml-1" />;
    return sortConfig.direction === "asc"
      ? <ChevronUp className="w-3 h-3 ml-1 text-[#16A34A]" />
      : <ChevronDown className="w-3 h-3 ml-1 text-[#16A34A]" />;
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E2EDE2] shadow-sm overflow-hidden min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center p-12 text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-[#F0F7F0] flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-[#6B7B6B]" />
          </div>
          <h3 className="text-lg font-bold text-[#0F1F0F]">No leads found</h3>
          <p className="text-sm text-[#6B7B6B] mt-2 mb-8">
            Try adjusting your search or filters to see more results.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={onClearFilters} className="h-10 px-4 font-medium">
              Clear Filters
            </Button>
            <Button onClick={onAddLead} className="h-10 px-6 font-medium bg-[#16A34A] hover:bg-[#15803D] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Lead
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk action bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="flex items-center justify-between bg-white border border-[#16A34A]/30 rounded-xl px-5 py-3 shadow-lg shadow-[#16A34A]/5 ring-1 ring-[#16A34A]/5"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#16A34A] flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-[#16A34A]/20">
                {selectedIds.size}
              </div>
              <span className="text-sm font-semibold text-[#0F1F0F]">
                leads selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[#6B7B6B] h-9 px-4 font-medium"
                onClick={clearSelection}
              >
                Clear Selection
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 px-4 text-[#0F1F0F] font-medium border-[#E2EDE2]"
              >
                <Download className="w-3.5 h-3.5 mr-2" />
                Export Selected
              </Button>
              <Button
                variant="default"
                size="sm"
                className="h-9 px-4 bg-red-500 hover:bg-red-600 text-white border-none font-semibold shadow-sm shadow-red-500/10"
                onClick={onBulkDelete}
              >
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                Delete Selected
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-[#E2EDE2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAF8] border-b border-[#E2EDE2]">
                <th className="px-5 py-4 w-12">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-[#E2EDE2] accent-[#16A34A] cursor-pointer outline-none focus:ring-2 focus:ring-[#16A34A]/20 transition-all"
                    checked={allPageSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = somePageSelected;
                    }}
                    onChange={handleToggleAll}
                  />
                </th>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-3 py-4 text-[11px] font-bold text-[#6B7B6B] uppercase tracking-wider whitespace-nowrap",
                      col.sortable && "cursor-pointer select-none hover:text-[#16A34A] transition-colors"
                    )}
                    onClick={() => col.sortable && col.key !== "actions" && onSort(col.key as keyof Lead)}
                  >
                    <div className="flex items-center">
                      {col.label}
                      {col.sortable && col.key !== "actions" && (
                        <SortIcon colKey={col.key as keyof Lead} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F7F0]">
              {paged.map((lead, i) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={cn(
                    "group transition-all duration-150",
                    selectedIds.has(lead.id) ? "bg-[#F0F7F0]/60" : "hover:bg-[#F8FAF8]/80"
                  )}
                >
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-[#E2EDE2] accent-[#16A34A] cursor-pointer outline-none focus:ring-2 focus:ring-[#16A34A]/20 transition-all"
                      checked={selectedIds.has(lead.id)}
                      onChange={() => toggleSelect(lead.id)}
                    />
                  </td>

                  {/* Avatar + Name */}
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm border-2 border-white", lead.avatarColor)}>
                        <span className="text-white text-xs font-bold leading-none">
                          {lead.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <button 
                          onClick={() => onView(lead)}
                          className="text-sm font-semibold text-[#0F1F0F] hover:text-[#16A34A] transition-colors block truncate"
                        >
                          {lead.name}
                        </button>
                        <p className="text-[11px] text-[#6B7B6B] truncate">
                          {lead.createdAt ? `Added ${formatDateShort(lead.createdAt)}` : "New lead"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="px-3 py-4 text-sm text-[#0F1F0F] font-medium whitespace-nowrap">
                    {lead.phone}
                  </td>

                  {/* Service */}
                  <td className="px-3 py-4 text-sm text-[#0F1F0F] whitespace-nowrap">
                    {lead.service}
                  </td>

                  {/* Urgency */}
                  <td className="px-3 py-4">
                    <LeadUrgencyBadge urgency={lead.urgency} />
                  </td>

                  {/* Stage */}
                  <td className="px-3 py-4">
                    <LeadStageBadge stage={lead.stage} />
                  </td>

                  {/* Source */}
                  <td className="px-3 py-4 text-sm text-[#6B7B6B] whitespace-nowrap">
                    {lead.source}
                  </td>

                  {/* Last Activity */}
                  <td className="px-3 py-4 text-sm text-[#6B7B6B] whitespace-nowrap">
                    {timeAgo(lead.lastActivity)}
                  </td>

                  {/* Actions — visible on row hover */}
                  <td className="px-3 py-4 text-right">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#6B7B6B] hover:text-[#16A34A] hover:bg-green-50 rounded-lg transition-all"
                        onClick={() => onView(lead)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#6B7B6B] hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        onClick={() => onEdit(lead)}
                        title="Edit Lead"
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#6B7B6B] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        onClick={() => onDelete(lead)}
                        title="Delete Lead"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F8FAF8] border-t border-[#E2EDE2]">
          <span className="text-xs font-semibold text-[#6B7B6B]">
            Showing <span className="text-[#0F1F0F]">{page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, leads.length)}</span> of <span className="text-[#0F1F0F]">{leads.length}</span> leads
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="h-8 px-3 text-xs font-bold border-[#E2EDE2] hover:bg-white transition-all disabled:opacity-40"
            >
              Prev
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant={page === i ? "default" : "ghost"}
                  onClick={() => setPage(i)}
                  className={cn(
                    "h-8 w-8 p-0 text-xs font-bold transition-all",
                    page === i 
                      ? "bg-[#16A34A] hover:bg-[#15803D] text-white shadow-sm ring-1 ring-[#16A34A]/20" 
                      : "text-[#6B7B6B] hover:text-[#0F1F0F] hover:bg-white"
                  )}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages - 1}
              onClick={() => setPage(page + 1)}
              className="h-8 px-3 text-xs font-bold border-[#E2EDE2] hover:bg-white transition-all disabled:opacity-40"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDateShort(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
