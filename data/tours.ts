export type TourCategory = "Deluxe" | "Executive" | "Luxury";
export type TourRegion = "Skardu" |  "Swat"| "Minimarg" | "Hunza" ;
export type PackageType = "Couple" | "Family" | "Group";
export type TransportType = "By Road" | "By Air";

export interface TourPackage {
  category: TourCategory;
  price: number;
  features: string[];
}

export interface TourDay {
  day: number;
  title: string;
  description: string;
  highlights: string[];
}

export interface Tour {
  id: string;
  name: string;
  location: string;
  region: TourRegion;
  duration: number; // in days
  description: string;
  image: string;
  galleryImages: string[];
  categories: TourCategory[];
  packageTypes: PackageType[];
  transport: TransportType;
  basePrice: number;
  packages: TourPackage[];
  itinerary: TourDay[];
  included: string[];
  notIncluded: string[];
  featured?: boolean;
}

export const tours: Tour[] = [
  {
    id: "1",
    name: "Skardu Valley (By Air)-Private Tours",
    location: "Skardu, Pakistan",
    region: "Skardu",
    duration: 4,
    description: "Join us for an unforgettable group adventure exploring the majestic beauty of Skardu, Deosai National Park, and Minimarg. Experience pristine lakes, stunning landscapes, and the unique culture of Baltistan.",
    image: "/images/tours/Picture2.jpg",
    galleryImages: [
      "/images/tours/Picture1.jpg",
       "/images/tours/Picture2.jpg",
       "/images/tours/Picture3.jpg",
       "/images/tours/Picture4.jpg",
    ],
    categories: ["Deluxe", "Executive", "Luxury"],
    packageTypes: ["Couple", "Family", "Group"],
    transport: "By Air",
    basePrice: 300000,
    packages: [
      {
        category: "Deluxe",
        price: 300000,
        features: ["Hotel Himalaya / Al Noor Starlet Hotel / Dirleh Resort / (Deluxe room)"],
      },
      {
        category: "Executive",
        price: 430000,
        features: ["Khar Resort  Skardu / Guman resort / PC Lagacy/ Rivage Resort Skardu"],
      },
      {
        category: "Luxury",
        price: 470000,
        features: ["Khoj Resorts (Deluxe room) or Rivage Resort Skardu (Executive rooms)"],
      },
    ],
    itinerary: [
      { 
        day: 1, 
        title: "Explore the charming Beauty of Kachura and Shangrila Lake", 
        description: "", 
        highlights: [
          "Morning flight from Islamabad to Skardu International Airport",
          "Meet and greet at airport, transfer to hotel for check-in",
          "Visit the serene Shangri-La Resort (Lower Kachura Lake)",
          "Explore Upper Kachura Lake and hidden Soq Valley",
          "Enjoy leisure time and stunning sunset views",
          "Overnight stay at hotel"
        ] 
      },
      { 
        day: 2, 
        title: "Waterfalls, Rock and Deserts!", 
        description: " ", 
        highlights: [
          "Explore Morning: After breakfast, depart for a scenic drive to the magnificent Manthoka Waterfall.",
          "En route: Stop for photos at the unique Chocolate Rock.",
          "Evening: Experience the Sarfaranga Cold Desert at dusk, a high-altitude desert with stunning dunes",
          "Explore stunning landscapes, meadows, and wildlife of Deosai",
          "Overnight stay at hotel.",
       
        ] 
      },
      { 
        day: 3, 
        title: "Experience the vibrant culture and scenic beauty of Shigar Valley.", 
        description: "", 
        highlights: [
          "Morning: Following breakfast, ",
          "Visit Shigar Fort ",
          "visit the beautiful Blind Lake",
          "Afternoon: Visit the expansive Sadpara Lake and the nearby Buddha Rock, a 7th-century carving.",
          "Overnight stay at Hotel.",
      
        ] 
      },
      { 
        day: 4, 
        title: "Take flight back from Skardu Airport", 
        description: "", 
        highlights: [
          "Morning: Enjoy a final buffet breakfast at the resort.",
          "Transfer: You will be transferred to Skardu Airport for your return flight to Islamabad, filled with ",
          "unforgettable memories.",
       
        ] 
      },
    
    ],
    included: ["Air Tickets both Sides (With Window Seat- One way)", "Private Transport (Parado TZ 2004-07 New Model) (1 Vehicle)", "Fuel & Toll Tax", "3 Night`s Accommodation", "3 Breakfasts"],
    notIncluded: ["Lunch & Dinner", "Personal Expenses", "Recreation, Boating, Jeeps", "Any items not mentioned in services"],
    featured: true,
  },
 {
  "id": "2",
  "name": "5 Days By Air Trip to Astor, Minimarg & Skardu (Couple)",
  "location": "Skardu, Astor & Minimarg, Pakistan",
  "region": "Skardu",
  "duration": 5,
  "description": "An unforgettable 5-day couple tour covering Skardu, Astor, Burzil Top, Minimarg, and Rainbow Lake. Experience scenic flights, alpine lakes, border villages, and the breathtaking beauty of northern Pakistan.",
  "image": "/images/tours/astor-minimarg.jpg",
  "galleryImages": [
    "/images/tours/Picture1.jpg",
    "/images/tours/minimarg1.jpg",
    "/images/tours/skardu1.jpg"
  ],
  "categories": ["Deluxe", "Executive", "Luxury"],
  "packageTypes": ["Couple"],
  "transport": "By Air",
  "basePrice": 430000,
  "packages": [
    {
      "category": "Deluxe",
      "price": 430000,
      "features": [
        "Minimarg Camping Side (2 nights)",
        "Qayyam Hotel Skardu (Deluxe Room) (2 nights)"
      ]
    },
    {
      "category": "Executive",
      "price": 490000,
      "features": [
        "Khar Hotel Skardu (Deluxe Room) (1 night)",
        "Minimarg Camping Side (2 nights)",
        "Khoj Resort Skardu (Deluxe Room) (1 night)"
      ]
    },
    {
      "category": "Luxury",
      "price": 580000,
      "features": [
        "Minimarg Army Camping Side (2 nights)",
        "Khoj Resorts Skardu (Deluxe Room) (2 nights)"
      ]
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival & Kachura Lakes",
      "description": "",
      "highlights": [
        "Morning scenic flight from Islamabad to Skardu",
        "Meet & greet at Skardu International Airport",
        "Visit Shangri-La Resort (Lower Kachura Lake)",
        "Explore Upper Kachura Lake and Soq Valley",
        "Evening leisure time and sunset views",
        "Overnight stay at hotel"
      ]
    },
    {
      "day": 2,
      "title": "Roof of the World & Burzil Top",
      "description": "",
      "highlights": [
        "Breakfast at hotel",
        "Travel towards Astor Valley",
        "Visit Burzil Top – the roof of the world",
        "Scenic mountain views and photography stops",
        "Overnight stay at Astor / Minimarg camping site"
      ]
    },
    {
      "day": 3,
      "title": "Minimarg, Rainbow Lake & Indian Border",
      "description": "",
      "highlights": [
        "Breakfast at Astor",
        "Depart for Minimarg – last village near Indian border",
        "Visit Rainbow Lake with vibrant colors",
        "Explore local village culture",
        "View Kargil base camp area",
        "Dinner and overnight stay at Minimarg camping site"
      ]
    },
    {
      "day": 4,
      "title": "Return to Skardu Valley",
      "description": "",
      "highlights": [
        "Breakfast at Chilim",
        "Travel back towards Skardu",
        "Optional shopping at Skardu Bazaar",
        "Leisure walk and relaxation",
        "Dinner and overnight stay at hotel in Skardu"
      ]
    },
    {
      "day": 5,
      "title": "Departure to Islamabad",
      "description": "",
      "highlights": [
        "Final breakfast at hotel",
        "Transfer to Skardu International Airport",
        "Return flight to Islamabad",
        "Tour ends with unforgettable memories"
      ]
    }
  ],
  "included": [
    "Air Tickets both sides (one-way window seat)",
    "Private Transport (Parado TZ 2004–07 New Model)",
    "Fuel & Toll Tax",
    "4 Nights Accommodation",
    "5 Breakfasts"
  ],
  "notIncluded": [
    "Lunch & Dinner",
    "Personal expenses",
    "Recreation activities, boating, jeep rides",
    "Any item not mentioned in included services"
  ],
  "featured": false
}
,
  {
  "id": "3",
  "name": "6 Days By Air Trip to Astor, Minimarg & Skardu (Couple)",
  "location": "Skardu, Astor & Minimarg, Pakistan",
  "region": "Skardu",
  "duration": 6,
  "description": "A romantic 6-day couple adventure covering Skardu, Rama Meadows, Tarishing, Deosai National Park, Burzil Top, Minimarg, and Rainbow Lake. Experience scenic flights, alpine camping, cultural encounters, and breathtaking mountain landscapes.",
  "image": "/images/tours/Picture2.jpg",
  "galleryImages": [
    "/images/tours/Picture2.jpg",
    "/images/tours/astor1.jpg",
    "/images/tours/minimarg1.jpg",
    "/images/tours/skardu1.jpg"
  ],
  "categories": ["Deluxe", "Executive", "Luxury"],
  "packageTypes": ["Couple"],
  "transport": "By Air",
  "basePrice": 530000,
  "packages": [
    {
      "category": "Deluxe",
      "price": 530000,
      "features": [
        "Rama Meadows Camping (1 night)",
        "Minimarg Camping (1 night)",
        "Tarishing Camping (1 night)",
        "Qayyam Hotel Skardu – Deluxe Room (2 nights)"
      ]
    },
    {
      "category": "Executive",
      "price": 580000,
      "features": [
        "Rama Meadows Camping (1 night)",
        "Minimarg Camping (1 night)",
        "Tarishing Camping (1 night)",
        "Khar Hotel Skardu – Deluxe Room (1 night)",
        "Khoj Resort Skardu – Deluxe Room (1 night)"
      ]
    },
    {
      "category": "Luxury",
      "price": 640000,
      "features": [
        "Rama Meadows Camping (1 night)",
        "Minimarg Camping (1 night)",
        "Tarishing Camping (1 night)",
        "Khoj Resorts Skardu – Deluxe Room (2 nights)"
      ]
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival & Kachura Lakes",
      "description": "",
      "highlights": [
        "Morning scenic flight from Islamabad to Skardu",
        "Meet & greet at Skardu International Airport",
        "Visit Shangri-La Resort (Lower Kachura Lake)",
        "Explore Upper Kachura Lake and Soq Valley",
        "Sunset views and leisure time",
        "Overnight stay at hotel"
      ]
    },
    {
      "day": 2,
      "title": "Roof of the World & Rama Meadows",
      "description": "",
      "highlights": [
        "Breakfast at hotel",
        "Travel towards Rama Meadows",
        "Explore lush green meadows and Rama Lake",
        "Photography and relaxation time",
        "Overnight camping at Rama Meadows"
      ]
    },
    {
      "day": 3,
      "title": "Tarishing & Rupal Face of Nanga Parbat",
      "description": "",
      "highlights": [
        "Open-air breakfast at Rama Meadows",
        "Travel to Tarishing village",
        "View Rupal Face of Nanga Parbat",
        "Explore wooden houses and terraced fields",
        "Short hike to scenic ridges",
        "Cultural interaction with locals",
        "Overnight stay at guesthouse or camping"
      ]
    },
    {
      "day": 4,
      "title": "Deosai, Burzil Top & Minimarg",
      "description": "",
      "highlights": [
        "Breakfast and departure for Deosai National Park",
        "Visit Sadpara Lake and Sheosar Lake",
        "Explore Deosai Plateau – Roof of the World",
        "Travel to Astor and Burzil Top",
        "Visit Minimarg village and Rainbow Lake",
        "Dinner and overnight stay at Minimarg camping site"
      ]
    },
    {
      "day": 5,
      "title": "Domail to Skardu Road Journey",
      "description": "",
      "highlights": [
        "Breakfast at Minimarg Domail",
        "Scenic road journey back to Skardu",
        "Stops at Deosai viewpoints",
        "Optional shopping at Skardu Bazaar",
        "Overnight stay in Skardu"
      ]
    },
    {
      "day": 6,
      "title": "Departure to Islamabad",
      "description": "",
      "highlights": [
        "Final buffet breakfast at hotel",
        "Transfer to Skardu International Airport",
        "Return flight to Islamabad",
        "Tour concludes with unforgettable memories"
      ]
    }
  ],
  "included": [
    "Air Tickets both sides (one-way window seat)",
    "Private Transport (Parado TZ 2004–07 New Model)",
    "Fuel & Toll Tax",
    "5 Nights Accommodation",
    "5 Breakfasts"
  ],
  "notIncluded": [
    "Lunch & Dinner",
    "Personal expenses",
    "Recreation activities, boating, jeep rides",
    "Any item not mentioned in included services"
  ],
  "featured": false
}
,
{
  "id": "4",
  "name": "7 Days By Air Trip to Skardu Valley (Couple)",
  "location": "Skardu Valley, Pakistan",
  "region": "Skardu",
  "duration": 7,
  "description": "A romantic 7-day couple tour exploring the heart of Skardu Valley. Visit alpine lakes, waterfalls, deserts, ancient forts, lush meadows, and cultural villages while enjoying scenic flights and comfortable stays.",
  "image": "/images/tours/Picture2.jpg",
  "galleryImages": [
    "/images/tours/Picture2.jpg",
    "/images/tours/Picture1.jpg",
    "/images/tours/Picture3.jpg",
    "/images/tours/Picture4.jpg"
  ],
  "categories": ["Deluxe", "Executive", "Luxury"],
  "packageTypes": ["Couple"],
  "transport": "By Air",
  "basePrice": 400000,
  "packages": [
    {
      "category": "Deluxe",
      "price": 400000,
      "features": [
        "Hotel Himalaya / Al Noor Starlet Hotel / Dirleh Resort (Deluxe Room)"
      ]
    },
    {
      "category": "Executive",
      "price": 550000,
      "features": [
        "Khar Resort Skardu / Guman Resort / PC Legacy / Rivage Resort Skardu"
      ]
    },
    {
      "category": "Luxury",
      "price": 640000,
      "features": [
        "Khoj Resorts (Deluxe Room) or Rivage Resort Skardu (Executive Room)"
      ]
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival & Kachura Lakes",
      "description": "",
      "highlights": [
        "Scenic morning flight from Islamabad to Skardu",
        "Meet & greet at Skardu International Airport",
        "Visit Shangri-La Resort (Lower Kachura Lake)",
        "Explore Upper Kachura Lake and Soq Valley",
        "Sunset views and leisure time",
        "Overnight stay at hotel"
      ]
    },
    {
      "day": 2,
      "title": "Waterfalls & Cold Desert",
      "description": "",
      "highlights": [
        "Breakfast at hotel",
        "Visit Manthoka Waterfall",
        "Photo stop at Chocolate Rock",
        "Evening visit to Sarfaranga Cold Desert",
        "Overnight stay in Skardu"
      ]
    },
    {
      "day": 3,
      "title": "Forts, Lakes & Ancient Carvings",
      "description": "",
      "highlights": [
        "Visit historic Shigar Fort",
        "Explore the beautiful Blind Lake",
        "Visit Sadpara Lake",
        "See the 7th-century Buddha Rock carving",
        "Overnight stay in Skardu"
      ]
    },
    {
      "day": 4,
      "title": "Basho Meadows (If Deosai Is Closed)",
      "description": "",
      "highlights": [
        "Breakfast at hotel",
        "Transfer to 4x4 jeeps",
        "Drive to Basho Valley",
        "Visit Basho Village and Suspension Bridge",
        "Explore Basho Meadows",
        "Return to Skardu for overnight stay"
      ]
    },
    {
      "day": 5,
      "title": "Khaplu Valley & Historic Forts",
      "description": "",
      "highlights": [
        "Drive to Khaplu Valley",
        "Visit Khaplu Palace",
        "Explore Chaqchan Mosque (700 years old)",
        "Walk through Khaplu bazaars and apricot orchards",
        "Return to Skardu for overnight stay"
      ]
    },
    {
      "day": 6,
      "title": "Skardu City & Optional Chunda Valley",
      "description": "",
      "highlights": [
        "Visit Skardu Bazaar for local handicrafts",
        "Optional walk along the Indus River",
        "Visit Nangsoq Organic Village",
        "Leisure time and relaxation",
        "Overnight stay in Skardu"
      ]
    },
    {
      "day": 7,
      "title": "Departure to Islamabad",
      "description": "",
      "highlights": [
        "Final buffet breakfast at hotel",
        "Transfer to Skardu International Airport",
        "Return flight to Islamabad",
        "Tour ends with unforgettable memories"
      ]
    }
  ],
  "included": [
    "Air Tickets both sides (one-way window seat)",
    "Private Transport (Parado TZ 2004–07 New Model)",
    "Fuel & Toll Tax",
    "6 Nights Accommodation",
    "6 Breakfasts"
  ],
  "notIncluded": [
    "Lunch & Dinner",
    "Personal expenses",
    "Entry tickets, recreation activities, boating, jeep rides",
    "Any item not mentioned in included services"
  ],
  "featured": false
},


{
  "id": "5",
  "name": "4 Days Trip to Swat, Kalam & Malam Jabba",
  "location": "Swat, Kalam & Malam Jabba, Pakistan",
  "region": "Swat",
  "duration": 4,
  "description": "A scenic 4-day tour to Swat Valley covering Kalam, Mahodand Lake, Ushu Forest, and Malam Jabba. Enjoy lush forests, alpine lakes, waterfalls, cultural sites, and adventure activities in Pakistan’s most beautiful northern valleys.",
  "image": "/images/tours/Picture2.jpg",
  "galleryImages": [
    "/images/tours/Picture2.jpg",
    "/images/tours/Picture1.jpg",
    "/images/tours/Picture3.jpg"
  ],
  "categories": ["Single", "Solo", "Couple"],
  "packageTypes": ["Single", "Solo", "Couple"],
  "transport": "By Road",
  "basePrice": 30000,
  "packages": [
    {
      "category": "Single",
      "price": 30000,
      "features": [
        "03 persons sharing room"
      ]
    },
    {
      "category": "Solo",
      "price": 45000,
      "features": [
        "Single room accommodation"
      ]
    },
    {
      "category": "Couple",
      "price": 70000,
      "features": [
        "Separate room for couple"
      ]
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "title": "Islamabad to Kalam Valley",
      "description": "",
      "highlights": [
        "Early morning pickup from Islamabad",
        "Breakfast stop at Shakardara",
        "Visit Shingardar Stupa (Gandhara civilization)",
        "Explore Bahrain Bazaar",
        "Travel towards Kalam Valley",
        "Photography and sightseeing",
        "Dinner and overnight stay in Kalam"
      ]
    },
    {
      "day": 2,
      "title": "Mahodand Lake, Ushu Forest & Blue Water",
      "description": "",
      "highlights": [
        "Breakfast at hotel",
        "4x4 jeep excursion to Mahodand Lake (if open)",
        "Explore snow-covered Ushu Forest",
        "Visit Blue Water glacier-fed river",
        "Photography and sightseeing",
        "Dinner and overnight stay in Kalam"
      ]
    },
    {
      "day": 3,
      "title": "Kalam to Malam Jabba Exploration",
      "description": "",
      "highlights": [
        "Breakfast at hotel",
        "Travel to Malam Jabba ski resort",
        "Sightseeing and photography",
        "Optional activities: skiing, chair lift, zip lining (personal expense)",
        "Bonfire night",
        "Dinner and overnight stay in Malam Jabba"
      ]
    },
    {
      "day": 4,
      "title": "Return to Islamabad",
      "description": "",
      "highlights": [
        "Breakfast at hotel",
        "Visit Marghazar (White Palace of Swat)",
        "Sightseeing and photography",
        "Departure for Islamabad",
        "Arrival in Islamabad by evening",
        "Tour ends with unforgettable memories"
      ]
    }
  ],
  "included": [
    "Private transport (Coaster 5C New Model)",
    "Fuel & Toll Tax",
    "3 Nights Accommodation",
    "4 Breakfasts & 3 Dinners",
    "Jeep for sightseeing",
    "Tour guide services"
  ],
  "notIncluded": [
    "Entry or activity tickets",
    "Boating expenses",
    "Personal expenses",
    "Horse riding or skiing charges",
    "Any item not mentioned in included services"
  ],
  "featured": false
}
,
  {
    id: "6",
    name: "Machu Picchu Trek",
    location: "Peru",
    region: "Deosai",
    duration: 6,
    description: "Hike the legendary Inca Trail to the mystical ruins of Machu Picchu in the Peruvian Andes.",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80",
      "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=600&q=80",
      "https://images.unsplash.com/photo-1591197172062-c718f82eba20?w=600&q=80",
      "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?w=600&q=80",
    ],
    categories: ["Deluxe", "Executive"],
    packageTypes: ["Group"],
    transport: "By Road",
    basePrice: 1999,
    packages: [
      {
        category: "Deluxe",
        price: 1999,
        features: ["Quality lodges", "Meals on trek", "Expert guides", "Permits included"],
      },
      {
        category: "Executive",
        price: 3199,
        features: ["Luxury train option", "5-star hotels", "All meals", "Private guide"],
      },
    ],
    itinerary: [
      { day: 1, title: "Cusco Arrival", description: "Arrive in Cusco and acclimatize to the altitude.", highlights: ["Airport pickup", "City orientation", "Coca tea"] },
      { day: 2, title: "Sacred Valley", description: "Explore the Sacred Valley and ancient Inca sites.", highlights: ["Pisac market", "Ollantaytambo", "Weaving village"] },
      { day: 3, title: "Inca Trail Day 1", description: "Begin the iconic Inca Trail trek.", highlights: ["Trail start", "Mountain views", "Camp under stars"] },
      { day: 4, title: "Inca Trail Day 2", description: "Trek through cloud forest and ancient ruins.", highlights: ["Dead Woman's Pass", "Inca ruins", "Camping"] },
      { day: 5, title: "Machu Picchu", description: "Sunrise arrival at the legendary citadel.", highlights: ["Sun Gate", "Guided tour", "Free exploration"] },
      { day: 6, title: "Departure", description: "Return to Cusco for your onward journey.", highlights: ["Train ride", "Cusco transfer", "Departure"] },
    ],
    included: ["Airport transfers", "Accommodation", "Meals on trek", "Inca Trail permits", "Professional guides", "Camping gear"],
    notIncluded: ["International flights", "Sleeping bag rental", "Travel insurance", "Personal expenses", "Tips"],
  },
];

export const getCategoryBadgeClass = (category: TourCategory): string => {
  switch (category) {
    case "Deluxe":
      return "bg-secondary text-secondary-foreground";
    case "Executive":
      return "bg-navy-light text-white";
    case "Luxury":
      return "bg-primary text-primary-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};
