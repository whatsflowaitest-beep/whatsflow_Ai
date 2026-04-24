"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AutomationToggleProps {
  label: string;
  description?: string;
  defaultChecked?: boolean;
}

export function AutomationToggle({
  label,
  description,
  defaultChecked = true,
}: AutomationToggleProps) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <Label
          className={cn(
            "text-sm font-medium cursor-pointer",
            checked ? "text-[#0F1F0F]" : "text-[#6B7B6B]"
          )}
        >
          {label}
        </Label>
        {description && (
          <p className="text-xs text-[#6B7B6B] mt-0.5">{description}</p>
        )}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={setChecked}
        className="data-[state=checked]:bg-[#16A34A]"
      />
    </div>
  );
}
