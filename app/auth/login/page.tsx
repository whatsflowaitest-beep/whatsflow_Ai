"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Temporary logic
    setTimeout(() => {
      if (email === "test@whatsflowai.online" && password === "Test@12") {
        localStorage.setItem("isLoggedIn", "true");
        router.push("/dashboard");
      } else {
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
      }
    }, 800);
  };


  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#16A34A]/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#16A34A]/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
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
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-[#0F1F0F] font-[family-name:var(--font-sora)]">Welcome back</h1>
            <p className="text-[#6B7B6B] mt-2 font-medium">Enter your details to access your dashboard</p>
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 text-red-600 text-sm font-medium"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 border-[#E2EDE2] focus:border-[#16A34A] focus:ring-[#16A34A]/10 bg-gray-50/30"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-xs font-bold text-[#16A34A] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 border-[#E2EDE2] focus:border-[#16A34A] focus:ring-[#16A34A]/10 bg-gray-50/30"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-base shadow-lg shadow-[#16A34A]/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign in to Dashboard"}
                {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>
          </div>

          <p className="text-center mt-8 text-sm text-[#6B7B6B]">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-bold text-[#16A34A] hover:underline">
              Book a Demo
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Footer link */}
      <p className="mt-8 text-xs text-gray-400">
        © 2025 WhatsFlow AI · All rights reserved.
      </p>
    </div>
  );
}
