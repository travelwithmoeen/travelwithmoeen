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
import { TourCategory, TourRegion, PackageType, TransportType } from "@/data/tours";
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
  selectedPackageTypes: PackageType[];
  onPackageTypeChange: (packageType: PackageType) => void;
  selectedTransport: TransportType[];
  onTransportChange: (transport: TransportType) => void;
  selectedDuration: string;
  onDurationChange: (value: string) => void;
  onClearFilters: () => void;
}

const categories: TourCategory[] = ["Deluxe", "Executive", "Luxury"];
const regions: TourRegion[] = ["Skardu", "Deosai", "Minimarg", "Hunza"];
const packageTypes: PackageType[] = ["Couple", "Family", "Group"];
const transportTypes: TransportType[] = ["By Road", "By Air"];
const durations = [
  { value: "all", label: "All Durations" },
  { value: "1-3", label: "1-3 Days" },
  { value: "4-5", label: "4-5 Days" },
  { value: "6-7", label: "6-7 Days" },
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
  selectedPackageTypes,
  onPackageTypeChange,
  selectedTransport,
  onTransportChange,
  selectedDuration,
  onDurationChange,
  onClearFilters,
}: FilterSidebarProps) {
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
          "filter-sidebar fixed left-0 top-0 z-40 h-full w-80 overflow-y-auto p-6 transition-transform duration-300 lg:static lg:translate-x-0 border-2 border-neutral-200",
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
            max={500000}
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
            {regions.map((region) => (
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
        <div className="mb-8">
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
        </div>

        {/* Package Type */}
        <div className="mb-8">
          <Label className="mb-3 block text-sm font-semibold text-navy">
            Package Type
          </Label>
          <div className="space-y-3">
            {packageTypes.map((pkgType) => (
              <div key={pkgType} className="flex items-center space-x-2">
                <Checkbox
                  id={`pkg-${pkgType}`}
                  checked={selectedPackageTypes.includes(pkgType)}
                  onCheckedChange={() => onPackageTypeChange(pkgType)}
                />
                <label
                  htmlFor={`pkg-${pkgType}`}
                  className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {pkgType}
                </label>
              </div>
            ))}
          </div>
        </div>

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
