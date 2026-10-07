import { readFileSync } from "fs";
import { spawn } from "child_process";
import { eq } from "drizzle-orm";
import { db, sql } from "../lib/db";
import { guestRequests, loginFailures, tours, users } from "../lib/db/schema";
import { authenticate } from "../lib/auth/authenticate";
import { createUserAs, removeUserAs } from "../lib/office/users";
import { GUEST_EMAIL_LIMIT, GUEST_MESSAGE_LIMIT, GUEST_NAME_LIMIT, GUEST_PHONE_LIMIT } from "../lib/requests";

const EDITOR_EMAIL = "editor-step3-requests@travelwithmoeen.test";
const EDITOR_PASSWORD = "Step3Editor-pass";
const MANAGER_EMAIL = "manager-step3-requests@travelwithmoeen.test";
const MANAGER_PASSWORD = "Step3Manager-pass";

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

function sessionCookie(response: Response) {
  const lines = response.headers.getSetCookie?.() ?? [];
  const match = lines.find((line) => line.startsWith("twm_office="));
  return match ? match.split(";")[0] : "";
}

async function officePost(pathname: string, form: FormData, cookie: string) {
  const response = await fetch(`${siteBase()}${pathname}`, {
    method: "POST",
    body: form,
    headers: cookie ? { cookie } : {},
  });
  const text = await response.text();
  let body: { ok?: boolean; error?: string } = {};
  try {
    body = JSON.parse(text) as { ok?: boolean; error?: string };
  } catch {
    body = {};
  }
  return { status: response.status, body, text, response };
}

async function signIn(email: string, password: string) {
  const form = new FormData();
  form.set("email", email);
  form.set("password", password);
  return officePost("/api/office/login", form, "");
}

async function officeGet(pathname: string, cookie: string) {
  const response = await fetch(`${siteBase()}${pathname}`, {
    headers: cookie ? { cookie } : {},
  });
  const text = await response.text();
  let body: { ok?: boolean; requests?: { id: number; phone?: string; message?: string; status?: string }[] } = {};
  try {
    body = JSON.parse(text) as typeof body;
  } catch {
    body = {};
  }
  return { status: response.status, body, text };
}

