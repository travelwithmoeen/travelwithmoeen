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
  | "Islamabad"
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
  "Neelum Valley Kashmir", "Neelum Taobat Arang Kel", "Swat","Islamabad",
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
  "Skardu & Hunza":{
    "Deluxe (Lower)": {
      "twin_rate": 12000,
      "triple_rate": 15000
    },
    "Deluxe (Upper)": {
      "twin_rate": 13000,
      "triple_rate": 16000
    },
    "Executive": {
      "twin_rate": 19000,
      "triple_rate": 22000
    },
    "Luxury (Deluxe RM)": {
      "twin_rate": 24000,
      "triple_rate": 30000
    },
    "Luxury (Exec RM)": {
      "twin_rate": 30000,
      "triple_rate": 40000
    }
  },
  Astore: {
    "Deluxe (Lower)": {
      "twin_rate": 15000,
      "triple_rate": 17000
    },
    "Deluxe (Upper)": {
      "twin_rate": 19000,
      "triple_rate": 22000
    },
    "Executive": {
      "twin_rate": 20000,
      "triple_rate": 23000
    },
    "Luxury (Deluxe RM)": {
      "twin_rate": 30000,
      "triple_rate": 35000
    },
    "Luxury (Exec RM)": {
      "twin_rate": 35000,
      "triple_rate": 38000
    }
  },
  "Fairy Meadows": {
    "Deluxe (Lower)": {
      "twin_rate": 15000,
      "triple_rate": 17000
    },
    "Deluxe (Upper)": {
      "twin_rate": 16000,
      "triple_rate": 18000
    },
    "Executive": {
      "twin_rate": 20000,
      "triple_rate": 23000
    },
    "Luxury (Deluxe RM)": {
      "twin_rate": 30000,
      "triple_rate": 35000
    },
    "Luxury (Exec RM)": {
      "twin_rate": 32000,
      "triple_rate": 35000
    }
  },
  "Murree Patriata Galiyat": {
    "Deluxe (Lower)": {
      "twin_rate": 12000,
      "triple_rate": 15000
    },
    "Deluxe (Upper)": {
      "twin_rate": 13000,
      "triple_rate": 16000
    },
    "Executive": {
      "twin_rate": 25000,
      "triple_rate": 30000
    },
    "Luxury (Deluxe RM)": {
      "twin_rate": 27000,
      "triple_rate": 33000
    },
    "Luxury (Exec RM)": {
      "twin_rate": 30000,
      "triple_rate": 36000
    }
  },
  "Murree Ayubia Nathiagali": {
    "Deluxe (Lower)": {
      "twin_rate": 15000,
      "triple_rate": 18000
    },
    "Deluxe (Upper)": {
      "twin_rate": 16000,
      "triple_rate": 17000
    },
    "Executive": {
      "twin_rate": 22000,
      "triple_rate": 25000
    },
    "Luxury (Deluxe RM)": {
      "twin_rate": 30000,
      "triple_rate": 35000
    },
    "Luxury (Exec RM)": {
      "twin_rate": 35000,
      "triple_rate": 38000
    }
  },
  Naran: {
    "Deluxe (Lower)": {
      "twin_rate": 15000,
      "triple_rate": 18000
    },
    "Deluxe (Upper)": {
      "twin_rate": 19000,
      "triple_rate": 22000
    },
    "Executive": {
      "twin_rate": 21000,
      "triple_rate": 23000
    },
    "Luxury (Deluxe RM)": {
      "twin_rate": 23000,
      "triple_rate": 25000
    },
    "Luxury (Exec RM)": {
      "twin_rate": 25000,
      "triple_rate": 27000
    }
  },
  "Neelum Valley Kashmir": {
    "Deluxe (Lower)": {
      "twin_rate": 6000,
      "triple_rate": 8000
    },
    "Deluxe (Upper)": {
      "twin_rate": 9000,
      "triple_rate": 12000
    },
    "Executive": {
      "twin_rate": 12000,
      "triple_rate": 15000
    },
    "Luxury (Deluxe RM)": {
      "twin_rate": 17000,
      "triple_rate": 20000
    },
    "Luxury (Exec RM)": {
      "twin_rate": 25000,
      "triple_rate": 30000
    }
  },
  "Neelum Taobat Arang Kel": {
    "Deluxe (Lower)": {
      "twin_rate": 6000,
      "triple_rate": 8000
    },
    "Deluxe (Upper)": {
      "twin_rate": 9000,
      "triple_rate": 12000
    },
    "Executive": {
      "twin_rate": 12000,
      "triple_rate": 15000
    },
    "Luxury (Deluxe RM)": {
      "twin_rate": 17000,
      "triple_rate": 20000
    },
    "Luxury (Exec RM)": {
      "twin_rate": 25000,
      "triple_rate": 30000
    }
  },
  Swat: {
    "Deluxe (Lower)": {
      "twin_rate": 9000,
      "triple_rate": 12000
    },
    "Deluxe (Upper)": {
      "twin_rate": 12000,
      "triple_rate": 15000
    },
    "Executive": {
      "twin_rate": 18000,
      "triple_rate": 21000
    },
    "Luxury (Deluxe RM)": {
      "twin_rate": 22000,
      "triple_rate": 24000
    },
    "Luxury (Exec RM)": {
      "twin_rate": 25000,
      "triple_rate": 32000
    }
  },
    Islamabad: {
    "Deluxe (Lower)": {
      "twin_rate": 15000,
      "triple_rate": 20000
    },
    "Deluxe (Upper)": {
      "twin_rate": 23000,
      "triple_rate": 27000
    },
    "Executive": {
      "twin_rate": 35000,
      "triple_rate": 40000
    },
    "Luxury (Deluxe RM)": {
      "twin_rate": 30000,
      "triple_rate": 33000
    },
    "Luxury (Exec RM)": {
      "twin_rate": 35000,
      "triple_rate": 40000
    }
  },
};

