"use client";

import { Search, Menu, User, Settings, Smartphone, QrCode, CheckCircle2, Loader2, AlertCircle, Sun, Moon } from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/SidebarContext";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MessageSquare,
  Users,
  BarChart3,
  Calendar,
} from "lucide-react";

export function TopBar() {
  const { isCollapsed, toggleMobileMenu } = useSidebar();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsNavigating(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const searchResults = [
    { icon: MessageSquare, title: "Automations", description: "Manage your AI response flows", category: "Features", href: "/dashboard/automation" },
    { icon: Users, title: "Contacts", description: "View and manage your leads", category: "Management", href: "/dashboard/leads" },
    { icon: BarChart3, title: "Analytics", description: "Review performance metrics", category: "Reports", href: "/dashboard/analytics" },
    { icon: Calendar, title: "Campaigns", description: "Schedule broadcast messages", category: "Marketing", href: "/dashboard/campaigns" },
  ].filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const simulateConnect = async () => {
    setConnecting(true);
    await new Promise(r => setTimeout(r, 2000));
    setConnecting(false);
    setOpen(false);
    toast("WhatsApp connected successfully! ✓", "success");
  };

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header
      className={cn(
        "h-16 fixed top-0 right-0 left-0 bg-white/80 dark:bg-[#0B0F1A]/80 backdrop-blur-md border-b border-[#E5E7EB] dark:border-[#1F2937] z-30 px-4 flex items-center justify-between transition-all duration-300 ease-in-out",
        isCollapsed ? "lg:left-20" : "lg:left-64"
      )}
    >
      {/* Left Section: Mobile Menu & Logo */}
      <div className="flex-1 flex items-center justify-start gap-4">
        <div className="flex items-center lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-1 -ml-1 hover:bg-[#F9FAFB] dark:hover:bg-[#111827] rounded-md transition-colors"
          >
            <Menu className="w-5 h-5 text-[#6B7280] dark:text-[#9CA3AF]" />
          </button>
          <span className="ml-3 font-bold text-[#22C55E] text-lg tracking-tight">WhatsFlow</span>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-[#22C55E] hover:bg-[#16A34A] text-white gap-2 rounded-xl h-9 px-4 shadow-lg shadow-green-500/15 transition-all active:scale-[0.98] hidden lg:flex font-semibold text-xs shrink-0"
            >
              <Smartphone className="w-4 h-4" />
              Connect WhatsApp
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px] rounded-[32px] border-none p-0 overflow-hidden shadow-2xl bg-white dark:bg-[#111827]">
            <div className="bg-[#22C55E] p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Connect your WhatsApp</h2>
                <p className="text-white/80 text-sm leading-relaxed max-w-[280px]">
                  Link your account to start automating conversations and managing leads instantly.
                </p>
              </div>
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            </div>

            <div className="p-8 bg-white dark:bg-[#111827]">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-48 h-48 bg-[#F9FAFB] dark:bg-[#0B0F1A] border-2 border-[#E5E7EB] dark:border-[#1F2937] rounded-[24px] p-4 flex flex-col items-center justify-center relative group shrink-0">
                  {connecting ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 text-[#22C55E] animate-spin" />
                      <span className="text-[10px] font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-widest">Linking...</span>
                    </div>
                  ) : (
                    <>
                      <QrCode className="w-full h-full text-[#111827] dark:text-[#F9FAFB] opacity-20 dark:opacity-40" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-white dark:bg-[#0B0F1A] rounded-xl shadow-lg border border-[#E5E7EB] dark:border-[#1F2937] flex items-center justify-center">
                          <img src="/logo-robot.png" className="w-6 h-6 object-contain" alt="Logo" />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex-1 space-y-5">
                  {[
                    { step: 1, text: "Open WhatsApp on your phone" },
                    { step: 2, text: "Tap Menu or Settings and select Linked Devices" },
                    { step: 3, text: "Point your phone to this screen to capture the code" }
                  ].map((s) => (
                    <div key={s.step} className="flex gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#E8FBF0] dark:bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {s.step}
                      </span>
                      <p className="text-sm text-[#4B5563] dark:text-[#9CA3AF] leading-tight font-medium">{s.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3 p-4 bg-[#F9FAFB] dark:bg-[#0B0F1A] rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937]">
                <AlertCircle className="w-4 h-4 text-[#22C55E] shrink-0" />
                <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] leading-tight">
                  By connecting, you agree to our terms of service regarding automated messaging and lead handling.
                </p>
              </div>

              <div className="mt-8">
                <Button
                  onClick={simulateConnect}
                  disabled={connecting}
                  className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white h-12 rounded-xl font-bold shadow-lg shadow-green-500/15 transition-all active:scale-[0.98]"
                >
                  {connecting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying Connection...
                    </div>
                  ) : (
                    "I've Scanned the Code"
                  )}
                </Button>
                <button
                  onClick={() => setOpen(false)}
                  className="w-full mt-4 text-[11px] font-bold text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB] transition-colors"
                >
                  Cancel Connection
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Center Section: Search Bar */}
      <div className="hidden md:flex flex-[2] items-center justify-center px-4">
        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
          <DialogTrigger asChild>
            <div className="w-full max-w-md flex items-center gap-2 text-[#6B7280] dark:text-[#9CA3AF] bg-[#F9FAFB] dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] px-4 py-2 rounded-xl hover:border-[#22C55E]/30 transition-all cursor-pointer group">
              <Search className="w-4 h-4 group-hover:text-[#22C55E] transition-colors" />
              <span className="text-sm font-medium">Quick Search (⌘K)</span>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white dark:bg-[#111827] [&>button]:hidden">
            <div className="flex items-center px-4 py-1 border-b border-gray-100 dark:border-[#1F2937] bg-white dark:bg-[#111827]">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none text-sm h-12 bg-transparent placeholder:text-gray-400 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-gray-100 bg-gray-50/50 px-1.5 font-mono text-[9px] font-medium text-gray-400 opacity-100">
                <span className="text-[10px]">esc</span>
              </kbd>
            </div>

            <div className="p-1 max-h-[350px] overflow-y-auto scrollbar-hide relative min-h-[100px] bg-white dark:bg-[#111827]">
              <AnimatePresence>
                {isNavigating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 bg-white/60 dark:bg-[#111827]/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full border-2 border-gray-100 border-t-[#22C55E] animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#22C55E] uppercase tracking-widest animate-pulse">Loading Page...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {searchQuery.length > 0 ? (
                <div className="space-y-0.5">
                  {searchResults.length > 0 ? (
                    searchResults.map((result, i) => (
                      <button
                        key={i}
                        className="w-full flex items-center gap-3 p-2 hover:bg-[#F9FAFB] dark:hover:bg-[#0B0F1A] rounded-lg transition-colors group text-left"
                        disabled={isNavigating}
                        onClick={() => {
                          setIsNavigating(true);
                          router.push(result.href);
                        }}
                      >
                        <div className="w-8 h-8 rounded-md bg-[#F9FAFB] dark:bg-[#0B0F1A] flex items-center justify-center text-[#6B7280] group-hover:text-[#22C55E] group-hover:bg-[#22C55E]/10 transition-colors">
                          <result.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-medium text-[#111827] dark:text-[#F9FAFB] truncate">{result.title}</h4>
                            <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] font-medium">{result.category}</span>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="py-10 text-center">
                      <p className="text-sm text-gray-500">No results for "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-1 space-y-1">
                  <div className="px-2 py-1.5 text-[10px] font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-tight">Recent / Quick Actions</div>
                  {[
                    { icon: Plus, title: "Create New Flow", href: "/dashboard/automation" },
                    { icon: Users, title: "Add New Contact", href: "/dashboard/leads" },
                    { icon: MessageSquare, title: "WhatsApp Campaigns", href: "/dashboard/campaigns" },
                    { icon: BarChart3, title: "View Analytics", href: "/dashboard/analytics" },
                  ].map((action, i) => (
                    <button
                      key={i}
                      className="w-full flex items-center gap-3 p-2 hover:bg-[#F9FAFB] dark:hover:bg-[#0B0F1A] rounded-lg transition-colors group text-left"
                      disabled={isNavigating}
                      onClick={() => {
                        setIsNavigating(true);
                        router.push(action.href);
                      }}
                    >
                      <div className="w-8 h-8 rounded-md bg-[#F9FAFB] dark:bg-[#0B0F1A] flex items-center justify-center text-gray-500 group-hover:text-[#22C55E] group-hover:bg-green-50 transition-colors">
                        <action.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-[#111827] dark:text-[#F9FAFB]">{action.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="px-4 py-2 border-t border-gray-50 dark:border-[#1F2937] bg-gray-50/50 dark:bg-[#0B0F1A]/50 flex items-center justify-between">
              <p className="text-[10px] text-gray-400">Search powered by <span className="font-semibold text-[#22C55E]">WhatsFlow AI</span></p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Right Section: Actions + Theme Toggle Switch */}
      <div className="flex-1 flex items-center justify-end gap-1 sm:gap-3">
        {/* 🌗 Premium Theme Toggle Switch */}
        <div className="relative flex items-center" title="Switch theme">
          <button
            onClick={toggleTheme}
            className="w-14 h-7 flex items-center bg-[#E5E7EB] dark:bg-[#111827] border border-[#D1D5DB] dark:border-[#1F2937] rounded-full p-0.5 relative transition-all duration-300 hover:border-[#22C55E] dark:hover:border-[#22C55E] shadow-inner focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
          >
            <motion.div
              animate={{ x: mounted && theme === "dark" ? 28 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-5.5 h-5.5 flex items-center justify-center bg-white dark:bg-[#22C55E] rounded-full shadow-md transition-colors duration-300"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mounted && theme === "dark" ? (
                  <motion.div
                    key="dark"
                    initial={{ opacity: 0, rotate: -45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Moon className="w-3.5 h-3.5 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="light"
                    initial={{ opacity: 0, rotate: -45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </button>
        </div>

        <NotificationDropdown />

        <div className="w-[1px] h-4 bg-[#E5E7EB] dark:bg-[#1F2937] mx-1" />

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB] hover:bg-gray-100 dark:hover:bg-[#111827] rounded-full"
          onClick={() => router.push('/dashboard/settings')}
        >
          <Settings className="w-4 h-4" />
        </Button>

        <button
          onClick={() => router.push('/dashboard/settings?tab=profile')}
          className="flex items-center gap-2 p-1 pl-2 hover:bg-gray-50 dark:hover:bg-[#111827] rounded-full transition-colors border border-transparent hover:border-[#E5E7EB] dark:hover:border-[#1F2937]"
        >
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-[11px] font-bold text-[#111827] dark:text-[#F9FAFB] leading-none">Admin User</span>
            <span className="text-[9px] text-[#6B7280] dark:text-[#9CA3AF] leading-none mt-0.5">WhatsFlow Agency</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center text-white shadow-sm ring-2 ring-white dark:ring-[#111827]">
            <User className="w-4 h-4" />
          </div>
        </button>
      </div>
    </header>
  );
}
