"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GripVertical, Plus, Trash2, Save } from "lucide-react";
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
import { AutomationToggle } from "@/components/dashboard/AutomationToggle";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { PageHeading } from "@/components/dashboard/PageHeading";

const defaultQuestions = [
  "What service are you looking for?",
  "When are you looking to come in?",
  "Have you visited us before?",
  "How did you hear about us?",
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function SectionCard({
  title,
  description,
  children,
  onSave,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  onSave?: () => void;
}) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    onSave();
    setIsSaving(false);
  };

  return (
    <div className="bg-white rounded-[24px] border border-[#E2EDE2]/60 shadow-premium p-8 flex flex-col h-full hover:border-[#16A34A]/20 transition-all">
      <div className="mb-8">
        <h3 className="text-xl font-extrabold text-[#0F1F0F] tracking-tight">{title}</h3>
        {description && (
          <p className="text-sm font-medium text-[#6B7B6B] mt-2 leading-relaxed">{description}</p>
        )}
      </div>
      <div className="space-y-7 flex-1">{children}</div>
      <div className="mt-10 pt-8 border-t border-[#F0F7F0]">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-bold h-12 rounded-xl shadow-lg shadow-green-500/10 transition-all active:scale-[0.98]"
        >
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Applying Changes...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              <span>Update Behavioral Logic</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}

