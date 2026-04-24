import { Suspense } from "react";
import LeadsPageClient from "./LeadsPageClient";
import { Skeleton } from "@/components/ui/skeleton";

function LeadsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-11 w-full max-w-md" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-xl" />
          ))}
        </div>
      </div>
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LeadsSkeleton />}>
      <LeadsPageClient />
    </Suspense>
  );
}
