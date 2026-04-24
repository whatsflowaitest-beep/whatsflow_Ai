"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const metrics = [
  { value: "3x", label: "Faster Lead Response" },
  { value: "68%", label: "Higher Conversion Rate" },
  { value: "24/7", label: "Always-On AI Coverage" },
  { value: "48hrs", label: "Average Setup Time" },
];

function AnimatedStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="text-center px-6"
    >
      <p className="text-4xl sm:text-5xl font-bold text-white mb-1">{value}</p>
      <p className="text-green-200 text-sm font-medium">{label}</p>
    </motion.div>
  );
}

export function MetricsBar() {
  return (
    <section className="py-16 bg-[#16A34A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-green-500">
          {metrics.map((metric, i) => (
            <AnimatedStat
              key={metric.label}
              value={metric.value}
              label={metric.label}
              delay={0.1 + i * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
