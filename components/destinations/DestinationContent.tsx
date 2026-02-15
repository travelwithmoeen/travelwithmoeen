"use client";

import { DestinationSection } from "@/data/destinations";

interface DestinationContentProps {
  sections: DestinationSection[];
}

export function DestinationContent({ sections }: DestinationContentProps) {
  return (
    <div className="space-y-8">
      {sections.map((section, index) => (
        <div
          key={index}
          className="rounded-lg border border-border bg-card overflow-hidden p-6"
        >
          <h2 className="text-lg font-bold text-navy md:text-xl mb-4">
            {section.heading || `Section ${index + 1}`}
          </h2>

          <div className="space-y-4">
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
      ))}
    </div>
  );
}
