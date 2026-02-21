// ============================================================
// Tour Package Pricing Data
// ============================================================

export interface HotelRate {
    twin_rate: number;
    triple_rate: number;
    hotel_name?: string; // Optional field to store hotel name for reference
}

export type HotelCategory =
    | "Deluxe"
    | "Premier"
    | "Executive"
    | "Luxury"
    | "Ultra Luxury";

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
    | "Swat Kalam & Malam Jabba"
    | "Islamabad"
    | "Kumrat and Katora Lake"
    | "Kalash Valley & Chitral"
   

export type AirDestination = "Skardu Valley" | "Hunza Valley" | "Skardu & Hunza" | "Minimarg Astor Valley" | "Fairy Meadows Nanga Base Camp";

export type Destination = RoadDestination | AirDestination;

export type VehicleType = "Coaster 5c" | "Coaster 4c" | "Grand Cabin" | "Honda BRV" | "Gli Car" | "Parado";

export interface VehicleRate {
    daily_rent: number;
    toll: number;
    fuel: number;
    seats: number;
    per_day_total: number;
}

// ---- Hotel Categories ----
export const hotelCategories: HotelCategory[] = [
    "Deluxe",
    "Premier",
    "Executive",
    "Luxury",
    "Ultra Luxury",
];

// ---- Road Destinations ----
export const roadDestinations: RoadDestination[] = [
    "Skardu Valley", "Hunza Valley", "Skardu & Hunza", "Minimarg Astor Valley", "Fairy Meadows Nanga Base Camp",
    "Naran Kaghan & Babusar Top", "Murree Ayubia Nathiagali", "Neelum Valley Kashmir",
    "Neelum Taobat Arang Kel", "Swat Kalam & Malam Jabba", "Islamabad", "Kumrat and Katora Lake", "Kalash Valley & Chitral",
   
];
// testing purposes
// ---- Air Destinations ----
export const airDestinations: AirDestination[] = [
   "Skardu Valley", "Hunza Valley", "Minimarg Astor Valley", "Fairy Meadows Nanga Base Camp", "Skardu & Hunza",
];

// ---- Vehicle Types ----
export const vehicleTypes: VehicleType[] = [
    "Coaster 5c", "Coaster 4c", "Grand Cabin", "Honda BRV", "Gli Car",
];

// ---- Departure Cities ----
export type RoadDeparture = "Islamabad" | "Lahore" | "Karachi";
export type AirDeparture = "Islamabad" | "Karachi" | "Lahore";

export const roadDepartures: RoadDeparture[] = ["Islamabad", "Lahore", "Karachi"];
export const airDepartures: AirDeparture[] = ["Islamabad", "Karachi", "Lahore"];

export const lahoreSurcharge = 15000; // flat per-trip surcharge for Lahore departure
export const lahoreChallanPerDay = 5000; // Lahore challan: 5000 flat (one-time) if trip > 3 days

// ---- Meal Pricing per Person per Night ----
export const mealPricingPerNight: Record<HotelCategory, number> = {
    "Deluxe": 1200,
    "Premier": 1500,
    "Executive": 2000,
    "Luxury": 2500,
    "Ultra Luxury": 3000,
};

// ---- Vehicle Selection Rules ----
// By Road: 1-4 GLI, 5-6 Honda BRV, 6-12 Grand Cabin, 13-25 Coaster
// By Air: 1-4 GLI, 4-5 Prado, 6-12 Grand Cabin, 13-25 Coaster

export function getRecommendedVehicle(travelers: number, transportMode: "By Road" | "By Air"): VehicleType {
    if (transportMode === "By Air") {
        if (travelers <= 4) return "Gli Car";
        if (travelers <= 5) return "Parado";
        if (travelers <= 12) return "Grand Cabin";
        return "Coaster 4c";
    } else {
        // By Road
        if (travelers <= 4) return "Gli Car";
        if (travelers <= 6) return "Honda BRV";
        if (travelers <= 12) return "Grand Cabin";
        if (travelers <= 20) return "Coaster 4c";
        return "Coaster 5c";
    }
}

// ---- Guide Rules ----
// Guide is compulsory for Coaster vehicles, optional for others
export function isGuideCompulsory(vehicleType: VehicleType): boolean {
    return vehicleType === "Coaster 4c" || vehicleType === "Coaster 5c";
}

// ---- Minimum Days Rules ----
export const roadMinimumDays: Record<RoadDestination, number> = {
    "Skardu Valley": 6,
    "Hunza Valley": 5,
    "Skardu & Hunza": 8,
    "Minimarg Astor Valley": 6,
    "Fairy Meadows Nanga Base Camp": 5,
    "Naran Kaghan & Babusar Top": 3,
    "Murree Ayubia Nathiagali": 2,
    "Murree Patriata Galiyat": 2,
    "Neelum Valley Kashmir": 3,
    "Neelum Taobat Arang Kel": 4,
    "Swat Kalam & Malam Jabba": 3,
    "Islamabad": 1,
    "Kumrat and Katora Lake": 4,
    "Kalash Valley & Chitral": 6,

};

export const airMinimumDays: Record<AirDestination, number> = {
    "Skardu Valley": 4,
    "Hunza Valley": 5,
    "Skardu & Hunza": 6,
    "Minimarg Astor Valley": 5,
    "Fairy Meadows Nanga Base Camp": 5,
};

// Helper function to get minimum days for a destination
export function getMinimumDays(destination: string, transportMode: "By Road" | "By Air"): number {
    if (transportMode === "By Air") {
        return airMinimumDays[destination as AirDestination] ?? 2;
    }
    return roadMinimumDays[destination as RoadDestination] ?? 2;
}



