import {
  roadHotelPricing,
  airHotelPricing,
  vehiclePricing,
  vehiclePricingByAir,
  profitMargin,
  HotelCategory,
  RoadDestination,
  AirDestination,
  VehicleType,
  getRecommendedVehicle,
} from "@/data/pricing";
import { TourRegion, TransportType, TourCategory } from "@/data/tours";

// Arrival breakfast price per person (for By Road tours > 1 day)
const ARRIVAL_BREAKFAST_PER_PERSON = 500;

// Map TourCategory to HotelCategory
function mapToHotelCategory(category: TourCategory): HotelCategory | null {
  const categoryMap: Record<string, HotelCategory> = {
    "Deluxe": "Deluxe",
    "deluxe_lower": "Deluxe",
    "Deluxe_higher": "Deluxe",
    "deluxe_higher": "Deluxe",
    "Deluxe Higher": "Deluxe",
    "Premier": "Premier",
    "Executive": "Executive",
    "executive": "Executive",
    "executive_higher": "Executive",
    "Luxury": "Luxury",
    "luxury_higher": "Luxury",
    "luxury_lower": "Luxury",
    "Luxury Higher": "Luxury",
    "Ultra Luxury": "Ultra Luxury",
  };
  return categoryMap[category] || null;
}

// Get vehicle type for 2 persons (couple package)
function getVehicleForCouple(transportMode: TransportType): VehicleType {
  return getRecommendedVehicle(2, transportMode === "By Road" ? "By Road" : "By Air");
}

export interface PackagePriceResult {
  hotelTotal: number;
  vehicleTotal: number;
  arrivalBreakfastTotal: number;
  subtotal: number;
  profitAmount: number;
  totalForTwo: number;
  perPerson: number;
  vehicleType: VehicleType;
  hotelName?: string;
}

export function calculatePackagePrice(
  region: TourRegion,
  category: TourCategory,
  duration: number,
  transport: TransportType,
  departure: string = "Islamabad"
): PackagePriceResult | null {
  // Map category to hotel category
  const hotelCategory = mapToHotelCategory(category);
  if (!hotelCategory) {
    return null;
  }

  // Get hotel pricing based on transport mode
  const hotelData = transport === "By Air"
    ? (airHotelPricing as Record<string, Record<HotelCategory, { twin_rate: number; triple_rate: number; hotel_name?: string }>>)[region]
    : (roadHotelPricing as Record<string, Record<HotelCategory, { twin_rate: number; triple_rate: number; hotel_name?: string }>>)[region];

  if (!hotelData || !hotelData[hotelCategory]) {
    return null;
  }

  const hotelRate = hotelData[hotelCategory];
  const nights = duration > 1 ? duration - 1 : 0;

  // For 2 persons sharing twin room, we need 1 room
  const roomsNeeded = 1;
  const hotelTotal = hotelRate.twin_rate * nights * roomsNeeded;

  // Get vehicle pricing
  const vehicleType = getVehicleForCouple(transport);
  let vehicleTotal = 0;

  if (transport === "By Air") {
    const destVehicles = vehiclePricingByAir[region as AirDestination];
    const vehicle = destVehicles?.[vehicleType];
    if (vehicle) {
      // cost_per_day = rent + fuel, total = (cost_per_day * days) + toll
      const costPerDay = vehicle.daily_rent + vehicle.fuel;
      vehicleTotal = (costPerDay * duration) + vehicle.toll;
    }
  } else {
    const departureKey = `Departure_${departure}`;
    const departureVehicles = vehiclePricing[departureKey];
    const destVehicles = departureVehicles?.[region as RoadDestination];
    const vehicle = destVehicles?.[vehicleType];
    if (vehicle) {
      const costPerDay = vehicle.daily_rent + vehicle.fuel;
      vehicleTotal = (costPerDay * duration) + vehicle.toll;
    }
  }

  // Calculate arrival breakfast for By Road tours > 1 day (500 per person * 2 persons)
  let arrivalBreakfastTotal = 0;
  if (transport === "By Road" && duration > 1) {
    arrivalBreakfastTotal = ARRIVAL_BREAKFAST_PER_PERSON * 2; // 2 persons
  }

  // Calculate totals (arrival breakfast added before profit margin)
  const subtotal = hotelTotal + vehicleTotal + arrivalBreakfastTotal;
  const profitAmount = Math.round(subtotal * profitMargin);
  const totalForTwo = subtotal + profitAmount;
  const perPerson = Math.round(totalForTwo / 2);

  return {
    hotelTotal,
    vehicleTotal,
    arrivalBreakfastTotal,
    subtotal,
    profitAmount,
    totalForTwo,
    perPerson,
    vehicleType,
    hotelName: hotelRate.hotel_name,
  };
}

// Get vehicle display name
export function getVehicleDisplayName(vehicleType: VehicleType): string {
  const displayNames: Record<VehicleType, string> = {
    "Gli Car": "GLI Car New Model",
    "Honda BRV": "Honda BRV",
    "Grand Cabin": "Grand Cabin New Model",
    "Coaster 4c": "Coaster 4C",
    "Coaster 5c": "Coaster 5C",
    "Parado": "Parado TZ",
  };
  return displayNames[vehicleType] || vehicleType;
}
