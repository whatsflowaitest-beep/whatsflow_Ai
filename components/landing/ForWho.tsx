"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Stethoscope, 
  Home, 
  Sparkles, 
  GraduationCap, 
  Car, 
  ShoppingBag, 
  Wrench, 
  Briefcase 
} from "lucide-react";
import { SectionHeaderBlock } from "./SectionHeaderBlock";

const categories = [
  {
    icon: Stethoscope,
    title: "Dental & Medical Clinics",
    description:
      "Book more appointments and handle patient inquiries automatically — even outside office hours.",
  },
  {
    icon: Home,
    title: "Real Estate Agencies",
    description:
      "Qualify buyer and renter leads 24/7, capture property interests, and schedule viewings automatically.",
  },
  {
    icon: Sparkles,
    title: "Salons & Wellness Studios",
    description:
      "Fill your calendar effortlessly. AI handles bookings, upsells services, and sends reminders.",
  },
  {
    icon: GraduationCap,
    title: "Educational & Tutors",
    description:
      "Convert enrollment inquiries into students. AI handles course FAQs and schedules trial classes.",
  },
  {
    icon: Car,
    title: "Auto Dealers & Rentals",
    description:
      "Qualify high-intent buyers, capture vehicle interests, and book test drives or rentals instantly.",
  },
  {
    icon: ShoppingBag,
    title: "E-commerce Brands",
    description:
      "Reduce cart abandonment and handle order inquiries on WhatsApp to drive more sales.",
  },
  {
    icon: Wrench,
    title: "Home Service Pros",
    description:
      "Plumbers, electricians, and contractors can capture job details and book site visits on the fly.",
  },
  {
    icon: Briefcase,
    title: "Service Agencies",
    description:
      "Qualify leads, answer FAQs, and book discovery calls — all on autopilot while you focus on delivery.",
  },
];

export function ForWho() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <SectionHeaderBlock
            label="Who It's For"
            title="Built For Businesses That Run on Leads"
            center
          />
          <p className="text-lg text-[#6B7B6B] max-w-xl mx-auto">
            If WhatsApp is your primary sales channel, WhatsFlow AI was built
            for you.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className="group bg-white rounded-xl p-6 border border-[#E2EDE2] hover:border-[#16A34A] transition-all shadow-sm hover:shadow-md cursor-default text-center"
            >
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="w-full h-full bg-[#DCFCE7] rounded-full flex items-center justify-center border border-[#16A34A]/10 shadow-sm transition-transform duration-300 group-hover:scale-110">
                  <cat.icon className="w-7 h-7 text-[#16A34A]" />
                </div>
              </div>
              <h3 className="font-semibold text-[#0F1F0F] mb-2 text-base">
                {cat.title}
              </h3>
              <p className="text-sm text-[#6B7B6B] leading-relaxed">
                {cat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
