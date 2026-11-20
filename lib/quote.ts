export const GUEST_GRADES = ["Deluxe", "Executive", "Luxury", "Ultra Luxury"] as const;
export type GuestGrade = (typeof GUEST_GRADES)[number];
export type HotelGrade = GuestGrade | "Premier";
export type TripMode = "road" | "air";
// The profit margin: any whole percent from 0 to 100 (BR-22, BR-43). The database column and the
// request field keep the older name season_percent / seasonPercent, so old quotes still read.
export type MarginPercent = number;
export const MARGIN_MAX = 100;
// The starting value until Moeen answers S-2.
export const DEFAULT_MARGIN = 20;

export function isMarginPercent(value: unknown): value is MarginPercent {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= MARGIN_MAX;
}

// Reads a margin typed in a form or sent in a request. Blank, negative, decimal, and non-numeric
// values are refused, as is anything over 100.
export function readMarginPercent(raw: string): { ok: true; percent: MarginPercent } | { ok: false; error: string } {
  const text = raw.trim();
  if (!text) return { ok: false, error: "Enter a profit margin from 0 to 100." };
  if (!/^\d+$/.test(text)) return { ok: false, error: "Enter the profit margin as a whole number from 0 to 100." };
  const percent = Number(text);
  if (percent > MARGIN_MAX) return { ok: false, error: "Enter a profit margin of 100 or less." };
  return { ok: true, percent };
}

// Every grade a hotel rate row can have. Premier is stored but not offered to guests.
export const HOTEL_GRADES: readonly HotelGrade[] = ["Deluxe", "Premier", "Executive", "Luxury", "Ultra Luxury"];
const MAX_DAYS = 60;
// The most rooms or vehicles one quote can have.
export const MAX_COUNT = 60;
// A twin room holds two. The automatic room count for more than two uses the people-per-room rule.
const TWIN_ROOM_PEOPLE = 2;
const TAOBAT_SHEET_PLACE = "Neelum Taobat Arang Kel";
const TAOBAT_PLACE = "Taobat";
// Air rate rows are stored with this start city, whichever city the flight leaves from.
export const AIR_RATE_CITY = "Air";

export type HotelRateRow = {
  place: string;
  startCity: string;
  grade: string;
  twin: number;
  triple: number;
  hotelName: string;
  offered: boolean;
};

export type VehicleRateRow = {
  place: string;
  startCity: string;
  mode: TripMode;
  vehicle: string;
  rent: number;
  fuel: number;
  toll: number;
  seats: number;
  live: boolean;
};

// From T-48 the Lahore and Karachi adds are read from the start city (BR-91), not from here.
export type AirExtraRow = {
  islamabadTicket: number;
  welcomePack: number;
  entry: number;
  infantExtra: number;
  sticker: number;
};

// BR-91: where a trip starts. airExtra is added to the Islamabad ticket on an air trip. On a road
// trip longer than longRouteAfterDays, longRoutePerVehicleDay is added for each later day and vehicle.
export type StartCityRow = {
  name: string;
  road: boolean;
  air: boolean;
  airExtra: number;
  longRouteAfterDays: number | null;
  longRoutePerVehicleDay: number;
};

// BR-87: the rules the office changes on the Pricing rules tab, read from the database.
export type PricingRules = {
  guidePerDay: number;
  breakfastPerPerson: number;
  childFarePercent: number;
  lapInfantFare: number;
  seatInfantFare: number;
  peoplePerRoom: number;
};

// BR-87 and BR-88: per person, dinner for each night and lunch for each day.
export type MealRateRow = { grade: string; dinner: number; lunch: number };

export type JeepLineRow = {
  place: string;
  mode: TripMode | "both";
  label: string;
  people: number;
  amount: number;
  live: boolean;
};

