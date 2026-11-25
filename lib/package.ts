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

// The text of a free day (BR-106), agreed with the lead on 24 November 2026. A rest day (BR-107)
// has the same text, agreed on 25 November 2026.
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
  pricePlace: string | null;
  sections: DayPlanSection[];
};

export type PackageTrip = { place: string; mode: TripMode; days: number; startCity: string };

export type PackageDay = {
  day: number;
  title: string;
  overnight: string;
  // The rate place this day's night is priced at, BR-112, and whose hotel-names line it uses, BR-111.
  pricePlace: string;
  sections: DayPlanSection[];
  free: boolean;
};

// A refused trip has no days. A trip that is too short also carries the fewest days it needs
// (design section 15), so the Package tab can say so.
export type PackageDaysResult = { ok: true; days: PackageDay[] } | { ok: false; error: string; minimumDays?: number };

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

// BR-107: a package option, as stored. places is empty for an option offered at every place.
export type PackageOption = {
  id: number;
  name: string;
  places: string[];
  dayOne: DayPlanSection | null;
  swapFrom: string | null;
  swapTo: number | null;
  restDays: boolean;
  badge: string | null;
  intro: string | null;
  notIncluded: string[];
  sortOrder: number;
};

// The longest values an option can hold, agreed with the lead on 25 November 2026.
export const PACKAGE_OPTION_LIMITS = {
  name: 60,
  badge: 40,
  intro: 1000,
  notIncludedLines: 10,
  notIncludedLine: 120,
  options: 50,
} as const;

function byOrder(options: PackageOption[]) {
  return [...options].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
}

// The options offered for a place: those with no places, and those that name it.
export function optionsFor(place: string, options: PackageOption[]) {
  return byOrder(options).filter((option) => option.places.length === 0 || option.places.includes(place));
}

// The ticked options that apply at the trip's place, in option order.
function tickedFor(place: string, options: PackageOption[], tickedIds: number[]) {
  return optionsFor(place, options).filter((option) => tickedIds.includes(option.id));
}

// BR-107: the header badge, the opening paragraph, and the extra Services not included lines of the
// ticked options. The first badge and the first opening paragraph win, and the lines are joined in
// option order with repeats left out.
export function packageExtras(place: string, options: PackageOption[], tickedIds: number[]) {
  const ticked = tickedFor(place, options, tickedIds);
  const notIncluded: string[] = [];
  for (const line of ticked.flatMap((option) => option.notIncluded)) {
    if (!notIncluded.some((seen) => seen.toLowerCase() === line.toLowerCase())) notIncluded.push(line);
  }
  return {
    badge: ticked.find((option) => option.badge)?.badge ?? null,
    intro: ticked.find((option) => option.intro)?.intro ?? null,
    notIncluded,
  };
}

// BR-107: rest days are one for every three middle days, at least one, and leave at least one
// sightseeing day. With 1 middle day there is none.
export function restDayCount(middleDays: number) {
  if (middleDays < 2) return 0;
  return Math.min(Math.max(1, Math.floor(middleDays / 3)), middleDays - 1);
}

// The middle days a trip can use at its place. A day an option swaps to is left out, so it only
// appears in a package with that option ticked. Each swap of the ticked options then puts its day in
// place of the middle day with the swap_from title, at that day's place only. Only the first swap of
// a day applies. The swap happens before the trip is cut to length.
function middleDays(plans: DayPlanRow[], place: string, options: PackageOption[], ticked: PackageOption[]) {
  const swapTargets = new Set(options.flatMap((option) => (option.swapTo === null ? [] : [option.swapTo])));
  const middle = inOrder(plans, place, "middle").filter((plan) => !swapTargets.has(plan.id));
  const swapped = new Set<number>();
  for (const option of ticked) {
    if (option.swapTo === null || !option.swapFrom) continue;
    const target = plans.find((plan) => plan.id === option.swapTo && plan.place === place && plan.part === "middle");
    const index = middle.findIndex((plan) => plan.title === option.swapFrom && !swapped.has(plan.id));
    if (!target || index < 0 || swapped.has(target.id)) continue;
    middle[index] = target;
    swapped.add(target.id);
  }
  return middle;
}

