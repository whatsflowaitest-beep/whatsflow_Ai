"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Pause, Play, ChevronRight, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockConversations } from "@/lib/mock-data";
import { timeAgo, formatTime } from "@/lib/utils";
import type { Conversation, LeadStage } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function StageBadge({ stage }: { stage: LeadStage }) {
  const config: Record<string, { variant: "success" | "blue" | "gray" | "destructive" | "warning"; label: string }> = {
    Booked: { variant: "success", label: "Booked" },
    Qualified: { variant: "blue", label: "Qualified" },
    Qualifying: { variant: "warning", label: "Qualifying" },
    New: { variant: "gray", label: "New" },
    Lost: { variant: "destructive", label: "Lost" },
  };
  
  const item = config[stage] || config.New;
  const { variant, label } = item;
  
  return <Badge variant={variant as any}>{label}</Badge>;
}

export function ConversationViewer() {
  const [activeId, setActiveId] = useState(mockConversations[0].id);
  const [filter, setFilter] = useState("all");

  const active = mockConversations.find((c) => c.id === activeId)!;
  const filters = ["All", "Active", "Booked", "Needs Attention"];

  return (
    <div className="flex h-[calc(100vh-7rem)] rounded-xl border border-[#E2EDE2] overflow-hidden bg-white shadow-sm">
      {/* Left panel */}
      <div className="w-80 border-r border-[#E2EDE2] flex flex-col shrink-0">
        {/* Search */}
        <div className="p-3 border-b border-[#E2EDE2]">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full text-sm px-3 py-2 rounded-lg border border-[#E2EDE2] bg-[#F8FAF8] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-1 px-3 py-2 border-b border-[#E2EDE2] overflow-x-auto scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f.toLowerCase())}
              className={cn(
                "text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap transition-colors",
                filter === f.toLowerCase()
                  ? "bg-[#16A34A] text-white"
                  : "bg-[#F0F7F0] text-[#6B7B6B] hover:text-[#0F1F0F]"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {mockConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveId(conv.id)}
              className={cn(
                "w-full text-left p-4 border-b border-[#E2EDE2] transition-all hover:bg-[#F8FAF8]",
                activeId === conv.id &&
                  "bg-green-50 border-l-[3px] border-l-[#16A34A] pl-[13px]"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                    <span className="text-[#16A34A] text-xs font-bold">
                      {conv.leadName.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white",
                      conv.aiActive ? "bg-[#16A34A]" : "bg-orange-400"
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-semibold text-[#0F1F0F] truncate">
                      {conv.leadName}
                    </span>
                    <span className="text-[10px] text-[#6B7B6B] shrink-0 ml-1">
                      {timeAgo(conv.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7B6B] truncate">
                    {conv.lastMessage}
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[#16A34A] text-white text-[10px] font-bold flex items-center justify-center">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E2EDE2] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#DCFCE7] flex items-center justify-center">
              <span className="text-[#16A34A] text-sm font-bold">
                {active.leadName.split(" ").map((n) => n[0]).join("")}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F1F0F]">
                {active.leadName}
              </p>
              <p className="text-xs text-[#6B7B6B]">{active.phone}</p>
            </div>
            <StageBadge stage={active.stage} />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8 text-xs",
                active.aiActive
                  ? "border-orange-300 text-orange-500 hover:bg-orange-50"
                  : "border-green-300 text-[#16A34A] hover:bg-green-50"
              )}
            >
              {active.aiActive ? (
                <>
                  <Pause className="w-3 h-3 mr-1" />
                  Pause AI
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 mr-1" />
                  Resume AI
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-5 py-4 space-y-4"
          style={{ background: "#F9FBF9" }}
        >
          {active.messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={cn(
                "flex",
                msg.sender === "user" ? "justify-start" : "justify-end"
              )}
            >
              <div
                className={cn(
                  "max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm",
                  msg.sender === "user"
                    ? "bg-white border border-[#E2EDE2] rounded-tl-sm"
                    : "bg-[#DCFCE7] border border-green-200 rounded-tr-sm"
                )}
              >
                <p className="text-sm text-[#0F1F0F] leading-relaxed">
                  {msg.content}
                </p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  {msg.sender === "ai" && (
                    <span className="text-[10px] text-[#6B7B6B]">
                      Sent via WhatsApp AI
                    </span>
                  )}
                  <span className="text-[10px] text-[#6B7B6B]">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom input bar */}
        <div className="px-5 py-3 border-t border-[#E2EDE2] bg-white">
          <div className="flex items-center gap-3">
            <div className="flex-1 rounded-lg bg-[#F8FAF8] border border-[#E2EDE2] px-4 py-2.5">
              <p className="text-sm text-[#6B7B6B]">
                AI is managing this conversation
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs border-[#E2EDE2] text-[#6B7B6B] hover:border-[#16A34A] hover:text-[#16A34A] shrink-0"
            >
              Take Over
            </Button>
          </div>
        </div>
      </div>

      {/* Lead info sidebar */}
      <div className="hidden xl:flex w-64 border-l border-[#E2EDE2] flex-col bg-[#F8FAF8]">
        <div className="p-4 border-b border-[#E2EDE2]">
          <h4 className="text-sm font-semibold text-[#0F1F0F]">Lead Details</h4>
        </div>
        <div className="p-4 space-y-4">
          {[
            { label: "Name", value: active.leadName },
            { label: "Phone", value: active.phone },
            { label: "Service", value: active.service },
            { label: "Stage", value: active.stage },
            {
              label: "AI Status",
              value: active.aiActive ? "Active" : "Paused",
            },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs font-medium text-[#6B7B6B] uppercase tracking-wide mb-1">
                {item.label}
              </p>
              <p className="text-sm font-medium text-[#0F1F0F] capitalize">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