export type RateCatalog = {
  hotels: HotelRateRow[];
  vehicles: VehicleRateRow[];
  air: AirExtraRow;
  startCities: StartCityRow[];
  jeeps: JeepLineRow[];
  seasonPercent: MarginPercent;
  // Null until the pricing rules are stored (drizzle/0004_pricing_rules.sql).
  rules: PricingRules | null;
  meals: MealRateRow[];
};

export type NightEdit = { night: number; rate: number; hotelName?: string };
export type DayEdit = {
  day: number;
  cleared?: boolean;
  jeep?: boolean;
  vehicle?: string;
  rent?: number;
  fuel?: number;
};

export type QuoteInput = {
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
  vehicleCount?: number;
  roomCount?: number;
  share?: "twin" | "triple";
  guide: boolean;
  // Dinner each night (BR-37). The field keeps the name meals, as on a saved quote.
  meals: boolean;
  // Lunch each day, for an office quote only (BR-88).
  lunch?: boolean;
  // BR-89: the air tickets, on unless the office turns them off. A guest quote always has them.
  tickets?: boolean;
  seasonPercent?: MarginPercent;
  nightEdits?: NightEdit[];
  dayEdits?: DayEdit[];
  paidExtras?: { name: string; amount: number }[];
  otherNote?: string;
  otherRent?: number;
  otherFuel?: number;
  otherToll?: number;
  otherSeats?: number;
};

export type NightLine = { night: number; rate: number; hotelName: string };
export type DayLine = { day: number; vehicle: string; rent: number; fuel: number; toll: number; cleared: boolean };
// working is the sum behind the amount, shown next to it on the office quote (BR-93). It is built here
// from the same numbers as the amount. Read as a sum, with the words and "on night 2" left out, its
// numbers give the amount. A guest response never has lines (BR-50).
export type QuoteLine = { label: string; amount: number; working: string };

export type QuoteSuccess = {
  ok: true;
  subtotal: number;
  profit: number;
  total: number;
  seasonPercent: MarginPercent;
  nights: NightLine[];
  days: DayLine[];
  lines: QuoteLine[];
  averageNightly: number;
  averageGrade: string;
  nearestGrade: boolean;
  vehicleCount: number;
  rooms: number;
  // BR-92: the counts the quote works out itself, shown with Auto when staff have not typed one.
  autoVehicleCount: number;
  autoRooms: number;
  vehicleName: string;
  hotelName: string;
};

export type QuoteResult = QuoteSuccess | { ok: false; error: string };

export function storedPlace(place: string) {
  return place.trim() === TAOBAT_SHEET_PLACE ? TAOBAT_PLACE : place.trim();
}

export function vehicleKey(name: string) {
  const key = name.trim().toLowerCase().replace(/\s+/g, " ");
  if (key === "parado" || key === "prado") return "prado";
  return key;
}

function isGrade(value: string): value is HotelGrade {
  return HOTEL_GRADES.includes(value as HotelGrade);
}

function whole(value: number) {
  return Number.isInteger(value) && value >= 0;
}

function rupeeText(value: number) {
  return value.toLocaleString("en-US");
}

function countText(count: number, one: string, many: string) {
  return `${count} ${count === 1 ? one : many}`;
}

// The stored start city with that name, in any case, or undefined.
export function findStartCity(startCities: StartCityRow[], name: string) {
  const key = name.trim().toLowerCase();
  return startCities.find((row) => row.name.trim().toLowerCase() === key);
}

