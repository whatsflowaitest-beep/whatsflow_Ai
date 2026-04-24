"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FloatingAIWidget } from "@/components/landing/FloatingAIWidget";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h1 className="text-4xl font-black text-[#0f172a] mb-4 font-[family-name:var(--font-sora)]">Privacy Policy</h1>
          <p className="text-[#6b7280] mb-12">Last updated: April 20, 2026</p>
          
          <div className="prose prose-slate max-w-none space-y-10 text-[#0f172a]/80 leading-relaxed font-medium">
            <section>
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">1. Introduction</h2>
              <p>
                WhatsFlow AI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and disclose your personal information when you use our platform and services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">2. Information We Collect</h2>
              <h3 className="text-lg font-bold text-[#0f172a] mt-6 mb-2">Personal Data</h3>
              <p>
                When you create an account, we collect your name, email address, and billing information.
              </p>
              <h3 className="text-lg font-bold text-[#0f172a] mt-6 mb-2">Business Data</h3>
              <p>
                To provide our service, we process message content from your WhatsApp business account as permitted by your configuration and the WhatsApp Business API terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our Service</li>
                <li>To manage your Account</li>
                <li>To communicate with you regarding updates, support, and marketing</li>
                <li>To detect and prevent fraudulent activity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">4. WhatsApp Specific Policies</h2>
              <p>
                Our service integrates with the WhatsApp Business API. By using WhatsFlow AI, you also agree to be bound by WhatsApp&apos;s own terms and privacy policies. We do not store your customer&apos;s full message history unless necessary for the AI processing configured by you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0f172a] mb-4">5. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at hello@whatsflow.ai.
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
