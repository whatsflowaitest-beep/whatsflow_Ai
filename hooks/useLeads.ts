"use client";

import { useState, useCallback, useMemo } from "react";
import { mockLeads } from "@/lib/mock-data";
import type { Lead, LeadStage, LeadFormData, SortConfig } from "@/types/index";

const AVATAR_COLORS = [
  "bg-green-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-cyan-500",
];

function randomAvatarColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

export interface UseLeadsReturn {
  leads: Lead[];
  addLead: (data: LeadFormData) => Lead;
  updateLead: (id: string, data: LeadFormData) => void;
  moveLeadToStage: (id: string, stage: LeadStage) => void;
  deleteLead: (id: string) => void;
  bulkDelete: (ids: string[]) => void;
  // Filtered / sorted view
  filteredLeads: Lead[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeFilter: string;
  setActiveFilter: (f: string) => void;
  sortConfig: SortConfig;
  setSortConfig: (s: SortConfig) => void;
  // Selection
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  // Stage counts for filter tabs
  stageCounts: Record<string, number>;
}

export function useLeads(): UseLeadsReturn {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const addLead = useCallback((data: LeadFormData): Lead => {
    const newLead: Lead = {
      id: Date.now().toString(),
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim() || undefined,
      service: data.service,
      urgency: data.urgency as Lead["urgency"],
      stage: data.stage,
      source: data.source || "Other",
      assignedTo: data.assignedTo.trim() || undefined,
      notes: data.notes.trim() || undefined,
      avatarColor: randomAvatarColor(),
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    };
    setLeads((prev) => [newLead, ...prev]);
    return newLead;
  }, []);

  const updateLead = useCallback((id: string, data: LeadFormData): void => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id
          ? {
              ...lead,
              name: data.name.trim(),
              phone: data.phone.trim(),
              email: data.email.trim() || undefined,
              service: data.service,
              urgency: data.urgency as Lead["urgency"],
              stage: data.stage,
              source: data.source || lead.source,
              assignedTo: data.assignedTo.trim() || undefined,
              notes: data.notes.trim() || undefined,
              lastActivity: new Date().toISOString(),
            }
          : lead
      )
    );
  }, []);

  const moveLeadToStage = useCallback((id: string, stage: LeadStage): void => {
    setLeads(prev =>
      prev.map(l => l.id === id ? { ...l, stage, lastActivity: new Date().toISOString() } : l)
    );
  }, []);

  const deleteLead = useCallback((id: string): void => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const bulkDelete = useCallback((ids: string[]): void => {
    const idSet = new Set(ids);
    setLeads((prev) => prev.filter((l) => !idSet.has(l.id)));
    setSelectedIds(new Set());
  }, []);

  // ── SELECTION ─────────────────────────────────────────────────────────────
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // ── COMPUTED ──────────────────────────────────────────────────────────────
  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = { all: leads.length };
    leads.forEach((l) => {
      const key = l.stage.toLowerCase();
      counts[key] = (counts[key] ?? 0) + 1;
    });
    return counts;
  }, [leads]);

  const filteredLeads = useMemo(() => {
    let result = [...leads];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          l.service.toLowerCase().includes(q) ||
          l.stage.toLowerCase().includes(q) ||
          (l.email?.toLowerCase().includes(q) ?? false)
      );
    }

    // Stage filter
    if (activeFilter !== "all") {
      result = result.filter(
        (l) => l.stage.toLowerCase() === activeFilter.toLowerCase()
      );
    }

    // Sort
    if (sortConfig.key) {
      const key = sortConfig.key;
      result.sort((a, b) => {
        const av = a[key] ?? "";
        const bv = b[key] ?? "";
        const cmp = String(av).localeCompare(String(bv));
        return sortConfig.direction === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [leads, searchQuery, activeFilter, sortConfig]);

  return {
    leads,
    addLead,
    updateLead,
    moveLeadToStage,
    deleteLead,
    bulkDelete,
    filteredLeads,
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
  };
}