// ---- Air Hotel Pricing ----
export const airHotelPricing: Record<AirDestination, Record<HotelCategory, HotelRate>> = {
  Hunza: premiumHotelRates,
  Astore: premiumHotelRates,
  "Fairy Meadows": premiumHotelRates,
  "Skardu & Hunza": premiumHotelRates,
};



export const vehiclePricing: Record<string, Record<VehicleType, VehicleRate>> = {
  Skardu: {
    "Coaster 5c": { daily_rent: 17000, toll: 7000, fuel: 17000, seats: 21, per_day_total: 41000 },
    "Coaster 4c": { daily_rent: 16000, toll: 7000, fuel: 17000, seats: 21, per_day_total: 40000 },
    "Grand Cabin": { daily_rent: 12000, toll: 5000, fuel: 12000, seats: 12, per_day_total: 29000 },
    "Honda BRV": { daily_rent: 9000, toll: 4000, fuel: 10000, seats: 6, per_day_total: 23000 },
    "Gli Car": { daily_rent: 7000, toll: 3500, fuel: 8000, seats: 4, per_day_total: 18500 },
  },
  Hunza: {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 7000,
      "fuel": 17000,
      "seats": 21,
      "per_day_total": 41000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 7000,
      "fuel": 17000,
      "seats": 21,
      "per_day_total": 40000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 5000,
      "fuel": 12000,
      "seats": 12,
      "per_day_total": 29000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 23000
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 3500,
      "fuel": 8000,
      "seats": 4,
      "per_day_total": 18500
    }
  },
  "Skardu & Hunza": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 7000,
      "fuel": 170000,
      "seats": 25,
      "per_day_total": 41000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 7000,
      "fuel": 17000,
      "seats": 25,
      "per_day_total": 40000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 5000,
      "fuel": 12000,
      "seats": 12,
      "per_day_total": 29000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 23000
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 3500,
      "fuel": 8000,
      "seats": 4,
      "per_day_total": 28000
    }
  },
  Astore: {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 7000,
      "fuel": 170000,
      "seats": 25,
      "per_day_total": 41000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 7000,
      "fuel": 17000,
      "seats": 25,
      "per_day_total": 40000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 5000,
      "fuel": 12000,
      "seats": 12,
      "per_day_total": 29000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 23000
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 3500,
      "fuel": 8000,
      "seats": 4,
      "per_day_total": 18500
    }
  },
  "Fairy Meadows": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 7000,
      "fuel": 17000,
      "seats": 25,
      "per_day_total": 41000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 7000,
      "fuel": 17000,
      "seats": 25,
      "per_day_total": 40000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 5000,
      "fuel": 12000,
      "seats": 12,
      "per_day_total": 29000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 23000
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 3500,
      "fuel": 8000,
      "seats": 4,
      "per_day_total": 28000
    }
  },
  "Murree Patriata Galiyat": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 7000,
      "fuel": 17000,
      "seats": 25,
      "per_day_total": 41000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 7000,
      "fuel": 17000,
      "seats": 25,
      "per_day_total": 40000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 5000,
      "fuel": 12000,
      "seats": 12,
      "per_day_total": 29000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 23000
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 3500,
      "fuel": 8000,
      "seats": 4,
      "per_day_total": 18500
    }
  },
  "Murree Ayubia Nathiagali": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 7000,
      "fuel": 17000,
      "seats": 25,
      "per_day_total": 41000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 7000,
      "fuel": 17000,
      "seats": 25,
      "per_day_total": 40000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 5000,
      "fuel": 12000,
      "seats": 12,
      "per_day_total": 29000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 23000
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 3500,
      "fuel": 8000,
      "seats": 4,
      "per_day_total": 18500
    }
  },
  Naran: {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 7000,
      "fuel": 17000,
      "seats": 25,
      "per_day_total": 41000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 7000,
      "fuel": 17000,
      "seats": 25,
      "per_day_total": 40000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 5000,
      "fuel": 12000,
      "seats": 12,
      "per_day_total": 29000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 23000
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 3500,
      "fuel": 8000,
      "seats": 4,
      "per_day_total": 18500
    }
  },
  "Neelum Valley Kashmir": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 7000,
      "fuel": 17000,
      "seats": 25,
      "per_day_total": 41000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 7000,
      "fuel": 17000,
      "seats": 25,
      "per_day_total": 40000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 5000,
      "fuel": 12000,
      "seats": 12,
      "per_day_total": 29000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 23000
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 3500,
      "fuel": 8000,
      "seats": 4,
      "per_day_total": 18500
    }
  },
  "Neelum Taobat Arang Kel": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 7000,
      "fuel": 17000,
      "seats": 25,
      "per_day_total": 41000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 7000,
      "fuel": 17000,
      "seats": 25,
      "per_day_total": 40000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 5000,
      "fuel": 12000,
      "seats": 12,
      "per_day_total": 29000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 23000
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 3500,
      "fuel": 8000,
      "seats": 4,
      "per_day_total": 18500
    }
  },
  Swat: {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 7000,
      "fuel": 17000,
      "seats": 25,
      "per_day_total": 41000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 7000,
      "fuel": 17000,
      "seats": 25,
      "per_day_total": 40000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 5000,
      "fuel": 12000,
      "seats": 12,
      "per_day_total": 29000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 23000
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 3500,
      "fuel": 8000,
      "seats": 4,
      "per_day_total": 18500
    }
  },
  Islamabad: {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 2000,
      "fuel":8000,
      "seats": 25,
      "per_day_total": 27000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 2000,
      "fuel": 8000,
      "seats": 25,
      "per_day_total": 26000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 1000,
      "fuel": 8000,
      "seats": 12,
      "per_day_total": 21000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 500,
      "fuel": 4000,
      "seats": 6,
      "per_day_total": 13500
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 500,
      "fuel": 3000,
      "seats": 4,
      "per_day_total": 10500
    }
  },
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

