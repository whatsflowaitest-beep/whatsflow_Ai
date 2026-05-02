"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  FileText,
  HelpCircle,
  Type,
  Image as ImageIcon,
  FileUp,
  Search,
  MoreVertical,
  Trash2,
  Clock,
  Database,
  CheckCircle2,
  AlertCircle,
  Zap,
  LayoutGrid,
  List,
  Eye,
  Loader2
} from "lucide-react";
import { apiFetch } from "@/lib/api-config";
import { PageHeading } from "@/components/dashboard/PageHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type KnowledgeType = "pdf" | "faq" | "text" | "image";

interface KnowledgeSource {
  id: string;
  title: string;
  description: string;
  type: KnowledgeType;
  status: "synced" | "syncing" | "error";
  size?: string;
  itemCount?: number;
}

export default function KnowledgeBasePage() {
  const { toast } = useToast();
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<KnowledgeType | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    async function loadSources() {
      try {
        const data = await apiFetch('/api/knowledge');
        if (data && data.length > 0) {
          setSources(data);
        } else {
          setSources([
            {
              id: "k-1",
              title: "Product Catalog 2026",
              description: "Latest retail PDF containing stock levels, product parameters, and available variants.",
              type: "pdf",
              status: "synced",
              size: "2.4 MB"
            },
            {
              id: "k-2",
              title: "Service FAQs",
              description: "Common billing, return, and support inquiries frequently asked by clients.",
              type: "faq",
              status: "synced",
              itemCount: 42
            },
            {
              id: "k-3",
              title: "Company Policies",
              description: "Text source containing legal disclaimers and organizational standards.",
              type: "text",
              status: "synced",
              size: "12 KB"
            }
          ]);
        }
      } catch (err) {
        console.error("Failed to load knowledge sources:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSources();
  }, []);

  const filteredSources = sources.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || s.type === activeTab;
    return matchesSearch && matchesTab;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 text-[#22C55E] animate-spin" />
        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Syncing knowledge base...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeading
        title="Knowledge Base"
        count={sources.length}
        description="Train your AI on your specific business data. Upload documents, FAQs, and business details to improve accuracy."
        rightContent={
          <Button
            onClick={() => setAddOpen(true)}
            className="bg-[#22C55E] hover:bg-[#16A34A] text-white h-10 px-6 font-bold rounded-xl shadow-md active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Source
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Trained Assets" value={sources.length.toString()} icon={<Database className="w-4 h-4" />} color="text-blue-500" bg="bg-blue-50 dark:bg-blue-900/10" />
        <StatCard label="Last Training" value="Live" icon={<Clock className="w-4 h-4" />} color="text-purple-500" bg="bg-purple-50 dark:bg-purple-900/10" />
        <StatCard label="AI Accuracy" value="100%" icon={<CheckCircle2 className="w-4 h-4" />} color="text-green-500" bg="bg-green-50 dark:bg-green-900/10" />
        <StatCard label="Monthly Tokens" value="0" icon={<Zap className="w-4 h-4" />} color="text-amber-500" bg="bg-amber-50 dark:bg-amber-900/10" />
      </div>

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pt-2">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#9CA3AF]" />
          <Input
            placeholder="Search documents, questions, or labels..."
            className="pl-11 h-11 bg-white dark:bg-[#111827] border-[#E5E7EB] dark:border-[#1F2937] text-[#111827] dark:text-[#F9FAFB] rounded-xl font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full overflow-x-auto">
          <TabsList className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] h-11 p-1 rounded-xl w-full flex justify-start overflow-x-auto scrollbar-hide">
            <TabsTrigger value="all" className="rounded-xl px-5 text-xs font-bold data-[state=active]:bg-[#22C55E]/10 data-[state=active]:text-[#22C55E] shrink-0 text-[#6B7280] dark:text-[#9CA3AF]">All Assets</TabsTrigger>
            <TabsTrigger value="pdf" className="rounded-xl px-5 text-xs font-bold data-[state=active]:bg-[#22C55E]/10 data-[state=active]:text-[#22C55E] shrink-0 text-[#6B7280] dark:text-[#9CA3AF]">PDF Docs</TabsTrigger>
            <TabsTrigger value="faq" className="rounded-xl px-5 text-xs font-bold data-[state=active]:bg-[#22C55E]/10 data-[state=active]:text-[#22C55E] shrink-0 text-[#6B7280] dark:text-[#9CA3AF]">FAQs</TabsTrigger>
            <TabsTrigger value="text" className="rounded-xl px-5 text-xs font-bold data-[state=active]:bg-[#22C55E]/10 data-[state=active]:text-[#22C55E] shrink-0 text-[#6B7280] dark:text-[#9CA3AF]">Text</TabsTrigger>
            <TabsTrigger value="image" className="rounded-xl px-5 text-xs font-bold data-[state=active]:bg-[#22C55E]/10 data-[state=active]:text-[#22C55E] shrink-0 text-[#6B7280] dark:text-[#9CA3AF]">Images</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] p-1 rounded-xl shrink-0">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded-xl transition-all",
              viewMode === "grid" ? "bg-[#22C55E]/10 text-[#22C55E] shadow-sm" : "text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB]"
            )}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2 rounded-xl transition-all",
              viewMode === "list" ? "bg-[#22C55E]/10 text-[#22C55E] shadow-sm" : "text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB]"
            )}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {filteredSources.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredSources.map((source) => (
              <KnowledgeCard key={source.id} source={source} onAdd={() => setAddOpen(true)} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F9FAFB] dark:bg-[#0B0F1A] border-b border-[#E5E7EB] dark:border-[#1F2937]">
                    <th className="px-6 py-4 text-[11px] font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider w-1/3">Source Asset</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider">Size/Items</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1F2937]">
                  {filteredSources.map((source) => (
                    <KnowledgeListItem key={source.id} source={source} onAdd={() => setAddOpen(true)} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="py-24 flex flex-col items-center justify-center text-center bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-2xl p-6 transition-colors duration-300">
          <div className="w-16 h-16 rounded-2xl bg-[#F9FAFB] dark:bg-[#0B0F1A] flex items-center justify-center mb-4">
            <Database className="w-8 h-8 text-[#6B7280] dark:text-[#9CA3AF]" />
          </div>
          <h3 className="text-xl font-bold text-[#111827] dark:text-[#F9FAFB]">No assets found</h3>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-1 font-medium max-w-sm">Try searching for something else or add a new training asset.</p>
          <Button
            variant="outline"
            onClick={() => { setSearchQuery(""); setActiveTab("all"); }}
            className="mt-6 h-10 px-5 font-bold rounded-xl border-[#E5E7EB] dark:border-[#1F2937] text-[#6B7280] dark:text-[#9CA3AF]"
          >
            Clear Search & Filters
          </Button>
        </div>
      )}

      <AddKnowledgeModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}

function StatCard({ label, value, icon, color, bg }: { label: string; value: string; icon: React.ReactNode; color: string; bg: string }) {
  return (
    <div className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm flex items-center gap-4 transition-colors duration-300">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", bg, color)}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF]">{label}</p>
        <p className="text-lg font-bold text-[#111827] dark:text-[#F9FAFB]">{value}</p>
      </div>
    </div>
  );
}

