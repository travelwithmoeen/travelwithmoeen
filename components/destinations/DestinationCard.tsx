import  Link  from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Destination } from "@/data/destinations";

interface DestinationCardProps {
  destination: Destination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <Card className="tour-card group relative overflow-hidden border-2 border-[#f7e2a8] hover:border-gold  p-6 bg-[#f9f5e9]  transition-all duration-300 hover:scale-[1.02]  hover:shadow-lg hover:shadow-gold/20">
      {/* Diagonal Ribbon */}
      <div className="absolute -left-8 top-6 -rotate-45 bg-gold px-10 py-1 text-sm font-semibold text-black shadow-md">
        {String(destination.listingNumber).padStart(2, "0")} Listing
      </div>

      {/* Centered Image Container */}
      <div className="mb-6 mt-8 flex justify-center">
        <div className="overflow-hidden rounded-xl border-4 border-card bg-card p-1 shadow-lg transition-transform duration-300 group-hover:scale-105">
          <img
            src={destination.bannerImage}
            alt={destination.title}
            className="h-40 w-40 rounded-lg object-cover sm:h-48 sm:w-48"
          />
        </div>
      </div>

      {/* Content */}
      <div className="text-center">
        <p className="mb-1 text-sm text-muted-foreground">
          Destination {String(destination.listingNumber).padStart(2, "0")}
        </p>
        <h3 className="mb-3 text-xl font-bold text-navy sm:text-2xl">
          {destination.title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {destination.excerpt}
        </p>
        <Button asChild  className="w-full bg-gold hover:bg-gold-hover hover:opacity-100 text-black">
          <Link className="" href={`/destinations/${destination.slug}`}>View Details</Link>
        </Button>
      </div>
    </Card>
  );
}
