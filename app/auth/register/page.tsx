"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  Building2, 
  User, 
  Calendar, 
  Sparkles,
  CheckCircle2,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function BookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    whatsapp: "",
    company: "",
    industry: "",
    size: "",
    date: "",
    time: "",
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real scenario, you would call your API route here:
      // const response = await fetch('/api/booking', {
      //   method: 'POST',
      //   body: JSON.stringify(formData)
      // });
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Form Data to be sent to achintha@sebslabs.com:", formData);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F8FAF8] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[40px] p-12 max-w-xl w-full text-center shadow-xl border border-[#E2EDE2]"
        >
          <div className="w-20 h-20 bg-[#F0FDF4] rounded-3xl flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-[#16A34A]" />
          </div>
          <h1 className="text-3xl font-black text-[#0F1F0F] mb-4">Request Received!</h1>
          <p className="text-[#6B7B6B] text-lg mb-8 leading-relaxed">
            Thank you, <span className="font-bold text-[#0F1F0F]">{formData.firstName}</span>. 
            We&apos;ve sent a confirmation to <span className="font-bold text-[#0F1F0F]">{formData.email}</span>. 
            Our team will reach out within 24 hours.
          </p>
          <Link href="/">
            <Button className="bg-[#16A34A] hover:bg-[#15803D] text-white px-8 h-12 font-bold rounded-xl shadow-lg shadow-green-500/20">
              Return to Homepage
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col items-center justify-center p-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-[#16A34A]/5 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[10%] w-[40%] h-[40%] bg-[#16A34A]/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-2xl"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8 transition-opacity hover:opacity-90">
          <div className="w-10 h-10 shrink-0">
            <img src="/logo-robot.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-black text-[#0F1F0F] text-2xl tracking-tighter font-[family-name:var(--font-sora)]">
            WhatsFlow AI
          </span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#E2EDE2]">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#F0FDF4] text-[#16A34A] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-[#16A34A]/10">
              <Sparkles className="w-3.5 h-3.5" />
              Free Strategy Call
            </div>
            <h1 className="text-3xl font-black text-[#0F1F0F] font-[family-name:var(--font-sora)]">Book Your Demo Session</h1>
            <p className="text-[#6B7B6B] mt-2 font-medium">Experience the power of AI-driven WhatsApp automation for your business.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Section 1: Client Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] flex items-center justify-center">
                  <User className="w-4 h-4 text-[#16A34A]" />
                </div>
                <h2 className="font-bold text-[#0F1F0F] text-lg">Contact Information</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    id="first-name"
                    required
                    placeholder="Alex"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="h-12 border-[#E2EDE2] focus:border-[#16A34A] focus:ring-[#16A34A]/10 bg-gray-50/30 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    required
                    placeholder="Johnson"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="h-12 border-[#E2EDE2] focus:border-[#16A34A] focus:ring-[#16A34A]/10 bg-gray-50/30 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Work email</Label>
                  <Input
                    id="email"
                    required
                    type="email"
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="h-12 border-[#E2EDE2] focus:border-[#16A34A] focus:ring-[#16A34A]/10 bg-gray-50/30 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    required
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    className="h-12 border-[#E2EDE2] focus:border-[#16A34A] focus:ring-[#16A34A]/10 bg-gray-50/30 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Business Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#16A34A]" />
                </div>
                <h2 className="font-bold text-[#0F1F0F] text-lg">Business Details</h2>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  required
                  placeholder="Acme Inc."
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="h-12 border-[#E2EDE2] focus:border-[#16A34A] focus:ring-[#16A34A]/10 bg-gray-50/30 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select onValueChange={(val) => setFormData({...formData, industry: val})}>
                    <SelectTrigger className="h-12 border-[#E2EDE2] bg-gray-50/30 font-medium">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="saas">SaaS / Software</SelectItem>
                      <SelectItem value="fintech">FinTech / Finance</SelectItem>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                      <SelectItem value="retail">Retail & Logistics</SelectItem>
                      <SelectItem value="hospitality">Hospitality & Tourism</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="agency">Marketing Agency</SelectItem>
                      <SelectItem value="services">Professional Services</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Company Size</Label>
                  <Select onValueChange={(val) => setFormData({...formData, size: val})}>
                    <SelectTrigger className="h-12 border-[#E2EDE2] bg-gray-50/30 font-medium">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="500+">500+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section 3: Preferences */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-[#16A34A]" />
                </div>
                <h2 className="font-bold text-[#0F1F0F] text-lg">Preferred Schedule</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Available Date</Label>
                  <Input
                    id="date"
                    required
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="h-12 border-[#E2EDE2] focus:border-[#16A34A] focus:ring-[#16A34A]/10 bg-gray-50/30 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Preferred Time Slot (UTC)</Label>
                  <Select onValueChange={(val) => setFormData({...formData, time: val})}>
                    <SelectTrigger className="h-12 border-[#E2EDE2] bg-gray-50/30 font-medium">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12 PM - 4 PM)</SelectItem>
                      <SelectItem value="evening">Evening (4 PM - 7 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Specific Requirements or Questions</Label>
                <Textarea
                  id="notes"
                  placeholder="Tell us about your current challenges..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="min-h-[100px] border-[#E2EDE2] focus:border-[#16A34A] focus:ring-[#16A34A]/10 bg-gray-50/30 font-medium py-3"
                />
              </div>
            </div>

            <div className="bg-[#F8FAF8] border border-[#E2EDE2] rounded-xl p-4 flex gap-3">
              <div className="w-5 h-5 rounded-full bg-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-white" />
              </div>
              <p className="text-xs text-[#6B7B6B] leading-tight">
                Our team will contact you within 24 hours to confirm your demo slot. 
                By booking, you agree to our 
                <Link href="/terms" className="font-bold text-[#16A34A] hover:underline mx-1">Terms</Link>
                and
                <Link href="/privacy" className="font-bold text-[#16A34A] hover:underline mx-1">Privacy Policy</Link>.
              </p>
            </div>

            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-base shadow-lg shadow-[#16A34A]/20 transition-all active:scale-95 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Confirm Demo Booking Request
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
        </div>
      </motion.div>

      {/* Trust micro-copy */}
      <div className="mt-8 flex items-center gap-6 opacity-60 grayscale transition-all hover:grayscale-0">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F1F0F]">
          <Check className="w-3 h-3 text-[#16A34A]" />
          No credit card required
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F1F0F]">
          <Check className="w-3 h-3 text-[#16A34A]" />
          Personalized 1-on-1 Walkthrough
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F1F0F]">
          <Check className="w-3 h-3 text-[#16A34A]" />
          Bank-Level Security
        </div>
      </div>
    </div>
  );
}
