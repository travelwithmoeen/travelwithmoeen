import { db, sql } from "@/lib/db";
import { places, tourPlaces, tours } from "@/lib/db/schema";

// Region strings already stored on tours. A region maps to a place only when that
// place page exists. Regions with no place page stay unlinked.
const REGION_PLACE_SLUGS: Record<string, readonly string[]> = {
  "Skardu Valley": ["skardu-valley"],
  "Hunza Valley": ["hunza-valley"],
  "Naran Kaghan & Babusar Top": ["naran-kaghan-babusar-top"],
  "Swat Kalam & Malam Jabba": ["swat-valley-kalam-malam-jabba"],
  "Neelum Valley Kashmir": ["neelum-valley"],
  "Kumrat and Katora Lake": ["kumrat-valley"],
  "Kalash Valley & Chitral": ["chitral-valley"],
  "Minimarg Astor Valley": ["astor-valley-minimarg"],
  "Skardu & Hunza": ["skardu-valley", "hunza-valley"],
};

const UNLINKED_REGION_NOTE: Record<string, string> = {
  Islamabad: "Islamabad has no place page.",
  "Murree Patriata Galiyat": "Murree and Patriata have no place page.",
  "Murree Ayubia Nathiagali": "Murree, Ayubia, and Nathiagali have no place page.",
  "Fairy Meadows Nanga Base Camp": "Fairy Meadows has no place page. This tour was not linked to another place.",
  "Ratti Gali Lake": "Ratti Gali Lake has no place page. It was not treated as Neelum Valley.",
};

export type TourPlaceInference = {
  slugs: string[];
  note: string | null;
};

export function uniquePlaceSlugs(values: string[]) {
  const slugs: string[] = [];
  for (const value of values) {
    const slug = value.trim();
    if (!slug || slugs.includes(slug)) continue;
    slugs.push(slug);
  }
  return slugs;
}

export function tourIdFromName(name: string) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
  return base || "tour";
}

export function inferTourPlaceLinks(
  tour: { name: string; region: string; location: string },
  knownSlugs: ReadonlySet<string>,
): TourPlaceInference {
  const blocked = UNLINKED_REGION_NOTE[tour.region];
  if (blocked) return { slugs: [], note: blocked };

  const mapped = REGION_PLACE_SLUGS[tour.region];
  if (!mapped) {
    return { slugs: [], note: `Region ${tour.region} has no place link rule.` };
  }

  const wanted = [...mapped];
  const text = `${tour.name} ${tour.location}`;
  const namedSkardu = tour.region === "Minimarg Astor Valley" && /\bskardu\b/i.test(text);
  if (namedSkardu) wanted.push("skardu-valley");

  const slugs: string[] = [];
  const missing: string[] = [];
  for (const slug of wanted) {
    if (slugs.includes(slug)) continue;
    if (!knownSlugs.has(slug)) {
      missing.push(slug);
      continue;
    }
    slugs.push(slug);
  }

  const notes: string[] = [];
  if (missing.length > 0) notes.push(`Missing place pages: ${missing.join(", ")}.`);
  if (namedSkardu && slugs.includes("skardu-valley")) {
    notes.push("Also linked to Skardu Valley because the tour name includes Skardu.");
  }
  if (/\bdeosai\b/i.test(text)) notes.push("Deosai has no place page. The link follows the region only.");
  if (/\bkhunjerab\b/i.test(text)) notes.push("Khunjerab has no place page. The link follows the region only.");
  if (/\bleepa\b/i.test(text) || /\bganga choti\b/i.test(text)) {
    notes.push("Leepa Valley and Ganga Choti have no place page. The link follows Neelum Valley.");
  }
  return { slugs, note: notes.length > 0 ? notes.join(" ") : null };
}

export async function ensureTourPlacesTable() {
  // Static DDL. Drizzle Kit push creates the same table from lib/db/schema.ts.
  // One simple-query batch so the notice level applies to the create.
  await sql.unsafe(`SET client_min_messages TO warning;
CREATE TABLE IF NOT EXISTS tour_places (
  tour_id text NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  place_slug text NOT NULL REFERENCES places(slug) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  PRIMARY KEY (tour_id, place_slug)
);`);
}

export async function linkInferredTourPlaces() {
  await ensureTourPlacesTable();
  const tourRows = await db
    .select({ id: tours.id, name: tours.name, region: tours.region, location: tours.location })
    .from(tours);
  const placeRows = await db.select({ slug: places.slug }).from(places);
  const known = new Set(placeRows.map((place) => place.slug));
  const existing = await db.select({ tourId: tourPlaces.tourId, placeSlug: tourPlaces.placeSlug }).from(tourPlaces);
  const have = new Set(existing.map((row) => `${row.tourId}\t${row.placeSlug}`));
  const pending: { tourId: string; placeSlug: string; sortOrder: number }[] = [];
  const unlinked: { id: string; name: string; region: string; note: string }[] = [];
  const notes: { id: string; name: string; note: string }[] = [];

  for (const tour of tourRows) {
    const inferred = inferTourPlaceLinks(tour, known);
    if (inferred.slugs.length === 0) {
      unlinked.push({ id: tour.id, name: tour.name, region: tour.region, note: inferred.note ?? "No matching place." });
    } else if (inferred.note) {
      notes.push({ id: tour.id, name: tour.name, note: inferred.note });
    }
    inferred.slugs.forEach((slug, index) => {
      const key = `${tour.id}\t${slug}`;
      if (have.has(key)) return;
      have.add(key);
      pending.push({ tourId: tour.id, placeSlug: slug, sortOrder: index });
    });
  }

  if (pending.length > 0) {
    await db.insert(tourPlaces).values(pending).onConflictDoNothing();
  }

  return { inserted: pending.length, unlinked, notes };
}
