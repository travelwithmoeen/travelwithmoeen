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
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { LatestBlogsSection } from "@/components/home/LatestBlogsSection";
import { PopularToursSection } from "@/components/home/PopularToursSection";
import { PopularDestinationsCarousel } from "@/components/home/PopularDestinationsCarousel";
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
   {/* Popular Destinations Carousel */}
      <PopularDestinationsCarousel />

      {/* Popular Tours Section */}
      <PopularToursSection />
  {/* Testimonials */}
      <TestimonialCarousel />
      {/* Latest Blogs Section */}
      <LatestBlogsSection />

    
    </div>
  );
}
