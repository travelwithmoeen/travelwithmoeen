"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const navLinks = [
  { 
    name: "Home", 
    href: "/",
    hasDropdown: true 
  },
  { 
    name: "Pages", 
    href: "#",
    hasDropdown: true 
  },
  { 
    name: "Tour", 
    href: "/tours",
    hasDropdown: true 
  },
  { 
    name: "Destination", 
    href: "#",
    hasDropdown: true 
  },
  { 
    name: "Blog", 
    href: "/blog",
    hasDropdown: true 
  },
  { 
    name: "Contact", 
    href: "/contact",
    hasDropdown: false 
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
        scrolled
          ? "bg-white shadow-lg py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center relative h-12 w-32 md:h-14 md:w-40">
          <Image
            src="/images/TWM Logo.webp"
            alt="TWM Travel"
            fill
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-[15px] font-medium transition-all duration-300 hover:text-blue-600 flex items-center gap-1 group relative",
                pathname === link.href
                  ? "text-blue-600"
                  : scrolled 
                    ? "text-slate-800" 
                    : "text-slate-700"
              )}
            >
              {link.name}
              {link.hasDropdown && (
                <ChevronDown 
                  size={16} 
                  className="transition-transform group-hover:rotate-180 duration-300"
                />
              )}
              {/* Active indicator */}
              {pathname === link.href && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <button 
            className={cn(
              "p-2.5 rounded-full hover:bg-slate-100 transition-all duration-300",
              scrolled ? "text-slate-800" : "text-slate-700"
            )}
            aria-label="Search"
          >
            <Search size={22} />
          </button>
          
          <Link
            href="/tours"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full text-[15px] font-semibold hover:shadow-xl hover:shadow-blue-200 transition-all duration-300 flex items-center gap-2 group"
          >
            EXPLORE MORE
            <ArrowRight 
              size={18} 
              className="transition-transform group-hover:translate-x-1 duration-300"
            />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className={cn(
            "lg:hidden transition-colors duration-300",
            scrolled ? "text-slate-800" : "text-slate-700"
          )}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-200 shadow-xl overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-base font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-between",
                    pathname === link.href 
                      ? "text-blue-600 bg-blue-50" 
                      : "text-slate-800 hover:bg-slate-50"
                  )}
                >
                  {link.name}
                  {link.hasDropdown && <ChevronDown size={16} />}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <button 
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 text-slate-800 rounded-lg font-medium hover:bg-slate-200 transition-all"
                >
                  <Search size={20} />
                  Search
                </button>
                
                <Link
                  href="/tours"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  EXPLORE MORE
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
