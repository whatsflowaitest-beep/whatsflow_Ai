"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import type { LeadFormData, LeadStage, LeadUrgency } from "@/types/index";

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
  onClose: () => void;
  onAdd: (data: LeadFormData) => void;
}

const INITIAL_DATA: LeadFormData = {
  name: "",
  phone: "",
  email: "",
  service: "",
  urgency: "" as any,
  source: "",
  stage: "New",
  assignedTo: "",
  notes: "",
};

export function AddLeadModal({ open, onClose, onAdd }: Props) {
  const [formData, setFormData] = useState<LeadFormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});

  function validate() {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.service) newErrors.service = "Please select a service";
    if (!formData.urgency) newErrors.urgency = "Please select urgency";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      onAdd(formData);
      handleClose();
    }
  }

  function handleClose() {
    setFormData(INITIAL_DATA);
    setErrors({});
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold text-[#0F1F0F]">Add New Lead</DialogTitle>
          <DialogDescription className="text-[#6B7B6B]">
            Fill in the lead details below
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {/* Row 1 */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-semibold text-[#0F1F0F]">
                Full Name*
              </Label>
              <Input
                id="name"
                placeholder="Sarah Johnson"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.name && <p className="text-[11px] text-red-500 font-medium">{errors.name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm font-semibold text-[#0F1F0F]">
                Phone Number*
              </Label>
              <Input
                id="phone"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.phone && <p className="text-[11px] text-red-500 font-medium">{errors.phone}</p>}
            </div>

            {/* Row 2 */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold text-[#0F1F0F]">
                Email
              </Label>
              <Input
                id="email"
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
              <Label htmlFor="assignedTo" className="text-sm font-semibold text-[#0F1F0F]">
                Assigned To
              </Label>
              <Input
                id="assignedTo"
                placeholder="Team member name"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              />
            </div>

            {/* Row 5 */}
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="notes" className="text-sm font-semibold text-[#0F1F0F]">
                Notes
              </Label>
              <Textarea
                id="notes"
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
              onClick={handleClose}
              className="text-[#6B7B6B] hover:text-[#0F1F0F]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#16A34A] hover:bg-[#15803D] text-white px-8"
            >
              Add Lead
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
