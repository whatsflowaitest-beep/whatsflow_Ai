"use client";

import { Search, Menu, User, Settings } from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/SidebarContext";

export function TopBar() {
  const { isCollapsed, toggleMobileMenu } = useSidebar();

  return (
    <header
      className={cn(
        "h-14 fixed top-0 right-0 left-0 bg-white border-b border-[#E2EDE2] z-30 px-4 flex items-center justify-between transition-all duration-300 ease-in-out",
        isCollapsed ? "lg:left-20" : "lg:left-60"
      )}
    >
      {/* Left Section: Mobile Menu & Logo */}
      <div className="flex-1 flex items-center justify-start">
        <div className="flex items-center lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-1 -ml-1 hover:bg-[#F8FAF8] rounded-md transition-colors"
          >
            <Menu className="w-5 h-5 text-[#6B7B6B]" />
          </button>
          <span className="ml-3 font-bold text-[#16A34A] text-lg">WhatsFlow</span>
        </div>
      </div>

      {/* Center Section: Search Bar */}
      <div className="hidden md:flex flex-[2] items-center justify-center px-4">
        <div className="w-full max-w-md flex items-center gap-2 text-[#6B7B6B] bg-[#F8FAF8] border border-[#E2EDE2] px-4 py-2 rounded-xl hover:border-[#16A34A]/30 transition-all cursor-pointer group">
          <Search className="w-4 h-4 group-hover:text-[#16A34A] transition-colors" />
          <span className="text-sm font-medium">Quick Search (⌘K)</span>
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex-1 flex items-center justify-end gap-1 sm:gap-2">
        <NotificationDropdown />

        <div className="w-[1px] h-4 bg-[#E2EDE2] mx-1" />

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-[#6B7B6B] hover:text-[#0F1F0F] hover:bg-gray-100 rounded-full"
        >
          <Settings className="w-4 h-4" />
        </Button>

        <button className="flex items-center gap-2 p-1 pl-2 hover:bg-gray-50 rounded-full transition-colors border border-transparent hover:border-[#E2EDE2]">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-[11px] font-bold text-[#0F1F0F] leading-none font-jakarta">Admin User</span>
            <span className="text-[9px] text-[#6B7B6B] leading-none mt-0.5">WhatsFlow Agency</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#16A34A] flex items-center justify-center text-white shadow-sm ring-2 ring-white">
            <User className="w-4 h-4" />
          </div>
        </button>
      </div>
    </header>
  );
}
