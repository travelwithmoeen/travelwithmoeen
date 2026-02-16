"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plane, Car, Mail, User, Phone, Globe, MapPin, Calendar,
  Users, Baby, Hotel, BedDouble, DoorOpen, Loader2, Send,
} from "lucide-react";
import emailjs from "@emailjs/browser";

import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const locationData = {
  GB: ["Skardu", "Hunza", "Astor Minimarg", "Fairy Meadows"],
  KPK: ["Naran Valley", "Kalash Valley", "Swat Kalam", "Kumrat Valley"],
  KASHMIR: ["Neelum Valley", "Ratti Gali", "Arangkel", "Taobat Valley"],
};

const tripCategories = [
  { value: "Family", label: "Family" },
  { value: "Solo", label: "Solo" },
  { value: "Honeymoon", label: "Couple Honeymoon" },
  { value: "Corporate", label: "Corporate" },
  { value: "Education", label: "University, School or College" },
];

const tripTypes = [
  "Adventure",
  "Sightseeing",
  "Hiking and Trekking",
  "Food & Cultural",
  "Honeymoon",
  "Safari",
  "Adventure + Sightseeing"
];
const hotelTypes = ["Deluxe", "Premier", "Executive", "Luxury", "Ultra Luxury"];
const roomTypes = ["Master Bed", "Twin Beds","Triple bed"];

