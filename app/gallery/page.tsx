"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import {Footer} from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import PageContainer from "@/components/PageContainer";

interface GalleryImage {
  src: string;
  title: string;
  location: string;
  size: "portrait" | "landscape" | "square";
}

const galleryImages: GalleryImage[] = [
  { src: "/images/gallery/santorini.jpg", title: "Sunset Dreams", location: "Santorini, Greece", size: "portrait" },
  { src: "/images/gallery/alps.jpg", title: "Alpine Adventure", location: "Swiss Alps", size: "landscape" },
  { src: "/images/gallery/kyoto.jpg", title: "Cherry Blossoms", location: "Kyoto, Japan", size: "portrait" },
  { src: "/images/gallery/maldives.jpg", title: "Paradise Found", location: "Maldives", size: "landscape" },
  { src: "/images/gallery/iceland.jpg", title: "Northern Lights", location: "Iceland", size: "square" },
  { src: "/images/gallery/machu-picchu.jpg", title: "Lost City", location: "Machu Picchu, Peru", size: "landscape" },
  { src: "/images/gallery/dubai.jpg", title: "City of Gold", location: "Dubai, UAE", size: "portrait" },
  { src: "/images/gallery/safari.jpg", title: "Wild Safari", location: "Tanzania", size: "landscape" },
  { src: "/images/gallery/bali.jpg", title: "Rice Terraces", location: "Bali, Indonesia", size: "landscape" },
];

const Gallery = () => {
  return (
    <div className="min-h-screen bg-background">
      <PageBanner
        title="Our Gallery"
        subtitle="Explore breathtaking destinations through our lens"
        backgroundImage={'images/gallery-hero.jpg'}
      />
      <PageContainer>
        {/* Gallery Grid - Masonry Style */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="break-inside-avoid group relative overflow-hidden rounded-xl shadow-travel cursor-pointer"
            >
              <div
                className={`relative ${
                  image.size === "portrait"
                    ? "aspect-[3/4]"
                    : image.size === "square"
                    ? "aspect-square"
                    : "aspect-[4/3]"
                }`}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <motion.h3
                    initial={{ y: 20 }}
                    whileHover={{ y: 0 }}
                    className="text-lg font-serif font-bold text-primary-foreground"
                  >
                    {image.title}
                  </motion.h3>
                  <p className="text-sm text-primary-foreground/80">{image.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { number: "500+", label: "Photos Captured" },
            { number: "50+", label: "Destinations" },
            { number: "1000+", label: "Happy Travelers" },
            { number: "10+", label: "Years Experience" },
          ].map((stat, index) => (
            <div key={index} className="p-6 rounded-xl bg-card shadow-travel">
              <p className="text-3xl md:text-4xl font-serif font-bold text-gold">{stat.number}</p>
              <p className="text-muted-foreground mt-2">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </PageContainer>
      {/* <Footer /> */}
    </div>
  );
};

export default Gallery;
