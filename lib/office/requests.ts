import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { guestRequests } from "@/lib/db/schema";
import { canDeleteRequest, canUpdateRequestStatus } from "@/lib/auth/permissions";
import type { SessionUser } from "@/lib/auth/session";
import { forbidden, type ActionResult } from "@/lib/http/result";

const REQUEST_STATUSES = ["new", "in_progress", "closed"] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export type GuestRequestRow = {
  id: number;
  kind: "contact" | "custom" | "booking";
  status: RequestStatus;
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
};

function isRequestStatus(value: string): value is RequestStatus {
  return REQUEST_STATUSES.includes(value as RequestStatus);
}

function requestId(value: string) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) return null;
  return id;
}

export async function listRequestsAs(actor: SessionUser) {
  if (actor.role !== "owner" && actor.role !== "manager" && actor.role !== "editor") {
    return forbidden("You cannot read guest requests.");
  }
  const rows = await db.select().from(guestRequests).orderBy(desc(guestRequests.createdAt));
  const requests: GuestRequestRow[] = rows.map((row) => ({
    id: row.id,
    kind: row.kind,
    status: row.status,
    name: row.name,
    phone: row.phone,
    email: row.email,
    message: row.message,
    createdAt: row.createdAt.toISOString(),
  }));
  return { ok: true as const, requests };
}

export async function updateRequestStatusAs(actor: SessionUser, id: number, status: string): Promise<ActionResult> {
  if (!canUpdateRequestStatus(actor.role)) {
    return forbidden("You cannot change a request status.");
  }
  if (!isRequestStatus(status)) {
    return { ok: false, error: "Choose New, In progress, or Closed." };
  }
  const [row] = await db.select({ id: guestRequests.id }).from(guestRequests).where(eq(guestRequests.id, id)).limit(1);
  if (!row) return { ok: false, error: "That request was not found." };
  await db.update(guestRequests).set({ status }).where(eq(guestRequests.id, id));
  return { ok: true, message: "Status saved." };
}

export async function deleteRequestAs(actor: SessionUser, id: number): Promise<ActionResult> {
  if (!canDeleteRequest(actor.role)) {
    return forbidden("Only the Owner can delete a guest request.");
  }
  const [row] = await db.select({ id: guestRequests.id }).from(guestRequests).where(eq(guestRequests.id, id)).limit(1);
  if (!row) return { ok: false, error: "That request was not found." };
  await db.delete(guestRequests).where(eq(guestRequests.id, id));
  return { ok: true, message: "Request deleted." };
}

export async function updateRequestStatusFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const id = requestId(String(formData.get("id") ?? ""));
  if (!id) return { ok: false, error: "That request was not found." };
  return updateRequestStatusAs(actor, id, String(formData.get("status") ?? ""));
}

export async function deleteRequestFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const id = requestId(String(formData.get("id") ?? ""));
  if (!id) return { ok: false, error: "That request was not found." };
  return deleteRequestAs(actor, id);
}
