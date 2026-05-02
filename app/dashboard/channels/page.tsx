"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Mail, Globe, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Channel {
  id: string;
  name: string;
  platform: string;
  desc: string;
  status: "connected" | "disconnected";
  icon: any;
}

export default function ChannelsPage() {
  const { toast } = useToast();
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: "ch-1",
      name: "WhatsApp Business API",
      platform: "WhatsApp",
      desc: "Connect your official WhatsApp number via Twilio or Cloud API",
      status: "connected",
      icon: MessageSquare
    },
    {
      id: "ch-2",
      name: "Instagram Direct",
      platform: "Instagram",
      desc: "Automate direct messages and qualify story interactions",
      status: "disconnected",
      icon: Globe
    },
    {
      id: "ch-3",
      name: "Messenger Chat",
      platform: "Messenger",
      desc: "Integrate with Facebook pages to reply to incoming messages",
      status: "disconnected",
      icon: MessageSquare
    },
    {
      id: "ch-4",
      name: "Email Support inbox",
      platform: "Email",
      desc: "Send and receive support and sales emails on behalf of the agent",
      status: "disconnected",
      icon: Mail
    }
  ]);

  function toggleConnection(id: string) {
    setChannels(prev => prev.map(ch => {
      if (ch.id === id) {
        const nextStatus = ch.status === "connected" ? "disconnected" : "connected";
        toast(`${ch.platform} is now ${nextStatus === "connected" ? "connected" : "disconnected"}`, "success");
        return { ...ch, status: nextStatus as any };
      }
      return ch;
    }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB]">Multi-Channel Integration</h1>
        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
          Connect all your customer-facing communication channels to the unified WhatsFlow AI workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {channels.map((ch) => {
          const Icon = ch.icon;
          const isConnected = ch.status === "connected";
          return (
            <div
              key={ch.id}
              className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-[#22C55E]/20 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 dark:bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">{ch.name}</h4>
                      <p className="text-[10px] text-[#22C55E] font-semibold uppercase tracking-wider">{ch.platform}</p>
                    </div>
                  </div>
                  {isConnected ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#22C55E] bg-[#E8FBF0] dark:bg-[#22C55E]/10 px-2.5 py-1 rounded-xl">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#6B7280] dark:text-[#9CA3AF] bg-[#F9FAFB] dark:bg-[#0B0F1A] border border-[#E5E7EB] dark:border-[#1F2937] px-2.5 py-1 rounded-xl">
                      <AlertCircle className="w-3.5 h-3.5" /> Disconnected
                    </span>
                  )}
                </div>

                <p className="text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed mb-4">
                  {ch.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#1F2937] flex items-center justify-between">
                <span className="text-[11px] font-medium text-[#6B7280] dark:text-[#9CA3AF]">
                  Last synced: {isConnected ? "Just now" : "Not connected"}
                </span>
                <Button
                  onClick={() => toggleConnection(ch.id)}
                  className={isConnected
                    ? "bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] text-[#6B7280] dark:text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 h-9 px-4 rounded-xl font-bold transition-all"
                    : "bg-[#22C55E] hover:bg-[#16A34A] text-white h-9 px-4 rounded-xl font-bold shadow-md shadow-[#22C55E]/15 transition-all"
                  }
                >
                  {isConnected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
