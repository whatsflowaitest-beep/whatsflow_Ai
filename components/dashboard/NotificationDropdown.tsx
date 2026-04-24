"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  User,
  CheckCircle2,
  AlertTriangle,
  PauseCircle,
  BarChart3,
  Zap,
  X,
  BellRing,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotificationsContext } from "@/context/NotificationsContext";
import { timeAgo, cn } from "@/lib/utils";
import type { Notification, NotificationType } from "@/types/index";

const typeConfig: Record<
  NotificationType,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  new_lead: {
    icon: <User className="w-3.5 h-3.5" />,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  booked: {
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    color: "text-[#16A34A]",
    bg: "bg-green-100",
  },
  attention: {
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
  ai_paused: {
    icon: <PauseCircle className="w-3.5 h-3.5" />,
    color: "text-yellow-600",
    bg: "bg-yellow-100",
  },
  summary: {
    icon: <BarChart3 className="w-3.5 h-3.5" />,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  system: {
    icon: <Zap className="w-3.5 h-3.5" />,
    color: "text-gray-600",
    bg: "bg-gray-100",
  },
};

type TabFilter = "all" | "unread" | "leads" | "system";

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabFilter>("all");
  const [pulse, setPulse] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(0);
  const router = useRouter();

  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotificationsContext();

  // Close on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  // Pulse animation on new notification
  useEffect(() => {
    if (unreadCount > prevCountRef.current) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 2000);
      return () => clearTimeout(t);
    }
    prevCountRef.current = unreadCount;
  }, [unreadCount]);

  function handleNotificationClick(n: Notification) {
    markAsRead(n.id);
    if (n.type === "summary") {
      router.push("/dashboard/analytics");
      setOpen(false);
    } else if (n.actionLeadId) {
      router.push(`/dashboard/leads?view=${n.actionLeadId}`);
      setOpen(false);
    } else if (n.type === "attention" || n.type === "ai_paused") {
      router.push("/dashboard/conversations");
      setOpen(false);
    }
  }

  const filteredNotifications = notifications.filter((n) => {
    if (tab === "unread") return !n.read;
    if (tab === "leads") return ["new_lead", "booked", "attention"].includes(n.type);
    if (tab === "system") return ["ai_paused", "summary", "system"].includes(n.type);
    return true;
  });

  const tabs: { key: TabFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "leads", label: "Leads" },
    { key: "system", label: "System" },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative h-9 w-9 flex items-center justify-center rounded-full text-[#6B7B6B] hover:text-[#0F1F0F] hover:bg-gray-100 transition-all border border-transparent hover:border-[#E2EDE2]"
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <Bell className={cn("w-[18px] h-[18px]", open && "text-[#16A34A]")} />
        {unreadCount > 0 && (
          <span
            className={cn(
              "absolute top-1.5 right-1.5 min-w-[15px] h-[15px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white shadow-sm",
              pulse && "animate-bounce"
            )}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-3 w-[380px] bg-white border border-[#E2EDE2] rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F7F0]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0F1F0F]">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} NEW
                  </span>
                )}
              </div>
              <button
                onClick={() => { markAllAsRead(); }}
                className="text-xs text-[#16A34A] font-bold hover:underline px-2 py-1 rounded-md hover:bg-green-50 transition-colors"
              >
                Mark all read
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#F0F7F0] px-3 pt-2 gap-1 bg-[#F8FAF8]/50">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "px-3 py-2 text-xs font-bold rounded-t-lg transition-all border-b-2 relative",
                    tab === t.key
                      ? "border-[#16A34A] text-[#16A34A] bg-white"
                      : "border-transparent text-[#6B7B6B] hover:text-[#0F1F0F] hover:bg-white/50"
                  )}
                >
                  {t.label}
                  {t.key === 'unread' && unreadCount > 0 && (
                    <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                  )}
                </button>
              ))}
            </div>

            {/* Notification list */}
            <div className="max-h-[420px] overflow-y-auto divide-y divide-[#F0F7F0] scrollbar-hide">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#F8FAF8] flex items-center justify-center">
                    <BellRing className="w-8 h-8 text-gray-200" />
                  </div>
                  <p className="text-sm font-medium text-[#6B7B6B]">All caught up!</p>
                </div>
              ) : (
                filteredNotifications.map((n) => {
                  const cfg = typeConfig[n.type];
                  return (
                    <button
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={cn(
                        "w-full text-left px-5 py-4 flex items-start gap-4 transition-all hover:bg-gray-50 group relative",
                        !n.read && "bg-[#F0F7F0]/40 border-l-[3px] border-l-[#16A34A] pl-[17px]"
                      )}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105",
                          cfg.bg,
                          cfg.color
                        )}
                      >
                        {cfg.icon}
                      </div>
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center justify-between gap-2">
                          <p className={cn("text-sm font-bold leading-none", n.read ? "text-[#0F1F0F]" : "text-[#16A34A]")}>
                            {n.title}
                          </p>
                          <span className="text-[10px] font-medium text-[#6B7B6B] whitespace-nowrap">
                            {timeAgo(n.time)}
                          </span>
                        </div>
                        <p className="text-[13px] text-[#6B7B6B] mt-1.5 leading-snug line-clamp-2 font-medium">
                          {n.body}
                        </p>
                      </div>
                      {!n.read && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                           <div className="w-2 h-2 rounded-full bg-[#16A34A] shadow-sm shadow-[#16A34A]/20" />
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-[#F0F7F0] bg-[#F8FAF8]">
              <button
                onClick={() => { router.push("/dashboard/analytics"); setOpen(false); }}
                className="text-sm text-[#16A34A] font-bold hover:text-[#15803D] w-full text-center transition-colors"
              >
                View all notifications →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