// BR-106 and BR-107: the way out for the mode, then the middle days in their order after any swap,
// then the way back, so the count matches the quote's days. Days past the middle days are free days
// at the last overnight place before the way back. With rest days ticked, some middle days are rest
// days: one after every third sightseeing day, and any left after the last one, each at the day
// before's overnight and priced-as place. The sightseeing days that do not fit drop off the end, as
// on a short trip. A trip shorter than the way out and the way back has no package: the quote itself
// still prices as before. options is every stored option, so a day an option swaps to is always left
// out. tickedIds are the options ticked on this package.
export function packageDays(trip: PackageTrip, plans: DayPlanRow[], options: PackageOption[] = [], tickedIds: number[] = []): PackageDaysResult {
  const out = inOrder(plans, trip.place, outPart(trip.mode));
  const back = inOrder(plans, trip.place, backPart(trip.mode));
  // A package starts with the way out and ends with the way back for its mode. Without either, it
  // would start or end at a middle day, so it is not built.
  if (out.length === 0 || back.length === 0) return { ok: false, error: `${trip.place} has no day plans by ${trip.mode} yet.` };
  const needed = out.length + back.length;
  if (trip.days < needed) {
    return { ok: false, error: `A ${trip.place} trip by ${trip.mode} needs at least ${needed} days.`, minimumDays: needed };
  }

  const ticked = tickedFor(trip.place, options, tickedIds);
  const middle = middleDays(plans, trip.place, options, ticked);
  const middleCount = trip.days - needed;
  const restCount = ticked.some((option) => option.restDays) ? restDayCount(middleCount) : 0;
  const sightseeingCount = middleCount - restCount;
  const sightseeing = middle.slice(0, sightseeingCount);

  const days: PackageDay[] = [];
  const add = (plan: DayPlanRow) =>
    days.push({
      day: days.length + 1,
      title: withOrigin(plan.title, trip.startCity),
      overnight: withOrigin(plan.overnight, trip.startCity),
      pricePlace: plan.pricePlace ?? trip.place,
      sections: plan.sections.map((section) => ({ label: section.label, text: withOrigin(section.text, trip.startCity) })),
      free: false,
    });
  // A free day or a rest day stays at the day before's overnight place and priced-as place.
  const addFree = () => {
    const before = days.at(-1);
    const overnight = before?.overnight ?? trip.place;
    days.push({
      day: days.length + 1,
      title: freeDayTitle(overnight),
      overnight,
      pricePlace: before?.pricePlace ?? trip.place,
      sections: [{ label: FREE_DAY_LABEL, text: FREE_DAY_TEXT }],
      free: true,
    });
  };

  out.forEach(add);
  let restsLeft = restCount;
  for (let index = 0; index < sightseeingCount; index += 1) {
    // A middle day while there are some, then BR-106 free days at the last overnight place.
    if (index < sightseeing.length) add(sightseeing[index]);
    else addFree();
    if ((index + 1) % 3 === 0 && restsLeft > 0) {
      addFree();
      restsLeft -= 1;
    }
  }
  for (; restsLeft > 0; restsLeft -= 1) addFree();
  back.forEach(add);

  // BR-107: each ticked option's day-one paragraph follows day 1's own paragraphs, in option order.
  for (const option of ticked) {
    if (option.dayOne) days[0].sections.push({ label: option.dayOne.label, text: withOrigin(option.dayOne.text, trip.startCity) });
  }
  return { ok: true, days };
}

// BR-111: a grade's hotel line joins the lines of the trip's overnight places, in the order the trip
// reaches them, once each. A place with a blank line is left out. The last day is the way home and
// has no night, so it is not counted.
export function hotelLine(days: PackageDay[], grade: string, names: { place: string; grade: string; names: string }[]) {
  const places: string[] = [];
  for (const day of days.slice(0, -1)) {
    if (!places.includes(day.pricePlace)) places.push(day.pricePlace);
  }
  return places
    .map((place) => names.find((row) => row.place === place && row.grade === grade)?.names.trim() ?? "")
    .filter(Boolean)
    .join(" / ");
}

// T-60 (BR-108): a fixed section of the package document. Its body depends on its kind: text is a
// list of paragraphs, rows a list of label and value pairs, and steps a list of numbered items.
export type PackageSectionKind = "text" | "rows" | "steps";
export type SectionRow = { label: string; value: string };
export type PackageSectionBody = string[] | SectionRow[];

export type PackageSection = {
  id: number;
  title: string;
  kind: PackageSectionKind;
  body: PackageSectionBody;
  sortOrder: number;
};

export const PACKAGE_SECTION_KINDS: readonly PackageSectionKind[] = ["text", "rows", "steps"];

export const PACKAGE_SECTION_KIND_LABELS: Record<PackageSectionKind, string> = {
  text: "Text",
  rows: "Rows",
  steps: "Numbered items",
};

// The longest values a section can hold, agreed on 25 November 2026.
export const PACKAGE_SECTION_LIMITS = {
  title: 80,
  text: 4000,
  rows: 30,
  rowLabel: 80,
  rowValue: 500,
  steps: 30,
  step: 500,
  sections: 20,
} as const;
