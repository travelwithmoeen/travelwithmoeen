"use client";

import { useActionState, useState } from "react";
import { officeFormAction, postOfficeForm } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";
import type { Tour } from "@/data/tours";

const inputClass = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm";

export function TourForm({
  tour,
  canDelete,
  places,
  mode,
}: {
  tour: Tour;
  canDelete: boolean;
  places: { slug: string; title: string }[];
  mode: "create" | "edit";
}) {
  const [days, setDays] = useState(
    tour.itinerary.map((day) => ({
      title: day.title,
      description: day.description,
      highlights: day.highlights.join("\n"),
    })),
  );
  const [extras, setExtras] = useState(tour.galleryImages);
  const [pdf, setPdf] = useState(tour.pdf);
  const savePath = mode === "create" ? "/api/office/tours/create" : "/api/office/tours";
  const [state, action, pending] = useActionState(async (previous: ActionResult | null, formData: FormData) => {
    const result = await postOfficeForm(savePath, formData);
    if (result.ok) {
      if (result.href) window.location.assign(result.href);
      else window.location.reload();
    }
    return result;
  }, null as ActionResult | null);
  const [deleteState, deleteAction, deletePending] = useActionState(
    officeFormAction("/api/office/tours/delete", "/office/tours"),
    null as ActionResult | null,
  );

  const selectedPlaces = new Set((tour.places ?? []).map((place) => place.slug));
  const itinerary = days.map((day, index) => ({
    day: index + 1,
    title: day.title,
    description: day.description,
    highlights: day.highlights
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  }));

  return (
    <div className="space-y-8">
      <form action={action} className="space-y-4 rounded-xl bg-white p-6 shadow">
        {mode === "edit" ? <input type="hidden" name="id" value={tour.id} /> : null}
        <input type="hidden" name="itinerary" value={JSON.stringify(itinerary)} />
        <input type="hidden" name="placeSet" value="1" />
        <p className="text-sm text-slate-500">{mode === "edit" ? `Code ${tour.code}` : "A code is assigned when you save."}</p>
        <label className="block text-sm font-medium">
          Title
          <input className={inputClass} name="name" defaultValue={tour.name} required />
        </label>
        <label className="block text-sm font-medium">
          Description
          <textarea className={inputClass} name="description" rows={5} defaultValue={tour.description} />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium">
            Location
            <input className={inputClass} name="location" defaultValue={tour.location} />
          </label>
          <label className="block text-sm font-medium">
            Region
            <input className={inputClass} name="region" defaultValue={tour.region} required />
          </label>
          <label className="block text-sm font-medium">
            Days
            <input className={inputClass} name="duration" type="number" min={1} defaultValue={tour.duration} />
          </label>
          <label className="block text-sm font-medium">
            Road or air
            <select className={inputClass} name="transport" defaultValue={tour.transport}>
              <option>By Road</option>
              <option>By Air</option>
            </select>
          </label>
        </div>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Places</legend>
          <p className="text-sm text-slate-500">
            This tour uses these places. The place page lists this tour, and the tour page lists the places. Saving a tour does not change the place guide.
          </p>
          {places.map((place) => (
            <label key={place.slug} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="placeSlug" value={place.slug} defaultChecked={selectedPlaces.has(place.slug)} />
              {place.title}
            </label>
          ))}
        </fieldset>
        <label className="block text-sm font-medium">
          Main photo
          <input className={inputClass} name="image" defaultValue={tour.image} />
        </label>
        <label className="block text-sm font-medium">
          Replace photo
          <input className={inputClass} name="photo" type="file" accept="image/jpeg,image/png,image/webp" />
        </label>
        <div className="space-y-2">
          <p className="text-sm font-medium">More photos</p>
          <input type="hidden" name="galleryImageSet" value="1" />
          {extras.map((photo, index) => (
            <div key={`${photo}-${index}`} className="flex gap-2">
              <input
                className={inputClass}
                name="galleryImage"
                value={photo}
                onChange={(event) =>
                  setExtras((current) => current.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)))
                }
              />
              <button
                className="text-sm text-red-700"
                type="button"
                onClick={() => setExtras((current) => current.filter((item, itemIndex) => itemIndex !== index))}
              >
                Remove photo
              </button>
            </div>
          ))}
          <label className="block text-sm font-medium">
            Add a photo
            <input className={inputClass} name="extraPhoto" type="file" accept="image/jpeg,image/png,image/webp" />
          </label>
          <button
            className="text-sm underline"
            type="button"
            onClick={() => setExtras((current) => [...current, ""])}
          >
            Add a path
          </button>
        </div>
        <label className="block text-sm font-medium">
          PDF
          <input className={inputClass} name="pdf" value={pdf} onChange={(event) => setPdf(event.target.value)} />
        </label>
        <label className="block text-sm font-medium">
          Upload PDF
          <input className={inputClass} name="pdfFile" type="file" accept="application/pdf" />
        </label>
        <button className="text-sm text-red-700" type="button" onClick={() => setPdf("")}>
          Remove PDF
        </button>
        <label className="block text-sm font-medium">
          Categories, one per line
          <textarea className={inputClass} name="categories" rows={3} defaultValue={tour.categories.join("\n")} />
        </label>
        <label className="block text-sm font-medium">
          Package types, one per line
          <textarea className={inputClass} name="packageTypes" rows={3} defaultValue={tour.packageTypes.join("\n")} />
        </label>
        <label className="block text-sm font-medium">
          Included, one per line
          <textarea className={inputClass} name="included" rows={4} defaultValue={tour.included.join("\n")} />
        </label>
        <label className="block text-sm font-medium">
          Not included, one per line
          <textarea className={inputClass} name="notIncluded" rows={4} defaultValue={tour.notIncluded.join("\n")} />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input name="featured" type="checkbox" defaultChecked={tour.featured} />
          Featured on the home page
        </label>

        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Day plan</h2>
            <button
              className="text-sm text-slate-700 underline"
              type="button"
              onClick={() => setDays((current) => [...current, { title: "", description: "", highlights: "" }])}
            >
              Add day
            </button>
          </div>
          {days.map((day, index) => (
            <div key={index} className="rounded-md border border-slate-200 p-4">
              <p className="text-sm font-medium">Day {index + 1}</p>
              <input
                className={inputClass}
                value={day.title}
                onChange={(event) =>
                  setDays((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, title: event.target.value } : item)))
                }
              />
              <textarea
                className={inputClass}
                rows={2}
                value={day.description}
                onChange={(event) =>
                  setDays((current) =>
                    current.map((item, itemIndex) => (itemIndex === index ? { ...item, description: event.target.value } : item)),
                  )
                }
              />
              <textarea
                className={inputClass}
                rows={4}
                value={day.highlights}
                onChange={(event) =>
                  setDays((current) =>
                    current.map((item, itemIndex) => (itemIndex === index ? { ...item, highlights: event.target.value } : item)),
                  )
                }
              />
              <button
                className="mt-2 text-sm text-red-700"
                type="button"
                onClick={() => setDays((current) => current.filter((item, itemIndex) => itemIndex !== index))}
              >
                Remove day
              </button>
            </div>
          ))}
        </div>

        {state ? <p className={state.ok ? "text-sm text-green-700" : "text-sm text-red-700"}>{state.ok ? state.message : state.error}</p> : null}
        <button className="rounded-md bg-slate-900 px-4 py-2 text-white" type="submit" disabled={pending}>
          {pending ? "Saving..." : mode === "create" ? "Add tour" : "Save tour"}
        </button>
      </form>

      {mode === "edit" && canDelete ? (
        <form action={deleteAction} className="rounded-xl bg-white p-6 shadow">
          <input type="hidden" name="id" value={tour.id} />
          {deleteState && !deleteState.ok ? <p className="mb-3 text-sm text-red-700">{deleteState.error}</p> : null}
          <button className="rounded-md border border-red-300 px-4 py-2 text-red-700" type="submit" disabled={deletePending}>
            Delete tour
          </button>
        </form>
      ) : null}
    </div>
  );
}
