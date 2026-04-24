"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  subLabel: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  icon: React.ReactNode;
  index?: number;
}

export function StatCard({
  label,
  value,
  subLabel,
  trend,
  trendValue,
  icon,
  index = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-white rounded-xl border border-[#E2EDE2] shadow-sm p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[#6B7B6B]">{label}</p>
        <div className="w-9 h-9 rounded-lg bg-[#F0F7F0] flex items-center justify-center text-[#16A34A]">
          {icon}
        </div>
      </div>

      <div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + index * 0.08 }}
          className="text-3xl font-bold text-[#0F1F0F]"
        >
          {value}
        </motion.p>
        <p className="text-xs text-[#6B7B6B] mt-0.5">{subLabel}</p>
      </div>

      <div className="flex items-center gap-1.5">
        {trend === "up" && (
          <TrendingUp className="w-3.5 h-3.5 text-[#16A34A]" />
        )}
        {trend === "down" && (
          <TrendingDown className="w-3.5 h-3.5 text-red-500" />
        )}
        {trend === "neutral" && (
          <Minus className="w-3.5 h-3.5 text-[#6B7B6B]" />
        )}
        <span
          className={cn(
            "text-xs font-medium",
            trend === "up" && "text-[#16A34A]",
            trend === "down" && "text-red-500",
            trend === "neutral" && "text-[#6B7B6B]"
          )}
        >
          {trendValue}
        </span>
      </div>
    </motion.div>
  );
}