async function assertOfficeRequests(savedIds: number[]) {
  const ownerEmail = process.env.OWNER_EMAIL?.trim().toLowerCase();
  const ownerPassword = process.env.OWNER_PASSWORD;
  if (!ownerEmail || !ownerPassword) throw new Error("OWNER_EMAIL and OWNER_PASSWORD are required.");
  await db.delete(loginFailures).where(eq(loginFailures.email, EDITOR_EMAIL));
  await db.delete(loginFailures).where(eq(loginFailures.email, MANAGER_EMAIL));
  await db.delete(users).where(eq(users.email, EDITOR_EMAIL));
  await db.delete(users).where(eq(users.email, MANAGER_EMAIL));
  const owner = await authenticate(ownerEmail, ownerPassword);
  if (!owner) throw new Error("The Owner password was refused.");
  const editorCreated = await createUserAs(owner, { email: EDITOR_EMAIL, password: EDITOR_PASSWORD, role: "editor" });
  if (!editorCreated.ok) throw new Error("The Owner could not create the Step 3 Editor.");
  const managerCreated = await createUserAs(owner, { email: MANAGER_EMAIL, password: MANAGER_PASSWORD, role: "manager" });
  if (!managerCreated.ok) throw new Error("The Owner could not create the Step 3 Manager.");

  const marker = `step3-office-${Date.now()}`;
  const phone = "03007770021";
  const message = `<b>${marker}</b>`;
  try {
    const saved = await postRequest({
      kind: "contact",
      name: "Office List Guest",
      email: "office-list@travelwithmoeen.test",
      phone,
      message,
    });
    if (saved.status !== 200 || !saved.body.id) throw new Error("The office test contact was not saved.");
    savedIds.push(saved.body.id);
    const requestId = String(saved.body.id);

    const signedOut = await officeGet("/api/office/requests", "");
    if (signedOut.status !== 401) throw new Error(`A request list with no cookie returned ${signedOut.status}.`);

    const editorLogin = await signIn(EDITOR_EMAIL, EDITOR_PASSWORD);
    const editorCookie = sessionCookie(editorLogin.response);
    if (!editorCookie) throw new Error("The Editor did not get a session.");
    const editorList = await officeGet("/api/office/requests", editorCookie);
    const listed = editorList.body.requests?.find((row) => row.id === saved.body.id);
    if (editorList.status !== 200 || !listed || listed.phone !== phone || listed.message !== message) {
      throw new Error("An Editor could not read the guest request.");
    }
    const statusForm = new FormData();
    statusForm.set("id", requestId);
    statusForm.set("status", "in_progress");
    const editorStatus = await officePost("/api/office/requests/status", statusForm, editorCookie);
    if (editorStatus.status !== 403) throw new Error(`An Editor status change returned ${editorStatus.status}.`);
    const deleteForm = new FormData();
    deleteForm.set("id", requestId);
    const editorDelete = await officePost("/api/office/requests/delete", deleteForm, editorCookie);
    if (editorDelete.status !== 403) throw new Error(`An Editor delete returned ${editorDelete.status}.`);

    const managerLogin = await signIn(MANAGER_EMAIL, MANAGER_PASSWORD);
    const managerCookie = sessionCookie(managerLogin.response);
    if (!managerCookie) throw new Error("The Manager did not get a session.");
    const managerStatus = await officePost("/api/office/requests/status", statusForm, managerCookie);
    if (managerStatus.status !== 200 || !managerStatus.body.ok) {
      throw new Error(`A Manager status change returned ${managerStatus.status}.`);
    }
    const [updated] = await db.select().from(guestRequests).where(eq(guestRequests.id, saved.body.id));
    if (!updated || updated.status !== "in_progress") throw new Error("The Manager status was not saved.");
    const badStatus = new FormData();
    badStatus.set("id", requestId);
    badStatus.set("status", "done");
    const refused = await officePost("/api/office/requests/status", badStatus, managerCookie);
    if (refused.status !== 400) throw new Error(`A bad status returned ${refused.status}.`);
    const managerDelete = await officePost("/api/office/requests/delete", deleteForm, managerCookie);
    if (managerDelete.status !== 403) throw new Error(`A Manager delete returned ${managerDelete.status}.`);

    const publicPaths = ["/", "/tours", "/contact", "/customize-trip", "/calculator"];
    for (const path of publicPaths) {
      const page = await fetch(`${siteBase()}${path}`);
      const html = await page.text();
      if (!page.ok || html.includes(phone) || html.includes(marker)) {
        throw new Error(`A public page includes the guest details: ${path}`);
      }
    }

    const ownerLogin = await signIn(ownerEmail, ownerPassword);
    const ownerCookie = sessionCookie(ownerLogin.response);
    if (!ownerCookie) throw new Error("The Owner did not get a session.");
    const ownerDelete = await officePost("/api/office/requests/delete", deleteForm, ownerCookie);
    if (ownerDelete.status !== 200 || !ownerDelete.body.ok) {
      throw new Error(`An Owner delete returned ${ownerDelete.status}.`);
    }
    const [gone] = await db.select().from(guestRequests).where(eq(guestRequests.id, saved.body.id));
    if (gone) throw new Error("The Owner delete left the request in the list.");
  } finally {
    const editor = await authenticate(EDITOR_EMAIL, EDITOR_PASSWORD);
    if (editor) await removeUserAs(owner, editor.id);
    const manager = await authenticate(MANAGER_EMAIL, MANAGER_PASSWORD);
    if (manager) await removeUserAs(owner, manager.id);
    await db.delete(users).where(eq(users.email, EDITOR_EMAIL));
    await db.delete(users).where(eq(users.email, MANAGER_EMAIL));
  }
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
    await assertOfficeRequests(savedIds);
    console.log("Step 3 checks passed.");
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
