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
    | "Skardu Valley"
    | "Hunza Valley"
    | "Skardu & Hunza"
    | "Minimarg Astor Valley"
    | "Fairy Meadows Nanga Base Camp"
    | "Naran Kaghan & Babusar Top"
    | "Murree Ayubia Nathiagali"
    | "Murree Patriata Galiyat"
    | "Neelum Valley Kashmir"
    | "Neelum Taobat Arang Kel"
    | "Swat Kalam & Malam Jabba "
    | "Islamabad"
    | "Kumrat and Katora Lake"
     |"Naran"
    | "Kalash Valley & Chitral ";

export type AirDestination = "Skardu Valley" | "Hunza Valley" | "Skardu & Hunza" | "Minimarg Astor Valley" | "Fairy Meadows Nanga Base Camp";

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
    "Skardu Valley", "Hunza Valley", "Skardu & Hunza", "Minimarg Astor Valley", "Fairy Meadows Nanga Base Camp",
    "Naran Kaghan & Babusar Top", "Murree Ayubia Nathiagali", "Neelum Valley Kashmir",
    "Neelum Taobat Arang Kel", "Swat Kalam & Malam Jabba ", "Islamabad", "Kumrat and Katora Lake", "Kalash Valley & Chitral ",
];

// ---- Air Destinations ----
export const airDestinations: AirDestination[] = [
    "Hunza Valley", "Minimarg Astor Valley", "Fairy Meadows Nanga Base Camp", "Skardu & Hunza",
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
    "Skardu Valley": premiumHotelRates,
    "Hunza Valley": premiumHotelRates,
    "Skardu & Hunza": {
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
    "Minimarg Astor Valley": {
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
    "Fairy Meadows Nanga Base Camp": {
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
    "Skardu Valley": premiumHotelRates,
    "Hunza Valley": premiumHotelRates,
    "Skardu & Hunza": premiumHotelRates,
    "Minimarg Astor Valley": premiumHotelRates,
    "Fairy Meadows Nanga Base Camp": premiumHotelRates,
};



export const vehiclePricing: Record<
    string,
    Record<string, Record<VehicleType, VehicleRate>>
> = {
    Departure_Islamabad: {
        "Skardu Valley": {
            "Coaster 5c": {
                "daily_rent": 17000,
                "toll": 6000,
                "fuel": 16000,
                "seats": 25,
                "per_day_total": 39000
            },
            "Coaster 4c": {
                "daily_rent": 16000,
                "toll": 6000,
                "fuel": 16000,
                "seats": 25,
                "per_day_total": 38000
            },
            "Grand Cabin": {
                "daily_rent": 12000,
                "toll": 5000,
                "fuel": 11000,
                "seats": 12,
                "per_day_total": 28000
            },
            "Honda BRV": {
                "daily_rent": 9000,
                "toll": 4000,
                "fuel": 9000,
                "seats": 6,
                "per_day_total": 22000
            },
            "Gli Car": {
                "daily_rent": 7000,
                "toll": 3500,
                "fuel": 7000,
                "seats": 4,
                "per_day_total": 17500
            }
        },
        "Hunza Valley": {
            "Coaster 5c": {
                "daily_rent": 17000,
                "toll": 6000,
                "fuel": 17000,
                "seats": 25,
                "per_day_total": 40000
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
        "Skardu & Hunza": {
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
        "Minimarg Astor Valley": {
            "Coaster 5c": {
                "daily_rent": 17000,
                "toll": 6000,
                "fuel": 17000,
                "seats": 25,
                "per_day_total": 40000
            },
            "Coaster 4c": {
                "daily_rent": 16000,
                "toll": 6000,
                "fuel": 17000,
                "seats": 25,
                "per_day_total": 39000
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
        "Fairy Meadows Nanga Base Camp": {
            "Coaster 5c": {
                "daily_rent": 17000,
                "toll": 6000,
                "fuel": 17000,
                "seats": 25,
                "per_day_total": 40000
            },
            "Coaster 4c": {
                "daily_rent": 16000,
                "toll": 6000,
                "fuel": 17000,
                "seats": 25,
                "per_day_total": 39000
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
        "Murree Patriata Galiyat": {
            "Coaster 5c": {
                "daily_rent": 17000,
                "toll": 6000,
                "fuel": 15000,
                "seats": 25,
                "per_day_total": 38000
            },
            "Coaster 4c": {
                "daily_rent": 16000,
                "toll": 6000,
                "fuel": 15000,
                "seats": 25,
                "per_day_total": 37000
            },
            "Grand Cabin": {
                "daily_rent": 12000,
                "toll": 5000,
                "fuel": 10000,
                "seats": 12,
                "per_day_total": 27000
            },
            "Honda BRV": {
                "daily_rent": 9000,
                "toll": 4000,
                "fuel": 8000,
                "seats": 6,
                "per_day_total": 21000
            },
            "Gli Car": {
                "daily_rent": 7000,
                "toll": 3500,
                "fuel": 6000,
                "seats": 4,
                "per_day_total": 16500
            }
        },
        "Murree Ayubia Nathiagali": {
            "Coaster 5c": {
                "daily_rent": 17000,
                "toll": 6000,
                "fuel": 15000,
                "seats": 25,
                "per_day_total": 38000
            },
            "Coaster 4c": {
                "daily_rent": 16000,
                "toll": 6000,
                "fuel": 1500,
                "seats": 25,
                "per_day_total": 23500
            },
            "Grand Cabin": {
                "daily_rent": 12000,
                "toll": 5000,
                "fuel": 1000,
                "seats": 12,
                "per_day_total": 18000
            },
            "Honda BRV": {
                "daily_rent": 9000,
                "toll": 4000,
                "fuel": 8000,
                "seats": 6,
                "per_day_total": 21000
            },
            "Gli Car": {
                "daily_rent": 7000,
                "toll": 3500,
                "fuel": 6000,
                "seats": 4,
                "per_day_total": 16500
            }
        },
        "Naran": {
            "Coaster 5c": {
                "daily_rent": 17000,
                "toll": 6000,
                "fuel": 15000,
                "seats": 25,
                "per_day_total": 38000
            },
            "Coaster 4c": {
                "daily_rent": 16000,
                "toll": 6000,
                "fuel": 1500,
                "seats": 25,
                "per_day_total": 23500
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
                "toll": 6000,
                "fuel": 15000,
                "seats": 25,
                "per_day_total": 38000
            },
            "Coaster 4c": {
                "daily_rent": 16000,
                "toll": 6000,
                "fuel": 15000,
                "seats": 25,
                "per_day_total": 37000
            },
            "Grand Cabin": {
                "daily_rent": 12000,
                "toll": 5000,
                "fuel": 11000,
                "seats": 12,
                "per_day_total": 28000
            },
            "Honda BRV": {
                "daily_rent": 9000,
                "toll": 4000,
                "fuel": 9000,
                "seats": 6,
                "per_day_total": 22000
            },
            "Gli Car": {
                "daily_rent": 7000,
                "toll": 3500,
                "fuel": 6000,
                "seats": 4,
                "per_day_total": 16500
            }
        },
        "Neelum Taobat Arang Kel": {
            "Coaster 5c": {
                "daily_rent": 17000,
                "toll": 6000,
                "fuel": 15000,
                "seats": 25,
                "per_day_total": 38000
            },
            "Coaster 4c": {
                "daily_rent": 16000,
                "toll": 6000,
                "fuel": 1500,
                "seats": 25,
                "per_day_total": 23500
            },
            "Grand Cabin": {
                "daily_rent": 12000,
                "toll": 5000,
                "fuel": 11000,
                "seats": 12,
                "per_day_total": 28000
            },
            "Honda BRV": {
                "daily_rent": 9000,
                "toll": 4000,
                "fuel": 9000,
                "seats": 6,
                "per_day_total": 22000
            },
            "Gli Car": {
                "daily_rent": 7000,
                "toll": 3500,
                "fuel": 6000,
                "seats": 4,
                "per_day_total": 16500
            }
        },
        "Swat": {
            "Coaster 5c": {
                "daily_rent": 17000,
                "toll": 6000,
                "fuel": 17000,
                "seats": 25,
                "per_day_total": 40000
            },
            "Coaster 4c": {
                "daily_rent": 16000,
                "toll": 6000,
                "fuel": 17000,
                "seats": 25,
                "per_day_total": 39000
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
        "Islamabad": {
            "Coaster 5c": {
                "daily_rent": 17000,
                "toll": 2000,
                "fuel": 8000,
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
                "fuel": 6000,
                "seats": 12,
                "per_day_total": 19000
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
        "Kalash Valley & Chitral": {
            "Coaster 5c": {
                "daily_rent": 17000,
                "toll": 6000,
                "fuel": 17000,
                "seats": 25,
                "per_day_total": 40000
            },
            "Coaster 4c": {
                "daily_rent": 16000,
                "toll": 6000,
                "fuel": 17000,
                "seats": 25,
                "per_day_total": 39000
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
        "Kumrat and Katora Lake": {
            "Coaster 5c": {
                "daily_rent": 17000,
                "toll": 6000,
                "fuel": 17000,
                "seats": 25,
                "per_day_total": 40000
            },
            "Coaster 4c": {
                "daily_rent": 16000,
                "toll": 6000,
                "fuel": 17000,
                "seats": 25,
                "per_day_total": 39000
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
        }
    },

    Departure_Lahore: {
  "Skardu Valley": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 7000,
      "fuel": 20000,
      "seats": 25,
      "per_day_total": 44000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 7000,
      "fuel": 20000,
      "seats": 25,
      "per_day_total": 43000
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
  "Hunza Valley": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 7000,
      "fuel": 18000,
      "seats": 25,
      "per_day_total": 42000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 7000,
      "fuel": 18000,
      "seats": 25,
      "per_day_total": 41000
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
      "fuel": 22000,
      "seats": 25,
      "per_day_total": 46000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 7000,
      "fuel": 22000,
      "seats": 25,
      "per_day_total": 45000
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
  "Minimarg Astor Valley": {
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
  "Fairy Meadows Nanga Base Camp": {
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
  "Murree Patriata Galiyat": {
    "Coaster 5c": {
      "daily_rent": 20000,
      "toll": 5000,
      "fuel": 60000,
      "seats": 25,
      "per_day_total": 85000
    },
    "Coaster 4c": {
      "daily_rent": 20000,
      "toll": 5000,
      "fuel": 60000,
      "seats": 25,
      "per_day_total": 85000
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
      "daily_rent": 20000,
      "toll": 5000,
      "fuel": 60000,
      "seats": 25,
      "per_day_total": 85000
    },
    "Coaster 4c": {
      "daily_rent": 20000,
      "toll": 5000,
      "fuel": 60000,
      "seats": 25,
      "per_day_total": 85000
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
  "Naran": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 5000,
      "fuel": 25000,
      "seats": 25,
      "per_day_total": 47000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 5000,
      "fuel": 25000,
      "seats": 25,
      "per_day_total": 46000
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
      "toll": 5000,
      "fuel": 25000,
      "seats": 25,
      "per_day_total": 47000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 5000,
      "fuel": 25000,
      "seats": 25,
      "per_day_total": 46000
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
      "toll": 5000,
      "fuel": 25000,
      "seats": 25,
      "per_day_total": 47000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 5000,
      "fuel": 25000,
      "seats": 25,
      "per_day_total": 46000
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
  "Swat": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 5000,
      "fuel": 25000,
      "seats": 25,
      "per_day_total": 47000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 5000,
      "fuel": 25000,
      "seats": 25,
      "per_day_total": 46000
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
  "Islamabad": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 5000,
      "fuel": 20000,
      "seats": 25,
      "per_day_total": 42000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 5000,
      "fuel": 20000,
      "seats": 25,
      "per_day_total": 41000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 1000,
      "fuel": 6000,
      "seats": 12,
      "per_day_total": 19000
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
  "Kalash Valley & Chitral": {
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
  "Kumrat and Katora Lake": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 5000,
      "fuel": 25000,
      "seats": 25,
      "per_day_total": 47000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 5000,
      "fuel": 25000,
      "seats": 25,
      "per_day_total": 46000
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
  }
}
};


// ---- By-Air Fixed Extras ----
export const byAirExtras: Record<string, number> = {
    "Air Ticket (Islamabad Base)": 50000,
    "Karachi Surcharge (Add-on)": 40000,
    "Lahore Surcharge (Add-on)": 30000,
    "Welcome Pack (Per Person)": 1400,
    "Entry Tickets (Per Person)": 2500,
    "Sticker (Per Vehicle)": 600,
    "Arrival Breakfast (Per Person)": 500,
    "Guide (Per Day)": 5000,
    "Meal (Per Person/Day)": 1200,
};

// ---- By-Air Traveler Type Pricing ----
export const infantLapPrice = 1000;      // Fixed price, no seat
export const infantOwnSeatPrice = 5000;  // Fixed price, consumes 1 seat
export const childFarePercent = 0.75;    // 75% of adult fare, consumes 1 seat

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
export function getAvailableVehicles(departure: string, destination: string, travelers: number): { type: VehicleType; rate: VehicleRate }[] {
    const departureKey = `Departure_${departure}`;
    const departureVehicles = vehiclePricing[departureKey];
    if (!departureVehicles) return [];
    const destVehicles = departureVehicles[destination];
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
    // By Air traveler types (optional, only used for By Air mode)
    adults?: number;
    children?: number;
    infantLap?: number;
    infantOwnSeat?: number;
}): {
    hotelTotal: number;
    vehicleTotal: number;
    airTicketTotal: number;
    addOnsTotal: number;
    departureSurcharge: number;
    grandTotal: number;
    perPerson: number;
    // Breakdown for By Air traveler types
    adultTicketTotal?: number;
    childTicketTotal?: number;
    infantLapTotal?: number;
    infantOwnSeatTotal?: number;
} {
    const { transportMode, destination, hotelCategory, vehicleType, days, travelers, roomType, selectedAddOns, departure } = params;

    // For By Air mode, use traveler type counts; for By Road, use travelers
    const adultCount = params.adults ?? travelers;
    const childCount = params.children ?? 0;
    const infantLapCount = params.infantLap ?? 0;
    const infantOwnSeatCount = params.infantOwnSeat ?? 0;

    // Total people for add-ons (includes everyone)
    const totalPeople = transportMode === "By Air"
        ? adultCount + childCount + infantLapCount + infantOwnSeatCount
        : travelers;

    // Seats needed for rooms (infant lap doesn't need seat/room space)
    const seatsForRooms = transportMode === "By Air"
        ? adultCount + childCount + infantOwnSeatCount
        : travelers;

    // Hotel cost
    const hotelData = transportMode === "By Air"
        ? (airHotelPricing as any)[destination]
        : (roadHotelPricing as any)[destination];
    const hotelRate = hotelData?.[hotelCategory];
    const nightlyRate = roomType === "twin" ? (hotelRate?.twin_rate || 10000) : (hotelRate?.triple_rate || 12000);
    const nights = Math.max(days - 1, 1);
    const roomsNeeded = roomType === "twin" ? Math.ceil(seatsForRooms / 2) : Math.ceil(seatsForRooms / 3);
    const hotelTotal = nightlyRate * nights * roomsNeeded;

    // Vehicle cost
    // cost_per_day = rent + fuel, total = (cost_per_day * days) + toll (toll is one-time)
    const departureKey = `Departure_${departure}`;
    const departureVehicles = vehiclePricing[departureKey];
    const vehicleData = departureVehicles?.[destination];
    const vehicle = vehicleData?.[vehicleType];
    const dailyRent = vehicle?.daily_rent || 14000;
    const fuel = vehicle?.fuel || 10000;
    const toll = vehicle?.toll || 4000;
    const costPerDay = dailyRent + fuel;
    const vehicleTotal = (costPerDay * days) + toll;

    // Air ticket & departure surcharge
    let airTicketTotal = 0;
    let departureSurcharge = 0;
    let adultTicketTotal = 0;
    let childTicketTotal = 0;
    let infantLapTotal = 0;
    let infantOwnSeatTotal = 0;

    if (transportMode === "By Air") {
        const baseTicket = byAirExtras["Air Ticket (Islamabad Base)"] || 45000;
        const karachiSurcharge = departure === "Karachi" ? (byAirExtras["Karachi Surcharge (Add-on)"] || 30000) : 0;
        const adultFare = baseTicket + karachiSurcharge;

        // Adult: 100% fare
        adultTicketTotal = adultFare * adultCount;
        // Child (2-11): 75% of adult fare
        childTicketTotal = Math.round(adultFare * childFarePercent) * childCount;
        // Infant (Lap): Fixed 1000 PKR
        infantLapTotal = infantLapPrice * infantLapCount;
        // Infant (Own Seat): Fixed 5000 PKR
        infantOwnSeatTotal = infantOwnSeatPrice * infantOwnSeatCount;

        airTicketTotal = adultTicketTotal + childTicketTotal + infantLapTotal + infantOwnSeatTotal;
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
                case "per_person": addOnsTotal += addon.pricePerUnit * totalPeople; break;
                case "per_day": addOnsTotal += addon.pricePerUnit * days; break;
                case "per_person_per_day": addOnsTotal += addon.pricePerUnit * totalPeople * days; break;
                case "flat": addOnsTotal += addon.pricePerUnit; break;
            }
        }
    });

    const subtotal = hotelTotal + vehicleTotal + airTicketTotal + addOnsTotal + departureSurcharge;
    const profitAmount = Math.round(subtotal * profitMargin);
    const grandTotal = subtotal + profitAmount;
    const perPerson = totalPeople > 0 ? Math.round(grandTotal / totalPeople) : 0;

    return {
        hotelTotal, vehicleTotal, airTicketTotal, addOnsTotal, departureSurcharge, grandTotal, perPerson,
        adultTicketTotal, childTicketTotal, infantLapTotal, infantOwnSeatTotal
    };
}