export function buildQuote(input: QuoteInput, catalog: RateCatalog): QuoteResult {
  // BR-19, BR-20, BR-91: a trip starts only from a start city that starts that kind of trip, so a
  // road trip from Karachi is refused while Karachi starts air trips only.
  const start = findStartCity(catalog.startCities, input.startCity);
  if (!start) {
    return { ok: false, error: "Choose a start city." };
  }
  if (input.mode === "road" && !start.road) {
    return { ok: false, error: `A road trip cannot start in ${start.name}.` };
  }
  if (input.mode === "air" && !start.air) {
    return { ok: false, error: `An air trip cannot start in ${start.name}.` };
  }
  if (!isGrade(input.grade)) {
    return { ok: false, error: "Choose Deluxe, Executive, Luxury, or Ultra Luxury." };
  }
  if (input.grade === "Premier") {
    return { ok: false, error: "Premier is not offered." };
  }
  if (!Number.isInteger(input.days) || input.days < 1 || input.days > MAX_DAYS) {
    return { ok: false, error: "Enter a trip of 1 to 60 days." };
  }
  if (!whole(input.adults) || !whole(input.children) || !whole(input.lapInfants) || !whole(input.seatInfants)) {
    return { ok: false, error: "Enter a number for each traveler." };
  }
  const seats = input.adults + input.children + input.seatInfants;
  if (seats < 1) {
    return { ok: false, error: "Enter the travelers." };
  }
  const rules = catalog.rules;
  if (!rules) {
    return { ok: false, error: "The pricing rules are not stored yet." };
  }
  const mealRate = catalog.meals.find((row) => row.grade === input.grade);
  if ((input.meals || input.lunch) && !mealRate) {
    return { ok: false, error: "No meal rate is stored for that grade." };
  }

  const place = storedPlace(input.place);
  const city = input.mode === "air" ? AIR_RATE_CITY : start.name;
  const hotel = catalog.hotels.find(
    (row) => row.place === place && row.startCity === city && row.grade === input.grade && row.offered,
  );
  if (!hotel) {
    return { ok: false, error: "No hotel rate is stored for that trip." };
  }

  const other = vehicleKey(input.vehicle) === "other";
  let vehicleName = input.vehicle.trim();
  let rent = 0;
  let fuel = 0;
  let toll = 0;
  let vehicleSeats = 0;
  if (other) {
    if (
      input.otherRent === undefined ||
      input.otherFuel === undefined ||
      input.otherToll === undefined ||
      input.otherSeats === undefined ||
      !whole(input.otherRent) ||
      !whole(input.otherFuel) ||
      !whole(input.otherToll) ||
      !Number.isInteger(input.otherSeats) ||
      input.otherSeats < 1
    ) {
      return { ok: false, error: "Enter the rent, fuel, toll, and seats for Other." };
    }
    rent = input.otherRent;
    fuel = input.otherFuel;
    toll = input.otherToll;
    vehicleSeats = input.otherSeats;
    vehicleName = input.otherNote?.trim() || "Other";
  } else {
    const vehicle = catalog.vehicles.find(
      (row) =>
        row.place === place &&
        row.startCity === city &&
        row.mode === input.mode &&
        row.live &&
        vehicleKey(row.vehicle) === vehicleKey(input.vehicle),
    );
    if (!vehicle) {
      return { ok: false, error: "No vehicle rate is stored for that trip." };
    }
    rent = vehicle.rent;
    fuel = vehicle.fuel;
    toll = vehicle.toll;
    vehicleSeats = vehicle.seats;
    vehicleName = vehicle.vehicle;
  }
  if (vehicleSeats < 1) {
    return { ok: false, error: "That vehicle has no seats." };
  }

  const autoRooms = input.share === "twin" ? Math.ceil(seats / TWIN_ROOM_PEOPLE) : Math.ceil(seats / rules.peoplePerRoom);
  const rooms = input.roomCount ?? autoRooms;
  if (!Number.isInteger(rooms) || rooms < 1) {
    return { ok: false, error: "Enter the rooms." };
  }
  if (rooms > MAX_COUNT) {
    return { ok: false, error: `Enter ${MAX_COUNT} rooms or fewer.` };
  }
  // T-55 (BR-84, sign-off row S-11): only the rooms that hold a third guest use the 3-share rate, and
  // the other rooms use the twin rate. The 3-share rooms are seats minus twice the rooms, from 0 up to
  // the rooms, so 5 seats in 2 rooms is 1 at 3-share and 1 at twin. A typed share prices every room.
  const tripleRooms =
    input.share === "triple" ? rooms : input.share === "twin" ? 0 : Math.min(Math.max(seats - TWIN_ROOM_PEOPLE * rooms, 0), rooms);
  const twinRooms = rooms - tripleRooms;
  const nightCost = hotel.triple * tripleRooms + hotel.twin * twinRooms;
  const nightsCount = input.days > 1 ? input.days - 1 : 0;
  const nights: NightLine[] = [];
  let hotelCost = 0;
  for (let night = 1; night <= nightsCount; night += 1) {
    const edit = input.nightEdits?.find((row) => row.night === night);
    // A typed night rate is for every room that night. A night with both kinds of room keeps the
    // average room rate on its line, and the hotel cost uses the exact sum.
    hotelCost += edit ? edit.rate * rooms : nightCost;
    nights.push({
      night,
      rate: edit ? edit.rate : tripleRooms === 0 ? hotel.twin : twinRooms === 0 ? hotel.triple : Math.round(nightCost / rooms),
      hotelName: edit?.hotelName?.trim() || hotel.hotelName,
    });
  }
  const editedNights = nights.filter((night) => input.nightEdits?.some((row) => row.night === night.night));
  const plainNights = nightsCount - editedNights.length;
  const hotelParts: string[] = [];
  if (plainNights > 0) {
    const roomParts: string[] = [];
    if (tripleRooms > 0) roomParts.push(`${countText(tripleRooms, "room", "rooms")} × ${rupeeText(hotel.triple)} 3-share`);
    if (twinRooms > 0) roomParts.push(`${countText(twinRooms, "room", "rooms")} × ${rupeeText(hotel.twin)} twin`);
    // With both kinds of room, the rooms are in brackets, so the nights multiply both.
    const roomsText = roomParts.length > 1 ? `(${roomParts.join(" + ")})` : roomParts[0];
    hotelParts.push(`${roomsText} × ${countText(plainNights, "night", "nights")}`);
  }
  for (const night of editedNights) {
    hotelParts.push(`${countText(rooms, "room", "rooms")} × ${rupeeText(night.rate)} on night ${night.night}`);
  }
  const hotelWorking = hotelParts.length > 0 ? hotelParts.join(" + ") : "No hotel nights";

  const autoVehicleCount = Math.ceil(seats / vehicleSeats);
  const vehicleCount = input.vehicleCount ?? autoVehicleCount;
  if (!Number.isInteger(vehicleCount) || vehicleCount < 1) {
    return { ok: false, error: "Enter the vehicles." };
  }
  if (vehicleCount > MAX_COUNT) {
    return { ok: false, error: `Enter ${MAX_COUNT} vehicles or fewer.` };
  }
  const days: DayLine[] = [];
  for (let day = 1; day <= input.days; day += 1) {
    const edit = input.dayEdits?.find((row) => row.day === day);
    if (!edit || edit.cleared) {
      days.push({
        day,
        vehicle: edit?.cleared ? "" : vehicleName,
        rent: edit?.cleared ? 0 : rent,
        fuel: edit?.cleared ? 0 : fuel,
        toll,
        cleared: Boolean(edit?.cleared),
      });
      continue;
    }
    if (edit.jeep) {
      if (edit.rent === undefined || edit.fuel === undefined || !whole(edit.rent) || !whole(edit.fuel)) {
        return { ok: false, error: "Enter the rent and fuel for the jeep on that day." };
      }
      days.push({ day, vehicle: "Jeep", rent: edit.rent, fuel: edit.fuel, toll, cleared: false });
      continue;
    }
    const replacement = edit.vehicle?.trim();
    if (!replacement) {
      days.push({ day, vehicle: vehicleName, rent, fuel, toll, cleared: false });
      continue;
    }
    const named = catalog.vehicles.find(
      (row) =>
        row.place === place &&
        row.startCity === city &&
        row.mode === input.mode &&
        row.live &&
        vehicleKey(row.vehicle) === vehicleKey(replacement),
    );
    if (!named) {
      return { ok: false, error: "No vehicle rate is stored for that day." };
    }
    if (named.rent + named.fuel <= rent + fuel) {
      return { ok: false, error: "Choose a higher vehicle for that day." };
    }
    days.push({ day, vehicle: named.vehicle, rent: named.rent, fuel: named.fuel, toll, cleared: false });
  }

  const activeDays = days.filter((day) => !day.cleared);
  const dailyVehicle = activeDays.reduce((sum, day) => sum + day.rent + day.fuel, 0);
  const vehicleCost = vehicleCount * (dailyVehicle + (activeDays.length > 0 ? toll : 0));
  // BR-93: "1 × Gli Car · ((8,000 rent + 0 fuel) × 5 days + 0 toll)". Days with the same vehicle and
  // amounts are counted together. A vehicle name typed for Other can hold digits, so it shows as Other.
  const baseName = other ? "Other" : vehicleName;
  const dayGroups: { vehicle: string; rent: number; fuel: number; count: number }[] = [];
  for (const day of activeDays) {
    const name = day.vehicle === vehicleName ? baseName : day.vehicle;
    const group = dayGroups.find((row) => row.vehicle === name && row.rent === day.rent && row.fuel === day.fuel);
    if (group) group.count += 1;
    else dayGroups.push({ vehicle: name, rent: day.rent, fuel: day.fuel, count: 1 });
  }
  const daySums = dayGroups.map(
    (group) =>
      `(${rupeeText(group.rent)} rent + ${rupeeText(group.fuel)} fuel) × ${countText(group.count, "day", "days")}${dayGroups.length > 1 ? ` ${group.vehicle}` : ""}`,
  );
  const vehicleWorking =
    dayGroups.length === 0
      ? "No vehicle on any day"
      : `${vehicleCount} × ${dayGroups.length === 1 ? `${dayGroups[0].vehicle} · ` : ""}(${[...daySums, `${rupeeText(toll)} toll`].join(" + ")})`;
  const guideCost = input.guide ? rules.guidePerDay * input.days : 0;
  // Infants are not counted for meals or breakfast.
  const mealPeople = input.adults + input.children;
  const dinnerCost = input.meals && mealRate ? mealRate.dinner * nightsCount * mealPeople : 0;
  const lunchCost = input.lunch && mealRate ? mealRate.lunch * mealPeople * input.days : 0;
  const breakfastCost = input.mode === "road" && input.days > 1 ? rules.breakfastPerPerson * mealPeople : 0;
  // BR-42 and BR-91: the long-route extra, such as Lahore's 5,000 per vehicle for each day after day 3.
  const longRouteDays = input.mode === "road" && start.longRouteAfterDays !== null ? Math.max(input.days - start.longRouteAfterDays, 0) : 0;
  const longRouteCost = start.longRoutePerVehicleDay * longRouteDays * vehicleCount;

  // BR-89: the office can leave the tickets out of an air quote. The rest of the air extras stay.
  const tickets = input.tickets !== false;
  let ticketWorking = "";
  let ticketCost = 0;
  let welcomeCost = 0;
  let entryCost = 0;
  let infantExtraCost = 0;
  let stickerCost = 0;
  if (input.mode === "air") {
    // BR-21 and BR-91: the Islamabad ticket plus the start city's air extra.
    const adultFare = catalog.air.islamabadTicket + start.airExtra;
    const childFare = Math.round((adultFare * rules.childFarePercent) / 100);
    if (tickets) {
      ticketCost =
        adultFare * input.adults +
        childFare * input.children +
        rules.lapInfantFare * input.lapInfants +
        rules.seatInfantFare * input.seatInfants;
      const fareText = start.airExtra > 0 ? `(${rupeeText(catalog.air.islamabadTicket)} + ${rupeeText(start.airExtra)} ${start.name})` : rupeeText(adultFare);
      const ticketParts: string[] = [];
      if (input.adults > 0) ticketParts.push(`${countText(input.adults, "adult", "adults")} × ${fareText}`);
      if (input.children > 0) ticketParts.push(`${countText(input.children, "child", "children")} × ${rupeeText(childFare)}`);
      if (input.lapInfants > 0) ticketParts.push(`${countText(input.lapInfants, "lap infant", "lap infants")} × ${rupeeText(rules.lapInfantFare)}`);
      if (input.seatInfants > 0) ticketParts.push(`${countText(input.seatInfants, "infant with a seat", "infants with a seat")} × ${rupeeText(rules.seatInfantFare)}`);
      ticketWorking = ticketParts.join(" + ");
    }
    welcomeCost = catalog.air.welcomePack * mealPeople;
    entryCost = catalog.air.entry * mealPeople;
    infantExtraCost = catalog.air.infantExtra * (input.lapInfants + input.seatInfants);
    // T-55 (BR-41, sign-off row S-10): the sticker is per vehicle, not per room.
    stickerCost = catalog.air.sticker * vehicleCount;
  }

  // T-55 (BR-27, sign-off row S-12): a jeep for each group of the line's people, counting adults and
  // children. Infants are not counted.
  const jeepCosts = catalog.jeeps
    .filter((line) => line.live && line.place === place && (line.mode === "both" || line.mode === input.mode))
    .map((line) => {
      const jeeps = Math.ceil(mealPeople / line.people);
      return { label: line.label, amount: line.amount * jeeps, working: `${countText(jeeps, "jeep", "jeeps")} × ${rupeeText(line.amount)}` };
    });
  const extras = (input.paidExtras ?? []).filter((extra) => extra.name.trim() && extra.amount > 0);

  const people = (count: number) => countText(count, "person", "people");
  const infants = input.lapInfants + input.seatInfants;
  const lines: QuoteLine[] = [
    { label: "Vehicle", amount: vehicleCost, working: vehicleWorking },
    { label: "Hotel", amount: hotelCost, working: hotelWorking },
  ];
  if (guideCost > 0) lines.push({ label: "Guide", amount: guideCost, working: `${rupeeText(rules.guidePerDay)} × ${countText(input.days, "day", "days")}` });
  if (dinnerCost > 0 && mealRate) {
    lines.push({ label: "Dinner", amount: dinnerCost, working: `${people(mealPeople)} × ${rupeeText(mealRate.dinner)} × ${countText(nightsCount, "night", "nights")}` });
  }
  if (lunchCost > 0 && mealRate) {
    lines.push({ label: "Lunch", amount: lunchCost, working: `${people(mealPeople)} × ${rupeeText(mealRate.lunch)} × ${countText(input.days, "day", "days")}` });
  }
  if (breakfastCost > 0) lines.push({ label: "Arrival breakfast", amount: breakfastCost, working: `${people(mealPeople)} × ${rupeeText(rules.breakfastPerPerson)}` });
  if (longRouteCost > 0) {
    lines.push({
      label: `${start.name} road extra`,
      amount: longRouteCost,
      working: `${rupeeText(start.longRoutePerVehicleDay)} × ${countText(longRouteDays, "day", "days")} after day ${start.longRouteAfterDays} × ${countText(vehicleCount, "vehicle", "vehicles")}`,
    });
  }
  if (ticketCost > 0) lines.push({ label: "Air tickets", amount: ticketCost, working: ticketWorking });
  if (welcomeCost > 0) lines.push({ label: "Welcome pack", amount: welcomeCost, working: `${people(mealPeople)} × ${rupeeText(catalog.air.welcomePack)}` });
  if (entryCost > 0) lines.push({ label: "Entry", amount: entryCost, working: `${people(mealPeople)} × ${rupeeText(catalog.air.entry)}` });
  if (infantExtraCost > 0) lines.push({ label: "Infant extra", amount: infantExtraCost, working: `${countText(infants, "infant", "infants")} × ${rupeeText(catalog.air.infantExtra)}` });
  if (stickerCost > 0) lines.push({ label: "Sticker", amount: stickerCost, working: `${countText(vehicleCount, "vehicle", "vehicles")} × ${rupeeText(catalog.air.sticker)}` });
  for (const jeep of jeepCosts) lines.push(jeep);
  for (const extra of extras) lines.push({ label: extra.name.trim(), amount: extra.amount, working: `${rupeeText(extra.amount)} added by staff` });

  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
  const margin = input.seasonPercent ?? catalog.seasonPercent;
  if (!isMarginPercent(margin)) {
    return { ok: false, error: "The profit margin is a whole number from 0 to 100." };
  }
  const profit = Math.round((subtotal * margin) / 100);
  const averageNightly = nightsCount > 0 ? nights.reduce((sum, night) => sum + night.rate, 0) / nightsCount : 0;
  const twins = catalog.hotels.filter((row) => row.place === place && row.startCity === city);
  let averageGrade = "";
  let nearestGrade = false;
  if (twins.length > 0 && nightsCount > 0) {
    const exact = twins.find((row) => row.twin === averageNightly);
    if (exact) {
      averageGrade = exact.grade;
    } else {
      const nearest = twins.reduce((best, row) =>
        Math.abs(row.twin - averageNightly) < Math.abs(best.twin - averageNightly) ? row : best,
      );
      averageGrade = nearest.grade;
      nearestGrade = true;
    }
  }

  return {
    ok: true,
    subtotal,
    profit,
    total: subtotal + profit,
    seasonPercent: margin,
    nights,
    days,
    lines,
    averageNightly,
    averageGrade,
    nearestGrade,
    vehicleCount,
    rooms,
    autoVehicleCount,
    autoRooms,
    vehicleName,
    hotelName: nights[0]?.hotelName || hotel.hotelName,
  };
}

