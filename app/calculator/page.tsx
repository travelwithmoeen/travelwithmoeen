"use client";

import { motion } from "framer-motion";
import { PackageCalculator } from "@/components/home/PackageCalculator";

const CalculatorPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-navy py-20 text-center text-white">
        <div className="bg-navy" />
        <motion.div
          className="container relative mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-3 inline-block rounded-full bg-gold/90 px-4 py-1.5 text-sm font-semibold text-white">
            Plan Your Trip
          </span>
          <h1 className="text-3xl font-bold text-white md:text-5xl">
            Package Calculator
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Customize your perfect trip and get an instant price estimate
          </p>
        </motion.div>
      </section>

      {/* Package Calculator Component */}
      <PackageCalculator />
    </div>
  );
};

export default CalculatorPage;
