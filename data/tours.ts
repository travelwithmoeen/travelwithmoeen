export type TourCategory = "Deluxe" | "Executive" | "Luxury" | "Single" | "Solo" | "Couple" | "Family" | "Group" | "Private";
export type TourRegion = "Skardu" | "Deosai" | "Minimarg" | "Hunza" | "Swat" | "Kashmir" | "Islamabad" | "Fairy Meadows" |"Astore";
export type PackageType = "Couple" | "Family" | "Group" | "City Tour" | "Private";
export type TransportType = "By Road" | "By Air" | "By Air & Road";

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
  "location": "Swat Valley, Pakistan",
  "region": "Swat",
  "duration": 4,
  "description": "A scenic 4-day tour to Swat Valley covering Kalam, Ushu Forest, Mahodand Lake, and Malam Jabba. Enjoy waterfalls, forests, alpine lakes, ski resorts, and cultural landmarks with comfortable stays.",
  "image": "/images/tours/Picture2.jpg",
  "galleryImages": [
    "/images/tours/Picture2.jpg",
    "/images/tours/Picture1.jpg",
    "/images/tours/Picture3.jpg",
    "/images/tours/Picture4.jpg"
  ],
  "categories": ["Single", "Solo", "Couple"],
  "packageTypes": ["Group", "Couple", "Family"],
  "transport": "By Road",
  "basePrice": 30000,
  "packages": [
    {
      "category": "Single",
      "price": 30000,
      "features": [
        "03 Persons Sharing Room"
      ]
    },
    {
      "category": "Solo",
      "price": 45000,
      "features": [
        "Single Room"
      ]
    },
    {
      "category": "Couple",
      "price": 70000,
      "features": [
        "Separate Room"
      ]
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "title": "Islamabad to Kalam Valley",
      "description": "",
      "highlights": [
        "05:00 AM pickup from Islamabad",
        "Breakfast stop at Shakardara",
        "Visit Shingardar Stupa (Gandhara civilization)",
        "Explore Bahrain Bazaar",
        "Drive towards Kalam Valley",
        "Visit Kalam Bazaar",
        "Dinner & overnight stay in Kalam"
      ]
    },
    {
      "day": 2,
      "title": "Waterfalls, Forest & Mahodand Lake",
      "description": "",
      "highlights": [
        "Breakfast at hotel",
        "Transfer to 4x4 jeeps",
        "Visit Ushu Forest and surroundings",
        "Explore Blue Water river",
        "Photography and sightseeing",
        "Visit Mahodand Lake (if open)",
        "Dinner & overnight stay in Kalam"
      ]
    },
    {
      "day": 3,
      "title": "Kalam to Malam Jabba",
      "description": "",
      "highlights": [
        "Breakfast at hotel",
        "Travel to Malam Jabba",
        "Visit Pakistan’s largest ski resort",
        "Activities: chair lift, zip line, skiing (personal expense)",
        "Bonfire night",
        "Dinner & overnight stay in Malam Jabba"
      ]
    },
    {
      "day": 4,
      "title": "Departure to Islamabad",
      "description": "",
      "highlights": [
        "08:00 AM breakfast",
        "Visit Marghazar (White Palace of Swat)",
        "Photography and sightseeing",
        "Return journey to Islamabad",
        "Arrival around 08:00 PM (+/- 2 hours)",
        "Tour ends with unforgettable memories"
      ]
    }
  ],
  "included": [
    "Private Transport (Coaster 5C New Model)",
    "Fuel & Toll Tax",
    "3 Nights Accommodation",
    "4 Breakfasts & 3 Dinners",
    "Jeep for sightseeing",
    "Tour Guide"
  ],
  "notIncluded": [
    "Entry or activity tickets",
    "Boating expenses",
    "Personal expenses",
    "Horse riding / skiing charges"
  ],
  "featured": false
}
,
{
  "id": "6",
  "name": "3 Days Trip to Neelum Valley Kashmir",
  "location": "Neelum Valley, Azad Kashmir",
  "region": "Kashmir",
  "duration": 3,
  "description": "A beautiful 3-day getaway to Neelum Valley featuring Sharda, Keran, Kel, Arang Kel, and Kutton Waterfall. Enjoy lush green valleys, rivers, waterfalls, cultural heritage, and peaceful mountain scenery.",
  "image": "/images/tours/Picture2.jpg",
  "galleryImages": [
    "/images/tours/Picture2.jpg",
    "/images/tours/Picture1.jpg",
    "/images/tours/Picture3.jpg",
    "/images/tours/Picture4.jpg"
  ],
  "categories": ["Single", "Solo", "Couple"],
  "packageTypes": ["Group", "Couple", "Family"],
  "transport": "By Road",
  "basePrice": 24000,
  "packages": [
    {
      "category": "Single",
      "price": 24000,
      "features": [
        "03 Persons Sharing Room"
      ]
    },
    {
      "category": "Solo",
      "price": 35000,
      "features": [
        "Single Room"
      ]
    },
    {
      "category": "Couple",
      "price": 60000,
      "features": [
        "Separate Room"
      ]
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "title": "Islamabad to Sharda",
      "description": "",
      "highlights": [
        "05:00 AM pickup from Islamabad",
        "Scenic drive via Murree Expressway",
        "Photo stop at Kohala Bridge",
        "Arrival in Muzaffarabad and breakfast stop",
        "Visit Dhanni Waterfall",
        "Drive towards Sharda",
        "Evening leisure time",
        "Bonfire & musical night",
        "Dinner & overnight stay in Sharda"
      ]
    },
    {
      "day": 2,
      "title": "Sharda, Kel & Arang Kel",
      "description": "",
      "highlights": [
        "Breakfast at hotel in Sharda",
        "Visit historic Sharda University",
        "Drive to Kel",
        "Hike to Arang Kel meadow",
        "Photography and sightseeing",
        "Return to Keran by evening",
        "Dinner & overnight stay in Keran"
      ]
    },
    {
      "day": 3,
      "title": "Kutton Waterfall & Return to Islamabad",
      "description": "",
      "highlights": [
        "Breakfast at hotel in Keran",
        "Drive to Upper Neelum",
        "Visit Kutton Waterfall",
        "Photography and sightseeing",
        "Return journey to Islamabad",
        "Arrival around 08:00 PM (+/- 2 hours)",
        "Tour ends with unforgettable memories"
      ]
    }
  ],
  "included": [
    "Private Transport (Coaster 5C New Model)",
    "Fuel & Toll Tax",
    "2 Nights Accommodation",
    "3 Breakfasts & 2 Dinners",
    "Jeep for sightseeing",
    "Tour Guide"
  ],
  "notIncluded": [
    "Entry or activity tickets",
    "Boating expenses",
    "Personal expenses",
    "Horse riding / skiing charges"
  ],
  "featured": false
},
{
  "id": "7",
  "name": "4 Days Trip to Taobat Neelum Valley Kashmir",
  "location": "Taobat, Neelum Valley, Azad Kashmir",
  "region": "Kashmir",
  "duration": 4,
  "description": "A breathtaking 4-day journey to Taobat, the last village of Neelum Valley. Explore Sharda, Keran, Kel, Arang Kel, Kutton Waterfall, and the untouched beauty of Taobat with scenic jeep rides and cultural landmarks.",
  "image": "/images/tours/Picture2.jpg",
  "galleryImages": [
    "/images/tours/Picture2.jpg",
    "/images/tours/Picture1.jpg",
    "/images/tours/Picture3.jpg",
    "/images/tours/Picture4.jpg"
  ],
  "categories": ["Single", "Solo", "Couple"],
  "packageTypes": ["Group", "Couple", "Family"],
  "transport": "By Road",
  "basePrice": 27000,
  "packages": [
    {
      "category": "Single",
      "price": 27000,
      "features": [
        "03 Persons Sharing Room"
      ]
    },
    {
      "category": "Solo",
      "price": 38000,
      "features": [
        "Single Room"
      ]
    },
    {
      "category": "Couple",
      "price": 65000,
      "features": [
        "Separate Room"
      ]
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "title": "Islamabad to Sharda",
      "description": "",
      "highlights": [
        "05:00 AM pickup from Islamabad",
        "Scenic drive via Murree Expressway",
        "Photo stop at Kohala Bridge",
        "Arrival in Muzaffarabad and breakfast stop",
        "Visit Dhanni Waterfall",
        "Drive towards Sharda",
        "Leisure time and sightseeing",
        "Bonfire & musical night",
        "Dinner & overnight stay in Sharda"
      ]
    },
    {
      "day": 2,
      "title": "Sharda to Taobat (Jeep Safari)",
      "description": "",
      "highlights": [
        "Breakfast at hotel in Sharda",
        "Transfer to 4x4 jeeps",
        "Scenic drive towards Taobat",
        "Pass through Janwai and Sardari villages",
        "Explore Taobat village and surroundings",
        "Photography and sightseeing",
        "Return to Sharda",
        "Overnight stay in Sharda"
      ]
    },
    {
      "day": 3,
      "title": "Sharda, Kel & Arang Kel",
      "description": "",
      "highlights": [
        "Breakfast at hotel in Sharda",
        "Visit historic Sharda University",
        "Drive to Kel",
        "Hike to Arang Kel meadow",
        "Photography and sightseeing",
        "Return to Keran by evening",
        "Dinner & overnight stay in Keran"
      ]
    },
    {
      "day": 4,
      "title": "Kutton Waterfall & Return to Islamabad",
      "description": "",
      "highlights": [
        "Breakfast at hotel in Keran",
        "Drive to Upper Neelum",
        "Visit Kutton Waterfall",
        "Photography and sightseeing",
        "Return journey to Islamabad",
        "Arrival around 08:00 PM (+/- 2 hours)",
        "Tour ends with unforgettable memories"
      ]
    }
  ],
  "included": [
    "Private Transport (Coaster 5C New Model)",
    "Fuel & Toll Tax",
    "3 Nights Accommodation",
    "4 Breakfasts & 3 Dinners",
    "4x4 Jeep for Taobat visit",
    "Tour Guide"
  ],
  "notIncluded": [
    "Entry or activity tickets",
    "Boating expenses",
    "Personal expenses",
    "Horse riding / skiing charges"
  ],
  "featured": false
},
{
  "id": "8",
  "name": "Day Trip to Islamabad",
  "location": "Islamabad, Pakistan",
  "region": "Islamabad",
  "duration": 1,
  "description": "A full-day guided city tour of Pakistan’s modern capital. Explore iconic landmarks, cultural museums, scenic hilltop views, heritage villages, and vibrant local markets.",
  "image": "/images/tours/Picture2.jpg",
  "galleryImages": [
    "/images/tours/Picture2.jpg",
    "/images/tours/Picture1.jpg",
    "/images/tours/Picture3.jpg",
    "/images/tours/Picture4.jpg"
  ],
  "categories": ["Private"],
  "packageTypes": ["City Tour", "Private"],
  "transport": "By Road",
  "basePrice": 25000,
   "packages": [
    {
      "category": "Deluxe",
      "price": 25000,
      "features": [
        "For 2 Persons"
      ]
    },
    {
      "category": "Executive",
      "price": 35000,
      "features": [
        "For 2 Persons"
      ]
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "title": "Islamabad City Tour",
      "description": "",
      "highlights": [
        "09:00 AM visit to Faisal Mosque",
        "Admire mosque architecture and Margalla Hills backdrop",
        "Visit Pakistan Monument & Shakarparian viewpoint",
        "Lunch at Monal Restaurant with panoramic city views",
        "Explore Lok Virsa Museum",
        "Evening walk at Saidpur Village",
        "Shopping at Jinnah Super Market (F-7)",
        "Dinner and nightlife experience at F-10 Markaz",
        "Enjoy local BBQ, chai, and street food"
      ]
    }
  ],
  "included": [
    "Private Transport (GLI Car – New Model)",
    "Fuel & Toll Tax",
    "Tour Guide (if required)"
  ],
  "notIncluded": [
    "Lunch, dinner & entry tickets",
    "Personal expenses",
    "Recreation activities, boating, jeep rides"
  ],
  "featured": false
},
{
  "id": "9",
  "name": "2 Days Islamabad City Tour",
  "location": "Islamabad, Pakistan",
  "region": "Islamabad",
  "duration": 2,
  "description": "A complete 2-day Islamabad city experience covering iconic landmarks, museums, scenic hills, heritage sites, local markets, and famous food spots with a comfortable overnight stay.",
  "image": "/images/tours/Picture2.jpg",
  "galleryImages": [
    "/images/tours/Picture2.jpg",
    "/images/tours/Picture1.jpg",
    "/images/tours/Picture3.jpg",
    "/images/tours/Picture4.jpg"
  ],
  "categories": ["Deluxe", "Executive"],
  "packageTypes": ["City Tour", "Private"],
  "transport": "By Road",
  "basePrice": 40000,
  "packages": [
    {
      "category": "Deluxe",
      "price": 40000,
      "features": [
        "Roomy Signature / Grand Islamabad"
      ]
    },
    {
      "category": "Executive",
      "price": 60000,
      "features": [
        "Serena Hotel / Hill View Hotel Islamabad"
      ]
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "title": "Islamabad City Highlights",
      "description": "",
      "highlights": [
        "09:00 AM visit to Faisal Mosque",
        "Explore Lok Virsa Museum",
        "Lunch at Monal Restaurant with city views",
        "Visit Pakistan Monument & Shakarparian",
        "Relax at Rawal Lake",
        "Dinner at Saidpur Village",
        "Evening shopping or movie at Centaurus Mall",
        "Local street vibe and chai at F-10 Markaz",
        "Overnight stay at hotel in Islamabad"
      ]
    },
    {
      "day": 2,
      "title": "Nature, Heritage & Markets",
      "description": "",
      "highlights": [
        "Morning visit to Margalla Hills (Trail 3 or Daman-e-Koh)",
        "Explore Shah Allah Ditta Caves",
        "Lunch at Kohsar Market (F-6)",
        "Visit Golra Sharif Railway Museum",
        "Shopping at Jinnah Super Market (F-7)",
        "Farewell dinner at Kabul Restaurant or local BBQ",
        "Optional stop at Savour Foods",
        "Return home with lifelong memories"
      ]
    }
  ],
  "included": [
    "Private Transport (GLI Car – New Model)",
    "Fuel & Toll Tax",
    "1 Night Accommodation",
    "1 Breakfast"
  ],
  "notIncluded": [
    "Lunch, dinner & entry tickets",
    "Personal expenses",
    "Recreation activities, boating, jeep rides"
  ],
  "featured": false
},
{
  "id": "10",
  "name": "5 Days Hunza Valley Tour (By Air) – Private",
  "location": "Hunza Valley, Gilgit-Baltistan, Pakistan",
  "region": "Hunza",
  "duration": 5,
  "description": "A premium 5-day private tour to Hunza Valley by air. Fly to Skardu, travel along the Karakoram Highway, explore ancient forts, turquoise lakes, suspension bridges, and enjoy breathtaking mountain panoramas with luxury accommodation options.",
  "image": "/images/tours/Picture2.jpg",
  "galleryImages": [
    "/images/tours/Picture2.jpg",
    "/images/tours/Picture1.jpg",
    "/images/tours/Picture3.jpg",
    "/images/tours/Picture4.jpg"
  ],
  "categories": ["Deluxe", "Executive", "Luxury"],
  "packageTypes": ["Private", "Couple", "Family"],
  "transport": "By Air & Road",
  "basePrice": 350000,
  "packages": [
    {
      "category": "Deluxe",
      "price": 350000,
      "features": [
        "Shaheen Resort Hunza / Hunza Blossom Inn / Karakoram Hotel / Hotel Himalaya"
      ]
    },
    {
      "category": "Executive",
      "price": 470000,
      "features": [
        "Hard Rock Hunza Resort / Best Western Hunza / Roomy Villas Resort / Khar Resort Hunza"
      ]
    },
    {
      "category": "Luxury",
      "price": 530000,
      "features": [
        "Horizon Resort Attabad Lake (Deluxe Room) or Offto Resort Hunza"
      ]
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "title": "Fly to Skardu & Transfer to Hunza",
      "description": "",
      "highlights": [
        "Morning flight from Islamabad to Skardu",
        "Scenic road journey towards Hunza Valley",
        "Drive along the Karakoram Highway (KKH)",
        "Stop at Astak Nala and mountain confluence",
        "Lunch stop at Rakaposhi View Point",
        "Arrival in Karimabad, Hunza",
        "Hotel check-in and rest",
        "Overnight stay in Hunza"
      ]
    },
    {
      "day": 2,
      "title": "Hunza History & Sunset Views",
      "description": "",
      "highlights": [
        "Breakfast at hotel",
        "Visit Baltit Fort or Altit Fort",
        "Explore Karimabad Bazaar",
        "Shop for local handicrafts and Hunzai products",
        "Sunset visit to Duikar (Eagle’s Nest)",
        "Panoramic views of Ultar Sar and Ladyfinger Peak",
        "Overnight stay in Hunza"
      ]
    },
    {
      "day": 3,
      "title": "Upper Hunza & Attabad Lake",
      "description": "",
      "highlights": [
        "Breakfast at hotel",
        "Visit Attabad Lake",
        "Explore Passu Cones",
        "Walk on Hussaini Suspension Bridge",
        "Optional drive towards Sost (weather permitting)",
        "Explore Gojal Valley",
        "Photography and sightseeing",
        "Overnight stay in Hunza"
      ]
    },
    {
      "day": 4,
      "title": "Hunza to Skardu Road Journey",
      "description": "",
      "highlights": [
        "Breakfast at hotel",
        "Drive back from Hunza to Skardu",
        "Photo stops at scenic viewpoints",
        "Approximate travel time: 8–10 hours",
        "Arrival in Skardu city",
        "Visit Skardu Bazaar for souvenirs",
        "Overnight stay in Skardu"
      ]
    },
    {
      "day": 5,
      "title": "Departure to Islamabad",
      "description": "",
      "highlights": [
        "Breakfast at hotel",
        "Transfer to Skardu Airport",
        "Return flight to Islamabad",
        "Tour ends with unforgettable memories"
      ]
    }
  ],
  "included": [
    "Return air tickets (one-way window seat)",
    "Private Transport (Parado TZ – New Model)",
    "Fuel & Toll Tax",
    "4 Nights Accommodation",
    "4 Breakfasts"
  ],
  "notIncluded": [
    "Lunch & dinner",
    "Personal expenses",
    "Recreation activities, boating, jeep rides"
  ],
  "featured": false
},
{
  "id": "11",
  "name": "6 Days Skardu & Hunza Tour (By Air) – Private",
  "location": "Skardu & Hunza Valley, Gilgit-Baltistan, Pakistan",
  "region": "Hunza",
  "duration": 6,
  "description": "A premium 6-day private tour combining Skardu and Hunza by air. Enjoy scenic flights, alpine lakes, ancient forts, turquoise Attabad Lake, Karakoram Highway road journeys, and luxury mountain stays.",
  "image": "/images/tours/Picture2.jpg",
  "galleryImages": [
    "/images/tours/Picture2.jpg",
    "/images/tours/Picture1.jpg",
    "/images/tours/Picture3.jpg",
    "/images/tours/Picture4.jpg"
  ],
  "categories": ["Deluxe", "Executive", "Luxury"],
  "packageTypes": ["Private", "Couple", "Family"],
  "transport": "By Air & Road",
  "basePrice": 450000,
  "packages": [
    {
      "category": "Deluxe",
      "price": 450000,
      "features": [
        "Summit Embassy Hotel / Qayyam Skardu (2 Nights)",
        "Qayyam Resort Hunza / Roomy Dastan Hunza (3 Nights)"
      ]
    },
    {
      "category": "Executive",
      "price": 510000,
      "features": [
        "Khar Resort / Guman Resort / PC Legacy / Rivage Resort Skardu",
        "Hard Rock Hunza Resort / Roomy Villas Hunza"
      ]
    },
    {
      "category": "Luxury",
      "price": 620000,
      "features": [
        "Khoj Resorts or Rivage Resort Skardu (Executive Rooms)",
        "Horizon Resort Attabad Lake (Deluxe Room) or Offto Resort Hunza"
      ]
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "title": "Fly to Skardu & Kachura Lakes",
      "description": "",
      "highlights": [
        "Morning scenic flight from Islamabad to Skardu",
        "Meet & greet at Skardu International Airport",
        "Visit Shangri-La Resort (Lower Kachura Lake)",
        "Explore Upper Kachura Lake",
        "Visit Soq Valley",
        "Sunset views and leisure time",
        "Overnight stay in Skardu"
      ]
    },
    {
      "day": 2,
      "title": "Skardu to Hunza via Karakoram Highway",
      "description": "",
      "highlights": [
        "Early breakfast and hotel checkout",
        "Drive from Skardu to Hunza",
        "Travel along Skardu Road and Karakoram Highway (KKH)",
        "Stop at Astak Nala (mountain confluence)",
        "Lunch stop at Rakaposhi View Point",
        "Arrival in Karimabad, Hunza",
        "Hotel check-in and rest",
        "Overnight stay in Hunza"
      ]
    },
    {
      "day": 3,
      "title": "Hunza Heritage & Eagle’s Nest",
      "description": "",
      "highlights": [
        "Breakfast at hotel",
        "Visit Altit Fort or Baltit Fort",
        "Explore Karimabad Bazaar",
        "Shop for local Hunzai products",
        "Sunset visit to Duikar (Eagle’s Nest)",
        "Panoramic views of Ultar Sar and Ladyfinger Peak",
        "Overnight stay in Hunza"
      ]
    },
    {
      "day": 4,
      "title": "Upper Hunza & Gojal Valley",
      "description": "",
      "highlights": [
        "Breakfast at hotel",
        "Full-day excursion to Upper Hunza (Gojal Valley)",
        "Visit Attabad Lake",
        "Explore Passu Cones",
        "Walk on Hussaini Suspension Bridge",
        "Optional drive towards Sost (weather permitting)",
        "Photography and sightseeing",
        "Overnight stay in Hunza"
      ]
    },
    {
      "day": 5,
      "title": "Hunza to Skardu Road Journey",
      "description": "",
      "highlights": [
        "Breakfast at hotel",
        "Drive back from Hunza to Skardu",
        "Scenic photo stops along the way",
        "Approximate travel time: 8–10 hours",
        "Arrival in Skardu",
        "Visit Skardu Bazaar for souvenirs",
        "Overnight stay in Skardu"
      ]
    },
    {
      "day": 6,
      "title": "Departure to Islamabad",
      "description": "",
      "highlights": [
        "Breakfast at hotel",
        "Transfer to Skardu Airport",
        "Return flight to Islamabad",
        "Tour ends with unforgettable memories"
      ]
    }
  ],
  "included": [
    "Return air tickets (one-way window seat)",
    "Private Transport (Parado TZ – New Model)",
    "Fuel & Toll Tax",
    "5 Nights Accommodation",
    "5 Breakfasts"
  ],
  "notIncluded": [
    "Lunch & dinner",
    "Personal expenses",
    "Recreation activities, boating, jeep rides"
  ],
  "featured": false
},
{
  "id": "12",
  "name": "8 Days Hunza & Skardu Tour (By Air) – Private",
  "location": "Skardu & Hunza Valley, Gilgit-Baltistan, Pakistan",
  "region": "Hunza",
  "duration": 8,
  "description": "A premium 8-day private tour combining Skardu and Hunza by air. Experience scenic flights, alpine lakes, cold deserts, ancient forts, turquoise Attabad Lake, and breathtaking Karakoram Highway road journeys with comfortable mountain stays.",
  "image": "/images/tours/Picture2.jpg",
  "galleryImages": [
    "/images/tours/Picture2.jpg",
    "/images/tours/Picture1.jpg",
    "/images/tours/Picture3.jpg",
    "/images/tours/Picture4.jpg"
  ],
  "categories": ["Deluxe", "Executive", "Luxury"],
  "packageTypes": ["Private", "Couple", "Family"],
  "transport": "By Air & Road",
  "basePrice": 435000,
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival & Kachura Lakes",
      "description": "",
      "highlights": [
        "Morning flight from Islamabad to Skardu (one of the world’s most scenic flights).",
        "Meet & greet at Skardu International Airport and transfer to hotel.",
        "Visit Shangri-La Resort (Lower Kachura Lake).",
        "Explore Upper Kachura Lake and Soq Valley.",
        "Evening leisure time and sunset views.",
        "Overnight stay in Skardu."
      ]
    },
    {
      "day": 2,
      "title": "Waterfalls & Cold Desert",
      "description": "",
          "highlights": [
        "Breakfast at hotel.",
        "Drive to Manthokha Waterfall.",
        "Photo stop at Chocolate Rock.",
        "Evening visit to Sarfaranga Cold Desert.",
        "Overnight stay in Skardu."
      ]
    },
    {
      "day": 3,
      "title": "Lakes & Ancient Forts",
    "description": "",
          "highlights": [
        "Breakfast at hotel.",
        "Visit Shigar Fort.",
        "Explore Blind Lake.",
        "Visit Sadpara Lake and Buddha Rock (7th-century carving).",
        "Overnight stay in Skardu."
      ]
    },
    {
      "day": 4,
      "title": "Skardu to Hunza via Karakoram Highway",
      "description": "",
          "highlights": [
        "Early breakfast and hotel checkout.",
        "Drive from Skardu to Karimabad via Skardu Road & KKH.",
        "Stop at Astak Nala (confluence of three mountain ranges).",
        "Lunch stop at Rakaposhi Viewpoint.",
        "Arrival in Karimabad, Hunza.",
        "Overnight stay in Hunza."
      ]
    },
    {
      "day": 5,
      "title": "Hunza Culture & Sunset Views",
     "description": "",
          "highlights": [
        "Breakfast at hotel.",
        "Visit Altit Fort or Baltit Fort.",
        "Explore Karimabad Bazaar for local handicrafts.",
        "Sunset visit to Duikar (Eagle’s Nest).",
        "Overnight stay in Hunza."
      ]
    },
    {
      "day": 6,
      "title": "Upper Hunza / Gojal Valley",
       "description": "",
          "highlights": [
        "Breakfast at hotel.",
        "Drive to Upper Hunza (Gojal Valley).",
        "Visit Attabad Lake.",
        "Explore Passu Cones and Hussaini Suspension Bridge.",
        "Optional visit towards Sost (weather permitting).",
        "Overnight stay in Hunza."
      ]
    },
    {
      "day": 7,
      "title": "Hunza to Skardu Return Journey",
      "description": "",
          "highlights": [
        "Breakfast at hotel.",
        "Drive back from Hunza to Skardu (8–10 hours).",
        "Photo stops along the way.",
        "Visit Skardu Bazaar for souvenirs.",
        "Overnight stay in Skardu."
      ]
    },
    {
      "day": 8,
      "title": "Departure to Islamabad",
   "description": "",
          "highlights": [
        "Breakfast at hotel.",
        "Transfer to Skardu Airport.",
        "Flight back to Islamabad with unforgettable memories."
      ]
    }
  ],

  "included": [
    "Air Tickets (Both Sides – One Way Window Seat)",
    "Private Transport (Parado TZ 2004–07 New Model)",
    "Fuel & Toll Taxes",
    "7 Nights Accommodation",
    "8 Breakfasts"
  ],

  "notIncluded": [
    "Lunch & Dinner",
    "Personal Expenses",
    "Recreation activities, boating, jeeps, etc."
  ],

  "packages": [
    {
      "category": "Deluxe",
      "price": 435000,
      "features": [
        "Hotel Himalaya / Summit Embassy Hotel (Skardu)",
        "Shaheen Resort Hunza / Hunza Blossom Inn (Hunza)"
      ]
    },
    {
      "category": "Executive",
      "price": 580000,
      "features": [
        "Khar Resort Skardu / PC Legacy / Rivage Resort Skardu",
        "Hard Rock Hunza Resort / Roomy Villas Hunza"
      ]
    },
    {
      "category": "Luxury",
      "price": 690000,
      "features": [
        "Khoj Resorts / Rivage Resort Skardu",
        "Horizon Resort Attabad Lake / Offto Resort Hunza"
      ]
    }
  ]
},

