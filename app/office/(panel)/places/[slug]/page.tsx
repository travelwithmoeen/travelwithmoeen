import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getPlace } from "@/lib/http/site-content";
import { getOfficeSession } from "@/lib/http/office-session";
import { PlaceForm } from "@/components/office/PlaceForm";

export default async function OfficePlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await getOfficeSession();
  if (!user?.canEditContent) redirect("/office");
  const { slug } = await params;
  const place = await getPlace(slug);
  if (!place) notFound();
  const linked = place.tours ?? [];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit place</h1>
      <section className="mb-6 rounded-xl bg-white p-6 shadow">
        <h2 className="font-semibold">Tours for this place</h2>
        <p className="mt-1 text-sm text-slate-500">
          These tours point here. Their pages show this title. Saving a tour does not change this guide. If a tour uses only this place and its location line is this title, a new title updates that line.
        </p>
        {linked.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {linked.map((tour) => (
              <li key={tour.id}>
                <Link className="underline" href={`/office/tours/${tour.id}`}>
                  {tour.name}
                </Link>
                <span className="ml-2 text-sm text-slate-500">
                  {tour.duration} days · {tour.transport}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-600">No tour points here yet. Choose this place on a tour.</p>
        )}
      </section>
      <PlaceForm place={place} />
    </div>
  );
}
