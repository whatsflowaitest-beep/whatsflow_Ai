"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Moon, Clock, UserX } from "lucide-react";
import { SectionHeaderBlock } from "./SectionHeaderBlock";

const problems = [
  {
    icon: Moon,
    title: "Leads message at midnight — you're offline",
    description:
      "Potential customers expect instant replies. While you sleep, your competitors are winning over your leads by being the first to respond.",
  },
  {
    icon: Clock,
    title: "Manual screening drains 60% of your day",
    description:
      "Chasing unqualified leads, asking basic questions, and sending manual links is a massive time sink that prevents scaling your core business.",
  },
  {
    icon: UserX,
    title: "Slow responses kill your conversion rate",
    description:
      "Being 5 minutes late to a WhatsApp inquiry reduces conversion by 80%. Every minute of silence is a lost opportunity for your business.",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function Problem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="problem" className="py-20 bg-[#F0F7F0]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <SectionHeaderBlock 
            label="The Opportunity Gap"
            title="Silence is the #1 Conversion Killer" 
            center 
          />
          <p className="text-lg text-[#6B7B6B] max-w-3xl mx-auto leading-relaxed">
            SaaS and service businesses lose over half of their potential revenue due to slow WhatsApp response times.
            If you don&apos;t reply instantly, your leads move on to the next option.
          </p>
        </motion.div>

        {/* Problem Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, i) => (
            <motion.div
              key={problem.title}
              variants={fadeInUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-l-red-400 border border-[#E2EDE2]"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <problem.icon className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0F1F0F] mb-2 leading-snug">
                    {problem.title}
                  </h3>
                  <p className="text-sm text-[#6B7B6B] leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
