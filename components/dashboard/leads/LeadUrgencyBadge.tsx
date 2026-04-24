import { cn } from "@/lib/utils";
import type { LeadUrgency } from "@/types/index";

const URGENCY_STYLES: Record<LeadUrgency, string> = {
  Today: "bg-red-50 text-red-600 border-red-100",
  "This Week": "bg-orange-50 text-orange-600 border-orange-100",
  "Next Week": "bg-yellow-50 text-yellow-700 border-yellow-100",
  "This Month": "bg-blue-50 text-blue-600 border-blue-100",
  Flexible: "bg-gray-50 text-gray-500 border-gray-100",
};

interface Props {
  urgency: LeadUrgency;
  className?: string;
}

export function LeadUrgencyBadge({ urgency, className }: Props) {
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded border text-[11px] font-medium whitespace-nowrap",
        URGENCY_STYLES[urgency] || URGENCY_STYLES.Flexible,
        className
      )}
    >
      {urgency}
    </span>
  );
}
