"use client";

import { useActionState } from "react";
import { officeFormAction } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";

type RequestStatus = "new" | "in_progress" | "closed";

const STATUS_LABELS: Record<RequestStatus, string> = {
  new: "New",
  in_progress: "In progress",
  closed: "Closed",
};

export function RequestControls({
  requestId,
  status,
  canUpdateStatus,
  canDelete,
}: {
  requestId: number;
  status: RequestStatus;
  canUpdateStatus: boolean;
  canDelete: boolean;
}) {
  const [statusState, saveStatus, statusPending] = useActionState(
    officeFormAction("/api/office/requests/status", "/office/requests"),
    null as ActionResult | null,
  );
  const [deleteState, deleteRequest, deletePending] = useActionState(
    officeFormAction("/api/office/requests/delete", "/office/requests"),
    null as ActionResult | null,
  );

  if (!canUpdateStatus && !canDelete) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      {canUpdateStatus ? (
        <form action={saveStatus} className="flex items-center gap-2">
          <input type="hidden" name="id" value={requestId} />
          <label className="text-sm text-slate-600" htmlFor={`status-${requestId}`}>
            Status
          </label>
          <select
            className="rounded-md border px-2 py-1 text-sm"
            id={`status-${requestId}`}
            name="status"
            defaultValue={status}
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button className="rounded-md border px-3 py-1 text-sm" type="submit" disabled={statusPending}>
            Save status
          </button>
        </form>
      ) : null}
      {canDelete ? (
        <form action={deleteRequest}>
          <input type="hidden" name="id" value={requestId} />
          <button className="text-sm text-red-700" type="submit" disabled={deletePending}>
            Delete
          </button>
        </form>
      ) : null}
      {statusState && !statusState.ok ? <p className="text-sm text-red-700">{statusState.error}</p> : null}
      {deleteState && !deleteState.ok ? <p className="text-sm text-red-700">{deleteState.error}</p> : null}
    </div>
  );
}
