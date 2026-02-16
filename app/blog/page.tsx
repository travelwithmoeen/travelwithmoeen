"use client";
import { useState, useEffect } from "react";

import { BlogCard } from "@/components/blog/BlogCard";
import { BlogCardSkeleton } from "@/components/blog/BlogCardSkeleton";
import { blogs } from "@/data/blog";
import { motion, AnimatePresence } from "framer-motion";
export default function Blog() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for skeleton demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
   

      {/* Hero Section */}
      {/* <section className="bg-secondary px-4 py-12 text-center">
        <h1 className="mb-2 text-3xl font-bold text-secondary-foreground md:text-4xl">
          Our Blog
        </h1>
        <p className="mx-auto max-w-2xl text-secondary-foreground/80">
          Stories, tips, and insights from our adventures across Northern Pakistan
        </p>
      </section> */}
          <section className="relative bg-navy py-12 text-center text-white">
        <div className="bg-navy" />
        <motion.div
          className="container relative mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-3 inline-block rounded-full bg-gold/90 px-4 py-1.5 text-sm font-semibold text-white">
           Blog
          </span>
          <h1 className="text-3xl font-bold text-white md:text-5xl">
           Our Blog
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Stories, tips, and insights from our adventures across Northern Pakistan
          </p>
        </motion.div>
      </section>

      {/* Blog Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <BlogCardSkeleton key={index} />
              ))
            : blogs.map((blog) => <BlogCard key={blog.slug} blog={blog} />)}
        </div>
      </div>
    </div>
  );
}
