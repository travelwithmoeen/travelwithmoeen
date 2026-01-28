"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Users, Globe, Award, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/hero.png"
          alt="About Us"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-indigo-950/60" />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl font-extrabold text-white mb-4">About Elite Travel</h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            We are dedicated to providing the most authentic and memorable travel experiences across the globe.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-3">Our Mission</h2>
            <h3 className="text-4xl font-extrabold text-slate-900 mb-6">Redefining The Way You Explore The World</h3>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              Founded in 2010, Elite Travel started with a simple belief: that travel should be more than just visiting a place—it should be about connecting with cultures, nature, and oneself.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-3xl font-bold text-indigo-600">12+</span>
                <span className="text-slate-500 font-medium">Years of Experience</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-3xl font-bold text-indigo-600">50+</span>
                <span className="text-slate-500 font-medium">Destinations</span>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
            <Image src="/images/hero.png" alt="Our Team" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h2 className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-3">Our Values</h2>
          <h3 className="text-4xl font-extrabold text-slate-900">What Drives Us Every Day</h3>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: <Users />, title: "Customer First", desc: "We prioritize your comfort and satisfaction in every tour we plan." },
            { icon: <Globe />, title: "Authenticity", desc: "We provide genuine experiences that showcase the true soul of a destination." },
            { icon: <ShieldCheck />, title: "Safety", desc: "Rigorous safety standards and 24/7 support for all our travelers." },
            { icon: <Award />, title: "Quality", desc: "Hand-picked luxury accommodations and premium curated itineraries." }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:border-indigo-200 transition-all">
              <div className="bg-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                {item.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
              <p className="text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
