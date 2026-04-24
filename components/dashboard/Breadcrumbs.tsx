"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter((path) => path !== "");

  // Don't show on main dashboard overview
  if (paths.length <= 1) return null;

  return (
    <nav className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#6B7B6B] mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 hover:text-[#16A34A] transition-colors"
      >
        <Home className="w-3 h-3" />
        <span>Dashboard</span>
      </Link>

      {paths.slice(1).map((path, index) => {
        const href = `/${paths.slice(0, index + 2).join("/")}`;
        const isLast = index === paths.length - 2;
        const label = path.replace(/-/g, " ");

        return (
          <div key={path} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />
            <Link
              href={href}
              className={cn(
                "transition-colors capitalize",
                isLast
                  ? "text-[#16A34A] font-extrabold"
                  : "hover:text-[#16A34A]"
              )}
            >
              {label}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
