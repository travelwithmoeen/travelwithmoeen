import { ArrowUpRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-mountain.jpg"
          alt="Mountain adventure"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-32 pb-40 px-4">
        {/* Tagline */}
        <p className=" text-navy  font-serif italic text-lg md:text-xl mb-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Explore the world as much possible
        </p>

        {/* Main Heading */}
        <h1 className="text-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <span className="block text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-primary tracking-wide">
            QUALITY
          </span>
          <span className="inline-block mt-2 px-6 py-2 border-4 border-primary text-primary text-3xl md:text-5xl lg:text-6xl font-serif font-bold tracking-widest bg-card/80 backdrop-blur-sm">
            TOURISM PROMOTER
          </span>
        </h1>

        {/* CTA Button */}
        <div className="mt-10 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <Button className="bg-orange-400 hover:bg-orange-500 text-accent-foreground font-semibold text-lg px-10 py-7 rounded-full gap-2 transition-all hover:scale-105 shadow-travel">
            See All Destination
            <ArrowUpRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative z-20 -mt-20 mb-8">
        {/* <SearchBar /> */}
        <FilterBar />
      </div>
    </section>
  );
};

export default HeroSection;