// Road-only add-ons (Arrival Breakfast is default selected for By Road)
export const roadOnlyAddOns: AddOn[] = [
  { id: "arrival_breakfast", name: "Arrival Breakfast", pricePerUnit: 500, unit: "per_person" },
];

// Profit margin percentage
export const profitMargin = 0.20; // 20%

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
  // cost_per_day = rent + fuel, total = (cost_per_day * days) + toll (toll is one-time)
  const vehicleData = vehiclePricing[destination];
  const vehicle = vehicleData?.[vehicleType];
  const dailyRent = vehicle?.daily_rent || 14000;
  const fuel = vehicle?.fuel || 10000;
  const toll = vehicle?.toll || 4000;
  const costPerDay = dailyRent + fuel;
  const vehicleTotal = (costPerDay * days) + toll;

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

  // Add-ons cost (check both common and road-only add-ons)
  let addOnsTotal = 0;
  const allAddOns = [...optionalAddOns, ...roadOnlyAddOns];
  selectedAddOns.forEach((addonId) => {
    const addon = allAddOns.find((a) => a.id === addonId);
    if (addon) {
      switch (addon.unit) {
        case "per_person": addOnsTotal += addon.pricePerUnit * travelers; break;
        case "per_day": addOnsTotal += addon.pricePerUnit * days; break;
        case "per_person_per_day": addOnsTotal += addon.pricePerUnit * travelers * days; break;
        case "flat": addOnsTotal += addon.pricePerUnit; break;
      }
    }
  });

  const subtotal = hotelTotal + vehicleTotal + airTicketTotal + addOnsTotal + departureSurcharge;
  const profitAmount = Math.round(subtotal * profitMargin);
  const grandTotal = subtotal + profitAmount;
  const perPerson = Math.round(grandTotal / travelers);

  return { hotelTotal, vehicleTotal, airTicketTotal, addOnsTotal, departureSurcharge, grandTotal, perPerson };
}
