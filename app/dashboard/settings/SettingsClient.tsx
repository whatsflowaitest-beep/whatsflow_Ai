"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, RefreshCw, Key, Download, CreditCard, User, Mail, Phone, Camera, ShieldCheck, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AutomationToggle } from "@/components/dashboard/AutomationToggle";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PageHeading } from "@/components/dashboard/PageHeading";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api-config";

function IntegrationCard({
  name,
  description,
  connected,
  detail,
  children,
}: {
  name: string;
  description: string;
  connected: boolean;
  detail?: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm p-6 flex flex-col gap-5 hover:border-[#22C55E]/30 transition-all group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-[#111827] dark:text-[#F9FAFB] text-base tracking-tight">{name}</h3>
            <span
              className={cn(
                "flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-xl uppercase tracking-wider border",
                connected
                  ? "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20"
                  : "bg-[#F9FAFB] dark:bg-[#0B0F1A] text-[#6B7280] dark:text-[#9CA3AF] border-[#E5E7EB] dark:border-[#1F2937]"
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full animate-pulse",
                  connected ? "bg-[#22C55E]" : "bg-gray-400"
                )}
              />
              {connected ? "Active" : "Disconnected"}
            </span>
          </div>
          <p className="text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">{description}</p>
          {detail && (
            <div className="mt-3 p-2.5 bg-[#F9FAFB] dark:bg-[#0B0F1A] rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] text-[10px] text-[#111827] dark:text-[#F9FAFB] font-bold font-mono">
              {detail}
            </div>
          )}
        </div>
      </div>
      <div className="mt-auto pt-2">
        {children}
      </div>
    </motion.div>
  );
}

const invoices = [
  { date: "Jan 13, 2026", amount: "$149.00", status: "Paid" },
  { date: "Dec 13, 2025", amount: "$149.00", status: "Paid" },
  { date: "Nov 13, 2025", amount: "$149.00", status: "Paid" },
];

export default function SettingsClient() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [config, setConfig] = useState({
    business_name: "SmilePlus Dental & Wellness",
    industry: "dental",
    whatsapp_number: "+1 (555) 000-1234",
    support_email: "ops@smileplus.com",
    full_name: "Admin User",
    personal_email: "admin@whatsflow.ai",
  });

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await apiFetch('/api/settings');
        if (data && data.id) {
          setConfig(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleUpdate = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await apiFetch('/api/settings', {
        method: 'POST',
        body: JSON.stringify(config)
      });
      toast("Infrastructure protocols updated ✓", "success");
    } catch (err) {
      toast("Failed to update settings", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-8 h-8 text-[#22C55E] animate-spin" />
        <p className="text-sm font-bold text-[#6B7280] dark:text-[#9CA3AF] animate-pulse">Synchronizing Core Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeading
        title="Settings"
        description="Manage your organizational infrastructure, high-fidelity integrations, and global billing protocols."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] p-1 h-auto rounded-xl shadow-sm inline-flex">
          {["general", "profile", "integrations", "notifications", "billing"].map((t) => (
            <TabsTrigger
              key={t}
              value={t}
              className="px-6 py-2.5 rounded-xl capitalize text-xs font-bold tracking-wide transition-all duration-200 data-[state=active]:bg-[#22C55E]/10 data-[state=active]:text-[#22C55E] text-[#6B7280] dark:text-[#9CA3AF]"
            >
              {t}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* GENERAL CONTENT */}
        <TabsContent value="general">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] p-8 shadow-sm transition-colors duration-300"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">
                  Organization DNA
                </h3>
                <p className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB] mt-1">Foundational Business Identity</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 text-[#22C55E] flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Business Name</Label>
                <Input
                  value={config.business_name}
                  onChange={e => handleUpdate("business_name", e.target.value)}
                  className="h-11 rounded-xl border-[#E5E7EB] dark:border-[#1F2937] text-[#111827] dark:text-[#F9FAFB] focus:border-[#22C55E] font-medium bg-[#F9FAFB] dark:bg-[#0B0F1A]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Industry Ecosystem</Label>
                <Select value={config.industry} onValueChange={v => handleUpdate("industry", v)}>
                  <SelectTrigger className="h-11 rounded-xl border-[#E5E7EB] dark:border-[#1F2937] text-[#111827] dark:text-[#F9FAFB] font-medium bg-[#F9FAFB] dark:bg-[#0B0F1A]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-[#111827] border-[#E5E7EB] dark:border-[#1F2937]">
                    <SelectItem value="dental">Health & Medical</SelectItem>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                    <SelectItem value="salon">Wellness & Spa</SelectItem>
                    <SelectItem value="physio">Professional Services</SelectItem>
                    <SelectItem value="online">SaaS / Digital</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Verified WhatsApp Number</Label>
                <Input
                  value={config.whatsapp_number}
                  onChange={e => handleUpdate("whatsapp_number", e.target.value)}
                  className="h-11 rounded-xl border-[#E5E7EB] dark:border-[#1F2937] text-[#111827] dark:text-[#F9FAFB] font-medium bg-[#F9FAFB] dark:bg-[#0B0F1A]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Support Email</Label>
                <Input
                  value={config.support_email}
                  onChange={e => handleUpdate("support_email", e.target.value)}
                  type="email"
                  className="h-11 rounded-xl border-[#E5E7EB] dark:border-[#1F2937] text-[#111827] dark:text-[#F9FAFB] font-medium bg-[#F9FAFB] dark:bg-[#0B0F1A]"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E5E7EB] dark:border-[#1F2937] flex justify-end">
              <Button
                onClick={saveSettings}
                disabled={saving}
                className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-8 h-11 rounded-xl font-bold shadow-md active:scale-95 transition-all"
              >
                {saving ? "Deploying..." : "Update Global Profile"}
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* PROFILE CONTENT */}
        <TabsContent value="profile">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] p-8 shadow-sm transition-colors duration-300">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="w-16 h-16 rounded-xl bg-[#22C55E] flex items-center justify-center text-white text-xl font-bold shadow-sm">
                    AU
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-1.5 bg-white dark:bg-[#0B0F1A] rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#22C55E] shadow-sm transition-all">
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#111827] dark:text-[#F9FAFB]">{config.full_name}</h3>
                  <p className="text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF]">Administrator • {config.personal_email}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#9CA3AF]" />
                    <Input
                      value={config.full_name}
                      onChange={e => handleUpdate("full_name", e.target.value)}
                      className="pl-11 h-11 rounded-xl border-[#E5E7EB] dark:border-[#1F2937] text-[#111827] dark:text-[#F9FAFB] font-medium bg-[#F9FAFB] dark:bg-[#0B0F1A]"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Personal Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#9CA3AF]" />
                    <Input
                      value={config.personal_email}
                      onChange={e => handleUpdate("personal_email", e.target.value)}
                      className="pl-11 h-11 rounded-xl border-[#E5E7EB] dark:border-[#1F2937] text-[#111827] dark:text-[#F9FAFB] font-medium bg-[#F9FAFB] dark:bg-[#0B0F1A]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E5E7EB] dark:border-[#1F2937] flex justify-end">
                <Button
                  onClick={saveSettings}
                  disabled={saving}
                  className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-8 h-11 rounded-xl font-bold shadow-md active:scale-95 transition-all"
                >
                  {saving ? "Saving..." : "Save Account Details"}
                </Button>
              </div>
            </div>

            <div className="bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] p-6 shadow-sm">
              <h3 className="text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider mb-5">Security & Access</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#F9FAFB] dark:bg-[#0B0F1A] rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
                    <span className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">Two-Factor Auth</span>
                  </div>
                  <Button variant="outline" className="h-9 rounded-xl text-xs font-bold border-[#E5E7EB] dark:border-[#1F2937]">ENABLE</Button>
                </div>
                <div className="p-4 bg-[#F9FAFB] dark:bg-[#0B0F1A] rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Lock className="w-5 h-5 text-[#22C55E]" />
                    <span className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">Update Password</span>
                  </div>
                  <Button variant="outline" className="h-9 rounded-xl text-xs font-bold border-[#E5E7EB] dark:border-[#1F2937]">CHANGE</Button>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* INTEGRATIONS */}
        <TabsContent value="integrations">
          <div className="grid sm:grid-cols-2 gap-5">
            <IntegrationCard
              name="WhatsApp Cloud API"
              description="Enterprise-grade connection to Meta's infrastructure."
              connected={true}
              detail="KEY: WA_ID_8842_PRIME"
            >
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="flex-1 h-10 rounded-xl text-xs font-bold border-[#E5E7EB] dark:border-[#1F2937] hover:bg-[#22C55E]/10 hover:text-[#22C55E]">
                  <RefreshCw className="w-3.5 h-3.5 mr-2" />
                  Rotate Tokens
                </Button>
                <Button variant="outline" size="sm" className="flex-1 h-10 rounded-xl text-xs font-bold border-[#E5E7EB] dark:border-[#1F2937]">
                  Cloud Logs
                </Button>
              </div>
            </IntegrationCard>

            <IntegrationCard
              name="OpenAI Intelligence"
              description="GPT-4o powers your context-aware automation engine."
              connected={true}
              detail="Deployment: Production-v4.2"
            >
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="flex-1 h-10 rounded-xl text-xs font-bold border-[#E5E7EB] dark:border-[#1F2937]">
                  <Key className="w-3.5 h-3.5 mr-2" />
                  API Vault
                </Button>
                <Button variant="outline" size="sm" className="flex-1 h-10 rounded-xl text-xs font-bold border-[#E5E7EB] dark:border-[#1F2937]">
                  Token Analysis
                </Button>
              </div>
            </IntegrationCard>

            <IntegrationCard
              name="Google Workspace"
              description="Real-time data synchronization with your spreadsheets."
              connected={true}
              detail='TARGET: /sheets/whatsapp_intelligence'
            >
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="flex-1 h-10 rounded-xl text-xs font-bold border-[#E5E7EB] dark:border-[#1F2937] hover:text-green-600">
                  <ExternalLink className="w-3.5 h-3.5 mr-2" />
                  Live View
                </Button>
                <Button variant="outline" size="sm" className="flex-1 h-10 rounded-xl text-xs font-bold border-[#E5E7EB] dark:border-[#1F2937]">
                  Resync
                </Button>
              </div>
            </IntegrationCard>

            <IntegrationCard
              name="Advanced Scheduling"
              description="Auto-transfer high-quality leads to Calendly booking."
              connected={false}
            >
              <Button
                className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white h-10 rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all"
                size="sm"
              >
                Activate Scheduler
              </Button>
            </IntegrationCard>
          </div>
        </TabsContent>

        {/* NOTIFICATIONS */}
        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] p-8 space-y-6 shadow-sm transition-colors duration-300"
          >
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">
                Alert Protocols
              </h3>
              <p className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB] mt-1">Real-time Intelligence Updates</p>
            </div>

            <div className="grid gap-4">
              {[
                { label: "Lead Acquisition", desc: "Notify when a high-intent lead initiates contact" },
                { label: "Successful Conversion", desc: "Alert when a booking is finalized by the AI" },
                { label: "Human Escalation", desc: "Instantly alert team for complex edge cases" },
                { label: "Daily ROI Analytics", desc: "Receive summary performance reports via email" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 px-6 rounded-xl bg-[#F9FAFB] dark:bg-[#0B0F1A] border border-[#E5E7EB] dark:border-[#1F2937] hover:border-[#22C55E]/30 transition-all">
                  <div>
                    <p className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">{item.label}</p>
                    <p className="text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">{item.desc}</p>
                  </div>
                  <AutomationToggle defaultChecked={true} label="" description="" />
                </div>
              ))}
            </div>

            <div className="space-y-1.5 pt-4 border-t border-[#E5E7EB] dark:border-[#1F2937]">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Alert Distribution Email</Label>
              <Input
                defaultValue="hq@whatsflow.ai"
                type="email"
                className="max-w-md h-11 rounded-xl border-[#E5E7EB] dark:border-[#1F2937] font-medium bg-[#F9FAFB] dark:bg-[#0B0F1A]"
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-8 h-11 rounded-xl font-bold shadow-md active:scale-95 transition-all">
                Deploy Preferences
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* BILLING */}
        <TabsContent value="billing">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] p-8 shadow-sm relative overflow-hidden transition-colors duration-300"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#22C55E]/5 rounded-full blur-3xl -mr-32 -mt-32" />

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-[#111827] dark:text-[#F9FAFB] tracking-tight">Active Subscription</h3>
                    <Badge className="bg-[#22C55E] text-white text-[10px] font-bold px-3 py-1 rounded-xl border-none">
                      SCALE PLAN
                    </Badge>
                  </div>

                  <div className="grid gap-1">
                    <p className="text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF]">MRR Contribution: <span className="text-[#111827] dark:text-[#F9FAFB] font-bold">$149.00 / month</span></p>
                    <p className="text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF]">Next Billing Event: <span className="text-[#111827] dark:text-[#F9FAFB] font-bold">Feb 13, 2026</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="outline" className="h-11 px-6 rounded-xl font-bold border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E]/10 shadow-sm transition-all active:scale-95">
                    Upgrade Intelligence
                  </Button>
                  <Button variant="ghost" className="h-11 px-6 rounded-xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all">
                    Terminate Plan
                  </Button>
                </div>
              </div>

              <div className="mt-8 p-5 bg-[#F9FAFB] dark:bg-[#0B0F1A] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl flex items-center justify-between border-dashed">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-black dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-lg flex items-center justify-center shadow-sm">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">Visa Platinum ···· 8842</p>
                    <p className="text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF]">Expires 08/2028</p>
                  </div>
                </div>
                <Button variant="outline" className="h-10 px-5 rounded-xl text-xs font-bold border-[#E5E7EB] dark:border-[#1F2937] bg-white dark:bg-[#111827]">
                  Update Vault
                </Button>
              </div>
            </motion.div>

            <div className="bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E5E7EB] dark:border-[#1F2937]">
                <h3 className="text-lg font-bold text-[#111827] dark:text-[#F9FAFB] tracking-tight">Financial Artifacts</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F9FAFB] dark:bg-[#0B0F1A] border-b border-[#E5E7EB] dark:border-[#1F2937]">
                      {["Billing Date", "Amount", "Current Status", ""].map((h) => (
                        <th
                          key={h}
                          className="text-left text-[10px] font-bold text-[#6B7280] dark:text-[#9CA3AF] px-6 py-3.5 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1F2937]">
                    {invoices.map((inv) => (
                      <tr
                        key={inv.date}
                        className="hover:bg-[#F9FAFB] dark:hover:bg-[#0B0F1A] transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">
                          {inv.date}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">
                          {inv.amount}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-xl bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-bold border border-[#22C55E]/15">
                            PROCESSED
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#22C55E] rounded-xl px-3"
                          >
                            <Download className="w-3.5 h-3.5 mr-2" />
                            GET RECEIPT
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
