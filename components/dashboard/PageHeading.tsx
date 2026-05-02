import React from "react";
import { cn } from "@/lib/utils";

interface PageHeadingProps {
  title: string;
  count?: number;
  description?: string;
  rightContent?: React.ReactNode;
  className?: string;
}

export function PageHeading({
  title,
  count,
  description,
  rightContent,
  className
}: PageHeadingProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8", className)}>
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-2">
          {title}
          {count !== undefined && (
            <span className="bg-green-100 dark:bg-green-900/30 text-[#16A34A] dark:text-green-400 text-xs font-bold px-2 py-0.5 rounded-full ring-1 ring-green-600/20">
              {count}
            </span>
          )}
        </h1>
        {description && (
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed max-w-2xl font-medium">
            {description}
          </p>
        )}
      </div>

      {rightContent && (
        <div className="flex items-center gap-3 shrink-0">
          {rightContent}
        </div>
      )}
    </div>
  );
}
