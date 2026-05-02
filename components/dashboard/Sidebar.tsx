"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  MessageCircle,
  BarChart3,
  Settings,
  BookOpen,
  MessageSquare,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  LifeBuoy,
  LogOut,
  Megaphone,
  Workflow,
  Sparkles,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/SidebarContext";

const navCategories = [
  {
    category: "Main",
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "Leads", href: "/dashboard/leads", icon: Users },
      { label: "Conversations", href: "/dashboard/conversations", icon: MessageCircle },
    ],
  },
  {
    category: "AI & Automation",
    items: [
      { label: "AI Agents", href: "/dashboard/ai-agents", icon: Bot },
      { label: "Automation", href: "/dashboard/automation", icon: Workflow },
      { label: "Knowledge Base", href: "/dashboard/knowledge", icon: BookOpen },
    ],
  },
  {
    category: "Marketing",
    items: [
      { label: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
      { label: "Templates", href: "/dashboard/templates", icon: MessageSquare },
    ],
  },
  {
    category: "System",
    items: [
      { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
      { label: "Support", href: "/dashboard/support", icon: LifeBuoy },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <aside
      className={cn(
        "hidden lg:flex fixed left-0 top-0 h-screen bg-white dark:bg-[#111827] border-r border-[#E5E7EB] dark:border-[#1F2937] flex-col z-40 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className={cn(
        "flex items-center gap-2 px-4 h-16 border-b border-[#E5E7EB] dark:border-[#1F2937] relative shrink-0",
        isCollapsed ? "justify-center px-0" : "justify-start"
      )}>
        <div className="w-10 h-10 shrink-0 flex items-center justify-center">
          <img src="/logo-robot.png" alt="Logo" className="w-8 h-8 object-contain" />
        </div>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="font-bold text-[#111827] dark:text-[#F9FAFB] text-base tracking-tight">
              WhatsFlow
            </span>
            <span className="bg-[#22C55E] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
              AI
            </span>
          </motion.div>
        )}

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#22C55E] hover:border-[#22C55E] shadow-sm z-50 transition-all duration-200 hover:scale-110 group/toggle"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 transition-transform group-hover/toggle:translate-x-0.5" />
          ) : (
            <ChevronLeft className="w-4 h-4 transition-transform group-hover/toggle:-translate-x-0.5" />
          )}
        </button>
      </div>

      {/* Nav Section */}
      <nav className={cn(
        "flex-1 px-3 py-4 space-y-4 scrollbar-hide",
        isCollapsed ? "overflow-hidden" : "overflow-y-auto"
      )}>
        {navCategories.map((category) => (
          <div key={category.category} className="space-y-1">
            {!isCollapsed && (
              <p className="text-[10px] font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider px-3 mb-2 mt-2 select-none">
                {category.category}
              </p>
            )}
            {category.items.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group relative",
                    isActive
                      ? "bg-[#22C55E]/10 text-[#22C55E] shadow-sm dark:bg-[#22C55E]/5 glow-accent"
                      : "text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827] dark:text-[#9CA3AF] dark:hover:bg-[#0B0F1A] dark:hover:text-[#F9FAFB]",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 shrink-0 transition-colors duration-200",
                    isActive ? "text-[#22C55E] drop-shadow-[0_0_8px_#22C55E80]" : "text-[#6B7280] dark:text-[#9CA3AF] group-hover:text-[#111827] dark:group-hover:text-[#F9FAFB]"
                  )} />

                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-[#111827] dark:bg-white text-white dark:text-[#111827] text-xs font-medium rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}

                  {/* Active Indicator (left thin bar) */}
                  {isActive && !isCollapsed && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 w-1 h-6 bg-[#22C55E] rounded-r-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className={cn(
        "px-3 pb-6 space-y-3 border-t border-[#E5E7EB] dark:border-[#1F2937] pt-4 shrink-0 bg-white dark:bg-[#111827]",
        isCollapsed && "px-0"
      )}>
        {/* Upgrade Card */}
        {!isCollapsed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#F9FAFB] dark:bg-[#0B0F1A] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl p-3 shadow-sm"
          >
            <p className="text-xs font-semibold text-[#111827] dark:text-[#F9FAFB] mb-1">
              On Starter Plan
            </p>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-2 leading-relaxed">
              Upgrade to unlock automation
            </p>
            <Button
              size="sm"
              className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white h-8 text-xs font-semibold rounded-lg shadow-md shadow-green-500/10 transition-all active:scale-[0.98]"
            >
              Upgrade
              <ArrowUpRight className="w-3 h-3 ml-1" />
            </Button>
          </motion.div>
        ) : (
          <div className="flex justify-center">
            <button className="w-10 h-10 bg-[#E8FBF0] dark:bg-[#22C55E]/10 text-[#22C55E] rounded-lg flex items-center justify-center hover:bg-[#DCFCE7] transition-colors group relative">
              <Sparkles className="w-5 h-5" />
              <div className="absolute left-full ml-2 px-2 py-1 bg-[#111827] dark:bg-white text-white dark:text-[#111827] text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                Upgrade Plan
              </div>
            </button>
          </div>
        )}

        {/* User Profile */}
        <div className={cn(
          "flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-[#F9FAFB] dark:hover:bg-[#0B0F1A] transition-colors cursor-pointer group relative",
          isCollapsed && "justify-center px-0"
        )}>
          <div className="w-9 h-9 rounded-full bg-[#22C55E] flex items-center justify-center shrink-0 shadow-sm text-white font-bold">
            JD
          </div>
          {!isCollapsed && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 min-w-0"
              >
                <p className="text-xs font-bold text-[#111827] dark:text-[#F9FAFB] truncate">
                  John Doe
                </p>
                <p className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] truncate">
                  john@business.com
                </p>
              </motion.div>
              <button
                className="p-1.5 rounded-md text-[#6B7280] dark:text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-[#111827] dark:bg-white text-white dark:text-[#111827] text-xs font-medium rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
              <p className="font-bold">John Doe</p>
              <p className="opacity-70">john@business.com</p>
              <div className="mt-1 pt-1 border-t border-white/20 dark:border-[#E5E7EB]/20 flex items-center gap-2 text-red-400">
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