export const roadHotelPricing: Record<RoadDestination, Record<HotelCategory, HotelRate>> = {
  "Skardu Valley": {
    "Deluxe": {
      "twin_rate": 10000,
      "triple_rate": 13000,
      "hotel_name": "Tarangfa Lodges Chilas or Indus Hotel / Hotel Himalaya / Al Noor Starlet Hotel / Dirleh Resort / (Deluxe room) / Demanchi Naran Valley"
    },
    "Premier": {
      "twin_rate": 13000,
      "triple_rate": 15000,
      "hotel_name": "Grace Continental Chilas / Tibet / Hotel Himalaya (Executive room)  / Qayyam Skardu / Hotel Home Naran"
    },
    "Executive": {
      "twin_rate": 19000,
      "triple_rate": 22000,
      "hotel_name": "Grace Continental Chilas  / Khar Resort  Skardu / Guman resort / PC Lagacy/ Rivage Resort Skardu / The Sarai Hotel & Resort Naran"
    },
    "Luxury": {
      "twin_rate": 30000,
      "triple_rate": 40000,
      "hotel_name": "Shangrila Hotel Chilas /  Khoj Resorts (Deluxe room) or Rivage Resort Skardu (Executive rooms) / Northern Retreat by Hotel Demanchi"
    },
    "Ultra Luxury": {
      "twin_rate": 50000,
      "triple_rate": 60000,
      "hotel_name": "Shangrila Hotel Chilas / Shangrila (Executive Room) / Himmel by Luxus (Deluxe room) /Khoj Resorts (River view loft villa) / Swiss Rock Hotel & Resort"
    }
  },
  "Hunza Valley": {
    "Deluxe": {
      "twin_rate": 10000,
      "triple_rate": 13000,
      "hotel_name": "Tarangfa Lodges Chilas or Indus Hotel / Shaheen Resort Hunza (SRH)  / Hunza Blossom In / Karakuram Hotel / Hotel Himalaya (Deluxe room Hunza ) / Demanchi Hotel Naran"
    },
    "Premier": {
      "twin_rate": 13000,
      "triple_rate": 15000,
      "hotel_name": "Grace Continental Chilas / Qayam Resort Hunza / Roomy Dastan/ Hunza  Qayyam Skardu (Skardu) / Hotel Home Naran"
    },
    "Executive": {
      "twin_rate": 19000,
      "triple_rate": 22000,
      "hotel_name": "Grace Continental Chilas / Hard Rock Hunza Resort / Best Western/ Villas Roomy Resort / Khar Resort Hunza / The Sarai Hotel & Resort Naran"
    },
    "Luxury": {
      "twin_rate": 30000,
      "triple_rate": 40000,
      "hotel_name": "Shangrila Hotel Chilas / Horizon Resort Attabad Lake (Deluxe room) or Offto Resort Hunza / Northern Retreat by Hotel Demanchi"
    },
    "Ultra Luxury": {
      "twin_rate": 50000,
      "triple_rate": 60000,
      "hotel_name": "Shangrila Hotel Chilas / Best Western / Darbar Hotel / Hunza Serena Hotel  (Hunza)/ PC Skardu (Deluxe room Hunza Hotel ) / Swiss Rock Hotel & Resort Naran"
    }
  },
  "Skardu & Hunza": {
    "Deluxe": {
      "twin_rate": 10000,
      "triple_rate": 13000,
      "hotel_name": "Tarangfa Lodges Chilas or Indus Hotel / Dirleh Resort Skardu / AlNoorHotel /Mulbery Resort Hunza / Roomy Dastan Hunza / Demanchi Hotel Naran"
    },
    "Premier": {
      "twin_rate": 13000,
      "triple_rate": 15000,
      "hotel_name": "Grace Continental Chilas / Summit Embassy Hotel  / Qayyam Skardu  /Qayam Resort Hunza / Roomy Dastan Hunza / Hotel Home Naran"
    },
    "Executive": {
      "twin_rate": 19000,
      "triple_rate": 22000,
      "hotel_name": "Grace Continental Chilas / Khar Resort  Skardu / Guman resort / PC Lagacy/ Rivage Resort Skardu  \nHard Rock Hunza Resort / Villas Roomy Resort Hunza / The Sarai Hotel & Resort Naran"
    },
    "Luxury": {
      "twin_rate": 30000,
      "triple_rate": 40000,
      "hotel_name": "Shangrila Hotel Chilas / Khoj Resorts (Deluxe room) or Rivage Resort Skardu (Executive rooms)  Skardu \nHorizon Resort Attabad Lake (Deluxe room) or Offto Resort Hunza / Northern Retreat by Hotel Demanchi"
    },
    "Ultra Luxury": {
      "twin_rate": 50000,
      "triple_rate": 60000,
      "hotel_name": "Shangrila Hotel Chilas / Shangrila (Executive Room) / Himmel by Luxus (Deluxe room) /Khoj Resorts (River view loft villa) (Deluxe room Skardu Hotel )\nBest Western / Darbar Hotel / Hunza Serena Hotel  (Deluxe room Hunza Hotel )/ Swiss Rock Hotel & Resort Naran"
    }
  },
  "Minimarg Astor Valley": {
    "Deluxe": {
      "twin_rate": 10000,
      "triple_rate": 13000,
      "hotel_name": "Tarangfa Lodges Chilas or Indus Hotel / Minimarg Camping Side \nBenazir Palace Hotel & Restaurant Gorikot Astore / Demanchi Hotel"
    },
    "Premier": {
      "twin_rate": 13000,
      "triple_rate": 15000,
      "hotel_name": "Grace Continental Chilas / Minimarg Camping Side \nWazir Guest House Rama Astore / Hotel Home Naran"
    },
    "Executive": {
      "twin_rate": 19000,
      "triple_rate": 22000,
      "hotel_name": "Grace Continental Chilas \nMinimarg Camping Side \nWazir Guest House Rama Astore / The Sarai Hotel & Resort Naran"
    },
    "Luxury": {
      "twin_rate": 30000,
      "triple_rate": 40000,
      "hotel_name": "Shangrila Hotel Chilas / Minimarg Army Camping Side \n Mulberry Lodge Astore / Northern Retreat by Hotel Demanchi"
    },
    "Ultra Luxury": {
      "twin_rate": 50000,
      "triple_rate": 60000,
      "hotel_name": "Shangrila Hotel Chilas / Minimarg Army Camping Side \n Mulberry Lodge Astore / Swiss Rock Hotel & Resort Naran"
    }
  },
  "Fairy Meadows Nanga Base Camp": {
    "Deluxe": {
      "twin_rate": 15000,
      "triple_rate": 17000,
      "hotel_name": "Tarangfa Hotel Chilas or Indus Hotel / Fairy Meadows View  Camping Side / Demanchi Naran Valley"
    },
    "Premier": {
      "twin_rate": 16000,
      "triple_rate": 18000,
      "hotel_name": "Grace Continental Chilas (deluxe room) /Fairy Meadows View Camping Side / Hotel Home Naran"
    },
    "Executive": {
      "twin_rate": 20000,
      "triple_rate": 23000,
      "hotel_name": "Grace Continental Chilas / Raikot Sarai fairy meadows  / Grace Continental Chilas  / The Sarai Hotel & Resort Naran"
    },
    "Luxury": {
      "twin_rate": 30000,
      "triple_rate": 35000,
      "hotel_name": "Shangrila Hotel Chilas/ Raikot Sarai fairy meadows / Northern Retreat by Hotel Demanchi"
    },
    "Ultra Luxury": {
      "twin_rate": 32000,
      "triple_rate": 37000,
      "hotel_name": "Shangrila Hotel Chilas / Raikot Sarai fairy meadows / Swiss Rock Hotel & Resort Naran"
    }
  },
  "Murree Patriata Galiyat": {
    "Deluxe": {
      "twin_rate": 12000,
      "triple_rate": 15000,
      "hotel_name": "Grand Taj hotel / The Cloud Xpress"
    },
    "Premier": {
      "twin_rate": 13000,
      "triple_rate": 16000,
      "hotel_name": "Umda hotel / The Cloud Xpress"
    },
    "Executive": {
      "twin_rate": 25000,
      "triple_rate": 30000,
      "hotel_name": "Khattak  lodges Murree/ Shangrila Hotel Murree for \nHotel Summer Retreat"
    },
    "Luxury": {
      "twin_rate": 27000,
      "triple_rate": 33000,
      "hotel_name": "Roomy lodges Murree / Shangrila Hotel Murree for \nHotel Summer Retreat"
    },
    "Ultra Luxury": {
      "twin_rate": 30000,
      "triple_rate": 36000,
      "hotel_name": "Felettis Grand / Shangrila Hotel Murree for \nHotel Summer Retreat"
    }
  },
  "Murree Ayubia Nathiagali": {
    "Deluxe": {
      "twin_rate": 15000,
      "triple_rate": 18000,
      "hotel_name": "Hotel One Mall Road / Crown Inn Hotel"
    },
    "Premier": {
      "twin_rate": 16000,
      "triple_rate": 17000,
      "hotel_name": "Umda hotel/ Crown Inn Hotel"
    },
    "Executive": {
      "twin_rate": 22000,
      "triple_rate": 25000,
      "hotel_name": "Felettis Grand / Shanrila Hotel Murree"
    },
    "Luxury": {
      "twin_rate": 30000,
      "triple_rate": 35000,
      "hotel_name": "Fiora Hotel / PC Bhurban Murree"
    },
    "Ultra Luxury": {
      "twin_rate": 35000,
      "triple_rate": 38000,
      "hotel_name": "Double Tree by Hilton / Alpine Resort Nathiagali"
    }
  },
  "Naran Kaghan & Babusar Top": {
    "Deluxe": {
      "twin_rate": 15000,
      "triple_rate": 28000,
      "hotel_name": "Demanchi hotel Naran"
    },
    "Premier": {
      "twin_rate": 19000,
      "triple_rate": 22000,
      "hotel_name": "Millienium Hotel Naran"
    },
    "Executive": {
      "twin_rate": 21000,
      "triple_rate": 23000,
      "hotel_name": "Home Naran"
    },
    "Luxury": {
      "twin_rate": 23000,
      "triple_rate": 25000,
      "hotel_name": "Heritage hotel Naran / Northern Retreat by Hotel Demanchi"
    },
    "Ultra Luxury": {
      "twin_rate": 25000,
      "triple_rate": 27000,
      "hotel_name": "The Sarai Hotel & Resort Naran / Northern Retreat by Hotel Demanchi"
    }
  },
  "Neelum Valley Kashmir": {
    "Deluxe": {
      "twin_rate": 6000,
      "triple_rate": 8000,
      "hotel_name": "Neelum Cinaar Resort"
    },
    "Premier": {
      "twin_rate": 9000,
      "triple_rate": 12000,
      "hotel_name": "Green Valley Resort"
    },
    "Executive": {
      "twin_rate": 12000,
      "triple_rate": 15000,
      "hotel_name": "Hotel Neelum Elites"
    },
    "Luxury": {
      "twin_rate": 17000,
      "triple_rate": 20000,
      "hotel_name": "Wanderlust Chapter 1"
    },
    "Ultra Luxury": {
      "twin_rate": 25000,
      "triple_rate": 3000,
      "hotel_name": "Roameo Resort"
    }
  },
  "Neelum Taobat Arang Kel": {
    "Deluxe": {
      "twin_rate": 6000,
      "triple_rate": 8000,
      "hotel_name": "Neelum Cinaar Resort"
    },
    "Premier": {
      "twin_rate": 9000,
      "triple_rate": 12000,
      "hotel_name": "Green Valley Resort"
    },
    "Executive": {
      "twin_rate": 12000,
      "triple_rate": 15000,
      "hotel_name": "Hotel Neelum Elites"
    },
    "Luxury": {
      "twin_rate": 17000,
      "triple_rate": 20000,
      "hotel_name": "Wanderlust Chapter 1"
    },
    "Ultra Luxury": {
      "twin_rate": 25000,
      "triple_rate": 3000,
      "hotel_name": "Roameo Resort"
    }
  },
  "Swat Kalam & Malam Jabba": {
    "Deluxe": {
      "twin_rate": 9000,
      "triple_rate": 12000,
      "hotel_name": "Demanchi hotel Kalam or Equivalent"
    },
    "Premier": {
      "twin_rate": 12000,
      "triple_rate": 15000,
      "hotel_name": "Hotel One Kalam"
    },
    "Executive": {
      "twin_rate": 18000,
      "triple_rate": 21000,
      "hotel_name": "Maria Hotel Kalam"
    },
    "Luxury": {
      "twin_rate": 22000,
      "triple_rate": 24000,
      "hotel_name": "The Jungle in resort"
    },
    "Ultra Luxury": {
      "twin_rate": 25000,
      "triple_rate": 32000,
      "hotel_name": "(Zen Luxus Kalam or Walnut Heights by Roomy, Kalam)"
    }
  },
  "Islamabad": {
    "Deluxe": {
      "twin_rate": 15000,
      "triple_rate": 20000,
      "hotel_name": "Roomy Signature / Grand Islamabad"
    },
    "Premier": {
      "twin_rate": 23000,
      "triple_rate": 27000,
      "hotel_name": "Canadian Inn Hotel"
    },
    "Executive": {
      "twin_rate": 35000,
      "triple_rate": 40000,
      "hotel_name": "Serena Hotel / Hotel Hill view Islamabad"
    },
    "Luxury": {
      "twin_rate": 42000,
      "triple_rate": 45000,
      "hotel_name": "Sintra Hotel / Ramada Hotel/IFQ Hotel and Resort"
    },
    "Ultra Luxury": {
      "twin_rate": 47000,
      "triple_rate": 50000,
      "hotel_name": "Islamabad Marriot Hotel"
    }
  },
  "Kalash Valley & Chitral": {
    "Deluxe": {
      "twin_rate": 29000,
      "triple_rate": 32000,
      "hotel_name": "Height Away Cottage/Mountain Inn Chitral"
    },
    "Premier": {
      "twin_rate": 32000,
      "triple_rate": 35000,
      "hotel_name": "Town Inn Guest House/Chinar Inn"
    },
    "Executive": {
      "twin_rate": 35000,
      "triple_rate": 38000,
      "hotel_name": "Legendary hotel Chitral/Tirch Mir View Hotel"
    },
    "Luxury": {
      "twin_rate": 37000,
      "triple_rate": 40000,
      "hotel_name": "Hindkush Sarai Chitral/Pamir Riverside Inn Chitral"
    },
    "Ultra Luxury": {
      "twin_rate": 40000,
      "triple_rate": 45000,
      "hotel_name": "Ayun Fort Inn/Hindukash Heights"
    }
  },
  "Kumrat and Katora Lake": {
    "Deluxe": {
      "twin_rate": 13000,
      "triple_rate": 16000,
      "hotel_name": "Kumrat valley resort"
    },
    "Premier": {
      "twin_rate": 16000,
      "triple_rate": 19000,
      "hotel_name": "Hotel Green hill"
    },
    "Executive": {
      "twin_rate": 19000,
      "triple_rate": 22000,
      "hotel_name": "Panjkora Resort/ Latitude resort"
    },
    "Luxury": {
      "twin_rate": 22000,
      "triple_rate": 25000,
      "hotel_name": "Valhalla Resort/Celine Resorts Kumrat"
    },
    "Ultra Luxury": {
      "twin_rate": 28000,
      "triple_rate": 31000,
      "hotel_name": "Kumrat Glamping Resort/The WoodPeckers"
    }
  }
}



