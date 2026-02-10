import  Link  from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { galleryImages } from "@/data/gallery";

export function GallerySection() {
  // Show first 8 images in a masonry grid for homepage preview
  const previewImages = galleryImages.slice(0, 15);

  return (
    <section className="bg-card py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <div className="mb-3 flex items-center justify-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              Memories
            </span>
          </div>
          <h2 className="text-3xl font-bold md:text-4xl">Our Gallery</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Captured moments from our travelers' unforgettable adventures across Pakistan's breathtaking landscapes.
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-5">
          {previewImages.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="group mb-4 break-inside-avoid overflow-hidden rounded-xl"
            >
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                    img.span === "tall" ? "h-72" : img.span === "wide" ? "h-44" : "h-56"
                  }`}
                />
                <div className="absolute inset-0 bg-secondary/0 transition-colors duration-300 group-hover:bg-secondary/30" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Button asChild >
            <Link href="/gallery">
              View More
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
