"use client";

import React, { useState } from "react";
import { MapPin, Activity, Calendar as CalendarIcon, Award, Plane, ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FilterOption {
  value: string;
  label: string;
}

const destinationOptions: FilterOption[] = [
  { value: "hunza", label: "Hunza Valley" },
  { value: "skardu", label: "Skardu" },
  { value: "naran", label: "Naran Kaghan" },
  { value: "swat", label: "Swat Valley" },
  { value: "murree", label: "Murree" },
  { value: "neelum", label: "Neelum Valley" },
];

const activityOptions: FilterOption[] = [
  { value: "all", label: "All Tours" },
  { value: "adventure", label: "Adventure" },
  { value: "cultural", label: "Cultural" },
  { value: "hiking", label: "Hiking & Trekking" },
  { value: "family", label: "Family Tours" },
  { value: "luxury", label: "Luxury" },
];

const durationOptions: FilterOption[] = [
  { value: "1-day", label: "1 day" },
  { value: "1-3-days", label: "1-3 days" },
  { value: "4-7-days", label: "4-7 days" },
  { value: "8-plus-days", label: "8+ days" },
];

const planCategoryOptions: FilterOption[] = [
  { value: "deluxe", label: "Deluxe" },
  { value: "executive", label: "Executive" },
  { value: "luxury", label: "Luxury" },
];

const transportOptions: FilterOption[] = [
  { value: "air", label: "By Air" },
  { value: "road", label: "By Road" },
];

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
  const [destination, setDestination] = useState("");
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("");
  const [planCategory, setPlanCategory] = useState("");
  const [transport, setTransport] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (fieldId: string) => {
    setOpenDropdown(openDropdown === fieldId ? null : fieldId);
  };

  const handleSearch = () => {
    console.log("Search filters:", { destination, activity, duration, planCategory, transport });
    // Add search logic here
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
              placeholder="Your city Region"
              options={destinationOptions}
              isOpen={openDropdown === "destination"}
              onToggle={() => handleDropdownToggle("destination")}
              onSelect={setDestination}
            />

            {/* Divider */}
            <div className="hidden lg:block w-px h-12 bg-slate-200" />

            {/* Activity/Tour Type Field */}
            <FilterField
              icon={<Activity size={20} />}
              label="All Tour"
              value={activity}
              placeholder="Choose Activity"
              options={activityOptions}
              isOpen={openDropdown === "activity"}
              onToggle={() => handleDropdownToggle("activity")}
              onSelect={setActivity}
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