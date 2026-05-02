"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AutomationToggleProps {
  label: string;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function AutomationToggle({
  label,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
}: AutomationToggleProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);

  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleChange = (val: boolean) => {
    if (!isControlled) {
      setInternalChecked(val);
    }
    if (onCheckedChange) {
      onCheckedChange(val);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <Label
          className={cn(
            "text-sm font-medium cursor-pointer",
            isChecked ? "text-[#0F1F0F] dark:text-[#F9FAFB]" : "text-[#6B7B6B] dark:text-[#9CA3AF]"
          )}
        >
          {label}
        </Label>
        {description && (
          <p className="text-xs text-[#6B7B6B] dark:text-[#9CA3AF] mt-0.5">{description}</p>
        )}
      </div>
      <Switch
        checked={isChecked}
        onCheckedChange={handleChange}
        className="data-[state=checked]:bg-[#16A34A]"
      />
    </div>
  );
}


