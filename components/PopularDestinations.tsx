"use client";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const destinations = [
  {
    id: 1,
    name: "Murree",
    image: "/images/Picture1.jpg",
    listings: 12,
  },
  {
    id: 2,
    name: "Kashmir",
    image: "/images/Picture2.jpg",
    listings: 8,
  },
  {
    id: 3,
    name: "Hunza",
    image: "/images/Picture3.jpg",
    listings: 15,
  },
  {
    id: 4,
    name: "Swat",
    image: "/images/Picture4.jpg",
    listings: 10,
  },
  {
    id: 5,
    name: "Neelum Valley",
    image: "/images/Picture6.jpg",
    listings: 6,
  },
];

const DestinationCard = ({
  destination,
}: {
  destination: (typeof destinations)[0];
}) => {
  return (
    <div className="relative flex-shrink-0 group cursor-pointer">
      {/* Ribbon Badge - Top Left */}
      <div className="absolute -top-2 -left-2 z-20 overflow-visible">
        <div className="relative w-24 h-24">
          {/* <div className="w-20 h-8 absolute top-6 -left-4 bg-amber-400 text-slate-800 font-semibold text-sm py-1.5 px-10 transform -rotate-45 shadow-md">
            {destination.listings.toString().padStart(2, "0")} Listing
          </div> */}
        </div>
      </div>

      {/* Card - Horizontal Layout */}
      <div className="bg-white rounded-3xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center gap-6 min-w-[380px]">
        {/* Image */}
        <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-2xl">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Text Content */}
        <div className="flex flex-col justify-center pr-4">
          <p className="text-base text-slate-500 italic">
            Destination {destination.id.toString().padStart(2, "0")}
          </p>
          <h3 className="text-2xl font-bold text-primary mt-1">{destination.name}</h3>
        </div>
      </div>
    </div>
  );
};

const PopularDestinations = () => {
  return (
    <section className="py-16 bg-sky-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
          <div className="max-w-2xl">
            <p className="text-cyan-500 font-serif italic text-lg mb-2">
              Popular Destination
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
              Popular destination
            </h2>
            <p className="text-muted-foreground">
              Discover breathtaking landscapes and rich cultural heritage across
              Pakistan&apos;s most stunning locations. From snow-capped mountains to
              lush green valleys.
            </p>
          </div>
          <div className="mt-6 lg:mt-0">
            <Link href="/destinations">
              <Button className="bg-amber-400 hover:bg-amber-500 text-primary font-semibold px-8 py-6 rounded-full gap-2 transition-all">
                EXPLORE MORE
                <ArrowUpRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scrolling Cards Container */}
      <div className="relative group/container">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-sky-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-sky-50 to-transparent z-10 pointer-events-none" />

        {/* Scrolling Track */}
        <div className="flex gap-8 py-8 animate-scroll group-hover/container:[animation-play-state:paused]">
          {/* First set of cards */}
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
          {/* Duplicate set for seamless loop */}
          {destinations.map((destination) => (
            <DestinationCard
              key={`duplicate-${destination.id}`}
              destination={destination}
            />
          ))}
          {/* Third set for wider screens */}
          {destinations.map((destination) => (
            <DestinationCard
              key={`triplicate-${destination.id}`}
              destination={destination}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
