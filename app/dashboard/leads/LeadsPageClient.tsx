"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Plus, Download } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddLeadModal } from "@/components/dashboard/leads/AddLeadModal";
import { EditLeadModal } from "@/components/dashboard/leads/EditLeadModal";
import { ViewLeadDrawer } from "@/components/dashboard/leads/ViewLeadDrawer";
import { DeleteLeadDialog } from "@/components/dashboard/leads/DeleteLeadDialog";
import { LeadsTable } from "@/components/dashboard/leads/LeadsTable";
import { useLeads } from "@/hooks/useLeads";
import { useNotificationsContext } from "@/context/NotificationsContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PageHeading } from "@/components/dashboard/PageHeading";
import type { Lead, LeadFormData, LeadStage, SortConfig } from "@/types/index";

const STAGE_FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "qualifying", label: "Qualifying" },
  { key: "qualified", label: "Qualified" },
  { key: "booked", label: "Booked" },
  { key: "lost", label: "Lost" },
];

export default function LeadsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewLeadId = searchParams.get("view");
  const { toast } = useToast();

  const {
    filteredLeads,
    addLead,
    updateLead,
    deleteLead,
    bulkDelete,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    sortConfig,
    setSortConfig,
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    stageCounts,
    leads,
  } = useLeads();

  const { addNotification } = useNotificationsContext();

  // ── Modal/drawer state ────────────────────────────────────────────────────
  const [addOpen, setAddOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [page, setPage] = useState(0);

  // ── Open lead drawer from URL param (notification click) ─────────────────
  useEffect(() => {
    if (viewLeadId) {
      const lead = leads.find((l) => l.id === viewLeadId);
      if (lead) {
        setViewLead(lead);
      }
      // Clean URL without navigation
      router.replace("/dashboard/leads", { scroll: false });
    }
  }, [viewLeadId, leads, router]);

  // Reset to page 0 on filter/search change
  useEffect(() => {
    setPage(0);
  }, [searchQuery, activeFilter]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  function handleAddLead(data: LeadFormData) {
    const newLead = addLead(data);
    addNotification({
      type: "new_lead",
      title: "New lead received",
      body: `${newLead.name} added for ${newLead.service}`,
      time: new Date().toISOString(),
      read: false,
      actionLeadId: newLead.id,
    });
    toast("Lead added successfully ✓", "success");
  }

  function handleUpdateLead(id: string, data: LeadFormData) {
    updateLead(id, data);
    toast("Lead updated successfully ✓", "success");
    // Refresh viewLead if drawer is open
    if (viewLead?.id === id) {
      const updated = leads.find(l => l.id === id); 
      setViewLead(prev => prev ? {...prev, ...data, urgency: data.urgency as Lead['urgency']} : null);
    }
  }

  function handleDeleteLead() {
    if (!deletingLead) return;
    deleteLead(deletingLead.id);
    if (viewLead?.id === deletingLead.id) setViewLead(null);
    setDeletingLead(null);
    toast("Lead deleted", "error");
  }

  function handleBulkDelete() {
    bulkDelete([...Array.from(selectedIds)]);
    setBulkDeleteOpen(false);
    toast(`${selectedIds.size} leads deleted`, "error");
  }

  function handleSort(key: keyof Lead) {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    });
  }

  function handleClearFilters() {
    setSearchQuery("");
    setActiveFilter("all");
  }

  return (
    <div className="space-y-6">
      <PageHeading 
        title="Leads Management"
        count={leads.length}
        description="Track and manage your WhatsApp leads in real-time"
        rightContent={
          <>
            <Button
              variant="outline"
              className="h-10 text-[#6B7B6B] border-[#E2EDE2] font-semibold"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              className="bg-[#16A34A] hover:bg-[#15803D] text-white h-10 px-6 font-bold shadow-sm shadow-[#16A34A]/20"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Lead
            </Button>
          </>
        }
      />

      {/* Search + Stage Filters */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7B6B] pointer-events-none" />
          <Input
            placeholder="Search by name, phone, service..."
            className="pl-10 h-11 border-[#E2EDE2] focus-visible:ring-[#16A34A]/20 focus-visible:border-[#16A34A] rounded-xl font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {STAGE_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={cn(
                "flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap transition-all border shrink-0",
                activeFilter === f.key
                  ? "bg-[#16A34A] text-white border-[#16A34A] shadow-md shadow-[#16A34A]/10"
                  : "bg-white border-[#E2EDE2] text-[#6B7B6B] hover:border-[#16A34A] hover:text-[#0F1F0F]"
              )}
            >
              {f.label}
              <span
                className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-lg",
                  activeFilter === f.key
                    ? "bg-white/20 text-white"
                    : "bg-[#F0F7F0] text-[#16A34A]"
                )}
              >
                {f.key === "all" ? leads.length : stageCounts[f.key] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <LeadsTable
        leads={filteredLeads}
        page={page}
        setPage={setPage}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        selectAll={selectAll}
        clearSelection={clearSelection}
        sortConfig={sortConfig}
        onSort={handleSort}
        onView={(lead) => setViewLead(lead)}
        onEdit={(lead) => setEditLead(lead)}
        onDelete={(lead) => setDeletingLead(lead)}
        onBulkDelete={() => setBulkDeleteOpen(true)}
        onClearFilters={handleClearFilters}
        onAddLead={() => setAddOpen(true)}
      />

      {/* Modals & Drawers */}
      <AddLeadModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAddLead}
      />

      <EditLeadModal
        open={!!editLead}
        lead={editLead}
        onClose={() => setEditLead(null)}
        onSave={handleUpdateLead}
      />

      <ViewLeadDrawer
        lead={viewLead}
        open={!!viewLead}
        onClose={() => setViewLead(null)}
        onEdit={(lead) => {
          setViewLead(null);
          setEditLead(lead);
        }}
        onDelete={(lead) => {
          setViewLead(null);
          setDeletingLead(lead);
        }}
      />

      <DeleteLeadDialog
        open={!!deletingLead && !bulkDeleteOpen}
        leadName={deletingLead?.name ?? null}
        onClose={() => setDeletingLead(null)}
        onConfirm={handleDeleteLead}
      />

      <DeleteLeadDialog
        open={bulkDeleteOpen}
        leadName={null}
        leadCount={selectedIds.size}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
      />
    </div>
  );
}
