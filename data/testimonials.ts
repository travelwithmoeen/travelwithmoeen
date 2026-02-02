export interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  location: string;
  text: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    location: "London, UK",
    text: "An absolutely magical experience! The Skardu tour exceeded all my expectations. The landscapes were breathtaking, and our guide was incredibly knowledgeable.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    location: "Toronto, Canada",
    text: "Deosai National Park was like stepping into another world. The wildlife, the vast meadows, the stars at night - simply unforgettable!",
    rating: 5,
  },
  {
    id: 3,
    name: "Fatima Al-Hassan",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    location: "Dubai, UAE",
    text: "The Hunza Valley tour was perfectly organized. From the ancient forts to the stunning lakes, every moment was picture-perfect.",
    rating: 5,
  },
  {
    id: 4,
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    location: "Sydney, Australia",
    text: "As an adventure enthusiast, this was the trip of a lifetime. The team's attention to safety and detail made the challenging treks enjoyable.",
    rating: 4,
  },
  {
    id: 5,
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop",
    location: "Mumbai, India",
    text: "The hospitality of the local people combined with the stunning natural beauty made this an experience I'll treasure forever.",
    rating: 5,
  },
  {
    id: 6,
    name: "Erik Andersson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    location: "Stockholm, Sweden",
    text: "Incredible value for money! The accommodations, food, and experiences were all top-notch. Highly recommend for any nature lover.",
    rating: 5,
  },
];
