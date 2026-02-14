export interface DestinationSection {
  heading?: string;
  body: string;
  image?: string;
  highlight?: string[]; // Optional array of sentences to highlight in the body text
}

export interface Destination {
  title: string;
  slug: string;
  excerpt: string;
  bannerImage: string;
  location?: string;
  listingNumber: number;
  content: DestinationSection[];

}

export const destinations: Destination[] = [
  {
    title: "Skardu Valley",
    slug: "skardu-valley",
    excerpt: "Located in the heart of Gilgit-Baltistan, Skardu Valley is a spectacular high-altitude destination and the gateway to some of the world’s most formidable peaks, including the legendary K2. Known as “Little Tibet”, the valley blends dramatic mountain scenery with rich Tibetan-influenced culture. It lies at 2,500 metres (8,200 ft) where the Indus River meets the Shigar River.",
    bannerImage: "/images/Destinations/Skardu/Picture1.jpg",
    location: "Gilgit-Baltistan, Pakistan",
    listingNumber: 1,
    content: [

      {
        "heading": "Skardu Valley",
        "body": "Located in the heart of Gilgit-Baltistan, Skardu Valley is a spectacular high-altitude destination and the gateway to some of the world’s most formidable peaks, including the legendary K2. Known as “Little Tibet”, the valley blends dramatic mountain scenery with rich Tibetan-influenced culture. It lies at 2,500 metres (8,200 ft) where the Indus River meets the Shigar River.",
        "highlight": [
        ],
        "image": "/images/Destinations/Skardu/Picture1.jpg"
      },
      {
        "heading": "Highlights",
        "body": "",
        "highlight": [
          "Lower Kachura (Shangrila) Lake – Iconic heart-shaped lake",
          "Katpana & Sarfaranga Cold Deserts – Snow-dusted sand dunes",
          "Upper Kachura Lake – Crystal-clear alpine beauty",
          "Kharpocho Fort – Historic views over Skardu city",
          "Deosai Plains – Wildflowers & Himalayan Brown Bear",
          "Manthoka Waterfall – 180-ft natural spectacle"
        ],
        "image": ""
      },
      {
        "heading": "Travel Info",
        "body": "",
        "highlight": [
          "Best Time: April–October",
          "By Air: 45-minute flight from Islamabad with views of Nanga Parbat",
          "By Road: 18–24 hours via the Karakoram Highway"
        ],
        "image": ""
      }

      ,
      {
        "heading": "Things to Do",
        "body": "Trekking (K2 Base Camp), paragliding, sandboarding, boating, photography, and regulated trophy hunting.",
        "highlight": [],
        "image": ""
      }

    ]
  },
  {
    title: "Hunza Valley",
    slug: "hunza-valley",
    excerpt: "Set in the northern mountains of Gilgit-Baltistan, Hunza Valley is renowned for its dramatic peaks, crystal-clear rivers, and legendary hospitality. Surrounded by iconic mountains like Rakaposhi and Ultar Sar, Hunza is a paradise for nature lovers, photographers, and adventure seekers.",
    bannerImage: "/images/Destinations/Skardu/Picture2.jpg",
    location: "Gilgit-Baltistan, Pakistan",
    listingNumber: 2,
    content: [

      {
        "heading": "Hunza Valley",
        "body": "Set in the northern mountains of Gilgit-Baltistan, Hunza Valley is renowned for its dramatic peaks, crystal-clear rivers, and legendary hospitality. Surrounded by iconic mountains like Rakaposhi and Ultar Sar, Hunza is a paradise for nature lovers, photographers, and adventure seekers",
        "highlight": [
        ],
        "image": "/images/Destinations/Skardu/Picture2.jpg"
      },
      {
        "heading": "Highlights",
        "body": "",
        "highlight": [
          "Baltit Fort – 700-year-old heritage fort",
          "Altit Fort – Historic fort with village views",
          "Attabad Lake – Turquoise lake formed in 2010",
          "Passu Cones – Iconic cathedral-shaped peaks",
          "Hussaini Suspension Bridge – One of the world’s most thrilling bridges"
        ],
        "image": ""
      },
      {
        "heading": "Travel Info",
        "body": "",
        "highlight": [
          "Best Time: April–October",
          "By Road: Via the legendary Karakoram Highway",
          "Nearest Airport: Gilgit Airport"
        ],
        "image": ""
      }

      ,
      {
        "heading": "Things to Do",
        "body": "Sightseeing, trekking, boating, cultural tours, photography, and local cuisine experiences.",
        "highlight": [],
        "image": ""
      }

    ]
  },
{
  title: "Astor Valley – Minimarg",
  slug: "astor-valley-minimarg",
  excerpt: "Tucked in the high mountains of Gilgit-Baltistan, Astor Valley is a serene paradise of lush meadows, rushing rivers, and towering peaks. Minimarg, a picturesque village near the Pakistan–China border, is known for its untouched natural beauty, alpine landscapes, and vibrant wildflowers, offering an off-the-beaten-path experience for adventure seekers and nature lovers.",
  bannerImage: "/images/Destinations/Skardu/Picture3.jpg",
  location: "Gilgit-Baltistan, Pakistan",
  listingNumber: 3,
  content: [

    {
      "heading": "Astor Valley – Minimarg",
      "body": "Tucked in the high mountains of Gilgit-Baltistan, Astor Valley is a serene paradise of lush meadows, rushing rivers, and towering peaks. Minimarg, a picturesque village near the Pakistan–China border, is known for its untouched natural beauty, alpine landscapes, and vibrant wildflowers, offering an off-the-beaten-path experience for adventure seekers and nature lovers.",
      "highlight": [],
      "image": "/images/Destinations/Skardu/Picture3.jpg",
    },

    {
      "heading": "Highlights",
      "body": "",
      "highlight": [
        "Minimarg Village – Remote alpine charm",
        "Astor Meadows – Lush green fields and rivers",
        "Ganesh & Chilas Peaks – Scenic high mountains",
        "Rama Lake – Crystal-clear alpine waters"
      ],
      "image": ""
    },

    {
      "heading": "Travel Info",
      "body": "",
      "highlight": [
        "Best Time: June–September",
        "By Road: Via Gilgit–Astor Road from Gilgit"
      ],
      "image": ""
    },

    {
      "heading": "Things to Do",
      "body": "Hiking, camping, trekking, photography, nature walks, and exploring remote alpine villages.",
      "highlight": [],
      "image": ""
    }

  ]
}
,
{
  title: "Naran Kaghan & Babusar Top",
  slug: "naran-kaghan-babusar-top",
  excerpt: "Nestled in the northern mountains of Khyber Pakhtunkhwa, Naran & Kaghan Valleys are a paradise of alpine meadows, sparkling lakes, and snow-capped peaks. The region is famous for its scenic drives along the Kunhar River, vibrant wildflowers, and crystal-clear lakes.",
  bannerImage:"/images/Destinations/Skardu/Picture4.jpg",
  location: "Khyber Pakhtunkhwa, Pakistan",
  listingNumber: 4,
  content: [

    {
      "heading": "Naran Kaghan & Babusar Top",
      "body": "Nestled in the northern mountains of Khyber Pakhtunkhwa, Naran & Kaghan Valleys are a paradise of alpine meadows, sparkling lakes, and snow-capped peaks. The region is famous for its scenic drives along the Kunhar River, vibrant wildflowers, and crystal-clear lakes.",
      "highlight": [],
      "image": "/images/Destinations/Skardu/Picture4.jpg",
    },

    {
      "heading": "Highlights",
      "body": "",
      "highlight": [
        "Saif-ul-Malook Lake – Stunning alpine lake",
        "Lulusar & Babusar Lakes – Serene high-altitude lakes",
        "Babusar Top – Panoramic mountain pass",
        "Shogran & Siri Paye Meadows – Green alpine pastures"
      ],
      "image": ""
    },

    {
      "heading": "Travel Info",
      "body": "",
      "highlight": [
        "Best Time: May–September",
        "By Road: Via Mansehra–Kaghan–Naran Road",
        "Nearest City: Mansehra"
      ],
      "image": ""
    },

    {
      "heading": "Things to Do",
      "body": "Hiking, boating, camping, photography, and exploring alpine meadows.",
      "highlight": [],
      "image": ""
    }

  ]
}
,
{
  title: "Kumrat Valley",
  slug: "kumrat-valley",
  excerpt: "Located in the upper reaches of Khyber Pakhtunkhwa, Kumrat Valley is a hidden gem of lush pine forests, river streams, and rolling meadows. Known for its pristine natural beauty and tranquil environment, it’s a perfect escape for nature lovers and adventure seekers.",
  bannerImage: "/images/Destinations/Skardu/Picture5.jpg",
  location: "Khyber Pakhtunkhwa, Pakistan",
  listingNumber: 5,
  content: [

    {
      "heading": "Kumrat Valley",
      "body": "Located in the upper reaches of Khyber Pakhtunkhwa, Kumrat Valley is a hidden gem of lush pine forests, river streams, and rolling meadows. Known for its pristine natural beauty and tranquil environment, it’s a perfect escape for nature lovers and adventure seekers.",
      "highlight": [],
      "image":"/images/Destinations/Skardu/Picture5.jpg",
    },

    {
      "heading": "Highlights",
      "body": "",
      "highlight": [
        "Panjkora River – Scenic riverside views",
        "Thall Lake – Tranquil highland lake",
        "Dense Pine Forests – Ideal for nature walks and photography",
        "Meadows & Waterfalls – Peaceful alpine scenery"
      ],
      "image": ""
    },

    {
      "heading": "Travel Info",
      "body": "",
      "highlight": [
        "Best Time: May–September",
        "By Road: Accessible via Dir and Timergara from Peshawar"
      ],
      "image": ""
    },

    {
      "heading": "Things to Do",
      "body": "Hiking, camping, photography, river walks, and exploring untouched natural landscapes.",
      "highlight": [],
      "image": ""
    }

  ]
}
,

  {
  title: "Chitral Valley",
  slug: "chitral-valley",
  excerpt: "Located in the rugged mountains of Khyber Pakhtunkhwa, Chitral Valley is a land of towering peaks, lush green valleys, and rich culture. It serves as the gateway to the majestic Trich Mir, the highest peak of the Hindu Kush range, and is home to the unique Kalash people with their vibrant traditions and festivals.",
  bannerImage:"/images/Destinations/Skardu/Picture6.jpg",
  location: "Khyber Pakhtunkhwa, Pakistan",
  listingNumber: 6,
  content: [

    {
      "heading": "Chitral Valley",
      "body": "Located in the rugged mountains of Khyber Pakhtunkhwa, Chitral Valley is a land of towering peaks, lush green valleys, and rich culture. It serves as the gateway to the majestic Trich Mir, the highest peak of the Hindu Kush range, and is home to the unique Kalash people with their vibrant traditions and festivals.",
      "highlight": [],
      "image": "/images/Destinations/Skardu/Picture6.jpg",
    },

    {
      "heading": "Highlights",
      "body": "",
      "highlight": [
        "Chitral Town – Cultural hub & bazaars",
        "Kalash Valleys – Unique tribal culture and festivals",
        "Garum Chashma – Hot springs & scenic views",
        "Shandur Pass – Famous for the annual polo festival"
      ],
      "image": ""
    },

    {
      "heading": "Travel Info",
      "body": "",
      "highlight": [
        "Best Time: May–September",
        "By Road: Via Lowari Tunnel or Chitral Road from Peshawar",
        "Nearest Airport: Chitral Airport"
      ],
      "image": ""
    },

    {
      "heading": "Things to Do",
      "body": "Sightseeing, trekking, cultural tours, photography, polo festival, and exploring alpine villages.",
      "highlight": [],
      "image": ""
    }

  ]
}
,

{
  title: "Neelum Valley",
  slug: "neelum-valley",
  excerpt: "Located in Azad Kashmir, Neelum Valley is one of Pakistan’s most scenic destinations, known for its lush green mountains, alpine forests, and the winding Neelum River. Stretching along the Line of Control, the valley offers a serene escape with untouched natural beauty and cool mountain air.",
  bannerImage:"/images/Destinations/Skardu/Picture7.jpg",
  location: "Azad Kashmir, Pakistan",
  listingNumber: 7,
  content: [

    {
      "heading": "Neelum Valley",
      "body": "Located in Azad Kashmir, Neelum Valley is one of Pakistan’s most scenic destinations, known for its lush green mountains, alpine forests, and the winding Neelum River. Stretching along the Line of Control, the valley offers a serene escape with untouched natural beauty and cool mountain air.",
      "highlight": [],
      "image": "/images/Destinations/Skardu/Picture7.jpg",
    },

    {
      "heading": "Highlights",
      "body": "",
      "highlight": [
        "Keran & Upper Neelum – Riverside villages",
        "Arang Kel – Meadow village above the clouds",
        "Sharda – Ancient ruins & scenic views",
        "Ratti Gali Lake – High-altitude alpine lake",
        "Kutton Waterfall – Forest-side cascade"
      ],
      "image": ""
    },

    {
      "heading": "Travel Info",
      "body": "",
      "highlight": [
        "Best Time: April–October",
        "By Road: From Muzaffarabad via Neelum Valley Road",
        "Nearest City: Muzaffarabad"
      ],
      "image": ""
    },

    {
      "heading": "Things to Do",
      "body": "Hiking, sightseeing, photography, camping, river walks, and cultural exploration.",
      "highlight": [],
      "image": ""
    }

  ]
},

{
  title: "Swat Valley – Kalam & Malam Jabba",
  slug: "swat-valley-kalam-malam-jabba",
  excerpt: "Often called the “Switzerland of Pakistan,” Swat Valley is famed for its lush green landscapes, rivers, and alpine forests. Kalam, located in upper Swat, enchants visitors with snow-capped peaks, waterfalls, and river confluences, while Malam Jabba is Pakistan’s premier hill station and ski resort, offering year-round adventure and panoramic mountain views.",
  bannerImage: "/images/Destinations/Skardu/Picture8.jpg",
  location: "Khyber Pakhtunkhwa, Pakistan",
  listingNumber: 8,
  content: [

    {
      "heading": "Swat Valley – Kalam & Malam Jabba",
      "body": "Often called the “Switzerland of Pakistan,” Swat Valley is famed for its lush green landscapes, rivers, and alpine forests. Kalam, located in upper Swat, enchants visitors with snow-capped peaks, waterfalls, and river confluences, while Malam Jabba is Pakistan’s premier hill station and ski resort, offering year-round adventure and panoramic mountain views.",
      "highlight": [],
      "image":"/images/Destinations/Skardu/Picture8.jpg",
    },

    {
      "heading": "Highlights",
      "body": "",
      "highlight": [
        "Kalam Valley – Alpine meadows & waterfalls",
        "Ushu Forest – Dense pine woodland",
        "Mahodand Lake – Emerald alpine lake",
        "Malam Jabba Ski Resort – Skiing & chairlift rides",
        "Swat River – Scenic riverside views"
      ],
      "image": ""
    },

    {
      "heading": "Travel Info",
      "body": "",
      "highlight": [
        "Best Time: April–October (Winter for snow sports)",
        "By Road: 5–7 hours from Islamabad via Mingora"
      ],
      "image": ""
    },

    {
      "heading": "Things to Do",
      "body": "Sightseeing, hiking, skiing, chairlift rides, camping, photography, and local cuisine experiences.",
      "highlight": [],
      "image": ""
    }

  ]
},


];

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((destination) => destination.slug === slug);
}