// ---- Air Hotel Pricing ----
export const airHotelPricing: Record<AirDestination, Record<HotelCategory, HotelRate>> =
{
  "Skardu Valley": {
    "Deluxe": {
      "twin_rate": 12000,
      "triple_rate": 15000,
      "hotel_name": "Hotel Himalaya / Al Noor Starlet Hotel / Dirleh Resort / (Deluxe room)"
    },
    "Premier": {
      "twin_rate": 15000,
      "triple_rate": 17000,
      "hotel_name": "Tibet / Hotel Himalaya (Executive room) / Kinara Hotel Skardu / Qayyam Skardu"
    },
    "Executive": {
      "twin_rate": 34000,
      "triple_rate": 38000,
      "hotel_name": "Khar Resort  Skardu / Guman resort / PC Lagacy/ Rivage Resort Skardu"
    },
    "Luxury": {
      "twin_rate": 45000,
      "triple_rate": 50000,
      "hotel_name": "Khoj Resorts (Deluxe room) or Rivage Resort Skardu (Executive rooms)"
    },
    "Ultra Luxury": {
      "twin_rate": 60000,
      "triple_rate": 70000,
      "hotel_name": "Shangrila (Executive Room) / Himmel by Luxus (Deluxe room) /Khoj Resorts (River view loft villa)"
    }
  },
  "Hunza Valley": {
    "Deluxe": {
      "twin_rate": 12000,
      "triple_rate": 15000,
      "hotel_name": "Shaheen Resort Hunza (SRH)  / Hunza Blossom In / Karakuram Hotel / Hotel Himalaya (1 Night) (Deluxe room Hunza )"
    },
    "Premier": {
      "twin_rate": 15000,
      "triple_rate": 17000,
      "hotel_name": "Qayam Resort Hunza / Roomy Dastan/ Hunza 1 Night Qayyam Skardu (Skardu)"
    },
    "Executive": {
      "twin_rate": 34000,
      "triple_rate": 38000,
      "hotel_name": "Hard Rock Hunza Resort / Best Western/ Villas Roomy Resort / Khar Resort Hunza"
    },
    "Luxury": {
      "twin_rate": 45000,
      "triple_rate": 50000,
      "hotel_name": "Horizon Resort Attabad Lake (Deluxe room) or Offto Resort Hunza"
    },
    "Ultra Luxury": {
      "twin_rate": 60000,
      "triple_rate": 70000,
      "hotel_name": "Best Western / Darbar Hotel / Hunza Serena Hotel  (Hunza)/ PC Skardu for 1 night  (Deluxe room Hunza Hotel )"
    }
  },
  "Minimarg Astor Valley": {
    "Deluxe": {
      "twin_rate": 15000,
      "triple_rate": 17000,
      "hotel_name": "Minimarg Camping Side (2 nights)\nQayyam Hotel Skardu (deluxe room) (2 nights)"
    },
    "Premier": {
      "twin_rate": 19000,
      "triple_rate": 22000,
      "hotel_name": "Minimarg Camping Side (2 nights)\nKhar Resort  Skardu  (deluxe room) (2 nights)"
    },
    "Executive": {
      "twin_rate": 20000,
      "triple_rate": 23000,
      "hotel_name": "Khar Hotel Skardu (deluxe room) (1night)\nMinimarg Camping Side (2 nights)\nKhoj resort Skardu (deluxe room) (1night)"
    },
    "Luxury": {
      "twin_rate": 30000,
      "triple_rate": 35000,
      "hotel_name": "Minimarg Army Camping Side (2 nights)\nKhoj Resorts (deluxe room) (2 night)"
    },
    "Ultra Luxury": {
      "twin_rate": 35000,
      "triple_rate": 38000,
      "hotel_name": "Minimarg Army Camping Side (2 nights)\nKhoj Resorts (River Edge Loft Hummok Villa (RELHV)) (2 night)"
    }
  },
  "Fairy Meadows Nanga Base Camp": {
    "Deluxe": {
      "twin_rate": 15000,
      "triple_rate": 17000,
      "hotel_name": "Snow land (deluxe room) (2 nights)/Fairy Meadows View Camping Side (2 nights)"
    },
    "Premier": {
      "twin_rate": 16000,
      "triple_rate": 18000,
      "hotel_name": "Al Noor Starlet Hotel (deluxe room) (2 nights)/Fairy Meadows View Camping Side (2 nights)"
    },
    "Executive": {
      "twin_rate": 20000,
      "triple_rate": 23000,
      "hotel_name": "Raikot Sarai fairy meadows (2 nights)\nKinara Hotel Skardu (deluxe room) (2 nights)\nQayam Hotel Skardu (deluxe room)"
    },
    "Luxury": {
      "twin_rate": 30000,
      "triple_rate": 35000,
      "hotel_name": "Raikot Sarai fairy meadows (2 nights)\nKhoj Resorts (deluxe room) (2 night)"
    },
    "Ultra Luxury": {
      "twin_rate": 32000,
      "triple_rate": 37000,
      "hotel_name": "Raikot Sarai fairy meadows (2 nights)\nKhoj Resorts (River Edge Loft Hummok Villa (RELHV)) (2 night)"
    }
  },
  "Skardu & Hunza": {
    "Deluxe": {
      "twin_rate": 12000,
      "triple_rate": 15000,
      "hotel_name": "Hotel Himalaya / Al Noor Starlet Hotel / Dirleh Resort / (Deluxe room Skardu ) \n Shaheen Resort Hunza(SRH)  / Hunza Blossom In / (Deluxe room Hunza )"
    },
    "Premier": {
      "twin_rate": 15000,
      "triple_rate": 17000,
      "hotel_name": "Tibet / Hotel Himalaya / Kinara Hotel Skardu / Qayyam Skardu\nQayam Resort Hunza / Roomy Dastan Hunza"
    },
    "Executive": {
      "twin_rate": 34000,
      "triple_rate": 38000,
      "hotel_name": "Khar Resort  Skardu / Guman resort / PC Lagacy/ Rivage Resort Skardu  \nHard Rock Hunza Resort / Villas Roomy Resort Hunza"
    },
    "Luxury": {
      "twin_rate": 45000,
      "triple_rate": 50000,
      "hotel_name": "Khoj Resorts (Deluxe room) or Rivage Resort Skardu (Executive rooms)  Skardu \nHorizon Resort Attabad Lake (Deluxe room) or Offto Resort Hunza"
    },
    "Ultra Luxury": {
      "twin_rate": 60000,
      "triple_rate": 70000,
      "hotel_name": "Shangrila (Executive Room) / Himmel by Luxus (Deluxe room) /Khoj Resorts (River view loft villa) (Deluxe room Skardu Hotel )\nBest Western / Darbar Hotel / Hunza Serena Hotel  (Deluxe room Hunza Hotel )"
    }
  }
}



