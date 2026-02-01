"use client";
import { useState, useEffect } from "react";
// import { Header } from "@/components/Header";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { DestinationCardSkeleton } from "@/components/destinations/DestinationCardSkeleton";
import { destinations } from "@/data/destinations";

export default function Destinations() {
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
      {/* <Header /> */}

      {/* Hero Section */}
      <section className="bg-secondary px-4 py-12 text-center">
        <h1 className="mb-2 text-3xl font-bold text-secondary-foreground md:text-4xl">
          Explore Destinations
        </h1>
        <p className="mx-auto max-w-2xl text-secondary-foreground/80">
          Discover the breathtaking landscapes and hidden gems of Northern Pakistan
        </p>
      </section>

      {/* Destinations Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <DestinationCardSkeleton key={index} />
              ))
            : destinations.map((destination) => (
                <DestinationCard key={destination.slug} destination={destination} />
              ))}
        </div>
      </div>
    </div>
  );
}
