"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DestinationSection } from "@/data/destinations";

interface DestinationContentProps {
  sections: DestinationSection[];
}

export function DestinationContent({ sections }: DestinationContentProps) {
  const [openSections, setOpenSections] = useState<number[]>([]);

  const toggleSection = (index: number) => {
    setOpenSections((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const toggleAll = () => {
    if (openSections.length === sections.length) {
      setOpenSections([]);
    } else {
      setOpenSections(sections.map((_, index) => index));
    }
  };

  const allOpen = openSections.length === sections.length;

  return (
    <div className="space-y-4">
      {sections.map((section, index) => {
        const isOpen = openSections.includes(index);
        return (
          <div
            key={index}
            className="rounded-lg border border-border bg-card overflow-hidden"
          >
            <button
              onClick={() => toggleSection(index)}
              className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
            >
              <h2 className="text-lg font-bold text-navy md:text-xl">
                {section.heading || `Section ${index + 1}`}
              </h2>
              <ChevronDown
                className={`h-5 w-5 text-primary transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="space-y-4 p-4 pt-0">
                  <p className="leading-relaxed text-foreground/90">
                    {section.body}
                  </p>
                  {section.image && (
                    <div className="flex justify-center py-4">
                      <img
                        src={section.image}
                        alt={section.heading || "Destination image"}
                        className="max-w-full rounded-lg shadow-card md:max-w-2xl"
                      />
                    </div>
                  )}
                  {section.highlight && section.highlight.length > 0 && (
                    <ul className="list-disc list-inside space-y-2 pl-4 text-foreground/90 marker:text-primary">
                      {section.highlight.map((item, idx) => (
                        <li key={idx} className="pl-2">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex justify-center py-8">
        <p> test </p>
        <button
          onClick={toggleAll}
          className="rounded-full bg-navy px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:bg-primary hover:shadow-xl border-2 border-navy hover:border-primary"
        >
          {allOpen ? "Collapse All Sections" : "Expand All Sections"}
        </button>
      </div>
    </div>
  );
}
