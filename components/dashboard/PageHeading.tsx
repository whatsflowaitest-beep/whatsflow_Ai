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
        <h1 className="text-2xl font-bold text-[#0F1F0F] flex items-center gap-2">
          {title}
          {count !== undefined && (
            <span className="bg-[#DCFCE7] text-[#16A34A] text-xs font-bold px-2 py-0.5 rounded-full ring-1 ring-[#16A34A]/20">
              {count}
            </span>
          )}
        </h1>
        {description && (
          <p className="text-sm text-[#6B7B6B] leading-relaxed max-w-2xl font-medium">
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
