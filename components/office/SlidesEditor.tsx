"use client";

import { useActionState } from "react";
import { officeFormAction } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";
import type { HomeSlide } from "@/lib/content-types";

const inputClass = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm";

function SlideFields({ slide, sortOrder }: { slide?: HomeSlide; sortOrder: number }) {
  const [state, action, pending] = useActionState(officeFormAction("/api/office/slides"), null as ActionResult | null);
  const [removed, remove, removing] = useActionState(
    officeFormAction("/api/office/slides/delete"),
    null as ActionResult | null,
  );

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <form action={action} className="space-y-3">
        {slide ? <input type="hidden" name="id" value={slide.id} /> : null}
        <label className="block text-sm font-medium">
          Title
          <input className={inputClass} name="title" defaultValue={slide?.title ?? ""} required />
        </label>
        <label className="block text-sm font-medium">
          Photo
          <input className={inputClass} name="image" defaultValue={slide?.image ?? ""} />
        </label>
        <label className="block text-sm font-medium">
          Replace photo
          <input className={inputClass} name="photo" type="file" accept="image/*" />
        </label>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block text-sm font-medium">
            Rotation
            <input className={inputClass} name="rotation" type="number" defaultValue={slide?.rotation ?? 0} />
          </label>
          <label className="block text-sm font-medium">
            Order
            <input className={inputClass} name="sortOrder" type="number" defaultValue={sortOrder} />
          </label>
        </div>
        {state ? <p className={state.ok ? "text-sm text-green-700" : "text-sm text-red-700"}>{state.ok ? state.message : state.error}</p> : null}
        <button className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white" type="submit" disabled={pending}>
          {slide ? "Save slide" : "Add slide"}
        </button>
      </form>
      {slide ? (
        <form action={remove} className="mt-3">
          <input type="hidden" name="id" value={slide.id} />
          {removed && !removed.ok ? <p className="text-sm text-red-700">{removed.error}</p> : null}
          <button className="text-sm text-red-700" type="submit" disabled={removing}>
            Remove slide
          </button>
        </form>
      ) : null}
    </div>
  );
}

export function SlidesEditor({ slides }: { slides: HomeSlide[] }) {
  return (
    <div className="space-y-4">
      {slides.map((slide, index) => (
        <SlideFields key={slide.id} slide={slide} sortOrder={index + 1} />
      ))}
      <h2 className="pt-4 text-lg font-semibold">Add a slide</h2>
      <SlideFields sortOrder={slides.length + 1} />
    </div>
  );
}
