"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

const images = [
  {
    src: "/images/Picture1.jpg",
    alt: "Beautiful mountain lake with glaciers",
  },
  {
    src: "/images/Picture2.jpg",
    alt: "Scenic landscape",
  },
  {
    src: "/images/Picture3.jpg",
    alt: "Beautiful destination",
  },
  {
    src: "/images/Picture4.jpg",
    alt: "Tropical paradise",
  },
  {
    src: "/images/Picture6.jpg",
    alt: "Amazing view",
  },
];

export function FeatureImages() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <section ref={containerRef} className="relative py-32 bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-indigo-400 font-bold uppercase tracking-widest text-sm mb-3">
            Gallery
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Featured Destinations
          </h3>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Explore breathtaking locations from around the world
          </p>
        </motion.div>

        {/* Images Grid with Scroll Animation */}
        <div className="relative h-[150vh]">
          <div className="sticky top-20 grid grid-cols-5 gap-4 h-[70vh]">
            {images.map((image, index) => {
              // Calculate individual scroll progress for each image
              const startProgress = index * 0.15;
              const endProgress = startProgress + 0.3;
              
              // Create transforms based on scroll position
              const scale = useTransform(
                scrollYProgress,
                [startProgress, endProgress],
                [0.4, 1]
              );
              
              const x = useTransform(
                scrollYProgress,
                [startProgress, endProgress],
                [
                  // Initial positions (stacked in center)
                  `${(2 - index) * 15}%`,
                  // Final positions (spread out)
                  "0%"
                ]
              );
              
              const y = useTransform(
                scrollYProgress,
                [startProgress, endProgress],
                [
                  // Initial positions (slight vertical offset)
                  `${index * 8}%`,
                  // Final position
                  "0%"
                ]
              );
              
              const rotate = useTransform(
                scrollYProgress,
                [startProgress, endProgress],
                [
                  // Initial rotation (fan effect)
                  (index - 2) * 8,
                  // Final rotation
                  0
                ]
              );
              
              const zIndex = useTransform(
                scrollYProgress,
                [startProgress, endProgress],
                [images.length - index, index]
              );
              
              const opacity = useTransform(
                scrollYProgress,
                [startProgress, endProgress],
                [0.7, 1]
              );

              return (
                <motion.div
                  key={index}
                  style={{
                    scale,
                    x,
                    y,
                    rotate,
                    zIndex,
                    opacity,
                  }}
                  className="relative h-full rounded-2xl overflow-hidden shadow-2xl"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 20vw"
                    priority={index === 0}
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-slate-400 text-sm uppercase tracking-widest">
            Scroll to explore more
          </p>
        </motion.div>
      </div>
    </section>
  );
}
