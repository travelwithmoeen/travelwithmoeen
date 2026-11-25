import { and, arrayContains, asc, eq, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { dayPlans, photos, placeHotelNames, quoteDays, quoteExtras, quoteNights, quotePackages, quotes } from "@/lib/db/schema";
import { can } from "@/lib/auth/permissions";
import type { SessionUser } from "@/lib/auth/session";
import { forbidden, type ActionResult } from "@/lib/http/result";
import { recordActivity } from "@/lib/office/activity";
import { toDayPlanRow, readLine } from "@/lib/office/day-plans";
import { chosenFile, keepFilesOnlyIfSaved } from "@/lib/office/forms";
import { deleteOfficeFiles, droppedOfficeFiles } from "@/lib/office/media";
import { storedOptions } from "@/lib/office/package-options";
import { storedSections } from "@/lib/office/package-sections";
import { lockRateNames } from "@/lib/office/rates";
import { readRecordId } from "@/lib/office/record-id";
import {
  hotelLine,
  nightPricePlaces,
  nightsByOvernight,
  optionsFor,
  packageDays,
  packageExtras,
  packagePrice,
  QUOTE_PACKAGE_LIMITS,
  type PackageDay,
  type PackageSection,
} from "@/lib/package";
import { airFares, buildQuote, findStartCity, GUEST_GRADES, storedPlace, vehicleKey, type DayEdit, type NightEdit, type QuoteInput, type TripMode } from "@/lib/quote";
import { loadCatalog } from "@/lib/rates";

// T-61 (BR-109 to BR-116, BR-66, design section 15): the saved quote page and its package. Owner and
// Manager only, through the rates permission. The package is built from today's data on each read
// and is never stored as a file. Only its choices are saved, in quote_packages.

export type SavedNight = { night: number; rate: number; hotelName: string; typed: boolean };
export type SavedDay = { day: number; vehicle: string; rent: number; fuel: number; toll: number; cleared: boolean };

export type SavedQuote = {
  id: number;
  place: string;
  startCity: string;
  mode: TripMode;
  days: number;
  adults: number;
  children: number;
  lapInfants: number;
  seatInfants: number;
  grade: string;
  vehicle: string;
  otherNote: string;
  // The seats of an Other vehicle, null for any other vehicle and on Other quotes saved before T-61.
  otherSeats: number | null;
  guide: boolean;
  meals: boolean;
  lunch: boolean;
  roomCount: number | null;
  vehicleCount: number | null;
  tickets: boolean;
  seasonPercent: number;
  subtotal: number;
  profit: number;
  total: number;
  createdAt: string;
  nights: SavedNight[];
  dayLines: SavedDay[];
  extras: { name: string; amount: number }[];
};

export type QuotePackageSettings = {
  title: string;
  allGrades: boolean;
  flightNote: boolean;
  optionIds: number[];
  pictures: string[];
};

export type PackageGradePrice = { grade: string; hotels: string; total: number; perPerson: number | null };

export type PackageDocument = {
  title: string;
  badge: string | null;
  intro: string | null;
  route: string;
  routeOptions: string | null;
  headline: string;
  duration: string;
  accommodation: string;
  transport: string;
  travellers: string;
  meals: string;
  pictures: string[];
  days: PackageDay[];
  priceHeading: string;
  prices: PackageGradePrice[];
  included: string[];
  notIncluded: string[];
  flightNote: { adult: number; child: number } | null;
  sections: PackageSection[];
};

export type PackageBuild = { ok: true; document: PackageDocument } | { ok: false; error: string };

function count(value: number, one: string, many: string) {
  return `${value} ${value === 1 ? one : many}`;
}

// "2 adults", or "2 adults, 1 child, 1 infant".
export function partyText(quote: Pick<SavedQuote, "adults" | "children" | "lapInfants" | "seatInfants">) {
  const parts: string[] = [];
  if (quote.adults > 0) parts.push(count(quote.adults, "adult", "adults"));
  if (quote.children > 0) parts.push(count(quote.children, "child", "children"));
  const infants = quote.lapInfants + quote.seatInfants;
  if (infants > 0) parts.push(count(infants, "infant", "infants"));
  return parts.join(", ");
}

function isCouple(quote: Pick<SavedQuote, "adults" | "children" | "lapInfants" | "seatInfants">) {
  return quote.adults === 2 && quote.children === 0 && quote.lapInfants + quote.seatInfants === 0;
}

// The title the Package tab starts from, such as "5 Days Skardu Valley By Air from Islamabad (Couple)".
export function defaultPackageTitle(quote: SavedQuote) {
  const mode = quote.mode === "air" ? "Air" : "Road";
  const party = isCouple(quote) ? "Couple" : partyText(quote);
  return `${count(quote.days, "Day", "Days")} ${quote.place} By ${mode} from ${quote.startCity} (${party})`.slice(0, QUOTE_PACKAGE_LIMITS.title);
}

async function loadSavedQuote(id: number): Promise<SavedQuote | null> {
  const [row] = await db.select().from(quotes).where(eq(quotes.id, id)).limit(1);
  if (!row) return null;
  const [nights, dayLines, extras] = await Promise.all([
    db.select().from(quoteNights).where(eq(quoteNights.quoteId, id)).orderBy(asc(quoteNights.night)),
    db.select().from(quoteDays).where(eq(quoteDays.quoteId, id)).orderBy(asc(quoteDays.day)),
    db.select().from(quoteExtras).where(eq(quoteExtras.quoteId, id)).orderBy(asc(quoteExtras.id)),
  ]);
  return {
    id: row.id,
    place: row.place,
    startCity: row.startCity,
    mode: row.mode === "air" ? "air" : "road",
    days: row.days,
    adults: row.adults,
    children: row.children,
    lapInfants: row.lapInfants,
    seatInfants: row.seatInfants,
    grade: row.grade,
    vehicle: row.vehicle,
    otherNote: row.otherNote,
    otherSeats: row.otherSeats,
    guide: row.guide,
    meals: row.meals,
    lunch: row.lunch,
    roomCount: row.roomCount,
    vehicleCount: row.vehicleCount,
    // Quotes saved before T-49 had the tickets.
    tickets: row.tickets !== false,
    seasonPercent: row.seasonPercent,
    subtotal: row.subtotal,
    profit: row.profit,
    total: row.total,
    createdAt: row.createdAt.toISOString(),
    nights: nights.map((night) => ({ night: night.night, rate: night.rate, hotelName: night.hotelName, typed: night.typed })),
    dayLines: dayLines.map((day) => ({ day: day.day, vehicle: day.vehicle, rent: day.rent, fuel: day.fuel, toll: day.toll, cleared: day.cleared })),
    extras: extras.map((extra) => ({ name: extra.name, amount: extra.amount })),
  };
}

// The quote's choices again, to price it with today's rates. A day's change is read back from its
// saved day: a cleared day, a jeep, or another vehicle. They do not depend on the grade. The typed
// night rates are returned apart, because they apply to the quote's own grade only (BR-112).
export function savedQuoteInput(quote: SavedQuote): { input: QuoteInput; typedNights: NightEdit[] } {
  const other = vehicleKey(quote.vehicle) === "other";
  const baseName = other ? quote.otherNote.trim() || "Other" : quote.vehicle;
  const dayEdits: DayEdit[] = [];
  for (const day of quote.dayLines) {
    if (day.cleared) dayEdits.push({ day: day.day, cleared: true });
    else if (day.vehicle === "Jeep" && vehicleKey(baseName) !== "jeep") dayEdits.push({ day: day.day, jeep: true, rent: day.rent, fuel: day.fuel });
    else if (!other && vehicleKey(day.vehicle) !== vehicleKey(baseName)) dayEdits.push({ day: day.day, vehicle: day.vehicle });
  }
  const input: QuoteInput = {
    place: quote.place,
    startCity: quote.startCity,
    mode: quote.mode,
    days: quote.days,
    adults: quote.adults,
    children: quote.children,
    lapInfants: quote.lapInfants,
    seatInfants: quote.seatInfants,
    grade: quote.grade,
    vehicle: quote.vehicle,
    vehicleCount: quote.vehicleCount ?? undefined,
    roomCount: quote.roomCount ?? undefined,
    guide: quote.guide,
    meals: quote.meals,
    lunch: quote.lunch,
    tickets: quote.tickets,
    seasonPercent: quote.seasonPercent,
    dayEdits,
    paidExtras: quote.extras,
    otherNote: quote.otherNote,
  };
  if (other) {
    // Other's rent, fuel, and toll are on its saved days, and its seats on the quote. An older Other
    // quote has no seats: with a typed count they do not change the price, and without one the
    // package is not built (otherNeedsCount).
    const plain = quote.dayLines.find((day) => !day.cleared && day.vehicle === baseName);
    input.otherRent = plain?.rent ?? 0;
    input.otherFuel = plain?.fuel ?? 0;
    input.otherToll = quote.dayLines[0]?.toll ?? 0;
    input.otherSeats = quote.otherSeats ?? Math.max(quote.adults + quote.children + quote.seatInfants, 1);
  }
  const typedNights = quote.nights.filter((night) => night.typed).map((night) => ({ night: night.night, rate: night.rate, hotelName: night.hotelName }));
  return { input, typedNights };
}

async function storedSettings(quote: SavedQuote): Promise<{ settings: QuotePackageSettings; saved: boolean }> {
  const [row] = await db.select().from(quotePackages).where(eq(quotePackages.quoteId, quote.id)).limit(1);
  if (!row) return { settings: { title: defaultPackageTitle(quote), allGrades: false, flightNote: true, optionIds: [], pictures: [] }, saved: false };
  return { settings: { title: row.title, allGrades: row.allGrades, flightNote: row.flightNote, optionIds: row.optionIds, pictures: row.pictures }, saved: true };
}

function mealsText(quote: SavedQuote, nights: number) {
  if (nights === 0) return quote.lunch ? "lunch" : "not included";
  if (quote.lunch && quote.meals) return "breakfast, lunch and dinner";
  if (quote.lunch) return "breakfast and lunch";
  if (quote.meals) return "breakfast and dinner";
  return "breakfast only";
}

// Builds the package document from the saved quote, its package choices, and today's day plans,
// options, fixed sections, hotel-names lines, and rates. It holds the rounded prices only, never the
// subtotal, the lines, or the profit (BR-66, BR-116).
export const OTHER_NEEDS_COUNT = "This quote has an Other vehicle saved before its seats were kept. Save the quote again with the vehicle count typed to build its package.";

// An Other quote saved before T-61 has no seats, so its automatic vehicle count cannot be worked out.
export function otherNeedsCount(quote: Pick<SavedQuote, "vehicle" | "otherSeats" | "vehicleCount">) {
  return vehicleKey(quote.vehicle) === "other" && quote.otherSeats === null && quote.vehicleCount === null;
}

export async function buildPackageDocument(quote: SavedQuote, settings: QuotePackageSettings): Promise<PackageBuild> {
  if (otherNeedsCount(quote)) return { ok: false, error: OTHER_NEEDS_COUNT };
  const place = storedPlace(quote.place);
  const [planRows, options, sections, catalog, names] = await Promise.all([
    db.select().from(dayPlans).where(eq(dayPlans.place, place)).orderBy(asc(dayPlans.part), asc(dayPlans.position), asc(dayPlans.id)),
    storedOptions(db),
    storedSections(db),
    loadCatalog(),
    db.select().from(placeHotelNames),
  ]);
  const built = packageDays({ place, mode: quote.mode, days: quote.days, startCity: quote.startCity }, planRows.map(toDayPlanRow), options, settings.optionIds);
  if (!built.ok) return { ok: false, error: built.error };
  const days = built.days;
  const extras = packageExtras(place, options, settings.optionIds);
  const { input, typedNights } = savedQuoteInput(quote);
  const pricePlaces = nightPricePlaces(days);

  // BR-109: each grade is priced with the same quote, with only the grade changed. A grade with no
  // offered rate for this trip is left off. The quote's own grade must price.
  const grades = settings.allGrades ? [...GUEST_GRADES] : [quote.grade];
  if (!grades.includes(quote.grade as (typeof GUEST_GRADES)[number])) grades.push(quote.grade as (typeof GUEST_GRADES)[number]);
  const payers = quote.adults + quote.children;
  const prices: PackageGradePrice[] = [];
  let own: Extract<ReturnType<typeof buildQuote>, { ok: true }> | null = null;
  for (const grade of grades) {
    const priced = buildQuote({ ...input, grade, pricePlaces, nightEdits: grade === quote.grade ? typedNights : [] }, catalog);
    if (!priced.ok) {
      if (grade === quote.grade) return { ok: false, error: priced.error };
      continue;
    }
    if (grade === quote.grade) own = priced;
    const price = packagePrice(priced.total, payers);
    prices.push({ grade, hotels: hotelLine(days, grade, names), total: price.total, perPerson: price.perPerson });
  }
  if (!own) return { ok: false, error: "The quote could not be priced." };

  const nights = Math.max(quote.days - 1, 0);
  const destination = days[0]?.overnight || place;
  const start = findStartCity(catalog.startCities, quote.startCity);
  const others = catalog.startCities.filter((city) => city.name !== quote.startCity && (quote.mode === "air" ? city.air : city.road)).map((city) => city.name);
  const vehicleText = own.vehicleCount > 1 ? `${own.vehicleCount} × ${own.vehicleName}` : own.vehicleName;
  const party = partyText(quote);

  // BR-115: Services included and not included, from the quote.
  const included: string[] = [];
  if (quote.mode === "air" && quote.tickets) included.push(`Air tickets both sides — ${quote.startCity} to ${destination} and back`);
  included.push(quote.mode === "air" ? `Private transport at the destination — ${vehicleText}` : `Private transport — ${vehicleText}`);
  included.push("Fuel & toll tax");
  if (quote.mode === "air") included.push("Entry tickets");
  if (nights > 0) {
    const stays = nightsByOvernight(days);
    const where = stays.length === 1 ? ` in ${stays[0].place}` : ` — ${stays.map((stay) => `${stay.nights} in ${stay.place}`).join(", ")}`;
    included.push(`${count(nights, "night’s", "nights’")} accommodation${where}`);
    included.push(`${nights} × breakfast`);
    if (quote.meals) included.push(`${nights} × dinner`);
  }
  if (quote.lunch) included.push(`${quote.days} × lunch`);
  if (quote.guide) included.push("Tour guide");
  const off: string[] = [];
  if (!quote.lunch && !quote.meals) off.push("Lunch & dinner");
  else if (!quote.lunch) off.push("Lunch");
  else if (!quote.meals) off.push("Dinner");
  if (!quote.guide) off.push("Tour guide");
  off.push("Travel insurance");
  const notIncluded = [off.join(", "), ...extras.notIncluded, "All items of a personal nature, and anything not listed under Services Included"];

  // BR-113: the same fares the quote uses.
  const fares = quote.mode === "air" && settings.flightNote && start && catalog.rules ? airFares(catalog.air, start, catalog.rules) : null;

  return {
    ok: true,
    document: {
      title: settings.title,
      badge: extras.badge,
      intro: extras.intro,
      route: `${quote.startCity} – ${destination} – ${quote.startCity}, by ${quote.mode}`,
      routeOptions: others.length > 0 ? `Options available from ${others.length === 1 ? others[0] : `${others.slice(0, -1).join(", ")} and ${others.at(-1)}`}` : null,
      headline: `${party} • ${vehicleText} • ${quote.grade} category`,
      duration: nights > 0 ? `${count(quote.days, "day", "days")} / ${count(nights, "night", "nights")}` : count(quote.days, "day", "days"),
      accommodation: nights > 0 ? `${count(own.rooms, "room", "rooms")}, ${count(nights, "night", "nights")}` : "No nights",
      transport: vehicleText,
      travellers: party,
      meals: mealsText(quote, nights),
      pictures: settings.pictures,
      days,
      priceHeading: isCouple(quote) ? "Price for couple" : `Price for ${party}`,
      prices,
      included,
      notIncluded,
      flightNote: fares ? { adult: fares.adultFare, child: fares.childFare } : null,
      sections,
    },
  };
}

function readQuoteId(value: string) {
  return readRecordId(value);
}

// GET /api/office/quotes/[id]: the saved quote, its package choices, the options offered for its
// place, the gallery pictures to choose from, and whether the package can be built.
export async function loadQuotePackageAs(actor: SessionUser, idText: string) {
  if (!can(actor, "rates.edit")) return { ok: false as const, error: "You cannot read a saved quote.", status: 403 as const };
  const id = readQuoteId(idText);
  const quote = id === null ? null : await loadSavedQuote(id);
  if (!quote) return { ok: false as const, error: "That quote was not found.", status: 404 as const };
  const { settings, saved } = await storedSettings(quote);
  const [options, gallery, built] = await Promise.all([
    storedOptions(db),
    db.select({ src: photos.src, alt: photos.alt }).from(photos).orderBy(asc(photos.id)),
    buildPackageDocument(quote, settings),
  ]);
  return {
    ok: true as const,
    quote,
    settings,
    saved,
    options: optionsFor(storedPlace(quote.place), options).map((option) => ({ id: option.id, name: option.name })),
    gallery,
    // BR-102 and BR-114: only a role that may upload, the Owner, uploads a new picture.
    canUpload: can(actor, "content.edit"),
    packageError: built.ok ? null : built.error,
  };
}

// GET /api/office/quotes/[id]/package: the document, built from today's data.
export async function packageDocumentAs(actor: SessionUser, idText: string): Promise<PackageBuild | { ok: false; error: string; status: 403 | 404 }> {
  if (!can(actor, "rates.edit")) return { ok: false, error: "You cannot download a package.", status: 403 };
  const id = readQuoteId(idText);
  const quote = id === null ? null : await loadSavedQuote(id);
  if (!quote) return { ok: false, error: "That quote was not found.", status: 404 };
  const { settings } = await storedSettings(quote);
  return buildPackageDocument(quote, settings);
}

function checked(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

// POST /api/office/quotes/[id]/package: saves the package choices, with one activity row in area
// rates. A picture is a gallery picture, one this package already has, or a new upload, which only
// a role that may upload can send. A picture the package no longer uses is removed from storage when
// it is not a gallery picture and no other package uses it.
export async function saveQuotePackageAs(actor: SessionUser, idText: string, formData: FormData): Promise<ActionResult> {
  if (!can(actor, "rates.edit")) return forbidden("You cannot change a package.");
  const id = readQuoteId(idText);
  const quote = id === null ? null : await loadSavedQuote(id);
  if (!quote) return { ok: false, error: "That quote was not found." };
  const stored: string[] = [];
  let dropped: string[] = [];
  const result = await keepFilesOnlyIfSaved(stored, async (): Promise<ActionResult> => {
    const title = readLine(formData.get("title"), "the package title", QUOTE_PACKAGE_LIMITS.title);
    if (!title.ok) return title;
    if (title.value.length > QUOTE_PACKAGE_LIMITS.title) return { ok: false, error: `Enter a title of ${QUOTE_PACKAGE_LIMITS.title} characters or less.` };
    const offered = optionsFor(storedPlace(quote.place), await storedOptions(db));
    const optionIds: number[] = [];
    for (const value of formData.getAll("optionId")) {
      const optionId = readRecordId(value);
      if (optionId === null || !offered.some((option) => option.id === optionId)) return { ok: false, error: "Choose options offered for this place." };
      if (!optionIds.includes(optionId)) optionIds.push(optionId);
    }
    const before = (await storedSettings(quote)).settings.pictures;
    const gallery = new Set((await db.select({ src: photos.src }).from(photos)).map((row) => row.src.trim()));
    const pictures: string[] = [];
    for (let slot = 1; slot <= QUOTE_PACKAGE_LIMITS.pictures; slot += 1) {
      const upload = await chosenFile(actor, stored, formData, `picture${slot}File`, "image");
      if (upload !== null) {
        if (typeof upload !== "string") return upload;
        pictures.push(upload);
        continue;
      }
      const address = String(formData.get(`picture${slot}`) ?? "").trim();
      if (!address) continue;
      if (!gallery.has(address) && !before.includes(address)) return { ok: false, error: "Choose a picture from the gallery." };
      if (pictures.includes(address)) return { ok: false, error: "Choose each picture once." };
      pictures.push(address);
    }
    const allGrades = checked(formData.get("allGrades"));
    const flightNote = checked(formData.get("flightNote"));
    await db.transaction(async (tx) => {
      await lockRateNames(tx);
      const values = { title: title.value, allGrades, flightNote, optionIds, pictures };
      await tx.insert(quotePackages).values({ quoteId: quote.id, ...values }).onConflictDoUpdate({ target: quotePackages.quoteId, set: values });
      await recordActivity(tx, actor, { kind: "quote_package", recordId: quote.id, text: `Saved the package for quote ${quote.id}, ${title.value}` });
    });
    // A dropped upload goes from storage only when no gallery picture or other package uses it.
    const candidates = droppedOfficeFiles(before, pictures).filter((address) => !gallery.has(address.trim()));
    dropped = [];
    for (const address of candidates) {
      const [other] = await db
        .select({ quoteId: quotePackages.quoteId })
        .from(quotePackages)
        .where(and(ne(quotePackages.quoteId, quote.id), arrayContains(quotePackages.pictures, [address])))
        .limit(1);
      if (!other) dropped.push(address);
    }
    return { ok: true, message: "Package saved." };
  });
  if (!result.ok || dropped.length === 0) return result;
  try {
    await deleteOfficeFiles(dropped);
    return result;
  } catch (error) {
    console.error("A package picture could not be removed after a save.", error);
    return { ...result, message: `${result.message ?? "Package saved."} An old picture could not be removed from storage.` };
  }
}
