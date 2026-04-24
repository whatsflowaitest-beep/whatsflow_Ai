"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, Target, Calendar, Database, Bell, MessageCircle } from "lucide-react";
import { SectionHeaderBlock } from "./SectionHeaderBlock";

const features = [
  {
    icon: Zap,
    title: "Instant 24/7 Response",
    description:
      "Automated replies in under 1 second. Your AI never sleeps, ensuring no lead is ever left waiting, regardless of the hour.",
  },
  {
    icon: Target,
    title: "Autonomous Screening",
    description:
      "The AI asks intelligent qualifying questions to filter out time-wasters and focus your team on high-value prospects.",
  },
  {
    icon: Calendar,
    title: "Seamless Appointment Booking",
    description:
      "Automatically shares your booking links (Calendly, etc.) as soon as a lead is qualified, filling your calendar on autopilot.",
  },
  {
    icon: Database,
    title: "Automated Data Sync",
    description:
      "Every conversation and lead detail is synced to your CRM or Google Sheets in real-time. No more manual data entry errors.",
  },
  {
    icon: Bell,
    title: "Persistent Follow-ups",
    description:
      "Automatically re-engages leads who fall silent, using natural-language pings to revive dead conversations and win back sales.",
  },
  {
    icon: MessageCircle,
    title: "Human-Quality Interaction",
    description:
      "Advanced natural language processing ensures replies sound warm and professional, building immediate trust with your prospects.",
  },
];

export function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="py-20 bg-[#F8FAF8]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <SectionHeaderBlock 
            label="Capabilities"
            title="Everything You Need to Scale your WhatsApp Sales" 
            center 
          />
          <p className="text-lg text-[#6B7B6B] max-w-2xl mx-auto leading-relaxed">
            Stop juggling messages. One unified system to capture, qualify, and book every single lead that hits your WhatsApp.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 + i * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group bg-white rounded-xl p-6 border border-[#E2EDE2] shadow-sm hover:border-[#16A34A] hover:shadow-md transition-all cursor-default"
            >
              <div className="w-11 h-11 rounded-xl bg-[#DCFCE7] flex items-center justify-center mb-4 group-hover:bg-[#16A34A] transition-colors">
                <feature.icon className="w-5 h-5 text-[#16A34A] group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-semibold text-[#0F1F0F] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[#6B7B6B] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
