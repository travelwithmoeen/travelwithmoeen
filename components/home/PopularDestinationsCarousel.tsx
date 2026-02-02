import  Link  from "next/link";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { destinations } from "@/data/destinations";

export function PopularDestinationsCarousel() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <Badge className="mb-3 bg-gold text-black">
            Explore
          </Badge>
          <h2 className="mb-3 text-3xl font-bold text-navy md:text-4xl">
            Popular Destinations
          </h2>
          <p className="mx-auto max-w-2xl text-navy/80">
            Discover the most breathtaking locations in Northern Pakistan
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            className="mx-auto w-full max-w-6xl"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {destinations.map((destination, index) => (
                <CarouselItem
                  key={destination.slug}
                  className="pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="h-full"
                  >
                    <Card className="group h-full overflow-hidden border-0 bg-card shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={destination.bannerImage}
                          alt={destination.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {destination.location || "Pakistan"}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="mb-2 text-xl font-bold text-navy transition-colors group-hover:text-navy/80">
                          {destination.title}
                        </h3>
                        <p className="mb-4 line-clamp-2 text-sm text-navy/80">
                          {destination.excerpt}
                        </p>
                        <Button asChild  className="w-full text-black  bg-gold hover:bg-gold/90">
                          <Link href={`/destinations/${destination.slug}`}>
                            View Details
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden border-primary/20 bg-card text-primary hover:bg-primary hover:text-primary-foreground md:-left-12 md:flex" />
            <CarouselNext className="hidden border-primary/20 bg-card text-primary hover:bg-primary hover:text-primary-foreground md:-right-12 md:flex" />
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
}
