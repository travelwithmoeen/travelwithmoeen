// ============================================================
// Tour Package Pricing Data
// ============================================================

export interface HotelRate {
  twin_rate: number;
  triple_rate: number;
}

export type HotelCategory =
  | "Deluxe (Lower)"
  | "Deluxe (Upper)"
  | "Executive"
  | "Luxury (Deluxe RM)"
  | "Luxury (Exec RM)";

export type RoadDestination =
  | "Skardu"
  | "Hunza"
  | "Skardu & Hunza"
  | "Astore"
  | "Fairy Meadows"
  | "Murree Patriata Galiyat"
  | "Murree Ayubia Nathiagali"
  | "Naran"
  | "Neelum Valley Kashmir"
  | "Neelum Taobat Arang Kel"
  | "Swat";

export type AirDestination = "Hunza" | "Astore" | "Fairy Meadows" | "Skardu & Hunza";

export type Destination = RoadDestination | AirDestination;

export type VehicleType = "Coaster 5c" | "Coaster 4c" | "Grand Cabin" | "Honda BRV" | "Gli Car";

export interface VehicleRate {
  daily_rent: number;
  toll: number;
  fuel: number;
  seats: number;
  per_day_total: number;
}

// ---- Hotel Categories ----
export const hotelCategories: HotelCategory[] = [
  "Deluxe (Lower)",
  "Deluxe (Upper)",
  "Executive",
  "Luxury (Deluxe RM)",
  "Luxury (Exec RM)",
];

// ---- Road Destinations ----
export const roadDestinations: RoadDestination[] = [
  "Skardu", "Hunza", "Skardu & Hunza", "Astore", "Fairy Meadows",
  "Murree Patriata Galiyat", "Murree Ayubia Nathiagali", "Naran",
  "Neelum Valley Kashmir", "Neelum Taobat Arang Kel", "Swat",
];

// ---- Air Destinations ----
export const airDestinations: AirDestination[] = [
  "Hunza", "Astore", "Fairy Meadows", "Skardu & Hunza",
];

// ---- Vehicle Types ----
export const vehicleTypes: VehicleType[] = [
  "Coaster 5c", "Coaster 4c", "Grand Cabin", "Honda BRV", "Gli Car",
];

// ---- Departure Cities ----
export type RoadDeparture = "Islamabad" | "Lahore";
export type AirDeparture = "Islamabad" | "Karachi";

export const roadDepartures: RoadDeparture[] = ["Islamabad", "Lahore"];
export const airDepartures: AirDeparture[] = ["Islamabad", "Karachi"];

export const lahoreSurcharge = 15000; // flat per-trip surcharge for Lahore departure

// ---- Road Hotel Pricing ----
const defaultHotelRates: Record<HotelCategory, HotelRate> = {
  "Deluxe (Lower)": { twin_rate: 10000, triple_rate: 12000 },
  "Deluxe (Upper)": { twin_rate: 10000, triple_rate: 12000 },
  Executive: { twin_rate: 10000, triple_rate: 12000 },
  "Luxury (Deluxe RM)": { twin_rate: 10000, triple_rate: 12000 },
  "Luxury (Exec RM)": { twin_rate: 10000, triple_rate: 12000 },
};

const premiumHotelRates: Record<HotelCategory, HotelRate> = {
  "Deluxe (Lower)": { twin_rate: 12000, triple_rate: 15000 },
  "Deluxe (Upper)": { twin_rate: 15000, triple_rate: 17000 },
  Executive: { twin_rate: 19000, triple_rate: 22000 },
  "Luxury (Deluxe RM)": { twin_rate: 30000, triple_rate: 40000 },
  "Luxury (Exec RM)": { twin_rate: 50000, triple_rate: 60000 },
};

export const roadHotelPricing: Record<RoadDestination, Record<HotelCategory, HotelRate>> = {
  Skardu: premiumHotelRates,
  Hunza: premiumHotelRates,
  "Skardu & Hunza": defaultHotelRates,
  Astore: defaultHotelRates,
  "Fairy Meadows": defaultHotelRates,
  "Murree Patriata Galiyat": defaultHotelRates,
  "Murree Ayubia Nathiagali": defaultHotelRates,
  Naran: defaultHotelRates,
  "Neelum Valley Kashmir": defaultHotelRates,
  "Neelum Taobat Arang Kel": defaultHotelRates,
  Swat: defaultHotelRates,
};

// ---- Air Hotel Pricing ----
export const airHotelPricing: Record<AirDestination, Record<HotelCategory, HotelRate>> = {
  Hunza: premiumHotelRates,
  Astore: premiumHotelRates,
  "Fairy Meadows": premiumHotelRates,
  "Skardu & Hunza": premiumHotelRates,
};

// ---- Vehicle Pricing ----
const defaultVehicleRates: Record<VehicleType, VehicleRate> = {
  "Coaster 5c": { daily_rent: 14000, toll: 4000, fuel: 10000, seats: 21, per_day_total: 28000 },
  "Coaster 4c": { daily_rent: 14000, toll: 4000, fuel: 10000, seats: 21, per_day_total: 28000 },
  "Grand Cabin": { daily_rent: 14000, toll: 4000, fuel: 10000, seats: 12, per_day_total: 28000 },
  "Honda BRV": { daily_rent: 14000, toll: 4000, fuel: 10000, seats: 6, per_day_total: 28000 },
  "Gli Car": { daily_rent: 14000, toll: 4000, fuel: 10000, seats: 4, per_day_total: 28000 },
};

