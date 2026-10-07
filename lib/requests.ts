import { db } from "@/lib/db";
import { guestRequests } from "@/lib/db/schema";

export const GUEST_NAME_LIMIT = 200;
export const GUEST_PHONE_LIMIT = 40;
export const GUEST_EMAIL_LIMIT = 200;
export const GUEST_MESSAGE_LIMIT = 4000;

export type GuestRequestInput = {
  kind: string;
  name: string;
  phone: string;
  email: string;
  message: string;
};

export type SavedGuestRequest = { ok: true; id: number } | { ok: false; error: string };

function withinLimit(value: string, limit: number, label: string): SavedGuestRequest | null {
  if (value.length > limit) {
    return { ok: false, error: `${label} is at most ${limit.toLocaleString("en-US")} characters.` };
  }
  return null;
}

export async function saveGuestRequest(input: GuestRequestInput): Promise<SavedGuestRequest> {
  const kind = input.kind.trim();
  if (kind !== "contact" && kind !== "custom" && kind !== "booking") {
    return { ok: false, error: "Choose contact, a custom trip, or a booking." };
  }
  const name = input.name.trim();
  const phone = input.phone.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  if ((kind === "contact" || kind === "custom") && name.length === 0) {
    return { ok: false, error: "Enter a name." };
  }
  if (kind === "contact" && email.length === 0) {
    return { ok: false, error: "Enter an email." };
  }
  if (message.length === 0) {
    return { ok: false, error: "Enter a message." };
  }
  const nameLimit = withinLimit(name, GUEST_NAME_LIMIT, "A name");
  if (nameLimit) return nameLimit;
  const phoneLimit = withinLimit(phone, GUEST_PHONE_LIMIT, "A phone number");
  if (phoneLimit) return phoneLimit;
  const emailLimit = withinLimit(email, GUEST_EMAIL_LIMIT, "An email");
  if (emailLimit) return emailLimit;
  const messageLimit = withinLimit(message, GUEST_MESSAGE_LIMIT, "A message");
  if (messageLimit) return messageLimit;

  const [row] = await db
    .insert(guestRequests)
    .values({ kind, name, phone, email, message })
    .returning({ id: guestRequests.id });
  if (!row) return { ok: false, error: "The request could not be saved." };
  return { ok: true, id: row.id };
}
