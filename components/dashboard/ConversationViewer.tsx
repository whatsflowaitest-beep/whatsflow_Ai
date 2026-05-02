"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, Pause, Play, ChevronRight, X, Loader2, Send, MessageSquare, MessagesSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-config";
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

  return <Badge variant={variant as any} className="rounded-lg">{label}</Badge>;
}

export function ConversationViewer() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function loadConversations() {
      try {
        const data = await apiFetch('/api/conversations');
        setConversations(data);
        if (data.length > 0 && !activeId) {
          setActiveId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to load conversations:", err);
      } finally {
        setLoading(false);
      }
    }
    loadConversations();

    const interval = setInterval(loadConversations, 10000);
    return () => clearInterval(interval);
  }, [activeId]);

  const active = conversations.find((c) => c.id === activeId);
  const filters = ["All", "Active", "Booked", "Needs Attention"];

  if (loading && conversations.length === 0) {
    return (
      <div className="flex h-[calc(100vh-8rem)] rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] overflow-hidden bg-white dark:bg-[#111827] shadow-sm items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#22C55E] animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] rounded-2xl border border-[#E5E7EB] dark:border-[#1F2937] overflow-hidden bg-white dark:bg-[#111827] shadow-sm transition-colors duration-300">
      {/* Left panel */}
      <div className="w-80 border-r border-[#E5E7EB] dark:border-[#1F2937] flex flex-col shrink-0 bg-white dark:bg-[#111827]">
        {/* Search */}
        <div className="p-3 border-b border-[#E5E7EB] dark:border-[#1F2937]">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full text-sm px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1F2937] bg-[#F9FAFB] dark:bg-[#0B0F1A] text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-1 px-3 py-2 border-b border-[#E5E7EB] dark:border-[#1F2937] overflow-x-auto scrollbar-hide bg-white dark:bg-[#111827]">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f.toLowerCase())}
              className={cn(
                "text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors",
                filter === f.toLowerCase()
                  ? "bg-[#22C55E] text-white shadow-sm"
                  : "bg-[#F9FAFB] dark:bg-[#0B0F1A] text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB]"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-[#111827]">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">No conversations found.</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveId(conv.id)}
                className={cn(
                  "w-full text-left p-4 border-b border-[#E5E7EB] dark:border-[#1F2937] transition-all hover:bg-[#F9FAFB] dark:hover:bg-[#0B0F1A]",
                  activeId === conv.id &&
                  "bg-[#22C55E]/10 dark:bg-[#22C55E]/5 border-l-[3px] border-l-[#22C55E] pl-[13px]"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-[#22C55E]/10 dark:bg-[#22C55E]/20 flex items-center justify-center">
                      <span className="text-[#22C55E] text-xs font-bold">
                        {conv.leadName?.split(" ").map((n) => n[0]).join("") || "?"}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#111827]",
                        conv.aiActive ? "bg-[#22C55E]" : "bg-orange-400"
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB] truncate">
                        {conv.leadName || "New Contact"}
                      </span>
                      <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] shrink-0 ml-1">
                        {timeAgo(conv.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] truncate">
                      {conv.lastMessage || "No messages yet"}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right panel */}
      {active ? (
        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#111827]">
          {/* Chat header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5E7EB] dark:border-[#1F2937] bg-white dark:bg-[#111827]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#22C55E]/10 dark:bg-[#22C55E]/20 flex items-center justify-center">
                <span className="text-[#22C55E] text-sm font-bold">
                  {active.leadName?.split(" ").map((n) => n[0]).join("") || "?"}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB]">
                  {active.leadName || "New Contact"}
                </p>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">{active.phone}</p>
              </div>
              <StageBadge stage={active.stage} />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 text-xs font-bold rounded-xl",
                  active.aiActive
                    ? "border-orange-300 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10"
                    : "border-[#22C55E] text-[#22C55E] hover:bg-green-50 dark:hover:bg-[#22C55E]/10 bg-white dark:bg-[#111827]"
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
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-[#F9FAFB] dark:bg-[#0B0F1A]">
            {active.messages?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 opacity-50">
                <MessageSquare className="w-8 h-8 text-[#6B7280] dark:text-[#9CA3AF]" />
                <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">No messages in this conversation.</p>
              </div>
            ) : (
              active.messages?.map((msg, i) => (
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
                        ? "bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-tl-sm text-[#111827] dark:text-[#F9FAFB]"
                        : "bg-[#E8FBF0] dark:bg-[#22C55E]/20 border border-green-200 dark:border-[#22C55E]/30 rounded-tr-sm text-[#111827] dark:text-[#F9FAFB]"
                    )}
                  >
                    <p className="text-sm leading-relaxed">
                      {msg.content}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF]">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Bottom input bar */}
          <div className="px-5 py-3 border-t border-[#E5E7EB] dark:border-[#1F2937] bg-white dark:bg-[#111827]">
            <div className="flex items-center gap-3">
              <div className="flex-1 rounded-xl bg-[#F9FAFB] dark:bg-[#0B0F1A] border border-[#E5E7EB] dark:border-[#1F2937] px-4 py-2.5">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full bg-transparent border-none focus:outline-none text-sm text-[#111827] dark:text-[#F9FAFB]"
                />
              </div>
              <Button
                size="sm"
                className="h-9 w-9 p-0 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl shrink-0 active:scale-95 transition-all shadow-md shadow-[#22C55E]/15"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#F9FAFB] dark:bg-[#0B0F1A] opacity-60">
          <MessagesSquare className="w-12 h-12 text-[#6B7280] dark:text-[#9CA3AF] mb-4" />
          <h3 className="text-lg font-bold text-[#111827] dark:text-[#F9FAFB]">Select a conversation</h3>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Choose a lead from the left to view their chat history.</p>
        </div>
      )}

      {/* Lead info sidebar */}
      {active && (
        <div className="hidden xl:flex w-64 border-l border-[#E5E7EB] dark:border-[#1F2937] flex-col bg-[#F9FAFB] dark:bg-[#111827]">
          <div className="p-4 border-b border-[#E5E7EB] dark:border-[#1F2937]">
            <h4 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">Lead Details</h4>
          </div>
          <div className="p-4 space-y-4">
            {[
              { label: "Name", value: active.leadName || "New Contact" },
              { label: "Phone", value: active.phone },
              { label: "Stage", value: active.stage },
              {
                label: "AI Status",
                value: active.aiActive ? "Active" : "Paused",
              },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wide mb-1">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB] capitalize">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
