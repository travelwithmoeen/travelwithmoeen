"use client";

import { useActionState } from "react";
import { officeFormAction } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";

export function TourDeleteButton({ tourId }: { tourId: string }) {
  const [state, action, pending] = useActionState(
    officeFormAction("/api/office/tours/delete", "/office/tours"),
    null as ActionResult | null,
  );

  return (
    <form action={action}>
      <input type="hidden" name="id" value={tourId} />
      {state && !state.ok ? <p className="mb-1 text-sm text-red-700">{state.error}</p> : null}
      <button className="text-sm text-red-700" type="submit" disabled={pending}>
        {pending ? "Deleting..." : "Delete tour"}
      </button>
    </form>
  );
}
