import { readFileSync } from "fs";
import { spawn } from "child_process";
import { eq } from "drizzle-orm";
import { db, sql } from "../lib/db";
import { guestRequests, tours } from "../lib/db/schema";
import { GUEST_EMAIL_LIMIT, GUEST_MESSAGE_LIMIT, GUEST_NAME_LIMIT, GUEST_PHONE_LIMIT } from "../lib/requests";

const WHATSAPP = "https://wa.me/923339981177";
const PLACEHOLDER_PHONE = "tel:+1234567890";

function siteBase() {
  const configured = process.env.API_BASE_URL?.trim().replace(/\/$/, "");
  return configured || "http://localhost:3000";
}

function runStep2() {
  return new Promise<void>((resolve, reject) => {
    const child = spawn("npm", ["run", "check:step2"], {
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error("The Step 2 checks failed."));
    });
  });
}

async function postRequest(body: Record<string, string>) {
  let response: Response;
  try {
    response = await fetch(`${siteBase()}/api/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(`The site is not running at ${siteBase()}. Start it with npm run dev.`);
  }
  const text = await response.text();
  let parsed: { ok?: boolean; error?: string; id?: number; phone?: string; message?: string; name?: string; email?: string } = {};
  try {
    parsed = JSON.parse(text) as typeof parsed;
  } catch {
    parsed = {};
  }
  return { status: response.status, body: parsed, text };
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function bookNowHref(html: string) {
  const match = html.match(/<a\b[^>]*href="(https:\/\/wa\.me\/923339981177[^"]*)"[^>]*>Book Now<\/a>/);
  return match ? decodeHtml(match[1]) : "";
}

function assertBookNowOpensOnClick() {
  const source = readFileSync(new URL("../components/tours/TourDetail.tsx", import.meta.url), "utf8");
  if (!source.includes(WHATSAPP) || source.includes("preventDefault") || source.includes("window.open")) {
    throw new Error("Book Now must open the WhatsApp link on the click.");
  }
}

async function main() {
  await runStep2();
  const marker = `step3-part1-${Date.now()}`;
  const phone = "03009990001";
  const savedIds: number[] = [];
  try {
    const contactMessage = `Subject: A question\n\n<b>${marker} contact</b>`;
    const contact = await postRequest({
      kind: "contact",
      name: "Step Three Guest",
      email: "step3-guest@travelwithmoeen.test",
      phone,
      message: contactMessage,
    });
    if (contact.status !== 200 || !contact.body.ok || !contact.body.id) {
      throw new Error("A contact was not saved.");
    }
    if (contact.text.includes(phone) || contact.body.phone || contact.body.message || contact.body.email) {
      throw new Error("The save response included the guest details.");
    }
    savedIds.push(contact.body.id);
    const [row] = await db.select().from(guestRequests).where(eq(guestRequests.id, contact.body.id));
    if (
      !row ||
      row.kind !== "contact" ||
      row.status !== "new" ||
      row.name !== "Step Three Guest" ||
      row.phone !== phone ||
      row.email !== "step3-guest@travelwithmoeen.test" ||
      row.message !== contactMessage
    ) {
      throw new Error("The saved contact could not be read back.");
    }

    const tooLong = await postRequest({
      kind: "contact",
      name: "Step Three Guest",
      email: "step3-guest@travelwithmoeen.test",
      message: "m".repeat(GUEST_MESSAGE_LIMIT + 1),
    });
    if (tooLong.status !== 400 || tooLong.body.ok) {
      throw new Error("A message over 4,000 characters was accepted.");
    }
    const longName = await postRequest({
      kind: "contact",
      name: "n".repeat(GUEST_NAME_LIMIT + 1),
      email: "step3-guest@travelwithmoeen.test",
      message: marker,
    });
    if (longName.status !== 400) throw new Error("A name over 200 characters was accepted.");
    const longPhone = await postRequest({
      kind: "booking",
      phone: "1".repeat(GUEST_PHONE_LIMIT + 1),
      message: marker,
    });
    if (longPhone.status !== 400) throw new Error("A phone number over 40 characters was accepted.");
    const longEmail = await postRequest({
      kind: "custom",
      name: "Step Three Guest",
      email: `${"e".repeat(GUEST_EMAIL_LIMIT)}@x.test`,
      message: marker,
    });
    if (longEmail.status !== 400) throw new Error("An email over 200 characters was accepted.");

    const custom = await postRequest({
      kind: "custom",
      name: "Step Three Guest",
      phone: "+92 3001112233",
      email: "",
      message: `${marker} custom trip`,
    });
    if (custom.status !== 200 || !custom.body.id) throw new Error("A custom trip was not saved.");
    savedIds.push(custom.body.id);
    const [customRow] = await db.select().from(guestRequests).where(eq(guestRequests.id, custom.body.id));
    if (!customRow || customRow.kind !== "custom" || customRow.status !== "new" || customRow.message !== `${marker} custom trip`) {
      throw new Error("The saved custom trip could not be read back.");
    }

    const booking = await postRequest({
      kind: "booking",
      message: `${marker} booking`,
    });
    if (booking.status !== 200 || !booking.body.id) throw new Error("A booking was not saved.");
    savedIds.push(booking.body.id);
    const [bookingRow] = await db.select().from(guestRequests).where(eq(guestRequests.id, booking.body.id));
    if (!bookingRow || bookingRow.kind !== "booking" || bookingRow.status !== "new" || bookingRow.message !== `${marker} booking`) {
      throw new Error("The saved booking could not be read back.");
    }

    assertBookNowOpensOnClick();
    const tourRows = await db.select({ id: tours.id, name: tours.name }).from(tours);
    let bookNow = "";
    let tourName = "";
    for (const tour of tourRows) {
      const page = await fetch(`${siteBase()}/tours/${encodeURIComponent(tour.id)}`);
      const html = await page.text();
      if (!page.ok) continue;
      if (html.includes(PLACEHOLDER_PHONE)) {
        throw new Error("A tour page still uses the placeholder phone link.");
      }
      const href = bookNowHref(html);
      if (!href) continue;
      bookNow = href;
      tourName = tour.name;
      break;
    }
    if (!bookNow.startsWith(WHATSAPP)) {
      throw new Error("Book Now does not open the WhatsApp link.");
    }
    const bookingText = new URL(bookNow).searchParams.get("text") ?? "";
    if (!bookingText.includes(tourName) || !bookingText.toLowerCase().includes("booking")) {
      throw new Error("Book Now does not carry the tour booking.");
    }
    const buttonBooking = await postRequest({ kind: "booking", message: bookingText });
    if (buttonBooking.status !== 200 || !buttonBooking.body.id) {
      throw new Error("The Book Now booking was not saved.");
    }
    savedIds.push(buttonBooking.body.id);
    const [buttonRow] = await db.select().from(guestRequests).where(eq(guestRequests.id, buttonBooking.body.id));
    if (!buttonRow || buttonRow.kind !== "booking" || buttonRow.message !== bookingText) {
      throw new Error("The Book Now booking could not be read back.");
    }

    const home = await fetch(`${siteBase()}/`);
    const homeText = await home.text();
    if (!home.ok) throw new Error("The public home page did not load.");
    if (homeText.includes(PLACEHOLDER_PHONE)) {
      throw new Error("The public home page still uses the placeholder phone link.");
    }
    if (homeText.includes(phone)) {
      throw new Error("The public home page includes the test guest phone.");
    }
    console.log("Step 3 part 1 checks passed.");
  } finally {
    for (const id of savedIds) {
      await db.delete(guestRequests).where(eq(guestRequests.id, id));
    }
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sql.end({ timeout: 5 });
  });
