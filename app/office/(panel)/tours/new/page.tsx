import { redirect } from "next/navigation";
import { TourForm } from "@/components/office/TourForm";
import type { Tour } from "@/data/tours";
import { getPlaces } from "@/lib/http/site-content";
import { getOfficeSession } from "@/lib/http/office-session";

const blankTour = {
  id: "",
  name: "",
  location: "",
  region: "",
  duration: 1,
  description: "",
  image: "",
  pdf: "",
  code: "",
  galleryImages: [],
  categories: [],
  packageTypes: [],
  transport: "By Road",
  basePrice: 0,
  packages: [],
  itinerary: [],
  included: [],
  notIncluded: [],
  featured: false,
  places: [],
} as unknown as Tour;

export default async function OfficeNewTourPage() {
  const user = await getOfficeSession();
  if (!user?.canEditContent) redirect("/office");
  const places = await getPlaces();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Add tour</h1>
      <TourForm
        tour={blankTour}
        canDelete={false}
        mode="create"
        places={places.map((place) => ({ slug: place.slug, title: place.title }))}
      />
    </div>
  );
}
