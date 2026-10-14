import Link from "next/link";
import { redirect } from "next/navigation";
import { TourDeleteButton } from "@/components/office/TourDeleteButton";
import { getTours } from "@/lib/http/site-content";
import { getOfficeSession } from "@/lib/http/office-session";

export default async function OfficeToursPage() {
  const user = await getOfficeSession();
  if (!user?.canEditContent) redirect("/office");
  const tours = await getTours();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Tours</h1>
        <Link className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white" href="/office/tours/new">
          Add tour
        </Link>
      </div>
      <p className="mb-4 text-sm text-slate-600">
        Add a tour here, open one to amend it, or delete one. Only the Owner can delete a tour. A tour can point at one or more places.
      </p>
      <ul className="space-y-2">
        {tours.map((tour) => (
          <li key={tour.id} className="rounded-lg bg-white px-4 py-3 shadow">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link className="min-w-0 hover:underline" href={`/office/tours/${tour.id}`}>
                <span className="font-medium">{tour.name}</span>
                <span className="ml-2 text-sm text-slate-500">
                  {tour.code} · {tour.duration} days{tour.featured ? " · Featured" : ""}
                  {tour.places && tour.places.length > 0 ? ` · ${tour.places.map((place) => place.title).join(", ")}` : " · No place"}
                </span>
              </Link>
              <div className="flex items-center gap-4">
                <Link className="text-sm underline" href={`/office/tours/${tour.id}`}>
                  Edit
                </Link>
                {user.canDeleteTour ? <TourDeleteButton tourId={tour.id} /> : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
