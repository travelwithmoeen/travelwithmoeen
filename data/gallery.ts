export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: "private" | "group";
  span?: "tall" | "wide" | "large"; // for masonry effect
  homeOnly?: boolean; // if true, only show on home page gallery
}

export const galleryImages: GalleryImage[] = [
  // Private/Customized Tours
  { id: 1, src: "/images/gallery/Picture11.webp", alt: "Jeep ride through mountain valleys", category: "private" },
  { id: 2, src: "/images/gallery/Picture12.JPG", alt: "Snow-capped peaks and clear skies", category: "private", span: "tall" },
  { id: 3, src: "/images/gallery/Picture22.JPG", alt: "Golden sunset over Karakoram range", category: "private", span: "wide" },
  { id: 4, src: "/images/gallery/Picture4.png", alt: "Couple at viewpoint overlooking lake", category: "private" },
  { id: 5, src: "/images/gallery/Picture3.JPG", alt: "Road trip through green valleys", category: "private", span: "tall" },
  { id: 6, src: "/images/gallery/Picture14.JPG", alt: "Lush meadows and misty mountains", category: "private" },
  { id: 7, src: "/images/Islamabad.webp", alt: "Traditional wooden bridge crossing", category: "private", span: "tall" },
  { id: 8, src: "/images/twm-logo.webp", alt: "Waterfall in northern mountains", category: "private", span: "tall", homeOnly: true },

  // Group Tours
  { id: 9, src: "/images/gallery/Picture15.JPG", alt: "Group photo at mountain base camp", category: "group", span: "wide" },
  { id: 10, src: "/images/gallery/Picture17.JPG", alt: "Group boating on turquoise lake", category: "group" },
  { id: 11, src: "/images/gallery/Picture18.JPG", alt: "Starry night over campsite", category: "group", span: "tall" },
  { id: 12, src:"/images/gallery/Picture19.JPG", alt: "Group trek on rocky trail", category: "group" },
  { id: 13, src: "/images/gallery/Picture13.JPG", alt: "Group at snow-covered pass", category: "group" },
  { id: 14, src: "/images/gallery/Picture20.JPG", alt: "Mountain panorama with group", category: "group", span: "wide" },
  { id: 15, src: "/images/gallery/Picture21.JPG", alt: "Jeep convoy through mountain pass", category: "group", span: "tall" },
  { id: 16, src: "/images/gallery/Picture4.png", alt: "Group celebrating at summit", category: "group" },
];