export type QuoteOptions = {
  // The start cities for each travel mode, in the stored order.
  startCities: Record<TripMode, string[]>;
  // For each travel mode and start city, the places that can be quoted, by name.
  places: Record<TripMode, Record<string, string[]>>;
};

type OfferedHotel = Pick<HotelRateRow, "place" | "startCity" | "offered">;
type LiveVehicle = Pick<VehicleRateRow, "place" | "startCity" | "live"> & { mode: string };
type OfferedStart = Pick<StartCityRow, "name" | "road" | "air">;

// BR-90 and BR-91: what the office Quote screen offers. A start city is offered for the travel modes
// it starts. A place is offered for a travel mode and start city only when it has an offered hotel
// rate and a live vehicle rate for them, so a place with hotel rates only is not a trip on its own.
// Air rates are stored under one start city, so every air start city offers the same places.
export function quoteOptions(hotels: OfferedHotel[], vehicles: LiveVehicle[], startCities: OfferedStart[]): QuoteOptions {
  const options: QuoteOptions = { startCities: { road: [], air: [] }, places: { road: {}, air: {} } };
  for (const mode of ["road", "air"] as const) {
    for (const start of startCities) {
      if (!start[mode]) continue;
      const city = mode === "air" ? AIR_RATE_CITY : start.name;
      const hotelPlaces = new Set(hotels.filter((row) => row.offered && row.startCity === city).map((row) => row.place));
      const places = new Set(vehicles.filter((row) => row.live && row.mode === mode && row.startCity === city && hotelPlaces.has(row.place)).map((row) => row.place));
      options.startCities[mode].push(start.name);
      options.places[mode][start.name] = [...places].sort((a, b) => a.localeCompare(b));
    }
  }
  return options;
}
