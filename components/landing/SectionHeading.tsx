import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  center?: boolean;
  className?: string;
}

export function SectionHeading({ 
  title, 
  center = false,
  className 
}: SectionHeadingProps) {
  return (
    <h2 className={cn(
      "text-3xl sm:text-4xl font-bold text-[#0f172a] mb-4",
      center && "text-center",
      className
    )}>
      {title}
    </h2>
  );
}