export const vehiclePricing: Record<string, Record<VehicleType, VehicleRate>> = {
  Skardu: {
    "Coaster 5c": { daily_rent: 17000, toll: 7000, fuel: 17000, seats: 21, per_day_total: 41000 },
    "Coaster 4c": { daily_rent: 16000, toll: 7000, fuel: 17000, seats: 21, per_day_total: 40000 },
    "Grand Cabin": { daily_rent: 12000, toll: 5000, fuel: 12000, seats: 12, per_day_total: 29000 },
    "Honda BRV": { daily_rent: 9000, toll: 4000, fuel: 10000, seats: 6, per_day_total: 23000 },
    "Gli Car": { daily_rent: 7000, toll: 3500, fuel: 8000, seats: 4, per_day_total: 18500 },
  },
  Hunza: defaultVehicleRates,
  "Skardu & Hunza": defaultVehicleRates,
  Astore: defaultVehicleRates,
  "Fairy Meadows": defaultVehicleRates,
  "Murree Patriata Galiyat": defaultVehicleRates,
  "Murree Ayubia Nathiagali": defaultVehicleRates,
  Naran: defaultVehicleRates,
  "Neelum Valley Kashmir": defaultVehicleRates,
  "Neelum Taobat Arang Kel": defaultVehicleRates,
  Swat: defaultVehicleRates,
};

// ---- By-Air Fixed Extras ----
export const byAirExtras: Record<string, number> = {
  "Air Ticket (Islamabad Base)": 45000,
  "Karachi Surcharge (Add-on)": 30000,
  "Welcome Pack (Per Person)": 1400,
  "Entry Tickets (Per Person)": 2500,
  "Sticker (Per Vehicle)": 600,
  "Arrival Breakfast (Per Person)": 500,
  "Guide (Per Day)": 5000,
  "Meal (Per Person/Day)": 1200,
};

// ---- Shared Optional Add-ons ----
export interface AddOn {
  id: string;
  name: string;
  pricePerUnit: number;
  unit: "per_person" | "per_day" | "per_person_per_day" | "flat";
}

export const optionalAddOns: AddOn[] = [
  { id: "guide", name: "Guide", pricePerUnit: 5000, unit: "per_day" },
  { id: "meal", name: "Meals", pricePerUnit: 1200, unit: "per_person_per_day" },
  { id: "welcome_pack", name: "Welcome Pack", pricePerUnit: 1400, unit: "per_person" },
  { id: "entry_tickets", name: "Entry Tickets", pricePerUnit: 2500, unit: "per_person" },
];

// ---- Vehicle Filtering by Seats ----
export function getAvailableVehicles(destination: string, travelers: number): { type: VehicleType; rate: VehicleRate }[] {
  const destVehicles = vehiclePricing[destination];
  if (!destVehicles) return [];
  return (Object.entries(destVehicles) as [VehicleType, VehicleRate][])
    .filter(([, rate]) => rate.seats >= travelers)
    .map(([type, rate]) => ({ type, rate }));
}

// ---- Price Calculation ----
export function calculateTripPrice(params: {
  transportMode: "By Road" | "By Air";
  destination: string;
  hotelCategory: HotelCategory;
  vehicleType: VehicleType;
  days: number;
  travelers: number;
  roomType: "twin" | "triple";
  selectedAddOns: string[];
  departure: string;
}): {
  hotelTotal: number;
  vehicleTotal: number;
  airTicketTotal: number;
  addOnsTotal: number;
  departureSurcharge: number;
  grandTotal: number;
  perPerson: number;
} {
  const { transportMode, destination, hotelCategory, vehicleType, days, travelers, roomType, selectedAddOns, departure } = params;

  // Hotel cost
  const hotelData = transportMode === "By Air"
    ? (airHotelPricing as any)[destination]
    : (roadHotelPricing as any)[destination];
  const hotelRate = hotelData?.[hotelCategory];
  const nightlyRate = roomType === "twin" ? (hotelRate?.twin_rate || 10000) : (hotelRate?.triple_rate || 12000);
  const nights = Math.max(days - 1, 1);
  const roomsNeeded = roomType === "twin" ? Math.ceil(travelers / 2) : Math.ceil(travelers / 3);
  const hotelTotal = nightlyRate * nights * roomsNeeded;

  // Vehicle cost
  const vehicleData = vehiclePricing[destination];
  const vehicle = vehicleData?.[vehicleType];
  const vehicleTotal = (vehicle?.per_day_total || 28000) * days;

  // Air ticket & departure surcharge
  let airTicketTotal = 0;
  let departureSurcharge = 0;
  if (transportMode === "By Air") {
    const baseTicket = byAirExtras["Air Ticket (Islamabad Base)"] || 45000;
    const karachiSurcharge = departure === "Karachi" ? (byAirExtras["Karachi Surcharge (Add-on)"] || 30000) : 0;
    airTicketTotal = (baseTicket + karachiSurcharge) * travelers;
  } else {
    if (departure === "Lahore") {
      departureSurcharge = lahoreSurcharge;
    }
  }

  // Add-ons cost
  let addOnsTotal = 0;
  selectedAddOns.forEach((addonId) => {
    const addon = optionalAddOns.find((a) => a.id === addonId);
    if (addon) {
      switch (addon.unit) {
        case "per_person": addOnsTotal += addon.pricePerUnit * travelers; break;
        case "per_day": addOnsTotal += addon.pricePerUnit * days; break;
        case "per_person_per_day": addOnsTotal += addon.pricePerUnit * travelers * days; break;
        case "flat": addOnsTotal += addon.pricePerUnit; break;
      }
    }
  });

  const grandTotal = hotelTotal + vehicleTotal + airTicketTotal + addOnsTotal + departureSurcharge;
  const perPerson = Math.round(grandTotal / travelers);

  return { hotelTotal, vehicleTotal, airTicketTotal, addOnsTotal, departureSurcharge, grandTotal, perPerson };
}
