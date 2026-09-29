"use client";

import { useActionState, useState } from "react";
import { updateTourAction, deleteTourAction } from "@/lib/office/actions";
import type { ActionResult } from "@/lib/office/users";
import type { Tour } from "@/data/tours";

const inputClass = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm";

export function TourForm({ tour, canDelete }: { tour: Tour; canDelete: boolean }) {
  const [days, setDays] = useState(
    tour.itinerary.map((day) => ({
      title: day.title,
      description: day.description,
      highlights: day.highlights.join("\n"),
    })),
  );
  const [state, action, pending] = useActionState(
    async (_prev: ActionResult | null, formData: FormData) => updateTourAction(formData),
    null,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    async (_prev: ActionResult | null, formData: FormData) => deleteTourAction(formData),
    null,
  );

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
        <input type="hidden" name="id" value={tour.id} />
        <input type="hidden" name="itinerary" value={JSON.stringify(itinerary)} />
        <p className="text-sm text-slate-500">Code {tour.code}</p>
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
            <input className={inputClass} name="region" defaultValue={tour.region} />
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
        <label className="block text-sm font-medium">
          Main photo
          <input className={inputClass} name="image" defaultValue={tour.image} />
        </label>
        <label className="block text-sm font-medium">
          Replace photo
          <input className={inputClass} name="photo" type="file" accept="image/*" />
        </label>
        <label className="block text-sm font-medium">
          More photos, one path per line
          <textarea className={inputClass} name="galleryImages" rows={4} defaultValue={tour.galleryImages.join("\n")} />
        </label>
        <label className="block text-sm font-medium">
          PDF
          <input className={inputClass} name="pdf" defaultValue={tour.pdf} />
        </label>
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
                onClick={() => setDays((current) => current.filter((_, itemIndex) => itemIndex !== index))}
              >
                Remove day
              </button>
            </div>
          ))}
        </div>

        {state ? <p className={state.ok ? "text-sm text-green-700" : "text-sm text-red-700"}>{state.ok ? state.message : state.error}</p> : null}
        <button className="rounded-md bg-slate-900 px-4 py-2 text-white" type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save tour"}
        </button>
      </form>

      {canDelete ? (
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
