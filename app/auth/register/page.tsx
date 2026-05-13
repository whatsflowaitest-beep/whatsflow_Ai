"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  Building2, 
  User, 
  Calendar, 
  Sparkles,
  CheckCircle2,
  Loader2,
  Mail,
  Lock,
  Phone,
  AlertCircle,
  Zap
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
import { createClient } from "@/lib/supabase/client";

type TabType = "register" | "demo";

export default function RegisterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("register");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Registration Success State
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
  // Demo Booking Success State
  const [isDemoSuccess, setIsDemoSuccess] = useState(false);
  
  // Account Registration State
  const [registerData, setRegisterData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    whatsapp: "",
    industry: "",
    otherIndustry: "",
    supportEmail: ""
  });

  // Demo Booking State
  const [bookingData, setBookingData] = useState({
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

  // Handle direct account sign up with Supabase
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match. Please check both fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();
      
      const emailRedirect = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;

      // Sign up with Supabase, sending user metadata for the DB trigger to provision the workspace automatically
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          emailRedirectTo: emailRedirect,
          data: {
            full_name: registerData.fullName,
            organization_name: registerData.companyName,
            whatsapp_number: registerData.whatsapp,
            industry_ecosystem: registerData.industry === 'other' ? registerData.otherIndustry : registerData.industry,
            support_email: registerData.supportEmail,
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsSubmitting(false);
        return;
      }

      if (data?.session) {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "/dashboard";
      } else {
        setIsRegisterSuccess(true);
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Demo Booking Form Submit
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // In a real scenario, you would call your API route here:
      // const response = await fetch('/api/booking', {
      //   method: 'POST',
      //   body: JSON.stringify(bookingData)
      // });
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Form Data to be sent to achintha@sebslabs.com:", bookingData);
      setIsDemoSuccess(true);
    } catch (err: any) {
      setError(err?.message || "An error occurred while booking the demo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen for direct registration with Pricing / Trial Step
  if (isRegisterSuccess) {
    return (
      <div className="min-h-screen bg-[#F8FAF8] flex flex-col items-center justify-center p-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mb-10"
        >
          <div className="w-16 h-16 bg-[#F0FDF4] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#22c55e]/20 shadow-inner">
            <CheckCircle2 className="w-8 h-8 text-[#22c55e]" />
          </div>
          <h1 className="text-4xl font-black text-[#0f172a] mb-4 tracking-tight">Almost there! Check your inbox 📬</h1>
          <p className="text-[#64748b] text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Welcome to the family, <span className="text-[#0f172a] font-bold">{registerData.fullName}</span>! We sent a verification link to <span className="text-[#22c55e] font-bold underline underline-offset-4">{registerData.email}</span>.
          </p>
          <p className="mt-4 text-sm font-bold text-[#64748b] uppercase tracking-wider flex items-center justify-center gap-2">
            <span className="w-12 h-px bg-slate-200"></span>
            Select your launching track below
            <span className="w-12 h-px bg-slate-200"></span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
          {/* Card 1: Basic */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-slate-200 rounded-[32px] p-8 relative overflow-hidden flex flex-col"
          >
            <div className="mb-6">
              <h3 className="text-xl font-extrabold text-[#0f172a]">Starter Pack</h3>
              <p className="text-sm text-slate-500 mt-1">Perfect for exploring the basics</p>
            </div>
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-[#0f172a]">$29</span>
                <span className="text-slate-500 font-medium">/mo</span>
              </div>
            </div>
            <div className="space-y-3 mb-8 flex-1">
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-slate-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">Up to 1,000 Monthly Broadcasts</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-slate-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">Basic AI Auto-Replies</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-slate-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">1 Active Workflow</span>
              </div>
            </div>
            <Link href="/auth/login">
              <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-slate-200 hover:bg-slate-50 transition-all">
                Choose Starter
              </Button>
            </Link>
          </motion.div>

          {/* Card 2: PRO with 7-Day Free Trial */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white border-2 border-[#22c55e] rounded-[32px] p-8 relative overflow-hidden shadow-xl shadow-green-500/5 flex flex-col ring-4 ring-[#22c55e]/5"
          >
            <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-current" />
              Most Popular
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-extrabold text-[#0f172a] flex items-center gap-2">
                Pro Enterprise
                <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
              </h3>
              <p className="text-sm text-[#22c55e] font-bold mt-1">Full System Access Included</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-[#0f172a]">$0</span>
                <span className="text-[#22c55e] font-black text-sm uppercase ml-1">For 7 Days</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Then only $79/mo. Cancel anytime.</p>
            </div>

            <div className="space-y-3 mb-8 flex-1">
              {[
                "Unlimited Broadcating & CRM",
                "Advanced NLP AI Personas",
                "Full Visual Automation Flows",
                "Dedicated Priority Support",
                "Custom Integrations (Webhooks)"
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-[#F0FDF4] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Check className="w-3 h-3 text-[#22c55e] stroke-[3]" />
                  </div>
                  <span className="text-sm font-bold text-[#0f172a]">{feature}</span>
                </div>
              ))}
            </div>

            <Link href="/auth/login">
              <Button className="w-full h-14 rounded-xl font-black text-lg bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-lg shadow-green-500/30 transition-all hover:scale-[1.02] group active:scale-95">
                Start 7-Day Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="text-center text-[11px] text-slate-400 font-medium mt-3 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3" /> No hidden costs · Direct access
            </p>
          </motion.div>
        </div>

        <Link href="/" className="mt-12 text-sm font-bold text-slate-500 hover:text-[#0f172a] transition-colors underline underline-offset-4">
          Return to Homepage
        </Link>
      </div>
    );
  }

  // Success screen for demo booking
  if (isDemoSuccess) {
    return (
      <div className="min-h-screen bg-[#F8FAF8] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[40px] p-12 max-w-xl w-full text-center shadow-2xl border border-[#E2EDE2]"
        >
          <div className="w-20 h-20 bg-[#F0FDF4] rounded-3xl flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-[#22c55e]" />
          </div>
          <h1 className="text-3xl font-black text-[#0f172a] mb-4">Request Received!</h1>
          <p className="text-[#64748b] text-lg mb-8 leading-relaxed">
            Thank you, <span className="font-bold text-[#0f172a]">{bookingData.firstName}</span>. 
            We&apos;ve received your request and sent a confirmation to <span className="font-bold text-[#0f172a]">{bookingData.email}</span>. 
            Our team will reach out within 24 hours to confirm your session.
          </p>
          <Link href="/">
            <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-8 h-12 font-bold rounded-xl shadow-lg shadow-green-500/20">
              Return to Homepage
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col items-center justify-center p-4 py-12 relative overflow-x-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-[#22c55e]/5 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[10%] w-[40%] h-[40%] bg-[#22c55e]/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-2xl z-10"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8 transition-opacity hover:opacity-90">
          <div className="w-10 h-10 shrink-0 relative">
            <div className="absolute inset-0 bg-[#22c55e]/20 rounded-xl blur-lg" />
            <img src="/logo-robot.png" alt="Logo" className="w-full h-full object-contain relative" />
          </div>
          <span className="font-black text-[#0f172a] text-2xl tracking-tighter">
            WhatsFlow<span className="text-[#22c55e]">AI</span>
          </span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-[#E2EDE2]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#F0FDF4] text-[#22c55e] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-[#22c55e]/10">
              <Sparkles className="w-3.5 h-3.5" />
              SaaS Automation Platform
            </div>
            <h1 className="text-3xl font-black text-[#0f172a] tracking-tight">
              Get Started with WhatsFlow AI
            </h1>
            <p className="text-[#64748b] mt-2 font-medium">
              Transform your business with AI-driven WhatsApp automation
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-[#F1F5F9] p-1 rounded-2xl mb-8 relative">
            <button
              onClick={() => { setActiveTab("register"); setError(""); }}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${
                activeTab === "register" ? "text-[#0f172a]" : "text-[#64748b] hover:text-[#0f172a]"
              }`}
            >
              <User className="w-4 h-4" />
              Create Account
            </button>
            <button
              onClick={() => { setActiveTab("demo"); setError(""); }}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${
                activeTab === "demo" ? "text-[#0f172a]" : "text-[#64748b] hover:text-[#0f172a]"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Book a Demo
            </button>
            {/* Sliding bubble */}
            <motion.div
              layoutId="tab-bubble"
              className="absolute top-1 bottom-1 rounded-xl bg-white shadow-sm border border-slate-100"
              initial={false}
              animate={{
                left: activeTab === "register" ? "4px" : "50%",
                right: activeTab === "register" ? "50%" : "4px",
              }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          </div>

          {/* Errors */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-600 text-sm font-medium mb-6 overflow-hidden"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forms switcher */}
          <AnimatePresence mode="wait">
            {activeTab === "register" ? (
              <motion.form
                key="register-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleRegisterSubmit}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name" className="text-sm font-bold text-slate-700">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="reg-name"
                        required
                        placeholder="Alex Johnson"
                        value={registerData.fullName}
                        onChange={(e) => setRegisterData({...registerData, fullName: e.target.value})}
                        className="h-12 pl-11 border-[#E2EDE2] focus:border-[#22c55e] focus:ring-[#22c55e]/10 bg-slate-50/20 font-medium rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-sm font-bold text-slate-700">Work Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="reg-email"
                        required
                        type="email"
                        placeholder="alex@company.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                        className="h-12 pl-11 border-[#E2EDE2] focus:border-[#22c55e] focus:ring-[#22c55e]/10 bg-slate-50/20 font-medium rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-sm font-bold text-slate-700">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="reg-password"
                        required
                        type="password"
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                        className="h-12 pl-11 border-[#E2EDE2] focus:border-[#22c55e] focus:ring-[#22c55e]/10 bg-slate-50/20 font-medium rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reg-confirm-password" className="text-sm font-bold text-slate-700">Confirm Password</Label>
                      {registerData.confirmPassword && (
                        <span className={`text-[10px] uppercase tracking-wider font-black flex items-center gap-1 transition-all ${
                          registerData.password === registerData.confirmPassword ? 'text-green-600' : 'text-red-500 animate-pulse'
                        }`}>
                          {registerData.password === registerData.confirmPassword ? (
                            <>Match <Check className="w-3 h-3" /></>
                          ) : (
                            <>No Match <AlertCircle className="w-3 h-3" /></>
                          )}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <ShieldCheck className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                        !registerData.confirmPassword 
                          ? 'text-slate-400' 
                          : registerData.password === registerData.confirmPassword 
                            ? 'text-green-500' 
                            : 'text-red-400'
                      }`} />
                      <Input
                        id="reg-confirm-password"
                        required
                        type="password"
                        placeholder="••••••••"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                        className={`h-12 pl-11 border-[#E2EDE2] font-medium rounded-xl transition-all duration-300 ${
                          !registerData.confirmPassword 
                            ? 'bg-slate-50/20 focus:border-[#22c55e] focus:ring-[#22c55e]/10' 
                            : registerData.password === registerData.confirmPassword 
                              ? 'border-green-300 bg-green-50/30 ring-4 ring-green-500/5 focus:border-green-500 focus:ring-green-500/20' 
                              : 'border-red-300 bg-red-50/30 ring-4 ring-red-500/5 focus:border-red-500 focus:ring-red-500/20'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <div className="border-t border-slate-100 my-2"></div>
                  <h3 className="text-xs font-black text-[#22c55e] uppercase tracking-wider mb-4">Foundational Business Identity</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-company" className="text-sm font-bold text-slate-700">Business Name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="reg-company"
                        required
                        placeholder="Acme Inc."
                        value={registerData.companyName}
                        onChange={(e) => setRegisterData({...registerData, companyName: e.target.value})}
                        className="h-12 pl-11 border-[#E2EDE2] focus:border-[#22c55e] focus:ring-[#22c55e]/10 bg-slate-50/20 font-medium rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-industry" className="text-sm font-bold text-slate-700">Industry Ecosystem</Label>
                    <Select required onValueChange={(val) => setRegisterData({...registerData, industry: val})}>
                      <SelectTrigger id="reg-industry" className="h-12 border-[#E2EDE2] focus:border-[#22c55e] bg-slate-50/20 font-medium rounded-xl">
                        <SelectValue placeholder="Select Ecosystem" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="saas">SaaS / Software</SelectItem>
                        <SelectItem value="healthcare">Health & Medical</SelectItem>
                        <SelectItem value="real-estate">Real Estate</SelectItem>
                        <SelectItem value="retail">Retail & Logistics</SelectItem>
                        <SelectItem value="hospitality">Hospitality</SelectItem>
                        <SelectItem value="finance">FinTech / Finance</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="other">Other Services / Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <AnimatePresence>
                  {registerData.industry === 'other' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 pb-4">
                        <Label htmlFor="reg-industry-other" className="text-sm font-bold text-slate-700">Please Specify Industry</Label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#22c55e]" />
                          <Input
                            id="reg-industry-other"
                            required
                            placeholder="e.g., Agriculture, Construction, Logistics"
                            value={registerData.otherIndustry}
                            onChange={(e) => setRegisterData({...registerData, otherIndustry: e.target.value})}
                            className="h-12 pl-11 border-[#22c55e]/30 focus:border-[#22c55e] focus:ring-[#22c55e]/10 bg-[#F0FDF4]/20 font-medium rounded-xl transition-colors"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-whatsapp" className="text-sm font-bold text-slate-700">WhatsApp Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="reg-whatsapp"
                        required
                        type="tel"
                        placeholder="+15550000000"
                        value={registerData.whatsapp}
                        onChange={(e) => setRegisterData({...registerData, whatsapp: e.target.value})}
                        className="h-12 pl-11 border-[#E2EDE2] focus:border-[#22c55e] focus:ring-[#22c55e]/10 bg-slate-50/20 font-medium rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-support-email" className="text-sm font-bold text-slate-700">Support Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="reg-support-email"
                        required
                        type="email"
                        placeholder="support@company.com"
                        value={registerData.supportEmail}
                        onChange={(e) => setRegisterData({...registerData, supportEmail: e.target.value})}
                        className="h-12 pl-11 border-[#E2EDE2] focus:border-[#22c55e] focus:ring-[#22c55e]/10 bg-slate-50/20 font-medium rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#F8FAF8] border border-[#E2EDE2] rounded-xl p-4 flex gap-3 mt-6">
                  <div className="w-5 h-5 rounded-full bg-[#22c55e] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-xs text-[#64748b] leading-tight">
                    By signing up, you agree to our 
                    <Link href="/terms" className="font-bold text-[#22c55e] hover:underline mx-1">Terms of Service</Link>
                    and
                    <Link href="/privacy" className="font-bold text-[#22c55e] hover:underline mx-1">Privacy Policy</Link>.
                  </p>
                </div>

                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-base shadow-lg shadow-green-500/10 rounded-2xl transition-all active:scale-[0.98] group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Your Free Workspace
                      <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="booking-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleBookingSubmit}
                className="space-y-6"
              >
                {/* Section 1: Client Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] flex items-center justify-center">
                      <User className="w-4 h-4 text-[#22c55e]" />
                    </div>
                    <h2 className="font-bold text-[#0f172a] text-base">Contact Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="book-first">First name</Label>
                      <Input
                        id="book-first"
                        required
                        placeholder="Alex"
                        value={bookingData.firstName}
                        onChange={(e) => setBookingData({...bookingData, firstName: e.target.value})}
                        className="h-12 border-[#E2EDE2] focus:border-[#22c55e] focus:ring-[#22c55e]/10 bg-slate-50/20 font-medium rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="book-last">Last name</Label>
                      <Input
                        id="book-last"
                        required
                        placeholder="Johnson"
                        value={bookingData.lastName}
                        onChange={(e) => setBookingData({...bookingData, lastName: e.target.value})}
                        className="h-12 border-[#E2EDE2] focus:border-[#22c55e] focus:ring-[#22c55e]/10 bg-slate-50/20 font-medium rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="book-email">Work email</Label>
                      <Input
                        id="book-email"
                        required
                        type="email"
                        placeholder="alex@company.com"
                        value={bookingData.email}
                        onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                        className="h-12 border-[#E2EDE2] focus:border-[#22c55e] focus:ring-[#22c55e]/10 bg-slate-50/20 font-medium rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="book-whatsapp">WhatsApp Number</Label>
                      <Input
                        id="book-whatsapp"
                        required
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={bookingData.whatsapp}
                        onChange={(e) => setBookingData({...bookingData, whatsapp: e.target.value})}
                        className="h-12 border-[#E2EDE2] focus:border-[#22c55e] focus:ring-[#22c55e]/10 bg-slate-50/20 font-medium rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Business Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-[#22c55e]" />
                    </div>
                    <h2 className="font-bold text-[#0f172a] text-base">Business Details</h2>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="book-company">Company Name</Label>
                    <Input
                      id="book-company"
                      required
                      placeholder="Acme Inc."
                      value={bookingData.company}
                      onChange={(e) => setBookingData({...bookingData, company: e.target.value})}
                      className="h-12 border-[#E2EDE2] focus:border-[#22c55e] focus:ring-[#22c55e]/10 bg-slate-50/20 font-medium rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="book-industry">Industry</Label>
                      <Select onValueChange={(val) => setBookingData({...bookingData, industry: val})}>
                        <SelectTrigger className="h-12 border-[#E2EDE2] bg-slate-50/20 font-medium rounded-xl">
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
                      <Label htmlFor="book-size">Company Size</Label>
                      <Select onValueChange={(val) => setBookingData({...bookingData, size: val})}>
                        <SelectTrigger className="h-12 border-[#E2EDE2] bg-slate-50/20 font-medium rounded-xl">
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
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-[#22c55e]" />
                    </div>
                    <h2 className="font-bold text-[#0f172a] text-base">Preferred Schedule</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="book-date">Available Date</Label>
                      <Input
                        id="book-date"
                        required
                        type="date"
                        value={bookingData.date}
                        onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                        className="h-12 border-[#E2EDE2] focus:border-[#22c55e] focus:ring-[#22c55e]/10 bg-slate-50/20 font-medium rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="book-time">Preferred Time Slot (UTC)</Label>
                      <Select onValueChange={(val) => setBookingData({...bookingData, time: val})}>
                        <SelectTrigger className="h-12 border-[#E2EDE2] bg-slate-50/20 font-medium rounded-xl">
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
                    <Label htmlFor="book-notes">Specific Requirements or Questions</Label>
                    <Textarea
                      id="book-notes"
                      placeholder="Tell us about your current challenges..."
                      value={bookingData.notes}
                      onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                      className="min-h-[100px] border-[#E2EDE2] focus:border-[#22c55e] focus:ring-[#22c55e]/10 bg-slate-50/20 font-medium py-3 rounded-xl"
                    />
                  </div>
                </div>

                <div className="bg-[#F8FAF8] border border-[#E2EDE2] rounded-xl p-4 flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#22c55e] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-xs text-[#64748b] leading-tight">
                    Our team will contact you within 24 hours to confirm your demo slot. By booking, you agree to our 
                    <Link href="/terms" className="font-bold text-[#22c55e] hover:underline mx-1">Terms</Link>
                    and
                    <Link href="/privacy" className="font-bold text-[#22c55e] hover:underline mx-1">Privacy Policy</Link>.
                  </p>
                </div>

                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-base shadow-lg shadow-green-500/10 rounded-2xl transition-all active:scale-[0.98] group disabled:opacity-70 disabled:cursor-not-allowed"
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
              </motion.form>
            )}
          </AnimatePresence>

          {/* Alternate Link */}
          <p className="text-center mt-8 text-sm text-[#64748b]">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-bold text-[#22c55e] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Trust micro-copy */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 opacity-60 grayscale transition-all hover:grayscale-0 z-10">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#0f172a]">
          <Check className="w-3 h-3 text-[#22c55e]" />
          No credit card required
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#0f172a]">
          <Check className="w-3 h-3 text-[#22c55e]" />
          Instant Access
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#0f172a]">
          <Check className="w-3 h-3 text-[#22c55e]" />
          Bank-Level Security
        </div>
      </div>

      {/* Footer link */}
      <p className="mt-8 text-xs text-slate-400 relative z-10">
        © 2026 WhatsFlow AI · All rights reserved.
      </p>
    </div>
  );
}
