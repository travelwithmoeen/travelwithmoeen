import { DestinationSection } from "@/data/destinations";

interface DestinationContentProps {
  sections: DestinationSection[];
}

export function DestinationContent({ sections }: DestinationContentProps) {
  return (
    <div className="space-y-8">
      {sections.map((section, index) => (
        <div key={index} className="space-y-4">
          {section.heading && (
            <h2 className="text-xl font-bold text-navy md:text-2xl">
              {section.heading}
            </h2>
          )}
          <p className="leading-relaxed text-foreground/90">{section.body}</p>
          {section.image && (
            <div className="flex justify-center py-4">
              <img
                src={section.image}
                alt={section.heading || "Destination image"}
                className="max-w-full rounded-lg shadow-card md:max-w-2xl"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
