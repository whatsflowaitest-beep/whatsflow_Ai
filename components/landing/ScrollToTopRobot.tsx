"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ArrowUp, Sparkles } from "lucide-react";

export function ScrollToTopRobot() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 400px
      const scrolled = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrolled > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      const progress = (scrolled / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-44 right-6 z-[100] flex flex-col items-center gap-4">
      <AnimatePresence>
        {isVisible && (
          <div className="relative group">
            {/* Scroll Progress Ring */}
            <svg className="w-14 h-14 -rotate-90 pointer-events-none">
              <circle
                cx="28" cy="28" r="24"
                stroke="currentColor" strokeWidth="2"
                fill="transparent" className="text-gray-100"
              />
              <motion.circle
                cx="28" cy="28" r="24"
                stroke="currentColor" strokeWidth="3"
                fill="transparent" strokeDasharray="150.8"
                animate={{ strokeDashoffset: 150.8 - (150.8 * scrollProgress) / 100 }}
                className="text-[#16A34A] drop-shadow-[0_0_8px_rgba(22,163,74,0.4)]"
              />
            </svg>

            {/* Scroll Button */}
            <motion.button
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 45 }}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="absolute inset-1.5 rounded-full bg-white shadow-xl flex flex-col items-center justify-center text-[#16A34A] border border-[#E2EDE2] group-hover:border-[#16A34A] transition-colors"
            >
              <ArrowUp className="w-5 h-5 mb-0.5" />
              <div className="relative opacity-40 group-hover:opacity-100 transition-opacity">
                <Bot className="w-3 h-3" />
              </div>
            </motion.button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
