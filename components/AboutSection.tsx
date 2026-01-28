"use client";

import { motion } from "framer-motion";
import { Plane } from "lucide-react";

export function AboutSection() {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-br from-sky-50 via-blue-50 to-slate-50 overflow-hidden">
      {/* Decorative dotted line */}
      <div className="absolute top-32 left-10 w-64 h-64">
        <svg width="200" height="200" className="opacity-20">
          <path
            d="M 10 10 Q 50 150, 190 190"
            stroke="#1e40af"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />
        </svg>
      </div>

      {/* Floating airplane icon */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        viewport={{ once: true }}
        className="absolute top-1/3 right-12 text-blue-700 opacity-20"
      >
        <Plane size={80} className="rotate-45" />
      </motion.div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-6xl md:text-7xl lg:text-8xl font-bold text-blue-900 mb-12"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Travelor
        </motion.h1>

        {/* Description Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl md:text-2xl lg:text-3xl text-blue-900 leading-relaxed font-light max-w-4xl mx-auto"
          style={{ fontFamily: "Georgia, serif" }}
        >
          <span className="font-semibold">We Believe</span> That A Clean Space Is
          Happy Space. <span className="font-semibold">Founded In 1998</span>, Our
          Mission Is To Make Homes & Businesses Sparkle While...
        </motion.div>

        {/* Optional decorative dots */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex justify-center gap-2 mt-12"
        >
          <div className="w-2 h-2 bg-blue-400 rounded-full" />
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          <div className="w-2 h-2 bg-blue-600 rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}
