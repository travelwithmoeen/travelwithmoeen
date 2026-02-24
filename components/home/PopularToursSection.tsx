import  Link  from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { tours, getCategoryBadgeClass } from "@/data/tours";
import { cn } from "@/lib/utils";

const popularTours = tours.filter((tour) => tour.featured).slice(0, 6);

export function PopularToursSection() {
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
            Tours
          </Badge>
          <h2 className="mb-3 text-3xl font-bold text-navy md:text-4xl">
            Popular Tours
          </h2>
          <p className="mx-auto max-w-2xl text-navy/80">
            Handpicked tour packages for unforgettable experiences
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popularTours.map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                    {tour.categories.slice(0, 2).map((category) => (
                      <Badge
                        key={category}
                        className={cn("text-xs", getCategoryBadgeClass(category))}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                  {tour.featured && (
                    <Badge className="absolute right-3 top-3 bg-navy text-white">
                      Featured
                    </Badge>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <h3 className="line-clamp-1 text-lg font-bold text-navy transition-colors group-hover:text-navy/80">
                    {tour.name}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-navy/80">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {tour.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {tour.duration} Days
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pb-2">
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {tour.description}
                  </p>
                </CardContent>

                <CardFooter className="flex items-center justify-between border-t border-border pt-4">
                  <div>
                    
                    <p className="text-xl font-bold text-primary">
                      {tour.basePrice.toLocaleString()} PKR
                    </p>
                    <span className="text-xs text-navy">For 2 Persons</span>
                  </div>
                  <Button asChild className="text-black bg-gold hover:bg-gold/80 " >
                    <Link href={`/tours/${tour.id}`}>View Tour</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Button asChild className="bg-white text-black border border-navy hover:bg-navy/10 hover:bg-navy hover:text-white">
            <Link href="/tours">
              View All Tours
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
