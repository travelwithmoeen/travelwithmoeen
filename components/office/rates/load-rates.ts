import { redirect } from "next/navigation";
import type { RateDeskView } from "@/components/office/rates/types";
import { airDestinations, roadDestinations } from "@/data/calculator-options";
import { storedPlace } from "@/lib/quote";
import { getOfficeSession } from "@/lib/http/office-session";
import { getRateDesk } from "@/lib/http/site-content";

// Every place on a hotel rate, a vehicle rate, or a jeep line, for the Add rate and rename drawers.
export function ratePlaces(desk: RateDeskView) {
  const names = [...desk.hotels, ...desk.vehicles, ...desk.jeeps].map((row) => row.place);
  return [...new Set(names)].sort((a, b) => a.localeCompare(b));
}

// The rate places the website package builder offers. Its list is in code, in
// data/calculator-options.ts, so staff cannot change it after a rename. Read here on the server, so
// the browser gets only the names. The builder's "Neelum Taobat Arang Kel" is stored as Taobat.
export function websiteBuilderPlaces() {
  return [...new Set([...roadDestinations, ...airDestinations].map((name) => storedPlace(name)))];
}

// The start cities a road rate row can start from.
export function roadCities(desk: RateDeskView) {
  return desk.startCities.filter((city) => city.road).map((city) => city.name);
}

// Every rates page: Owner and Manager only, read through GET /api/office/rates.
export async function loadRateDesk(): Promise<RateDeskView> {
  const user = await getOfficeSession();
  if (!user?.canEditRates) redirect("/office");
  const desk = await getRateDesk();
  if (!desk) redirect("/office");
  return {
    hotels: desk.hotels,
    vehicles: desk.vehicles,
    air: desk.air,
    startCities: desk.startCities,
    jeeps: desk.jeeps,
    seasonPercent: desk.seasonPercent,
    rules: desk.rules,
    meals: desk.meals,
  };
}
