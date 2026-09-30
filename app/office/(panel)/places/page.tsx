import Link from "next/link";
import { redirect } from "next/navigation";
import { getPlaces } from "@/lib/content";
import { getOfficeSession } from "@/lib/http/office-session";

export default async function OfficePlacesPage() {
  const user = await getOfficeSession();
  if (!user?.canEditContent) redirect("/office");
  const places = await getPlaces();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Places</h1>
      <ul className="space-y-2">
        {places.map((place) => (
          <li key={place.slug}>
            <Link className="block rounded-lg bg-white px-4 py-3 shadow hover:bg-slate-50" href={`/office/places/${place.slug}`}>
              {place.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
