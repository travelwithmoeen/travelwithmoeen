import Link from "next/link";
import { redirect } from "next/navigation";
import { getTours } from "@/lib/http/site-content";
import { getOfficeSession } from "@/lib/http/office-session";

export default async function OfficeToursPage() {
  const user = await getOfficeSession();
  if (!user?.canEditContent) redirect("/office");
  const tours = await getTours();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Tours</h1>
      <ul className="space-y-2">
        {tours.map((tour) => (
          <li key={tour.id}>
            <Link className="block rounded-lg bg-white px-4 py-3 shadow hover:bg-slate-50" href={`/office/tours/${tour.id}`}>
              <span className="font-medium">{tour.name}</span>
              <span className="ml-2 text-sm text-slate-500">
                {tour.code} · {tour.duration} days{tour.featured ? " · Featured" : ""}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
