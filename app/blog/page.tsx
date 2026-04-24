"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FloatingAIWidget } from "@/components/landing/FloatingAIWidget";
import { motion } from "framer-motion";

const blogPosts = [
  {
    category: "AI Trends",
    title: "How Conversational AI is Revolutionizing Local Retail in 2026",
    excerpt: "Discover how small shops are using WhatsApp bots to compete with global giants...",
    date: "April 15, 2026",
    readTime: "5 min read"
  },
  {
    category: "Product Updates",
    title: "Introducing Smart Handoff: Seamless Human-AI Collaboration",
    excerpt: "Our latest feature allows your team to step in exactly when the conversation needs a human touch...",
    date: "April 10, 2026",
    readTime: "3 min read"
  },
  {
    category: "Quick Tips",
    title: "5 WhatsApp Message Templates That Convert 3x Better",
    excerpt: "Stop sending generic greetings. Use these proven templates to drive immediate user action...",
    date: "March 28, 2026",
    readTime: "4 min read"
  }
];

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black text-[#0f172a] mb-6 font-[family-name:var(--font-sora)] tracking-tight">
            The <span className="text-[#22c55e]">WhatsFlow</span> Blog
          </h1>
          <p className="text-xl text-[#6b7280] max-w-2xl mx-auto leading-relaxed font-bold">
            Insights, updates, and secrets on WhatsApp automation and AI-driven growth.
          </p>
        </div>

        {/* Featured Post Placeholder */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
          <div className="relative h-[400px] rounded-[40px] overflow-hidden bg-gray-900 group cursor-pointer">
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
             <div className="absolute bottom-12 left-12 right-12">
               <span className="bg-[#22c55e] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">Featured</span>
               <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight max-w-2xl font-[family-name:var(--font-sora)]">
                 The Ultimate Guide to Scaling Your Customer Service with WhatsApp AI
               </h2>
               <p className="text-gray-300 font-medium text-lg max-w-xl">Learn the exact strategies used by top businesses to handle 10,000+ chats weekly without adding a single support agent.</p>
             </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {blogPosts.map((post, i) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="h-64 rounded-[32px] bg-gray-100 mb-8 overflow-hidden relative">
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[#22c55e] font-black text-xs uppercase tracking-widest">{post.category}</span>
                  <div className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span className="text-gray-400 font-bold text-xs">{post.readTime}</span>
                </div>
                <h3 className="text-2xl font-bold text-[#0f172a] mb-4 group-hover:text-[#22c55e] transition-colors font-[family-name:var(--font-sora)] leading-tight">
                  {post.title}
                </h3>
                <p className="text-[#6b7280] leading-relaxed font-semibold mb-6">
                  {post.excerpt}
                </p>
                <span className="text-gray-400 text-sm font-bold">{post.date}</span>
              </motion.article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <FloatingAIWidget />
    </div>
  );
}
