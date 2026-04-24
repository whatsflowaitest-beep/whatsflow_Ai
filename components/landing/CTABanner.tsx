"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeaderBlock } from "./SectionHeaderBlock";

export function CTABanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 bg-[#16A34A] noise-bg relative overflow-hidden" ref={ref}>
      {/* Decorative circles */}
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <SectionHeaderBlock 
            label="Get Started"
            title="Ready to Convert More Leads on Autopilot?" 
            center 
            variant="white"
          />
          <p className="text-green-100 text-lg mb-8">
            Join 200+ businesses. Setup in 48 hours. Start converting leads
            tonight.
          </p>
          <Link href="/auth/register">
            <Button
              size="lg"
              className="bg-white text-[#16A34A] hover:bg-[#F0F7F0] px-8 h-12 text-base font-bold transition-all shadow-xl shadow-[#0D622D]/20 border-none"
            >
              Book a Free Demo Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <p className="text-green-200 text-sm mt-4">
            No credit card required
          </p>
        </motion.div>
      </div>
    </section>
  );
}
