import { notFound, redirect } from "next/navigation";
import { getPlaces, getTour } from "@/lib/http/site-content";
import { getOfficeSession } from "@/lib/http/office-session";
import { TourForm } from "@/components/office/TourForm";

export default async function OfficeTourPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getOfficeSession();
  if (!user?.canEditContent) redirect("/office");
  const { id } = await params;
  const [tour, places] = await Promise.all([getTour(id), getPlaces()]);
  if (!tour) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit tour</h1>
      <TourForm
        tour={tour}
        canDelete={user.canDeleteTour}
        mode="edit"
        places={places.map((place) => ({ slug: place.slug, title: place.title }))}
      />
    </div>
  );
}
