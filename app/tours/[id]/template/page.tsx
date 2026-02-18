"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { tours } from "@/data/tours";
import { calculatePackagePrice, getVehicleDisplayName } from "@/lib/calculatePackagePrice";
import { HotelCategory } from "@/data/pricing";
import TourTemplate from "@/components/tours/TourTemplate";

const ALL_HOTEL_CATEGORIES: HotelCategory[] = [
  "Deluxe",
  "Premier",
  "Executive",
  "Luxury",
  "Ultra Luxury",
];

export default function TourTemplatePage() {
  const { id } = useParams<{ id: string }>();
  const tour = tours.find((t) => t.id === id);

  // Calculate dynamic prices for ALL hotel categories
  const packages = useMemo(() => {
    if (!tour) return [];

    return ALL_HOTEL_CATEGORIES.map((category) => {
      const result = calculatePackagePrice(
        tour.region,
        category,
        tour.duration,
        tour.transport,
        "Islamabad"
      );

      if (result) {
        return {
          category,
          price: result.totalForTwo,
          features: [
            `Private Transport (${getVehicleDisplayName(result.vehicleType)})`,
            ...(result.hotelName ? [result.hotelName] : []),
          ],
        };
      }

      return {
        category,
        price: 0,
        features: ["Contact for pricing"],
      };
    });
  }, [tour]);

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Tour Not Found</h1>
          <p className="text-gray-600">The tour you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Prepare tour data for template
  const tourData = {
    id: tour.id,
    name: tour.name,
    location: tour.location,
    region: tour.region,
    duration: tour.duration,
    description: tour.description,
    image: tour.image,
    galleryImages: tour.galleryImages,
    transport: tour.transport,
    basePrice: tour.basePrice,
    packages: packages,
    itinerary: tour.itinerary,
    included: tour.included,
    notIncluded: tour.notIncluded,
  };

  return <TourTemplate tour={tourData} />;
}
