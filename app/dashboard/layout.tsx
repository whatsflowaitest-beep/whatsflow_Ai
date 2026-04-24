"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { MobileSidebar } from "@/components/dashboard/MobileSidebar";
import { Breadcrumbs } from "@/components/dashboard/Breadcrumbs";
import { NotificationsProvider } from "@/context/NotificationsContext";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import {
  LayoutDashboard,
  Users,
  MessageCircle,
  Zap,
  BarChart3,
  Settings,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/dashboard/leads", icon: Users },
  { label: "Chats", href: "/dashboard/conversations", icon: MessageCircle },
  { label: "Knowledge", href: "/dashboard/knowledge", icon: BookOpen },
  { label: "Automation", href: "/dashboard/automation", icon: Zap },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      <Sidebar />
      <MobileSidebar />
      <TopBar />

      <main
        className={cn(
          "transition-all duration-300 ease-in-out pt-14",
          isCollapsed ? "lg:pl-20" : "lg:pl-60"
        )}
      >
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4 sm:p-6 pb-24 lg:pb-6"
        >
          <Breadcrumbs />
          {children}
        </motion.div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2EDE2] z-40">
        <div className="flex items-center justify-around">
          {mobileNavItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 px-2 flex-1",
                  isActive ? "text-[#16A34A]" : "text-[#6B7B6B]"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <NotificationsProvider>
        <DashboardShell>{children}</DashboardShell>
      </NotificationsProvider>
    </SidebarProvider>
  );
}
