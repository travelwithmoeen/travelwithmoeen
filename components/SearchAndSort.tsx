import { Search, Grid, List, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SearchAndSortProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  onFilterClick: () => void;
  resultCount: number;
}

export default function SearchAndSort({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  view,
  onViewChange,
  onFilterClick,
  resultCount,
}: SearchAndSortProps) {
  return (
    <div className="mb-6 space-y-4">
      {/* Search and Filter Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Mobile Filter Button */}
        <Button
          variant="outline-navy"
          className="lg:hidden"
          onClick={onFilterClick}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>

        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tours by name or location..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sort and View Controls */}
        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="hidden items-center rounded-lg border border-border p-1 sm:flex">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                view === "grid" && "bg-primary text-primary-foreground"
              )}
              onClick={() => onViewChange("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                view === "list" && "bg-primary text-primary-foreground"
              )}
              onClick={() => onViewChange("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-semibold text-foreground">{resultCount}</span>{" "}
        {resultCount === 1 ? "tour" : "tours"}
      </p>
    </div>
  );
}
