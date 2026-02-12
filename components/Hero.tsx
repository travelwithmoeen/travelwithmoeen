"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Button } from "./ui/button";
import {  AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { FilterBar } from "./FilterBar";
const heroSlides = [
  { src: "/images/hero_image/hero1.webp", alt: "Scenic mountain valley" },
  { src: "/images/hero_image/hero2.webp", alt: "Snow-capped peaks" },
  { src: "/images/hero_image/hero3.webp", alt: "Green valley road trip" },
  { src: "/images/hero_image/hero4.webp", alt: "Golden sunset over mountains" },
  // { src: "/images/hero_image/hero1.webp", alt: "Starry night over mountains" },
];
export function Hero() {
   const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
        <section className="relative h-[60vh] overflow-hidden md:h-[80vh]">
        {/* Background Slides */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img
              src={heroSlides[currentSlide].src}
              alt={heroSlides[currentSlide].alt}
              className="h-full w-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />

        {/* Content */}
        <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-primary text-primary-foreground">
              Explore the world as much possible
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-4xl font-bold text-white md:text-6xl"
          >
            QUALITY
            <span className="text-gradient-gold"> TOURISM </span>
            PROMOTER
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mb-8 max-w-2xl text-lg text-white/85"
          >
            Explore extraordinary destinations with our expertly curated tours.
            From ancient wonders to natural marvels, your next adventure starts
            here.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild className="border-white bg-gold/80 text-white hover:bg-gold/90">
              <Link href="/tours">
                Explore Tours
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            {/* <Button asChild  className="border-white text-white hover:bg-white/10">
              <Link href="/destinations">View All Destinations</Link>
            </Button> */}
          </motion.div>






          {/* Slide Indicators */}
          {/* <div className="mt-8 flex gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide ? "w-8 bg-primary" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div> */}
        </div>
      </section>
  );
}
