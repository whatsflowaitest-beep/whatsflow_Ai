"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Bot, Edit3, Trash2, Send, Sparkles, Wand2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Agent {
  id: string;
  name: string;
  role: string;
  instructions: string;
  tone: string;
  status: "active" | "paused";
}

export default function AIAgentsPage() {
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "a1",
      name: "Sales Closer AI",
      role: "Lead qualification and appointment booking",
      instructions: "Greet the user politely. Answer questions about pricing and dental services. If the user is interested, ask for their preferred time and day for the appointment.",
      tone: "Professional & Helpful",
      status: "active"
    },
    {
      id: "a2",
      name: "Customer Support AI",
      role: "Troubleshooting and post-booking support",
      instructions: "Assist returning customers with any rescheduling or billing inquiries. Be extremely empathetic and maintain a positive tone.",
      tone: "Friendly & Warm",
      status: "active"
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [instructions, setInstructions] = useState("");
  const [tone, setTone] = useState("Professional");

  // Live preview states
  const [previewInput, setPreviewInput] = useState("");
  const [previewHistory, setPreviewHistory] = useState<{ sender: "user" | "ai"; text: string }[]>([
    { sender: "ai", text: "Hello! I'm Sales Closer AI. How can I help you today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  function handleAddAgent() {
    if (!name || !role || !instructions) {
      toast("Please fill in all fields", "error");
      return;
    }
    const newAgent: Agent = {
      id: Math.random().toString(36).slice(2, 9),
      name,
      role,
      instructions,
      tone,
      status: "active"
    };
    setAgents([...agents, newAgent]);
    setIsCreating(false);
    resetForm();
    toast("AI Agent created successfully! ✓", "success");
  }

  function handleEditClick(agent: Agent) {
    setEditingAgent(agent);
    setName(agent.name);
    setRole(agent.role);
    setInstructions(agent.instructions);
    setTone(agent.tone);
    setIsCreating(true);
  }

  function handleUpdateAgent() {
    if (!editingAgent) return;
    setAgents(agents.map(a => a.id === editingAgent.id ? { ...a, name, role, instructions, tone } : a));
    setIsCreating(false);
    resetForm();
    toast("AI Agent updated successfully! ✓", "success");
  }

  function handleDeleteAgent(id: string) {
    setAgents(agents.filter(a => a.id !== id));
    toast("AI Agent deleted", "error");
  }

  function resetForm() {
    setEditingAgent(null);
    setName("");
    setRole("");
    setInstructions("");
    setTone("Professional");
  }

  function handleTestMessage() {
    if (!previewInput.trim()) return;
    const msg = previewInput;
    setPreviewInput("");
    setPreviewHistory(prev => [...prev, { sender: "user", text: msg }]);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setPreviewHistory(prev => [...prev, {
        sender: "ai",
        text: `Thanks for asking! Based on my persona, here is my automated reply for: "${msg}".`
      }]);
    }, 1200);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB]">AI Agents</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
            Configure custom AI personalities to automatically reply, qualify leads, and handle chats.
          </p>
        </div>
        {!isCreating && (
          <Button
            className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold h-10 rounded-xl px-4 shadow-md shadow-[#22C55E]/15 active:scale-95 transition-all self-start md:self-center"
            onClick={() => { resetForm(); setIsCreating(true); }}
          >
            <Plus className="w-4 h-4 mr-2" /> Create Agent
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Listing or Creation Form */}
        <div className="lg:col-span-2 space-y-5">
          <AnimatePresence mode="wait">
            {isCreating ? (
              <motion.div
                key="creation-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] p-6 rounded-2xl shadow-sm space-y-4 transition-colors duration-300"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#111827] dark:text-[#F9FAFB]">
                    {editingAgent ? "Edit AI Agent" : "New AI Agent"}
                  </h3>
                  <Button variant="ghost" className="text-xs h-7 text-[#6B7280] dark:text-[#9CA3AF] hover:text-red-500 hover:bg-red-50" onClick={() => { setIsCreating(false); resetForm(); }}>Cancel</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Agent Name</Label>
                    <Input
                      placeholder="e.g. Sales Closer AI"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="bg-[#F9FAFB] dark:bg-[#0B0F1A] border border-[#E5E7EB] dark:border-[#1F2937] text-[#111827] dark:text-[#F9FAFB] rounded-xl h-10 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Role</Label>
                    <Input
                      placeholder="e.g. Qualified Appointments"
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      className="bg-[#F9FAFB] dark:bg-[#0B0F1A] border border-[#E5E7EB] dark:border-[#1F2937] text-[#111827] dark:text-[#F9FAFB] rounded-xl h-10 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Tone & Voice</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="bg-[#F9FAFB] dark:bg-[#0B0F1A] border-[#E5E7EB] dark:border-[#1F2937] text-[#111827] dark:text-[#F9FAFB] rounded-xl h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#111827] border-[#E5E7EB] dark:border-[#1F2937]">
                      <SelectItem value="Professional">💼 Professional & Direct</SelectItem>
                      <SelectItem value="Friendly">😊 Friendly & Warm</SelectItem>
                      <SelectItem value="Enthusiastic">🚀 Enthusiastic & Sales-Driven</SelectItem>
                      <SelectItem value="Empathetic">🤝 Compassionate & Helpful</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF]">Instructions (Prompt)</Label>
                  <Textarea
                    placeholder="Provide specific guidelines for the AI..."
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    rows={5}
                    className="bg-[#F9FAFB] dark:bg-[#0B0F1A] border border-[#E5E7EB] dark:border-[#1F2937] text-[#111827] dark:text-[#F9FAFB] rounded-xl font-medium resize-none leading-relaxed"
                  />
                  <p className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF]">
                    Clearly define what information this AI agent should capture, what services to sell, and what to say.
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold h-11 rounded-xl shadow-md active:scale-98 transition-all"
                    onClick={editingAgent ? handleUpdateAgent : handleAddAgent}
                  >
                    <Wand2 className="w-4 h-4 mr-2" /> {editingAgent ? "Save Changes" : "Save AI Agent"}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="agent-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] p-5 rounded-2xl shadow-sm hover:border-[#22C55E]/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 bg-[#22C55E]/10 dark:bg-[#22C55E]/20 text-[#22C55E] rounded-xl flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB]">{agent.name}</h4>
                            <p className="text-[10px] text-[#22C55E] font-semibold">{agent.tone}</p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold px-2 py-0.5 rounded-md">
                          {agent.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] mb-1">Role</p>
                      <p className="text-xs text-[#111827] dark:text-[#F9FAFB] font-medium leading-relaxed mb-3">{agent.role}</p>
                      <p className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] mb-1">Instructions (Snippet)</p>
                      <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-medium leading-relaxed italic line-clamp-3">
                        "{agent.instructions}"
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 mt-4 pt-3 border-t border-[#E5E7EB] dark:border-[#1F2937]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(agent)}
                        className="h-8 w-8 p-0 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#22C55E] dark:hover:text-[#22C55E] rounded-xl hover:bg-[#22C55E]/10 dark:hover:bg-[#22C55E]/10"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAgent(agent.id)}
                        className="h-8 w-8 p-0 text-[#6B7280] dark:text-[#9CA3AF] hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right column: Live Preview */}
        <div>
          <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-2xl shadow-sm p-4 h-[calc(100vh-14rem)] flex flex-col justify-between transition-colors duration-300">
            <div>
              <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#1F2937] pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-[#111827] dark:text-[#F9FAFB]">Agent Sandbox Preview</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewHistory([{ sender: "ai", text: "Hello! I'm Sales Closer AI. How can I help you today?" }])}
                  className="h-6 text-[10px] px-2 font-bold text-[#6B7280] dark:text-[#9CA3AF]"
                >
                  <RefreshCw className="w-3 h-3 mr-1" /> Reset
                </Button>
              </div>

              <div className="space-y-3 overflow-y-auto h-[260px] md:h-[350px] pr-1 scrollbar-hide">
                {previewHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex",
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3 py-2 text-xs font-medium leading-relaxed",
                        msg.sender === "user"
                          ? "bg-[#22C55E] text-white rounded-tr-sm shadow-sm"
                          : "bg-[#F9FAFB] dark:bg-[#0B0F1A] border border-[#E5E7EB] dark:border-[#1F2937] text-[#111827] dark:text-[#F9FAFB] rounded-tl-sm"
                      )}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[#F9FAFB] dark:bg-[#0B0F1A] border border-[#E5E7EB] dark:border-[#1F2937] text-[#111827] dark:text-[#F9FAFB] rounded-2xl rounded-tl-sm px-3 py-2 flex items-center gap-1 shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input sandbox bottom */}
            <div className="border-t border-[#E5E7EB] dark:border-[#1F2937] pt-3 mt-3">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Test your AI agent..."
                  value={previewInput}
                  onChange={e => setPreviewInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleTestMessage()}
                  className="bg-[#F9FAFB] dark:bg-[#0B0F1A] border border-[#E5E7EB] dark:border-[#1F2937] text-[#111827] dark:text-[#F9FAFB] rounded-xl h-10 font-medium text-xs focus-visible:ring-[#22C55E]/20"
                />
                <Button
                  onClick={handleTestMessage}
                  className="h-10 w-10 p-0 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl shadow-md active:scale-95 transition-all shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
