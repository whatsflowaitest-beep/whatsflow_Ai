"use client";

import { useState } from "react";
import { Copy, X, MessageSquare, Info, Activity, User, Phone, Mail, MousePointer2, Calendar, Clock, CheckCircle2, Zap } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LeadStageBadge } from "./LeadStageBadge";
import { LeadUrgencyBadge } from "./LeadUrgencyBadge";
import { useToast } from "@/hooks/use-toast";
import { cn, timeAgo, formatDate } from "@/lib/utils";
import type { Lead } from "@/types/index";

interface Props {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export function ViewLeadDrawer({ lead, open, onClose, onEdit, onDelete }: Props) {
  const { toast } = useToast();

  if (!lead) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Phone copied to clipboard", "info");
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-[480px] p-0 border-none shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#F0F7F0] shrink-0 relative">
          <div className="flex flex-col items-center text-center mt-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-inner ring-4 ring-white bg-[#22C55E]"
              style={{ backgroundColor: "#22C55E" }}
            >
              {lead.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-[#0F1F0F] mt-3">{lead.name}</h2>
            <div className="flex items-center gap-1.5 mt-1 text-[#6B7B6B]">
              <span className="text-sm font-medium">{lead.phone}</span>
              <button
                onClick={() => copyToClipboard(lead.phone)}
                className="p-1 hover:text-[#16A34A] transition-colors"
                title="Copy phone"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="mt-3">
              <LeadStageBadge stage={lead.stage} className="text-[11px] px-3 py-1" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="details" className="flex-1 flex flex-col min-h-0">
          <div className="px-6 border-b border-[#F0F7F0]">
            <TabsList className="w-full bg-[#F8FAF8] p-1 h-11 border border-[#E2EDE2]">
              <TabsTrigger value="details" className="flex-1 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-[#16A34A] data-[state=active]:shadow-sm">
                Details
              </TabsTrigger>
              <TabsTrigger value="conversation" className="flex-1 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-[#16A34A] data-[state=active]:shadow-sm">
                Conversation
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex-1 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-[#16A34A] data-[state=active]:shadow-sm">
                Activity
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            {/* Tab 1: Details */}
            <TabsContent value="details" className="m-0 space-y-8">
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-[#6B7B6B] uppercase tracking-wider flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> Contact Info
                </h3>
                <div className="grid grid-cols-1 gap-4 bg-[#F8FAF8] p-4 rounded-xl border border-[#E2EDE2]">
                  <DetailItem label="Full Name" value={lead.name} />
                  <DetailItem
                    label="Phone"
                    value={lead.phone}
                    action={<button onClick={() => copyToClipboard(lead.phone)} className="ml-auto text-[#16A34A] hover:underline text-xs font-medium">Copy</button>}
                  />
                  <DetailItem label="Email" value={lead.email || "—"} />
                  <DetailItem label="Lead Source" value={lead.source} />
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-xs font-bold text-[#6B7B6B] uppercase tracking-wider flex items-center gap-2">
                  <Info className="w-3.5 h-3.5" /> Lead Info
                </h3>
                <div className="grid grid-cols-1 gap-4 bg-[#F8FAF8] p-4 rounded-xl border border-[#E2EDE2]">
                  <DetailItem label="Service" value={lead.service} />
                  <DetailItem label="Urgency" value={<LeadUrgencyBadge urgency={lead.urgency} />} />
                  <DetailItem label="Stage" value={<LeadStageBadge stage={lead.stage} />} />
                  <DetailItem label="Assigned To" value={lead.assignedTo || "Unassigned"} />
                  <DetailItem label="Created" value={formatDate(lead.createdAt)} />
                  <DetailItem label="Last Activity" value={timeAgo(lead.lastActivity)} />
                </div>
              </section>

              {lead.notes && (
                <section className="space-y-4">
                  <h3 className="text-xs font-bold text-[#6B7B6B] uppercase tracking-wider">Notes</h3>
                  <div className="bg-[#FFFBEB] p-4 rounded-xl border border-amber-100 text-sm text-[#92400E] leading-relaxed italic">
                    "{lead.notes}"
                  </div>
                </section>
              )}
            </TabsContent>

            {/* Tab 2: Conversation */}
            <TabsContent value="conversation" className="m-0 flex flex-col bg-[#F0F7F0]/30 rounded-xl border border-[#D1E1D1] overflow-hidden">
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div className="flex justify-center">
                  <span className="text-[10px] bg-white text-[#6B7B6B] px-2 py-0.5 rounded shadow-sm">Yesterday</span>
                </div>

                <ChatBubble side="left" content={`Hi, I'm interested in ${lead.service}. Can I get more details?`} time="2:14 PM" />
                <ChatBubble side="right" content={`Hi ${lead.name.split(' ')[0]}! 👋 I'd love to help you with ${lead.service}. Are you looking for something soon?`} time="2:14 PM" />
                <ChatBubble side="left" content={`Yes, ideally ${lead.urgency.toLowerCase()}.`} time="2:15 PM" />
                <ChatBubble side="right" content={`Perfect! we have some openings available. Would you like to see our pricing or book a consultation?`} time="2:16 PM" />

                <div className="flex justify-center pt-2">
                  <span className="text-[10px] bg-white text-[#6B7B6B] px-2 py-0.5 rounded shadow-sm">Today</span>
                </div>
                <ChatBubble side="left" content="I'll take a look at the booking link now." time="10:05 AM" />
                <ChatBubble side="right" content="Great! Let me know if you have any trouble with the link. 😊" time="10:06 AM" />
              </div>

              <div className="p-3 bg-white border-t border-[#D1E1D1] text-center">
                <p className="text-[10px] text-[#6B7B6B] font-medium flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3 text-[#16A34A] fill-[#16A34A]" />
                  Conversation managed by WhatsFlow AI
                </p>
              </div>
            </TabsContent>

            {/* Tab 3: Activity */}
            <TabsContent value="activity" className="m-0 px-2">
              <div className="relative border-l-2 border-[#E2EDE2] ml-3 pl-6 space-y-8 py-2">
                <TimelineItem dotColor="bg-green-500" title="Lead created" time={formatDate(lead.createdAt, true)} />
                <TimelineItem dotColor="bg-[#16A34A]" title="AI sent greeting" time="2 mins after creation" />
                <TimelineItem dotColor="bg-[#16A34A]" title="Lead qualified" time="5 mins after creation" />
                <TimelineItem dotColor="bg-blue-500" title="Booking link sent" time="6 mins after creation" />
                {lead.stage === "Booked" && (
                  <TimelineItem dotColor="bg-[#16A34A]" title="Appointment booked" time={timeAgo(lead.lastActivity)} icon={<CheckCircle2 className="w-3.5 h-3.5 text-white" />} />
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer */}
        <div className="p-6 border-t border-[#F0F7F0] bg-[#F8FAF8] grid grid-cols-2 gap-3 shrink-0">
          <Button variant="outline" className="text-[#6B7B6B]" onClick={() => onEdit(lead)}>
            Edit Lead
          </Button>
          <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => onDelete(lead)}>
            Delete Lead
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DetailItem({ label, value, action }: { label: string; value: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[#6B7B6B]">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-[#0F1F0F]">{value}</span>
        {action}
      </div>
    </div>
  );
}

function ChatBubble({ side, content, time }: { side: "left" | "right"; content: string; time: string }) {
  return (
    <div className={cn("flex flex-col max-w-[85%]", side === "right" ? "ml-auto items-end" : "mr-auto items-start")}>
      <div className={cn("p-3 rounded-2xl text-sm shadow-sm", side === "right" ? "bg-[#DCFCE7] text-[#0F1F0F] rounded-tr-none" : "bg-white text-[#0F1F0F] border border-[#E2EDE2] rounded-tl-none")}>
        {content}
      </div>
      <span className="text-[10px] text-[#6B7B6B] mt-1 px-1">{time}</span>
    </div>
  );
}

function TimelineItem({ dotColor, title, time, icon }: { dotColor: string; title: string; time: string; icon?: React.ReactNode }) {
  return (
    <div className="relative">
      <div className={cn("absolute -left-[31px] top-1.5 w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm", dotColor)}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-[#0F1F0F]">{title}</p>
        <p className="text-xs text-[#6B7B6B] mt-0.5">{time}</p>
      </div>
    </div>
  );
}
