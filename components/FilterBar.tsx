"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar as CalendarIcon, Award, Plane, ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { tours } from "@/data/tours";

interface FilterOption {
  value: string;
  label: string;
}

// Helper functions to get unique values from tours data
function getUniqueRegions(): FilterOption[] {
  const regions = [...new Set(tours.map(tour => tour.region))];
  return regions.map(region => ({
    value: region,
    label: region === "Fairy Meadows" || region === "Islamabad" ? region : `${region} Valley`
  })).sort((a, b) => a.label.localeCompare(b.label));
}

function getUniqueCategories(): FilterOption[] {
  const categories = [...new Set(tours.flatMap(tour => tour.categories))];
  // Filter to show only main plan categories (Deluxe, Executive, Luxury)
  const planCategories = categories.filter(cat =>
    ["Deluxe", "Executive", "Luxury"].includes(cat)
  );
  return planCategories.map(cat => ({
    value: cat,
    label: cat
  }));
}

function getUniqueTransportTypes(): FilterOption[] {
  const transports = [...new Set(tours.map(tour => tour.transport))];
  return transports.map(transport => ({
    value: transport,
    label: transport
  }));
}

function getDurationOptions(): FilterOption[] {
  // Get durations from tours
  const durations = tours.map(tour => tour.duration);
  const options: FilterOption[] = [];

  if (durations.some(d => d >= 1 && d <= 3)) {
    options.push({ value: "1-3", label: "1-3 days" });
  }
  if (durations.some(d => d >= 4 && d <= 5)) {
    options.push({ value: "4-5", label: "4-5 days" });
  }
  if (durations.some(d => d >= 6 && d <= 7)) {
    options.push({ value: "6-7", label: "6-7 days" });
  }
  if (durations.some(d => d >= 8 && d <= 10)) {
    options.push({ value: "8-10", label: "8-10 days" });
  }

  return options;
}

interface FilterFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  placeholder: string;
  options?: FilterOption[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect?: (value: string) => void;
  isDateField?: boolean;
}

function FilterField({ 
  icon, 
  label, 
  value, 
  placeholder, 
  options, 
  isOpen, 
  onToggle, 
  onSelect,
  isDateField 
}: FilterFieldProps) {
  const selectedOption = options?.find(opt => opt.value === value);
  const displayValue = selectedOption?.label || value || placeholder;

  return (
    <div className="relative flex-1 min-w-[180px]">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-lg transition-colors group"
      >
        <div className="text-slate-600 group-hover:text-blue-600 transition-colors">
          {icon}
        </div>
        <div className="flex-1 text-left">
          <div className="text-xs text-slate-500 font-medium mb-0.5">{label}</div>
          <div className={`text-sm font-semibold ${value ? "text-slate-800" : "text-slate-600"}`}>
            {displayValue}
          </div>
        </div>
        {isDateField ? (
          <CalendarIcon size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
        ) : (
          <ChevronDown
            size={18}
            className={`text-slate-400 group-hover:text-blue-600 transition-all ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && options && onSelect && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSelect(option.value);
                    onToggle();
                  }}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors ${
                    value === option.value
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-slate-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FilterBar() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [planCategory, setPlanCategory] = useState("");
  const [transport, setTransport] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Get dynamic options from tours data
  const destinationOptions = useMemo(() => getUniqueRegions(), []);
  const durationOptions = useMemo(() => getDurationOptions(), []);
  const planCategoryOptions = useMemo(() => getUniqueCategories(), []);
  const transportOptions = useMemo(() => getUniqueTransportTypes(), []);

  const handleDropdownToggle = (fieldId: string) => {
    setOpenDropdown(openDropdown === fieldId ? null : fieldId);
  };

  const handleSearch = () => {
    // Build query parameters
    const params = new URLSearchParams();

    if (destination) {
      params.set("region", destination);
    }
    if (duration) {
      params.set("duration", duration);
    }
    if (planCategory) {
      params.set("category", planCategory);
    }
    if (transport) {
      params.set("transport", transport);
    }

    // Navigate to tours page with filters
    const queryString = params.toString();
    router.push(`/tours${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <div className="w-full py-8 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-300/50 p-4">
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-2">
            {/* Destination Field */}
            <FilterField
              icon={<MapPin size={20} />}
              label="Destination"
              value={destination}
              placeholder="Select Region"
              options={destinationOptions}
              isOpen={openDropdown === "destination"}
              onToggle={() => handleDropdownToggle("destination")}
              onSelect={setDestination}
            />

            {/* Divider */}
            <div className="hidden lg:block w-px h-12 bg-slate-200" />

            {/* Duration Field */}
            <FilterField
              icon={<CalendarIcon size={20} />}
              label="Duration"
              value={duration}
              placeholder="Select Duration"
              options={durationOptions}
              isOpen={openDropdown === "duration"}
              onToggle={() => handleDropdownToggle("duration")}
              onSelect={setDuration}
            />

            {/* Divider */}
            <div className="hidden lg:block w-px h-12 bg-slate-200" />

            {/* Plan Category Field */}
            <FilterField
              icon={<Award size={20} />}
              label="Plan Category"
              value={planCategory}
              placeholder="Select Category"
              options={planCategoryOptions}
              isOpen={openDropdown === "planCategory"}
              onToggle={() => handleDropdownToggle("planCategory")}
              onSelect={setPlanCategory}
            />

            {/* Divider */}
            <div className="hidden lg:block w-px h-12 bg-slate-200" />

            {/* Transport Type Field */}
            <FilterField
              icon={<Plane size={20} />}
              label="Transport Type"
              value={transport}
              placeholder="Select Transport"
              options={transportOptions}
              isOpen={openDropdown === "transport"}
              onToggle={() => handleDropdownToggle("transport")}
              onSelect={setTransport}
            />

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 whitespace-nowrap min-w-[160px]"
            >
              <span>Search Here</span>
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}