function KnowledgeCard({ source, onAdd }: { source: KnowledgeSource; onAdd: () => void }) {
  const typeIcons: Record<KnowledgeType, { icon: any; color: string; bg: string }> = {
    pdf: { icon: FileText, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/10" },
    faq: { icon: HelpCircle, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/10" },
    text: { icon: Type, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/10" },
    image: { icon: ImageIcon, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/10" },
  };

  const { icon: Icon, color, bg } = typeIcons[source.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-2xl p-5 hover:border-[#22C55E]/30 shadow-sm transition-all duration-300 group hover:shadow-md"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", bg, color)}>
          <Icon className="w-6 h-6" />
        </div>
        <button className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB] p-1 rounded-xl hover:bg-[#F9FAFB] dark:hover:bg-[#0B0F1A]">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <h3 className="font-bold text-[#111827] dark:text-[#F9FAFB] mb-1 truncate group-hover:text-[#22C55E] transition-colors">{source.title}</h3>
      <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-medium leading-relaxed line-clamp-2 min-h-[2.5rem]">{source.description}</p>

      <div className="mt-4 pt-4 border-t border-[#E5E7EB] dark:border-[#1F2937] flex items-center justify-between">
        <div className="flex items-center gap-2">
          {source.status === "synced" ? (
            <span className="flex items-center gap-1 text-[10px] font-bold text-[#22C55E] bg-[#22C55E]/10 px-2.5 py-0.5 rounded-xl">
              <CheckCircle2 className="w-3 h-3" /> SYNCED
            </span>
          ) : source.status === "syncing" ? (
            <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/10 px-2.5 py-0.5 rounded-xl inline-flex">
              <div className="w-2.5 h-2.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /> SYNCING
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-900/10 px-2.5 py-0.5 rounded-xl">
              <AlertCircle className="w-3 h-3" /> ERROR
            </span>
          )}
          <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] font-medium">
            {source.size || (source.itemCount !== undefined ? `${source.itemCount} items` : "Processed")}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button className="text-[#22C55E] hover:bg-[#22C55E]/10 p-1.5 rounded-xl transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onAdd}
            className="text-[#22C55E] hover:bg-[#22C55E]/10 p-1.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function KnowledgeListItem({ source, onAdd }: { source: KnowledgeSource; onAdd: () => void }) {
  const typeIcons: Record<KnowledgeType, { icon: any; color: string; bg: string }> = {
    pdf: { icon: FileText, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/10" },
    faq: { icon: HelpCircle, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/10" },
    text: { icon: Type, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/10" },
    image: { icon: ImageIcon, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/10" },
  };

  const { icon: Icon, color, bg } = typeIcons[source.type];

  return (
    <tr className="group hover:bg-[#F9FAFB] dark:hover:bg-[#0B0F1A] transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", bg, color)}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[#111827] dark:text-[#F9FAFB] truncate group-hover:text-[#22C55E] transition-colors">{source.title}</p>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] truncate max-w-[240px]">{source.description}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-[10px] font-bold text-[#6B7280] dark:text-[#9CA3AF] bg-[#F9FAFB] dark:bg-[#0B0F1A] border border-[#E5E7EB] dark:border-[#1F2937] px-2 py-0.5 rounded-xl uppercase tracking-wider">
          {source.type}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-xs font-bold text-[#111827] dark:text-[#F9FAFB]">
          {source.size || (source.itemCount !== undefined ? `${source.itemCount} items` : "Processed")}
        </span>
      </td>
      <td className="px-6 py-4">
        {source.status === "synced" ? (
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#22C55E] transition-all">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /> SYNCED
          </span>
        ) : source.status === "syncing" ? (
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" /> SYNCING
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-600">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600" /> ERROR
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button className="p-2 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#22C55E] rounded-xl transition-all">
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onAdd}
            className="p-2 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#22C55E] rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-2 text-[#6B7280] dark:text-[#9CA3AF] hover:text-red-500 rounded-xl transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function AddKnowledgeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<KnowledgeType | null>(null);

  const types = [
    { id: "pdf", title: "Upload PDF", desc: "Product manuals, Docs, eBooks", icon: FileUp, color: "bg-red-50 dark:bg-red-900/10 text-red-500" },
    { id: "faq", title: "Add FAQs", desc: "Common Q&A pairs for quick info", icon: HelpCircle, color: "bg-amber-50 dark:bg-amber-900/10 text-amber-500" },
    { id: "text", title: "Raw Text", desc: "Company bio, services list, etc.", icon: Type, color: "bg-blue-50 dark:bg-blue-900/10 text-blue-500" },
    { id: "image", title: "Add Images", desc: "Menus, flowcharts, visual guides", icon: ImageIcon, color: "bg-purple-50 dark:bg-purple-900/10 text-purple-500" },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[580px] p-0 overflow-hidden bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] shadow-xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold text-[#111827] dark:text-[#F9FAFB]">Add Knowledge Source</DialogTitle>
          <DialogDescription className="text-sm text-[#6B7280] dark:text-[#9CA3AF] font-medium leading-relaxed">
            Choose a source type to train your AI on your business data.
          </DialogDescription>
        </DialogHeader>

        {!selectedType ? (
          <div className="p-6 grid grid-cols-2 gap-4">
            {types.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id as any)}
                className="flex flex-col items-center text-center p-6 bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] hover:border-[#22C55E]/40 hover:bg-[#F9FAFB] dark:hover:bg-[#0B0F1A] transition-all duration-300 group"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105 duration-300", t.color)}>
                  <t.icon className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-[#111827] dark:text-[#F9FAFB] mb-0.5 text-sm">{t.title}</h4>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-medium leading-relaxed">{t.desc}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-6 space-y-4 animate-in fade-in duration-300">
            <button
              onClick={() => setSelectedType(null)}
              className="text-xs font-bold text-[#22C55E] flex items-center gap-1 hover:underline mb-1"
            >
              ← Back to sources
            </button>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Source Name</label>
                <Input placeholder="Enter a descriptive name" className="rounded-xl bg-[#F9FAFB] dark:bg-[#0B0F1A] border-[#E5E7EB] dark:border-[#1F2937] text-[#111827] dark:text-[#F9FAFB]" />
              </div>

              {selectedType === "pdf" && (
                <div className="border-2 border-dashed border-[#E5E7EB] dark:border-[#1F2937] rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-[#F9FAFB] dark:bg-[#0B0F1A] hover:bg-white dark:hover:bg-[#111827] transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:text-[#22C55E]">
                    <Plus className="w-6 h-6 text-[#22C55E]" />
                  </div>
                  <p className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">Click to upload or drag & drop</p>
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1 font-medium">Maximum file size: 10MB (PDF only)</p>
                </div>
              )}

              {selectedType === "text" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Content</label>
                  <textarea
                    rows={5}
                    placeholder="Paste or type your information here..."
                    className="w-full rounded-xl bg-[#F9FAFB] dark:bg-[#0B0F1A] border border-[#E5E7EB] dark:border-[#1F2937] text-[#111827] dark:text-[#F9FAFB] p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 transition-all resize-none font-medium leading-relaxed"
                  />
                </div>
              )}

              {selectedType === "image" && (
                <div className="border-2 border-dashed border-[#E5E7EB] dark:border-[#1F2937] rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-[#F9FAFB] dark:bg-[#0B0F1A] hover:bg-white dark:hover:bg-[#111827] transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-full flex items-center justify-center shadow-sm mb-3">
                    <ImageIcon className="w-6 h-6 text-[#22C55E]" />
                  </div>
                  <p className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">Upload Image (JPEG, PNG, WEBP)</p>
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1 font-medium">Maximum file size: 5MB</p>
                </div>
              )}

              {selectedType === "faq" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Question</label>
                    <Input placeholder="e.g. What are your opening hours?" className="rounded-xl bg-[#F9FAFB] dark:bg-[#0B0F1A] border-[#E5E7EB] dark:border-[#1F2937] text-[#111827] dark:text-[#F9FAFB]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Answer</label>
                    <textarea
                      rows={3}
                      placeholder="Enter the automated response for this question..."
                      className="w-full rounded-xl bg-[#F9FAFB] dark:bg-[#0B0F1A] border border-[#E5E7EB] dark:border-[#1F2937] text-[#111827] dark:text-[#F9FAFB] p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 transition-all resize-none font-medium leading-relaxed"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E7EB] dark:border-[#1F2937] mt-2">
              <Button variant="ghost" onClick={onClose} className="text-[#6B7280] dark:text-[#9CA3AF] font-bold">Cancel</Button>
              <Button
                onClick={() => {
                  toast("Asset successfully queued for indexing", "success");
                  onClose();
                  setSelectedType(null);
                }}
                className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-6 font-bold rounded-xl shadow-md active:scale-95 transition-all"
              >
                Confirm & Sync
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
