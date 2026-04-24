"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FloatingAIWidget } from "@/components/landing/FloatingAIWidget";
import { motion } from "framer-motion";
import { Construction } from "lucide-react";

export default function GenericComingSoon() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-yellow-50 rounded-3xl flex items-center justify-center text-yellow-600 mx-auto mb-8"
          >
            <Construction className="w-10 h-10" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] mb-6 font-[family-name:var(--font-sora)]">
            Something Amazing is <br /> <span className="text-[#22c55e]">Under Construction</span>
          </h1>
          <p className="text-xl text-[#6b7280] leading-relaxed font-bold mb-10">
            We are working hard to bring you this page. Stay tuned for updates!
          </p>
          <div className="flex justify-center gap-4">
            <a href="/" className="px-8 py-4 bg-[#0f172a] text-white rounded-2xl font-bold hover:bg-black transition-all">
              Back to Home
            </a>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingAIWidget />
    </div>
  );
}
