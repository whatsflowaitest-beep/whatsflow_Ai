"use client";

import { motion } from "framer-motion";

const companies = [
  "SmilePlus Dental",
  "Realty Pro",
  "GlowSalon",
  "PhysioEdge",
  "MindWell",
  "HomeSearch",
  "ClearSmile",
  "PrimeLiving",
  "StyleHub",
  "FitBody",
  "EasyLoan",
  "BrightCare",
];

export function SocialProof() {
  return (
    <section className="bg-white border-y border-[#E2EDE2] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-[#6B7B6B] mb-6">
          Trusted by <span className="text-[#16A34A] font-semibold">200+</span>{" "}
          businesses worldwide
        </p>

        {/* Desktop: static row */}
        <div className="hidden sm:flex items-center justify-center gap-8 lg:gap-12 flex-wrap">
          {companies.slice(0, 6).map((company) => (
            <span
              key={company}
              className="text-sm font-semibold text-gray-300 tracking-wide uppercase select-none"
            >
              {company}
            </span>
          ))}
        </div>

        {/* Mobile: marquee */}
        <div className="sm:hidden overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex gap-10 whitespace-nowrap w-max"
          >
            {[...companies, ...companies].map((company, i) => (
              <span
                key={i}
                className="text-sm font-semibold text-gray-300 tracking-wide uppercase select-none"
              >
                {company}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
