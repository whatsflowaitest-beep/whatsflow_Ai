"use client";

import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast("Message sent successfully! 🚀", "success");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="py-20 bg-gradient-to-b from-[#F8FAF8] via-white to-white select-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-xs font-black tracking-[0.2em] uppercase text-[#16A34A] mb-4 inline-block">Connect with us</span>
            <h1 className="text-3xl md:text-5xl font-black text-[#0F1F0F] tracking-tight leading-tight">
              Let's build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#15803D]">extraordinary</span>.
            </h1>
            <p className="text-sm md:text-base font-semibold text-[#6B7B6B] mt-4 max-w-lg mx-auto">
              Our expert team is ready to scale your customer outreach via our production-grade AI-powered WhatsApp message platform.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-12 items-stretch max-w-5xl mx-auto">
            {/* Info panel */}
            <div className="md:col-span-2 space-y-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="bg-[#F8FAF8] border border-[#E2EDE2]/60 rounded-3xl p-6 hover:border-[#16A34A]/30 transition-all flex items-start gap-4 shadow-sm">
                  <div className="w-11 h-11 bg-[#F0FDF4] border border-[#16A34A]/10 rounded-xl flex items-center justify-center text-[#16A34A] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#0F1F0F]">Email Address</h4>
                    <p className="text-xs font-bold text-[#6B7B6B] mt-1 select-all">hello@sebslabs.com</p>
                  </div>
                </div>

                <div className="bg-[#F8FAF8] border border-[#E2EDE2]/60 rounded-3xl p-6 hover:border-[#16A34A]/30 transition-all flex items-start gap-4 shadow-sm">
                  <div className="w-11 h-11 bg-[#F0FDF4] border border-[#16A34A]/10 rounded-xl flex items-center justify-center text-[#16A34A] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#0F1F0F]">Direct Inquiries</h4>
                    <p className="text-xs font-bold text-[#6B7B6B] mt-1 select-all">+1 (555) 012-3456</p>
                  </div>
                </div>

                <div className="bg-[#F8FAF8] border border-[#E2EDE2]/60 rounded-3xl p-6 hover:border-[#16A34A]/30 transition-all flex items-start gap-4 shadow-sm">
                  <div className="w-11 h-11 bg-[#F0FDF4] border border-[#16A34A]/10 rounded-xl flex items-center justify-center text-[#16A34A] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#0F1F0F]">Global Office</h4>
                    <p className="text-xs font-bold text-[#6B7B6B] mt-1">Colombo, Sri Lanka</p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-[#F0FDF4] border border-[#16A34A]/10 rounded-3xl text-center">
                <p className="text-xs font-bold text-[#16A34A]">We typically reply within 24 business hours. 📅</p>
              </div>
            </div>

            {/* Form panel */}
            <div className="md:col-span-3 bg-white border border-[#E2EDE2]/60 rounded-[32px] p-8 shadow-premium relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -mr-32 -mt-32 -z-10" />

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-extrabold uppercase tracking-widest text-[#6B7B6B]">Full Name</Label>
                    <Input
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Jane Doe"
                      className="h-11 rounded-xl border-[#E2EDE2] focus:border-[#16A34A]/40 text-xs bg-[#F8FAF8]/40"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-extrabold uppercase tracking-widest text-[#6B7B6B]">Work Email</Label>
                    <Input
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="jane@company.com"
                      type="email"
                      className="h-11 rounded-xl border-[#E2EDE2] focus:border-[#16A34A]/40 text-xs bg-[#F8FAF8]/40"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-extrabold uppercase tracking-widest text-[#6B7B6B]">Subject</Label>
                  <Input
                    value={form.subject}
                    onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                    placeholder="Inquiring about Custom Pricing / Enterprise Needs"
                    className="h-11 rounded-xl border-[#E2EDE2] focus:border-[#16A34A]/40 text-xs bg-[#F8FAF8]/40"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-extrabold uppercase tracking-widest text-[#6B7B6B]">How can we support you?</Label>
                  <Textarea
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="Tell us a bit about your messaging volume, team size, and goals..."
                    className="min-h-[110px] rounded-xl border-[#E2EDE2] focus:border-[#16A34A]/40 p-4 leading-relaxed resize-none text-xs bg-[#F8FAF8]/40"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-black h-12 rounded-2xl shadow-lg shadow-green-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Transmit Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
