"use client";

import { useActionState, useState } from "react";
import { officeFormAction } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";
import type { Destination, DestinationSection } from "@/data/destinations";

const inputClass = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm";

type DraftSection = {
  heading: string;
  body: string;
  image: string;
  highlights: string;
};

function toDraft(section: DestinationSection): DraftSection {
  return {
    heading: section.heading ?? "",
    body: section.body,
    image: section.image ?? "",
    highlights: (section.highlight ?? []).join("\n"),
  };
}

export function PlaceForm({ place }: { place: Destination }) {
  const [sections, setSections] = useState(place.content.map(toDraft));
  const [state, action, pending] = useActionState(officeFormAction("/api/office/places"), null as ActionResult | null);
  const content = sections.map((section) => ({
    heading: section.heading,
    body: section.body,
    image: section.image,
    highlight: section.highlights
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  }));

  return (
    <form action={action} className="space-y-4 rounded-xl bg-white p-6 shadow">
      <input type="hidden" name="slug" value={place.slug} />
      <input type="hidden" name="content" value={JSON.stringify(content)} />
      <label className="block text-sm font-medium">
        Title
        <input className={inputClass} name="title" defaultValue={place.title} required />
      </label>
      <label className="block text-sm font-medium">
        Short text
        <textarea className={inputClass} name="excerpt" rows={4} defaultValue={place.excerpt} />
      </label>
      <label className="block text-sm font-medium">
        Location
        <input className={inputClass} name="location" defaultValue={place.location ?? ""} />
      </label>
      <label className="block text-sm font-medium">
        Banner photo
        <input className={inputClass} name="bannerImage" defaultValue={place.bannerImage} />
      </label>
      {sections.map((section, index) => (
        <div key={index} className="space-y-2 rounded-md border p-4">
          <p className="text-sm font-medium">Section {index + 1}</p>
          <input
            className={inputClass}
            value={section.heading}
            placeholder="Heading"
            onChange={(event) =>
              setSections((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, heading: event.target.value } : item)))
            }
          />
          <textarea
            className={inputClass}
            rows={4}
            value={section.body}
            placeholder="Text"
            onChange={(event) =>
              setSections((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, body: event.target.value } : item)))
            }
          />
          <input
            className={inputClass}
            value={section.image}
            placeholder="Photo path"
            onChange={(event) =>
              setSections((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, image: event.target.value } : item)))
            }
          />
          <textarea
            className={inputClass}
            rows={3}
            value={section.highlights}
            placeholder="Highlights, one per line"
            onChange={(event) =>
              setSections((current) =>
                current.map((item, itemIndex) => (itemIndex === index ? { ...item, highlights: event.target.value } : item)),
              )
            }
          />
        </div>
      ))}
      <button
        className="text-sm underline"
        type="button"
        onClick={() => setSections((current) => [...current, { heading: "", body: "", image: "", highlights: "" }])}
      >
        Add section
      </button>
      {state ? <p className={state.ok ? "text-sm text-green-700" : "text-sm text-red-700"}>{state.ok ? state.message : state.error}</p> : null}
      <button className="block rounded-md bg-slate-900 px-4 py-2 text-white" type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save place"}
      </button>
    </form>
  );
}
