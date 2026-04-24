"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Globe, CheckCircle2 } from "lucide-react";
import { SectionHeaderBlock } from "./SectionHeaderBlock";

const globalData = [
  { country: "Sri Lanka", code: "lk", languages: ["Sinhala", "Tamil", "English"] },
  { country: "United States", code: "us", languages: ["English", "Spanish"] },
  { country: "United Kingdom", code: "gb", languages: ["English"] },
  { country: "India", code: "in", languages: ["Hindi", "English", "Regional"] },
  { country: "UAE", code: "ae", languages: ["Arabic", "English"] },
  { country: "Australia", code: "au", languages: ["English"] },
  { country: "Singapore", code: "sg", languages: ["English", "Malay"] },
  { country: "Canada", code: "ca", languages: ["English", "French"] },
  { country: "Japan", code: "jp", languages: ["Japanese"] },
  { country: "Germany", code: "de", languages: ["German"] },
  { country: "France", code: "fr", languages: ["French"] },
  { country: "Brazil", code: "br", languages: ["Portuguese"] },
  { country: "Mexico", code: "mx", languages: ["Spanish"] },
  { country: "Italy", code: "it", languages: ["Italian"] },
  { country: "South Korea", code: "kr", languages: ["Korean"] },
  { country: "Spain", code: "es", languages: ["Spanish"] },
  { country: "Netherlands", code: "nl", languages: ["Dutch"] },
  { country: "Switzerland", code: "ch", languages: ["German", "French"] },
  { country: "New Zealand", code: "nz", languages: ["English"] },
  { country: "Ireland", code: "ie", languages: ["English"] },
  { country: "Malaysia", code: "my", languages: ["Malay", "English"] },
  { country: "Thailand", code: "th", languages: ["Thai"] },
  { country: "Vietnam", code: "vn", languages: ["Vietnamese"] },
  { country: "Indonesia", code: "id", languages: ["Indonesian"] },
  { country: "Turkey", code: "tr", languages: ["Turkish"] },
  { country: "Saudi Arabia", code: "sa", languages: ["Arabic"] },
  { country: "South Africa", code: "za", languages: ["English", "Afrikaans"] },
  { country: "Norway", code: "no", languages: ["Norwegian"] },
  { country: "Sweden", code: "se", languages: ["Swedish"] },
  { country: "Denmark", code: "dk", languages: ["Danish"] },
];

export function GlobalReach() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-[#F0F7F0] overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <SectionHeaderBlock
            label="Global Support"
            title="Localized Intelligence for a Connected World"
            center
          />
          <p className="text-lg text-[#6B7B6B] max-w-2xl mx-auto mt-4">
            WhatsFlow AI communicates naturally in 50+ languages, supporting businesses across borders with localized cultural nuances.
          </p>
        </motion.div>

        {/* Infinite Scroller */}
        <div className="relative group">
          {/* Gradients to fade out edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F0F7F0] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#F0F7F0] to-transparent z-10 pointer-events-none" />

          <div className="flex overflow-hidden">
            <div
              className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused]"
            >
              {/* Double up items for seamless loop */}
              {[...globalData, ...globalData].map((item, i) => (
                <div
                  key={`${item.country}-${i}`}
                  className="inline-flex items-center gap-5 bg-[#F8FAF8] border border-[#E2EDE2] rounded-[20px] px-7 py-5 mx-3 hover:border-[#16A34A] hover:bg-white hover:shadow-lg transition-all cursor-default min-w-[240px]"
                >
                  <div className="w-10 h-7 shrink-0 overflow-hidden rounded-md shadow-sm border border-black/5">
                    <img 
                      src={`https://flagcdn.com/w80/${item.code}.png`} 
                      alt={item.country}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-base font-black text-[#0F1F0F] tracking-tight leading-none mb-1">{item.country}</span>
                    <span className="text-[10px] font-black text-[#16A34A] uppercase tracking-widest">
                      {item.languages[0]} Enabled
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <style jsx>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 60s linear infinite;
            }
            .animate-marquee:hover {
              animation-play-state: paused;
              cursor: pointer;
            }
          `}</style>
        </div>

        {/* Static Details Grid (Simplified) */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-[#f0f9f0] rounded-xl flex items-center justify-center text-[#16A34A] mx-auto mb-4">
              <Globe className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-[#0F1F0F] mb-2">Native LLM Training</h4>
            <p className="text-xs text-[#6B7B6B] leading-relaxed">We don&apos;t just translate. We train models on local cultural context and slang.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-[#f0f9f0] rounded-xl flex items-center justify-center text-[#16A34A] mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-[#0F1F0F] mb-2">100% Signal Quality</h4>
            <p className="text-xs text-[#6B7B6B] leading-relaxed">Latency-optimized servers in every region for instant WhatsApp delivery.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-[#f0f9f0] rounded-xl flex items-center justify-center text-[#16A34A] mx-auto mb-4">
              <span className="font-black text-xs">50+</span>
            </div>
            <h4 className="font-bold text-[#0F1F0F] mb-2">Linguistic Coverage</h4>
            <p className="text-xs text-[#6B7B6B] leading-relaxed">Supporting formal and informal dialects across Asia, Europe, and Americas.</p>
          </div>
        </div>

      </div>
    </section>
  );
}
