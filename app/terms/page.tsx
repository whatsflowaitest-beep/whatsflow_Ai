"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FloatingAIWidget } from "@/components/landing/FloatingAIWidget";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h1 className="text-4xl font-black text-[#0f172a] mb-4 font-[family-name:var(--font-sora)]">Terms of Service</h1>
          <p className="text-[#6b7280] mb-12">Last updated: April 20, 2026</p>
          
          <div className="prose prose-slate max-w-none space-y-10 text-[#0f172a]/80 leading-relaxed font-medium">
            <section>
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using WhatsFlow AI, you agree to comply with and be bound by these Terms of Service. If you do not agree, you may not use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">2. Use of License</h2>
              <p>
                We grant you a non-exclusive, non-transferable, revocable license to use our platform solely for your internal business purposes. You may not reverse engineer or attempt to steal our source code.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">3. Fees and Payments</h2>
              <p>
                Usage of WhatsFlow AI is billed based on the plan you select. All fees are non-refundable unless stated otherwise.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">4. Limitation of Liability</h2>
              <p>
                WhatsFlow AI is provided "as is." We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">5. Governing Law</h2>
              <p>
                These terms are governed by the laws of the jurisdiction in which SEBS (Private) Limited is registered.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingAIWidget />
    </div>
  );
}
