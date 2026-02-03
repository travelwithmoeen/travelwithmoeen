"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bus, Plane, Search, Phone, Pencil, Plus, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tours, Tour, TourCategory, TransportType } from "@/data/tours";
import { TourCard } from "@/components/TourCard";
import { cn } from "@/lib/utils";

interface AddOn {
  id: string;
  name: string;
  price: number;
}

const addOns: AddOn[] = [
  { id: "meals", name: "Meals", price: 30000 },
  { id: "guide", name: "Guide", price: 20000 },
];

export function PackageCalculator() {
  const [transportMode, setTransportMode] = useState<TransportType>("By Road");
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [travelers, setTravelers] = useState<number>(1);
  const [planCategory, setPlanCategory] = useState<TourCategory>("Deluxe");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [showMatchingTours, setShowMatchingTours] = useState(false);

  // Get unique destinations from tours
  const destinations = useMemo(() => {
    const uniqueLocations = [...new Set(tours.map((tour) => tour.location))];
    return uniqueLocations;
  }, []);

  // Get unique durations based on selected destination
  const durations = useMemo(() => {
    const filteredTours = selectedDestination
      ? tours.filter((tour) => tour.location === selectedDestination)
      : tours;
    const uniqueDurations = [
      ...new Set(filteredTours.map((tour) => tour.duration)),
    ];
    return uniqueDurations.sort((a, b) => a - b);
  }, [selectedDestination]);

  // Filter matching tours
  const matchingTours = useMemo(() => {
    return tours.filter((tour) => {
      const matchTransport = tour.transport === transportMode;
      const matchDestination =
        !selectedDestination || tour.location === selectedDestination;
      const matchDuration =
        !selectedDuration || tour.duration === parseInt(selectedDuration);
      const matchCategory = tour.categories.includes(planCategory);

      return (
        matchTransport && matchDestination && matchDuration && matchCategory
      );
    });
  }, [transportMode, selectedDestination, selectedDuration, planCategory]);

  // Calculate estimated price
  const estimatedPrice = useMemo(() => {
    // Find a matching tour to get base price
    const matchedTour = matchingTours[0];
    if (!matchedTour) {
      // Default calculation if no tour matches
      const basePrice = transportMode === "By Air" ? 50000 : 25000;
      const categoryMultiplier =
        planCategory === "Luxury"
          ? 1.5
          : planCategory === "Executive"
            ? 1.25
            : 1;
      const durationDays = selectedDuration ? parseInt(selectedDuration) : 1;
      const addOnsTotal = selectedAddOns.reduce((sum, id) => {
        const addon = addOns.find((a) => a.id === id);
        return sum + (addon?.price || 0);
      }, 0);

      return Math.round(
        basePrice * durationDays * categoryMultiplier * travelers + addOnsTotal,
      );
    }

    // Get price from matched tour package
    const pkg = matchedTour.packages.find((p) => p.category === planCategory);
    const basePrice = pkg?.price || matchedTour.basePrice;
    const addOnsTotal = selectedAddOns.reduce((sum, id) => {
      const addon = addOns.find((a) => a.id === id);
      return sum + (addon?.price || 0);
    }, 0);

    // Calculate per-person price (assuming base is for 2)
    const perPersonPrice = basePrice / 2;
    return Math.round(perPersonPrice * travelers + addOnsTotal);
  }, [
    matchingTours,
    transportMode,
    planCategory,
    travelers,
    selectedAddOns,
    selectedDuration,
  ]);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  const handleViewMatchingTours = () => {
    setShowMatchingTours(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PK").format(price);
  };

  return (
    <section className="bg-[#f7f6f1] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <Badge className="mb-4 bg-primary text-primary-foreground">
            Plan Your Trip
          </Badge>
          <h2 className="text-3xl font-bold text-navy md:text-4xl">
            Package Builder
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-navy-700">
            Customize your perfect trip and get an instant price estimate
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="overflow-hidden border-0 shadow-xl">
            <CardContent className="p-0">
              <div className="grid gap-0 grid-cols-1 md:grid-cols-3">
                {/* Left Side - Form */}
                <div className="p-6 md:p-8 md:col-span-2">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Bus className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-navy">
                      Package Builder
                    </h3>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* 1. Transport Mode */}
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                        1. Transport Mode
                      </label>
                      <div className="flex gap-2">
                        <Button
                          variant={
                            transportMode === "By Road" ? "default" : "outline"
                          }
                          className={cn(
                            "flex-1 gap-2",
                            transportMode === "By Road" &&
                              "bg-navy text-white hover:bg-gold",
                          )}
                          onClick={() => setTransportMode("By Road")}
                        >
                          <Bus className="h-4 w-4 " />
                          By Road
                        </Button>
                        <Button
                          variant={
                            transportMode === "By Air" ? "default" : "outline"
                          }
                          className={cn(
                            "flex-1 gap-2",
                            transportMode === "By Air" &&
                              "bg-navy text-white hover:bg-gold",
                          )}
                          onClick={() => setTransportMode("By Air")}
                        >
                          <Plane className="h-4 w-4" />
                          By Air
                        </Button>
                      </div>
                    </div>

                    {/* 2. Destination */}
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                        2. Destination
                      </label>
                      <Select
                        value={selectedDestination}
                        onValueChange={setSelectedDestination}
                      >
                        <SelectTrigger className="h-11 bg-white">
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                        <SelectContent>
                          {destinations.map((dest) => (
                            <SelectItem key={dest} value={dest}>
                              {dest}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 3. Duration & Specific Trip */}
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                        3. Duration & Specific Trip
                      </label>
                      <Select
                        value={selectedDuration}
                        onValueChange={setSelectedDuration}
                      >
                        <SelectTrigger className="h-11 bg-white">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {durations.map((dur) => (
                            <SelectItem key={dur} value={dur.toString()}>
                              {dur} Day{dur > 1 ? "s" : ""} Tour
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 4. Travelers */}
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                        4. Travelers ({travelers})
                      </label>
                      <div className="flex items-center gap-4 pt-2">
                        <Slider
                          value={[travelers]}
                          onValueChange={([val]) => setTravelers(val)}
                          min={1}
                          max={10}
                          step={1}
                          className="flex-1"
                        />
                        <span className="w-8 text-center font-semibold text-secondary">
                          {travelers}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 5. Plan Category */}
                  <div className="mt-6">
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                      5. Plan Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(
                        ["Deluxe", "Executive", "Luxury"] as TourCategory[]
                      ).map((category) => (
                        <Button
                          key={category}
                          variant={
                            planCategory === category ? "default" : "outline"
                          }
                          className={cn(
                            "min-w-[100px] bg-[#faf9f5]",
                            planCategory === category &&
                              "bg-navy text-white hover:bg-gold",
                          )}
                          onClick={() => setPlanCategory(category)}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* 6. Optional Add-ons */}
                  <div className="mt-6">
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                      6. Optional Add-ons
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {addOns.map((addon) => (
                        <Button
                          key={addon.id}
                          variant="outline"
                          className={cn(
                            "gap-2",
                            selectedAddOns.includes(addon.id) &&
                              "border-primary bg-[#faf9f5] text-black hover:bg-gold",
                          )}
                          onClick={() => toggleAddOn(addon.id)}
                        >
                          {selectedAddOns.includes(addon.id) ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                          {addon.name} (+{formatPrice(addon.price / 1000)}k)
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side - Price Display */}
                <div className="flex flex-col bg-muted/50 p-6 md:p-8 md:col-span-1">
                  <div className="mb-6 text-center">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Estimated Trip Quote
                    </span>
                  </div>

                  <motion.div
                    key={estimatedPrice}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 overflow-hidden rounded-2xl  p-6 text-center bg-navy text-white"
                  >
                    <div className="relative">
                      <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-gold/20" />
                      <p className="relative text-4xl font-bold text-white md:text-5xl">
                        PKR {formatPrice(estimatedPrice)}
                      </p>
                      <p className="mt-2 text-sm uppercase tracking-wide text-white/80">
                        {transportMode} • {planCategory} • {travelers} Pax
                      </p>
                    </div>
                  </motion.div>

                  <div className="space-y-3">
                    <Button
                      variant="default"
                      size="lg"
                      className="w-full gap-2 bg-gold text-navy hover:bg-gold-hover"
                      onClick={handleViewMatchingTours}
                    >
                      <Search className="h-4 w-4" />
                      View Matching Tours
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full gap-2 text-navy border-navy hover:bg-navy/5"
                    >
                      <Pencil className="h-4 w-4" />
                      Customize Your Trip
                    </Button>

                    <Button
                      size="lg"
                      className="w-full gap-2 bg-[hsl(160,84%,39%)] text-white hover:bg-[hsl(160,84%,35%)]"
                    >
                      <Phone className="h-4 w-4" />
                      Book Via WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Matching Tours Section */}
        <AnimatePresence>
          {showMatchingTours && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-12"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-secondary">
                  Matching Tours ({matchingTours.length})
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMatchingTours(false)}
                >
                  Hide
                </Button>
              </div>

              {matchingTours.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {matchingTours.map((tour, index) => (
                    <motion.div
                      key={tour.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                      <TourCard tour={tour} view="grid" />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No tours match your current selection. Try adjusting your
                    filters.
                  </p>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
