"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { SectionHeaderBlock } from "./SectionHeaderBlock";
import { 
  Plus,
  ArrowRight
} from "lucide-react";

interface IntegrationNodeProps {
  name: string;
  iconUrl: string;
  color: string;
  side: "left" | "right";
  index: number;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}

const IntegrationNode = ({ name, iconUrl, color, side, index, isHovered, onHover }: IntegrationNodeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      animate={{ 
        y: [0, -4, 0],
        scale: isHovered ? 1.05 : 1
      }}
      transition={{ 
        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 },
        scale: { duration: 0.2 }
      }}
      className={`flex items-center gap-6 group cursor-pointer ${side === "right" ? "flex-row-reverse text-right" : ""}`}
    >
      <div 
        className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-2xl border transition-all duration-500 overflow-hidden p-3 relative z-10 ${
          isHovered ? "border-[#22c55e] scale-110" : "border-gray-100"
        }`}
        style={{ 
          boxShadow: isHovered 
            ? `0 20px 40px -10px ${color}60, 0 0 20px ${color}20` 
            : `0 10px 25px -5px ${color}20`
        }}
      >
        <img src={iconUrl} alt={name} className="w-full h-full object-contain relative z-10" />
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" 
          style={{ backgroundColor: color }}
        />
      </div>
      <div className="flex flex-col">
        <h4 className={`font-bold text-lg leading-none mb-1.5 transition-colors duration-300 ${
          isHovered ? "text-[#16A34A]" : "text-[#0f172a]"
        }`}>{name}</h4>
        <div className={`h-1 w-0 bg-[#16A34A] rounded-full transition-all duration-300 ${isHovered ? "w-full" : "w-0"}`} />
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Ready for Flow</p>
      </div>
    </motion.div>
  );
};