{
  "id": "13",
  "name": "10 Days Skardu & Hunza Blossom Tour (By Air) – Private",
  "location": "Skardu & Hunza Valley, Gilgit-Baltistan, Pakistan",
  "region": "Hunza",
  "duration": 10,
  "description": "A premium 10-day private Blossom Tour to Skardu and Hunza by air. Experience spring blooms, alpine lakes, historic forts, waterfalls, glaciers, turquoise Attabad Lake, Upper Hunza, Nagar Valley, and breathtaking Karakoram landscapes with scenic flights and luxury mountain stays.",
  "image": "/images/tours/Picture3.jpg",
  "galleryImages": [
    "/images/tours/Picture3.jpg",
    "/images/tours/Picture1.jpg",
    "/images/tours/Picture2.jpg",
    "/images/tours/Picture4.jpg"
  ],
  "categories": ["Deluxe", "Executive", "Luxury"],
  "packageTypes": ["Private", "Couple", "Family"],
  "transport": "By Air & Road",
  "basePrice": 550000,
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival & Kachura Lakes",
      "description": "",
          "highlights": [
        "Morning flight from Islamabad to Skardu (one of the world’s most scenic flights).",
        "Meet & greet at Skardu International Airport and transfer to hotel.",
        "Visit Shangri-La Resort (Lower Kachura Lake).",
        "Explore Upper Kachura Lake and Soq Valley.",
        "Evening leisure time and sunset views.",
        "Overnight stay in Skardu."
      ]
    },
    {
      "day": 2,
      "title": "Shigar Valley Heritage Tour",
      "description": "",
          "highlights": [
        "Breakfast at hotel.",
        "Drive to Shigar Valley.",
        "Visit Shigar Fort (Fong Khar) and museum.",
        "Walk through fort gardens and courtyards.",
        "Visit Amburiq Mosque (one of the oldest mosques in the region).",
        "Explore Blind Lake.",
        "Overnight stay in Shigar."
      ]
    },
    {
      "day": 3,
      "title": "Khaplu Valley & Waterfalls",
    "description": "",
          "highlights": [
        "Breakfast at hotel.",
        "Drive to Manthokha Waterfall.",
        "Photo stop at Chocolate Rock.",
        "Visit Khaplu Palace (Yabgo Khar).",
        "Explore Chaqchan Mosque (700 years old).",
        "Return to Skardu.",
        "Overnight stay in Skardu."
      ]
    },
    {
      "day": 4,
      "title": "Lakes & Ancient Carvings",
      "description": "",
          "highlights": [
        "Breakfast at hotel.",
        "Visit Sadpara Lake.",
        "Optional activities: photography and sightseeing.",
        "Visit Buddha Rock (7th-century Buddhist carving).",
        "Free time at Skardu Bazaar for shopping.",
        "Overnight stay in Skardu."
      ]
    },
    {
      "day": 5,
      "title": "Skardu to Hunza via Karakoram Highway",
       "description": "",
          "highlights": [
        "Early breakfast and departure for Hunza Valley.",
        "Drive along the Indus River and dramatic mountain gorges.",
        "Pass traditional mountain villages.",
        "Arrive in Karimabad, Hunza.",
        "View Rakaposhi, Ultar Peak, and Lady Finger Peak.",
        "Overnight stay in Hunza (Karimabad)."
      ]
    },
    {
      "day": 6,
      "title": "Hunza History & Sunset Panorama",
       "description": "",
          "highlights": [
        "Breakfast at hotel.",
        "Visit Baltit Fort (700 years old).",
        "Visit Altit Fort and Altit Suspension Bridge.",
        "Explore Karimabad Bazaar.",
        "Drive to Eagle’s Nest (Duikar) for sunset views.",
        "Overnight stay in Hunza."
      ]
    },
    {
      "day": 7,
      "title": "Upper Hunza & Attabad Lake",
   "description": "",
          "highlights": [
        "Breakfast at hotel.",
        "Visit Attabad Lake (optional boating).",
        "Drive to Passu Village.",
        "Explore Passu Cones and Passu Suspension Bridge.",
        "Visit Borith Lake.",
        "Overnight stay in Hunza."
      ]
    },
    {
      "day": 8,
      "title": "Nagar Valley & Hopper Glacier",
     "description": "",
          "highlights": [
        "Breakfast at hotel.",
        "Drive to Nagar Valley.",
        "Visit Hopper Glacier viewpoint.",
        "Walk through meadows and glacier landscapes.",
        "Visit local handicraft centers.",
        "Overnight stay in Hunza."
      ]
    },
    {
      "day": 9,
      "title": "Hunza to Gilgit & Skardu",
  "description": "",
          "highlights": [
        "Breakfast at hotel.",
        "Drive to Gilgit city.",
        "Visit Kargah Buddha and Kargah Nala.",
        "Explore Gilgit Bazaar.",
        "Return to Skardu.",
        "Overnight stay in Skardu."
      ]
    },
    {
      "day": 10,
      "title": "Departure to Islamabad",
   "description": "",
          "highlights": [
        "Breakfast at hotel.",
        "Transfer to Skardu Airport.",
        "Flight back to Islamabad with unforgettable memories."
      ]
    }
  ],

  "included": [
    "Air Tickets (Both Sides – One Way Window Seat)",
    "Private Transport (Parado TZ 2004–07 New Model)",
    "Fuel & Toll Taxes",
    "9 Nights Accommodation",
    "9 Breakfasts"
  ],

  "notIncluded": [
    "Lunch & Dinner",
    "Personal Expenses",
    "Entry tickets, recreation activities, boating, jeeps, etc."
  ],

  "packages": [
    {
      "category": "Deluxe",
      "price": 550000,
      "features": [
        "Al Noor Starlet Hotel / Dirleh Resort (Skardu)",
        "Shaheen Resort Hunza / Hunza Blossom Inn (Hunza)"
      ]
    },
    {
      "category": "Executive",
      "price": 680000,
      "features": [
        "Khar Resort Skardu / PC Legacy / Rivage Resort Skardu",
        "Hard Rock Hunza Resort / Roomy Villas Hunza"
      ]
    },
    {
      "category": "Luxury",
      "price": 760000,
      "features": [
        "Khoj Resorts / Rivage Resort Skardu",
        "Horizon Resort Attabad Lake / Offto Resort Hunza"
      ]
    }
  ]
},

