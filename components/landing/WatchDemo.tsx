"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Play, MessageCircle, Zap, BarChart3 } from "lucide-react";
import { SectionHeaderBlock } from "./SectionHeaderBlock";

const features = [
  {
    icon: MessageCircle,
    title: "Natural Conversations",
    description: "AI that doesn't sound like a bot, handling complex queries with ease.",
  },
  {
    icon: Zap,
    title: "Instant Qualification",
    description: "Automatically identify high-value leads in seconds based on your criteria.",
  },
  {
    icon: BarChart3,
    title: "Live Analytics",
    description: "Track conversion rates and ROI in real-time from your dashboard.",
  },
];

export function WatchDemo() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="demo" className="py-20 bg-[#F9FAFB]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <SectionHeaderBlock 
              label="Product Tour"
              title="See WhatsFlow AI in Action" 
            />
            <p className="text-lg text-[#6b7280] mb-12 max-w-lg">
              Experience how our AI qualifying engine turns cold WhatsApp traffic into booked appointments automatically.
            </p>

            <div className="space-y-10">
              {features.map((feature, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#dcfce7] border-4 border-white shadow-md flex items-center justify-center">
                    <feature.icon className="w-7 h-7 text-[#22c55e]" />
                  </div>
                  <div className="pt-1">
                    <h3 className="text-xl font-semibold text-[#0f172a] mb-2 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-[#6b7280] text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Video Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            {/* Video Container Decoration */}
            <div className="absolute -inset-4 bg-white rounded-[48px] -z-10" />
            
            {/* Video Card */}
            <div className="relative bg-[#0f172a] rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.15)] border-8 border-white ring-1 ring-gray-100 aspect-video flex items-center justify-center group cursor-pointer">
              {/* Overlay Decor */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#22c55e]/5 to-transparent pointer-events-none" />
              
              {/* Fake UI Elements */}
              <div className="absolute top-8 left-8 w-1/3 space-y-2 opacity-20 group-hover:opacity-30 transition-opacity">
                <div className="h-2 bg-white rounded-full w-full" />
                <div className="h-2 bg-white rounded-full w-2/3" />
              </div>

              {/* Play Button */}
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-[#22c55e] shadow-2xl z-10"
              >
                <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-10 group-hover:opacity-20" />
                <Play className="w-8 h-8 fill-current ml-1" />
              </motion.button>
              
              {/* Progress bar at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={inView ? { width: "70%" } : {}}
                  transition={{ duration: 2, delay: 1 }}
                  className="h-full bg-[#22c55e]"
                />
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -right-4 md:right-4 bg-white p-5 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-gray-50 flex items-center gap-4 z-20"
            >
              <div className="w-12 h-12 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#22c55e]">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">Total Leads</p>
                <p className="text-lg font-bold text-[#0f172a]">12,482 Generated</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}


