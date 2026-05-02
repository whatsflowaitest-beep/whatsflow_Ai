import { Suspense } from "react";
import SettingsClient from "./SettingsClient";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-8 h-8 text-[#22C55E] animate-spin" />
        <p className="text-sm font-bold text-[#6B7280] dark:text-[#9CA3AF] animate-pulse">Synchronizing Core Data...</p>
      </div>
    }>
      <SettingsClient />
    </Suspense>
  );
}
