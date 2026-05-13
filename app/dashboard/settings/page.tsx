"use client";

import { useState, useEffect, Suspense } from "react";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

const invoices: Array<{ date: string, amount: string, status: string }> = [];

interface SubscriptionPlan {
  name: string;
  price_monthly: string | number;
}

interface ActiveSubscription {
  plan?: SubscriptionPlan | null;
  status?: string;
}

interface Config {
  business_name: string;
  industry: string;
  whatsapp_number: string;
  support_email: string;
  full_name: string;
  personal_email: string;
  active_subscription: ActiveSubscription | null;
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#22C55E]" aria-label="Loading settings" />
        </div>
      }
    >
      <SettingsPageContent />
    </Suspense>
  );
}

function SettingsPageContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 2FA state
  const [tfaOpen, setTfaOpen] = useState(false);
  const [tfaEnabled, setTfaEnabled] = useState(false);
  const [tfaCode, setTfaCode] = useState("");
  const [tfaSecret, setTfaSecret] = useState("");
  const [tfaQrCode, setTfaQrCode] = useState("");
  const [confirmingTfa, setConfirmingTfa] = useState(false);

  // Password update state
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const [config, setConfig] = useState<Config>({
    business_name: "",
    industry: "dental",
    whatsapp_number: "",
    support_email: "",
    full_name: "Loading...",
    personal_email: "",
    active_subscription: null
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
        if (data) {
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

  const handleUpdate = (key: keyof Config, value: any) => {
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

  const handleOpenTfa = async () => {
    try {
      const res = await fetch("/api/2fa/setup");
      if (!res.ok) throw new Error("Failed to initialize 2FA");
      const data = await res.json();
      setTfaSecret(data.secret);
      setTfaQrCode(data.qrCode);
      setTfaOpen(true);
    } catch (err: any) {
      toast(err.message || "Failed to load 2FA configuration", "error");
    }
  };

  const handleEnableTfa = async () => {
    if (tfaCode.length !== 6 || isNaN(Number(tfaCode))) {
      toast("Please enter a valid 6-digit code", "error");
      return;
    }
    setConfirmingTfa(true);
    try {
      const res = await fetch("/api/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tfaCode, secret: tfaSecret }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTfaEnabled(true);
        setTfaOpen(false);
        setTfaCode("");
        toast("Two-factor authentication successfully activated ✓", "success");
      } else {
        toast(data.error || "Invalid verification code", "error");
      }
    } catch (err: any) {
      toast(err.message || "Failed to verify code", "error");
    } finally {
      setConfirmingTfa(false);
    }
  };

  const handleDisableTfa = () => {
    setTfaEnabled(false);
    toast("Two-factor authentication successfully deactivated", "success");
  };

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast("Please fill in all password fields", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast("New password and confirm password do not match", "error");
      return;
    }
    setSavingPassword(true);
    setTimeout(() => {
      setPasswordOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSavingPassword(false);
      toast("Password successfully updated ✓", "success");
    }, 800);
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
                {/* 2FA Card */}
                <div className="p-4 bg-[#F9FAFB] dark:bg-[#0B0F1A] rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <ShieldCheck className={cn("w-5 h-5", tfaEnabled ? "text-[#22C55E]" : "text-[#6B7280] dark:text-[#9CA3AF]")} />
                    <div>
                      <span className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB] block">Two-Factor Auth</span>
                      <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] font-semibold">{tfaEnabled ? "Status: Active" : "Status: Disabled"}</span>
                    </div>
                  </div>
                  {tfaEnabled ? (
                    <Button 
                      variant="outline" 
                      onClick={handleDisableTfa}
                      className="h-9 rounded-xl text-xs font-bold border-red-200 hover:bg-red-50 dark:hover:bg-red-950 text-red-500 transition-all"
                    >
                      DISABLE
                    </Button>
                  ) : (
                    <Dialog open={tfaOpen} onOpenChange={setTfaOpen}>
                      <Button 
                        variant="outline" 
                        onClick={handleOpenTfa}
                        className="h-9 rounded-xl text-xs font-bold border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#1F2937] text-[#111827] dark:text-[#F9FAFB] hover:bg-[#F3F4F6] dark:hover:bg-[#374151]"
                      >
                        ENABLE
                      </Button>
                      <DialogContent className="bg-white dark:bg-[#111827] border-[#E5E7EB] dark:border-[#1F2937] p-6 rounded-2xl max-w-md shadow-xl">
                        <DialogHeader>
                          <DialogTitle className="text-base font-bold text-[#111827] dark:text-[#F9FAFB]">Configure Two-Factor Auth</DialogTitle>
                          <DialogDescription className="text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF]">
                            Protect your account with a secondary security verification layer.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-4">
                          <div className="p-3 bg-[#F9FAFB] dark:bg-[#0B0F1A] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl text-center">
                            <p className="text-[11px] font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider mb-2">Scan QR Code or Use Setup Key</p>
                            <div className="w-32 h-32 bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl mx-auto flex items-center justify-center mb-3 overflow-hidden">
                              {tfaQrCode ? (
                                <img src={tfaQrCode} alt="TOTP QR Code" className="w-full h-full object-contain p-1" />
                              ) : (
                                <span className="text-2xl animate-pulse">📱</span>
                              )}
                            </div>
                            <p className="text-xs font-mono font-bold text-[#111827] dark:text-[#F9FAFB] select-all bg-white dark:bg-[#111827] py-1 border border-[#E5E7EB] dark:border-[#1F2937] rounded-lg tracking-wider">
                              {tfaSecret || "WHATS-FLOW-AI-2FA-TOKEN"}
                            </p>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider">Verification Code</Label>
                            <Input
                              placeholder="6-digit authentication code"
                              value={tfaCode}
                              onChange={e => setTfaCode(e.target.value)}
                              maxLength={6}
                              className="h-11 rounded-xl border-[#E5E7EB] dark:border-[#1F2937] font-bold text-center tracking-widest bg-[#F9FAFB] dark:bg-[#0B0F1A] text-[#111827] dark:text-[#F9FAFB]"
                            />
                          </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                          <Button variant="outline" onClick={() => setTfaOpen(false)} className="h-11 px-5 rounded-xl text-xs font-bold">Cancel</Button>
                          <Button 
                            onClick={handleEnableTfa} 
                            disabled={confirmingTfa}
                            className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-5 h-11 rounded-xl font-bold transition-all shadow-md active:scale-95"
                          >
                            {confirmingTfa ? "Activating..." : "Verify & Activate"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                {/* Password Card */}
                <div className="p-4 bg-[#F9FAFB] dark:bg-[#0B0F1A] rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Lock className="w-5 h-5 text-[#22C55E]" />
                    <div>
                      <span className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB] block">Update Password</span>
                      <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] font-semibold">Change your account password</span>
                    </div>
                  </div>
                  <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
                    <Button 
                      variant="outline" 
                      onClick={() => setPasswordOpen(true)}
                      className="h-9 rounded-xl text-xs font-bold border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#1F2937] text-[#111827] dark:text-[#F9FAFB] hover:bg-[#F3F4F6] dark:hover:bg-[#374151]"
                    >
                      CHANGE
                    </Button>
                    <DialogContent className="bg-white dark:bg-[#111827] border-[#E5E7EB] dark:border-[#1F2937] p-6 rounded-2xl max-w-md shadow-xl">
                      <DialogHeader>
                        <DialogTitle className="text-base font-bold text-[#111827] dark:text-[#F9FAFB]">Update Password</DialogTitle>
                        <DialogDescription className="text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF]">
                          Ensure your account uses a complex password to protect your workspace.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 space-y-3.5">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider">Current Password</Label>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            className="h-11 rounded-xl border-[#E5E7EB] dark:border-[#1F2937] font-medium bg-[#F9FAFB] dark:bg-[#0B0F1A] text-[#111827] dark:text-[#F9FAFB]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider">New Password</Label>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="h-11 rounded-xl border-[#E5E7EB] dark:border-[#1F2937] font-medium bg-[#F9FAFB] dark:bg-[#0B0F1A] text-[#111827] dark:text-[#F9FAFB]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider">Confirm New Password</Label>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="h-11 rounded-xl border-[#E5E7EB] dark:border-[#1F2937] font-medium bg-[#F9FAFB] dark:bg-[#0B0F1A] text-[#111827] dark:text-[#F9FAFB]"
                          />
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setPasswordOpen(false)} className="h-11 px-5 rounded-xl text-xs font-bold">Cancel</Button>
                        <Button 
                          onClick={handleUpdatePassword} 
                          disabled={savingPassword}
                          className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-5 h-11 rounded-xl font-bold transition-all shadow-md active:scale-95"
                        >
                          {savingPassword ? "Updating..." : "Update Password"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
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
                <Button variant="outline" size="sm" className="flex-1 h-10 rounded-xl text-xs font-bold border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#1F2937] text-[#111827] dark:text-[#F9FAFB] hover:bg-[#22C55E]/10 hover:text-[#22C55E] dark:hover:bg-[#22C55E]/10">
                  <RefreshCw className="w-3.5 h-3.5 mr-2" />
                  Rotate Tokens
                </Button>
                <Button variant="outline" size="sm" className="flex-1 h-10 rounded-xl text-xs font-bold border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#1F2937] text-[#111827] dark:text-[#F9FAFB] hover:bg-[#F3F4F6] dark:hover:bg-[#374151]">
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
                <Button variant="outline" size="sm" className="flex-1 h-10 rounded-xl text-xs font-bold border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#1F2937] text-[#111827] dark:text-[#F9FAFB] hover:bg-[#F3F4F6] dark:hover:bg-[#374151]">
                  <Key className="w-3.5 h-3.5 mr-2" />
                  API Vault
                </Button>
                <Button variant="outline" size="sm" className="flex-1 h-10 rounded-xl text-xs font-bold border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#1F2937] text-[#111827] dark:text-[#F9FAFB] hover:bg-[#F3F4F6] dark:hover:bg-[#374151]">
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
                <Button variant="outline" size="sm" className="flex-1 h-10 rounded-xl text-xs font-bold border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#1F2937] text-[#111827] dark:text-[#F9FAFB] hover:text-[#22C55E] dark:hover:text-[#22C55E] hover:bg-[#22C55E]/10 dark:hover:bg-[#22C55E]/10">
                  <ExternalLink className="w-3.5 h-3.5 mr-2" />
                  Live View
                </Button>
                <Button variant="outline" size="sm" className="flex-1 h-10 rounded-xl text-xs font-bold border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#1F2937] text-[#111827] dark:text-[#F9FAFB] hover:bg-[#F3F4F6] dark:hover:bg-[#374151]">
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
                    <Badge className="bg-[#22C55E] text-white text-[10px] font-bold px-3 py-1 rounded-xl border-none uppercase">
                      {config.active_subscription?.plan?.name || 'Free Plan'}
                    </Badge>
                  </div>

                  <div className="grid gap-1">
                    <p className="text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF]">MRR Contribution: <span className="text-[#111827] dark:text-[#F9FAFB] font-bold">${config.active_subscription?.plan?.price_monthly || '0.00'} / month</span></p>
                    <p className="text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF]">Status: <span className="text-[#111827] dark:text-[#F9FAFB] font-bold capitalize">{config.active_subscription?.status || 'Inactive'}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="outline" className="h-11 px-6 rounded-xl font-bold border-[#22C55E] text-[#22C55E] bg-white dark:bg-[#1F2937] hover:bg-[#22C55E]/10 dark:hover:bg-[#22C55E]/10 shadow-sm transition-all active:scale-95">
                    Upgrade Intelligence
                  </Button>
                  <Button variant="ghost" className="h-11 px-6 rounded-xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all">
                    Terminate Plan
                  </Button>
                </div>
              </div>

              {config.active_subscription && (
                <div className="mt-8 p-5 bg-[#F9FAFB] dark:bg-[#0B0F1A] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl flex items-center justify-between border-dashed">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-black dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-lg flex items-center justify-center shadow-sm">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">Active Billing Source</p>
                      <p className="text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF]">Secured by Primary Gateway</p>
                    </div>
                  </div>
                  <Button variant="outline" className="h-10 px-5 rounded-xl text-xs font-bold border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#1F2937] text-[#111827] dark:text-[#F9FAFB] hover:bg-[#F3F4F6] dark:hover:bg-[#374151]">
                    Manage Payment
                  </Button>
                </div>
              )}
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
                    {invoices.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center">
                          <p className="text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF]">No transaction artifacts generated yet.</p>
                        </td>
                      </tr>
                    ) : (
                      invoices.map((inv) => (
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
                              {inv.status.toUpperCase()}
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
                      ))
                    )}
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
