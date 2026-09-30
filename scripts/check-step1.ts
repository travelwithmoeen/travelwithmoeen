import { eq } from "drizzle-orm";
import { authenticate } from "../lib/auth/authenticate";
import { db } from "../lib/db";
import { users } from "../lib/db/schema";
import { savePriceAs, updateTourAs } from "../lib/office/content-writes";
import { createUserAs, removeUserAs } from "../lib/office/users";
import { getTour } from "../lib/content";

function officeBase() {
  const configured = process.env.API_BASE_URL?.trim().replace(/\/$/, "");
  return configured || "http://localhost:3000";
}

function sessionCookie(response: Response) {
  const lines = response.headers.getSetCookie?.() ?? [];
  const match = lines.find((line) => line.startsWith("twm_office="));
  return match ? match.split(";")[0] : "";
}

async function officePost(path: string, form: FormData, cookie: string) {
  let response: Response;
  try {
    response = await fetch(`${officeBase()}${path}`, {
      method: "POST",
      body: form,
      headers: cookie ? { cookie } : {},
    });
  } catch {
    throw new Error(`The office API is not running at ${officeBase()}. Start it with npm run dev.`);
  }
  const body = (await response.json()) as { ok?: boolean; error?: string };
  return { status: response.status, body };
}

async function signIn(email: string, password: string) {
  const form = new FormData();
  form.set("email", email);
  form.set("password", password);
  let response: Response;
  try {
    response = await fetch(`${officeBase()}/api/office/login`, { method: "POST", body: form });
  } catch {
    throw new Error(`The office API is not running at ${officeBase()}. Start it with npm run dev.`);
  }
  const body = (await response.json()) as { ok?: boolean; error?: string };
  if (!response.ok || !body.ok) {
    throw new Error(`Office login failed for ${email}: ${body.error ?? response.status}`);
  }
  const cookie = sessionCookie(response);
  if (!cookie) throw new Error(`Office login for ${email} did not set a session cookie.`);
  return cookie;
}

async function checkOfficeApi(
  editorEmail: string,
  editorPassword: string,
  managerEmail: string,
  managerPassword: string,
) {
  const editorCookie = await signIn(editorEmail, editorPassword);
  const priceAttempt = await officePost("/api/office/rates", new FormData(), editorCookie);
  if (priceAttempt.status === 200 || priceAttempt.body.ok || priceAttempt.body.error !== "You cannot change a price.") {
    throw new Error(`Editor price save through the API was not refused: ${JSON.stringify(priceAttempt)}`);
  }

  const managerCookie = await signIn(managerEmail, managerPassword);
  const tourForm = new FormData();
  tourForm.set("id", "1_day_by_road_trip_to_islamabad");
  tourForm.set("name", "Changed by manager");
  tourForm.set("image", "/images/twm-logo.webp");
  tourForm.set("itinerary", "[]");
  const titleAttempt = await officePost("/api/office/tours", tourForm, managerCookie);
  if (titleAttempt.status === 200 || titleAttempt.body.ok || titleAttempt.body.error !== "You cannot edit a tour.") {
    throw new Error(`Manager tour save through the API was not refused: ${JSON.stringify(titleAttempt)}`);
  }
}

async function main() {
  const email = process.env.OWNER_EMAIL?.trim().toLowerCase();
  const password = process.env.OWNER_PASSWORD;
  if (!email || !password) {
    throw new Error("OWNER_EMAIL and OWNER_PASSWORD are required.");
  }

  const wrong = await authenticate(email, "not-the-password");
  if (wrong) throw new Error("A wrong password was accepted.");

  const owner = await authenticate(email, password);
  if (!owner || owner.role !== "owner") throw new Error("The Owner password was refused.");

  const editorEmail = "editor-step1-check@travelwithmoeen.test";
  const managerEmail = "manager-step1-check@travelwithmoeen.test";
  const editorPassword = `check-${Date.now()}-editor`;
  const managerPassword = `check-${Date.now()}-manager`;
  await db.delete(users).where(eq(users.email, editorEmail));
  await db.delete(users).where(eq(users.email, managerEmail));

  let editorId = 0;
  let managerId = 0;
  try {
    const editorCreated = await createUserAs(owner, {
      email: editorEmail,
      password: editorPassword,
      role: "editor",
    });
    const managerCreated = await createUserAs(owner, {
      email: managerEmail,
      password: managerPassword,
      role: "manager",
    });
    if (!editorCreated.ok || !managerCreated.ok) {
      throw new Error("The Owner could not create an Editor and a Manager.");
    }

    const editor = await authenticate(editorEmail, editorPassword);
    const manager = await authenticate(managerEmail, managerPassword);
    if (!editor || !manager) throw new Error("The new logins could not sign in.");
    editorId = editor.id;
    managerId = manager.id;

    const priceAttempt = await savePriceAs(editor);
    if (priceAttempt.ok || priceAttempt.error !== "You cannot change a price.") {
      throw new Error(`Editor price save was not refused: ${JSON.stringify(priceAttempt)}`);
    }

    const titleAttempt = await updateTourAs(manager, {
      id: "missing",
      name: "Changed by manager",
      location: "",
      region: "",
      description: "",
      duration: 1,
      image: "/images/twm-logo.webp",
      pdf: "",
      galleryImages: [],
      categories: [],
      packageTypes: [],
      transport: "By Road",
      included: [],
      notIncluded: [],
      featured: false,
      itinerary: [],
    });
    if (titleAttempt.ok || titleAttempt.error !== "You cannot edit a tour.") {
      throw new Error(`Manager tour save was not refused: ${JSON.stringify(titleAttempt)}`);
    }

    await checkOfficeApi(editorEmail, editorPassword, managerEmail, managerPassword);

    const sample = await getTour("1_day_by_road_trip_to_islamabad");
    if (!sample) throw new Error("Sample tour was not loaded.");
    const edited = await updateTourAs(editor, {
      id: sample.id,
      name: `${sample.name} Check`,
      location: sample.location,
      region: sample.region,
      description: sample.description,
      duration: sample.duration,
      image: "/images/twm-logo.webp",
      pdf: sample.pdf,
      galleryImages: sample.galleryImages,
      categories: sample.categories,
      packageTypes: sample.packageTypes,
      transport: sample.transport,
      included: sample.included,
      notIncluded: sample.notIncluded,
      featured: sample.featured ?? false,
      itinerary: sample.itinerary,
    });
    if (!edited.ok) throw new Error(edited.error);
    const seen = await getTour(sample.id);
    if (seen?.name !== `${sample.name} Check` || seen.image !== "/images/twm-logo.webp") {
      throw new Error("The Editor change was not stored.");
    }
    const restored = await updateTourAs(editor, {
      id: sample.id,
      name: sample.name,
      location: sample.location,
      region: sample.region,
      description: sample.description,
      duration: sample.duration,
      image: sample.image,
      pdf: sample.pdf,
      galleryImages: sample.galleryImages,
      categories: sample.categories,
      packageTypes: sample.packageTypes,
      transport: sample.transport,
      included: sample.included,
      notIncluded: sample.notIncluded,
      featured: sample.featured ?? false,
      itinerary: sample.itinerary,
    });
    if (!restored.ok) throw new Error(restored.error);
  } finally {
    if (editorId) await removeUserAs(owner, editorId);
    if (managerId) await removeUserAs(owner, managerId);
  }

  console.log("Step 1 server checks passed.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
