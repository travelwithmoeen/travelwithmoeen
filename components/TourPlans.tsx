"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MapPin, Star, ArrowRight, Moon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

interface TourPlan {
  id: number;
  image: string;
  location: string;
  title: string;
  description: string;
  rating: number;
  reviewCount: number;
  nights: number;
  days: number;
  price: number;
  featured?: boolean;
}

const tourPlans: TourPlan[] = [
  {
    id: 1,
    image: "/images/Picture7.jpg",
    location: "Delhi, India",
    title: "Every Life Matters",
    description: "We provide daily meals and run food drives to ensure child or elder in our community goes to bed.",
    rating: 5.0,
    reviewCount: 334,
    nights: 6,
    days: 7,
    price: 650.0,
    featured: true,
  },
  {
    id: 2,
    image: "/images/Picture8.jpg",
    location: "Delhi, India",
    title: "Each Life Is Precious",
    description: "We provide daily meals and run food drives to ensure child or elder in our community goes to bed.",
    rating: 5.0,
    reviewCount: 334,
    nights: 7,
    days: 8,
    price: 889.0,
  },
  {
    id: 3,
    image: "/images/Picture9.jpg",
    location: "Delhi, India",
    title: "Every Life Has Value",
    description: "We provide daily meals and run food drives to ensure child or elder in our community goes to bed.",
    rating: 5.0,
    reviewCount: 334,
    nights: 8,
    days: 9,
    price: 149.0,
  },
  {
    id: 4,
    image: "/images/Picture11.jpg",
    location: "Delhi, India",
    title: "Hope & New Beginnings",
    description: "We provide daily meals and run food drives to ensure child or elder in our community goes to bed.",
    rating: 5.0,
    reviewCount: 334,
    nights: 5,
    days: 6,
    price: 549.0,
  },
];

function TourCard({ tour }: { tour: TourPlan }) {
  return (
    <div className="h-full group">
      <Card className="relative mx-auto w-full overflow-hidden border-slate-200 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col hover:-translate-y-2">
        {/* Image Container */}
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={tour.image}
            alt={tour.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
          {tour.featured && (
            <div className="absolute top-4 right-4 z-10">
              <Badge variant="secondary" className="bg-cyan-500 text-white border-none">
                Featured
              </Badge>
            </div>
          )}
        </div>

        {/* Card Content */}
        <CardHeader className="flex-1">
          <CardAction className="mb-2">
            <div className="flex items-center gap-1 text-slate-600 text-sm">
              <MapPin size={16} className="text-blue-600" />
              <span>{tour.location}</span>
            </div>
          </CardAction>
          
          <CardTitle className="text-xl text-blue-900 mb-3 font-serif">
            {tour.title}
          </CardTitle>
          
          <CardDescription className="text-slate-600 text-sm leading-relaxed">
            {tour.description}
          </CardDescription>

          {/* Rating and Duration */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
            <div className="flex items-center gap-1">
              <Star size={16} className="text-amber-400 fill-amber-400" />
              <span className="text-sm font-semibold text-slate-800">
                {tour.rating.toFixed(2)} <span className="text-slate-500">({tour.reviewCount})</span>
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-600 text-sm">
              <Moon size={16} />
              <span>{tour.nights} Nights - {tour.days} Days</span>
            </div>
          </div>
        </CardHeader>

        {/* Card Footer */}
        <CardFooter className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <div className="text-2xl font-bold text-blue-900">${tour.price.toFixed(2)}</div>
            <div className="text-xs text-slate-500">/ Per Person</div>
          </div>
          <Button 
            variant="link" 
            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 group"
          >
            EXPLORE MORE 
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export function TourPlans() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-cyan-500 font-medium text-sm mb-4 italic">
            advance tour plan
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 mb-6 leading-tight font-serif">
            Shelter of Love, Compassion, and<br />New Beginnings
          </h2>
          <p className="text-slate-600 text-base max-w-3xl mx-auto leading-relaxed">
            communication and utilizes cutting edge logistic planning to get your shipment completed<br />
            on time. itself founded of backgrounds, which simply.
          </p>
        </motion.div>

        {/* Tour Cards Carousel */}
        <div className="relative px-12">
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
              slidesToScroll: 1,
            }}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent className="-ml-4">
              {tourPlans.map((tour) => (
                <CarouselItem key={tour.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <TourCard tour={tour} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 bg-white hover:bg-blue-50 border-2 border-blue-200 text-blue-600 hover:text-blue-700" />
            <CarouselNext className="right-0 bg-white hover:bg-blue-50 border-2 border-blue-200 text-blue-600 hover:text-blue-700" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
