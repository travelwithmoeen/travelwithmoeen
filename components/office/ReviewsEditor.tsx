"use client";

import { useActionState } from "react";
import { officeFormAction } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";
import type { Testimonial } from "@/data/testimonials";

const inputClass = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm";

function ReviewFields({ review }: { review?: Testimonial }) {
  const [state, action, pending] = useActionState(officeFormAction("/api/office/reviews"), null as ActionResult | null);
  const [removed, remove, removing] = useActionState(
    officeFormAction("/api/office/reviews/delete"),
    null as ActionResult | null,
  );

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <form action={action} className="space-y-3">
        {review ? <input type="hidden" name="id" value={review.id} /> : null}
        <label className="block text-sm font-medium">
          Name
          <input className={inputClass} name="name" defaultValue={review?.name ?? ""} required />
        </label>
        <label className="block text-sm font-medium">
          Place
          <input className={inputClass} name="location" defaultValue={review?.location ?? ""} />
        </label>
        <label className="block text-sm font-medium">
          Photo
          <input className={inputClass} name="avatar" defaultValue={review?.avatar ?? ""} />
        </label>
        <label className="block text-sm font-medium">
          Review
          <textarea className={inputClass} name="text" rows={4} defaultValue={review?.text ?? ""} required />
        </label>
        <label className="block text-sm font-medium">
          Rating
          <input className={inputClass} name="rating" type="number" min={1} max={5} defaultValue={review?.rating ?? 5} />
        </label>
        {state ? <p className={state.ok ? "text-sm text-green-700" : "text-sm text-red-700"}>{state.ok ? state.message : state.error}</p> : null}
        <button className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white" type="submit" disabled={pending}>
          {review ? "Save review" : "Add review"}
        </button>
      </form>
      {review ? (
        <form action={remove} className="mt-3">
          <input type="hidden" name="id" value={review.id} />
          {removed && !removed.ok ? <p className="text-sm text-red-700">{removed.error}</p> : null}
          <button className="text-sm text-red-700" type="submit" disabled={removing}>
            Remove review
          </button>
        </form>
      ) : null}
    </div>
  );
}

export function ReviewsEditor({ reviews }: { reviews: Testimonial[] }) {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewFields key={review.id} review={review} />
      ))}
      <h2 className="pt-4 text-lg font-semibold">Add a review</h2>
      <ReviewFields />
    </div>
  );
}
