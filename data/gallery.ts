export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: "private" | "group";
  span?: "tall" | "wide" | "large"; // for masonry effect
}

export const galleryImages: GalleryImage[] = [
  // Private/Customized Tours
  { id: 1, src: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&q=80", alt: "Jeep ride through mountain valleys", category: "private" },
  { id: 2, src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", alt: "Snow-capped peaks and clear skies", category: "private", span: "tall" },
  { id: 3, src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80", alt: "Golden sunset over Karakoram range", category: "private", span: "wide" },
  { id: 4, src: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=600&q=80", alt: "Couple at viewpoint overlooking lake", category: "private" },
  { id: 5, src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80", alt: "Road trip through green valleys", category: "private", span: "tall" },
  { id: 6, src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80", alt: "Lush meadows and misty mountains", category: "private" },
  { id: 7, src: "https://images.unsplash.com/photo-1500534314263-0869cceaee78?w=600&q=80", alt: "Traditional wooden bridge crossing", category: "private" },
  { id: 8, src: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=600&q=80", alt: "Waterfall in northern mountains", category: "private", span: "wide" },

  // Group Tours
  { id: 9, src: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&q=80", alt: "Group photo at mountain base camp", category: "group", span: "wide" },
  { id: 10, src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80", alt: "Group boating on turquoise lake", category: "group" },
  { id: 11, src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80", alt: "Starry night over campsite", category: "group", span: "tall" },
  { id: 12, src: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600&q=80", alt: "Group trek on rocky trail", category: "group" },
  { id: 13, src: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&q=80", alt: "Group at snow-covered pass", category: "group" },
  { id: 14, src: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=600&q=80", alt: "Mountain panorama with group", category: "group", span: "wide" },
  { id: 15, src: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&q=80", alt: "Jeep convoy through mountain pass", category: "group", span: "tall" },
  { id: 16, src: "https://images.unsplash.com/photo-1445363692815-ebcd599f7621?w=600&q=80", alt: "Group celebrating at summit", category: "group" },
];
