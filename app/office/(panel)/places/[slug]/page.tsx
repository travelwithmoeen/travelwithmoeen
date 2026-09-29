import { notFound, redirect } from "next/navigation";
import { getPlace } from "@/lib/content";
import { getCurrentUser } from "@/lib/auth/session";
import { canEditContent } from "@/lib/auth/permissions";
import { PlaceForm } from "@/components/office/PlaceForm";

export default async function OfficePlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser();
  if (!user || !canEditContent(user.role)) redirect("/office");
  const { slug } = await params;
  const place = await getPlace(slug);
  if (!place) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit place</h1>
      <PlaceForm place={place} />
    </div>
  );
}