export default function AutomationPage() {
  const { toast } = useToast();
  const [questions, setQuestions] = useState(defaultQuestions);
  const [newQuestion, setNewQuestion] = useState("");
  const [workingDays, setWorkingDays] = useState<Record<string, boolean>>({
    Mon: true,
    Tue: true,
    Wed: true,
    Thu: true,
    Fri: true,
    Sat: false,
    Sun: false,
  });

  const [workingHours, setWorkingHours] = useState<Record<string, { start: string, end: string }>>(
    days.reduce((acc, day) => ({ ...acc, [day]: { start: "09:00", end: "18:00" } }), {})
  );

  function addQuestion() {
    if (newQuestion.trim()) {
      setQuestions([...questions, newQuestion.trim()]);
      setNewQuestion("");
    }
  }

  function removeQuestion(i: number) {
    setQuestions(questions.filter((_, idx) => idx !== i));
  }

  const handleSave = () => {
    toast("Settings updated successfully ✓", "success");
  };

  return (
    <div className="space-y-8">
      <PageHeading 
        title="Automation"
        description="Configure your AI assistant's behavior, qualification logic, and automated workflows."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* AI Behavior */}
        <SectionCard
          title="Core Intelligence"
          description="Define the identity and baseline personality of your AI assistant."
          onSave={handleSave}
        >
          <AutomationToggle
            label="AI Auto-Response"
            description="Activate the AI to instantly handle incoming WhatsApp leads."
            defaultChecked={true}
          />

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-[#6B7B6B]">Business Profile Name</Label>
            <Input defaultValue="SmilePlus Dental & Wellness" className="h-11 rounded-xl" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#6B7B6B]">Industry Category</Label>
              <Select defaultValue="dental">
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dental">Health & Medical</SelectItem>
                  <SelectItem value="real-estate">Real Estate</SelectItem>
                  <SelectItem value="salon">Professional Services</SelectItem>
                  <SelectItem value="physio">Consultancy</SelectItem>
                  <SelectItem value="online">SaaS/Tech</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#6B7B6B]">AI Tone & Voice</Label>
              <Select defaultValue="friendly">
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friendly">Warm & Welcoming</SelectItem>
                  <SelectItem value="professional">Direct & Expert</SelectItem>
                  <SelectItem value="casual">Friendly & Informal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-[#6B7B6B]">
              Human Escalation Threshold
            </Label>
            <Input type="number" defaultValue="8" min="1" max="20" className="h-11 rounded-xl" />
            <p className="text-[10px] text-[#6B7B6B]">The number of messages before notifying your team for takeover.</p>
          </div>
        </SectionCard>

        {/* Qualification Flow */}
        <SectionCard
          title="Qualification Questions"
          description="Sequence of questions used to gather lead information before booking."
          onSave={handleSave}
        >
          <div className="space-y-4">
            {questions.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 bg-[#F8FAF8] border border-[#E2EDE2]/60 rounded-2xl px-5 py-4 group hover:border-[#16A34A]/40 hover:bg-white hover:shadow-sm transition-all relative"
              >
                <div className="flex items-center justify-center w-6 h-6 shrink-0 cursor-grab active:cursor-grabbing text-gray-300 group-hover:text-[#16A34A] transition-colors">
                  <GripVertical className="w-5 h-5" />
                </div>
                <div className="flex-1 flex items-center gap-3 min-w-0">
                  <span className="flex items-center justify-center w-6 h-6 shrink-0 text-[10px] font-extrabold text-[#16A34A] bg-[#DCFCE7] border border-[#16A34A]/10 rounded-lg">
                    0{i + 1}
                  </span>
                  <span className="text-sm text-[#0F1F0F] font-bold truncate">
                    {q}
                  </span>
                </div>
                <button
                  onClick={() => removeQuestion(i)}
                  className="opacity-0 group-hover:opacity-100 transition-all text-red-400 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 active:scale-90"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
          <div className="flex gap-3 pt-4">
            <div className="relative flex-1">
              <Input
                placeholder="Add a custom qualifying question..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addQuestion()}
                className="text-sm h-12 rounded-2xl border-[#E2EDE2] focus:border-[#16A34A] bg-white pr-12 font-medium"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#6B7B6B]/50 uppercase tracking-widest hidden sm:block">
                Press Enter
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={addQuestion}
              className="h-12 w-12 shrink-0 border-[#E2EDE2] text-[#16A34A] hover:bg-green-50 hover:border-[#16A34A] rounded-2xl transition-all active:scale-90 shadow-sm"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </SectionCard>

        {/* Follow-up Settings */}
        <SectionCard
          title="Lead Re-engagement"
          description="Automatically follow up with leads who have gone silent mid-conversation."
          onSave={handleSave}
        >
          <AutomationToggle
            label="Enable Follow-ups"
            description="AI will ping leads if they don't reply within the set window."
            defaultChecked={true}
          />

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-[#6B7B6B]">Follow-up window</Label>
            <Select defaultValue="30min">
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15min">15 minutes</SelectItem>
                <SelectItem value="30min">30 minutes</SelectItem>
                <SelectItem value="1hr">1 hour of silence</SelectItem>
                <SelectItem value="2hr">2 hours of silence</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-[#6B7B6B]">Follow-up message</Label>
            <Textarea
              defaultValue="Hi {name}! 👋 Just checking in — were you still interested in booking an appointment? I can help you find the perfect time slot."
              className="text-sm resize-none rounded-xl border-[#E2EDE2] p-4"
              rows={3}
            />
            <p className="text-[10px] text-[#6B7B6B]">Use &#123;name&#125; to personalize the message.</p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-[#6B7B6B]">Attempt Cap</Label>
            <Input type="number" defaultValue="2" min="1" max="5" className="h-11 rounded-xl" />
          </div>
        </SectionCard>

        {/* Booking Settings */}
        <SectionCard
          title="Booking & Conversion"
          description="Configure how lead conversations transition into confirmed meetings."
          onSave={handleSave}
        >
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-[#6B7B6B]">Calendar Integration URL</Label>
            <Input
              type="url"
              defaultValue="https://calendly.com/smileplus-dental"
              placeholder="https://..."
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-[#6B7B6B]">
              Qualification Gate
            </Label>
            <Input type="number" defaultValue="3" min="1" max="10" className="h-11 rounded-xl" />
            <p className="text-[10px] text-[#6B7B6B]">Send the booking link after gathering N answers.</p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-[#6B7B6B]">Post-Booking Confirmation</Label>
            <Textarea
              defaultValue="Your appointment is confirmed! ✅ You'll receive a reminder 1 hour before. Looking forward to seeing you!"
              className="text-sm resize-none rounded-xl border-[#E2EDE2] p-4"
              rows={3}
            />
          </div>
        </SectionCard>

        {/* Working Hours */}
        <div className="lg:col-span-2">
          <SectionCard
            title="Availability & Hours"
            description="Control when the AI responds and how it handles off-hour inquiries."
            onSave={handleSave}
          >
            <AutomationToggle
              label="Enforce Working Hours"
              description="If enabled, AI will only respond during the windows defined below."
              defaultChecked={false}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {days.map((day) => (
                <div
                  key={day}
                  className="flex items-center justify-between bg-[#F8FAF8] border border-[#E2EDE2] rounded-2xl px-6 py-4 shadow-sm transition-all hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={workingDays[day]}
                      onCheckedChange={(v) =>
                        setWorkingDays((prev) => ({ ...prev, [day]: v }))
                      }
                      className="data-[state=checked]:bg-[#16A34A]"
                    />
                    <span className="text-base font-bold text-[#0F1F0F] w-12">
                      {day}
                    </span>
                  </div>
                  
                  {workingDays[day] ? (
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-[#6B7B6B] uppercase tracking-wider mb-1">Open</span>
                        <Input
                          type="time"
                          value={workingHours[day].start}
                          onChange={(e) => setWorkingHours(prev => ({
                            ...prev,
                            [day]: { ...prev[day], start: e.target.value }
                          }))}
                          className="h-10 text-xs font-bold px-3 rounded-xl border-[#E2EDE2] bg-white w-[110px] shadow-inner"
                        />
                      </div>
                      <div className="mt-4">
                        <span className="text-[#6B7B6B] text-[10px] font-black uppercase">To</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-[#6B7B6B] uppercase tracking-wider mb-1">Close</span>
                        <Input
                          type="time"
                          value={workingHours[day].end}
                          onChange={(e) => setWorkingHours(prev => ({
                            ...prev,
                            [day]: { ...prev[day], end: e.target.value }
                          }))}
                          className="h-10 text-xs font-bold px-3 rounded-xl border-[#E2EDE2] bg-white w-[110px] shadow-inner"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                      <span className="text-[11px] font-black text-red-500 uppercase tracking-[0.15em]">Closed</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#6B7B6B]">Out-of-Office Response</Label>
              <Textarea
                defaultValue="Thanks for reaching out! 🙏 We're currently outside our business hours. We'll get back to you first thing in the morning!"
                className="text-sm resize-none rounded-xl border-[#E2EDE2] p-4"
                rows={2}
              />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

