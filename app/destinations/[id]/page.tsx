"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DestinationContent } from "@/components/destinations/DestinationContent";
import { DestinationDetailSkeleton } from "@/components/destinations/DestinationDetailSkeleton";
import { Button } from "@/components/ui/button";
import { getDestinationBySlug } from "@/data/destinations";
import { MapPin } from "lucide-react";

export default function DestinationDetail() {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);

  const destination = id ? getDestinationBySlug(id) : undefined;

  // Simulate loading for skeleton demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <DestinationDetailSkeleton />
        ) : destination ? (
          <article className="mx-auto max-w-4xl">
            {/* Banner Image */}
            <div className="mb-8 overflow-hidden rounded-lg">
              <img
                src={destination.bannerImage}
                alt={destination.title}
                className="h-64 w-full object-cover md:h-96"
              />
            </div>

            {/* Title */}
            <h1 className="mb-4 text-3xl font-bold text-navy md:text-4xl lg:text-5xl">
              {destination.title}
            </h1>

            {/* Location */}
            {destination.location && (
              <div className="mb-8 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-lg">{destination.location}</span>
              </div>
            )}

            {/* Separator */}
            <div className="mb-8 h-1 w-16 rounded-full bg-primary" />

            {/* Content */}
            <DestinationContent sections={destination.content} />

            {/* Bottom CTA */}
            <div className="mt-12 rounded-lg bg-secondary p-8 text-center">
              <h3 className="mb-2 text-xl font-bold text-secondary-foreground">
                Ready to Explore {destination.title}?
              </h3>
              <p className="mb-4 text-secondary-foreground/80">
                Browse our curated tours to this amazing destination.
              </p>
              <Button asChild>
                <Link href="/tours">View Tours</Link>
              </Button>
            </div>
          </article>
        ) : (
          <div className="py-16 text-center">
            <h2 className="mb-4 text-2xl font-bold text-secondary">
              Destination Not Found
            </h2>
            <p className="mb-6 text-muted-foreground">
              The destination you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/destinations">Back to Destinations</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
