"use client"
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { tours, getCategoryBadgeClass } from "@/data/tours";
import { cn } from "@/lib/utils";

export default function TourDetails() {
  const { id } = useParams<{ id: string }>();
  const tour = tours.find((t) => t.id === id);

  if (!tour) {
    return (
      <div className="min-h-screen bg-background">
       
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="mb-4 text-2xl font-bold text-secondary">
            Tour Not Found
          </h1>
          <p className="mb-8 text-muted-foreground">
            The tour you're looking for doesn't exist.
          </p>
          <Button asChild variant="gold">
            <Link href="/tours">Browse All Tours</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
  

      {/* Hero Image */}
      <div className="relative h-64 overflow-hidden md:h-96">
        <img
          src={tour.image}
          alt={tour.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-secondary-foreground">
          <div className="container mx-auto">
            <div className="mb-2 flex flex-wrap gap-2">
              {tour.categories.map((category) => (
                <Badge
                  key={category}
                  className={cn("text-xs", getCategoryBadgeClass(category))}
                >
                  {category}
                </Badge>
              ))}
            </div>
            <h1 className="mb-2 text-3xl font-bold text-navy md:text-4xl">
              {tour.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-foreground/80">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {tour.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {tour.duration} {tour.duration === 1 ? "Day" : "Days"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button asChild variant="outline-navy" className="mb-6 bg-accent hover:bg-navy">
          <Link href="/tours">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tours
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            {/* Description */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="accent-underline pb-2">
                  About This Tour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">
                  {tour.description}
                </p>
              </CardContent>
            </Card>

            {/* Itinerary */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="accent-underline pb-2">
                  Day-by-Day Itinerary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {tour.itinerary.map((day) => (
                    <AccordionItem key={day.day} value={`day-${day.day}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 text-left">
                          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gold text-sm font-bold text-black">
                            {day.day}
                          </span>
                          <span className="font-semibold text-secondary">
                            {day.title}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-11">
                          <p className="mb-3 text-muted-foreground">
                            {day.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {day.highlights.map((highlight, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="border-primary/30 text-foreground"
                              >
                                {highlight}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Included / Not Included */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Check className="h-5 w-5 text-success" />
                    What's Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tour.included.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <X className="h-5 w-5 text-destructive" />
                    Not Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tour.notIncluded.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Pricing */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="accent-underline pb-2">
                  Package Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue={tour.packages[0].category}
                  className="w-full"
                >
                  <TabsList className="mb-4 grid w-full grid-cols-1 gap-1">
                    {tour.packages.map((pkg) => (
                      <TabsTrigger
                        key={pkg.category}
                        value={pkg.category}
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        {pkg.category}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {tour.packages.map((pkg) => (
                    <TabsContent key={pkg.category} value={pkg.category}>
                      <div className="space-y-4">
                        {/* Price */}
                        <div className="text-center">
                          <span className="text-sm text-muted-foreground">
                            Starting from
                          </span>
                          <p className="text-3xl font-bold text-primary">
                            ${pkg.price.toLocaleString()}
                          </p>
                          <span className="text-sm text-muted-foreground">
                            per person
                          </span>
                        </div>

                        {/* Features */}
                        <ul className="space-y-2 border-t border-border pt-4">
                          {pkg.features.map((feature, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm"
                            >
                              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>

                        {/* CTA */}
                        <Button variant="gold" size="xl" className="w-full">
                          Book Now
                        </Button>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