{
  "id": "14",
  "name": "5 Days Fairy Meadows & Skardu Tour (By Air) – Private",
  "location": "Fairy Meadows & Skardu, Gilgit-Baltistan, Pakistan",
  "region": "Fairy Meadows",
  "duration": 5,
  "description": "A breathtaking 5-day private adventure combining Fairy Meadows and Skardu by air. Experience the iconic Nanga Parbat, Fairy Meadows trekking, alpine lakes, scenic jeep rides, and the unmatched beauty of Baltistan with comfortable stays and unforgettable mountain views.",
  "image": "/images/tours/Picture3.jpg",
  "galleryImages": [
    "/images/tours/Picture3.jpg",
    "/images/tours/Picture2.jpg",
    "/images/tours/Picture1.jpg",
    "/images/tours/Picture4.jpg"
  ],
  "categories": ["Single", "Solo", "Couple"],
  "packageTypes": ["Private", "Couple", "Family"],
  "transport": "By Air & Road",
  "basePrice": 450000,

  "packages": [
    {
      "category": "Deluxe",
      "price": 450000,
      "features": [
        "Deluxe Hotels in Skardu",
        "Fairy Meadows Camping / Huts",
        "Shared Accommodation"
      ]
    },
    {
      "category": "Executive",
      "price": 500000,
      "features": [
        "Executive Hotels in Skardu",
        "Fairy Meadows Lodge Stay",
        "Private Comfortable Rooms"
      ]
    },
    {
      "category": "Luxury",
      "price": 580000,
      "features": [
        "Luxury Resorts in Skardu",
        "Premium Fairy Meadows Lodge",
        "Maximum Comfort & Privacy"
      ]
    }
  ],

  "itinerary": [
    {
      "day": 1,
      "title": "Arrival in Skardu & Kachura Lakes",
      "description": "",
      "highlights": [
        "Morning scenic flight from Islamabad to Skardu",
        "Meet & greet at Skardu Airport",
        "Visit Shangri-La Resort (Lower Kachura Lake)",
        "Explore Upper Kachura Lake",
        "Visit hidden Soq Valley",
        "Evening leisure time and sunset views",
        "Overnight stay in Skardu"
      ]
    },
    {
      "day": 2,
      "title": "Skardu to Fairy Meadows",
      "description": "",
      "highlights": [
        "Early breakfast at hotel",
        "Drive from Skardu to Raikot Bridge",
        "Transfer to 4x4 jeeps for Tattu Village",
        "Trek to Fairy Meadows campsite",
        "First views of Nanga Parbat",
        "Dinner and overnight stay at Fairy Meadows (camp/hut)"
      ]
    },
    {
      "day": 3,
      "title": "Nanga Parbat Base Camp Trek",
      "description": "",
      "highlights": [
        "Breakfast with iconic Nanga Parbat view",
        "Trek to Bayal Camp",
        "Optional trek towards Nanga Parbat Base Camp (for fit trekkers)",
        "Photography and leisure time",
        "Experience the world’s 9th highest mountain",
        "Overnight stay at Fairy Meadows"
      ]
    },
    {
      "day": 4,
      "title": "Fairy Meadows to Skardu",
      "description": "",
      "highlights": [
        "Morning at Fairy Meadows",
        "Descent trek back to Tattu Village",
        "4x4 jeep ride to Raikot Bridge",
        "Drive back to Skardu City",
        "Hotel check-in and rest",
        "Overnight stay in Skardu"
      ]
    },
    {
      "day": 5,
      "title": "Departure to Islamabad",
      "description": "",
      "highlights": [
        "Breakfast at hotel",
        "Transfer to Skardu International Airport",
        "Scenic return flight to Islamabad",
        "Tour ends with unforgettable memories"
      ]
    }
  ],

  "included": [
    "Air Tickets (Both Sides – One Way Window Seat)",
    "Private Transport (Parado TZ 2004–07 New Model)",
    "Fuel & Toll Taxes",
    "4 Nights Accommodation",
    "5 Breakfasts",
    "4x4 Jeep for Fairy Meadows",
    "Basic Trek Assistance"
  ],

  "notIncluded": [
    "Lunch & Dinner",
    "Personal expenses",
    "Porter charges",
    "Boating or extra activities",
    "Anything not mentioned in included services"
  ],

  "featured": false
},


