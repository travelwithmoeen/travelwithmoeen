export interface BlogSection {
  heading?: string;
  body: string;
  image?: string;
}

export interface Blog {
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  date: string;
  coverImage: string;
  content: BlogSection[];
}

export const blogs: Blog[] = [
  {
    title: "Discovering the Hidden Gems of Skardu Valley",
    slug: "hidden-gems-skardu-valley",
    excerpt: "Explore the breathtaking landscapes and serene beauty of Skardu Valley, a paradise nestled in the heart of Gilgit-Baltistan.",
    author: "Ahmed Khan",
    date: "2026-01-15",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    content: [
      {
        heading: "The Gateway to Adventure",
        body: "Skardu Valley stands as one of the most spectacular destinations in Pakistan, offering a perfect blend of natural beauty and cultural richness. The valley is surrounded by towering peaks, crystal-clear lakes, and ancient fortresses that tell stories of a glorious past. Travelers from around the world flock here to experience the raw, untouched beauty that defines this remarkable region."
      },
      {
        body: "The journey to Skardu itself is an adventure, whether you choose the scenic Karakoram Highway or opt for a breathtaking flight over the world's highest mountains.",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=500&fit=crop"
      },
      {
        heading: "Must-Visit Destinations",
        body: "Shangrila Resort, also known as 'Heaven on Earth,' features a unique restaurant built inside an aircraft fuselage. Upper Kachura Lake offers pristine turquoise waters perfect for boating, while Skardu Fort provides panoramic views of the entire valley. Don't miss the ancient rock carvings at Manthal Buddha Rock that date back to the 8th century."
      },
      {
        body: "The Deosai National Park, accessible from Skardu, is the second-highest plateau in the world and home to the Himalayan brown bear.",
        image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&h=500&fit=crop"
      }
    ]
  },
  {
    title: "A Complete Guide to Deosai National Park",
    slug: "guide-deosai-national-park",
    excerpt: "Everything you need to know about visiting the 'Land of Giants' - from wildlife spotting to camping under the stars.",
    author: "Sara Malik",
    date: "2026-01-10",
    coverImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=400&fit=crop",
    content: [
      {
        heading: "The Land of Giants",
        body: "Deosai National Park, locally known as 'Deosai' meaning 'Land of Giants,' is one of the highest plateaus in the world, sitting at an average elevation of 4,114 meters above sea level. This vast alpine ecosystem spans over 3,000 square kilometers and is renowned for its unique biodiversity and stunning landscapes that change dramatically with the seasons."
      },
      {
        body: "During summer, the plateau transforms into a carpet of wildflowers, creating one of the most photogenic landscapes in Asia.",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=500&fit=crop"
      },
      {
        heading: "Wildlife and Conservation",
        body: "The park is home to the endangered Himalayan brown bear, with a population of around 80 individuals. Other wildlife includes the Tibetan wolf, Himalayan ibex, red fox, and golden marmots. Birdwatchers can spot the golden eagle, lammergeier, and various species of finches and snowcocks throughout the park."
      },
      {
        body: "The best time to visit is from June to September when the park is accessible and wildlife is most active.",
        image: "https://images.unsplash.com/photo-1518173946687-a4c036bc2c95?w=800&h=500&fit=crop"
      }
    ]
  },
  {
    title: "Hunza Valley: Where Time Stands Still",
    slug: "hunza-valley-timeless-beauty",
    excerpt: "Journey through the legendary Hunza Valley and discover why it's often called the real-life Shangri-La.",
    author: "Imran Ali",
    date: "2026-01-05",
    coverImage: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&h=400&fit=crop",
    content: [
      {
        heading: "A Living Legend",
        body: "Hunza Valley has captivated travelers for centuries with its dramatic mountain scenery, ancient watchtowers, and the legendary longevity of its people. Nestled between the Karakoram and Hindu Kush mountain ranges, this valley offers views of some of the world's highest peaks, including Rakaposhi, Ultar Sar, and the famous Passu Cones."
      },
      {
        body: "The iconic Baltit Fort, a 700-year-old structure perched on a hilltop, overlooks the entire valley and offers stunning views of the surrounding peaks.",
        image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&h=500&fit=crop"
      },
      {
        heading: "Cultural Heritage",
        body: "The people of Hunza are known for their warm hospitality and rich cultural traditions. The valley is home to the Burusho people, who speak Burushaski, a language isolate with no known relatives. Traditional crafts, music, and festivals continue to thrive here, offering visitors an authentic glimpse into mountain life."
      },
      {
        body: "Attabad Lake, formed by a massive landslide in 2010, has become one of the region's most popular attractions with its striking turquoise waters.",
        image: "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?w=800&h=500&fit=crop"
      }
    ]
  },
  {
    title: "Minimarg: The Hidden Paradise of Astore",
    slug: "minimarg-hidden-paradise",
    excerpt: "Uncover the secrets of Minimarg, a pristine meadow that remains one of Pakistan's best-kept travel secrets.",
    author: "Fatima Hussain",
    date: "2025-12-28",
    coverImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=400&fit=crop",
    content: [
      {
        heading: "An Untouched Gem",
        body: "Minimarg is a hidden valley located in the Astore District of Gilgit-Baltistan. Unlike its more famous neighbors, Minimarg remains relatively untouched by mass tourism, offering visitors a chance to experience nature in its purest form. The valley is characterized by lush green meadows, pine forests, and stunning views of Nanga Parbat, the ninth-highest mountain in the world."
      },
      {
        body: "The meadows of Minimarg during spring and summer are covered with wildflowers, creating a natural carpet of colors against the backdrop of snow-capped peaks.",
        image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=500&fit=crop"
      },
      {
        heading: "Getting There",
        body: "Reaching Minimarg requires a scenic drive from Astore town, passing through traditional villages and terraced fields. The journey itself is an experience, with the landscape changing from arid mountains to lush green valleys. The best time to visit is from May to October when the roads are clear and the weather is pleasant."
      },
      {
        body: "Local shepherds bring their flocks to Minimarg during summer, adding to the pastoral charm of this remarkable destination.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop"
      }
    ]
  },
  {
    title: "Planning Your Perfect Northern Pakistan Trip",
    slug: "planning-northern-pakistan-trip",
    excerpt: "Essential tips and advice for planning an unforgettable journey through the mountains of Northern Pakistan.",
    author: "Zain Ahmad",
    date: "2025-12-20",
    coverImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=400&fit=crop",
    content: [
      {
        heading: "Before You Go",
        body: "Planning a trip to Northern Pakistan requires careful preparation due to the remote nature of many destinations. The best time to visit depends on your interests: summer (June-September) offers the best weather for trekking and sightseeing, while autumn (October-November) provides stunning fall colors and fewer crowds."
      },
      {
        body: "The Karakoram Highway, one of the highest paved international roads in the world, connects Pakistan to China and offers some of the most spectacular mountain scenery on Earth.",
        image: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=800&h=500&fit=crop"
      },
      {
        heading: "Practical Tips",
        body: "Carry cash as ATMs are scarce in remote areas. Altitude sickness can affect travelers above 3,000 meters, so acclimatize properly. Respect local customs and dress modestly, especially in rural areas. Book accommodations in advance during peak season, and always carry warm clothing as temperatures can drop significantly at night."
      },
      {
        body: "Local guides can enhance your experience with their knowledge of hidden trails, cultural insights, and logistical support in challenging terrain.",
        image: "https://images.unsplash.com/photo-1445296160145-04861c607674?w=800&h=500&fit=crop"
      }
    ]
  }
];

export function getBlogBySlug(slug: string): Blog | undefined {
  return blogs.find((blog) => blog.slug === slug);
}
