"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { testimonials } from "@/data/testimonials";
import { cn } from "@/lib/utils";

export function TestimonialCarousel() {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate testimonials for seamless infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="overflow-hidden bg-navy py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <Badge className="mb-3 bg-gold text-white">
            Testimonials
          </Badge>
          <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">
            What Our Clients Say
          </h2>
          <p className="mx-auto max-w-2xl text-white/80">
            Real experiences from travelers who explored with us
          </p>
        </motion.div>
      </div>


      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div
          className="flex gap-6"
          animate={{
            x: isPaused ? 0 : [0, -50 * testimonials.length * 6],
          }}
          transition={{
            x: {
              duration: 30,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            },
          }}
          style={{ width: "fit-content" }}
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <motion.div
              key={`${testimonial.id}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="w-[350px] flex-shrink-0"
            >
              <Card className="h-full border-0 bg-card shadow-lg transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <Quote className="h-8 w-8 text-gold/30" />
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < testimonial.rating
                              ? "fill-gold text-gold"
                              : "fill-gold/30 text-gold/30"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarImage
                        src={testimonial.avatar}
                        alt={testimonial.name}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-navy">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

      {/* Google review link and button below carousel */}
      <div className="mt-8 flex items-center justify-center">
        <div className="flex items-center gap-6 rounded-lg bg-white p-4 shadow-sm">
          <div className="hidden items-center sm:flex">
            <img
              src="/images/twm-logo.webp"
              alt="Eventica Travels"
              className="h-28  w-auto"
            />
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={`g-${i}`} className="h-5 w-5 fill-gold/90 text-gold" />
              ))}
            </div>
            <p className="mt-1 text-lg font-medium text-navy">41 Google reviews</p>
            <a
              href="https://www.google.com/maps/place/Travelwithmoeen/@33.6941091,73.0122588,17z/data=!3m1!4b1!4m6!3m5!1s0x38dfbf129a345dc9:0xa21e40956cae10dd!8m2!3d33.6941047!4d73.0148337!16s%2Fg%2F11ys6km83v?entry=ttu&g_ep=EgoyMDI2MDIwNC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block rounded-md border-2 border-muted-foreground bg-white hover:bg-navy hover:text-white px-6 py-2 font-semibold text-navy hover:opacity-95"
            >
              Write a review
            </a>
          </div>
        </div>
      </div>


      </div>
    </section>
  );
}
