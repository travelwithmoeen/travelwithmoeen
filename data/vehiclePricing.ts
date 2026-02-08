export interface VehiclePricing {
  daily_rent: number;
  toll: number;
  fuel: number;
  seats: number;
  per_day_total: number;
}

export type VehicleType = "Coaster 5c" | "Coaster 4c" | "Grand Cabin" | "Honda BRV" | "Gli Car";

export type Destination =
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

export const vehiclePricing: Record<Destination, Record<VehicleType, VehiclePricing>> = {
  "Skardu": {
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
  "Hunza": {
    "Coaster 5c": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 21,
      "per_day_total": 28000
    },
    "Coaster 4c": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 21,
      "per_day_total": 28000
    },
    "Grand Cabin": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 12,
      "per_day_total": 28000
    },
    "Honda BRV": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 28000
    },
    "Gli Car": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 4,
      "per_day_total": 28000
    }
  },
  "Skardu & Hunza": {
    "Coaster 5c": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 21,
      "per_day_total": 28000
    },
    "Coaster 4c": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 21,
      "per_day_total": 28000
    },
    "Grand Cabin": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 12,
      "per_day_total": 28000
    },
    "Honda BRV": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 28000
    },
    "Gli Car": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 4,
      "per_day_total": 28000
    }
  },
  "Astore": {
    "Coaster 5c": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 21,
      "per_day_total": 28000
    },
    "Coaster 4c": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 21,
      "per_day_total": 28000
    },
    "Grand Cabin": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 12,
      "per_day_total": 28000
    },
    "Honda BRV": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 28000
    },
    "Gli Car": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 4,
      "per_day_total": 28000
    }
  },
  "Fairy Meadows": {
    "Coaster 5c": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 21,
      "per_day_total": 28000
    },
    "Coaster 4c": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 21,
      "per_day_total": 28000
    },
    "Grand Cabin": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 12,
      "per_day_total": 28000
    },
    "Honda BRV": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 28000
    },
    "Gli Car": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 4,
      "per_day_total": 28000
    }
  },
  "Murree Patriata Galiyat": {
    "Coaster 5c": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 21,
      "per_day_total": 28000
    },
    "Coaster 4c": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 21,
      "per_day_total": 28000
    },
    "Grand Cabin": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 12,
      "per_day_total": 28000
    },
    "Honda BRV": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 28000
    },
    "Gli Car": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 4,
      "per_day_total": 28000
    }
  },
  "Murree Ayubia Nathiagali": {
    "Coaster 5c": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 21,
      "per_day_total": 28000
    },
    "Coaster 4c": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 21,
      "per_day_total": 28000
    },
    "Grand Cabin": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 12,
      "per_day_total": 28000
    },
    "Honda BRV": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 28000
    },
    "Gli Car": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 4,
      "per_day_total": 28000
    }
  },
  "Naran": {
    "Coaster 5c": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 21,
      "per_day_total": 28000
    },
    "Coaster 4c": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 21,
      "per_day_total": 28000
    },
    "Grand Cabin": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 12,
      "per_day_total": 28000
    },
    "Honda BRV": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 28000
    },
    "Gli Car": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 4,
      "per_day_total": 28000
    }
  },
  "Neelum Valley Kashmir": {
    "Coaster 5c": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 21,
      "per_day_total": 28000
    },
    "Coaster 4c": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 21,
      "per_day_total": 28000
    },
    "Grand Cabin": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 12,
      "per_day_total": 28000
    },
    "Honda BRV": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 28000
    },
    "Gli Car": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 4,
      "per_day_total": 28000
    }
  },
  "Neelum Taobat Arang Kel": {
    "Coaster 5c": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 21,
      "per_day_total": 28000
    },
    "Coaster 4c": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 21,
      "per_day_total": 28000
    },
    "Grand Cabin": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 12,
      "per_day_total": 28000
    },
    "Honda BRV": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 28000
    },
    "Gli Car": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 4,
      "per_day_total": 28000
    }
  },
  "Swat": {
    "Coaster 5c": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 21,
      "per_day_total": 28000
    },
    "Coaster 4c": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 21,
      "per_day_total": 28000
    },
    "Grand Cabin": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 12,
      "per_day_total": 28000
    },
    "Honda BRV": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 28000
    },
    "Gli Car": {
      "daily_rent": 14000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 4,
      "per_day_total": 28000
    }
  }
};

export const destinations: Destination[] = Object.keys(vehiclePricing) as Destination[];

export const vehicleTypes: VehicleType[] = [
  "Coaster 5c",
  "Coaster 4c",
  "Grand Cabin",
  "Honda BRV",
  "Gli Car"
];

export const departureCities = ["Islamabad", "Lahore"] as const;
export type DepartureCity = typeof departureCities[number];
