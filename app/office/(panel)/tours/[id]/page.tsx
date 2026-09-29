import { notFound, redirect } from "next/navigation";
import { getTour } from "@/lib/content";
import { getCurrentUser } from "@/lib/auth/session";
import { canDeleteTour, canEditContent } from "@/lib/auth/permissions";
import { TourForm } from "@/components/office/TourForm";

export default async function OfficeTourPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || !canEditContent(user.role)) redirect("/office");
  const { id } = await params;
  const tour = await getTour(id);
  if (!tour) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit tour</h1>
      <TourForm tour={tour} canDelete={canDeleteTour(user.role)} />
    </div>
  );
}
