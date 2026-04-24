"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  MessageCircle,
  Settings,
  BarChart3,
  Zap,
  MessageSquare,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  LifeBuoy,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/SidebarContext";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/dashboard/leads", icon: Users },
  {
    label: "Conversations",
    href: "/dashboard/conversations",
    icon: MessageCircle,
  },
  { label: "Automation", href: "/dashboard/automation", icon: Zap },
  { label: "Knowledge Base", href: "/dashboard/knowledge", icon: BookOpen },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Support", href: "/dashboard/support", icon: LifeBuoy },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <aside
      className={cn(
        "hidden lg:flex fixed left-0 top-0 h-screen bg-white border-r border-[#E2EDE2] flex-col z-40 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-60"
      )}
    >
      {/* Logo Section */}
      <div className={cn(
        "flex items-center gap-2 px-4 py-5 border-b border-[#E2EDE2] relative shrink-0",
        isCollapsed ? "justify-center px-0" : "justify-start"
      )}>
        <div className="w-10 h-10 shrink-0">
          <img src="/logo-robot.png" alt="Logo" className="w-full h-full object-contain" />
        </div>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="font-bold text-[#0F1F0F] text-base tracking-tight">
              WhatsFlow
            </span>
            <span className="bg-[#16A34A] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
              AI
            </span>
          </motion.div>
        )}

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white border border-[#E2EDE2] rounded-full flex items-center justify-center text-[#6B7B6B] hover:text-[#16A34A] hover:border-[#16A34A] shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.1)] z-50 transition-all duration-200 hover:scale-110 group/toggle"
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
        "flex-1 px-3 py-4 space-y-1 scrollbar-hide",
        isCollapsed ? "overflow-hidden" : "overflow-y-auto"
      )}>
        {navItems.map((item, i) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                isActive
                  ? "bg-[#DCFCE7] text-[#15803D]"
                  : "text-[#6B7B6B] hover:bg-[#F8FAF8] hover:text-[#0F1F0F]",
                isCollapsed && "justify-center px-0"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 shrink-0 transition-colors",
                isActive ? "text-[#16A34A]" : "text-[#6B7B6B] group-hover:text-[#0F1F0F]"
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
                <div className="absolute left-full ml-2 px-2 py-1 bg-[#0F1F0F] text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}

              {/* Active Indicator */}
              {isActive && !isCollapsed && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-6 bg-[#16A34A] rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className={cn(
        "px-3 pb-6 space-y-3 border-t border-[#E2EDE2] pt-4 shrink-0 bg-white",
        isCollapsed && "px-0"
      )}>
        {/* Upgrade Card */}
        {!isCollapsed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#F0F7F0] rounded-lg p-3"
          >
            <p className="text-xs font-semibold text-[#0F1F0F] mb-1">
              On Starter Plan
            </p>
            <p className="text-xs text-[#6B7B6B] mb-2">
              Upgrade to unlock automation
            </p>
            <Button
              size="sm"
              className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white h-8 text-xs font-semibold shadow-sm"
            >
              Upgrade
              <ArrowUpRight className="w-3 h-3 ml-1" />
            </Button>
          </motion.div>
        ) : (
          <div className="flex justify-center">
            <button className="w-10 h-10 bg-[#F0F7F0] text-[#16A34A] rounded-lg flex items-center justify-center hover:bg-[#DCFCE7] transition-colors group relative">
              <Zap className="w-5 h-5" />
              <div className="absolute left-full ml-2 px-2 py-1 bg-[#0F1F0F] text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                Upgrade Plan
              </div>
            </button>
          </div>
        )}

        {/* User Profile */}
        <div className={cn(
          "flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#F8FAF8] transition-colors cursor-pointer group relative",
          isCollapsed && "justify-center px-0"
        )}>
          <div className="w-9 h-9 rounded-full bg-[#16A34A] flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white text-xs font-bold">JD</span>
          </div>
          {!isCollapsed && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 min-w-0"
              >
                <p className="text-xs font-bold text-[#0F1F0F] truncate">
                  John Doe
                </p>
                <p className="text-[10px] text-[#6B7B6B] truncate">
                  john@business.com
                </p>
              </motion.div>
              <button
                className="p-1.5 rounded-md text-[#6B7B6B] hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-[#0F1F0F] text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
              <p className="font-bold">John Doe</p>
              <p className="opacity-70">john@business.com</p>
              <div className="mt-1 pt-1 border-t border-white/20 flex items-center gap-2 text-red-400">
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
