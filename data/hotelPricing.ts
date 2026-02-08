import { Destination } from "./vehiclePricing";

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

export const hotelPricing: Record<Destination, Record<HotelCategory, HotelRate>> = {
  "Skardu": {
    "Deluxe (Lower)": {
      "twin_rate": 12000,
      "triple_rate": 15000
    },
    "Deluxe (Upper)": {
      "twin_rate": 15000,
      "triple_rate": 17000
    },
    "Executive": {
      "twin_rate": 19000,
      "triple_rate": 22000
    },
    "Luxury (Deluxe RM)": {
      "twin_rate": 30000,
      "triple_rate": 40000
    },
    "Luxury (Exec RM)": {
      "twin_rate": 50000,
      "triple_rate": 60000
    }
  },
  "Hunza": {
    "Deluxe (Lower)": {
      "twin_rate": 12000,
      "triple_rate": 15000
    },
    "Deluxe (Upper)": {
      "twin_rate": 15000,
      "triple_rate": 17000
    },
    "Executive": {
      "twin_rate": 19000,
      "triple_rate": 22000
    },
    "Luxury (Deluxe RM)": {
      "twin_rate": 30000,
      "triple_rate": 40000
    },
    "Luxury (Exec RM)": {
      "twin_rate": 50000,
      "triple_rate": 60000
    }
  },
  "Skardu & Hunza": {
    "Deluxe (Lower)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Deluxe (Upper)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Executive": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Luxury (Deluxe RM)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Luxury (Exec RM)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    }
  },
  "Astore": {
    "Deluxe (Lower)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Deluxe (Upper)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Executive": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Luxury (Deluxe RM)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Luxury (Exec RM)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    }
  },
  "Fairy Meadows": {
    "Deluxe (Lower)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Deluxe (Upper)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Executive": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Luxury (Deluxe RM)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Luxury (Exec RM)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    }
  },
  "Murree Patriata Galiyat": {
    "Deluxe (Lower)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Deluxe (Upper)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Executive": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Luxury (Deluxe RM)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Luxury (Exec RM)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    }
  },
  "Murree Ayubia Nathiagali": {
    "Deluxe (Lower)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Deluxe (Upper)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Executive": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Luxury (Deluxe RM)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Luxury (Exec RM)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    }
  },
  "Naran": {
    "Deluxe (Lower)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Deluxe (Upper)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Executive": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Luxury (Deluxe RM)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Luxury (Exec RM)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    }
  },
  "Neelum Valley Kashmir": {
    "Deluxe (Lower)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Deluxe (Upper)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Executive": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Luxury (Deluxe RM)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Luxury (Exec RM)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    }
  },
  "Neelum Taobat Arang Kel": {
    "Deluxe (Lower)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Deluxe (Upper)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Executive": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Luxury (Deluxe RM)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Luxury (Exec RM)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    }
  },
  "Swat": {
    "Deluxe (Lower)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Deluxe (Upper)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Executive": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Luxury (Deluxe RM)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    },
    "Luxury (Exec RM)": {
      "twin_rate": 10000,
      "triple_rate": 12000
    }
  }
};

export const hotelCategories: HotelCategory[] = [
  "Deluxe (Lower)",
  "Deluxe (Upper)",
  "Executive",
  "Luxury (Deluxe RM)",
  "Luxury (Exec RM)"
];
