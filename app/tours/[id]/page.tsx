"use client";

import  Link  from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock, MapPin, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tours, getCategoryBadgeClass } from "@/data/tours";
import { TourOverview } from "@/components/tours/TourOverview";
import { cn } from "@/lib/utils";

export default function TourDetails() {
  const { id } = useParams<{ id: string }>();
  const tour = tours.find((t) => t.id === id);

  if (!tour) {
    return (
      <div className="min-h-screen bg-[#faf9f5]">
 
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="mb-4 text-2xl font-bold text-secondary">
            Tour Not Found
          </h1>
          <p className="mb-8 text-muted-foreground">
            The tour you're looking for doesn't exist.
          </p>
          <Button asChild >
            <Link href="/tours">Browse All Tours</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f5]">


      {/* Hero Image */}
      <div className="relative h-64 overflow-hidden md:h-96">
        <img
          src={tour.image}
          alt={tour.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/70 via-navy-dark/50 to-background" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-secondary-foreground">
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
            <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
              {tour.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-foreground/80">
              <span className="flex items-center gap-1 text-white">
                <MapPin className="h-4 w-4 text-white" />
                {tour.location}
              </span>
              <span className="flex items-center gap-1 text-white">
                <Clock className="h-4 w-4 text-white" />
                {tour.duration} {tour.duration === 1 ? "Day" : "Days"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button asChild  className="mb-6 text-navy border border-navy bg-white hover:bg-navy hover:text-white">
          <Link href="/tours">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tours
          </Link>
        </Button>

        {/* Tour Overview Section */}
        <TourOverview 
          itinerary={tour.itinerary} 
          galleryImages={tour.galleryImages} 
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            {/* Description */}
            {/* <Card className="mb-8">
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
            </Card> */}
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
                  <TabsList className="mb-6 grid w-full grid-cols-3 h-auto p-1 bg-muted ">
                    {tour.packages.map((pkg) => (
                      <TabsTrigger
                        key={pkg.category}
                        value={pkg.category}
                        className="py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                      >
                        {pkg.category}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {tour.packages.map((pkg) => (
                    <TabsContent key={pkg.category} value={pkg.category} className="mt-0">
                      <div className="space-y-4">
                        {/* Price */}
                        <div className="text-center py-4 bg-muted/30 rounded-lg">
                          <span className="text-sm text-muted-foreground">
                            Starting from
                          </span>
                          <p className="text-3xl font-bold text-primary my-1">
                            {pkg.price.toLocaleString()}.PKR
                          </p>
                          <span className="text-sm text-muted-foreground">
                           For 2 Persons
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
                        <Button className="w-full" asChild>
                          <a
                            href={`https://wa.me/923339981177?text=${encodeURIComponent(
                              `Hi, I'm interested in booking:\n\n` +
                              `*Tour:* ${tour.name}\n` +
                              `*Package:* ${pkg.category}\n` +
                              `*Hotel:* ${pkg.features[0]}\n` +
                              `*Price:* ${pkg.price.toLocaleString()} PKR\n\n` +
                              `Please provide more details.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Book Now
                          </a>
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
