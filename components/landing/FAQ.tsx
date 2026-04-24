"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeaderBlock } from "./SectionHeaderBlock";

const faqs = [
  {
    question: "Do I need any coding skills?",
    answer:
      "None at all. We handle the entire setup for you within 48 hours. You just provide us with your business details and we take care of everything else.",
  },
  {
    question: "Which WhatsApp number do I connect?",
    answer:
      "You can use your existing business WhatsApp number via the official WhatsApp Cloud API. We'll guide you through the simple verification process.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Most businesses are live within 24–48 hours after purchase. We configure your AI, test the flows, and hand over a fully working system.",
  },
  {
    question: "Can it handle multiple services or locations?",
    answer:
      "Yes. The Growth plan supports multi-service qualification flows and can handle different service types, pricing, and booking links within a single number.",
  },
  {
    question: "What happens if a lead asks something complex?",
    answer:
      "The AI handles it gracefully using its knowledge base. If it genuinely can't handle a query, it will notify you and can escalate to a human seamlessly.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "We offer a free demo so you can see it working on your own WhatsApp before you buy. No credit card required — just book a call and we'll set it up live.",
  },
];

export function FAQ() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="faq" className="py-20 bg-[#F8FAF8]" ref={ref}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <SectionHeaderBlock 
            label="FAQ"
            title="Frequently Asked Questions" 
            center 
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-white rounded-xl border border-[#E2EDE2] px-6 data-[state=open]:border-[#16A34A] transition-colors"
              >
                <AccordionTrigger className="text-left font-semibold text-[#0F1F0F] hover:no-underline hover:text-[#16A34A] transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#6B7B6B] leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
