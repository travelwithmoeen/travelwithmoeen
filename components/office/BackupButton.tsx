"use client";

import { useActionState } from "react";
import { officeFormAction } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";

export function BackupButton() {
  const [state, action, pending] = useActionState(
    officeFormAction("/api/office/backup", "/office/backup"),
    null as ActionResult | null,
  );

  return (
    <form action={action} className="flex flex-wrap items-center gap-3">
      <button
        className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-60"
        type="submit"
        disabled={pending}
      >
        {pending ? "Backing up..." : "Back up now"}
      </button>
      {state && !state.ok ? <p className="text-sm text-red-700">{state.error}</p> : null}
    </form>
  );
}