export const vehiclePricing: Record<
    string,
    Record<string, Partial<Record<VehicleType, VehicleRate>>>
> = {
    Departure_Islamabad: {
  "Skardu Valley": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 6000,
      "fuel": 18000,
      "seats": 25,
      "per_day_total": 41000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 6000,
      "fuel": 18000,
      "seats": 25,
      "per_day_total": 40000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 5000,
      "fuel": 13000,
      "seats": 12,
      "per_day_total": 30000
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
      "fuel": 7000,
      "seats": 4,
      "per_day_total": 17500
    }
  },
  "Hunza Valley": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 6000,
      "fuel": 18000,
      "seats": 25,
      "per_day_total": 41000
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
      "fuel": 15000,
      "seats": 12,
      "per_day_total": 32000
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
      "fuel": 150000,
      "seats": 12,
      "per_day_total": 167000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 4000,
      "fuel": 12000,
      "seats": 6,
      "per_day_total": 25000
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 3500,
      "fuel": 10000,
      "seats": 4,
      "per_day_total": 20500
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
  "Naran Kaghan & Babusar Top": {
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
      "fuel": 15000,
      "seats": 12,
      "per_day_total": 32000
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
  "Swat Kalam & Malam Jabba": {
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

Departure_Lahore:{
  "Skardu Valley": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 12000,
      "fuel": 23000,
      "seats": 25,
      "per_day_total": 52000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 12000,
      "fuel": 23000,
      "seats": 25,
      "per_day_total": 51000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 10000,
      "fuel": 18000,
      "seats": 12,
      "per_day_total": 40000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 6000,
      "fuel": 12000,
      "seats": 6,
      "per_day_total": 27000
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 5000,
      "fuel": 10000,
      "seats": 4,
      "per_day_total": 22000
    }
  },
  "Hunza Valley": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 12000,
      "fuel": 23000,
      "seats": 25,
      "per_day_total": 52000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 12000,
      "fuel": 23000,
      "seats": 25,
      "per_day_total": 51000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 10000,
      "fuel": 18000,
      "seats": 12,
      "per_day_total": 40000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 6000,
      "fuel": 12000,
      "seats": 6,
      "per_day_total": 27000
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 5000,
      "fuel": 10000,
      "seats": 4,
      "per_day_total": 22000
    }
  },
  "Skardu & Hunza": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 12000,
      "fuel": 26000,
      "seats": 25,
      "per_day_total": 55000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 12000,
      "fuel": 26000,
      "seats": 25,
      "per_day_total": 54000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 10000,
      "fuel": 20000,
      "seats": 12,
      "per_day_total": 42000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 6000,
      "fuel": 12000,
      "seats": 6,
      "per_day_total": 27000
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 5000,
      "fuel": 10000,
      "seats": 4,
      "per_day_total": 22000
    }
  },
  "Minimarg Astor Valley": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 12000,
      "fuel": 22000,
      "seats": 25,
      "per_day_total": 51000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 12000,
      "fuel": 22000,
      "seats": 25,
      "per_day_total": 50000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 10000,
      "fuel": 16000,
      "seats": 12,
      "per_day_total": 38000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 6000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 25000
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 5000,
      "fuel": 8000,
      "seats": 4,
      "per_day_total": 20000
    }
  },
  "Fairy Meadows Nanga Base Camp": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 12000,
      "fuel": 18000,
      "seats": 25,
      "per_day_total": 47000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 12000,
      "fuel": 18000,
      "seats": 25,
      "per_day_total": 46000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 10000,
      "fuel": 15000,
      "seats": 12,
      "per_day_total": 37000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 6000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 25000
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 5000,
      "fuel": 10000,
      "seats": 4,
      "per_day_total": 22000
    }
  },
  "Murree Patriata Galiyat": {
    "Coaster 5c": {
      "daily_rent": 20000,
      "toll": 10000,
      "fuel": 70000,
      "seats": 25,
      "per_day_total": 100000
    },
    "Coaster 4c": {
      "daily_rent": 20000,
      "toll": 10000,
      "fuel": 70000,
      "seats": 25,
      "per_day_total": 100000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 8000,
      "fuel": 60000,
      "seats": 12,
      "per_day_total": 80000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 6000,
      "fuel": 40000,
      "seats": 6,
      "per_day_total": 55000
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 5000,
      "fuel": 15000,
      "seats": 4,
      "per_day_total": 27000
    }
  },
  "Murree Ayubia Nathiagali": {
    "Coaster 5c": {
      "daily_rent": 20000,
      "toll": 10000,
      "fuel": 60000,
      "seats": 25,
      "per_day_total": 90000
    },
    "Coaster 4c": {
      "daily_rent": 20000,
      "toll": 10000,
      "fuel": 60000,
      "seats": 25,
      "per_day_total": 90000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 8000,
      "fuel": 40000,
      "seats": 12,
      "per_day_total": 60000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 6000,
      "fuel": 12000,
      "seats": 6,
      "per_day_total": 27000
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 5000,
      "fuel": 10000,
      "seats": 4,
      "per_day_total": 22000
    }
  },
  "Naran Kaghan & Babusar Top": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 10000,
      "fuel": 25000,
      "seats": 25,
      "per_day_total": 52000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 10000,
      "fuel": 25000,
      "seats": 25,
      "per_day_total": 51000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 8000,
      "fuel": 12000,
      "seats": 12,
      "per_day_total": 32000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 6000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 25000
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 4000,
      "fuel": 8000,
      "seats": 4,
      "per_day_total": 19000
    }
  },
  "Neelum Valley Kashmir": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 12000,
      "fuel": 25000,
      "seats": 25,
      "per_day_total": 54000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 12000,
      "fuel": 25000,
      "seats": 25,
      "per_day_total": 53000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 10000,
      "fuel": 12000,
      "seats": 12,
      "per_day_total": 34000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 6000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 25000
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 4000,
      "fuel": 8000,
      "seats": 4,
      "per_day_total": 19000
    }
  },
  "Neelum Taobat Arang Kel": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 12000,
      "fuel": 25000,
      "seats": 25,
      "per_day_total": 54000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 12000,
      "fuel": 25000,
      "seats": 25,
      "per_day_total": 53000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 10000,
      "fuel": 12000,
      "seats": 12,
      "per_day_total": 34000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 6000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 25000
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 4000,
      "fuel": 8000,
      "seats": 4,
      "per_day_total": 19000
    }
  },
  "Swat Kalam & Malam Jabba": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 12000,
      "fuel": 25000,
      "seats": 25,
      "per_day_total": 54000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 12000,
      "fuel": 25000,
      "seats": 25,
      "per_day_total": 53000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 8000,
      "fuel": 12000,
      "seats": 12,
      "per_day_total": 32000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 6000,
      "fuel": 10000,
      "seats": 6,
      "per_day_total": 25000
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 4000,
      "fuel": 8000,
      "seats": 4,
      "per_day_total": 19000
    }
  },
  "Islamabad": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 12000,
      "fuel": 60000,
      "seats": 25,
      "per_day_total": 89000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 12000,
      "fuel": 60000,
      "seats": 25,
      "per_day_total": 88000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 10000,
      "fuel": 45000,
      "seats": 12,
      "per_day_total": 67000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 8000,
      "fuel": 25000,
      "seats": 6,
      "per_day_total": 42000
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 4000,
      "fuel": 13000,
      "seats": 4,
      "per_day_total": 24000
    }
  },
  "Kalash Valley & Chitral": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 12000,
      "fuel": 20000,
      "seats": 25,
      "per_day_total": 49000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 12000,
      "fuel": 20000,
      "seats": 25,
      "per_day_total": 48000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 10000,
      "fuel": 15000,
      "seats": 12,
      "per_day_total": 37000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 6000,
      "fuel": 12000,
      "seats": 6,
      "per_day_total": 27000
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 3500,
      "fuel": 10000,
      "seats": 4,
      "per_day_total": 20500
    }
  },
  "Kumrat and Katora Lake": {
    "Coaster 5c": {
      "daily_rent": 17000,
      "toll": 12000,
      "fuel": 25000,
      "seats": 25,
      "per_day_total": 54000
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 12000,
      "fuel": 25000,
      "seats": 25,
      "per_day_total": 53000
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 10000,
      "fuel": 18000,
      "seats": 12,
      "per_day_total": 40000
    },
    "Honda BRV": {
      "daily_rent": 9000,
      "toll": 6000,
      "fuel": 15000,
      "seats": 6,
      "per_day_total": 30000
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 4000,
      "fuel": 10000,
      "seats": 4,
      "per_day_total": 21000
    }
  }
}
};
// vehice pricing by air
export const vehiclePricingByAir: Record<
    string,
    Partial<Record<VehicleType, VehicleRate>>
