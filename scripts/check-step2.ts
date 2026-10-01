import { spawn } from "child_process";
import { unlink } from "fs/promises";
import path from "path";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { loginFailures, photos, users } from "../lib/db/schema";
import { signInRefusalLine } from "../lib/auth/login-guard";
import { createUserAs, removeUserAs } from "../lib/office/users";
import { authenticate } from "../lib/auth/authenticate";

const LOGIN_ERROR = "That email or password is not right.";
const PROBE_PASSWORD = "step2-probe-password";
const EDITOR_EMAIL = "editor-step2-security@travelwithmoeen.test";
const EDITOR_PASSWORD = "Step2Editor-pass";
const MANAGER_EMAIL = "manager-step2-security@travelwithmoeen.test";
const MANAGER_PASSWORD = "Step2Manager-pass";

const JPEG = Buffer.from(
  "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=",
  "base64",
);
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);
const WEBP = Buffer.from("UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==", "base64");

function officeBase() {
  const configured = process.env.API_BASE_URL?.trim().replace(/\/$/, "");
  return configured || "http://localhost:3000";
}

function assertNoSecret(text: string, password: string) {
  const secret = process.env.SESSION_SECRET ?? "";
  if (secret && text.includes(secret)) {
    throw new Error("A response contained SESSION_SECRET.");
  }
  if (password && text.includes(password)) {
    throw new Error("A response contained the password.");
  }
}

function sessionCookie(response: Response) {
  const lines = response.headers.getSetCookie?.() ?? [];
  const match = lines.find((line) => line.startsWith("twm_office="));
  return match ? match.split(";")[0] : "";
}

function cookieCleared(response: Response) {
  const lines = response.headers.getSetCookie?.() ?? [];
  return lines.some((line) => line.startsWith("twm_office=") && (/Max-Age=0/i.test(line) || line.startsWith("twm_office=;")));
}

async function officePost(pathname: string, form: FormData, cookie: string) {
  let response: Response;
  try {
    response = await fetch(`${officeBase()}${pathname}`, {
      method: "POST",
      body: form,
      headers: cookie ? { cookie } : {},
    });
  } catch {
    throw new Error(`The office API is not running at ${officeBase()}. Start it with npm run dev.`);
  }
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
  const result = await officePost("/api/office/login", form, "");
  assertNoSecret(result.text, password);
  return result;
}

function runStep1() {
  return new Promise<void>((resolve, reject) => {
    const child = spawn("npm", ["run", "check:step1"], {
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error("The Step 1 checks failed."));
    });
  });
}

function photoForm(name: string, bytes: Buffer, alt: string, browserType: string) {
  const form = new FormData();
  form.set("photo", new File([new Uint8Array(bytes)], name, { type: browserType }));
  form.set("alt", alt);
  form.set("category", "private");
  return form;
}

