"use client";

import { motion } from "framer-motion";
import { Plane, ArrowRight } from "lucide-react";
import Link from "next/link";

const categories = [
  { name: "Cultural", icon: true },
  { name: "Adventure", icon: true },
  { name: "Nature & wildlife", icon: true },
  { name: "Historical", icon: false },
  { name: "Religious", icon: true },
];

export function TourCategories() {
  return (
    <section className="relative py-32 px-6 bg-[#0f2847] overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f2847] via-[#1a3a5c] to-[#0f2847]" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          {/* Small heading */}
          <p className="text-cyan-400 font-light text-base mb-6 italic tracking-wide">
            tour catagories
          </p>
          
          {/* Main Heading */}
          <h2 
            className="text-white font-normal mb-8 leading-tight"
            style={{ 
              fontFamily: 'var(--font-philosopher)',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              lineHeight: '1.2',
            }}
          >
            Shelter of Love, Compassion, and New<br />Beginnings
          </h2>
          
          {/* Description */}
          <p className="text-white/90 text-base max-w-3xl mx-auto leading-relaxed">
            communication and utilizes cutting edge logistic planning to get your shipment completed<br />
            on time. itself founded of backgrounds, which simply.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-12 mb-16 max-w-5xl mx-auto"
        >
          {/* Row 1: Cultural, Adventure, Nature & wildlife */}
          <motion.div
            whileHover={{ x: 10 }}
            className="flex items-center gap-4 cursor-pointer group"
          >
            {categories[0].icon && (
              <Plane className="text-white/70 group-hover:text-white transition-colors" size={24} />
            )}
            <h3 
              className="text-white font-normal border-b-2 border-white pb-1 group-hover:text-[#ffc861] group-hover:border-[#ffc861] transition-all"
              style={{ 
                fontFamily: 'var(--font-philosopher)',
                fontSize: '2.25rem',
                lineHeight: '1.2',
              }}
            >
              {categories[0].name}
            </h3>
          </motion.div>

          <motion.div
            whileHover={{ x: 10 }}
            className="flex items-center gap-4 cursor-pointer group"
          >
            {categories[1].icon && (
              <Plane className="text-white/70 group-hover:text-white transition-colors" size={24} />
            )}
            <h3 
              className="text-white font-normal border-b-2 border-white pb-1 group-hover:text-[#ffc861] group-hover:border-[#ffc861] transition-all"
              style={{ 
                fontFamily: 'var(--font-philosopher)',
                fontSize: '2.25rem',
                lineHeight: '1.2',
              }}
            >
              {categories[1].name}
            </h3>
          </motion.div>

          <motion.div
            whileHover={{ x: 10 }}
            className="flex items-center gap-4 cursor-pointer group"
          >
            {categories[2].icon && (
              <Plane className="text-white/70 group-hover:text-white transition-colors" size={24} />
            )}
            <h3 
              className="text-white font-normal border-b-2 border-white pb-1 group-hover:text-[#ffc861] group-hover:border-[#ffc861] transition-all"
              style={{ 
                fontFamily: 'var(--font-philosopher)',
                fontSize: '2.25rem',
                lineHeight: '1.2',
              }}
            >
              {categories[2].name}
            </h3>
          </motion.div>

          {/* Row 2: Historical, Religious - Centered */}
          <div className="lg:col-start-1 lg:col-span-3 flex justify-center gap-16 flex-wrap">
            <motion.div
              whileHover={{ x: 10 }}
              className="flex items-center gap-4 cursor-pointer group"
            >
              <h3 
                className="text-white font-normal border-b-2 border-white pb-1 group-hover:text-[#ffc861] group-hover:border-[#ffc861] transition-all"
                style={{ 
                  fontFamily: 'var(--font-philosopher)',
                  fontSize: '2.25rem',
                  lineHeight: '1.2',
                }}
              >
                {categories[3].name}
              </h3>
            </motion.div>

            <motion.div
              whileHover={{ x: 10 }}
              className="flex items-center gap-4 cursor-pointer group"
            >
              {categories[4].icon && (
                <Plane className="text-white/70 group-hover:text-white transition-colors" size={24} />
              )}
              <h3 
                className="text-white font-normal border-b-2 border-white pb-1 group-hover:text-[#ffc861] group-hover:border-[#ffc861] transition-all"
                style={{ 
                  fontFamily: 'var(--font-philosopher)',
                  fontSize: '2.25rem',
                  lineHeight: '1.2',
                }}
              >
                {categories[4].name}
              </h3>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/tours">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-white text-[#0f2847] px-10 py-4 rounded-full font-semibold text-base hover:bg-[#ffc861] hover:text-[#0f2847] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              SEE ALL DESTINATION
              <ArrowRight size={20} />
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f2847]/50 to-transparent pointer-events-none" />
    </section>
  );
}
