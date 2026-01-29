"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Calendar,
  Star,
  ArrowRight,
  ShieldCheck,
  Clock,
  Users,
} from "lucide-react";
import { Hero } from "@/components/Hero";
import { FilterBar } from "@/components/FilterBar";
import { FeatureImages } from "@/components/FeatureImages";
import { AboutSection } from "@/components/AboutSection";
import { TourPlans } from "@/components/TourPlans";
import { TourCategories } from "@/components/TourCategories";
import { FanGallery } from "@/components/FanGallery";
import { FanGallery1 } from "@/components/FanGallery1";
import HeroSection from "@/components/HeroSection";
import PopularDestinations from "@/components/PopularDestinations";
const featuredTours = [
  {
    id: 1,
    title: "Tropical Bali Escape",
    location: "Bali, Indonesia",
    price: 899,
    rating: 4.9,
    reviews: 124,
    image: "/images/hero.png", // Reusing hero image for now
    duration: "7 Days",
  },
  {
    id: 2,
    title: "Swiss Alps Adventure",
    location: "Zermatt, Switzerland",
    price: 1299,
    rating: 4.8,
    reviews: 89,
    image: "/images/hero.png",
    duration: "5 Days",
  },
  {
    id: 3,
    title: "Santorini Sunset Tour",
    location: "Oia, Greece",
    price: 750,
    rating: 5.0,
    reviews: 210,
    image: "/images/hero.png",
    duration: "4 Days",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      {/* <Hero /> */}
      <HeroSection />

      {/* Filter Bar */}
      {/* <FilterBar /> */}

      {/* Popular Destinations */}

      <FanGallery1 />

      {/* About Section */}
      <AboutSection />
      <PopularDestinations />
      {/* Tour Plans Section */}
      <TourPlans />

      {/* Tour Categories Section */}
      <TourCategories />

      {/* Feature Images Section */}
      {/* <FeatureImages /> */}

      {/* Fan Gallery Section */}
      {/* <FanGallery /> */}

      {/* Featured Tours */}

      {/* Benefits Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/images/hero.png" // Would be another image in production
              alt="Experience"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-3">
              Why Choose Us
            </h2>
            <h3 className="text-4xl font-extrabold text-slate-900 mb-8 leading-tight">
              We Provide The Best Travel Experience For You
            </h3>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="bg-indigo-100 p-4 rounded-2xl text-indigo-600 h-fit">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    Safe and Reliable
                  </h4>
                  <p className="text-slate-600">
                    Your safety is our top priority. We only work with certified
                    guides and vetted partners world wide.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-rose-100 p-4 rounded-2xl text-rose-600 h-fit">
                  <Star size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    Premium Experience
                  </h4>
                  <p className="text-slate-600">
                    Hand-picked accommodations and activities that ensure you
                    get the most out of every destination.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-600 h-fit">
                  <Users size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    Professional Guides
                  </h4>
                  <p className="text-slate-600">
                    Our local guides are passionate experts who love sharing
                    their knowledge and culture with you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
