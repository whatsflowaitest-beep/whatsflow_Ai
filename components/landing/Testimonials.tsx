"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SectionHeaderBlock } from "./SectionHeaderBlock";

const testimonials = [
  {
    quote:
      "WhatsFlow AI cut our missed leads by 70%. We now book appointments while we sleep. The ROI in the first month was insane.",
    name: "Dr. Amara K.",
    role: "Dental Clinic Owner",
    initials: "AK",
    color: "bg-[#16A34A]",
  },
  {
    quote:
      "I used to spend 2 hours daily on WhatsApp follow-ups. Now it's fully automated. This is a genuine game changer for my business.",
    name: "Marcus R.",
    role: "Real Estate Agent",
    initials: "MR",
    color: "bg-blue-500",
  },
  {
    quote:
      "Setup was done in 24 hours. Our booking rate jumped 40% in the first week. I wish I had this years ago.",
    name: "Priya S.",
    role: "Salon Owner",
    initials: "PS",
    color: "bg-purple-500",
  },
  {
    quote:
      "Finally a solution that actually understands context. It qualifies leads better than some humans we've hired in the past.",
    name: "David L.",
    role: "SaaS Founder",
    initials: "DL",
    color: "bg-orange-500",
  },
  {
    quote:
      "Our conversion rate from WhatsApp inquiries went from 12% to nearly 35% within the first month of using WhatsFlow AI.",
    name: "Sarah T.",
    role: "Marketing Agency",
    initials: "ST",
    color: "bg-pink-500",
  },
  {
    quote:
      "The automation is incredibly smart. It handles edge cases and difficult questions without ever sounding like a generic bot.",
    name: "James W.",
    role: "Fitness Coach",
    initials: "JW",
    color: "bg-cyan-500",
  },
];

const doubledTestimonials = [...testimonials, ...testimonials];

const stars = "⭐⭐⭐⭐⭐";

export function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 bg-white overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <SectionHeaderBlock 
            label="Testimonials"
            title="What Our Customers Say" 
            center 
          />
        </motion.div>
      </div>

      {/* Marquee Wrapper */}
      <div className="relative flex overflow-x-hidden group">
        <div className="flex whitespace-nowrap animate-marquee pause-on-hover py-4">
          {doubledTestimonials.map((t, i) => (
            <div
              key={`${t.name}-${i}`}
              className="inline-block w-[350px] mx-4 bg-white rounded-2xl p-6 border border-[#E2EDE2] shadow-sm flex flex-col gap-4 whitespace-normal ring-1 ring-[#16A34A]/5 hover:border-[#16A34A] transition-colors cursor-default"
            >
              <div className="text-sm text-yellow-500">{stars}</div>
              <p className="text-[#0F1F0F] leading-relaxed text-sm flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#E2EDE2]">
                <div
                  className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center shrink-0 shadow-sm`}
                >
                  <span className="text-white text-[10px] font-bold">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0F1F0F]">
                    {t.name}
                  </p>
                  <p className="text-[10px] text-[#6B7B6B]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
