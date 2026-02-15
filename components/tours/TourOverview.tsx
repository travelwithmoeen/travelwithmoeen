"use client";

import { motion } from "framer-motion";
import { Download, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { TourDay } from "@/data/tours";

interface TourOverviewProps {
  itinerary: TourDay[];
  galleryImages: string[];
  pdf?: string;
  openItems: string[];
  onOpenItemsChange: (items: string[]) => void;
}

export function TourOverview({
  itinerary,
  galleryImages,
  pdf,
  openItems,
  onOpenItemsChange
}: TourOverviewProps) {
  return (
    <section className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="gold-underline mb-8 pb-2 text-2xl font-bold text-navy md:text-3xl">
          Tour Overview
        </h2>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: Itinerary Content */}
        <div className="lg:col-span-2">
          <Accordion
            type="multiple"
            className="space-y-4"
            value={openItems}
            onValueChange={onOpenItemsChange}
          >
            {itinerary.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AccordionItem
                  value={`day-${day.day}`}
                  className="overflow-hidden rounded-lg border-l-4 border-l-gold bg-card shadow-sm transition-shadow hover:shadow-lg"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-gold px-3 py-1 text-sm font-bold text-black hover:bg-gold/80">
                        DAY {day.day}
                      </Badge>
                      <span className="text-lg font-semibold text-navy md:text-xl">
                        {day.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <p className="mb-4 leading-relaxed text-muted-foreground">
                      {day.description}
                    </p>

                    <ul className="space-y-2">
                      {day.highlights.map((activity, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                          className="flex items-start gap-2 text-sm text-foreground"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                          {activity}
                        </motion.li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>

        {/* Right: PDF & Image Gallery */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          {/* PDF Download Section */}
          {pdf && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-6 rounded-lg bg-navy p-6"
            >
              <h3 className="mb-4 text-lg font-semibold text-white">
                Tour Itinerary PDF
              </h3>
              <div className="flex gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 border-white bg-transparent text-white hover:bg-white hover:text-navy"
                >
                  <a href={pdf} target="_blank" rel="noopener noreferrer">
                    <Eye className="mr-2 h-4 w-4" />
                    View File
                  </a>
                </Button>
                <Button
                  asChild
                  className="flex-1 bg-gold text-black hover:bg-gold/90"
                >
                  <a href={pdf} download>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </Button>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="mb-4 text-lg font-semibold text-navy">
              Tour Gallery
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="group overflow-hidden rounded-lg shadow-md"
                >
                  <img
                    src={image}
                    alt={`Tour gallery image ${index + 1}`}
                    className="aspect-square h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