> = {
  "Skardu Valley": {
    "Parado": {
      "daily_rent": 8000,
      "toll": 2500,
      "fuel": 7000,
      "seats": 5,
      "per_day_total": 17500
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 2500,
      "fuel": 17000,
      "seats": 25,
      "per_day_total": 35500
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 2500,
      "fuel": 12000,
      "seats": 12,
      "per_day_total": 26500
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 2500,
      "fuel": 8000,
      "seats": 4,
      "per_day_total": 17500
    }
  },
  "Hunza Valley": {
    "Parado": {
      "daily_rent": 8000,
      "toll": 2500,
      "fuel": 7000,
      "seats": 5,
      "per_day_total": 17500
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 2500,
      "fuel": 17000,
      "seats": 25,
      "per_day_total": 35500
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 2500,
      "fuel": 12000,
      "seats": 12,
      "per_day_total": 26500
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 2500,
      "fuel": 8000,
      "seats": 4,
      "per_day_total": 17500
    }
  },
  "Minimarg Astor Valley": {
    "Parado": {
      "daily_rent": 8000,
      "toll": 2500,
      "fuel": 7000,
      "seats": 5,
      "per_day_total": 17500
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 2500,
      "fuel": 17000,
      "seats": 25,
      "per_day_total": 35500
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 2500,
      "fuel": 12000,
      "seats": 12,
      "per_day_total": 26500
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 2500,
      "fuel": 8000,
      "seats": 4,
      "per_day_total": 17500
    }
  },
  "Fairy Meadows Nanga Base Camp": {
    "Parado": {
      "daily_rent": 8000,
      "toll": 2500,
      "fuel": 7000,
      "seats": 5,
      "per_day_total": 17500
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 2500,
      "fuel": 17000,
      "seats": 25,
      "per_day_total": 35500
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 2500,
      "fuel": 12000,
      "seats": 12,
      "per_day_total": 26500
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 2500,
      "fuel": 8000,
      "seats": 4,
      "per_day_total": 17500
    }
  },
  "Skardu & Hunza": {
    "Parado": {
      "daily_rent": 8000,
      "toll": 2500,
      "fuel": 7000,
      "seats": 5,
      "per_day_total": 17500
    },
    "Coaster 4c": {
      "daily_rent": 16000,
      "toll": 2500,
      "fuel": 17000,
      "seats": 25,
      "per_day_total": 35500
    },
    "Grand Cabin": {
      "daily_rent": 12000,
      "toll": 2500,
      "fuel": 12000,
      "seats": 12,
      "per_day_total": 26500
    },
    "Gli Car": {
      "daily_rent": 7000,
      "toll": 2500,
      "fuel": 8000,
      "seats": 4,
      "per_day_total": 17500
    }
  }
}




