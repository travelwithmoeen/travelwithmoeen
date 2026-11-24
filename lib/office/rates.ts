import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  airExtras,
  dayPlans,
  hotelRates,
  jeepLines,
  mealRates,
  placeHotelNames,
  pricingRules,
  quoteDays,
  quoteExtras,
  quoteNights,
  quotes,
  seasons,
  startCities,
  vehicleRates,
} from "@/lib/db/schema";
import { can } from "@/lib/auth/permissions";
import type { SessionUser } from "@/lib/auth/session";
import { forbidden, type ActionResult } from "@/lib/http/result";
import { recordActivity } from "@/lib/office/activity";
import { readRecordId } from "@/lib/office/record-id";
import { AIR_RATE_CITY, buildQuote, findStartCity, HOTEL_GRADES, MAX_COUNT, readMarginPercent, vehicleKey, type DayEdit, type MarginPercent, type NightEdit, type QuoteInput, type TripMode } from "@/lib/quote";
import { loadCatalog, loadRateDesk, readAmount, readCount } from "@/lib/rates";

export async function loadRateDeskAs(actor: SessionUser) {
  if (!can(actor, "rates.edit")) return forbidden("You cannot read the rates.");
  return { ok: true as const, desk: await loadRateDesk() };
}

function checked(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

export async function saveHotelRateAs(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  if (!can(actor, "rates.edit")) return forbidden("You cannot change a price.");
  const id = readRecordId(formData.get("id"));
  if (id === null) return { ok: false, error: "That hotel rate was not found." };
  const twin = readAmount(String(formData.get("twin") ?? ""));
  if (!twin.ok) return twin;
  const triple = readAmount(String(formData.get("triple") ?? ""));
  if (!triple.ok) return triple;
  const hotelName = String(formData.get("hotelName") ?? "").trim();
  const [row] = await db
    .select({ id: hotelRates.id, place: hotelRates.place, startCity: hotelRates.startCity, grade: hotelRates.grade })
    .from(hotelRates)
    .where(eq(hotelRates.id, id))
    .limit(1);
  if (!row) return { ok: false, error: "That hotel rate was not found." };
  await db.transaction(async (tx) => {
    await tx
      .update(hotelRates)
      .set({ twin: twin.amount, triple: triple.amount, hotelName, offered: checked(formData.get("offered")) })
      .where(eq(hotelRates.id, id));
    await recordActivity(tx, actor, { kind: "hotel_rate", recordId: id, text: `Saved hotel rate ${row.place}, ${row.startCity}, ${row.grade}` });
  });
  return { ok: true, message: "Hotel rate saved." };
}

export async function saveVehicleRateAs(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  if (!can(actor, "rates.edit")) return forbidden("You cannot change a price.");
  const id = readRecordId(formData.get("id"));
  if (id === null) return { ok: false, error: "That vehicle rate was not found." };
  const rent = readAmount(String(formData.get("rent") ?? ""));
  if (!rent.ok) return rent;
  const fuel = readAmount(String(formData.get("fuel") ?? ""));
  if (!fuel.ok) return fuel;
  const toll = readAmount(String(formData.get("toll") ?? ""));
  if (!toll.ok) return toll;
  const seats = readCount(String(formData.get("seats") ?? ""), "the seats", 60);
  if (!seats.ok) return seats;
  const [row] = await db
    .select({ id: vehicleRates.id, place: vehicleRates.place, startCity: vehicleRates.startCity, vehicle: vehicleRates.vehicle })
    .from(vehicleRates)
    .where(eq(vehicleRates.id, id))
    .limit(1);
  if (!row) return { ok: false, error: "That vehicle rate was not found." };
  const live = checked(formData.get("live")) && !(rent.amount === 0 && fuel.amount === 0 && toll.amount === 0);
  await db.transaction(async (tx) => {
    await tx
      .update(vehicleRates)
      .set({ rent: rent.amount, fuel: fuel.amount, toll: toll.amount, seats: seats.count, live })
      .where(eq(vehicleRates.id, id));
    await recordActivity(tx, actor, { kind: "vehicle_rate", recordId: id, text: `Saved vehicle rate ${row.vehicle}, ${row.place} from ${row.startCity}` });
  });
  return { ok: true, message: "Vehicle rate saved." };
}

export async function saveAirExtraAs(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  if (!can(actor, "rates.edit")) return forbidden("You cannot change a price.");
  // From T-48 the Lahore and Karachi adds are saved on the start city (BR-91), so they are not read here.
  const fields = ["islamabadTicket", "welcomePack", "entry", "infantExtra", "sticker"] as const;
  const amounts: Record<(typeof fields)[number], number> = {
    islamabadTicket: 0,
    welcomePack: 0,
    entry: 0,
    infantExtra: 0,
    sticker: 0,
  };
  for (const field of fields) {
    const amount = readAmount(String(formData.get(field) ?? ""));
    if (!amount.ok) return amount;
    amounts[field] = amount.amount;
  }
  const [row] = await db.select({ id: airExtras.id }).from(airExtras).limit(1);
  if (!row) return { ok: false, error: "The air extras are not loaded." };
  await db.transaction(async (tx) => {
    await tx.update(airExtras).set(amounts).where(eq(airExtras.id, row.id));
    await recordActivity(tx, actor, { kind: "air_extra", text: "Saved the air extras" });
  });
  return { ok: true, message: "Air extras saved." };
}

const NAME_MAX = 100;
const HOTEL_NAME_MAX = 200;
const LONG_ROUTE_DAYS_MAX = 60;

// A place, start city, or vehicle name: trimmed, with single spaces, from 1 to 100 characters.
function readName(value: FormDataEntryValue | null, label: string): { ok: true; name: string } | { ok: false; error: string } {
  const name = String(value ?? "").trim().replace(/\s+/g, " ");
  if (!name) return { ok: false, error: `Enter ${label}.` };
  if (name.length > NAME_MAX) return { ok: false, error: `Enter ${label} of ${NAME_MAX} characters or less.` };
  return { ok: true, name };
}

function sameName(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
type Reader = typeof db | Transaction;

// T-48: a save that adds or renames a start city, a place, or a rate row takes this lock first and
// checks for a clash inside its transaction. Two such saves at the same moment then run one after the
// other, so the second gets the clash message, not a 500 or two places merged into one.
const RATE_NAMES_LOCK = 4801;

export async function lockRateNames(tx: Transaction) {
  await tx.execute(sql`select pg_advisory_xact_lock(${RATE_NAMES_LOCK})`);
}

// Every place named on a hotel rate, a vehicle rate, or a jeep line (BR-90). A rate place is not a
// public Places page.
export async function ratePlaces(reader: Reader = db) {
  const [hotels, vehicles, jeeps] = await Promise.all([
    reader.selectDistinct({ place: hotelRates.place }).from(hotelRates),
    reader.selectDistinct({ place: vehicleRates.place }).from(vehicleRates),
    reader.selectDistinct({ place: jeepLines.place }).from(jeepLines),
  ]);
  return [...new Set([...hotels, ...vehicles, ...jeeps].map((row) => row.place))];
}

// The start city of a new rate row: Air for an air rate, or a start city that starts road trips.
async function readRateCity(value: FormDataEntryValue | null): Promise<{ ok: true; city: string; mode: TripMode } | { ok: false; error: string }> {
  const text = String(value ?? "").trim();
  if (sameName(text, AIR_RATE_CITY)) return { ok: true, city: AIR_RATE_CITY, mode: "air" };
  const cities = await db.select().from(startCities);
  const start = findStartCity(cities, text);
  if (!start || !start.road) return { ok: false, error: "Choose Air or a start city that starts road trips." };
  return { ok: true, city: start.name, mode: "road" };
}

// BR-91: add a start city, or change one. Renaming it renames it on its hotel and vehicle rate rows
// in the same save. A start city is not deleted.
export async function saveStartCityAs(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  if (!can(actor, "rates.edit")) return forbidden("You cannot change a price.");
  const idText = String(formData.get("id") ?? "").trim();
  const id = idText ? readRecordId(idText) : null;
  if (idText && id === null) return { ok: false, error: "That start city was not found." };
  const name = readName(formData.get("name"), "the city name");
  if (!name.ok) return name;
  if (sameName(name.name, AIR_RATE_CITY)) return { ok: false, error: "Air is the start city of the air rates. Choose another name." };
  const road = checked(formData.get("road"));
  const air = checked(formData.get("air"));
  if (!road && !air) return { ok: false, error: "Choose road trips, air trips, or both." };
  const airExtra = readAmount(String(formData.get("airExtra") ?? ""));
  if (!airExtra.ok) return airExtra;
  const perVehicleDay = readAmount(String(formData.get("longRoutePerVehicleDay") ?? "") || "0");
  if (!perVehicleDay.ok) return perVehicleDay;
  const afterText = String(formData.get("longRouteAfterDays") ?? "").trim();
  let afterDays: number | null = null;
  if (afterText) {
    const after = readCount(afterText, "the days before the long-route extra", LONG_ROUTE_DAYS_MAX);
    if (!after.ok) return after;
    afterDays = after.count;
  }
  if (perVehicleDay.amount > 0 && afterDays === null) return { ok: false, error: "Enter the days after which the long-route extra starts." };

  const values = {
    name: name.name,
    road,
    air,
    airExtra: airExtra.amount,
    longRouteAfterDays: afterDays,
    longRoutePerVehicleDay: perVehicleDay.amount,
  };

  return db.transaction(async (tx): Promise<ActionResult> => {
    await lockRateNames(tx);
    const cities = await tx.select({ id: startCities.id, name: startCities.name, sortOrder: startCities.sortOrder }).from(startCities);
    const current = id === null ? null : cities.find((row) => row.id === id);
    if (id !== null && !current) return { ok: false, error: "That start city was not found." };
    if (cities.some((row) => row.id !== id && sameName(row.name, name.name))) return { ok: false, error: "A start city with that name already exists." };

    if (!current) {
      const sortOrder = Math.max(0, ...cities.map((row) => row.sortOrder)) + 1;
      const [row] = await tx.insert(startCities).values({ ...values, sortOrder }).returning({ id: startCities.id });
      if (!row) return { ok: false, error: "The start city could not be added." };
      await recordActivity(tx, actor, { kind: "start_city", recordId: row.id, text: `Added start city ${name.name}` });
      return { ok: true, message: `Start city added: ${name.name}.` };
    }

    const renamed = current.name !== name.name;
    if (renamed && !sameName(current.name, name.name)) {
      // Rate rows that already use the new name belong to no start city. Renaming onto them would mix
      // two sets of rates, so it is refused.
      const [hotelClash] = await tx.select({ id: hotelRates.id }).from(hotelRates).where(eq(hotelRates.startCity, name.name)).limit(1);
      const [vehicleClash] = await tx.select({ id: vehicleRates.id }).from(vehicleRates).where(eq(vehicleRates.startCity, name.name)).limit(1);
      if (hotelClash || vehicleClash) return { ok: false, error: "Rate rows already use that start city name. Choose another name." };
    }
    await tx.update(startCities).set(values).where(eq(startCities.id, current.id));
    if (renamed) {
      await tx.update(hotelRates).set({ startCity: name.name }).where(eq(hotelRates.startCity, current.name));
      await tx.update(vehicleRates).set({ startCity: name.name }).where(eq(vehicleRates.startCity, current.name));
    }
    await recordActivity(tx, actor, {
      kind: "start_city",
      recordId: current.id,
      text: renamed ? `Renamed start city ${current.name} to ${name.name}` : `Saved start city ${name.name}`,
    });
    return { ok: true, message: renamed ? `Start city renamed: ${name.name}.` : "Start city saved." };
  });
}

// BR-90: a new hotel rate row. A new place name adds the place with this, its first hotel rate.
export async function addHotelRateAs(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  if (!can(actor, "rates.edit")) return forbidden("You cannot change a price.");
  const typed = readName(formData.get("place"), "the place");
  if (!typed.ok) return typed;
  const city = await readRateCity(formData.get("startCity"));
  if (!city.ok) return city;
  const grade = String(formData.get("grade") ?? "").trim();
  if (!(HOTEL_GRADES as readonly string[]).includes(grade)) return { ok: false, error: "Choose a hotel grade." };
  const twin = readAmount(String(formData.get("twin") ?? ""));
  if (!twin.ok) return twin;
  const triple = readAmount(String(formData.get("triple") ?? ""));
  if (!triple.ok) return triple;
  const hotelName = String(formData.get("hotelName") ?? "").trim();
  if (hotelName.length > HOTEL_NAME_MAX) return { ok: false, error: `Enter a hotel name of ${HOTEL_NAME_MAX} characters or less.` };
  return db.transaction(async (tx): Promise<ActionResult> => {
    await lockRateNames(tx);
    // A place typed in another case is the same place, kept as it is stored.
    const place = (await ratePlaces(tx)).find((known) => sameName(known, typed.name)) ?? typed.name;
    const [taken] = await tx
      .select({ id: hotelRates.id })
      .from(hotelRates)
      .where(and(eq(hotelRates.place, place), eq(hotelRates.startCity, city.city), eq(hotelRates.grade, grade)))
      .limit(1);
    if (taken) return { ok: false, error: `${place} from ${city.city} already has a ${grade} hotel rate. Change it in the table.` };
    const [row] = await tx
      .insert(hotelRates)
      .values({ place, startCity: city.city, grade, twin: twin.amount, triple: triple.amount, hotelName, offered: checked(formData.get("offered")) })
      .returning({ id: hotelRates.id });
    if (!row) return { ok: false, error: "The hotel rate could not be added." };
    await recordActivity(tx, actor, { kind: "hotel_rate", recordId: row.id, text: `Added hotel rate ${place}, ${city.city}, ${grade}` });
    return { ok: true, message: `Hotel rate added: ${place}, ${city.city}, ${grade}.` };
  });
}

// BR-90: a new vehicle rate row for a place that has rates. Air rates are stored from Air.
export async function addVehicleRateAs(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  if (!can(actor, "rates.edit")) return forbidden("You cannot change a price.");
  const typed = readName(formData.get("place"), "the place");
  if (!typed.ok) return typed;
  const city = await readRateCity(formData.get("startCity"));
  if (!city.ok) return city;
  const vehicle = readName(formData.get("vehicle"), "the vehicle");
  if (!vehicle.ok) return vehicle;
  if (vehicleKey(vehicle.name) === "other") return { ok: false, error: "Other is typed on each quote. Choose another vehicle name." };
  const rent = readAmount(String(formData.get("rent") ?? ""));
  if (!rent.ok) return rent;
  const fuel = readAmount(String(formData.get("fuel") ?? ""));
  if (!fuel.ok) return fuel;
  const toll = readAmount(String(formData.get("toll") ?? ""));
  if (!toll.ok) return toll;
  const seats = readCount(String(formData.get("seats") ?? ""), "the seats", 60);
  if (!seats.ok) return seats;
  if (seats.count < 1) return { ok: false, error: "Enter at least 1 seat." };
  // A row with no rent, fuel, or toll cannot be on, as on a saved row.
  const live = checked(formData.get("live")) && !(rent.amount === 0 && fuel.amount === 0 && toll.amount === 0);
  return db.transaction(async (tx): Promise<ActionResult> => {
    await lockRateNames(tx);
    const place = (await ratePlaces(tx)).find((known) => sameName(known, typed.name));
    if (!place) return { ok: false, error: "Add the place with its first hotel rate on the Hotels tab, then add its vehicles." };
    const sameTrip = await tx
      .select({ vehicle: vehicleRates.vehicle })
      .from(vehicleRates)
      .where(and(eq(vehicleRates.place, place), eq(vehicleRates.startCity, city.city), eq(vehicleRates.mode, city.mode)));
    if (sameTrip.some((row) => vehicleKey(row.vehicle) === vehicleKey(vehicle.name))) {
      return { ok: false, error: `${place} from ${city.city} already has a ${vehicle.name} rate. Change it in the table.` };
    }
    const [row] = await tx
      .insert(vehicleRates)
      .values({ place, startCity: city.city, mode: city.mode, vehicle: vehicle.name, rent: rent.amount, fuel: fuel.amount, toll: toll.amount, seats: seats.count, live })
      .returning({ id: vehicleRates.id });
    if (!row) return { ok: false, error: "The vehicle rate could not be added." };
    await recordActivity(tx, actor, { kind: "vehicle_rate", recordId: row.id, text: `Added vehicle rate ${vehicle.name}, ${place} from ${city.city}` });
    return { ok: true, message: `Vehicle rate added: ${vehicle.name}, ${place} from ${city.city}.` };
  });
}

// BR-90: rename a place on every hotel rate, vehicle rate, and jeep line, in one save. From T-58 its
// day plans, the days priced as it, and its hotel-names lines follow too, and from T-59 the options
// limited to it. The public places table is
// not touched.
export async function renamePlaceAs(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  if (!can(actor, "rates.edit")) return forbidden("You cannot change a price.");
  const from = String(formData.get("place") ?? "").trim();
  if (!from) return { ok: false, error: "That place was not found." };
  const to = readName(formData.get("name"), "the new name");
  if (!to.ok) return to;
  if (to.name === from) return { ok: false, error: "Enter a new name for the place." };
  return db.transaction(async (tx): Promise<ActionResult> => {
    await lockRateNames(tx);
    const known = await ratePlaces(tx);
    if (!known.includes(from)) return { ok: false, error: "That place was not found." };
    if (known.some((place) => place !== from && sameName(place, to.name))) return { ok: false, error: "Another place already has that name." };
    await tx.update(hotelRates).set({ place: to.name }).where(eq(hotelRates.place, from));
    await tx.update(vehicleRates).set({ place: to.name }).where(eq(vehicleRates.place, from));
    await tx.update(jeepLines).set({ place: to.name }).where(eq(jeepLines.place, from));
    await tx.update(dayPlans).set({ place: to.name }).where(eq(dayPlans.place, from));
    await tx.update(dayPlans).set({ pricePlace: to.name }).where(eq(dayPlans.pricePlace, from));
    await tx.update(placeHotelNames).set({ place: to.name }).where(eq(placeHotelNames.place, from));
    // T-59: an option limited to the place keeps it under its new name.
    await tx.execute(sql`update package_options set places = array_replace(places, ${from}, ${to.name}) where ${from} = any(places)`);
    await recordActivity(tx, actor, { kind: "place_rename", text: `Renamed rate place ${from} to ${to.name}` });
    return { ok: true, message: `Place renamed: ${to.name}.` };
  });
}

export async function saveJeepLineAs(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  if (!can(actor, "rates.edit")) return forbidden("You cannot change a price.");
  const id = readRecordId(formData.get("id"));
  if (id === null) return { ok: false, error: "That jeep line was not found." };
  const amount = readAmount(String(formData.get("amount") ?? ""));
  if (!amount.ok) return amount;
  const [row] = await db.select({ id: jeepLines.id, place: jeepLines.place, label: jeepLines.label }).from(jeepLines).where(eq(jeepLines.id, id)).limit(1);
  if (!row) return { ok: false, error: "That jeep line was not found." };
  await db.transaction(async (tx) => {
    await tx.update(jeepLines).set({ amount: amount.amount, live: checked(formData.get("live")) }).where(eq(jeepLines.id, id));
    await recordActivity(tx, actor, { kind: "jeep_line", recordId: id, text: `Saved jeep line ${row.label}, ${row.place}` });
  });
  return { ok: true, message: "Jeep line saved." };
}

// BR-87: the pricing rules, kept in one row. Each amount is checked like a rate. The child air fare
// is a whole percent from 0 to 100, and people per room a whole number from 1 to 6.
export async function savePricingRulesAs(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  if (!can(actor, "rates.edit")) return forbidden("You cannot change a price.");
  const guide = readAmount(String(formData.get("guidePerDay") ?? ""));
  if (!guide.ok) return guide;
  const breakfast = readAmount(String(formData.get("breakfastPerPerson") ?? ""));
  if (!breakfast.ok) return breakfast;
  const childFare = readCount(String(formData.get("childFarePercent") ?? ""), "the child fare percent", 1000);
  if (!childFare.ok) return childFare;
  if (childFare.count > 100) return { ok: false, error: "Enter a child fare of 0 to 100 percent." };
  const lapInfant = readAmount(String(formData.get("lapInfantFare") ?? ""));
  if (!lapInfant.ok) return lapInfant;
  const seatInfant = readAmount(String(formData.get("seatInfantFare") ?? ""));
  if (!seatInfant.ok) return seatInfant;
  const perRoom = readCount(String(formData.get("peoplePerRoom") ?? ""), "the people per room", 1000);
  if (!perRoom.ok) return perRoom;
  if (perRoom.count < 1 || perRoom.count > 6) return { ok: false, error: "Enter 1 to 6 people per room." };
  const values = {
    guidePerDay: guide.amount,
    breakfastPerPerson: breakfast.amount,
    childFarePercent: childFare.count,
    lapInfantFare: lapInfant.amount,
    seatInfantFare: seatInfant.amount,
    peoplePerRoom: perRoom.count,
  };
  const [row] = await db.select({ id: pricingRules.id }).from(pricingRules).orderBy(pricingRules.id).limit(1);
  await db.transaction(async (tx) => {
    if (!row) await tx.insert(pricingRules).values(values);
    else await tx.update(pricingRules).set(values).where(eq(pricingRules.id, row.id));
    await recordActivity(tx, actor, { kind: "pricing_rule", text: "Saved the pricing rules" });
  });
  return { ok: true, message: "Pricing rules saved." };
}

// BR-87 and BR-88: one grade's dinner rate per night and lunch rate per day, per person.
export async function saveMealRateAs(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  if (!can(actor, "rates.edit")) return forbidden("You cannot change a price.");
  const id = readRecordId(formData.get("id"));
  if (id === null) return { ok: false, error: "That meal rate was not found." };
  const dinner = readAmount(String(formData.get("dinner") ?? ""));
  if (!dinner.ok) return dinner;
  const lunch = readAmount(String(formData.get("lunch") ?? ""));
  if (!lunch.ok) return lunch;
  const [row] = await db.select({ id: mealRates.id, grade: mealRates.grade }).from(mealRates).where(eq(mealRates.id, id)).limit(1);
  if (!row) return { ok: false, error: "That meal rate was not found." };
  await db.transaction(async (tx) => {
    await tx.update(mealRates).set({ dinner: dinner.amount, lunch: lunch.amount }).where(eq(mealRates.id, id));
    await recordActivity(tx, actor, { kind: "meal_rate", recordId: id, text: `Saved the meal rates for ${row.grade}` });
  });
  return { ok: true, message: "Meal rates saved." };
}

// The saved profit margin, one whole percent from 0 to 100, kept in the one seasons row.
export async function saveMarginAs(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  if (!can(actor, "rates.edit")) return forbidden("You cannot change a price.");
  const margin = readMarginPercent(String(formData.get("percent") ?? ""));
  if (!margin.ok) return margin;
  const [row] = await db.select({ id: seasons.id }).from(seasons).limit(1);
  await db.transaction(async (tx) => {
    if (!row) await tx.insert(seasons).values({ percent: margin.percent });
    else await tx.update(seasons).set({ percent: margin.percent }).where(eq(seasons.id, row.id));
    await recordActivity(tx, actor, { kind: "margin", text: `Changed the profit margin to ${margin.percent} percent` });
  });
  return { ok: true, message: `Profit margin saved: ${margin.percent} percent.` };
}

export async function quoteInputFromForm(formData: FormData): Promise<{ ok: true; input: QuoteInput } | { ok: false; error: string }> {
  const days = readCount(String(formData.get("days") ?? ""), "the days", 60);
  if (!days.ok) return days;
  const adults = readCount(String(formData.get("adults") ?? ""), "the adults", 60);
  if (!adults.ok) return adults;
  const children = readCount(String(formData.get("children") ?? "0"), "the children", 60);
  if (!children.ok) return children;
  const lapInfants = readCount(String(formData.get("lapInfants") ?? "0"), "the lap infants", 60);
  if (!lapInfants.ok) return lapInfants;
  const seatInfants = readCount(String(formData.get("seatInfants") ?? "0"), "the infants with a seat", 60);
  if (!seatInfants.ok) return seatInfants;
  // A margin for this one quote. Blank uses the saved margin. Anything else must be 0 to 100.
  const marginText = String(formData.get("seasonPercent") ?? "").trim();
  let seasonPercent: MarginPercent | undefined;
  if (marginText) {
    const margin = readMarginPercent(marginText);
    if (!margin.ok) return margin;
    seasonPercent = margin.percent;
  }
  const nightEdits: NightEdit[] = [];
  const night = String(formData.get("night") ?? "").trim();
  const nightRate = String(formData.get("nightRate") ?? "").trim();
  if (night || nightRate) {
    const nightNumber = readCount(night, "the night", 60);
    if (!nightNumber.ok) return nightNumber;
    const rate = readAmount(nightRate);
    if (!rate.ok) return rate;
    nightEdits.push({ night: nightNumber.count, rate: rate.amount, hotelName: String(formData.get("nightHotel") ?? "") });
  }
  const dayEdits: DayEdit[] = [];
  const dayChange = String(formData.get("dayChange") ?? "").trim();
  if (dayChange === "clear" || dayChange === "jeep" || dayChange === "vehicle") {
    const day = readCount(String(formData.get("day") ?? ""), "the day", 60);
    if (!day.ok) return day;
    if (dayChange === "clear") {
      dayEdits.push({ day: day.count, cleared: true });
    } else if (dayChange === "jeep") {
      const rent = readAmount(String(formData.get("dayRent") ?? ""));
      if (!rent.ok) return rent;
      const fuel = readAmount(String(formData.get("dayFuel") ?? ""));
      if (!fuel.ok) return fuel;
      dayEdits.push({ day: day.count, jeep: true, rent: rent.amount, fuel: fuel.amount });
    } else {
      const dayVehicle = String(formData.get("dayVehicle") ?? "").trim();
      if (!dayVehicle) return { ok: false, error: "Choose a vehicle for that day." };
      dayEdits.push({ day: day.count, vehicle: dayVehicle });
    }
  }
  const paidExtras: { name: string; amount: number }[] = [];
  const extraName = String(formData.get("extraName") ?? "").trim();
  const extraAmount = String(formData.get("extraAmount") ?? "").trim();
  if (extraName || extraAmount) {
    const amount = readAmount(extraAmount);
    if (!amount.ok) return amount;
    paidExtras.push({ name: extraName, amount: amount.amount });
  }
  const vehicle = String(formData.get("vehicle") ?? "");
  // BR-92: a count staff typed. Blank means the automatic count.
  const typedCount = (field: string, label: string) => {
    const text = String(formData.get(field) ?? "").trim();
    return text ? readCount(text, label, MAX_COUNT) : ({ ok: true, count: undefined } as const);
  };
  const roomCount = typedCount("roomCount", "the rooms");
  if (!roomCount.ok) return roomCount;
  const vehicleCount = typedCount("vehicleCount", "the vehicles");
  if (!vehicleCount.ok) return vehicleCount;
  // BR-89: the tickets are on unless the form says off. A form without the field keeps them on.
  const ticketsValue = formData.get("tickets");
  const tickets = ticketsValue === null ? true : checked(ticketsValue);
  const input: QuoteInput = {
    place: String(formData.get("place") ?? ""),
    startCity: String(formData.get("startCity") ?? ""),
    mode: String(formData.get("mode") ?? "") === "air" ? "air" : "road",
    days: days.count,
    adults: adults.count,
    children: children.count,
    lapInfants: lapInfants.count,
    seatInfants: seatInfants.count,
    grade: String(formData.get("grade") ?? ""),
    vehicle,
    guide: checked(formData.get("guide")),
    meals: checked(formData.get("meals")),
    lunch: checked(formData.get("lunch")),
    tickets,
    roomCount: roomCount.count,
    vehicleCount: vehicleCount.count,
    seasonPercent,
    nightEdits,
    dayEdits,
    paidExtras,
    otherNote: String(formData.get("otherNote") ?? ""),
  };
  if (vehicle.trim().toLowerCase() === "other") {
    const rent = readAmount(String(formData.get("otherRent") ?? ""));
    if (!rent.ok) return rent;
    const fuel = readAmount(String(formData.get("otherFuel") ?? ""));
    if (!fuel.ok) return fuel;
    const toll = readAmount(String(formData.get("otherToll") ?? ""));
    if (!toll.ok) return toll;
    const seats = readCount(String(formData.get("otherSeats") ?? ""), "the seats", 60);
    if (!seats.ok) return seats;
    input.otherRent = rent.amount;
    input.otherFuel = fuel.amount;
    input.otherToll = toll.amount;
    input.otherSeats = seats.count;
  }
  return { ok: true, input };
}

export async function saveQuoteAs(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  if (!can(actor, "rates.edit")) return forbidden("You cannot change a price.");
  const parsed = await quoteInputFromForm(formData);
  if (!parsed.ok) return parsed;
  const catalog = await loadCatalog();
  const quote = buildQuote(parsed.input, catalog);
  if (!quote.ok) return quote;
  await db.transaction(async (tx) => {
    const [saved] = await tx
      .insert(quotes)
      .values({
        place: parsed.input.place,
        startCity: parsed.input.startCity,
        mode: parsed.input.mode,
        days: parsed.input.days,
        adults: parsed.input.adults,
        children: parsed.input.children,
        lapInfants: parsed.input.lapInfants,
        seatInfants: parsed.input.seatInfants,
        grade: parsed.input.grade,
        vehicle: parsed.input.vehicle,
        otherNote: parsed.input.otherNote ?? "",
        guide: parsed.input.guide,
        meals: parsed.input.meals,
        lunch: Boolean(parsed.input.lunch),
        roomCount: parsed.input.roomCount ?? null,
        vehicleCount: parsed.input.vehicleCount ?? null,
        tickets: parsed.input.tickets !== false,
        seasonPercent: quote.seasonPercent,
        subtotal: quote.subtotal,
        profit: quote.profit,
        total: quote.total,
      })
      .returning({ id: quotes.id });
    if (!saved) return;
    if (quote.nights.length > 0) {
      await tx.insert(quoteNights).values(quote.nights.map((night) => ({ quoteId: saved.id, ...night })));
    }
    if (quote.days.length > 0) {
      await tx.insert(quoteDays).values(
        quote.days.map((day) => ({
          quoteId: saved.id,
          day: day.day,
          vehicle: day.vehicle,
          rent: day.rent,
          fuel: day.fuel,
          toll: day.toll,
          cleared: day.cleared,
        })),
      );
    }
    const extras = parsed.input.paidExtras ?? [];
    if (extras.length > 0) {
      await tx.insert(quoteExtras).values(extras.map((extra) => ({ quoteId: saved.id, name: extra.name, amount: extra.amount })));
    }
    await recordActivity(tx, actor, { kind: "quote", recordId: saved.id, text: `Saved quote ${saved.id}, ${parsed.input.place}, total Rs ${quote.total.toLocaleString("en-US")}` });
  });
  return { ok: true, message: `Quote saved. Total Rs ${quote.total.toLocaleString("en-US")}.` };
}

export async function savePriceFromKind(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const kind = String(formData.get("kind") ?? "");
  if (kind === "hotel") return saveHotelRateAs(actor, formData);
  if (kind === "vehicle") return saveVehicleRateAs(actor, formData);
  if (kind === "air") return saveAirExtraAs(actor, formData);
  if (kind === "jeep") return saveJeepLineAs(actor, formData);
  if (kind === "start_city") return saveStartCityAs(actor, formData);
  if (kind === "hotel_rate_add") return addHotelRateAs(actor, formData);
  if (kind === "vehicle_rate_add") return addVehicleRateAs(actor, formData);
  if (kind === "place_rename") return renamePlaceAs(actor, formData);
  if (kind === "season") return saveMarginAs(actor, formData);
  if (kind === "pricing_rule") return savePricingRulesAs(actor, formData);
  if (kind === "meal_rate") return saveMealRateAs(actor, formData);
  if (kind === "quote") return saveQuoteAs(actor, formData);
  if (!can(actor, "rates.edit")) return forbidden("You cannot change a price.");
  return { ok: false, error: "Choose a rate to save." };
}
