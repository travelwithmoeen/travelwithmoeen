"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Mail, User, Plane, Car, MapPin, Loader2 } from "lucide-react";
import emailjs from "@emailjs/browser";

import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Location data organized by region
const locationData = {
  GB: [
    "Skardu",
    "Hunza",
    "Astor Minimarg",
    "Fairy Meadows",

  ],
  KPK: [
    "Naran",
    "Kalash Valley",
    "Swat Kalam",
    "Kumrat Valley",
   
  ],
  KASHMIR: [
    "Neelum Valley",
    "Ratti Gali",
    "Arangkel",
    "Taobat Valley",

  ],
};

export default function CustomizeTrip() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    days: 5,
    tripMode: "air" as "air" | "road",
    selectedLocations: [] as string[],
  });

  const handleLocationToggle = (location: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedLocations: prev.selectedLocations.includes(location)
        ? prev.selectedLocations.filter((l) => l !== location)
        : [...prev.selectedLocations, location],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName.trim()) {
      toast.error("Name Required", {
        description: "Please enter your full name.",
        position: "top-right",
      });
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Valid Email Required", {
        description: "Please enter a valid email address.",
        position: "top-right",
      });
      return;
    }

    if (formData.selectedLocations.length === 0) {
      toast.error("Select Locations", {
        description: "Please select at least one destination.",
        position: "top-right",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // EmailJS integration
      // You need to replace these with your actual EmailJS credentials
      const templateParams = {
        from_name: formData.fullName,
        from_email: formData.email,
        days: formData.days,
        trip_mode: formData.tripMode === "air" ? "By Air" : "By Road",
        locations: formData.selectedLocations.join(", "),
        message: `Custom Trip Request:
- Name: ${formData.fullName}
- Email: ${formData.email}
- Duration: ${formData.days} Days
- Trip Mode: ${formData.tripMode === "air" ? "By Air" : "By Road"}
- Destinations: ${formData.selectedLocations.join(", ")}`,
      };

      await emailjs.send(
        "service_3aeq96g",
        "template_hi5ldme",
        templateParams,
        "CrpJGXuytR1u1QPwD"
      );

      toast.success("Email Sent Successfully!", {
        description: "We'll get back to you within 24 hours with a custom quote.",
        position: "top-right",
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        days: 5,
        tripMode: "air",
        selectedLocations: [],
      });
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Email Failed to Send", {
        description: "Please try again or contact us directly.",
        position: "top-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
 

      <main className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl"
          >
            {/* Header Card */}
            <div className="overflow-hidden rounded-t-2xl bg-navy ">
              <div className="flex items-center justify-between px-8 py-6">
                <h1 className="font-serif text-3xl font-bold italic text-white">
                  Plan your trip
                </h1>
                <Pencil className="h-6 w-6 text-gold" />
              </div>
              <div className="h-1 bg-gold" />
            </div>

            {/* Form Card */}
            <div className="rounded-b-2xl bg-background p-8 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name and Email */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-foreground">
                      Full Name
                    </Label>
                    <div className="relative">
                      <Input
                        id="fullName"
                        placeholder="Traveler Name"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            fullName: e.target.value,
                          }))
                        }
                        className="pr-10"
                      />
                      <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="Email for the Quote"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="pr-10"
                      />
                      <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {/* Days and Trip Mode */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground">Days:</Label>
                      <span className="text-lg font-semibold text-navy">
                        {formData.days}
                      </span>
                    </div>
                    <Slider
                      value={[formData.days]}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, days: value[0] }))
                      }
                      min={1}
                      max={15}
                      step={1}
                      className="w-full text-gold"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Trip Mode</Label>
                    <div className="flex overflow-hidden rounded-lg border border-border">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, tripMode: "air" }))
                        }
                        className={cn(
                          "flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-all",
                          formData.tripMode === "air"
                            ? "bg-navy text-white"
                            : "bg-background text-muted-foreground hover:bg-muted"
                        )}
                      >
                        <Plane className="h-4 w-4" />
                        By Air
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, tripMode: "road" }))
                        }
                        className={cn(
                          "flex flex-1 items-center justify-center gap-2 border-l border-border py-3 text-sm font-medium transition-all",
                          formData.tripMode === "road"
                            ? "bg-navy text-white"
                            : "bg-background text-muted-foreground hover:bg-muted"
                        )}
                      >
                        <Car className="h-4 w-4" />
                        By Road
                      </button>
                    </div>
                  </div>
                </div>

                {/* Target Locations */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2 text-foreground">
                    <MapPin className="h-4 w-4" />
                    Target Locations
                  </Label>

                  <Tabs defaultValue="GB" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-muted">
                      <TabsTrigger
                        value="GB"
                        className="data-[state=active]:border-b-2 data-[state=active]:border-gold data-[state=active]:bg-white"
                      >
                        GB
                      </TabsTrigger>
                      <TabsTrigger
                        value="KPK"
                        className="data-[state=active]:border-b-2 data-[state=active]:border-gold data-[state=active]:bg-white"
                      >
                        KPK
                      </TabsTrigger>
                      <TabsTrigger
                        value="KASHMIR"
                        className="data-[state=active]:border-b-2 data-[state=active]:border-gold data-[state=active]:bg-white"
                      >
                        KASHMIR
                      </TabsTrigger>
                    </TabsList>

                    {Object.entries(locationData).map(([region, locations]) => (
                      <TabsContent
                        key={region}
                        value={region}
                        className="mt-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          {locations.map((location) => (
                            <div
                              key={location}
                              className="flex items-center space-x-3"
                            >
                              <Checkbox
                                id={location}
                                checked={formData.selectedLocations.includes(
                                  location
                                )}
                                onCheckedChange={() =>
                                  handleLocationToggle(location)
                                }
                                className="border-secondary data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground"
                              />
                              <Label
                                htmlFor={location}
                                className="cursor-pointer text-sm font-medium text-foreground"
                              >
                                {location}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>

                  {/* Selected locations preview */}
                  {/* {formData.selectedLocations.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="rounded-lg bg-muted/50 p-3"
                    >
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Selected:</span>{" "}
                        {formData.selectedLocations.join(", ")}
                      </p>
                    </motion.div>
                  )} */}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
               
                  className="w-full bg-navy text-white hover:bg-navy/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Custom Request"
                  )}
                </Button>
              </form>
            </div>

          </motion.div>
        </div>
      </main>

    </div>
  );
}
