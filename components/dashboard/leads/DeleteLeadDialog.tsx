"use client";

import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  open: boolean;
  leadName: string | null;
  leadCount?: number;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteLeadDialog({
  open,
  leadName,
  leadCount,
  onClose,
  onConfirm,
}: Props) {
  const isBulk = leadCount !== undefined && leadCount > 1;

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent className="sm:max-w-[420px]">
        <div className="flex flex-col items-center justify-center pt-4 pb-2">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-xl font-bold">
              {isBulk ? `Delete ${leadCount} Leads?` : "Delete Lead?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-[#6B7B6B] mt-2">
              {isBulk ? (
                <>
                  This will permanently delete <span className="font-semibold text-[#0F1F0F]">{leadCount}</span> selected lead records 
                  and all associated data. This action cannot be undone.
                </>
              ) : (
                <>
                  This will permanently delete <span className="font-semibold text-[#0F1F0F]">{leadName}</span>'s record 
                  and all associated data. This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter className="sm:justify-center gap-3">
          <AlertDialogCancel 
            className="sm:flex-1 h-11 border-[#E2EDE2] text-[#6B7B6B] hover:text-[#0F1F0F]"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              onConfirm();
            }}
            className="sm:flex-1 h-11 bg-red-500 hover:bg-red-600 border-none text-white shadow-sm"
          >
            {isBulk ? "Delete Selected" : "Delete Lead"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
