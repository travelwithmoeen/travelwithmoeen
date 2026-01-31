"use client";
import { useState, useMemo } from "react";
import { TourCard } from "@/components/TourCard";
import  FilterSidebar  from "@/components/FilterSidebar";
import  SearchAndSort  from "@/components/SearchAndSort";
import { tours, Tour, TourCategory, TourRegion, PackageType, TransportType } from "@/data/tours";
import { cn } from "@/lib/utils";

export default function Tours() {
  // Filter states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 6000]);
  const [selectedCategories, setSelectedCategories] = useState<TourCategory[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<TourRegion[]>([]);
  const [selectedPackageTypes, setSelectedPackageTypes] = useState<PackageType[]>([]);
  const [selectedTransport, setSelectedTransport] = useState<TransportType[]>([]);
  const [selectedDuration, setSelectedDuration] = useState("all");

  // Search and sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [view, setView] = useState<"grid" | "list">("grid");

  // Handle category toggle
  const handleCategoryChange = (category: TourCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Handle region toggle
  const handleRegionChange = (region: TourRegion) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
  };

  // Handle package type toggle
  const handlePackageTypeChange = (packageType: PackageType) => {
    setSelectedPackageTypes((prev) =>
      prev.includes(packageType)
        ? prev.filter((p) => p !== packageType)
        : [...prev, packageType]
    );
  };

  // Handle transport toggle
  const handleTransportChange = (transport: TransportType) => {
    setSelectedTransport((prev) =>
      prev.includes(transport)
        ? prev.filter((t) => t !== transport)
        : [...prev, transport]
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setPriceRange([0, 6000]);
    setSelectedCategories([]);
    setSelectedRegions([]);
    setSelectedPackageTypes([]);
    setSelectedTransport([]);
    setSelectedDuration("all");
    setSearchQuery("");
  };

  // Filter and sort tours
  const filteredTours = useMemo(() => {
    let result = [...tours];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (tour) =>
          tour.name.toLowerCase().includes(query) ||
          tour.location.toLowerCase().includes(query)
      );
    }

    // Price filter
    result = result.filter(
      (tour) => tour.basePrice >= priceRange[0] && tour.basePrice <= priceRange[1]
    );

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((tour) =>
        tour.categories.some((cat) => selectedCategories.includes(cat))
      );
    }

    // Region filter
    if (selectedRegions.length > 0) {
      result = result.filter((tour) => selectedRegions.includes(tour.region));
    }

    // Package type filter
    if (selectedPackageTypes.length > 0) {
      result = result.filter((tour) =>
        tour.packageTypes.some((pkg) => selectedPackageTypes.includes(pkg))
      );
    }

    // Transport filter
    if (selectedTransport.length > 0) {
      result = result.filter((tour) => selectedTransport.includes(tour.transport));
    }

    // Duration filter
    if (selectedDuration !== "all") {
      const [min, max] = selectedDuration.split("-").map(Number);
      result = result.filter(
        (tour) => tour.duration >= min && tour.duration <= max
      );
    }

    // Sorting
    switch (sortBy) {
      case "oldest":
        result.reverse();
        break;
      case "price-low":
        result.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price-high":
        result.sort((a, b) => b.basePrice - a.basePrice);
        break;
      default: // latest
        break;
    }

    return result;
  }, [searchQuery, priceRange, selectedCategories, selectedRegions, selectedPackageTypes, selectedTransport, selectedDuration, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}

      {/* Hero Section */}
      <section className="bg-secondary px-4 py-12 text-center">
        <h1 className="mb-2 text-3xl font-bold text-secondary-foreground md:text-4xl">
          Explore Our Tours
        </h1>
        <p className="mx-auto max-w-2xl text-secondary-foreground/80">
          Discover extraordinary destinations with our curated collection of premium tours
        </p>
      </section>

      {/* Main Content */}
      <div className="container mx-auto flex px-4 py-8">
        {/* Filter Sidebar */}
        <FilterSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          selectedRegions={selectedRegions}
          onRegionChange={handleRegionChange}
          selectedPackageTypes={selectedPackageTypes}
          onPackageTypeChange={handlePackageTypeChange}
          selectedTransport={selectedTransport}
          onTransportChange={handleTransportChange}
          selectedDuration={selectedDuration}
          onDurationChange={setSelectedDuration}
          onClearFilters={handleClearFilters}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-8">
          {/* Search and Sort */}
          <SearchAndSort
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            view={view}
            onViewChange={setView}
            onFilterClick={() => setSidebarOpen(true)}
            resultCount={filteredTours.length}
          />

          {/* Tour Grid/List */}
          {filteredTours.length > 0 ? (
            <div
              className={cn(
                "grid gap-6",
                view === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              )}
            >
              {filteredTours.map((tour, index) => (
                <div
                  key={tour.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <TourCard tour={tour} view={view} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-lg font-medium text-muted-foreground">
                No tours found matching your criteria.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-4 text-primary underline hover:no-underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
