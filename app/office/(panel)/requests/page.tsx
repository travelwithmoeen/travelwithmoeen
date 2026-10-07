import { redirect } from "next/navigation";
import { RequestControls } from "@/components/office/RequestControls";
import { getOfficeRequests, getOfficeSession } from "@/lib/http/office-session";

const KIND_LABELS = {
  contact: "Contact",
  custom: "Custom trip",
  booking: "Booking",
} as const;

const STATUS_LABELS = {
  new: "New",
  in_progress: "In progress",
  closed: "Closed",
} as const;

function savedOn(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
}

export default async function RequestsPage() {
  const actor = await getOfficeSession();
  if (!actor) redirect("/office/login");
  const rows = await getOfficeRequests();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Requests</h1>
      {rows.length === 0 ? <p className="text-slate-600">No requests yet.</p> : null}
      <div className="space-y-3">
        {rows.map((row) => (
          <article key={row.id} className="rounded-xl bg-white p-4 shadow">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-medium">{row.name || "Guest"}</p>
              <p className="text-sm text-slate-500">{savedOn(row.createdAt)}</p>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {KIND_LABELS[row.kind]} · {STATUS_LABELS[row.status]}
            </p>
            {row.phone ? <p className="mt-2 text-sm">{row.phone}</p> : null}
            {row.email ? <p className="text-sm">{row.email}</p> : null}
            <p className="mt-3 whitespace-pre-wrap text-sm text-slate-800">{row.message}</p>
            <RequestControls
              requestId={row.id}
              status={row.status}
              canUpdateStatus={actor.canUpdateRequestStatus}
              canDelete={actor.canDeleteRequest}
            />
          </article>
        ))}
      </div>
    </div>
  );
}
