import { notFound, redirect } from "next/navigation";
import { getPlace } from "@/lib/content";
import { getOfficeSession } from "@/lib/http/office-session";
import { PlaceForm } from "@/components/office/PlaceForm";

export default async function OfficePlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await getOfficeSession();
  if (!user?.canEditContent) redirect("/office");
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
