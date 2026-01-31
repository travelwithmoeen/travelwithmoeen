export type TourCategory = "Deluxe" | "Executive" | "Luxury";
export type TourRegion = "Skardu" | "Deosai" | "Minimarg" | "Hunza";
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
    name: "Majestic Swiss Alps Adventure",
    location: "Switzerland",
    region: "Skardu",
    duration: 7,
    description: "Experience the breathtaking beauty of the Swiss Alps with guided mountain treks, scenic train rides, and charming alpine villages.",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
    categories: ["Deluxe", "Executive", "Luxury"],
    packageTypes: ["Couple", "Family"],
    transport: "By Air",
    basePrice: 2499,
    packages: [
      {
        category: "Deluxe",
        price: 2499,
        features: ["4-star hotels", "Daily breakfast", "Guided tours", "Train passes"],
      },
      {
        category: "Executive",
        price: 3799,
        features: ["5-star hotels", "All meals included", "Private guide", "First-class trains", "Spa access"],
      },
      {
        category: "Luxury",
        price: 5999,
        features: ["Luxury chalets", "Gourmet dining", "Helicopter tour", "Private transfers", "24/7 concierge"],
      },
    ],
    itinerary: [
      { day: 1, title: "Arrival in Zurich", description: "Welcome to Switzerland! Transfer to your hotel and evening city tour.", highlights: ["Airport pickup", "Welcome dinner", "City orientation"] },
      { day: 2, title: "Lucerne Discovery", description: "Explore the medieval old town and take a scenic boat ride on Lake Lucerne.", highlights: ["Chapel Bridge", "Lion Monument", "Lake cruise"] },
      { day: 3, title: "Mount Titlis Excursion", description: "Journey to the top of Mount Titlis via rotating cable car.", highlights: ["Glacier cave", "Cliff walk", "Snow activities"] },
      { day: 4, title: "Interlaken & Jungfrau", description: "Travel to Interlaken and ascend to the 'Top of Europe'.", highlights: ["Scenic train ride", "Ice Palace", "Alpine views"] },
      { day: 5, title: "Grindelwald Valley", description: "Hike through stunning alpine meadows and traditional villages.", highlights: ["Mountain hiking", "Swiss lunch", "Village visit"] },
      { day: 6, title: "Zermatt & Matterhorn", description: "Iconic views of the Matterhorn and charming car-free village.", highlights: ["Gornergrat railway", "Matterhorn views", "Chocolate tasting"] },
      { day: 7, title: "Departure", description: "Farewell breakfast and transfer to airport.", highlights: ["Breakfast", "Airport transfer", "Fond memories"] },
    ],
    included: ["Airport transfers", "Accommodation", "Breakfast daily", "Guided tours", "Train passes", "Entrance fees"],
    notIncluded: ["International flights", "Travel insurance", "Personal expenses", "Optional activities", "Gratuities"],
    featured: true,
  },
  {
    id: "2",
    name: "Ancient Wonders of Egypt",
    location: "Egypt",
    region: "Deosai",
    duration: 5,
    description: "Discover the mysteries of ancient Egypt with visits to pyramids, temples, and a Nile cruise through history.",
    image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&q=80",
    categories: ["Deluxe", "Executive"],
    packageTypes: ["Family", "Group"],
    transport: "By Road",
    basePrice: 1899,
    packages: [
      {
        category: "Deluxe",
        price: 1899,
        features: ["4-star hotels", "Daily breakfast", "Expert guides", "Domestic flights"],
      },
      {
        category: "Executive",
        price: 2999,
        features: ["5-star hotels & Nile cruise", "All meals", "Private Egyptologist", "VIP access to sites"],
      },
    ],
    itinerary: [
      { day: 1, title: "Cairo Arrival", description: "Welcome to Egypt! Evening at leisure to explore Khan el-Khalili bazaar.", highlights: ["Airport pickup", "Hotel check-in", "Bazaar visit"] },
      { day: 2, title: "Pyramids of Giza", description: "Marvel at the Great Pyramids and the enigmatic Sphinx.", highlights: ["Great Pyramid", "Sphinx", "Camel ride"] },
      { day: 3, title: "Luxor Temples", description: "Fly to Luxor and explore the Valley of the Kings.", highlights: ["Valley of Kings", "Karnak Temple", "Luxor Temple"] },
      { day: 4, title: "Nile Experience", description: "Cruise the Nile and visit ancient temples along the way.", highlights: ["Nile cruise", "Temple of Edfu", "Sunset sailing"] },
      { day: 5, title: "Departure", description: "Final breakfast and transfer for your flight home.", highlights: ["Breakfast", "Airport transfer", "Departure"] },
    ],
    included: ["Airport transfers", "Accommodation", "Breakfast daily", "Domestic flights", "Entrance fees", "Expert guides"],
    notIncluded: ["International flights", "Visa fees", "Travel insurance", "Personal expenses", "Tips"],
  },
  {
    id: "3",
    name: "Japanese Cultural Immersion",
    location: "Japan",
    region: "Hunza",
    duration: 6,
    description: "From ancient temples to neon-lit streets, experience Japan's unique blend of tradition and innovation.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    categories: ["Executive", "Luxury"],
    packageTypes: ["Couple"],
    transport: "By Air",
    basePrice: 3299,
    packages: [
      {
        category: "Executive",
        price: 3299,
        features: ["Premium ryokans", "Most meals", "JR Pass", "Cultural experiences"],
      },
      {
        category: "Luxury",
        price: 5499,
        features: ["Luxury ryokans", "All meals including Michelin", "Private guides", "Exclusive access"],
      },
    ],
    itinerary: [
      { day: 1, title: "Tokyo Arrival", description: "Welcome to Japan! Check into your hotel in vibrant Shinjuku.", highlights: ["Airport pickup", "Hotel check-in", "Evening walk"] },
      { day: 2, title: "Tokyo Exploration", description: "Discover the contrasts of Tokyo from Senso-ji to Shibuya.", highlights: ["Senso-ji Temple", "Harajuku", "Shibuya crossing"] },
      { day: 3, title: "Mount Fuji & Hakone", description: "Day trip to see iconic Mt. Fuji and relax in Hakone.", highlights: ["Mt. Fuji views", "Lake Ashi cruise", "Hot springs"] },
      { day: 4, title: "Kyoto Traditions", description: "Bullet train to Kyoto for temples and geisha districts.", highlights: ["Shinkansen", "Fushimi Inari", "Gion district"] },
      { day: 5, title: "Nara & Osaka", description: "Visit Nara's deer park and experience Osaka's food scene.", highlights: ["Deer Park", "Osaka Castle", "Street food tour"] },
      { day: 6, title: "Departure", description: "Final tea ceremony experience before heading home.", highlights: ["Tea ceremony", "Airport transfer", "Sayonara"] },
    ],
    included: ["Airport transfers", "Premium accommodation", "JR Pass", "Select meals", "Cultural activities", "English guides"],
    notIncluded: ["International flights", "Travel insurance", "Personal shopping", "Optional activities"],
    featured: true,
  },
  {
    id: "4",
    name: "Serengeti Safari Experience",
    location: "Tanzania",
    region: "Minimarg",
    duration: 4,
    description: "Witness the incredible wildlife of the Serengeti on an unforgettable African safari adventure.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    categories: ["Deluxe", "Luxury"],
    packageTypes: ["Family", "Group"],
    transport: "By Road",
    basePrice: 2799,
    packages: [
      {
        category: "Deluxe",
        price: 2799,
        features: ["Tented camps", "All meals", "Game drives", "Park fees"],
      },
      {
        category: "Luxury",
        price: 4999,
        features: ["Luxury lodges", "Gourmet bush dining", "Private 4x4", "Balloon safari"],
      },
    ],
    itinerary: [
      { day: 1, title: "Arusha Arrival", description: "Arrive in Tanzania and prepare for your safari adventure.", highlights: ["Airport pickup", "Safari briefing", "Lodge dinner"] },
      { day: 2, title: "Serengeti Bound", description: "Enter the Serengeti and begin wildlife spotting.", highlights: ["Scenic drive", "First game drive", "Sunset viewing"] },
      { day: 3, title: "Full Safari Day", description: "Full day of morning and afternoon game drives.", highlights: ["Big Five search", "Picnic lunch", "Night sounds"] },
      { day: 4, title: "Final Drive & Departure", description: "Morning game drive before flying back to Arusha.", highlights: ["Sunrise drive", "Flight back", "Departure"] },
    ],
    included: ["Airport transfers", "Safari accommodation", "All meals on safari", "Game drives", "Park fees", "Professional guide"],
    notIncluded: ["International flights", "Visa fees", "Travel insurance", "Premium beverages", "Gratuities"],
  },
  {
    id: "5",
    name: "Amalfi Coast Romance",
    location: "Italy",
    region: "Skardu",
    duration: 5,
    description: "Drive the stunning Amalfi Coast, savor Italian cuisine, and explore charming cliffside villages.",
    image: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&q=80",
    categories: ["Deluxe", "Executive", "Luxury"],
    packageTypes: ["Couple"],
    transport: "By Air",
    basePrice: 2199,
    packages: [
      {
        category: "Deluxe",
        price: 2199,
        features: ["Boutique hotels", "Daily breakfast", "Guided tours", "Local experiences"],
      },
      {
        category: "Executive",
        price: 3299,
        features: ["4-star sea view hotels", "All meals", "Private driver", "Cooking class"],
      },
      {
        category: "Luxury",
        price: 4799,
        features: ["5-star luxury hotels", "Fine dining", "Yacht excursion", "VIP transfers"],
      },
    ],
    itinerary: [
      { day: 1, title: "Naples Arrival", description: "Arrive in Naples and transfer to the Amalfi Coast.", highlights: ["Airport pickup", "Scenic drive", "Welcome aperitivo"] },
      { day: 2, title: "Positano & Amalfi", description: "Explore the iconic towns of Positano and Amalfi.", highlights: ["Positano streets", "Amalfi Cathedral", "Limoncello tasting"] },
      { day: 3, title: "Ravello Gardens", description: "Visit the stunning gardens and villas of Ravello.", highlights: ["Villa Rufolo", "Villa Cimbrone", "Panoramic views"] },
      { day: 4, title: "Capri Island", description: "Ferry to the glamorous island of Capri.", highlights: ["Blue Grotto", "Anacapri", "Italian lunch"] },
      { day: 5, title: "Departure", description: "Final breakfast overlooking the Mediterranean.", highlights: ["Breakfast", "Airport transfer", "Arrivederci"] },
    ],
    included: ["Airport transfers", "Accommodation", "Breakfast daily", "Guided tours", "Ferry to Capri", "Local tastings"],
    notIncluded: ["International flights", "Travel insurance", "Lunches & dinners", "Personal expenses"],
    featured: true,
  },
  {
    id: "6",
    name: "Machu Picchu Trek",
    location: "Peru",
    region: "Deosai",
    duration: 6,
    description: "Hike the legendary Inca Trail to the mystical ruins of Machu Picchu in the Peruvian Andes.",
    image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80",
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
