"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, RefreshCw, Key, Download, CreditCard } from "lucide-react";
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
        className="bg-white rounded-[24px] border border-[#E2EDE2]/60 shadow-premium p-6 flex flex-col gap-5 hover:border-[#16A34A]/30 transition-all group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-extrabold text-[#0F1F0F] text-base tracking-tight">{name}</h3>
            <span
              className={cn(
                "flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border",
                connected
                  ? "bg-[#DCFCE7] text-[#16A34A] border-[#16A34A]/20"
                  : "bg-gray-100 text-[#6B7B6B] border-gray-200"
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full animate-pulse",
                  connected ? "bg-[#16A34A]" : "bg-gray-400"
                )}
              />
              {connected ? "Active" : "Disconnected"}
            </span>
          </div>
          <p className="text-xs font-semibold text-[#6B7B6B] leading-relaxed">{description}</p>
          {detail && (
            <div className="mt-3 p-2.5 bg-[#F8FAF8] rounded-xl border border-[#E2EDE2]/40 text-[10px] text-[#0F1F0F] font-bold font-mono">
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

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-8 pb-12">
      <PageHeading 
        title="Settings"
        description="Manage your organizational infrastructure, high-fidelity integrations, and global billing protocols."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-white border border-[#E2EDE2]/60 p-1.5 h-auto rounded-[20px] shadow-sm inline-flex">
          {["general", "integrations", "notifications", "billing"].map((t) => (
            <TabsTrigger
              key={t}
              value={t}
              className="px-8 py-2.5 rounded-xl capitalize text-[11px] font-extrabold tracking-[0.1em] transition-all data-[state=active]:bg-[#16A34A] data-[state=active]:text-white data-[state=active]:shadow-lg shadow-green-500/10"
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
            className="bg-white rounded-[24px] border border-[#E2EDE2]/60 shadow-premium p-8"
          >
            <div className="flex items-center justify-between mb-10">
                <div>
                   <h3 className="text-xl font-extrabold text-[#0F1F0F] tracking-tight uppercase tracking-[0.1em] text-xs text-[#6B7B6B]">
                    Organization DNA
                    </h3>
                    <p className="text-sm font-bold text-[#0F1F0F] mt-1">Foundational Business Identity</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#F0F7F0] flex items-center justify-center text-[#16A34A]">
                    <RefreshCw className="w-5 h-5" />
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-2.5">
                <Label className="text-[10px] font-extrabold uppercase tracking-widest text-[#6B7B6B] ml-1">Business Name</Label>
                <Input defaultValue="SmilePlus Dental & Wellness" className="h-12 rounded-xl border-[#E2EDE2] focus:border-[#16A34A] font-semibold bg-[#F8FAF8]/30" />
              </div>
              <div className="space-y-2.5">
                <Label className="text-[10px] font-extrabold uppercase tracking-widest text-[#6B7B6B] ml-1">Industry Ecosystem</Label>
                <Select defaultValue="dental">
                  <SelectTrigger className="h-12 rounded-xl border-[#E2EDE2] font-semibold bg-[#F8FAF8]/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="dental">Health & Medical</SelectItem>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                    <SelectItem value="salon">Wellness & Spa</SelectItem>
                    <SelectItem value="physio">Professional Services</SelectItem>
                    <SelectItem value="online">SaaS / Digital</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2.5">
                <Label className="text-[10px] font-extrabold uppercase tracking-widest text-[#6B7B6B] ml-1">Verified WhatsApp Number</Label>
                <Input defaultValue="+1 (555) 000-1234" className="h-12 rounded-xl border-[#E2EDE2] font-semibold bg-[#F8FAF8]/30" />
              </div>
              <div className="space-y-2.5">
                <Label className="text-[10px] font-extrabold uppercase tracking-widest text-[#6B7B6B] ml-1">Support Email</Label>
                <Input defaultValue="ops@smileplus.com" type="email" className="h-12 rounded-xl border-[#E2EDE2] font-semibold bg-[#F8FAF8]/30" />
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-[#F0F7F0] flex justify-end">
              <Button className="bg-[#16A34A] hover:bg-[#15803D] text-white px-10 h-14 rounded-2xl font-extrabold text-sm shadow-xl shadow-green-500/10 active:scale-95 transition-all">
                Update Global Profile
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* INTEGRATIONS */}
        <TabsContent value="integrations">
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
            <IntegrationCard
              name="WhatsApp Cloud API"
              description="Enterprise-grade connection to Meta's infrastructure."
              connected={true}
              detail="KEY: WA_ID_8842_PRIME"
            >
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="flex-1 h-10 rounded-xl text-[11px] font-bold border-[#E2EDE2] hover:bg-green-50 hover:text-[#16A34A] hover:border-[#16A34A]">
                  <RefreshCw className="w-3.5 h-3.5 mr-2" />
                  Rotate Tokens
                </Button>
                <Button variant="outline" size="sm" className="flex-1 h-10 rounded-xl text-[11px] font-bold border-[#E2EDE2]">
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
                <Button variant="outline" size="sm" className="flex-1 h-10 rounded-xl text-[11px] font-bold border-[#E2EDE2]">
                  <Key className="w-3.5 h-3.5 mr-2" />
                  API Vault
                </Button>
                <Button variant="outline" size="sm" className="flex-1 h-10 rounded-xl text-[11px] font-bold border-[#E2EDE2]">
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
                <Button variant="outline" size="sm" className="flex-1 h-10 rounded-xl text-[11px] font-bold border-[#E2EDE2] hover:text-green-600">
                  <ExternalLink className="w-3.5 h-3.5 mr-2" />
                  Live View
                </Button>
                <Button variant="outline" size="sm" className="flex-1 h-10 rounded-xl text-[11px] font-bold border-[#E2EDE2]">
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
                className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white h-10 rounded-xl text-[11px] font-extrabold shadow-lg shadow-green-500/10"
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
            className="bg-white rounded-[24px] border border-[#E2EDE2]/60 shadow-premium p-8 space-y-8"
          >
            <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-extrabold text-[#0F1F0F] tracking-tight uppercase tracking-[0.1em] text-xs text-[#6B7B6B]">
                    Alert Protocols
                    </h3>
                    <p className="text-sm font-bold text-[#0F1F0F] mt-1">Real-time Intelligence Updates</p>
                </div>
            </div>

            <div className="grid gap-4">
              {[
                { label: "Lead Acquisition", desc: "Notify when a high-intent lead initiates contact" },
                { label: "Successful Conversion", desc: "Alert when a booking is finalized by the AI" },
                { label: "Human Escalation", desc: "Instantly alert team for complex edge cases" },
                { label: "Daily ROI Analytics", desc: "Receive summary performance reports via email" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 px-6 rounded-2xl bg-[#F8FAF8]/50 border border-[#E2EDE2]/40 hover:bg-white hover:border-[#16A34A]/20 transition-all">
                    <div>
                        <p className="text-sm font-extrabold text-[#0F1F0F]">{item.label}</p>
                        <p className="text-[11px] font-medium text-[#6B7B6B]">{item.desc}</p>
                    </div>
                    <AutomationToggle defaultChecked={true} label="" description="" />
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-6 border-t border-[#F0F7F0]">
              <Label className="text-[10px] font-extrabold uppercase tracking-widest text-[#6B7B6B]">Alert Distribution Email</Label>
              <Input
                defaultValue="hq@whatsflow.ai"
                type="email"
                className="max-w-md h-12 rounded-xl border-[#E2EDE2] font-semibold"
              />
            </div>
            <div className="flex justify-end pt-4">
                <Button className="bg-[#16A34A] hover:bg-[#15803D] text-white px-10 h-12 rounded-xl font-bold">
                Deploy Preferences
                </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* BILLING */}
        <TabsContent value="billing">
          <div className="space-y-6">
            {/* Plan card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[24px] border border-[#E2EDE2]/60 shadow-premium p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#16A34A]/5 rounded-full blur-3xl -mr-32 -mt-32" />
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-extrabold text-[#0F1F0F] tracking-tight">Active Subscription</h3>
                    <Badge className="bg-[#16A34A] text-white text-[10px] font-extrabold px-3 py-1 rounded-lg border border-[#16A34A]/20">
                      SCALE PLAN
                    </Badge>
                  </div>
                  
                  <div className="grid gap-1">
                      <p className="text-sm font-medium text-[#6B7B6B]">MRR Contribution: <span className="text-[#0F1F0F] font-extrabold">$149.00 / month</span></p>
                      <p className="text-sm font-medium text-[#6B7B6B]">Next Billing Event: <span className="text-[#0F1F0F] font-extrabold">Feb 13, 2026</span></p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-xl font-bold border-[#16A34A] text-[#16A34A] hover:bg-green-50 shadow-sm transition-all active:scale-95">
                        Upgrade Intelligence
                    </Button>
                    <Button variant="ghost" className="h-12 px-6 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all">
                        Terminate Plan
                    </Button>
                </div>
              </div>

              {/* Payment method */}
              <div className="mt-10 p-6 bg-[#F8FAF8] border border-[#E2EDE2] rounded-2xl flex items-center justify-between border-dashed">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-[#0F1F0F] rounded-lg flex items-center justify-center shadow-lg">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-[#0F1F0F]">Visa Platinum ···· 8842</p>
                    <p className="text-xs font-bold text-[#6B7B6B]">Expires 08/2028</p>
                  </div>
                </div>
                <Button variant="outline" className="h-10 px-6 rounded-xl text-xs font-bold border-[#E2EDE2] bg-white">
                  Update Vault
                </Button>
              </div>
            </motion.div>

            {/* Invoice history */}
            <div className="bg-white rounded-[24px] border border-[#E2EDE2]/60 shadow-premium overflow-hidden">
              <div className="px-8 py-6 border-b border-[#E2EDE2]/60">
                <h3 className="text-lg font-extrabold text-[#0F1F0F] tracking-tight">Financial Artifacts</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F8FAF8] border-b border-[#E2EDE2]/60">
                      {["Billing Date", "Amount", "Current Status", ""].map((h) => (
                        <th
                          key={h}
                          className="text-left text-[10px] font-extrabold text-[#6B7B6B] px-8 py-4 uppercase tracking-[0.2em]"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr
                        key={inv.date}
                        className="border-b border-[#E2EDE2]/40 hover:bg-[#F8FAF8]/50 transition-colors"
                      >
                        <td className="px-8 py-5 text-sm font-bold text-[#0F1F0F]">
                          {inv.date}
                        </td>
                        <td className="px-8 py-5 text-sm font-extrabold text-[#0F1F0F]">
                          {inv.amount}
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#DCFCE7] text-[#16A34A] text-[10px] font-extrabold border border-[#16A34A]/10">
                            PROCESSED
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs font-bold text-[#6B7B6B] hover:text-[#16A34A] hover:bg-green-50 rounded-lg px-4"
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
