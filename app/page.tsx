"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Star, ArrowRight, ShieldCheck, Clock, Users } from "lucide-react";
import { Hero } from "@/components/Hero";
import { FilterBar } from "@/components/FilterBar";
import { FeatureImages } from "@/components/FeatureImages";
import { AboutSection } from "@/components/AboutSection";
import { TourPlans } from "@/components/TourPlans";
import { TourCategories } from "@/components/TourCategories";
import { FanGallery } from "@/components/FanGallery";
import { FanGallery1 } from "@/components/FanGallery1";

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
      <Hero />

      {/* Filter Bar */}
      <FilterBar />

      <FanGallery1/>


      {/* About Section */}
      <AboutSection />

      {/* Tour Plans Section */}
      <TourPlans />

      {/* Tour Categories Section */}
      <TourCategories />

      {/* Feature Images Section */}
      {/* <FeatureImages /> */}

      {/* Fan Gallery Section */}
      <FanGallery />

      {/* Featured Tours */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-3">Popular Packages</h2>
              <h3 className="text-4xl font-extrabold text-slate-900">Best Selling Tours</h3>
            </div>
            <Link href="/tours" className="hidden md:flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">
              View All Tours <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTours.map((tour) => (
              <motion.div
                key={tour.id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-indigo-600 font-bold text-sm">
                    ${tour.price}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                    <MapPin size={14} /> {tour.location}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">{tour.title}</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star size={16} fill="currentColor" /> {tour.rating}
                      <span className="text-slate-400 font-normal">({tour.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                      <Clock size={16} /> {tour.duration}
                    </div>
                  </div>
                  <button className="w-full mt-6 py-3 bg-slate-100 text-slate-900 font-bold rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <Link href="/tours" className="md:hidden flex items-center justify-center gap-2 text-indigo-600 font-bold mt-10">
            View All Tours <ArrowRight size={20} />
          </Link>
        </div>
      </section>

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
            <h2 className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-3">Why Choose Us</h2>
            <h3 className="text-4xl font-extrabold text-slate-900 mb-8 leading-tight">We Provide The Best Travel Experience For You</h3>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="bg-indigo-100 p-4 rounded-2xl text-indigo-600 h-fit">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Safe and Reliable</h4>
                  <p className="text-slate-600">Your safety is our top priority. We only work with certified guides and vetted partners world wide.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-rose-100 p-4 rounded-2xl text-rose-600 h-fit">
                  <Star size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Premium Experience</h4>
                  <p className="text-slate-600">Hand-picked accommodations and activities that ensure you get the most out of every destination.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-600 h-fit">
                  <Users size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Professional Guides</h4>
                  <p className="text-slate-600">Our local guides are passionate experts who love sharing their knowledge and culture with you.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
