import { MapPin, Compass, Calendar, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const SearchBar = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="bg-card rounded-2xl shadow-travel-strong p-4 lg:p-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-0 lg:divide-x divide-border">
          {/* Destination */}
          <div className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-muted/50 rounded-lg lg:rounded-none transition-colors">
            <MapPin className="h-5 w-5 text-secondary flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium">Destination</p>
              <p className="text-sm font-semibold text-foreground">Your city Region</p>
            </div>
          </div>

          {/* All Tour */}
          <div className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-muted/50 rounded-lg lg:rounded-none transition-colors">
            <Compass className="h-5 w-5 text-secondary flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium">All Tour</p>
              <p className="text-sm font-semibold text-foreground">Choose Activity</p>
            </div>
          </div>

          {/* Departure Date */}
          <div className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-muted/50 rounded-lg lg:rounded-none transition-colors">
            <Calendar className="h-5 w-5 text-secondary flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium">Departure Date</p>
              <p className="text-sm font-semibold text-foreground">mm/dd/yyyy</p>
            </div>
          </div>

          {/* Guest */}
          <div className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-muted/50 rounded-lg lg:rounded-none transition-colors">
            <Users className="h-5 w-5 text-secondary flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium">Guest</p>
              <p className="text-sm font-semibold text-foreground">Your Guest</p>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-center justify-center px-4">
            <Button className="w-full lg:w-auto bg-gradient-gold hover:opacity-90 text-accent-foreground font-semibold px-8 py-6 rounded-xl gap-2 transition-all hover:scale-105">
              Search Here
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;