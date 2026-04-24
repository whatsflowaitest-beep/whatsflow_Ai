"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FloatingAIWidget } from "@/components/landing/FloatingAIWidget";
import { motion } from "framer-motion";
import { 
  Zap, 
  MessageCircle, 
  Target, 
  BarChart3, 
  Repeat, 
  ShieldCheck, 
  Users, 
  Calendar,
  Globe
} from "lucide-react";

const allFeatures = [
  {
    icon: Zap,
    title: "Instant Replies",
    description: "Never keep a customer waiting. Our AI responds to incoming messages in sub-second times.",
    color: "bg-green-50 text-green-600"
  },
  {
    icon: Target,
    title: "Smart Qualification",
    description: "Automatically filter high-value leads based on custom business criteria and conversation flow.",
    color: "bg-blue-50 text-blue-600"
  },
  {
    icon: Calendar,
    title: "Auto-Booking",
    description: "Connect your calendar and let the AI book appointments directly within the WhatsApp chat.",
    color: "bg-yellow-50 text-yellow-600"
  },
  {
    icon: BarChart3,
    title: "Live Analytics",
    description: "Detailed dashboards showing conversion rates, lead source, and bot performance in real-time.",
    color: "bg-purple-50 text-purple-600"
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description: "End-to-end encryption and compliance with global data protection standards.",
    color: "bg-red-50 text-red-600"
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Engage with customers in 50+ languages with perfect grammar and regional context.",
    color: "bg-indigo-50 text-indigo-600"
  },
  {
    icon: Repeat,
    title: "CRM Sync",
    description: "Automatically push lead data to HubSpot, Salesforce, or your own custom CRM systems.",
    color: "bg-orange-50 text-orange-600"
  },
  {
    icon: Users,
    title: "Human Handoff",
    description: "Seamlessly transition complex queries to your team members when the AI detects a need.",
    color: "bg-cyan-50 text-cyan-600"
  },
  {
    icon: MessageCircle,
    title: "Rich Media",
    description: "Support for images, PDFs, voice notes, and interactive WhatsApp buttons.",
    color: "bg-teal-50 text-teal-600"
  }
];

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-24">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#dcfce7] text-[#22c55e] text-xs font-bold uppercase tracking-widest mb-6 border border-[#22c55e]/10">
            Platform Features
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-[#0f172a] mb-8 font-[family-name:var(--font-sora)] leading-tight tracking-tight">
            Everything You Need to <br />
            <span className="text-[#22c55e]">Scale WhatsApp</span> Sales
          </h1>
          <p className="text-xl text-[#6b7280] max-w-2xl mx-auto leading-relaxed font-medium">
            Powerful tools designed for local businesses and enterprise teams who value speed, accuracy, and automation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
            {allFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-8 rounded-[32px] border border-gray-100 bg-white hover:border-[#22c55e]/20 hover:shadow-2xl hover:shadow-green-500/5 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 ${feature.color}`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-[#0f172a] mb-4 font-[family-name:var(--font-sora)]">{feature.title}</h3>
                <p className="text-[#6b7280] leading-relaxed font-semibold">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <FloatingAIWidget />
    </div>
  );
}