async function savedPhoto(alt: string) {
  const [row] = await db.select().from(photos).where(eq(photos.alt, alt)).limit(1);
  if (!row) throw new Error(`The ${alt} photo was not saved.`);
  const base = path.basename(row.src);
  if (base !== row.src.replace(/^\/uploads\//, "") || base.includes("..") || row.src.includes("\\")) {
    throw new Error(`The stored photo name has a folder path: ${row.src}`);
  }
  if (!/^\/uploads\/\d+-[a-f0-9]{16}\.(jpg|png|webp)$/.test(row.src)) {
    throw new Error(`The stored photo name was not a plain file name: ${row.src}`);
  }
  return row;
}

async function removePhoto(id: number, src: string, cookie: string) {
  const form = new FormData();
  form.set("id", String(id));
  const removed = await officePost("/api/office/photos/delete", form, cookie);
  if (removed.status !== 200 || !removed.body.ok) {
    throw new Error(`The test photo could not be removed: ${removed.status}`);
  }
  await unlink(path.join(process.cwd(), "public", "uploads", path.basename(src))).catch(() => undefined);
}

async function main() {
  const ownerEmail = process.env.OWNER_EMAIL?.trim().toLowerCase();
  const ownerPassword = process.env.OWNER_PASSWORD;
  if (!ownerEmail || !ownerPassword) {
    throw new Error("OWNER_EMAIL and OWNER_PASSWORD are required.");
  }

  const line = signInRefusalLine("person@example.com", new Date("2026-09-30T00:00:00.000Z"));
  if (line !== "Sign-in refused for person@example.com at 2026-09-30T00:00:00.000Z" || line.includes(PROBE_PASSWORD)) {
    throw new Error("The sign-in log line must contain the email and the time only.");
  }

  await runStep1();

  await db.delete(loginFailures).where(eq(loginFailures.email, ownerEmail));
  await db.delete(loginFailures).where(eq(loginFailures.email, EDITOR_EMAIL));
  await db.delete(loginFailures).where(eq(loginFailures.email, MANAGER_EMAIL));
  await db.delete(loginFailures).where(eq(loginFailures.email, "nobody-step2@travelwithmoeen.test"));
  await db.delete(users).where(eq(users.email, EDITOR_EMAIL));
  await db.delete(users).where(eq(users.email, MANAGER_EMAIL));

  const unknown = await signIn("nobody-step2@travelwithmoeen.test", PROBE_PASSWORD);
  const wrong = await signIn(ownerEmail, PROBE_PASSWORD);
  if (unknown.status !== 401 || wrong.status !== 401 || unknown.body.error !== LOGIN_ERROR || wrong.body.error !== LOGIN_ERROR) {
    throw new Error("A bad email and a bad password did not return the same 401 error.");
  }
  if (unknown.body.error !== wrong.body.error) {
    throw new Error("The login error text changed between an unknown email and a wrong password.");
  }

  const missing = await officePost("/api/office/tours", new FormData(), "");
  assertNoSecret(missing.text, PROBE_PASSWORD);
  if (missing.status !== 401 || missing.body.ok) {
    throw new Error(`An office save with no cookie returned ${missing.status}.`);
  }

  const owner = await authenticate(ownerEmail, ownerPassword);
  if (!owner) throw new Error("The Owner password was refused.");
  const created = await createUserAs(owner, {
    email: EDITOR_EMAIL,
    password: EDITOR_PASSWORD,
    role: "editor",
  });
  if (!created.ok) throw new Error("The Owner could not create the Step 2 Editor.");
  const managerCreated = await createUserAs(owner, {
    email: MANAGER_EMAIL,
    password: MANAGER_PASSWORD,
    role: "manager",
  });
  if (!managerCreated.ok) throw new Error("The Owner could not create the Step 2 Manager.");

  let editorCookie = "";
  const saved: { id: number; src: string }[] = [];
  try {
  const editorLogin = await signIn(EDITOR_EMAIL, EDITOR_PASSWORD);
  if (editorLogin.status !== 200 || !editorLogin.body.ok) {
    throw new Error("The Step 2 Editor could not sign in.");
  }
  editorCookie = sessionCookie(editorLogin.response);
  if (!editorCookie) throw new Error("Login did not set a session cookie.");

  const textFile = await officePost(
    "/api/office/photos",
    photoForm("notes.jpg", Buffer.from("this is a text file"), "step2-text", "image/jpeg"),
    editorCookie,
  );
  if (textFile.status !== 400 || textFile.body.error !== "Use a JPEG, PNG, or WebP file.") {
    throw new Error(`A text file renamed to .jpg was not refused: ${textFile.status} ${textFile.body.error ?? ""}`);
  }

  const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
  const svgFile = await officePost(
    "/api/office/photos",
    photoForm("icon.svg", svg, "step2-svg", "image/svg+xml"),
    editorCookie,
  );
  if (svgFile.status !== 400 || svgFile.body.error !== "Use a JPEG, PNG, or WebP file.") {
    throw new Error(`An SVG file was not refused: ${svgFile.status} ${svgFile.body.error ?? ""}`);
  }

  const oversized = Buffer.alloc(5 * 1024 * 1024 + 1);
  oversized[0] = 0xff;
  oversized[1] = 0xd8;
  oversized[2] = 0xff;
  const bigFile = await officePost(
    "/api/office/photos",
    photoForm("big.jpg", oversized, "step2-big", "image/jpeg"),
    editorCookie,
  );
  if (bigFile.status !== 400 || bigFile.body.error !== "The file is larger than 5 MB.") {
    throw new Error(`A file over 5 MB was not refused: ${bigFile.status} ${bigFile.body.error ?? ""}`);
  }

    const uploads = [
      { name: "tiny.jpg", bytes: JPEG, alt: "step2-jpeg", type: "image/jpeg" },
      { name: "tiny.png", bytes: PNG, alt: "step2-png", type: "image/png" },
      { name: "tiny.webp", bytes: WEBP, alt: "step2-webp", type: "image/webp" },
    ];
    for (const upload of uploads) {
      const result = await officePost("/api/office/photos", photoForm(upload.name, upload.bytes, upload.alt, upload.type), editorCookie);
      if (result.status !== 200 || !result.body.ok) {
        throw new Error(`A real ${upload.type} at under 5 MB was refused: ${result.status} ${result.body.error ?? ""}`);
      }
      saved.push(await savedPhoto(upload.alt));
    }

    const priceAttempt = await officePost("/api/office/rates", new FormData(), editorCookie);
    if (priceAttempt.status !== 403 || priceAttempt.body.ok) {
      throw new Error(`The Editor price save returned ${priceAttempt.status}.`);
    }

    const managerLogin = await signIn(MANAGER_EMAIL, MANAGER_PASSWORD);
    if (managerLogin.status !== 200 || !managerLogin.body.ok) {
      throw new Error("The Step 2 Manager could not sign in.");
    }
    const managerCookie = sessionCookie(managerLogin.response);
    if (!managerCookie) throw new Error("The Manager login did not set a session cookie.");
    const managerPhoto = await officePost(
      "/api/office/photos",
      photoForm("tiny.jpg", JPEG, "step2-manager", "image/jpeg"),
      managerCookie,
    );
    if (managerPhoto.status !== 403 || managerPhoto.body.ok || managerPhoto.body.error !== "You cannot edit a photo.") {
      throw new Error(`A Manager photo upload returned ${managerPhoto.status} ${managerPhoto.body.error ?? ""}`);
    }

    const logout = await officePost("/api/office/logout", new FormData(), editorCookie);
    if (!logout.body.ok || !cookieCleared(logout.response)) {
      throw new Error("Logout did not clear the session cookie.");
    }
    const afterLogout = await officePost("/api/office/tours", new FormData(), "");
    if (afterLogout.status !== 401) {
      throw new Error(`An office save after logout returned ${afterLogout.status}.`);
    }
    const badLogout = await officePost("/api/office/logout", new FormData(), "twm_office=not-a-session");
    if (badLogout.status !== 401 || !cookieCleared(badLogout.response)) {
      throw new Error("Logout left a bad session cookie in place.");
    }

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const failed = await signIn(EDITOR_EMAIL, PROBE_PASSWORD);
      if (failed.status !== 401 || failed.body.error !== LOGIN_ERROR) {
        throw new Error(`Failed sign-in ${attempt + 1} was not a normal refusal.`);
      }
    }
    const locked = await signIn(EDITOR_EMAIL, EDITOR_PASSWORD);
    if (locked.status !== 401 || locked.body.ok || locked.body.error !== LOGIN_ERROR) {
      throw new Error("The 11th sign-in inside 15 minutes was accepted.");
    }
    const failureRows = await db.select({ id: loginFailures.id }).from(loginFailures).where(eq(loginFailures.email, EDITOR_EMAIL));
    if (failureRows.length !== 10) {
      throw new Error(`Expected 10 recorded sign-in failures and found ${failureRows.length}.`);
    }
    const expiredAt = new Date(Date.now() - 16 * 60 * 1000);
    await db.update(loginFailures).set({ failedAt: expiredAt }).where(eq(loginFailures.email, EDITOR_EMAIL));
    const aged = await db
      .select({ failedAt: loginFailures.failedAt })
      .from(loginFailures)
      .where(eq(loginFailures.email, EDITOR_EMAIL));
    const cutoff = new Date(Date.now() - 15 * 60 * 1000);
    if (aged.length !== 10 || aged.some((row) => row.failedAt >= cutoff)) {
      throw new Error("The ten old sign-in failures were not outside the 15 minute window.");
    }
    const afterWindow = await signIn(EDITOR_EMAIL, EDITOR_PASSWORD);
    if (afterWindow.status !== 200 || !afterWindow.body.ok) {
      throw new Error("The right password was refused after the 15 minute window.");
    }
  } finally {
    for (const photo of saved) {
      await removePhoto(photo.id, photo.src, editorCookie).catch(() => undefined);
    }
    await db.delete(photos).where(eq(photos.alt, "step2-jpeg"));
    await db.delete(photos).where(eq(photos.alt, "step2-png"));
    await db.delete(photos).where(eq(photos.alt, "step2-webp"));
    await db.delete(loginFailures).where(eq(loginFailures.email, EDITOR_EMAIL));
    await db.delete(loginFailures).where(eq(loginFailures.email, MANAGER_EMAIL));
    await db.delete(loginFailures).where(eq(loginFailures.email, ownerEmail));
    await db.delete(loginFailures).where(eq(loginFailures.email, "nobody-step2@travelwithmoeen.test"));
    await db.delete(photos).where(eq(photos.alt, "step2-manager"));
    const editor = await authenticate(EDITOR_EMAIL, EDITOR_PASSWORD);
    if (editor) await removeUserAs(owner, editor.id);
    const manager = await authenticate(MANAGER_EMAIL, MANAGER_PASSWORD);
    if (manager) await removeUserAs(owner, manager.id);
    await db.delete(users).where(eq(users.email, EDITOR_EMAIL));
    await db.delete(users).where(eq(users.email, MANAGER_EMAIL));
  }

  console.info("Step 2 security checks passed.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
