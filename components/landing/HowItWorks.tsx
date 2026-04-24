"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MessageCircle, Bot, CalendarCheck } from "lucide-react";
import { SectionHeaderBlock } from "./SectionHeaderBlock";

const steps = [
  {
    number: "1",
    icon: MessageCircle,
    title: "Lead Messages You",
    description:
      "A prospect sends a message to your WhatsApp number at any time — day or night, weekday or weekend.",
  },
  {
    number: "2",
    icon: Bot,
    title: "AI Qualifies Instantly",
    description:
      "Our AI replies in under 1 second, asks smart questions, and understands their intent — just like a human would.",
  },
  {
    number: "3",
    icon: CalendarCheck,
    title: "Appointment Auto-Booked",
    description:
      "Booking link sent, lead saved to your sheet, and follow-up scheduled automatically. Zero effort from you.",
  },
];

export function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-20 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <SectionHeaderBlock 
            label="How It Works"
            title="Up and Running in 48 Hours" 
            center 
          />
          <p className="text-lg text-[#6B7B6B] max-w-xl mx-auto">
            No code. No complexity. Just results.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-0.5 bg-[#E2EDE2] z-0" />

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                {/* Number circle */}
                <motion.div
                  animate={
                    inView
                      ? {
                          scale: [1, 1.1, 1],
                          transition: {
                            delay: 0.5 + i * 0.3,
                            duration: 0.5,
                            repeat: 0,
                          },
                        }
                      : {}
                  }
                  className="w-24 h-24 rounded-full bg-[#DCFCE7] border-4 border-white shadow-md flex items-center justify-center mb-6 relative"
                >
                  <step.icon className="w-9 h-9 text-[#16A34A]" />
                  <span className="absolute -top-1 -right-1 w-7 h-7 bg-[#16A34A] rounded-full text-white text-sm font-bold flex items-center justify-center shadow">
                    {step.number}
                  </span>
                </motion.div>

                <h3 className="text-xl font-semibold text-[#0F1F0F] mb-3">
                  {step.title}
                </h3>
                <p className="text-[#6B7B6B] leading-relaxed text-sm">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
