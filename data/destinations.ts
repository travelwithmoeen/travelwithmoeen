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
    bannerImage: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&q=80",
    location: "Gilgit-Baltistan, Pakistan",
    listingNumber: 1,
    content: [
    
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
    excerpt: "One of the highest plateaus in the world, home to the Himalayan brown bear and stunning wildflower meadows.",
    bannerImage: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    location: "Gilgit-Baltistan, Pakistan",
    listingNumber: 2,
    content: [
      {
        heading: "The Land of Giants",
        body: "Deosai National Park, at an average elevation of 4,114 meters, is one of the highest plateaus in the world. Known locally as 'The Land of Giants,' this vast expanse of alpine meadows transforms into a carpet of wildflowers during summer, creating one of nature's most spectacular displays.",
        image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&q=80"
      },
      {
        heading: "Wildlife Haven",
        body: "The park is a sanctuary for the endangered Himalayan brown bear, with one of the healthiest populations in the region. Visitors may also spot golden marmots, Tibetan red foxes, and various species of birds, including the majestic golden eagle soaring above the plains.",
        image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80"
      },
      {
        heading: "Sheosar Lake",
        body: "At the heart of Deosai lies Sheosar Lake, a pristine body of water reflecting the vast blue sky. The lake's crystal-clear waters and the surrounding meadows create a scene of ethereal beauty that feels untouched by time."
      }
    ]
  },
  {
    title: "Kashmir",
    slug: "Kashmir",
    excerpt: "A hidden gem in Astore District, offering serene landscapes and traditional mountain village life.",
    bannerImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    location: "Astore District, Gilgit-Baltistan",
    listingNumber: 3,
    content: [
      {
        heading: "The Hidden Paradise",
        body: "Minimarg Valley remains one of the lesser-known treasures of northern Pakistan. Located in the Astore District, this valley offers a peaceful retreat from the busier tourist destinations, with its lush green meadows, flowing streams, and the warm hospitality of local communities.",
        image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80"
      },
      {
        heading: "Traditional Life",
        body: "The villages of Minimarg offer a glimpse into traditional mountain life, where ancient customs blend seamlessly with the rhythms of nature. Local shepherds guide their flocks through alpine pastures, while artisans craft beautiful woolen textiles using techniques passed down through generations.",
        image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80"
      },
      {
        heading: "Gateway to Adventure",
        body: "Minimarg serves as a starting point for numerous trekking routes, including trails to pristine alpine lakes and high-altitude passes. The valley's relatively unexplored nature makes it perfect for adventurers seeking authentic wilderness experiences."
      }
    ]
  },
  {
    title: "Swat",
    slug: "Swat",
    excerpt: "A legendary valley known for its stunning beauty, ancient forts, and the longevity of its people.",
    bannerImage: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&q=80",
    location: "Gilgit-Baltistan, Pakistan",
    listingNumber: 4,
    content: [
      {
        heading: "The Jewel of Karakoram",
        body: "Hunza Valley has captivated travelers for centuries with its dramatic mountain scenery and rich cultural heritage. Dominated by the mighty Rakaposhi and Ultar Sar peaks, the valley's terraced fields and ancient watchtowers create a landscape that seems straight out of a fairy tale.",
        image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80"
      },
      {
        heading: "Baltit and Altit Forts",
        body: "The 700-year-old Baltit Fort stands as a testament to the region's royal history, overlooking the valley from its perch in Karimabad. Nearby Altit Fort, even older, offers a more intimate glimpse into the lives of the Mirs who once ruled these mountain kingdoms.",
        image: "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=800&q=80"
      },
      {
        heading: "The Secret of Longevity",
        body: "Hunza is famous for the exceptional longevity of its people, often attributed to their organic diet rich in apricots and glacial water. The apricot blossoms in spring paint the entire valley in shades of pink, creating one of Pakistan's most photographed natural spectacles."
      }
    ]
  },
    {
    title: "Minimarg",
    slug: "Minimarg",
    excerpt: "A legendary valley known for its stunning beauty, ancient forts, and the longevity of its people.",
    bannerImage: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&q=80",
    location: "Gilgit-Baltistan, Pakistan",
    listingNumber: 5,
    content: [
      {
        heading: "The Jewel of Karakoram",
        body: "Hunza Valley has captivated travelers for centuries with its dramatic mountain scenery and rich cultural heritage. Dominated by the mighty Rakaposhi and Ultar Sar peaks, the valley's terraced fields and ancient watchtowers create a landscape that seems straight out of a fairy tale.",
        image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80"
      },
      {
        heading: "Baltit and Altit Forts",
        body: "The 700-year-old Baltit Fort stands as a testament to the region's royal history, overlooking the valley from its perch in Karimabad. Nearby Altit Fort, even older, offers a more intimate glimpse into the lives of the Mirs who once ruled these mountain kingdoms.",
        image: "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=800&q=80"
      },
      {
        heading: "The Secret of Longevity",
        body: "Hunza is famous for the exceptional longevity of its people, often attributed to their organic diet rich in apricots and glacial water. The apricot blossoms in spring paint the entire valley in shades of pink, creating one of Pakistan's most photographed natural spectacles."
      }
    ]
  },
    {
    title: "Chital Valley ",
    slug: "Chital-Valley ",
    excerpt: "A legendary valley known for its stunning beauty, ancient forts, and the longevity of its people.",
    bannerImage: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&q=80",
    location: "Gilgit-Baltistan, Pakistan",
    listingNumber: 6,
    content: [
      {
        heading: "The Jewel of Karakoram",
        body: "Hunza Valley has captivated travelers for centuries with its dramatic mountain scenery and rich cultural heritage. Dominated by the mighty Rakaposhi and Ultar Sar peaks, the valley's terraced fields and ancient watchtowers create a landscape that seems straight out of a fairy tale.",
        image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80"
      },
      {
        heading: "Baltit and Altit Forts",
        body: "The 700-year-old Baltit Fort stands as a testament to the region's royal history, overlooking the valley from its perch in Karimabad. Nearby Altit Fort, even older, offers a more intimate glimpse into the lives of the Mirs who once ruled these mountain kingdoms.",
        image: "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=800&q=80"
      },
      {
        heading: "The Secret of Longevity",
        body: "Hunza is famous for the exceptional longevity of its people, often attributed to their organic diet rich in apricots and glacial water. The apricot blossoms in spring paint the entire valley in shades of pink, creating one of Pakistan's most photographed natural spectacles."
      }
    ]
  },
    {
    title: "Naran Kaghan",
    slug: "Naran-Kaghan",
    excerpt: "A legendary valley known for its stunning beauty, ancient forts, and the longevity of its people.",
    bannerImage: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&q=80",
    location: "Gilgit-Baltistan, Pakistan",
    listingNumber: 7,
    content: [
      {
        heading: "The Jewel of Karakoram",
        body: "Hunza Valley has captivated travelers for centuries with its dramatic mountain scenery and rich cultural heritage. Dominated by the mighty Rakaposhi and Ultar Sar peaks, the valley's terraced fields and ancient watchtowers create a landscape that seems straight out of a fairy tale.",
        image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80"
      },
      {
        heading: "Baltit and Altit Forts",
        body: "The 700-year-old Baltit Fort stands as a testament to the region's royal history, overlooking the valley from its perch in Karimabad. Nearby Altit Fort, even older, offers a more intimate glimpse into the lives of the Mirs who once ruled these mountain kingdoms.",
        image: "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=800&q=80"
      },
      {
        heading: "The Secret of Longevity",
        body: "Hunza is famous for the exceptional longevity of its people, often attributed to their organic diet rich in apricots and glacial water. The apricot blossoms in spring paint the entire valley in shades of pink, creating one of Pakistan's most photographed natural spectacles."
      }
    ]
  },
    {
    title: "Kumrat Valley ",
    slug: "kumrat-valley",
    excerpt: "A legendary valley known for its stunning beauty, ancient forts, and the longevity of its people.",
    bannerImage: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&q=80",
    location: "Gilgit-Baltistan, Pakistan",
    listingNumber: 8,
    content: [
      {
        heading: "The Jewel of Karakoram",
        body: "Hunza Valley has captivated travelers for centuries with its dramatic mountain scenery and rich cultural heritage. Dominated by the mighty Rakaposhi and Ultar Sar peaks, the valley's terraced fields and ancient watchtowers create a landscape that seems straight out of a fairy tale.",
        image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80"
      },
      {
        heading: "Baltit and Altit Forts",
        body: "The 700-year-old Baltit Fort stands as a testament to the region's royal history, overlooking the valley from its perch in Karimabad. Nearby Altit Fort, even older, offers a more intimate glimpse into the lives of the Mirs who once ruled these mountain kingdoms.",
        image: "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=800&q=80"
      },
      {
        heading: "The Secret of Longevity",
        body: "Hunza is famous for the exceptional longevity of its people, often attributed to their organic diet rich in apricots and glacial water. The apricot blossoms in spring paint the entire valley in shades of pink, creating one of Pakistan's most photographed natural spectacles."
      }
    ]
  }
];

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((destination) => destination.slug === slug);
}