// ---- By-Air Fixed Extras ----
export const byAirExtras: Record<string, number> = {
    "Air Ticket (Islamabad Base)": 60000,
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
export function getAvailableVehicles(departure: string, destination: string, travelers: number, transportMode: "By Road" | "By Air" = "By Road"): { type: VehicleType; rate: VehicleRate }[] {
    if (transportMode === "By Air") {
        const destVehicles = vehiclePricingByAir[destination];
        if (!destVehicles) return [];
        return (Object.entries(destVehicles) as [VehicleType, VehicleRate][])
            .filter(([, rate]) => rate.seats >= travelers)
            .map(([type, rate]) => ({ type, rate }));
    } else {
        const departureKey = `Departure_${departure}`;
        const departureVehicles = vehiclePricing[departureKey];
        if (!departureVehicles) return [];
        const destVehicles = departureVehicles[destination];
        if (!destVehicles) return [];
        return (Object.entries(destVehicles) as [VehicleType, VehicleRate][])
            .filter(([, rate]) => rate.seats >= travelers)
            .map(([type, rate]) => ({ type, rate }));
    }
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
    arrivalBreakfastTotal: number;
    departureSurcharge: number;
    lahoreChallanTotal: number;
    grandTotal: number;
    perPerson: number;
    // Breakdown for By Air traveler types
    adultTicketTotal?: number;
    childTicketTotal?: number;
    infantLapTotal?: number;
    infantOwnSeatTotal?: number;
} {
    const { transportMode, destination, hotelCategory, vehicleType, days, travelers, roomType, selectedAddOns, departure } = params;

    // Use traveler type counts for both By Road and By Air
    const adultCount = params.adults ?? travelers;
    const childCount = params.children ?? 0;
    const infantLapCount = params.infantLap ?? 0;
    const infantOwnSeatCount = params.infantOwnSeat ?? 0;

    // Total people for add-ons (includes everyone)
    const totalPeople = adultCount + childCount + infantLapCount + infantOwnSeatCount;

    // Seats needed for rooms (infant lap doesn't need seat/room space)
    const seatsForRooms = adultCount + childCount + infantOwnSeatCount;

    // Hotel cost
    const hotelData = transportMode === "By Air"
        ? (airHotelPricing as any)[destination]
        : (roadHotelPricing as any)[destination];
    const hotelRate = hotelData?.[hotelCategory];
    const nightlyRate = roomType === "twin" ? (hotelRate?.twin_rate || 10000) : (hotelRate?.triple_rate || 12000);
    const nights = days > 1 ? days - 1 : 0;
    // Room calculation: 1 room for 2 adults + 2 children + 1 infant, 2 rooms for 2 adults + 3 children + 1 infant
    // Max 4 people per room (adults + children + infantOwnSeat, infant on lap doesn't count)
    const roomsNeeded = Math.ceil(seatsForRooms / 4);
    const hotelTotal = nightlyRate * nights * roomsNeeded;

    // Vehicle cost
    // cost_per_day = rent + fuel, total = (cost_per_day * days) + toll (toll is one-time)
    let vehicle: VehicleRate | undefined;
    if (transportMode === "By Air") {
        const destVehicles = vehiclePricingByAir[destination];
        vehicle = destVehicles?.[vehicleType];
    } else {
        const departureKey = `Departure_${departure}`;
        const departureVehicles = vehiclePricing[departureKey];
        const vehicleData = departureVehicles?.[destination];
        vehicle = vehicleData?.[vehicleType];
    }
    const dailyRent = vehicle?.daily_rent || 14000;
    const fuel = vehicle?.fuel || 10000;
    const toll = vehicle?.toll || 4000;
    const costPerDay = dailyRent + fuel;
    const vehicleTotal = (costPerDay * days) + toll;

    // Air ticket & departure surcharge
    let airTicketTotal = 0;
    const departureSurcharge = 0;
    let adultTicketTotal = 0;
    let childTicketTotal = 0;
    let infantLapTotal = 0;
    let infantOwnSeatTotal = 0;

    if (transportMode === "By Air") {
        const baseTicket = byAirExtras["Air Ticket (Islamabad Base)"] || 45000;
        const karachiSurcharge = departure === "Karachi" ? (byAirExtras["Karachi Surcharge (Add-on)"] || 40000) : 0;
        const lahoreSurchargeAir = departure === "Lahore" ? (byAirExtras["Lahore Surcharge (Add-on)"] || 30000) : 0;
        const adultFare = baseTicket + karachiSurcharge + lahoreSurchargeAir;

        // Adult: 100% fare
        adultTicketTotal = adultFare * adultCount;
        // Child (2-11): 75% of adult fare
        childTicketTotal = Math.round(adultFare * childFarePercent) * childCount;
        // Infant (Lap): Fixed 1000 PKR
        infantLapTotal = infantLapPrice * infantLapCount;
        // Infant (Own Seat): Fixed 5000 PKR
        infantOwnSeatTotal = infantOwnSeatPrice * infantOwnSeatCount;

        airTicketTotal = adultTicketTotal + childTicketTotal + infantLapTotal + infantOwnSeatTotal;
    }

    // Add-ons cost (check both common and road-only add-ons)
    let addOnsTotal = 0;
    let mealTotal = 0;
    let arrivalBreakfastTotal = 0;
    const allAddOns = [...optionalAddOns, ...roadOnlyAddOns];
    selectedAddOns.forEach((addonId) => {
        // Special handling for meals - use hotel category pricing and nights
        if (addonId === "meal") {
            const mealRate = mealPricingPerNight[hotelCategory] || 1200;
            mealTotal = mealRate * nights * totalPeople;
            addOnsTotal += mealTotal;
            return;
        }
        // Special handling for arrival_breakfast - track separately
        if (addonId === "arrival_breakfast") {
            arrivalBreakfastTotal = 500 * totalPeople; // 500 per person
            addOnsTotal += arrivalBreakfastTotal;
            return;
        }
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

    // Lahore Challan: 5000 flat (one-time) if departure is Lahore AND trip > 3 days
    let lahoreChallanTotal = 0;
    if (departure === "Lahore" && days > 3) {
        lahoreChallanTotal = lahoreChallanPerDay;
    }

    const subtotal = hotelTotal + vehicleTotal + airTicketTotal + addOnsTotal + departureSurcharge + lahoreChallanTotal;
    const profitAmount = Math.round(subtotal * profitMargin);
    const grandTotal = subtotal + profitAmount;
    const perPerson = totalPeople > 0 ? Math.round(grandTotal / totalPeople) : 0;

    return {
        hotelTotal, vehicleTotal, airTicketTotal, addOnsTotal, arrivalBreakfastTotal, departureSurcharge, lahoreChallanTotal, grandTotal, perPerson,
        adultTicketTotal, childTicketTotal, infantLapTotal, infantOwnSeatTotal
    };
}