{
  "id": "16",
  "name": "5 Days By Air Trip to Astore, Minimarg & Skardu (Couple)",
  "location": "Astore, Minimarg & Skardu, Gilgit-Baltistan, Pakistan",
  "region": "Astore",
  "duration": 5,
  "description": "A romantic 5-day by-air couple getaway to Astore, Minimarg, and Skardu. Explore the breathtaking Kachura Lakes, Burzil Top, Rainbow Lake of Minimarg near the Indian border, and the scenic valleys of Baltistan with comfortable stays and private transport.",
  "image": "/images/tours/Picture4.jpg",
  "galleryImages": [
    "/images/tours/Picture4.jpg",
    "/images/tours/Picture1.jpg",
    "/images/tours/Picture2.jpg",
    "/images/tours/Picture3.jpg"
  ],
  "categories": ["Couple"],
  "packageTypes": ["Private", "Couple"],
  "transport": "By Air & Road",
  "basePrice": 430000,

  "packages": [
    {
      "category": "Deluxe",
      "price": 430000,
      "features": [
        "Minimarg Camping Side (2 Nights)",
        "Qayyam Hotel Skardu – Deluxe Room (2 Nights)",
        "Comfortable Couple Accommodation"
      ]
    },
    {
      "category": "Executive",
      "price": 490000,
      "features": [
        "Khar Hotel Skardu – Deluxe Room (1 Night)",
        "Minimarg Camping Side (2 Nights)",
        "Khoj Resort Skardu – Deluxe Room (1 Night)"
      ]
    },
    {
      "category": "Luxury",
      "price": 580000,
      "features": [
        "Minimarg Army Camping Side (2 Nights)",
        "Khoj Resort Skardu – Deluxe Room (2 Nights)",
        "Premium Comfort & Privacy"
      ]
    }
  ],

  "itinerary": [
    {
      "day": 1,
      "title": "Arrival in Skardu & Kachura Lakes",
      "description": "",
      "highlights": [
        "Morning scenic flight from Islamabad to Skardu",
        "Meet & greet at Skardu International Airport",
        "Visit Shangri-La Resort (Lower Kachura Lake)",
        "Explore Upper Kachura Lake",
        "Visit hidden Soq Valley",
        "Evening leisure time and sunset views",
        "Dinner & overnight stay at hotel in Skardu"
      ]
    },
    {
      "day": 2,
      "title": "Burzil Top – Roof of the World",
      "description": "",
      "highlights": [
        "Early breakfast at hotel",
        "Drive towards Astore Valley",
        "Visit Burzil Top (Roof of the World)",
        "Photography and sightseeing",
        "Continue journey towards Minimarg",
        "Dinner & overnight stay at Minimarg camping side"
      ]
    },
    {
      "day": 3,
      "title": "Minimarg & Rainbow Lake",
      "description": "",
      "highlights": [
        "Breakfast at Minimarg",
        "Explore Minimarg village near Indian border",
        "Visit Kargil base camp area",
        "Excursion to Rainbow Lake of Minimarg",
        "Photography and leisure time",
        "Return to camping site",
        "Dinner & overnight stay at Minimarg"
      ]
    },
    {
      "day": 4,
      "title": "Minimarg to Skardu",
      "description": "",
      "highlights": [
        "Breakfast at Minimarg",
        "Drive back via Astore Valley",
        "Scenic stops along the way",
        "Arrival in Skardu",
        "Optional shopping at Skardu Bazaar",
        "Dinner & overnight stay at hotel in Skardu"
      ]
    },
    {
      "day": 5,
      "title": "Departure to Islamabad",
      "description": "",
      "highlights": [
        "Breakfast at hotel",
        "Transfer to Skardu International Airport",
        "Return scenic flight to Islamabad",
        "Tour ends with unforgettable memories"
      ]
    }
  ],

  "included": [
    "Air Tickets (Both Sides – One Way Window Seat)",
    "Private Transport (Parado TZ 2004–07 New Model)",
    "Fuel & Toll Taxes",
    "4 Nights Accommodation",
    "5 Breakfasts",
    "All Sightseeing as per itinerary"
  ],

  "notIncluded": [
    "Lunch & Dinner",
    "Personal expenses",
    "Recreation activities",
    "Boating or jeep rides not mentioned",
    "Anything not mentioned in included services"
  ],

  "featured": true
},
{
  "id": "15",
  "name": "6 Days By Air Trip to Astore, Minimarg & Skardu (Couple)",
  "location": "Astore, Minimarg & Skardu, Gilgit-Baltistan, Pakistan",
  "region": "Astore",
  "duration": 6,
  "description": "A romantic 6-day by-air couple adventure to Astore, Minimarg, and Skardu. Experience the beauty of Kachura Lakes, Rama Meadows, Tarishing, Burzil Top, Rainbow Lake near the Indian border, and the scenic valleys of Baltistan with private transport and comfortable stays.",
  "image": "/images/tours/Picture5.jpg",
  "galleryImages": [
    "/images/tours/Picture5.jpg",
    "/images/tours/Picture1.jpg",
    "/images/tours/Picture2.jpg",
    "/images/tours/Picture3.jpg"
  ],
  "categories": ["Couple"],
  "packageTypes": ["Private", "Couple"],
  "transport": "By Air & Road",
  "basePrice": 530000,

  "packages": [
    {
      "category": "Deluxe",
      "price": 530000,
      "features": [
        "Rama Meadows Camping Side (1 Night)",
        "Minimarg Camping Side (1 Night)",
        "Tarishing Camping Side (1 Night)",
        "Qayyam Hotel Skardu – Deluxe Room (2 Nights)",
        "Comfortable Couple Accommodation"
      ]
    },
    {
      "category": "Executive",
      "price": 580000,
      "features": [
        "Rama Meadows Camping Side (1 Night)",
        "Minimarg Camping Side (1 Night)",
        "Tarishing Camping Side (1 Night)",
        "Khar Hotel Skardu – Deluxe Room (1 Night)",
        "Khoj Resort Skardu – Deluxe Room (1 Night)"
      ]
    },
    {
      "category": "Luxury",
      "price": 640000,
      "features": [
        "Rama Meadows Camping Side (1 Night)",
        "Minimarg Camping Side (1 Night)",
        "Tarishing Camping Side (1 Night)",
        "Khoj Resort Skardu – Deluxe Room (2 Nights)",
        "Premium Comfort & Privacy"
      ]
    }
  ],

  "itinerary": [
    {
      "day": 1,
      "title": "Arrival in Skardu & Kachura Lakes",
      "description": "",
      "highlights": [
        "Morning scenic flight from Islamabad to Skardu",
        "Meet & greet at Skardu International Airport",
        "Visit Shangri-La Resort (Lower Kachura Lake)",
        "Explore Upper Kachura Lake",
        "Visit hidden Soq Valley",
        "Evening leisure time and sunset views",
        "Dinner & overnight stay at hotel in Skardu"
      ]
    },
    {
      "day": 2,
      "title": "Rama Meadows – Gateway to Nanga Parbat",
      "description": "",
      "highlights": [
        "Breakfast at hotel",
        "Drive towards Astore Valley",
        "Visit Rama Meadows surrounded by pine forests",
        "Optional jeep ride to Rama Lake",
        "Enjoy views of Nanga Parbat",
        "Dinner & overnight stay at Rama Meadows camping"
      ]
    },
    {
      "day": 3,
      "title": "Tarishing & Rupal Face Experience",
      "description": "",
      "highlights": [
        "Open-air breakfast at Rama Meadows",
        "Travel to Tarishing village",
        "Explore Rupal Face of Nanga Parbat",
        "Interact with locals and experience village life",
        "Short hike to scenic viewpoints",
        "Cultural evening with locals",
        "Overnight stay at Tarishing guesthouse or camp"
      ]
    },
    {
      "day": 4,
      "title": "Deosai, Burzil Top & Minimarg",
      "description": "",
      "highlights": [
        "Breakfast and departure towards Deosai National Park",
        "Visit Sadpara Lake and Sheosar Lake",
        "Explore Deosai – Roof of the World",
        "Drive towards Burzil Top",
        "Arrival in Minimarg near Indian border",
        "Visit Rainbow Lake of Minimarg",
        "Dinner & overnight stay at Minimarg camping"
      ]
    },
    {
      "day": 5,
      "title": "Minimarg to Skardu Road Journey",
      "description": "",
      "highlights": [
        "Breakfast at Minimarg",
        "Scenic drive back via Deosai National Park",
        "Arrival in Skardu",
        "Optional shopping at Skardu Bazaar",
        "Overnight stay at hotel in Skardu"
      ]
    },
    {
      "day": 6,
      "title": "Departure to Islamabad",
      "description": "",
      "highlights": [
        "Breakfast at hotel",
        "Transfer to Skardu International Airport",
        "Return scenic flight to Islamabad",
        "Tour ends with unforgettable memories"
      ]
    }
  ],

  "included": [
    "Air Tickets (Both Sides – One Way Window Seat)",
    "Private Transport (Parado TZ 2004–07 New Model)",
    "Fuel & Toll Taxes",
    "5 Nights Accommodation",
    "5 Breakfasts",
    "All sightseeing as per itinerary"
  ],

  "notIncluded": [
    "Lunch & Dinner",
    "Personal expenses",
    "Recreation activities",
    "Boating or jeep rides not mentioned",
    "Anything not mentioned in included services"
  ],

  "featured": false
}








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

