"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X } from "lucide-react";
import  PageBanner  from "@/components/PageBanner";
import { galleryImages, type GalleryImage } from "@/data/gallery";

export default function Gallery() {
  const [activeTab, setActiveTab] = useState<"private" | "group">("private");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  const filtered = galleryImages.filter((img) => img.category === activeTab);

  const tabs = [
    { key: "private" as const, label: "Private/Customized Tours" },
    { key: "group" as const, label: "Group Tours" },
  ];

  return (
    <div className="min-h-screen bg-background">
    
  {/* <PageBanner
        title="Our Gallery"
        subtitle="Browse through memories captured on our private and group tours across Northern Pakistan."
        backgroundImage={'images/gallery-hero.jpg'}
      /> */}

   <section className="relative bg-navy py-20 text-center text-white">
                    <div className="bg-navy" />
                    <motion.div
                      className="container relative mx-auto px-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="mb-3 inline-block rounded-full bg-gold/90 px-4 py-1.5 text-sm font-semibold text-white">
                       Our Memory
                      </span>
                      <h1 className="text-3xl font-bold text-white md:text-5xl">
                      Our Gallery
                      </h1>
                      <p className="mx-auto mt-4 max-w-2xl text-white/70">
                        Browse through memories captured on our private and group tours across Northern Pakistan.
                      </p>
                    </motion.div>
                  </section>


      {/* Hero */}
      {/* <section className="bg-secondary px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-3 flex items-center justify-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              Explore
            </span>
          </div>
          <h1 className="text-4xl font-bold text-secondary-foreground md:text-5xl">
            Our Gallery
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-secondary-foreground/70">
            Browse through memories captured on our private and group tours across Northern Pakistan.
          </p>
        </motion.div>
      </section> */}

      {/* Tabs */}
      <div className="sticky top-16 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="container mx-auto flex justify-center gap-0 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === tab.key
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="gallery-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="columns-2 gap-4 sm:columns-3 lg:columns-4"
            >
              {filtered.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="group mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded-xl"
                  onClick={() => setLightbox(img)}
                >
                  <div className="relative overflow-hidden rounded-xl shadow-card">
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                        img.span === "tall"
                          ? "h-80"
                          : img.span === "wide"
                          ? "h-48"
                          : "h-60"
                      }`}
                    />
                    {/* <div className="absolute inset-0 flex items-end bg-gradient-to-t from-secondary/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="p-4 text-sm font-medium text-secondary-foreground">
                        {img.alt}
                      </p>
                    </div> */}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute right-4 top-4 rounded-full bg-card/20 p-2 text-secondary-foreground backdrop-blur-sm transition-colors hover:bg-card/40"
              onClick={() => setLightbox(null)}
            >
              <X className="h-6 w-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-h-[85vh] max-w-full rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

    
    </div>
  );
}
