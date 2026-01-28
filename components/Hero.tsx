"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden pt-32">
      {/* Background Image */}
      <Image
        src="/images/banner-two-bg.jpg"
        alt="Explore the World"
        fill
        className="object-cover"
        priority
        quality={100}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Small heading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-cyan-400 text-lg md:text-xl font-medium mb-6 tracking-wide"
          >
            Explore the world as much possible
          </motion.p>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tight"
          >
            EXPLORE
            <br />
            <span className="italic font-serif">THE WORLD</span>
          </motion.h1>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link
              href="/tours"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 px-8 py-4 rounded-full text-base md:text-lg font-bold hover:shadow-2xl hover:shadow-amber-300/50 hover:scale-105 transition-all duration-300 group"
            >
              See All Destination
              <ArrowRight 
                size={20} 
                className="transition-transform group-hover:translate-x-1 duration-300"
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
