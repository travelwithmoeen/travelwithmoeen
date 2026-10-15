import Link from "next/link";
import type { Tour } from "@/data/tours";

export function TourPlaceLabel({ tour }: { tour: Tour }) {
  const linked = tour.places ?? [];
  const only = linked.length === 1 ? linked[0] : undefined;
  const locationIsPlace = Boolean(only && only.title.trim().toLowerCase() === tour.location.trim().toLowerCase());
  if (locationIsPlace && only) {
    return (
      <Link href={`/destinations/${only.slug}`} className="underline">
        {only.title}
      </Link>
    );
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2">
      <span>{tour.location}</span>
      {linked.map((place) => (
        <Link key={place.slug} href={`/destinations/${place.slug}`} className="underline">
          {place.title}
        </Link>
      ))}
    </span>
  );
}
