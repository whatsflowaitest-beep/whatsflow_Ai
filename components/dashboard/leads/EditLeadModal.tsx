"use client";

import { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Lead, LeadFormData, LeadStage, LeadUrgency } from "@/types/index";

const SERVICES = [
  "Dental Checkup",
  "Teeth Whitening",
  "Dental Implants",
  "Property Buying",
  "Property Selling",
  "Property Rental",
  "Hair & Styling",
  "Spa & Massage",
  "Physiotherapy",
  "General Inquiry",
];

const URGENCY: LeadUrgency[] = [
  "Today",
  "This Week",
  "Next Week",
  "This Month",
  "Flexible",
];

const SOURCES = [
  "WhatsApp Ad",
  "Organic WhatsApp",
  "Referral",
  "Instagram",
  "Facebook",
  "Website",
  "Walk-in",
  "Other",
];

const STAGES: LeadStage[] = [
  "New",
  "Qualifying",
  "Qualified",
  "Booked",
  "Lost",
];

interface Props {
  open: boolean;
  lead: Lead | null;
  onClose: () => void;
  onSave: (id: string, data: LeadFormData) => void;
}

export function EditLeadModal({ open, lead, onClose, onSave }: Props) {
  const [formData, setFormData] = useState<LeadFormData | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        phone: lead.phone,
        email: lead.email || "",
        service: lead.service,
        urgency: lead.urgency,
        source: lead.source,
        stage: lead.stage,
        assignedTo: lead.assignedTo || "",
        notes: lead.notes || "",
      });
      setErrors({});
    }
  }, [lead, open]);

  if (!formData) return null;

  const isDirty = lead && (
    formData.name !== lead.name ||
    formData.phone !== lead.phone ||
    formData.email !== (lead.email || "") ||
    formData.service !== lead.service ||
    formData.urgency !== lead.urgency ||
    formData.source !== lead.source ||
    formData.stage !== lead.stage ||
    formData.assignedTo !== (lead.assignedTo || "") ||
    formData.notes !== (lead.notes || "")
  );

  function validate() {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};
    if (!formData!.name.trim()) newErrors.name = "Full name is required";
    if (!formData!.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData!.service) newErrors.service = "Please select a service";
    if (!formData!.urgency) newErrors.urgency = "Please select urgency";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate() && lead) {
      onSave(lead.id, formData!);
      onClose();
    }
  }

  function handleCancel() {
    if (isDirty) {
      setShowConfirmCancel(true);
    } else {
      onClose();
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && handleCancel()}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-6 pb-0 text-left">
            <DialogTitle className="text-xl font-bold text-[#0F1F0F]">Edit Lead</DialogTitle>
            <DialogDescription className="text-[#6B7B6B]">
              Update lead information
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {/* Row 1 */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-name" className="text-sm font-semibold text-[#0F1F0F]">
                  Full Name*
                </Label>
                <Input
                  id="edit-name"
                  placeholder="Sarah Johnson"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.name && <p className="text-[11px] text-red-500 font-medium">{errors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-phone" className="text-sm font-semibold text-[#0F1F0F]">
                  Phone Number*
                </Label>
                <Input
                  id="edit-phone"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.phone && <p className="text-[11px] text-red-500 font-medium">{errors.phone}</p>}
              </div>

              {/* Row 2 */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-email" className="text-sm font-semibold text-[#0F1F0F]">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="sarah@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-[#0F1F0F]">
                  Service Needed*
                </Label>
                <Select
                  value={formData.service}
                  onValueChange={(v) => setFormData({ ...formData, service: v })}
                >
                  <SelectTrigger className={errors.service ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.service && <p className="text-[11px] text-red-500 font-medium">{errors.service}</p>}
              </div>

              {/* Row 3 */}
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-[#0F1F0F]">
                  Urgency*
                </Label>
                <Select
                  value={formData.urgency}
                  onValueChange={(v) => setFormData({ ...formData, urgency: v as any })}
                >
                  <SelectTrigger className={errors.urgency ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    {URGENCY.map((u) => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.urgency && <p className="text-[11px] text-red-500 font-medium">{errors.urgency}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-[#0F1F0F]">
                  Lead Source
                </Label>
                <Select
                  value={formData.source}
                  onValueChange={(v) => setFormData({ ...formData, source: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOURCES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Row 4 */}
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-[#0F1F0F]">
                  Stage
                </Label>
                <Select
                  value={formData.stage}
                  onValueChange={(v) => setFormData({ ...formData, stage: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-assignedTo" className="text-sm font-semibold text-[#0F1F0F]">
                  Assigned To
                </Label>
                <Input
                  id="edit-assignedTo"
                  placeholder="Team member name"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                />
              </div>

              {/* Row 5 */}
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="edit-notes" className="text-sm font-semibold text-[#0F1F0F]">
                  Notes
                </Label>
                <Textarea
                  id="edit-notes"
                  placeholder="Any additional context..."
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0F7F0]">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                className="text-[#6B7B6B] hover:text-[#0F1F0F]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#16A34A] hover:bg-[#15803D] text-white px-8 shadow-sm"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmCancel} onOpenChange={setShowConfirmCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Discard changes?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Any unsaved changes will be lost. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Editing</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                setShowConfirmCancel(false);
                onClose();
              }}
              className="bg-red-500 hover:bg-red-600 border-none"
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
