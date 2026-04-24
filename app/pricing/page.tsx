"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FloatingAIWidget } from "@/components/landing/FloatingAIWidget";
import { Pricing as PricingSection } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow pt-24">
        {/* Reuse the existing section but with additional page padding/context */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
             <h1 className="text-5xl md:text-7xl font-black text-[#0f172a] mb-8 font-[family-name:var(--font-sora)] tracking-tight">
              Simple, <span className="text-[#22c55e]">Transparent</span> Pricing
             </h1>
             <p className="text-xl text-[#6b7280] max-w-2xl mx-auto leading-relaxed font-medium mb-12">
              Choose the perfect plan for your business. No hidden fees, cancel any time.
             </p>
          </div>
          <PricingSection />
        </section>

        <section className="bg-[#f8fafc] py-24">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-[#0f172a] text-center mb-16 font-[family-name:var(--font-sora)]">Frequently Asked Questions</h2>
            <FAQ />
          </div>
        </section>
      </main>

      <Footer />
      <FloatingAIWidget />
    </div>
  );
}
