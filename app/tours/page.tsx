"use client";

import Image from "next/image";
import { Search, MapPin, Star, Clock, Filter, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";

const allTours = [
  { id: 1, title: "Tropical Bali Escape", location: "Bali, Indonesia", price: 899, rating: 4.9, reviews: 124, image: "/images/hero.png", duration: "7 Days", tag: "Nature" },
  { id: 2, title: "Swiss Alps Adventure", location: "Zermatt, Switzerland", price: 1299, rating: 4.8, reviews: 89, image: "/images/hero.png", duration: "5 Days", tag: "Adventure" },
  { id: 3, title: "Santorini Sunset Tour", location: "Oia, Greece", price: 750, rating: 5.0, reviews: 210, image: "/images/hero.png", duration: "4 Days", tag: "Romantic" },
  { id: 4, title: "Kyoto Temple Walk", location: "Kyoto, Japan", price: 600, rating: 4.7, reviews: 54, image: "/images/hero.png", duration: "3 Days", tag: "Culture" },
  { id: 5, title: "Safari in Serengeti", location: "Tanzania", price: 2100, rating: 4.9, reviews: 142, image: "/images/hero.png", duration: "10 Days", tag: "WildLife" },
  { id: 6, title: "Paris City of Lights", location: "Paris, France", price: 950, rating: 4.6, reviews: 312, image: "/images/hero.png", duration: "4 Days", tag: "City" },
];

export default function ToursPage() {
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 text-pretty">Discover Your Next Adventure</h1>
            <p className="text-slate-500 text-lg">Browse our carefully curated selection of {allTours.length} premium tours around the world.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-white hover:border-indigo-600 transition-all">
              <Filter size={18} /> Filters
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-white hover:border-indigo-600 transition-all">
              <ArrowUpDown size={18} /> Sort by
            </button>
          </div>
        </div>

        {/* Search Bar - Small version */}
        <div className="mb-16 bg-slate-50 p-4 rounded-3xl flex flex-col md:row items-center gap-4 border border-slate-100">
           <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full bg-white rounded-2xl border border-slate-200 shadow-sm">
             <Search className="text-indigo-600" size={20} />
             <input type="text" placeholder="Search by destination or tour name..." className="w-full bg-transparent text-slate-900 font-medium focus:outline-none" />
           </div>
           <button className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
             Search
           </button>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allTours.map((tour) => (
            <motion.div
              key={tour.id}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-lg shadow-slate-100/50"
            >
              <div className="relative h-72 overflow-hidden">
                <Image src={tour.image} alt={tour.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-indigo-600 font-bold text-xs uppercase tracking-wider shadow-sm">
                  {tour.tag}
                </div>
                <div className="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl text-white font-bold">
                  ${tour.price} <span className="text-slate-400 font-normal text-sm">/ person</span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                  <MapPin size={16} className="text-indigo-500" /> {tour.location}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">{tour.title}</h3>
                
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                   <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl">
                      <Star size={18} className="text-amber-500" fill="currentColor" />
                      <span className="font-bold text-slate-900">{tour.rating}</span>
                      <span className="text-slate-400 text-sm font-medium">({tour.reviews})</span>
                   </div>
                   <div className="flex items-center gap-2 text-slate-500 font-medium">
                      <Clock size={18} className="text-indigo-500" /> {tour.duration}
                   </div>
                </div>
                
                <button className="w-full mt-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg shadow-indigo-100">
                  Book This Tour
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
