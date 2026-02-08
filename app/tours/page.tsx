"use client";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TourCard } from "@/components/TourCard";
import  FilterSidebar  from "@/components/FilterSidebar";
import  SearchAndSort  from "@/components/SearchAndSort";
import { tours, Tour, TourCategory, TourRegion, TransportType } from "@/data/tours";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 12;

function ToursContent() {
  const searchParams = useSearchParams();

  // Filter states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedCategories, setSelectedCategories] = useState<TourCategory[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<TourRegion[]>([]);
  const [selectedTransport, setSelectedTransport] = useState<TransportType[]>([]);
  const [selectedDuration, setSelectedDuration] = useState("all");

  // Search and sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [view, setView] = useState<"grid" | "list">("grid");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Apply URL query parameters on mount
  useEffect(() => {
    const region = searchParams.get("region");
    const duration = searchParams.get("duration");
    const category = searchParams.get("category");
    const transport = searchParams.get("transport");

    if (region) {
      setSelectedRegions([region as TourRegion]);
    }
    if (duration) {
      setSelectedDuration(duration);
    }
    if (category) {
      setSelectedCategories([category as TourCategory]);
    }
    if (transport) {
      setSelectedTransport([transport as TransportType]);
    }
  }, [searchParams]);

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
    setPriceRange([0, 1000000]);
    setSelectedCategories([]);
    setSelectedRegions([]);
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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, priceRange, selectedCategories, selectedRegions, selectedPackageTypes, selectedTransport, selectedDuration, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredTours.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTours = filteredTours.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
    

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
      <div className="container mx-auto flex items-start px-4 py-8 gap-0">
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
            <>
              <div
                className={cn(
                  "grid gap-6",
                  view === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 text-gold"
                    : "grid-cols-1"
                )}
              >
                {paginatedTours.map((tour, index) => (
                  <div
                    key={tour.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <TourCard tour={tour} view={view} />
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current
                        const showPage =
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1;

                        const showEllipsis =
                          (page === 2 && currentPage > 3) ||
                          (page === totalPages - 1 && currentPage < totalPages - 2);

                        if (showEllipsis && !showPage) {
                          return (
                            <span key={page} className="px-2 text-muted-foreground">
                              ...
                            </span>
                          );
                        }

                        if (!showPage) return null;

                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={cn(
                              "min-w-[2.5rem]",
                              currentPage === page && "bg-navy text-cream hover:bg-navy-light"
                            )}
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredTours.length)} of {filteredTours.length} tours
                  </p>
                </div>
              )}
            </>
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

export default function Tours() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <section className="bg-secondary px-4 py-12 text-center">
          <h1 className="mb-2 text-3xl font-bold text-secondary-foreground md:text-4xl">
            Explore Our Tours
          </h1>
          <p className="mx-auto max-w-2xl text-secondary-foreground/80">
            Loading tours...
          </p>
        </section>
      </div>
    }>
      <ToursContent />
    </Suspense>
  );
}
