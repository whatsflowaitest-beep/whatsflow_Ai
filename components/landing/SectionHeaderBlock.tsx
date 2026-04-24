import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderBlockProps {
  label: string;
  title: string;
  center?: boolean;
  className?: string;
  variant?: "default" | "white";
}

export function SectionHeaderBlock({ 
  label, 
  title, 
  center = false,
  className,
  variant = "default"
}: SectionHeaderBlockProps) {
  return (
    <div className={cn(
      "mb-12",
      center && "text-center",
      className
    )}>
      <p className={cn(
        "text-sm font-bold tracking-widest uppercase mb-4",
        variant === "default" ? "text-[#16A34A]" : "text-green-100"
      )}>
        {label}
      </p>
      <h2 className={cn(
        "text-3xl sm:text-5xl font-extrabold tracking-tighter leading-tight mb-8",
        variant === "default" ? "text-[#0f172a]" : "text-white"
      )}>
        {title}
      </h2>
    </div>
  );
}
