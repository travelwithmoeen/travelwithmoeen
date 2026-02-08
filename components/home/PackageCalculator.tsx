"use client";
import { useState, useMemo, useEffect } from "react";
import  Link  from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bus, Plane, Search, Phone, Pencil, Plus, Check,
  Hotel, Car, Users, Calendar, MapPin, Navigation,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  roadDestinations, airDestinations, hotelCategories,
  optionalAddOns, calculateTripPrice, getAvailableVehicles,
  roadDepartures, airDepartures,
  type HotelCategory, type VehicleType,
} from "@/data/pricing";
import { tours } from "@/data/tours";
import { TourCard } from "@/components/TourCard";
import { cn } from "@/lib/utils";

type TransportMode = "By Road" | "By Air";
type RoomType = "twin" | "triple";

export function PackageCalculator() {
  const [transportMode, setTransportMode] = useState<TransportMode>("By Road");
  const [departure, setDeparture] = useState<string>("Islamabad");
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [days, setDays] = useState<number>(5);
  const [travelers, setTravelers] = useState<number>(2);
  const [hotelCategory, setHotelCategory] = useState<HotelCategory>("Deluxe (Lower)");
  const [vehicleType, setVehicleType] = useState<VehicleType>("Honda BRV");
  const [roomType, setRoomType] = useState<RoomType>("twin");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [showMatchingTours, setShowMatchingTours] = useState(false);

  const destinations = transportMode === "By Air" ? airDestinations : roadDestinations;
  const departures = transportMode === "By Air" ? airDepartures : roadDepartures;

  // Available vehicles filtered by seat capacity
  const availableVehicles = useMemo(() => {
    if (!selectedDestination) return [];
    return getAvailableVehicles(selectedDestination, travelers);
  }, [selectedDestination, travelers]);

  // Auto-select first valid vehicle when list changes
  useEffect(() => {
    if (availableVehicles.length > 0 && !availableVehicles.find((v) => v.type === vehicleType)) {
      setVehicleType(availableVehicles[0].type);
    }
  }, [availableVehicles, vehicleType]);

  // Reset destination & departure when transport mode changes
  const handleTransportChange = (mode: TransportMode) => {
    setTransportMode(mode);
    setSelectedDestination("");
    setDeparture("Islamabad");
  };

  const pricing = useMemo(() => {
    if (!selectedDestination) return null;
    return calculateTripPrice({
      transportMode, destination: selectedDestination, hotelCategory,
      vehicleType, days, travelers, roomType, selectedAddOns, departure,
    });
  }, [transportMode, selectedDestination, hotelCategory, vehicleType, days, travelers, roomType, selectedAddOns, departure]);

  const matchingTours = useMemo(() => {
    return tours.filter((tour) => {
      const matchTransport = tour.transport === transportMode;
      const matchDest = !selectedDestination || tour.location.toLowerCase().includes(selectedDestination.toLowerCase());
      return matchTransport && matchDest;
    });
  }, [transportMode, selectedDestination]);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const formatPrice = (price: number) => new Intl.NumberFormat("en-PK").format(price);

  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <Badge className="mb-4 bg-gold text-navy">Plan Your Trip</Badge>
          <h2 className="text-3xl font-bold text-navy md:text-4xl">Package Builder</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
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
              <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Left Side - Form */}
                <div className="p-6 md:col-span-2 md:p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20">
                      <MapPin className="h-5 w-5 text-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-navy">Package Builder</h3>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* 1. Transport Mode */}
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                        1. Transport Mode
                      </label>
                      <div className="flex gap-2">
                        {(["By Road", "By Air"] as TransportMode[]).map((mode) => (
                          <Button
                            key={mode}
                            variant={transportMode === mode ? "navy" : "outline"}
                            className="flex-1 gap-2"
                            onClick={() => handleTransportChange(mode)}
                          >
                            {mode === "By Road" ? <Bus className="h-4 w-4" /> : <Plane className="h-4 w-4" />}
                            {mode}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Departure City */}
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                        <Navigation className="mr-1 inline h-3.5 w-3.5" /> 2. Departure City
                      </label>
                      <div className="flex gap-2">
                        {departures.map((city) => (
                          <Button
                            key={city}
                            variant={departure === city ? "navy" : "outline"}
                            className="flex-1"
                            onClick={() => setDeparture(city)}
                          >
                            {city}
                          </Button>
                        ))}
                      </div>
                      {transportMode === "By Air" && departure === "Karachi" && (
                        <p className="mt-1.5 text-xs text-primary">+PKR 30,000/person surcharge</p>
                      )}
                      {transportMode === "By Road" && departure === "Lahore" && (
                        <p className="mt-1.5 text-xs text-primary">+PKR 15,000 flat surcharge</p>
                      )}
                    </div>

                    {/* 3. Destination */}
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                        3. Destination
                      </label>
                      <Select value={selectedDestination} onValueChange={setSelectedDestination}>
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                        <SelectContent>
                          {destinations.map((dest) => (
                            <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 4. Hotel Category */}
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                        <Hotel className="mr-1 inline h-3.5 w-3.5" /> 4. Hotel Category
                      </label>
                      <Select value={hotelCategory} onValueChange={(v) => setHotelCategory(v as HotelCategory)}>
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {hotelCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 5. Vehicle Type (filtered by seats) */}
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                        <Car className="mr-1 inline h-3.5 w-3.5" /> 5. Vehicle Type
                      </label>
                      <Select
                        value={vehicleType}
                        onValueChange={(v) => setVehicleType(v as VehicleType)}
                        disabled={availableVehicles.length === 0}
                      >
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue placeholder={availableVehicles.length === 0 ? "Select destination first" : undefined} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableVehicles.map(({ type, rate }) => (
                            <SelectItem key={type} value={type}>
                              {type} ({rate.seats} seats)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedDestination && availableVehicles.length === 0 && (
                        <p className="mt-1.5 text-xs text-destructive">No vehicle fits {travelers} travelers</p>
                      )}
                    </div>

                    {/* 6. Days */}
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                        <Calendar className="mr-1 inline h-3.5 w-3.5" /> 6. Duration ({days} Days)
                      </label>
                      <div className="flex items-center gap-4 pt-2">
                        <Slider
                          value={[days]}
                          onValueChange={([val]) => setDays(val)}
                          min={2}
                          max={15}
                          step={1}
                          className="flex-1"
                        />
                        <span className="w-8 text-center font-semibold text-navy">{days}</span>
                      </div>
                    </div>

                    {/* 7. Travelers */}
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                        <Users className="mr-1 inline h-3.5 w-3.5" /> 7. Travelers ({travelers})
                      </label>
                      <div className="flex items-center gap-4 pt-2">
                        <Slider
                          value={[travelers]}
                          onValueChange={([val]) => setTravelers(val)}
                          min={1}
                          max={21}
                          step={1}
                          className="flex-1"
                        />
                        <span className="w-8 text-center font-semibold text-navy">{travelers}</span>
                      </div>
                    </div>
                  </div>

                  {/* 8. Room Type */}
                  <div className="mt-6">
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                      8. Room Type
                    </label>
                    <div className="flex gap-2">
                      {(["twin", "triple"] as RoomType[]).map((type) => (
                        <Button
                          key={type}
                          variant={roomType === type ? "navy" : "outline"}
                          className="min-w-25 capitalize"
                          onClick={() => setRoomType(type)}
                        >
                          {type === "twin" ? "Twin (2 Pax)" : "Triple (3 Pax)"}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* 9. Add-ons */}
                  <div className="mt-6">
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                      9. Optional Add-ons
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {optionalAddOns.map((addon) => (
                        <Button
                          key={addon.id}
                          variant="outline"
                          className={cn(
                            "gap-2",
                            selectedAddOns.includes(addon.id) && "border-navy bg-navy/10 text-navy"
                          )}
                          onClick={() => toggleAddOn(addon.id)}
                        >
                          {selectedAddOns.includes(addon.id) ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                          {addon.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side - Price Display */}
                <div className="flex flex-col rounded-xl bg-muted/50 p-6 md:p-8">
                  <div className="mb-4 text-center">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Estimated Trip Quote
                    </span>
                  </div>

                  {pricing ? (
                    <>
                      <motion.div
                        key={pricing.grandTotal}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="mb-4 overflow-hidden rounded-2xl bg-navy p-6 text-center"
                      >
                        <div className="relative">
                          <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-white/10" />
                          <p className="relative text-3xl font-bold text-gold md:text-4xl">
                            PKR {formatPrice(pricing.grandTotal)}
                          </p>
                          <p className="mt-1 text-sm text-gold/80">
                            Total for {travelers} traveler{travelers > 1 ? "s" : ""}
                          </p>
                          <p className="mt-1 text-lg font-semibold text-gold/90">
                            PKR {formatPrice(pricing.perPerson)} / person
                          </p>
                        </div>
                      </motion.div>

                      {/* Breakdown */}
                      <div className="mb-4 space-y-2 rounded-xl bg-background p-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Hotel ({Math.max(days - 1, 1)} nights)</span>
                          <span className="font-medium text-navy">PKR {formatPrice(pricing.hotelTotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Vehicle ({days} days)</span>
                          <span className="font-medium text-navy">PKR {formatPrice(pricing.vehicleTotal)}</span>
                        </div>
                        {pricing.airTicketTotal > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Air Tickets</span>
                            <span className="font-medium text-navy">PKR {formatPrice(pricing.airTicketTotal)}</span>
                          </div>
                        )}
                        {pricing.departureSurcharge > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Departure Surcharge</span>
                            <span className="font-medium text-navy">PKR {formatPrice(pricing.departureSurcharge)}</span>
                          </div>
                        )}
                        {pricing.addOnsTotal > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Add-ons</span>
                            <span className="font-medium text-navy">PKR {formatPrice(pricing.addOnsTotal)}</span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between font-bold">
                          <span className="text-navy">Grand Total</span>
                          <span className="text-gold">PKR {formatPrice(pricing.grandTotal)}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="mb-4 rounded-2xl bg-navy/50 p-8 text-center">
                      <MapPin className="mx-auto mb-2 h-8 w-8 text-white/50" />
                      <p className="text-sm text-white/70">Select a destination to see pricing</p>
                    </div>
                  )}

                  <div className="mt-auto space-y-3">
                    <Button variant="gold" size="lg" className="w-full gap-2" onClick={() => setShowMatchingTours(true)}>
                      <Search className="h-4 w-4" /> View Matching Tours
                    </Button>
                    <Button asChild variant="outline-navy" size="lg" className="w-full gap-2">
                      <Link href="/customize-trip"><Pencil className="h-4 w-4" /> Customize Your Trip</Link>
                    </Button>
                    <Button size="lg" className="w-full gap-2 bg-[hsl(160,84%,39%)] text-white hover:bg-[hsl(160,84%,35%)]">
                      <Phone className="h-4 w-4" /> Book Via WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Matching Tours */}
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
                <h3 className="text-2xl font-bold text-navy">
                  Matching Tours ({matchingTours.length})
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowMatchingTours(false)}>Hide</Button>
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
                  <p className="text-muted-foreground">No tours match your current selection. Try adjusting your filters.</p>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
