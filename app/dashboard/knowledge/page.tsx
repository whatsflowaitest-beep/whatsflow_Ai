"use client";

import { useState } from "react";
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
  ExternalLink,
  Trash2,
  Clock,
  Database,
  CheckCircle2,
  AlertCircle,
  Zap
} from "lucide-react";
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
import type { KnowledgeSource, KnowledgeType } from "@/types/index";

const MOCK_SOURCES: KnowledgeSource[] = [
  {
    id: "1",
    type: "pdf",
    title: "Product_Manual_v2.pdf",
    description: "Detailed product features and specifications",
    status: "synced",
    lastUpdated: "2026-04-18T10:30:00Z",
    size: "2.4 MB"
  },
  {
    id: "2",
    type: "faq",
    title: "Customer_Support_FAQs",
    description: "Collection of common user questions and answers",
    status: "synced",
    lastUpdated: "2026-04-15T14:20:00Z",
    itemCount: 42
  },
  {
    id: "3",
    type: "text",
    title: "Company_Mission_Statement",
    description: "Our core values and long-term goals",
    status: "synced",
    lastUpdated: "2026-04-10T09:15:00Z"
  },
  {
    id: "4",
    type: "image",
    title: "Service_Menu_Prices.jpg",
    description: "Current service list and pricing structure for health clinic",
    status: "synced",
    lastUpdated: "2026-04-20T01:45:00Z",
    size: "1.4 MB"
  },
  {
    id: "5",
    type: "image",
    title: "Office_Hours_Holiday.png",
    description: "Visual schedule for upcoming public holidays",
    status: "syncing",
    lastUpdated: "2026-04-21T08:30:00Z",
    size: "450 KB"
  }
];