export function Integrations() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const leftIntegrations = [
    { name: "Salesforce", iconUrl: "https://img.icons8.com/color/96/salesforce.png", color: "#00A1E0" },
    { name: "Zoho CRM", iconUrl: "https://cdn.brandfetch.io/id-_6xoxrI/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B", color: "#EF4444" },
    { name: "WooCommerce", iconUrl: "https://img.icons8.com/color/96/woocommerce.png", color: "#96588A" },
    { name: "Calendly", iconUrl: "https://cdn.brandfetch.io/idbJpTKFPT/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B", color: "#006BFF" },
  ];

  const rightIntegrations = [
    { name: "HubSpot", iconUrl: "https://cdn.brandfetch.io/idRt0LuzRf/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B", color: "#FF7A59" },
    { name: "Zapier", iconUrl: "https://img.icons8.com/color/96/zapier.png", color: "#FF4A00" },
    { name: "Shopify", iconUrl: "https://img.icons8.com/color/96/shopify.png", color: "#7AB55C" },
    { name: "Google Sheets", iconUrl: "https://img.icons8.com/fluency/96/google-sheets--v2.png", color: "#22C55E" },
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden" ref={containerRef}>
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: "radial-gradient(#16A34A 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-tr from-green-50/40 to-blue-50/40 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <SectionHeaderBlock
            label="Ecosystem"
            title="Your Tech Stack, Unified."
            center
          />
          <p className="text-[#6B7B6B] text-center max-w-xl mx-auto mt-4 text-lg leading-relaxed">
            WhatsFlow AI seamlessly bridges the gap between WhatsApp and your daily tools.
          </p>
        </div>

        <div className="relative flex items-center justify-center min-h-[550px]">
          {/* SVG Connector Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1000 550">
            <defs>
              <filter id="glow-heavy">
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
              </filter>
            </defs>
            
            {/* Left Lines */}
            {leftIntegrations.map((item, i) => {
              const yStart = 65 + i * 140;
              const path = `M 230 ${yStart} C 380 ${yStart}, 420 275, 500 275`;
              const active = hoveredNode === item.name;
              return (
                <g key={`left-line-${i}`}>
                  <motion.path
                    d={path}
                    stroke={active ? item.color : "#E2EDE2"}
                    strokeWidth={active ? "3" : "1.5"}
                    fill="transparent"
                    initial={{ pathLength: 0, opacity: 0.1 }}
                    animate={isInView ? { 
                      pathLength: 1, 
                      opacity: active ? 1 : 0.3,
                      stroke: active ? item.color : "#E2EDE2"
                    } : {}}
                    transition={{ duration: 1.2, delay: i * 0.1 }}
                  />
                  {/* Data Flow Pulse */}
                  <motion.circle
                    r={active ? "3.5" : "1.8"}
                    fill={active ? item.color : "#16A34A"}
                    initial={{ offsetDistance: "0%", opacity: 0 }}
                    animate={{ 
                      offsetDistance: "100%", 
                      opacity: active ? [0, 1, 0] : [0, 0.4, 0] 
                    }}
                    transition={{ 
                      duration: active ? 1.5 : 4, 
                      repeat: Infinity, 
                      delay: i * 0.5, 
                      ease: "linear" 
                    }}
                    style={{ offsetPath: `path("${path}")`, filter: active ? "url(#glow-heavy)" : "none" }}
                  />
                </g>
              );
            })}

            {/* Right Lines */}
            {rightIntegrations.map((item, i) => {
              const yStart = 65 + i * 140;
              const path = `M 770 ${yStart} C 620 ${yStart}, 580 275, 500 275`;
              const active = hoveredNode === item.name;
              return (
                <g key={`right-line-${i}`}>
                   <motion.path
                    d={path}
                    stroke={active ? item.color : "#E2EDE2"}
                    strokeWidth={active ? "3" : "1.5"}
                    fill="transparent"
                    initial={{ pathLength: 0, opacity: 0.1 }}
                    animate={isInView ? { 
                      pathLength: 1, 
                      opacity: active ? 1 : 0.3,
                      stroke: active ? item.color : "#E2EDE2"
                    } : {}}
                    transition={{ duration: 1.2, delay: i * 0.1 }}
                  />
                  <motion.circle
                    r={active ? "3.5" : "1.8"}
                    fill={active ? item.color : "#16A34A"}
                    initial={{ offsetDistance: "0%", opacity: 0 }}
                    animate={{ 
                      offsetDistance: "100%", 
                      opacity: active ? [0, 1, 0] : [0, 0.4, 0] 
                    }}
                    transition={{ 
                      duration: active ? 1.5 : 4, 
                      repeat: Infinity, 
                      delay: i * 0.5, 
                      ease: "linear" 
                    }}
                    style={{ offsetPath: `path("${path}")`, filter: active ? "url(#glow-heavy)" : "none" }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Central Hub Core */}
          <div className="relative z-20 isolate">
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ type: "spring", damping: 15, delay: 0.3 }}
              className="w-32 h-32 rounded-[32px] bg-[#0F1F0F] shadow-[0_0_50px_-10px_rgba(22,163,74,0.4)] flex items-center justify-center group relative border border-white/10"
            >
              <div className="w-16 h-16 relative z-10 transition-transform duration-500 group-hover:scale-110">
                <img src="/logo-robot.png" alt="Hub Core" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(22,163,74,0.6)]" />
              </div>

              {/* Advanced Orbits */}
              {[1, 2, 3].map((orbit) => (
                <div 
                  key={orbit}
                  className="absolute pointer-events-none"
                  style={{ 
                    inset: `-${orbit * 20}px`,
                    border: `1px dashed ${orbit === 1 ? 'rgba(22,163,74,0.3)' : 'rgba(22,163,74,0.1)'}`,
                    borderRadius: '45%',
                    animation: `spin ${10 + orbit * 5}s linear infinite${orbit === 2 ? ' reverse' : ''}`
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Left Side Integrations */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-6 z-10 w-64">
            {leftIntegrations.map((item, i) => (
              <IntegrationNode 
                key={item.name} 
                {...item} 
                side="left" 
                index={i} 
                isHovered={hoveredNode === item.name}
                onHover={(h) => setHoveredNode(h ? item.name : null)}
              />
            ))}
          </div>

          {/* Right Side Integrations */}
          <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between py-6 z-10 w-64">
            {rightIntegrations.map((item, i) => (
              <IntegrationNode 
                key={item.name} 
                {...item} 
                side="right" 
                index={i} 
                isHovered={hoveredNode === item.name}
                onHover={(h) => setHoveredNode(h ? item.name : null)}
              />
            ))}
          </div>
        </div>
      </div>


      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