export default function CustomizeTrip() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    tripMode: "Air" as "Air" | "Road",
    tripCategory: "",
    fullName: "",
    email: "",
    whatsapp: "",
    passportCountry: "",
    departureCity: "Islamabad",
    tripType: "Adventure",
    depDatePk: "",
    retDatePk: "",
    arrDateForeign: "",
    retDateForeign: "",
    duration: 9,
    adults: 2,
    children: 0,
    selectedLocations: [] as string[],
    hotelType: "Deluxe",
    roomType: "Master Bed",
    numRooms: 1,
    requirements: "",
  });

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleLocation = (loc: string) =>
    update(
      "selectedLocations",
      form.selectedLocations.includes(loc)
        ? form.selectedLocations.filter((l) => l !== loc)
        : [...form.selectedLocations, loc]
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName.trim()) {
      toast.error("Name Required", { description: "Please enter your full name." });
      return;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Valid Email Required", { description: "Please enter a valid email address." });
      return;
    }
    if (form.selectedLocations.length === 0) {
      toast.error("Select Locations", { description: "Please select at least one destination." });
      return;
    }

    setIsSubmitting(true);

    try {
      const templateParams = {
        from_name: form.fullName,
        from_email: form.email,
        message: `Custom Trip Request:
- Trip Mode: By ${form.tripMode}
- Category: ${form.tripCategory || "Not specified"}
- Name: ${form.fullName}
- Email: ${form.email}
- WhatsApp: ${form.whatsapp || "N/A"}
- Passport Country: ${form.passportCountry || "N/A"}
- Departure City: ${form.departureCity}
- Trip Type: ${form.tripType}
- Departure Date (PK): ${form.depDatePk || "N/A"}
- Return Date (PK): ${form.retDatePk || "N/A"}
- Arrival Date (Foreign): ${form.arrDateForeign || "N/A"}
- Return Date (Foreign): ${form.retDateForeign || "N/A"}
- Duration: ${form.duration} Days
- Adults: ${form.adults}
- Children: ${form.children}
- Destinations: ${form.selectedLocations.join(", ")}
- Hotel: ${form.hotelType}
- Room: ${form.roomType} x ${form.numRooms}
- Additional: ${form.requirements || "None"}`,
      };

      await emailjs.send(
        "service_3aeq96g",
        "template_hi5ldme",
        templateParams,
        "CrpJGXuytR1u1QPwD"
      );

      toast.success("Request Submitted!", { description: "We'll get back to you within 24 hours with a custom quote." });

      setForm({
        tripMode: "Air", tripCategory: "", fullName: "", email: "",
        whatsapp: "", passportCountry: "", departureCity: "Islamabad",
        tripType: "Adventure", depDatePk: "", retDatePk: "",
        arrDateForeign: "", retDateForeign: "", duration: 9,
        adults: 2, children: 0, selectedLocations: [],
        hotelType: "Deluxe", roomType: "Master Bed",
        numRooms: 1, requirements: "",
      });
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Submission Failed", { description: "Please try again or contact us directly." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">

      <main className="flex-1 bg-[#f7f6f1] py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-[850px]"
          >
            {/* Card with accent border */}
            <div className="overflow-hidden rounded-xl border-t-4  border-t-gold  bg-white p-8 shadow-xl md:p-12">
              {/* Header */}
              <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold uppercase tracking-wider text-navy">
                  The Best Tour Agency
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">we give you the best of us</p>
              </div>

              <h2 className="mb-8 text-3xl font-light text-navy">Make My Adventure</h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Trip Mode Tabs */}
                <div>
                  <div className="flex overflow-hidden rounded-lg border border-foreground">
                    {(["Air", "Road"] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => update("tripMode", mode)}
                        className={cn(
                          "flex flex-1 items-center justify-center gap-2 border-r border-foreground py-3 text-sm font-bold transition-colors last:border-r-0",
                          form.tripMode === mode
                            ? "bg-navy text-white"
                            : "bg-card text-foreground hover:bg-muted"
                        )}
                      >
                        {mode === "Air" ? <Plane className="h-4 w-4" /> : <Car className="h-4 w-4" />}
                        By {mode} Trip
                      </button>
                    ))}
                  </div>

                  {/* Trip Category */}
                  <RadioGroup
                    value={form.tripCategory}
                    onValueChange={(v) => update("tripCategory", v)}
                    className="mt-4 space-y-2 border-b border-border pb-5"
                  >
                    {tripCategories.map((cat) => (
                      <div key={cat.value} className="flex items-center gap-3">
                        <RadioGroupItem value={cat.value} id={`cat-${cat.value}`} />
                        <Label htmlFor={`cat-${cat.value}`} className="cursor-pointer text-sm text-black">
                          {cat.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Personal Info */}
                <div className="grid gap-5 md:grid-cols-2">
                  <InputField label="Full Name" required icon={<User className="h-4 w-4" />}
                    value={form.fullName} onChange={(v) => update("fullName", v)} />
                  <InputField label="Email ID" required type="email" icon={<Mail className="h-4 w-4" />}
                    value={form.email} onChange={(v) => update("email", v)} />
                  <InputField label="WhatsApp Number" required icon={<Phone className="h-4 w-4" />}
                    value={form.whatsapp} onChange={(v) => update("whatsapp", v)} />
                  <InputField label="Country of Passport" required icon={<Globe className="h-4 w-4" />}
                    value={form.passportCountry} onChange={(v) => update("passportCountry", v)} />
                </div>

                {/* Section: About Your Tour */}
                <div className="text-center">
                  <span className="text-sm font-bold uppercase tracking-wider text-navy">
                    About Your Tour
                  </span>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <InputField label="Departure City" icon={<MapPin className="h-4 w-4" />}
                    value={form.departureCity} onChange={(v) => update("departureCity", v)} />
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-foreground">
                      Trip Type <span className="text-destructive">*</span>
                    </Label>
                    <Select value={form.tripType} onValueChange={(v) => update("tripType", v)}>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {tripTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <InputField label="Departure Date (for Pakistani)" type="date"
                    value={form.depDatePk} onChange={(v) => update("depDatePk", v)} icon={<Calendar className="h-4 w-4" />} />
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <InputField label="Return Date (for Pakistani)" type="date"
                    value={form.retDatePk} onChange={(v) => update("retDatePk", v)} icon={<Calendar className="h-4 w-4" />} />
                  <InputField label="Pakistan Arrival (Foreigners only)" type="date"
                    value={form.arrDateForeign} onChange={(v) => update("arrDateForeign", v)} icon={<Calendar className="h-4 w-4" />} />
                  <InputField label="Return from Pak (Foreigners only)" type="date"
                    value={form.retDateForeign} onChange={(v) => update("retDateForeign", v)} icon={<Calendar className="h-4 w-4" />} />
                </div>

                {/* Sliders: Duration, Adults, Children */}
                <div className="grid gap-6 md:grid-cols-3">
                  <SliderField label="Tour Duration (Days)" icon={<Calendar className="h-4 w-4" />}
                    value={form.duration} min={1} max={30} onChange={(v) => update("duration", v)} />
                  <SliderField label="Adults" icon={<Users className="h-4 w-4" />}
                    value={form.adults} min={1} max={50} onChange={(v) => update("adults", v)} />
                  <SliderField label="Children (Under 12)" icon={<Baby className="h-4 w-4" />}
                    value={form.children} min={0} max={20} onChange={(v) => update("children", v)} />
                </div>

                {/* Destinations */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-xs font-medium text-foreground">
                    <MapPin className="h-4 w-4" />
                    Destinations you wish to visit <span className="text-destructive">*</span>
                  </Label>

                  <Tabs defaultValue="GB" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 rounded-none border border-b-0  p-0">
                      <TabsTrigger value="GB" className="rounded-none border-b border-navy bg-white py-3 font-bold text-navy data-[state=active]:border-b-0 data-[state=active]:bg-navy data-[state=active]:text-white">
                        Gilgit Baltistan
                      </TabsTrigger>
                      <TabsTrigger value="KPK" className="rounded-none border-b border-navy bg-white py-3 font-bold text-navy data-[state=active]:border-b-0 data-[state=active]:bg-navy data-[state=active]:text-white">
                        KPK
                      </TabsTrigger>
                      <TabsTrigger value="KASHMIR" className="rounded-none border-b border-navy bg-white py-3 font-bold text-navy data-[state=active]:border-b-0 data-[state=active]:bg-navy data-[state=active]:text-white">
                        Kashmir
                      </TabsTrigger>
                    </TabsList>

                    {Object.entries(locationData).map(([region, locations]) => (
                      <TabsContent key={region} value={region} className="mt-0 border border-t-0 border-foreground p-5">
                        <div className="grid grid-cols-2 gap-4">
                          {locations.map((loc) => (
                            <div key={loc} className="flex items-center gap-3">
                              <Checkbox
                                id={loc}
                                checked={form.selectedLocations.includes(loc)}
                                onCheckedChange={() => toggleLocation(loc)}
                                className="border-secondary data-[state=checked]:bg-secondary data-[state=checked]:text-navy-foreground"
                              />
                              <Label htmlFor={loc} className="cursor-pointer text-sm text-foreground">{loc}</Label>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>

                  {form.selectedLocations.length > 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-lg bg-muted p-3 text-sm text-muted-foreground"
                    >
                      <span className="font-medium">Selected:</span> {form.selectedLocations.join(", ")}
                    </motion.p>
                  )}
                </div>

                {/* Section: Accommodation */}
                <div className="text-center">
                  <span className="text-sm font-bold uppercase tracking-wider text-navy">
                    Accommodation
                  </span>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-foreground">
                      <Hotel className="mr-1 inline h-3.5 w-3.5" /> Prefer Hotel Type
                    </Label>
                    <Select value={form.hotelType} onValueChange={(v) => update("hotelType", v)}>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {hotelTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-foreground">
                      <BedDouble className="mr-1 inline h-3.5 w-3.5" /> Room Type
                    </Label>
                    <Select value={form.roomType} onValueChange={(v) => update("roomType", v)}>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {roomTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <SliderField
                    label="No of Rooms"
                    icon={<DoorOpen className="h-4 w-4" />}
                    value={form.numRooms}
                    min={1}
                    max={20}
                    onChange={(v) => update("numRooms", v)}
                  />
                </div>

                {/* Additional Requirements */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-foreground">
                    Feel free to share additional requirements so we can plan your tour in the best possible way
                  </Label>
                  <Textarea
                    rows={5}
                    value={form.requirements}
                    onChange={(e) => update("requirements", e.target.value)}
                    placeholder="Any special requests, dietary needs, accessibility requirements..."
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2 bg-gold text-navy hover:bg-gold/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Submitting...</>
                  ) : (
                    <><Send className="h-5 w-5" /> Submit</>
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

/* ── Reusable sub-components ── */

function InputField({
  label, value, onChange, type = "text", required, icon,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative">
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-10"
        />
        {icon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-navy">
            {icon}
          </span>
        )}
      </div>
    </div>
  );
}

function SliderField({
  label, value, min, max, onChange, icon,
}: {
  label: string; value: number; min: number; max: number;
  onChange: (v: number) => void; icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-3 text-center">
      <Label className="flex items-center justify-center gap-1 text-xs font-medium text-foreground">
        {icon} {label}
      </Label>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={1}
        className="w-full"
      />
      <span className="text-lg font-bold text-navy">{value}</span>
    </div>
  );
}
