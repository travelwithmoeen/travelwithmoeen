import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TourCategory, TourRegion, TransportType, tours } from "@/data/tours";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  // Filters
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  selectedCategories: TourCategory[];
  onCategoryChange: (category: TourCategory) => void;
  selectedRegions: TourRegion[];
  onRegionChange: (region: TourRegion) => void;
  selectedTransport: TransportType[];
  onTransportChange: (transport: TransportType) => void;
  selectedDuration: string;
  onDurationChange: (value: string) => void;
  onClearFilters: () => void;
}

// Derive available filter values from the tours data so filters stay in sync
const categories: TourCategory[] = Array.from(
  new Set(tours.flatMap((t) => t.categories))
).sort() as TourCategory[];

const regions: TourRegion[] = Array.from(new Set(tours.map((t) => t.region))).sort() as TourRegion[];

const transportTypes: TransportType[] = Array.from(
  new Set(tours.map((t) => t.transport))
).sort() as TransportType[];
const durations = [
  { value: "all", label: "All Durations" },
  { value: "1-3", label: "1-3 Days" },
  { value: "4-5", label: "4-5 Days" },
  { value: "6-7", label: "6-7 Days" },
  { value: "8-10", label: "8-10 Days" },
];

export default function FilterSidebar({
  isOpen,
  onClose,
  priceRange,
  onPriceRangeChange,
  selectedCategories,
  onCategoryChange,
  selectedRegions,
  onRegionChange,
  selectedTransport,
  onTransportChange,
  selectedDuration,
  onDurationChange,
  onClearFilters,
}: FilterSidebarProps) {
  // Define transport-specific region lists
  const roadRegions: TourRegion[] = [
    "Skardu Valley",
    "Hunza Valley",
    "Skardu & Hunza",
    "Minimarg Astor Valley",
    "Fairy Meadows Nanga Base Camp",
    "Murree Patriata Galiyat",
    "Murree Ayubia Nathiagali",
    "Naran Kaghan & Babusar Top",
    "Neelum Valley Kashmir",
    "Neelum Taobat Arang Kel",
    "Swat Kalam & Malam Jabba",
    "Islamabad",
    "Kalash Valley & Chitral",
    "Kumrat and Katora Lake",
  ];

  const airRegions: TourRegion[] = [
    "Skardu Valley",
    "Hunza Valley",
    "Skardu & Hunza",
    "Minimarg Astor Valley",
    "Fairy Meadows Nanga Base Camp",
  ];

  // Compute which regions to display based on selected transport
  let displayedRegions: TourRegion[] = regions;
  if (selectedTransport.length === 1) {
    if (selectedTransport.includes("By Road")) displayedRegions = roadRegions;
    else if (selectedTransport.includes("By Air")) displayedRegions = airRegions;
  } else if (selectedTransport.length > 1) {
    // If both transports selected, show union of both lists (unique values)
    displayedRegions = Array.from(new Set([...roadRegions, ...airRegions, ...regions]));
  }
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "filter-sidebar fixed left-0 top-0 z-40 h-full w-60 overflow-y-auto p-6 transition-transform duration-300 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:translate-x-0 lg:self-start border-2 border-neutral-200 bg-background rounded-lg",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Header */}
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <h2 className="text-lg font-bold text-[navy]">Filters</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Desktop Header */}
        <div className="mb-6 hidden lg:block">
          <h2 className="text-lg font-bold text-navy">Filters</h2>
          <p className="text-sm text-muted-foreground">
            Refine your tour search
          </p>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <Label className="mb-3 block text-sm font-semibold text-navy">
            Price Range
          </Label>
          <Slider
            value={priceRange}
            onValueChange={(value) =>
              onPriceRangeChange(value as [number, number])
            }
            min={0}
            max={1000000}
            step={5000}
            className="mb-3"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gold">
              {priceRange[0].toLocaleString()}PKR
            </span>
            <span className="text-muted-navy">to</span>
            <span className="font-medium text-gold">
              {priceRange[1].toLocaleString()}PKR
            </span>
          </div>
        </div>

        {/* Location / Region */}
        <div className="mb-8">
          <Label className="mb-3 block text-sm font-semibold text-navy">
            Location / Region
          </Label>
          <div className="space-y-3">
            {displayedRegions.map((region) => (
              <div key={region} className="flex items-center space-x-2">
                <Checkbox
                  id={`region-${region}`}
                  checked={selectedRegions.includes(region)}
                  onCheckedChange={() => onRegionChange(region)}
                />
                <label
                  htmlFor={`region-${region}`}
                  className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {region}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        {/* <div className="mb-8">
          <Label className="mb-3 block text-sm font-semibold text-navy">
            Categories
          </Label>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => onCategoryChange(category)}
                />
                <label
                  htmlFor={category}
                  className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div> */}

        {/* Transport */}
        <div className="mb-8">
          <Label className="mb-3 block text-sm font-semibold text-navy">
            Transport
          </Label>
          <div className="space-y-3">
            {transportTypes.map((transport) => (
              <div key={transport} className="flex items-center space-x-2">
                <Checkbox
                  id={`transport-${transport}`}
                  checked={selectedTransport.includes(transport)}
                  onCheckedChange={() => onTransportChange(transport)}
                />
                <label
                  htmlFor={`transport-${transport}`}
                  className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {transport}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="mb-8">
          <Label className="mb-3 block text-sm font-semibold text-navy">
            Duration
          </Label>
          <Select value={selectedDuration} onValueChange={onDurationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {durations.map((duration) => (
                <SelectItem key={duration.value} value={duration.value}>
                  {duration.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        <Button
        
          className="w-full bg-navy text-cream hover:bg-navy-light"
         
          onClick={onClearFilters}
        >
          Clear All Filters
        </Button>
      </aside>
    </>
  );
}
