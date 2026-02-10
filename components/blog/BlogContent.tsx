import { BlogSection } from "@/data/blog";

interface BlogContentProps {
  sections: BlogSection[];
}

export function BlogContent({ sections }: BlogContentProps) {
  return (
    <div className="space-y-8">
      {sections.map((section, index) => (
        <div key={index} className="space-y-4">
          {section.heading && (
            <h2 className="text-xl font-bold text-[#1a1a1a] md:text-2xl">
              {section.heading}
            </h2>
          )}
          <p className="leading-relaxed text-navy">{section.body}</p>
          {section.image && (
            <div className="flex justify-center py-4">
              <img
                src={section.image}
                alt={section.heading || "Blog image"}
                className="max-w-full rounded-lg shadow-card md:max-w-2xl"
              />
            </div>
          )}
          {section.highlight && section.highlight.length > 0 && (
            <ul className="mt-4 space-y-2 rounded-lg bg-gray-50 p-4">
              {section.highlight.map((item, idx) => (
                <li key={idx} className="text-sm leading-relaxed text-navy">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
