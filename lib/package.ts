import type { TripMode } from "@/lib/quote";

// T-58 (design section 15): the days of a package, built from a rate place's day plans. No database
// code here, so the rules can be checked on their own, and the office screens can read the labels.
// Package options are added in T-59.

export type DayPlanPart = "out_air" | "out_road" | "middle" | "back_air" | "back_road";
export type DayPlanSection = { label: string; text: string };

export const DAY_PLAN_PARTS: readonly DayPlanPart[] = ["out_air", "out_road", "middle", "back_air", "back_road"];

export const DAY_PLAN_PART_LABELS: Record<DayPlanPart, string> = {
  out_air: "Way out by air",
  out_road: "Way out by road",
  middle: "Middle days",
  back_air: "Way back by air",
  back_road: "Way back by road",
};

// The longest values a day plan can hold. The desk's own data fits them.
export const DAY_PLAN_LIMITS = {
  title: 120,
  overnight: 60,
  sections: 6,
  label: 30,
  text: 2000,
  daysPerPart: 30,
  hotelNames: 300,
} as const;

// The text of a free day (BR-106), agreed with the lead on 24 November 2026.
export const FREE_DAY_LABEL = "Day";
export const FREE_DAY_TEXT = "A free day to rest or explore at your own pace.";

export function freeDayTitle(overnight: string) {
  return `Free day in ${overnight}`;
}

export type DayPlanRow = {
  id: number;
  place: string;
  part: DayPlanPart;
  position: number;
  title: string;
  overnight: string;
  pricedAs: string | null;
  sections: DayPlanSection[];
};

export type PackageTrip = { place: string; mode: TripMode; days: number; startCity: string };

export type PackageDay = {
  day: number;
  title: string;
  overnight: string;
  // The rate place this day's night is priced at, BR-112, and whose hotel-names line it uses, BR-111.
  pricedAs: string;
  sections: DayPlanSection[];
  free: boolean;
};

export type PackageDaysResult = { ok: true; days: PackageDay[] } | { ok: false; error: string };

export function outPart(mode: TripMode): DayPlanPart {
  return mode === "air" ? "out_air" : "out_road";
}

export function backPart(mode: TripMode): DayPlanPart {
  return mode === "air" ? "back_air" : "back_road";
}

function inOrder(plans: DayPlanRow[], place: string, part: DayPlanPart) {
  return plans.filter((plan) => plan.place === place && plan.part === part).sort((a, b) => a.position - b.position || a.id - b.id);
}

// BR-105: {ORIGIN} becomes the trip's start city.
export function withOrigin(text: string, startCity: string) {
  return text.replaceAll("{ORIGIN}", startCity);
}

// The fewest days a trip can have: the way out and the way back, which are never cut.
export function packageMinimumDays(plans: DayPlanRow[], trip: Pick<PackageTrip, "place" | "mode">) {
  return inOrder(plans, trip.place, outPart(trip.mode)).length + inOrder(plans, trip.place, backPart(trip.mode)).length;
}

// BR-106: the way out for the mode, then the middle days in their order, then the way back, so the
// count matches the quote's days. Days past the middle days are free days at the last overnight place
// before the way back. A trip shorter than the way out and the way back has no package: the quote
// itself still prices as before.
export function packageDays(trip: PackageTrip, plans: DayPlanRow[]): PackageDaysResult {
  const out = inOrder(plans, trip.place, outPart(trip.mode));
  const middle = inOrder(plans, trip.place, "middle");
  const back = inOrder(plans, trip.place, backPart(trip.mode));
  if (out.length + middle.length + back.length === 0) return { ok: false, error: `${trip.place} has no day plans yet.` };
  const needed = out.length + back.length;
  if (trip.days < needed) {
    return { ok: false, error: `A ${trip.place} trip by ${trip.mode} needs at least ${needed} days.` };
  }

  const middleCount = trip.days - needed;
  const chosen = [...out, ...middle.slice(0, middleCount)];
  const last = chosen.at(-1);
  const restOvernight = last?.overnight ?? back[0]?.overnight ?? trip.place;
  const restPricedAs = last ? (last.pricedAs ?? trip.place) : trip.place;
  const freeCount = Math.max(0, middleCount - middle.length);

  const days: PackageDay[] = [];
  const add = (plan: DayPlanRow) =>
    days.push({
      day: days.length + 1,
      title: withOrigin(plan.title, trip.startCity),
      overnight: withOrigin(plan.overnight, trip.startCity),
      pricedAs: plan.pricedAs ?? trip.place,
      sections: plan.sections.map((section) => ({ label: section.label, text: withOrigin(section.text, trip.startCity) })),
      free: false,
    });
  chosen.forEach(add);
  for (let index = 0; index < freeCount; index += 1) {
    const overnight = withOrigin(restOvernight, trip.startCity);
    days.push({
      day: days.length + 1,
      title: freeDayTitle(overnight),
      overnight,
      pricedAs: restPricedAs,
      sections: [{ label: FREE_DAY_LABEL, text: FREE_DAY_TEXT }],
      free: true,
    });
  }
  back.forEach(add);
  return { ok: true, days };
}

// BR-111: a grade's hotel line joins the lines of the trip's overnight places, in the order the trip
// reaches them, once each. A place with a blank line is left out. The last day is the way home and
// has no night, so it is not counted.
export function hotelLine(days: PackageDay[], grade: string, names: { place: string; grade: string; names: string }[]) {
  const places: string[] = [];
  for (const day of days.slice(0, -1)) {
    if (!places.includes(day.pricedAs)) places.push(day.pricedAs);
  }
  return places
    .map((place) => names.find((row) => row.place === place && row.grade === grade)?.names.trim() ?? "")
    .filter(Boolean)
    .join(" / ");
}