export default function KnowledgeBasePage() {
  const { toast } = useToast();
  const [sources, setSources] = useState<KnowledgeSource[]>(MOCK_SOURCES);
  const [addOpen, setAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<KnowledgeType | "all">("all");

  const filteredSources = sources.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || s.type === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-8">
      <PageHeading
        title="Knowledge Base"
        count={sources.length}
        description="Train your AI on your specific business data. Upload documents, FAQs, and business details to improve accuracy."
        rightContent={
          <Button
            onClick={() => setAddOpen(true)}
            className="bg-[#16A34A] hover:bg-[#15803D] text-white h-11 px-8 font-bold rounded-xl shadow-lg shadow-green-500/10"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Source
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Trained Assets" value="156" icon={<Database className="w-4 h-4" />} color="text-blue-600" bg="bg-blue-50" />
        <StatCard label="Last Training" value="2 mins ago" icon={<Clock className="w-4 h-4" />} color="text-purple-600" bg="bg-purple-50" />
        <StatCard label="AI Accuracy" value="98.5%" icon={<CheckCircle2 className="w-4 h-4" />} color="text-green-600" bg="bg-green-50" />
        <StatCard label="Monthly Tokens" value="45.2k" icon={<Zap className="w-4 h-4" />} color="text-amber-600" bg="bg-amber-50" />
      </div>

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pt-2">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7B6B]" />
          <Input
            placeholder="Search documents, questions, or labels..."
            className="pl-11 h-12 border-[#E2EDE2] rounded-xl font-medium shadow-sm transition-all focus:border-[#16A34A] focus:ring-[#16A34A]/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full overflow-x-auto">
          <TabsList className="bg-[#F8FAF8] border border-[#E2EDE2] h-12 p-1.5 rounded-xl w-full flex justify-start overflow-x-auto scrollbar-hide">
            <TabsTrigger value="all" className="rounded-lg px-6 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-[#16A34A] data-[state=active]:shadow-sm shrink-0">All Assets</TabsTrigger>
            <TabsTrigger value="pdf" className="rounded-lg px-6 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-[#16A34A] data-[state=active]:shadow-sm shrink-0">PDF Docs</TabsTrigger>
            <TabsTrigger value="faq" className="rounded-lg px-6 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-[#16A34A] data-[state=active]:shadow-sm shrink-0">FAQs</TabsTrigger>
            <TabsTrigger value="text" className="rounded-lg px-6 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-[#16A34A] data-[state=active]:shadow-sm shrink-0">Text</TabsTrigger>
            <TabsTrigger value="image" className="rounded-lg px-6 text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-[#16A34A] data-[state=active]:shadow-sm shrink-0">Images</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredSources.length > 0 ? (
          filteredSources.map((source) => (
            <KnowledgeCard key={source.id} source={source} />
          ))
        ) : (
          <div className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-white border border-dashed border-[#E2EDE2] rounded-[32px]">
            <div className="w-20 h-20 rounded-full bg-[#F8FAF8] flex items-center justify-center mb-6 shadow-inner">
              <Database className="w-10 h-10 text-[#6B7B6B]" />
            </div>
            <h3 className="text-xl font-bold text-[#0F1F0F]">No assets match your search</h3>
            <p className="text-sm text-[#6B7B6B] mt-2 max-w-sm leading-relaxed">
              We couldn&apos;t find any knowledge sources matching your current filters. Try searching for something else or add a new training asset.
            </p>
            <Button
              variant="outline"
              onClick={() => { setSearchQuery(""); setActiveTab("all"); }}
              className="mt-8 h-10 px-6 font-bold rounded-xl border-[#16A34A] text-[#16A34A] hover:bg-green-50"
            >
              Clear Search & Filters
            </Button>
          </div>
        )}
      </div>

      {/* Add Knowledge Modal */}
      <AddKnowledgeModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}

function StatCard({ label, value, icon, color, bg }: { label: string; value: string; icon: React.ReactNode; color: string; bg: string }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-[#E2EDE2] shadow-sm flex items-center gap-4">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", bg, color)}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-[#6B7B6B]">{label}</p>
        <p className="text-lg font-bold text-[#0F1F0F]">{value}</p>
      </div>
    </div>
  );
}

function KnowledgeCard({ source }: { source: KnowledgeSource }) {
  const typeIcons: Record<KnowledgeType, { icon: any; color: string; bg: string }> = {
    pdf: { icon: FileText, color: "text-red-500", bg: "bg-red-50" },
    faq: { icon: HelpCircle, color: "text-amber-500", bg: "bg-amber-50" },
    text: { icon: Type, color: "text-blue-500", bg: "bg-blue-50" },
    image: { icon: ImageIcon, color: "text-purple-500", bg: "bg-purple-50" },
  };

  const { icon: Icon, color, bg } = typeIcons[source.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-[#E2EDE2] rounded-2xl p-5 hover:border-[#16A34A]/30 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", bg, color)}>
          <Icon className="w-6 h-6" />
        </div>
        <button className="text-[#6B7B6B] hover:text-[#0F1F0F] p-1 rounded-md hover:bg-[#F8FAF8]">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <h3 className="font-bold text-[#0F1F0F] mb-1 truncate group-hover:text-[#16A34A] transition-colors">{source.title}</h3>
      <p className="text-xs text-[#6B7B6B] line-clamp-2 min-h-[2.5rem]">{source.description}</p>

      <div className="mt-5 pt-4 border-t border-[#F0F7F0] flex items-center justify-between">
        <div className="flex items-center gap-2">
          {source.status === "synced" ? (
            <span className="flex items-center gap-1 text-[10px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> SYNCED
            </span>
          ) : source.status === "syncing" ? (
            <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-flex">
              <div className="w-2.5 h-2.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /> SYNCING
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              <AlertCircle className="w-3 h-3" /> ERROR
            </span>
          )}
          <span className="text-[10px] text-[#6B7B6B] font-medium">
            {source.size || `${source.itemCount} items`}
          </span>
        </div>
        <button className="text-[#16A34A] hover:bg-[#F0F7F0] p-1.5 rounded-lg transition-colors">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function AddKnowledgeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<KnowledgeType | null>(null);

  const types = [
    { id: "pdf", title: "Upload PDF", desc: "Product manuals, Docs, eBooks", icon: FileUp, color: "bg-red-50 text-red-500" },
    { id: "faq", title: "Add FAQs", desc: "Common Q&A pairs for quick info", icon: HelpCircle, color: "bg-amber-50 text-amber-500" },
    { id: "text", title: "Raw Text", desc: "Company bio, services list, etc.", icon: Type, color: "bg-blue-50 text-blue-500" },
    { id: "image", title: "Add Images", desc: "Menus, flowcharts, visual guides", icon: ImageIcon, color: "bg-purple-50 text-purple-500" },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold text-[#0F1F0F]">Add Knowledge Source</DialogTitle>
          <DialogDescription className="text-[#6B7B6B]">
            Choose a source type to train your AI on your business data.
          </DialogDescription>
        </DialogHeader>

        {!selectedType ? (
          <div className="p-6 grid grid-cols-2 gap-4">
            {types.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id as any)}
                className="flex flex-col items-center text-center p-6 rounded-2xl border border-[#E2EDE2] hover:border-[#16A34A] hover:bg-[#F8FAF8] transition-all group"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", t.color)}>
                  <t.icon className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-[#0F1F0F] mb-1">{t.title}</h4>
                <p className="text-xs text-[#6B7B6B]">{t.desc}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-6 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button
              onClick={() => setSelectedType(null)}
              className="text-xs font-bold text-[#16A34A] flex items-center gap-1 hover:underline mb-2"
            >
              ← Back to sources
            </button>

            {/* Conditional Form based on type */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#0F1F0F]">Source Name</label>
                <Input placeholder="Enter a descriptive name" className="rounded-xl border-[#E2EDE2]" />
              </div>

              {selectedType === "pdf" && (
                <div className="border-2 border-dashed border-[#E2EDE2] rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-[#F8FAF8] hover:bg-white transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:text-[#16A34A]">
                    <Plus className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-[#0F1F0F]">Click to upload or drag & drop</p>
                  <p className="text-xs text-[#6B7B6B] mt-1">Maximum file size: 10MB (PDF only)</p>
                </div>
              )}

              {selectedType === "text" && (
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#0F1F0F]">Content</label>
                  <textarea
                    rows={6}
                    placeholder="Paste or type your information here..."
                    className="w-full rounded-xl border border-[#E2EDE2] p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 transition-all resize-none"
                  />
                </div>
              )}

              {selectedType === "image" && (
                <div className="border-2 border-dashed border-[#E2EDE2] rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-[#F8FAF8] hover:bg-white transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:text-[#16A34A]">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-[#0F1F0F]">Upload Image (JPEG, PNG, WEBP)</p>
                  <p className="text-xs text-[#6B7B6B] mt-1">Maximum file size: 5MB</p>
                  <div className="mt-4 p-2 bg-blue-50 rounded-lg text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                    Processing coming in next update
                  </div>
                </div>
              )}

              {selectedType === "faq" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#0F1F0F]">Question</label>
                    <Input placeholder="e.g. What are your opening hours?" className="rounded-xl border-[#E2EDE2]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#0F1F0F]">Answer</label>
                    <textarea
                      rows={4}
                      placeholder="Enter the automated response for this question..."
                      className="w-full rounded-xl border border-[#E2EDE2] p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 transition-all resize-none"
                    />
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-amber-500 shadow-sm">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <p className="text-[11px] text-amber-700 font-medium italic">
                      Individual Q&A syncing is active. Bulk FAQ import coming in the next update.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0F7F0]">
              <Button variant="ghost" onClick={onClose} className="text-[#6B7B6B] font-bold">Cancel</Button>
              <Button
                onClick={() => {
                  toast("Asset successfully queued for indexing", "success");
                  onClose();
                  setSelectedType(null);
                }}
                className="bg-[#16A34A] hover:bg-[#15803D] text-white px-8 font-bold rounded-xl shadow-lg shadow-green-500/10"
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
