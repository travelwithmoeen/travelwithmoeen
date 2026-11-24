import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs";
import os from "os";
import path from "path";
import { spawn } from "child_process";
import { del, head, list, put } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { and, count, desc, eq, gt, inArray, like, max, sql as dsql } from "drizzle-orm";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { db, sql } from "../lib/db";
import { activity, airExtras as airExtrasTable, dayPlans, guestRequests, hotelRates, jeepLines, loginFailures, mealRates, packageOptions, packageSections, placeHotelNames, pricingRules, photos, places, posts, quoteDays, quoteExtras, quoteNights, quotePackages, quotes, reviews, rolePermissions, roles, seasons, slides, startCities, tourDays, tourPlaces, tours, users, vehicleRates } from "../lib/db/schema";
import type { SessionUser } from "../lib/auth/session";
import { inferTourPlaceLinks, linkInferredTourPlaces } from "../lib/office/tour-places";
import { authenticate } from "../lib/auth/authenticate";
import { createUserAs, removeUserAs } from "../lib/office/users";
import { officeMediaPath } from "../lib/office/media";
import { BACKUP_TABLES, readBackupFile } from "../lib/office/backup";
import { FREE_DAY_LABEL, FREE_DAY_TEXT, freeDayTitle, hotelLine, packageDays, packageMinimumDays, type DayPlanRow } from "../lib/package";
import { buildQuote, quoteOptions, type QuoteInput } from "../lib/quote";
import { loadCatalog } from "../lib/rates";
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
  let body: { ok?: boolean; error?: string; href?: string } = {};
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
  let body: { ok?: boolean; requests?: { id: number; kind?: string; phone?: string; message?: string; status?: string }[] } = {};
  try {
    body = JSON.parse(text) as typeof body;
  } catch {
    body = {};
  }
  return { status: response.status, body, text };
}

async function assertBookingOnOfficeList(id: number, message: string) {
  const ownerEmail = process.env.OWNER_EMAIL?.trim().toLowerCase();
  const ownerPassword = process.env.OWNER_PASSWORD;
  if (!ownerEmail || !ownerPassword) throw new Error("OWNER_EMAIL and OWNER_PASSWORD are required.");
  const login = await signIn(ownerEmail, ownerPassword);
  const cookie = sessionCookie(login.response);
  if (!cookie) throw new Error("The Owner did not get a session.");
  const list = await officeGet("/api/office/requests", cookie);
  const listed = list.body.requests?.find((row) => row.id === id);
  if (list.status !== 200 || !listed || listed.kind !== "booking" || listed.status !== "new" || listed.message !== message) {
    throw new Error("The saved booking is not in the office list.");
  }
}

const JPEG = Buffer.from(
  "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=",
  "base64",
);

function shippedFile(urlPath: string) {
  return path.join(process.cwd(), "public", urlPath.replace(/^\/+/, ""));
}

function assertMediaGuards() {
  if (officeMediaPath("https://example.public.blob.vercel-storage.com/backups/preview-2026.json") !== null) {
    throw new Error("A media check accepted a backup path.");
  }
  if (officeMediaPath("/images/tours/a.jpg") !== null) {
    throw new Error("A media check would delete a shipped picture.");
  }
  if (officeMediaPath("/pdfs/tour.pdf") !== null) {
    throw new Error("A media check would delete a shipped PDF.");
  }
  const kept = officeMediaPath("https://example.public.blob.vercel-storage.com/media/1710000000000-ab12cd34ef567890.jpg");
  if (kept !== "media/1710000000000-ab12cd34ef567890.jpg") {
    throw new Error("A public media file was not recognized.");
  }
}

function tourForm(
  tour: typeof tours.$inferSelect,
  extras: { image?: string; pdf?: string; gallery?: string[]; photo?: File; extra?: File; pdfFile?: File } = {},
) {
  const form = new FormData();
  form.set("id", tour.id);
  form.set("name", tour.name);
  form.set("location", tour.location);
  form.set("region", tour.region);
  form.set("description", tour.description);
  form.set("duration", String(tour.duration));
  form.set("image", extras.image ?? tour.image);
  form.set("pdf", extras.pdf ?? tour.pdf);
  form.set("categories", tour.categories.join("\n"));
  form.set("packageTypes", tour.packageTypes.join("\n"));
  form.set("transport", tour.transport);
  form.set("included", tour.included.join("\n"));
  form.set("notIncluded", tour.notIncluded.join("\n"));
  form.set("itinerary", "[]");
  form.set("galleryImageSet", "1");
  for (const photo of extras.gallery ?? tour.galleryImages) form.append("galleryImage", photo);
  if (extras.photo) form.set("photo", extras.photo);
  if (extras.extra) form.set("extraPhoto", extras.extra);
  if (extras.pdfFile) form.set("pdfFile", extras.pdfFile);
  return form;
}

function jpegFile(name: string) {
  return new File([new Uint8Array(JPEG)], name, { type: "image/jpeg" });
}

async function assertPlaceBlogReview(editorCookie: string, shipped: string) {
  const placeSlug = "office-media-place";
  const postSlug = "office-media-post";
  await db.delete(places).where(eq(places.slug, placeSlug));
  await db.delete(posts).where(eq(posts.slug, postSlug));
  await db.insert(places).values({
    slug: placeSlug,
    title: "Office media place",
    excerpt: "Office media place",
    bannerImage: shipped,
    location: "Check",
    listingNumber: 99001,
    content: [],
  });
  await db.insert(posts).values({
    slug: postSlug,
    title: "Office media post",
    excerpt: "Office media post",
    author: "Office",
    date: "2026-10-13",
    coverImage: shipped,
    content: [],
  });
  const [reviewRow] = await db
    .insert(reviews)
    .values({ name: "Office media review", avatar: "", location: "Check", text: "Office media review stays.", rating: 5 })
    .returning({ id: reviews.id });
  const reviewId = reviewRow.id;
  const uploaded: string[] = [];
  try {
    const placeForm = new FormData();
    placeForm.set("slug", placeSlug);
    placeForm.set("title", "Office media place");
    placeForm.set("excerpt", "Office media place");
    placeForm.set("location", "Check");
    placeForm.set("bannerImage", shipped);
    placeForm.set("content", "[]");
    placeForm.set("bannerPhoto", jpegFile("banner.jpg"));
    const placeSave = await officePost("/api/office/places", placeForm, editorCookie);
    if (placeSave.status !== 200 || !placeSave.body.ok) {
      throw new Error(`A place banner was not saved: ${placeSave.status} ${placeSave.body.error ?? ""}`);
    }
    const [place] = await db.select().from(places).where(eq(places.slug, placeSlug)).limit(1);
    if (!place?.bannerImage || !officeMediaPath(place.bannerImage)?.endsWith(".jpg")) {
      throw new Error("The place banner was not stored as a public media file.");
    }
    uploaded.push(place.bannerImage);
    const placePage = await fetch(`${siteBase()}/destinations/${placeSlug}`);
    if (!(await placePage.text()).includes(place.bannerImage)) {
      throw new Error("The public place page does not show the banner.");
    }
    const postForm = new FormData();
    postForm.set("slug", postSlug);
    postForm.set("title", "Office media post");
    postForm.set("excerpt", "Office media post");
    postForm.set("author", "Office");
    postForm.set("date", "2026-10-13");
    postForm.set("coverImage", shipped);
    postForm.set("content", "[]");
    postForm.set("coverPhoto", jpegFile("cover.jpg"));
    const postSave = await officePost("/api/office/posts", postForm, editorCookie);
    if (postSave.status !== 200 || !postSave.body.ok) {
      throw new Error(`A blog cover was not saved: ${postSave.status} ${postSave.body.error ?? ""}`);
    }
    const [post] = await db.select().from(posts).where(eq(posts.slug, postSlug)).limit(1);
    if (!post?.coverImage || !officeMediaPath(post.coverImage)?.endsWith(".jpg")) {
      throw new Error("The blog cover was not stored as a public media file.");
    }
    uploaded.push(post.coverImage);
    const postPage = await fetch(`${siteBase()}/blog/${postSlug}`);
    if (!(await postPage.text()).includes(post.coverImage)) {
      throw new Error("The public blog page does not show the cover.");
    }
    const reviewForm = new FormData();
    reviewForm.set("id", String(reviewId));
    reviewForm.set("name", "Office media review");
    reviewForm.set("location", "Check");
    reviewForm.set("text", "Office media review stays.");
    reviewForm.set("rating", "5");
    reviewForm.set("avatar", "");
    reviewForm.set("avatarPhoto", jpegFile("avatar.jpg"));
    const reviewSave = await officePost("/api/office/reviews", reviewForm, editorCookie);
    if (reviewSave.status !== 200 || !reviewSave.body.ok) {
      throw new Error(`A review photo was not saved: ${reviewSave.status} ${reviewSave.body.error ?? ""}`);
    }
    const [withAvatar] = await db.select().from(reviews).where(eq(reviews.id, reviewId)).limit(1);
    if (!withAvatar?.avatar || !officeMediaPath(withAvatar.avatar)?.endsWith(".jpg")) {
      throw new Error("The review photo was not stored as a public media file.");
    }
    uploaded.push(withAvatar.avatar);
    const home = await fetch(`${siteBase()}/`);
    if (!(await home.text()).includes(withAvatar.avatar)) {
      throw new Error("The public page does not show the review photo.");
    }
    const clearForm = new FormData();
    clearForm.set("id", String(reviewId));
    clearForm.set("name", "Office media review");
    clearForm.set("location", "Check");
    clearForm.set("text", "Office media review stays.");
    clearForm.set("rating", "5");
    clearForm.set("avatar", "");
    const cleared = await officePost("/api/office/reviews", clearForm, editorCookie);
    if (cleared.status !== 200 || !cleared.body.ok) {
      throw new Error(`The review photo could not be cleared: ${cleared.status} ${cleared.body.error ?? ""}`);
    }
    const [kept] = await db.select().from(reviews).where(eq(reviews.id, reviewId)).limit(1);
    if (!kept || kept.text !== "Office media review stays." || kept.avatar !== "") {
      throw new Error("Clearing the photo removed the review.");
    }
    if ((await fetch(withAvatar.avatar)).ok) {
      throw new Error("Clearing the photo left the office file in storage.");
    }
    if (!existsSync(shippedFile(shipped))) {
      throw new Error("An office upload deleted a shipped picture.");
    }
    const placeBack = new FormData();
    placeBack.set("slug", placeSlug);
    placeBack.set("title", "Office media place");
    placeBack.set("excerpt", "Office media place");
    placeBack.set("location", "Check");
    placeBack.set("bannerImage", shipped);
    placeBack.set("content", "[]");
    const placeRestored = await officePost("/api/office/places", placeBack, editorCookie);
    if (placeRestored.status !== 200 || !placeRestored.body.ok) {
      throw new Error(`The place banner could not be put back: ${placeRestored.status} ${placeRestored.body.error ?? ""}`);
    }
    const [placeKept] = await db.select().from(places).where(eq(places.slug, placeSlug)).limit(1);
    if (!placeKept || placeKept.bannerImage !== shipped) throw new Error("Replacing the banner removed the place.");
    if ((await fetch(place.bannerImage)).ok) throw new Error("Replacing the banner left the office file in storage.");
    const postBack = new FormData();
    postBack.set("slug", postSlug);
    postBack.set("title", "Office media post");
    postBack.set("excerpt", "Office media post");
    postBack.set("author", "Office");
    postBack.set("date", "2026-10-13");
    postBack.set("coverImage", shipped);
    postBack.set("content", "[]");
    const postRestored = await officePost("/api/office/posts", postBack, editorCookie);
    if (postRestored.status !== 200 || !postRestored.body.ok) {
      throw new Error(`The blog cover could not be put back: ${postRestored.status} ${postRestored.body.error ?? ""}`);
    }
    const [postKept] = await db.select().from(posts).where(eq(posts.slug, postSlug)).limit(1);
    if (!postKept || postKept.coverImage !== shipped) throw new Error("Replacing the cover removed the post.");
    if ((await fetch(post.coverImage)).ok) throw new Error("Replacing the cover left the office file in storage.");
  } finally {
    const placeBack = new FormData();
    placeBack.set("slug", placeSlug);
    placeBack.set("title", "Office media place");
    placeBack.set("excerpt", "Office media place");
    placeBack.set("location", "Check");
    placeBack.set("bannerImage", shipped);
    placeBack.set("content", "[]");
    await officePost("/api/office/places", placeBack, editorCookie);
    const postBack = new FormData();
    postBack.set("slug", postSlug);
    postBack.set("title", "Office media post");
    postBack.set("excerpt", "Office media post");
    postBack.set("author", "Office");
    postBack.set("date", "2026-10-13");
    postBack.set("coverImage", shipped);
    postBack.set("content", "[]");
    await officePost("/api/office/posts", postBack, editorCookie);
    const removeReview = new FormData();
    removeReview.set("id", String(reviewId));
    await officePost("/api/office/reviews/delete", removeReview, editorCookie);
    await db.delete(places).where(eq(places.slug, placeSlug));
    await db.delete(posts).where(eq(posts.slug, postSlug));
    await db.delete(reviews).where(eq(reviews.id, reviewId));
  }
}

async function assertOfficeMedia(editorCookie: string, managerCookie: string, ownerCookie: string) {
  assertMediaGuards();
  const rows = await db.select().from(tours);
  const shipped = rows.flatMap((tour) => [tour.image, ...tour.galleryImages]).find((item) => item.startsWith("/images/") && existsSync(shippedFile(item)));
  if (!shipped) throw new Error("The media check needs a shipped picture under /images/.");
  await db.delete(tours).where(eq(tours.id, "office-media-check"));
  const [sample] = rows;
  if (!sample) throw new Error("There is no tour to copy for the media check.");
  await db.insert(tours).values({
    id: "office-media-check",
    name: "Office media check",
    location: sample.location,
    region: sample.region,
    duration: 1,
    description: "Office media check",
    image: shipped,
    pdf: "",
    code: "office-media-check",
    galleryImages: [shipped],
    categories: sample.categories,
    packageTypes: sample.packageTypes,
    transport: sample.transport,
    basePrice: 0,
    packages: [],
    included: [],
    notIncluded: [],
    featured: false,
    priceSource: "website",
  });
  const [created] = await db.select().from(tours).where(eq(tours.id, "office-media-check")).limit(1);
  if (!created) throw new Error("The media check tour was not created.");
  try {
    const jpeg = new File([new Uint8Array(JPEG)], "photo.jpg", { type: "image/jpeg" });
    const managerPhoto = await officePost("/api/office/tours", tourForm(created, { extra: jpeg }), managerCookie);
    if (managerPhoto.status !== 403 || managerPhoto.body.error !== "You cannot edit a photo.") {
      throw new Error(`A Manager was not refused a photo upload: ${managerPhoto.status} ${managerPhoto.body.error ?? ""}`);
    }
    const textPdf = new File([Buffer.from("hello")], "notes.pdf", { type: "application/pdf" });
    const badPdf = await officePost("/api/office/tours", tourForm(created, { pdfFile: textPdf }), editorCookie);
    if (badPdf.status !== 400 || badPdf.body.error !== "Use a PDF file.") {
      throw new Error(`A text file in the PDF field was not refused: ${badPdf.status} ${badPdf.body.error ?? ""}`);
    }
    const oversized = Buffer.alloc(10 * 1024 * 1024 + 1);
    oversized.write("%PDF-");
    const bigPdf = new File([new Uint8Array(oversized)], "large.pdf", { type: "application/pdf" });
    const big = await officePost("/api/office/tours", tourForm(created, { pdfFile: bigPdf }), editorCookie);
    if (big.status !== 400 || big.body.error !== "The file is larger than 10 MB.") {
      throw new Error(`A PDF over 10 MB was not refused: ${big.status} ${big.body.error ?? ""}`);
    }
    const extra = await officePost("/api/office/tours", tourForm(created, { extra: jpeg }), editorCookie);
    if (extra.status !== 200 || !extra.body.ok) {
      throw new Error(`An Editor JPEG was not saved: ${extra.status} ${extra.body.error ?? ""}`);
    }
    const [withPhoto] = await db.select().from(tours).where(eq(tours.id, created.id)).limit(1);
    const photoUrl = withPhoto?.galleryImages.find((item) => officeMediaPath(item)?.endsWith(".jpg"));
    if (!photoUrl || !withPhoto.galleryImages.includes(shipped)) {
      throw new Error("The extra photo was not stored beside the shipped picture.");
    }
    const page = await fetch(`${siteBase()}/tours/${created.id}`);
    const html = await page.text();
    if (!html.includes(photoUrl) || !html.includes(shipped)) {
      throw new Error("The public tour page does not show the extra photo and the shipped picture.");
    }
    const cleared = await officePost("/api/office/tours", tourForm(withPhoto, { gallery: [shipped], image: shipped, pdf: "" }), editorCookie);
    if (cleared.status !== 200 || !cleared.body.ok) {
      throw new Error(`The extra photo could not be removed: ${cleared.status} ${cleared.body.error ?? ""}`);
    }
    const [withoutPhoto] = await db.select().from(tours).where(eq(tours.id, created.id)).limit(1);
    if (!withoutPhoto || withoutPhoto.galleryImages.includes(photoUrl)) {
      throw new Error("Removing a photo left it on the tour.");
    }
    if ((await fetch(photoUrl)).ok) {
      throw new Error("Removing a photo left the office file in storage.");
    }
    if (!existsSync(shippedFile(shipped))) {
      throw new Error("Removing an office photo deleted a shipped picture.");
    }
    const pdfBytes = Buffer.from("%PDF-1.1\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n");
    const pdfFile = new File([new Uint8Array(pdfBytes)], "tour.pdf", { type: "application/pdf" });
    const pdfSave = await officePost("/api/office/tours", tourForm(withoutPhoto, { gallery: [shipped], pdfFile }), editorCookie);
    if (pdfSave.status !== 200 || !pdfSave.body.ok) {
      throw new Error(`An Editor PDF was not saved: ${pdfSave.status} ${pdfSave.body.error ?? ""}`);
    }
    const [withPdf] = await db.select().from(tours).where(eq(tours.id, created.id)).limit(1);
    if (!withPdf?.pdf || !officeMediaPath(withPdf.pdf)?.endsWith(".pdf")) {
      throw new Error("The tour PDF was not stored as a public media file.");
    }
    const pdfPage = await fetch(`${siteBase()}/tours/${created.id}`);
    if (!(await pdfPage.text()).includes(withPdf.pdf)) {
      throw new Error("The public tour page does not open the PDF.");
    }
    const replacement = new File([new Uint8Array(JPEG)], "main.jpg", { type: "image/jpeg" });
    const firstMain = await officePost("/api/office/tours", tourForm(withPdf, { gallery: [shipped], photo: replacement }), editorCookie);
    if (firstMain.status !== 200) throw new Error(`The main photo was not replaced: ${firstMain.body.error ?? firstMain.status}`);
    const [mainOne] = await db.select().from(tours).where(eq(tours.id, created.id)).limit(1);
    if (!mainOne?.image || !officeMediaPath(mainOne.image)) throw new Error("The replacement photo was not a public media file.");
    const secondMain = await officePost(
      "/api/office/tours",
      tourForm(mainOne, { gallery: [shipped], image: mainOne.image, photo: replacement }),
      editorCookie,
    );
    if (secondMain.status !== 200) throw new Error(`The main photo was not replaced again: ${secondMain.body.error ?? secondMain.status}`);
    const [mainTwo] = await db.select().from(tours).where(eq(tours.id, created.id)).limit(1);
    if (!mainTwo || mainTwo.image === mainOne.image) throw new Error("Replacing a photo kept the old file on the tour.");
    if ((await fetch(mainOne.image)).ok) throw new Error("Replacing a photo left the old office file in storage.");
    const deleteForm = new FormData();
    deleteForm.set("id", created.id);
    const editorDelete = await officePost("/api/office/tours/delete", deleteForm, editorCookie);
    if (editorDelete.status !== 200 || !editorDelete.body.ok) {
      throw new Error(`An Editor could not delete the media check tour: ${editorDelete.status} ${editorDelete.body.error ?? ""}`);
    }
    const [gone] = await db.select().from(tours).where(eq(tours.id, created.id)).limit(1);
    if (gone) throw new Error("Deleting the tour left the row.");
    if ((await fetch(mainTwo.image)).ok || (await fetch(withPdf.pdf)).ok) {
      throw new Error("Deleting the tour left an office file in storage.");
    }
    if (!existsSync(shippedFile(shipped))) {
      throw new Error("Deleting the tour deleted a shipped picture.");
    }
    await assertPlaceBlogReview(editorCookie, shipped);
  } finally {
    const form = new FormData();
    form.set("id", "office-media-check");
    await officePost("/api/office/tours/delete", form, ownerCookie);
    await db.delete(tours).where(eq(tours.id, "office-media-check"));
  }
}

function assertInferredLinks() {
  const known = new Set([
    "skardu-valley",
    "hunza-valley",
    "astor-valley-minimarg",
    "naran-kaghan-babusar-top",
    "kumrat-valley",
    "chitral-valley",
    "neelum-valley",
    "swat-valley-kalam-malam-jabba",
  ]);
  const cases: { tour: { name: string; region: string; location: string }; slugs: string[]; note: boolean }[] = [
    { tour: { name: "4 Days Trip to Skardu (By Air)", region: "Skardu Valley", location: "Skardu Valley" }, slugs: ["skardu-valley"], note: false },
    { tour: { name: "10 Days By Air Trip to Skardu & Hunza Valley", region: "Skardu & Hunza", location: "Deosai National Park" }, slugs: ["skardu-valley", "hunza-valley"], note: true },
    { tour: { name: "5 Days By Air Trip to Astor Minimarg and Skardu", region: "Minimarg Astor Valley", location: "Astor Minimarg" }, slugs: ["astor-valley-minimarg", "skardu-valley"], note: true },
    { tour: { name: "3 Days By Road Trip to Leepa Valley", region: "Neelum Valley Kashmir", location: "Leepa Valley" }, slugs: ["neelum-valley"], note: true },
    { tour: { name: "1 Day By Road Trip to Islamabad", region: "Islamabad", location: "Islamabad Capital Territory" }, slugs: [], note: true },
    { tour: { name: "3 Days Trip to Ratti Gali Lake", region: "Ratti Gali Lake", location: "Ratti Gali Lake" }, slugs: [], note: true },
    { tour: { name: "5 Days By Air Trip to Fairy Meadows + Skardu Valley", region: "Fairy Meadows Nanga Base Camp", location: "Fairy Meadows" }, slugs: [], note: true },
    { tour: { name: "1 Day By Road Trip to Murree", region: "Murree Patriata Galiyat", location: "Murree and Patriata" }, slugs: [], note: true },
  ];
  for (const item of cases) {
    const inferred = inferTourPlaceLinks(item.tour, known);
    if (inferred.slugs.join(",") !== item.slugs.join(",")) {
      throw new Error(`Links for ${item.tour.name} were ${inferred.slugs.join(",") || "none"}.`);
    }
    if (item.note && !inferred.note) throw new Error(`The note for ${item.tour.name} was missing.`);
    if (!item.note && inferred.note) throw new Error(`The note for ${item.tour.name} was unexpected.`);
  }
}

async function assertTourPlaceOffice(editorCookie: string, managerCookie: string, ownerCookie: string) {
  assertInferredLinks();
  const linked = await linkInferredTourPlaces();
  if (linked.unlinked.length === 0) throw new Error("The link pass linked every tour, including ones with no place page.");
  const [skardu] = await db.select().from(tours).where(eq(tours.region, "Skardu Valley")).limit(1);
  if (!skardu) throw new Error("A Skardu Valley tour was not loaded.");
  const skarduLinks = await db.select().from(tourPlaces).where(eq(tourPlaces.tourId, skardu.id));
  if (skarduLinks.length !== 1 || skarduLinks[0]?.placeSlug !== "skardu-valley") {
    throw new Error("A Skardu Valley tour was not linked to Skardu Valley.");
  }
  const [islamabad] = await db.select().from(tours).where(eq(tours.region, "Islamabad")).limit(1);
  if (!islamabad) throw new Error("An Islamabad tour was not loaded.");
  const islamabadLinks = await db.select().from(tourPlaces).where(eq(tourPlaces.tourId, islamabad.id));
  if (islamabadLinks.length !== 0) throw new Error("An Islamabad tour was linked without a place page.");
  const [combined] = await db.select().from(tours).where(eq(tours.region, "Skardu & Hunza")).limit(1);
  if (!combined) throw new Error("A Skardu and Hunza tour was not loaded.");
  const combinedLinks = await db.select().from(tourPlaces).where(eq(tourPlaces.tourId, combined.id));
  const combinedSlugs = combinedLinks.map((row) => row.placeSlug).sort();
  if (combinedSlugs.join(",") !== "hunza-valley,skardu-valley") {
    throw new Error("A Skardu and Hunza tour was not linked to both places.");
  }

  const placeSlug = "office-link-place";
  const otherSlug = "office-link-other";
  const shipped = skardu.image;
  await db.delete(tourPlaces).where(eq(tourPlaces.placeSlug, placeSlug));
  await db.delete(tourPlaces).where(eq(tourPlaces.placeSlug, otherSlug));
  await db.delete(places).where(eq(places.slug, placeSlug));
  await db.delete(places).where(eq(places.slug, otherSlug));
  await db.insert(places).values([
    {
      slug: placeSlug,
      title: "Link Valley",
      excerpt: "Link valley guide stays.",
      bannerImage: shipped,
      location: "Check",
      listingNumber: 99002,
      content: [{ heading: "Link Valley", body: "The place guide.", highlight: [], image: "" }],
    },
    {
      slug: otherSlug,
      title: "Other Valley",
      excerpt: "Other valley.",
      bannerImage: shipped,
      location: "Check",
      listingNumber: 99003,
      content: [],
    },
  ]);

  const createdNames = ["Office Link Check Tour", "Office Link Check Tour Amended"];
  const stale = await db.select({ id: tours.id }).from(tours).where(eq(tours.region, "Link Valley"));
  for (const row of stale) await db.delete(tours).where(eq(tours.id, row.id));
  try {
    // T-37c: the list links to the new-tour page, and each tour's editor offers Delete tour.
    const [anyTour] = await db.select({ id: tours.id }).from(tours).limit(1);
    if (!anyTour) throw new Error("No tour to open in the office.");
    for (const [who, cookie] of [["Editor", editorCookie], ["Owner", ownerCookie]] as const) {
      const list = await fetch(`${siteBase()}/office/tours`, { headers: { cookie } });
      const listHtml = await list.text();
      const editor = await fetch(`${siteBase()}/office/tours/${encodeURIComponent(anyTour.id)}`, { headers: { cookie } });
      const editorPageHtml = await editor.text();
      if (list.status !== 200 || !listHtml.includes('href="/office/tours/new"') || editor.status !== 200 || !editorPageHtml.includes("Delete tour")) {
        throw new Error(`The ${who} tours screens do not offer add and delete.`);
      }
    }
    const newPage = await fetch(`${siteBase()}/office/tours/new`, { headers: { cookie: editorCookie } });
    if (newPage.status !== 200 || !(await newPage.text()).includes("Add tour")) {
      throw new Error("The Editor could not open Add tour.");
    }

    const form = new FormData();
    form.set("name", "Office Link Check Tour");
    form.set("location", "Link Valley");
    form.set("region", "Link Valley");
    form.set("description", "Office link check.");
    form.set("duration", "2");
    form.set("image", shipped);
    form.set("pdf", "");
    form.set("transport", "By Road");
    form.set("itinerary", "[]");
    form.set("galleryImageSet", "1");
    form.set("placeSet", "1");
    form.append("placeSlug", placeSlug);
    const signedOut = await officePost("/api/office/tours/create", form, "");
    if (signedOut.status !== 401) throw new Error(`A tour create with no cookie returned ${signedOut.status}.`);
    const managerCreate = await officePost("/api/office/tours/create", form, managerCookie);
    if (managerCreate.status !== 403 || managerCreate.body.error !== "You cannot add a tour.") {
      throw new Error(`A Manager was not refused a new tour: ${managerCreate.status} ${managerCreate.body.error ?? ""}`);
    }
    const created = await officePost("/api/office/tours/create", form, editorCookie);
    if (created.status !== 200 || !created.body.ok || !created.body.href) {
      throw new Error(`An Editor could not add a tour: ${created.status} ${created.body.error ?? ""}`);
    }
    const [tour] = await db.select().from(tours).where(eq(tours.name, "Office Link Check Tour")).limit(1);
    if (!tour || tour.basePrice !== 0 || tour.region !== "Link Valley" || tour.location !== "Link Valley") {
      throw new Error("The new tour was not stored.");
    }
    const tourLinks = await db.select().from(tourPlaces).where(eq(tourPlaces.tourId, tour.id));
    if (tourLinks.length !== 1 || tourLinks[0]?.placeSlug !== placeSlug) throw new Error("The new tour was not linked to its place.");

    const tourPage = await fetch(`${siteBase()}/tours/${encodeURIComponent(tour.id)}`);
    const tourHtml = await tourPage.text();
    if (!tourPage.ok || !tourHtml.includes("Office Link Check Tour") || !tourHtml.includes(`/destinations/${placeSlug}`) || !tourHtml.includes("Link Valley")) {
      throw new Error("The public tour page does not show the linked place.");
    }
    const placePage = await fetch(`${siteBase()}/destinations/${placeSlug}`);
    const placeHtml = await placePage.text();
    if (!placePage.ok || !placeHtml.includes(`/tours/${tour.id}`) || !placeHtml.includes("Office Link Check Tour")) {
      throw new Error("The public place page does not show the linked tour.");
    }

    const placeForm = new FormData();
    placeForm.set("slug", placeSlug);
    placeForm.set("title", "Link Valley West");
    placeForm.set("excerpt", "Link valley guide stays.");
    placeForm.set("location", "Check");
    placeForm.set("bannerImage", shipped);
    placeForm.set("content", JSON.stringify([{ heading: "Link Valley", body: "The place guide.", highlight: [], image: "" }]));
    const renamed = await officePost("/api/office/places", placeForm, editorCookie);
    if (renamed.status !== 200 || !renamed.body.ok) {
      throw new Error(`The place title was not saved: ${renamed.status} ${renamed.body.error ?? ""}`);
    }
    const [moved] = await db.select().from(tours).where(eq(tours.id, tour.id)).limit(1);
    const [place] = await db.select().from(places).where(eq(places.slug, placeSlug)).limit(1);
    if (!moved || moved.location !== "Link Valley West" || moved.name !== "Office Link Check Tour" || moved.region !== "Link Valley") {
      throw new Error("Renaming the place did not update the single linked tour location.");
    }
    if (!place || place.excerpt !== "Link valley guide stays." || place.content[0]?.body !== "The place guide.") {
      throw new Error("Renaming the place changed the place guide.");
    }
    const renamedTourPage = await fetch(`${siteBase()}/tours/${encodeURIComponent(tour.id)}`);
    if (!(await renamedTourPage.text()).includes("Link Valley West")) {
      throw new Error("The public tour page does not show the new place title.");
    }

    const amend = new FormData();
    amend.set("id", tour.id);
    amend.set("name", "Office Link Check Tour Amended");
    amend.set("location", moved.location);
    amend.set("region", moved.region);
    amend.set("description", moved.description);
    amend.set("duration", String(moved.duration));
    amend.set("image", moved.image);
    amend.set("pdf", moved.pdf);
    amend.set("transport", moved.transport);
    amend.set("categories", moved.categories.join("\n"));
    amend.set("packageTypes", moved.packageTypes.join("\n"));
    amend.set("included", moved.included.join("\n"));
    amend.set("notIncluded", moved.notIncluded.join("\n"));
    amend.set("itinerary", "[]");
    amend.set("galleryImageSet", "1");
    amend.set("placeSet", "1");
    amend.append("placeSlug", placeSlug);
    amend.append("placeSlug", otherSlug);
    const amended = await officePost("/api/office/tours", amend, editorCookie);
    if (amended.status !== 200 || !amended.body.ok) {
      throw new Error(`An Editor could not amend the tour: ${amended.status} ${amended.body.error ?? ""}`);
    }
    const [placeAfterAmend] = await db.select().from(places).where(eq(places.slug, placeSlug)).limit(1);
    if (!placeAfterAmend || placeAfterAmend.title !== "Link Valley West" || placeAfterAmend.excerpt !== "Link valley guide stays.") {
      throw new Error("Amending the tour rewrote the place.");
    }
    const placeAfter = await fetch(`${siteBase()}/destinations/${placeSlug}`);
    if (!(await placeAfter.text()).includes("Office Link Check Tour Amended")) {
      throw new Error("The place page does not show the amended tour.");
    }

    const placeAgain = new FormData();
    placeAgain.set("slug", placeSlug);
    placeAgain.set("title", "Link Valley North");
    placeAgain.set("excerpt", "Link valley guide stays.");
    placeAgain.set("location", "Check");
    placeAgain.set("bannerImage", shipped);
    placeAgain.set("content", JSON.stringify([{ heading: "Link Valley", body: "The place guide.", highlight: [], image: "" }]));
    const secondRename = await officePost("/api/office/places", placeAgain, editorCookie);
    if (secondRename.status !== 200 || !secondRename.body.ok) {
      throw new Error(`The second place title was not saved: ${secondRename.status}`);
    }
    const [keptLocation] = await db.select().from(tours).where(eq(tours.id, tour.id)).limit(1);
    if (!keptLocation || keptLocation.location !== "Link Valley West") {
      throw new Error("A tour linked to two places took a single place title as its location.");
    }

    const managerDelete = await officePost("/api/office/tours/delete", deleteFormFor(tour.id), managerCookie);
    if (managerDelete.status !== 403 || managerDelete.body.error !== "You cannot delete a tour.") {
      throw new Error(`A Manager was not refused a tour delete: ${managerDelete.status} ${managerDelete.body.error ?? ""}`);
    }
    const editorDelete = await officePost("/api/office/tours/delete", deleteFormFor(tour.id), editorCookie);
    if (editorDelete.status !== 200 || !editorDelete.body.ok) {
      throw new Error(`An Editor could not delete the new tour: ${editorDelete.status} ${editorDelete.body.error ?? ""}`);
    }
    const [gone] = await db.select().from(tours).where(eq(tours.id, tour.id)).limit(1);
    if (gone) throw new Error("The deleted tour is still stored.");
    const leftover = await db.select().from(tourPlaces).where(eq(tourPlaces.tourId, tour.id));
    if (leftover.length !== 0) throw new Error("Deleting the tour left its place links.");
  } finally {
    for (const name of createdNames) {
      const rows = await db.select({ id: tours.id }).from(tours).where(eq(tours.name, name));
      for (const row of rows) await db.delete(tours).where(eq(tours.id, row.id));
    }
    const staleLeft = await db.select({ id: tours.id }).from(tours).where(eq(tours.region, "Link Valley"));
    for (const row of staleLeft) await db.delete(tours).where(eq(tours.id, row.id));
    await db.delete(places).where(eq(places.slug, placeSlug));
    await db.delete(places).where(eq(places.slug, otherSlug));
  }
}

function deleteFormFor(id: string) {
  const form = new FormData();
  form.set("id", id);
  return form;
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

    const contentPaths = ["/api/content/tours", "/api/content/places", "/api/content/posts", "/api/content/photos", "/api/content/reviews", "/api/content/slides", "/api/content/site"];
    for (const path of contentPaths) {
      const read = await officeGet(path, "");
      if (read.status !== 200 || !read.body.ok) throw new Error(`${path} returned ${read.status}.`);
    }
    const missingTour = await officeGet("/api/content/tours/no-such-tour", "");
    if (missingTour.status !== 404) throw new Error(`A missing tour returned ${missingTour.status}.`);
    const ratesSignedOut = await officeGet("/api/office/rates", "");
    if (ratesSignedOut.status !== 401) throw new Error(`A rates read with no cookie returned ${ratesSignedOut.status}.`);
    const editorRates = await officeGet("/api/office/rates", editorCookie);
    if (editorRates.status !== 403) throw new Error(`An Editor rates read returned ${editorRates.status}.`);
    const managerRates = await officeGet("/api/office/rates", managerCookie);
    if (managerRates.status !== 200 || !managerRates.text.includes('"hotels"')) {
      throw new Error(`A Manager rates read returned ${managerRates.status}.`);
    }
    const officePages: [string, string][] = [
      ["/office/tours", editorCookie],
      ["/office/places", editorCookie],
      ["/office/blog", editorCookie],
      ["/office/gallery", editorCookie],
      ["/office/reviews", editorCookie],
      ["/office/slides", editorCookie],
      ["/office/site", editorCookie],
      ["/office/rates", managerCookie],
    ];
    for (const [path, cookie] of officePages) {
      const page = await fetch(`${siteBase()}${path}`, { headers: { cookie }, redirect: "manual" });
      if (page.status !== 200) throw new Error(`The office page ${path} returned ${page.status}.`);
    }

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
    await assertOfficeMedia(editorCookie, managerCookie, ownerCookie);
    await assertTourPlaceOffice(editorCookie, managerCookie, ownerCookie);
    await assertOfficeShellLinks(editorCookie, managerCookie, ownerCookie);
    await assertSessionRequestCount(ownerCookie);
    await assertProfitMargin(editorCookie, managerCookie);
    await assertQuoteEditsThroughRoutes(managerCookie);
    await assertPricingRules(editorCookie, managerCookie);
    await assertDeskPricing(managerCookie);
    await assertStartCities(editorCookie, managerCookie);
    await assertDayPlans(editorCookie, managerCookie);
    await assertQuoteScreenV2(editorCookie, managerCookie);
    await assertBadRecordIds(editorCookie, managerCookie, ownerCookie, saved.body.id);
    await assertTourDeleteNotFound(editorCookie, managerCookie);
    await assertNulText(editorCookie);
    await assertDirectUploads(editorCookie, managerCookie);
    await assertRefusedSaveCleanup(editorCookie);
    await assertEmptyOfficeSave(editorCookie);
    await assertOldFileRemovedAfterSave(editorCookie);
    await assertDeleteRemovesRecordAndFile(editorCookie);
    await assertActivity(editorCookie, managerCookie, ownerCookie, { id: saved.body.id, phone, message });
    await assertProfileSettings(editorCookie, managerCookie, ownerCookie);
    await assertRoles(owner, editorCookie, managerCookie, ownerCookie, requestId);
    await assertRoleSameMomentSaves(ownerCookie);
    await assertParallelPhotoAdds(editorCookie);
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

// T-63 (BR-123 to BR-130, design section 17): roles the Owner manages.
const ROLE_CHECK_NAME = "T63 Sales check";
const ROLE_CHECK_RENAMED = "T63 Sales renamed";
const SALES_EMAIL = "step3-sales@travelwithmoeen.test";
const SALES_PASSWORD = "Step3Sales-pass1";

function roleForm(values: Record<string, string | number>, permissions: string[] = []) {
  const form = formOf(values);
  for (const permission of permissions) form.append("permission", permission);
  return form;
}

type RolesReply = { ok?: boolean; roles?: { id: number; name: string; isOwner: boolean; permissions: string[]; logins: number }[] };

async function rolesGet(cookie: string) {
  const response = await fetch(`${siteBase()}/api/office/roles`, { headers: cookie ? { cookie } : {} });
  return { status: response.status, body: (await response.json().catch(() => ({}))) as RolesReply };
}

async function storedPermissions(roleId: number) {
  const rows = await db.select({ permission: rolePermissions.permission }).from(rolePermissions).where(eq(rolePermissions.roleId, roleId));
  return rows.map((row) => row.permission).sort();
}

async function removeRoleCheckRows() {
  await db.delete(users).where(eq(users.email, SALES_EMAIL));
  await db.delete(loginFailures).where(eq(loginFailures.email, SALES_EMAIL));
  for (const name of [ROLE_CHECK_NAME, ROLE_CHECK_RENAMED]) {
    await db.delete(roles).where(eq(dsql`lower(${roles.name})`, name.toLowerCase()));
  }
}

async function assertRoles(owner: SessionUser, editorCookie: string, managerCookie: string, ownerCookie: string, requestId: string) {
  await removeRoleCheckRows();
  const [editorRole] = await db.select().from(roles).where(eq(dsql`lower(${roles.name})`, "editor")).limit(1);
  const [ownerRole] = await db.select().from(roles).where(eq(roles.isOwner, true)).limit(1);
  if (!editorRole || !ownerRole) throw new Error("The Editor or Owner role is missing.");
  const editorBefore = await storedPermissions(editorRole.id);
  if (editorBefore.join(" ") !== "content.edit requests.read tours.delete") {
    throw new Error(`The Editor role starts with ${editorBefore.join(", ")}, not its T-63 starting permissions.`);
  }
  const [shipped] = await db.select({ image: tours.image }).from(tours).where(like(tours.image, "/images/%")).limit(1);
  let tourId = "";
  try {
    // A Manager and an Editor are refused with 403, for a read and for every change, and nothing changes.
    for (const [who, cookie] of [["Manager", managerCookie], ["Editor", editorCookie]] as const) {
      const read = await rolesGet(cookie);
      if (read.status !== 403 || read.body.roles) throw new Error(`A ${who} roles read returned ${read.status}.`);
      const refused = [
        roleForm({ action: "add", name: ROLE_CHECK_NAME }, ["rates.edit"]),
        roleForm({ action: "update", roleId: editorRole.id, name: editorRole.name }, ["requests.read", "content.edit", "tours.delete", "rates.edit"]),
        roleForm({ action: "update", roleId: ownerRole.id, name: "Boss" }),
        roleForm({ action: "delete", roleId: editorRole.id }),
      ];
      for (const form of refused) {
        const result = await officePost("/api/office/roles", form, cookie);
        if (result.status !== 403) throw new Error(`A ${who} roles change returned ${result.status}.`);
      }
    }
    if ((await storedPermissions(editorRole.id)).join(" ") !== editorBefore.join(" ")) throw new Error("A refused roles change changed the Editor role.");
    const [added] = await db.select({ id: roles.id }).from(roles).where(eq(dsql`lower(${roles.name})`, ROLE_CHECK_NAME.toLowerCase()));
    if (added) throw new Error("A refused add left a role.");
    const signedOut = await officePost("/api/office/roles", roleForm({ action: "add", name: ROLE_CHECK_NAME }), "");
    if (signedOut.status !== 401) throw new Error(`A roles change with no session returned ${signedOut.status}.`);

    // The Owner is refused an unknown key, an Owner-only action as a key, a bad name, and any Owner role change.
    const ownerRefused: [string, FormData, string][] = [
      ["an unknown key", roleForm({ action: "add", name: ROLE_CHECK_NAME }, ["rates.edit", "rates.everything"]), "That permission does not exist."],
      ["an Owner-only action", roleForm({ action: "add", name: ROLE_CHECK_NAME }, ["users.manage"]), "That permission does not exist."],
      ["a one-letter name", roleForm({ action: "add", name: "S" }, ["rates.edit"]), "Use a role name of 2 to 40 characters."],
      ["a 41-letter name", roleForm({ action: "add", name: "S".repeat(41) }, ["rates.edit"]), "Use a role name of 2 to 40 characters."],
      ["a taken name", roleForm({ action: "add", name: " MANAGER " }, ["rates.edit"]), "A role with that name already exists."],
      ["renaming Owner", roleForm({ action: "update", roleId: ownerRole.id, name: "Boss" }), "The Owner role cannot be changed."],
      ["changing Owner", roleForm({ action: "update", roleId: ownerRole.id, name: ownerRole.name }, ["rates.edit"]), "The Owner role cannot be changed."],
      ["deleting Owner", roleForm({ action: "delete", roleId: ownerRole.id }), "The Owner role cannot be changed."],
      ["no action", roleForm({ name: ROLE_CHECK_NAME }), "Choose add, update, or delete."],
    ];
    for (const [what, form, error] of ownerRefused) {
      const result = await officePost("/api/office/roles", form, ownerCookie);
      if (result.status !== 400 || result.body.error !== error) throw new Error(`An Owner roles save with ${what} returned ${result.status}: ${result.body.error}.`);
    }
    const [ownerNow] = await db.select().from(roles).where(eq(roles.id, ownerRole.id));
    if (ownerNow?.name !== ownerRole.name || !ownerNow.isOwner || (await storedPermissions(ownerRole.id)).length) throw new Error("A refused save changed the Owner role.");

    // A custom role with only rates.edit.
    const addedRole = await officePost("/api/office/roles", roleForm({ action: "add", name: ROLE_CHECK_NAME }, ["rates.edit"]), ownerCookie);
    if (addedRole.status !== 200 || !addedRole.body.ok) throw new Error(`The Owner could not add a role: ${addedRole.body.error ?? addedRole.status}.`);
    const [sales] = await db.select().from(roles).where(eq(roles.name, ROLE_CHECK_NAME));
    if (!sales || sales.isOwner || (await storedPermissions(sales.id)).join(" ") !== "rates.edit") throw new Error("The added role does not have only rates.edit.");
    const listed = await rolesGet(ownerCookie);
    const row = listed.body.roles?.find((item) => item.id === sales.id);
    if (listed.status !== 200 || listed.body.roles?.[0]?.isOwner !== true || listed.body.roles[0].permissions.length !== 5 || row?.permissions.join(" ") !== "rates.edit" || row.logins !== 0) {
      throw new Error("The roles list does not show the Owner first with every permission, and the new role with rates.edit and no logins.");
    }

    const created = await createUserAs(owner, { email: SALES_EMAIL, password: SALES_PASSWORD, role: String(sales.id) });
    if (!created.ok) throw new Error(`The Owner could not give the new role to a login: ${created.error}.`);
    const salesLogin = await signIn(SALES_EMAIL, SALES_PASSWORD);
    const salesCookie = sessionCookie(salesLogin.response);
    if (!salesCookie) throw new Error("The custom-role login did not get a session.");
    const [season] = await db.select({ percent: seasons.percent }).from(seasons).limit(1);
    const rateSave = await officePost("/api/office/rates", marginForm(String(season?.percent ?? 20)), salesCookie);
    if (rateSave.status !== 200 || !rateSave.body.ok) throw new Error(`The rates.edit role could not save a rate: ${rateSave.body.error ?? rateSave.status}.`);
    const [anyTour] = await db.select().from(tours).limit(1);
    if (!anyTour) throw new Error("There is no tour for the role check.");
    const salesTour = await officePost("/api/office/tours", tourForm(anyTour), salesCookie);
    if (salesTour.status !== 403) throw new Error(`The rates.edit role tour save returned ${salesTour.status}.`);
    const statusForm = formOf({ id: requestId, status: "closed" });
    const salesStatus = await officePost("/api/office/requests/status", statusForm, salesCookie);
    if (salesStatus.status !== 403) throw new Error(`The rates.edit role request status change returned ${salesStatus.status}.`);
    const salesRequests = await officeGet("/api/office/requests", salesCookie);
    if (salesRequests.status !== 403) throw new Error(`The rates.edit role request list returned ${salesRequests.status}.`);
    const salesHome = await officePage("/office", salesCookie);
    if (salesHome.status !== 200 || sidebarLinks(salesHome.html).join(" ") !== "/office /office/rates") {
      throw new Error(`The rates.edit role sidebar shows ${sidebarLinks(salesHome.html).join(" ")}.`);
    }
    if (salesHome.html.includes("Latest requests") || salesHome.html.includes("New requests")) throw new Error("The rates.edit role dashboard shows guest requests.");
    const salesInbox = await officePage("/office/requests", salesCookie);
    if (salesInbox.status < 300 || salesInbox.status >= 400) throw new Error(`The rates.edit role requests page returned ${salesInbox.status}.`);
    const salesFeed = await activityGet("?limit=100", salesCookie);
    if (salesFeed.status !== 200 || salesFeed.rows.some((item) => item.area !== "rates")) throw new Error("The rates.edit role reads activity outside rates.");

    // A role with a login is not deleted.
    const busyDelete = await officePost("/api/office/roles", roleForm({ action: "delete", roleId: sales.id }), ownerCookie);
    if (busyDelete.status !== 400 || busyDelete.body.error !== "Move these logins to another role first.") {
      throw new Error(`Deleting a role with a login returned ${busyDelete.status}: ${busyDelete.body.error}.`);
    }

    // Removing content.edit from Editor refuses that Editor's next tour save, with no sign-out.
    if (!shipped) throw new Error("No tour has a shipped photo for the T-63 tour.");
    const addForm = newTourForm("T-63 Valley", {});
    addForm.set("name", "T-63 check tour");
    addForm.set("image", shipped.image);
    const tourAdded = await officePost("/api/office/tours/create", addForm, editorCookie);
    if (tourAdded.status !== 200 || !tourAdded.body.ok) throw new Error(`The T-63 tour was not added: ${tourAdded.body.error ?? tourAdded.status}.`);
    const [checkTour] = await db.select().from(tours).where(eq(tours.location, "T-63 Valley")).limit(1);
    if (!checkTour) throw new Error("The T-63 tour is not in the database.");
    tourId = checkTour.id;
    const before = await officePost("/api/office/tours", tourForm(checkTour), editorCookie);
    if (before.status !== 200 || !before.body.ok) throw new Error(`The Editor could not save the T-63 tour: ${before.body.error ?? before.status}.`);
    const narrowed = await officePost("/api/office/roles", roleForm({ action: "update", roleId: editorRole.id, name: editorRole.name }, ["requests.read", "tours.delete"]), ownerCookie);
    if (narrowed.status !== 200 || !narrowed.body.ok) throw new Error(`The Owner could not take content.edit from Editor: ${narrowed.body.error ?? narrowed.status}.`);
    const after = await officePost("/api/office/tours", tourForm(checkTour), editorCookie);
    if (after.status !== 403) throw new Error(`The Editor's next tour save after losing content.edit returned ${after.status}.`);
    const editorSession = await officeGet("/api/office/session", editorCookie);
    const view = editorSession.body as { ok?: boolean; canEditContent?: boolean; canDeleteTour?: boolean };
    if (editorSession.status !== 200 || !view.ok || view.canEditContent !== false || view.canDeleteTour !== true) {
      throw new Error("The Editor was signed out, or the session still shows content.edit.");
    }
    const editorHome = await officePage("/office", editorCookie);
    if (editorHome.status !== 200 || sidebarLinks(editorHome.html).join(" ") !== "/office /office/requests") {
      throw new Error(`After losing content.edit the Editor sidebar shows ${sidebarLinks(editorHome.html).join(" ")}.`);
    }
    const editorTours = await officePage("/office/tours", editorCookie);
    if (editorTours.status < 300 || editorTours.status >= 400) throw new Error(`After losing content.edit the Editor tours page returned ${editorTours.status}.`);
    const restored = await officePost("/api/office/roles", roleForm({ action: "update", roleId: editorRole.id, name: editorRole.name }, editorBefore), ownerCookie);
    if (restored.status !== 200 || (await storedPermissions(editorRole.id)).join(" ") !== editorBefore.join(" ")) throw new Error("The Editor permissions were not put back.");
    const again = await officePost("/api/office/tours", tourForm(checkTour), editorCookie);
    if (again.status !== 200 || !again.body.ok) throw new Error(`With content.edit back, the Editor tour save returned ${again.status}.`);

    // Each change writes a roles row that only the Owner reads, with the keys added and removed.
    const ownerFeed = await activityGet("?limit=100", ownerCookie);
    const texts = ownerFeed.rows.filter((item) => item.kind === "role" && item.area === "roles").map((item) => item.text);
    const wanted = [
      `Added the role ${ROLE_CHECK_NAME} with rates.edit`,
      `Changed the role ${editorRole.name}: removed content.edit`,
      `Changed the role ${editorRole.name}: added content.edit`,
    ];
    for (const text of wanted) if (!texts.includes(text)) throw new Error(`The Owner activity has no row "${text}".`);
    for (const [who, cookie] of [["Manager", managerCookie], ["Editor", editorCookie], ["rates.edit role", salesCookie]] as const) {
      const feed = await activityGet("?limit=100", cookie);
      if (feed.rows.some((item) => item.area === "roles")) throw new Error(`The ${who} reads roles activity.`);
      const saved = await activityGet("?kind=role", cookie);
      if (saved.status !== 403) throw new Error(`The ${who} roles Saved by read returned ${saved.status}.`);
    }

    // Rename, then delete once it has no login. Its permissions go with it.
    const removed = await removeUserAs(owner, (await authenticate(SALES_EMAIL, SALES_PASSWORD))?.id ?? null);
    if (!removed.ok) throw new Error("The custom-role login was not removed.");
    const renamed = await officePost("/api/office/roles", roleForm({ action: "update", roleId: sales.id, name: ROLE_CHECK_RENAMED }, ["rates.edit", "requests.read"]), ownerCookie);
    if (renamed.status !== 200 || !renamed.body.ok) throw new Error(`The Owner could not rename the role: ${renamed.body.error ?? renamed.status}.`);
    const [renamedRow] = await db.select().from(roles).where(eq(roles.id, sales.id));
    if (renamedRow?.name !== ROLE_CHECK_RENAMED || (await storedPermissions(sales.id)).join(" ") !== "rates.edit requests.read") throw new Error("The rename did not save the name and permissions.");
    const deleted = await officePost("/api/office/roles", roleForm({ action: "delete", roleId: sales.id }), ownerCookie);
    if (deleted.status !== 200 || !deleted.body.ok) throw new Error(`Deleting an empty role returned ${deleted.status}: ${deleted.body.error}.`);
    const [gone] = await db.select().from(roles).where(eq(roles.id, sales.id));
    if (gone || (await storedPermissions(sales.id)).length) throw new Error("The deleted role or its permissions are still stored.");
    const finalFeed = await activityGet("?limit=100", ownerCookie);
    const finalTexts = finalFeed.rows.filter((item) => item.kind === "role").map((item) => item.text);
    for (const text of [`Renamed the role ${ROLE_CHECK_NAME} to ${ROLE_CHECK_RENAMED}: added requests.read`, `Deleted the role ${ROLE_CHECK_RENAMED}`]) {
      if (!finalTexts.includes(text)) throw new Error(`The Owner activity has no row "${text}".`);
    }
  } finally {
    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, editorRole.id));
    await db.insert(rolePermissions).values(editorBefore.map((permission) => ({ roleId: editorRole.id, permission })));
    await removeRoleCheckRows();
    if (tourId) await db.delete(tours).where(eq(tours.id, tourId));
  }
}

// T-63 review: two saves of one role at the same moment both apply, one after the other, with no
// false "name taken" message. Each activity row names the keys that save really added and removed.
const SAME_MOMENT_ROLE = "T63 Same moment";

// The keys an activity row says were added and removed, such as "Changed the role X: added a, b; removed c".
function roleChange(text: string) {
  const detail = text.slice(text.indexOf(": ") + 2);
  const part = (word: string) => detail.split("; ").find((item) => item.startsWith(`${word} `))?.slice(word.length + 1).split(", ") ?? [];
  return { added: part("added"), removed: part("removed") };
}

async function assertRoleSameMomentSaves(ownerCookie: string) {
  // The role and its activity rows are removed before and after, by name and by the id it had.
  let roleId = 0;
  const removeRole = async () => {
    const [left] = await db.select({ id: roles.id }).from(roles).where(eq(dsql`lower(${roles.name})`, SAME_MOMENT_ROLE.toLowerCase()));
    for (const id of [left?.id, roleId].filter((value): value is number => Boolean(value))) {
      await db.delete(activity).where(and(eq(activity.kind, "role"), eq(activity.recordId, String(id))));
      await db.delete(roles).where(eq(roles.id, id));
    }
  };
  await removeRole();
  try {
    const added = await officePost("/api/office/roles", roleForm({ action: "add", name: SAME_MOMENT_ROLE }, ["rates.edit"]), ownerCookie);
    if (added.status !== 200) throw new Error(`The same-moment role was not added: ${added.body.error ?? added.status}.`);
    const [role] = await db.select({ id: roles.id }).from(roles).where(eq(roles.name, SAME_MOMENT_ROLE));
    if (!role) throw new Error("The same-moment role is not stored.");
    roleId = role.id;
    // Sets with no key in common could merge. Sets that share rates.edit collide on the
    // role_permissions key, which the review saw as "A role with that name already exists."
    const apart = [["rates.edit", "requests.read"], ["content.edit"]];
    const sharing = [["rates.edit", "requests.read"], ["rates.edit", "content.edit"]];
    for (let pair = 0; pair < 16; pair += 1) {
      const sets = pair % 2 === 0 ? apart : sharing;
      const replies = await Promise.all(sets.map((permissions) => officePost("/api/office/roles", roleForm({ action: "update", roleId: role.id, name: SAME_MOMENT_ROLE }, permissions), ownerCookie)));
      for (const reply of replies) {
        if (reply.status !== 200 || !reply.body.ok) throw new Error(`Two saves of one role at the same moment: one returned ${reply.status}: ${reply.body.error}.`);
      }
      const stored = (await storedPermissions(role.id)).join(" ");
      if (!sets.some((permissions) => [...permissions].sort().join(" ") === stored)) throw new Error(`After two saves at the same moment the role has ${stored}.`);
    }
    // Replaying the activity rows from the starting keys gives the stored keys, and no row adds a
    // key that was already there or removes one that was not.
    const rows = await db.select({ text: activity.text }).from(activity).where(and(eq(activity.kind, "role"), eq(activity.recordId, String(role.id)))).orderBy(activity.id);
    let state = new Set<string>();
    for (const [index, row] of rows.entries()) {
      if (index === 0) {
        if (row.text !== `Added the role ${SAME_MOMENT_ROLE} with rates.edit`) throw new Error(`The first activity row is "${row.text}".`);
        state = new Set(["rates.edit"]);
        continue;
      }
      const change = roleChange(row.text);
      if (change.added.some((key) => state.has(key)) || change.removed.some((key) => !state.has(key))) {
        throw new Error(`The activity row "${row.text}" does not match the keys the role had.`);
      }
      for (const key of change.removed) state.delete(key);
      for (const key of change.added) state.add(key);
    }
    if ([...state].sort().join(" ") !== (await storedPermissions(role.id)).join(" ")) throw new Error("The role activity rows do not add up to the stored keys.");
    if (rows.length < 17) throw new Error(`Thirty-two saves wrote only ${rows.length - 1} change rows.`);

    // An edit and a delete at the same moment: one runs after the other, never a 500 or a false message.
    const [edit, gone] = await Promise.all([
      officePost("/api/office/roles", roleForm({ action: "update", roleId: role.id, name: SAME_MOMENT_ROLE }, ["tours.delete"]), ownerCookie),
      officePost("/api/office/roles", roleForm({ action: "delete", roleId: role.id }), ownerCookie),
    ]);
    const editFine = edit.status === 200 || (edit.status === 400 && edit.body.error === "That role was not found.");
    if (gone.status !== 200 || !editFine) throw new Error(`An edit and a delete at the same moment returned ${edit.status} (${edit.body.error ?? "saved"}) and ${gone.status} (${gone.body.error ?? "deleted"}).`);
    const [after] = await db.select({ id: roles.id }).from(roles).where(eq(roles.id, role.id));
    if (after || (await storedPermissions(role.id)).length) throw new Error("After an edit and a delete at the same moment the role is still stored.");
  } finally {
    await removeRole();
  }
}

const OFFICE_LINKS_BY_ROLE = {
  owner: [
    "/office",
    "/office/requests",
    "/office/rates",
    "/office/tours",
    "/office/places",
    "/office/blog",
    "/office/gallery",
    "/office/reviews",
    "/office/slides",
    "/office/site",
    "/office/users",
    // T-63: the Roles page, next to Users (BR-123).
    "/office/roles",
    "/office/backup",
  ],
  manager: ["/office", "/office/requests", "/office/rates"],
  editor: [
    "/office",
    "/office/requests",
    "/office/tours",
    "/office/places",
    "/office/blog",
    "/office/gallery",
    "/office/reviews",
    "/office/slides",
    "/office/site",
  ],
};

function sidebarLinks(html: string) {
  const links: string[] = [];
  for (const tag of html.match(/<a [^>]*class="nav-item"[^>]*>/g) ?? []) {
    const href = /href="([^"]+)"/.exec(tag)?.[1];
    if (href) links.push(href);
  }
  return links;
}

const SKARDU_QUOTE = {
  place: "Skardu Valley",
  startCity: "Islamabad",
  mode: "road",
  days: 5,
  adults: 2,
  children: 0,
  lapInfants: 0,
  seatInfants: 0,
  grade: "Deluxe",
  vehicle: "Gli Car",
  guide: false,
  meals: false,
};

// A Manager's quote sends no margin, so it uses the saved one and shows the subtotal and the profit.
// A guest's quote shows only the total.
async function skarduQuote(cookie: string) {
  const response = await fetch(`${siteBase()}/api/quote`, {
    method: "POST",
    headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
    body: JSON.stringify(SKARDU_QUOTE),
  });
  return (await response.json()) as { ok?: boolean; subtotal?: number; profit?: number; total?: number; seasonPercent?: number };
}

type QuoteReply = {
  ok?: boolean;
  error?: string;
  total?: number;
  subtotal?: number;
  profit?: number;
  averageNightly?: number;
  lines?: { label: string; amount: number; working: string }[];
  nights?: { night: number; rate: number }[];
  days?: { day: number; rent: number; fuel: number; toll: number; cleared: boolean }[];
};

async function quoteReply(extra: Record<string, unknown>, cookie: string) {
  const response = await fetch(`${siteBase()}/api/quote`, {
    method: "POST",
    headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
    body: JSON.stringify({ ...SKARDU_QUOTE, ...extra }),
  });
  return (await response.json()) as QuoteReply;
}

// T-37g: the Quote screen prices through POST /api/quote and saves through POST /api/office/rates.
// Through those routes, a night-two edit changes only that night and the average, clearing one day
// removes only that day's rent, and a guest still sees one total.
async function assertQuoteEditsThroughRoutes(managerCookie: string) {
  const base = await quoteReply({}, managerCookie);
  if (!base.ok || !base.nights || !base.days || base.nights.length < 2) throw new Error("The T-37g base quote has no nights.");

  const night = await quoteReply({ nightEdits: [{ night: 2, rate: 20000 }] }, managerCookie);
  const otherNights = night.nights?.filter((row) => row.night !== 2) ?? [];
  const expectedAverage = (base.nights.reduce((sum, row) => sum + row.rate, 0) - base.nights[1].rate + 20000) / base.nights.length;
  if (
    !night.ok ||
    night.nights?.[1]?.rate !== 20000 ||
    otherNights.some((row) => row.rate !== base.nights?.find((b) => b.night === row.night)?.rate) ||
    night.averageNightly !== expectedAverage
  ) {
    throw new Error("Through /api/quote, a night-two edit changed another night or not the average.");
  }

  const cleared = await quoteReply({ dayEdits: [{ day: 1, cleared: true }] }, managerCookie);
  const dayOne = base.days[0];
  const otherDays = cleared.days?.filter((row) => row.day !== 1) ?? [];
  if (
    !cleared.ok ||
    !cleared.days?.[0]?.cleared ||
    cleared.days[0].rent !== 0 ||
    otherDays.some((row) => row.rent !== base.days?.find((b) => b.day === row.day)?.rent) ||
    cleared.days[0].fuel !== 0 ||
    // The toll is counted once for the trip, so clearing a day removes its rent and fuel.
    (base.subtotal ?? 0) - (cleared.subtotal ?? 0) !== dayOne.rent + dayOne.fuel
  ) {
    throw new Error("Through /api/quote, clearing day one did not remove only that day's rent.");
  }

  const guest = await quoteReply({ nightEdits: [{ night: 2, rate: 20000 }] }, "");
  if (!guest.ok || guest.total !== base.total || guest.lines !== undefined || guest.profit !== undefined || guest.nights !== undefined) {
    throw new Error("A guest quote did not show one total only.");
  }

  const [before] = await db.select({ value: max(quotes.id) }).from(quotes);
  const form = new FormData();
  for (const [key, value] of Object.entries({ kind: "quote", ...SKARDU_QUOTE, night: "2", nightRate: "20000", seasonPercent: "" })) {
    if (typeof value === "boolean") {
      if (value) form.set(key, "on");
    } else {
      form.set(key, String(value));
    }
  }
  const saved = await officePost("/api/office/rates", form, managerCookie);
  const [afterRow] = await db.select({ value: max(quotes.id) }).from(quotes);
  const savedId = afterRow?.value && afterRow.value !== before?.value ? afterRow.value : null;
  try {
    if (saved.status !== 200 || !saved.body.ok || !savedId) throw new Error(`The office quote save was refused: ${saved.body.error ?? saved.status}.`);
    const nights = await db.select().from(quoteNights).where(eq(quoteNights.quoteId, savedId));
    const two = nights.find((row) => row.night === 2);
    if (two?.rate !== 20000 || nights.some((row) => row.night !== 2 && row.rate !== base.nights?.find((b) => b.night === row.night)?.rate)) {
      throw new Error("The saved quote did not keep the night-two edit alone.");
    }
  } finally {
    if (savedId) {
      await db.delete(quoteNights).where(eq(quoteNights.quoteId, savedId));
      await db.delete(quoteDays).where(eq(quoteDays.quoteId, savedId));
      await db.delete(quoteExtras).where(eq(quoteExtras.quoteId, savedId));
      await db.delete(quotes).where(eq(quotes.id, savedId));
    }
  }
}

function marginForm(percent: string) {
  const form = new FormData();
  form.set("kind", "season");
  form.set("percent", percent);
  return form;
}

// T-37f: the margin is one whole percent from 0 to 100, saved by the Owner or a Manager only.
function formOf(values: Record<string, string | number>) {
  const form = new FormData();
  for (const [key, value] of Object.entries(values)) form.set(key, String(value));
  return form;
}

// T-52: an office save with a bad record id, or a well-formed id with no record (999999), returns
// 400 with its not-found message and changes nothing. A good id still saves. A role that may not
// make the save gets 403 for any id.
async function assertBadRecordIds(editorCookie: string, managerCookie: string, ownerCookie: string, requestId: number) {
  const badIds = ["abc", "1.5", "0", "-1", "", "2147483648", "999999"];
  const [hotel] = await db.select().from(hotelRates).limit(1);
  const [vehicle] = await db.select().from(vehicleRates).limit(1);
  const [jeep] = await db.select().from(jeepLines).limit(1);
  const [meal] = await db.select().from(mealRates).limit(1);
  if (!hotel || !vehicle || !jeep || !meal) throw new Error("The T-52 check needs a hotel rate, a vehicle rate, a jeep line, and a meal rate.");
  const hotelValues = { kind: "hotel", twin: hotel.twin, triple: hotel.triple, hotelName: hotel.hotelName, ...(hotel.offered ? { offered: "on" } : {}) };
  const vehicleValues = { kind: "vehicle", rent: vehicle.rent, fuel: vehicle.fuel, toll: vehicle.toll, seats: vehicle.seats, ...(vehicle.live ? { live: "on" } : {}) };
  const jeepValues = { kind: "jeep", amount: jeep.amount, ...(jeep.live ? { live: "on" } : {}) };
  const mealValues = { kind: "meal_rate", dinner: meal.dinner, lunch: meal.lunch };
  const saves: { what: string; path: string; field: string; values: Record<string, string | number>; cookie: string; error: string }[] = [
    { what: "hotel rate save", path: "/api/office/rates", field: "id", values: hotelValues, cookie: managerCookie, error: "That hotel rate was not found." },
    { what: "vehicle rate save", path: "/api/office/rates", field: "id", values: vehicleValues, cookie: managerCookie, error: "That vehicle rate was not found." },
    { what: "jeep line save", path: "/api/office/rates", field: "id", values: jeepValues, cookie: managerCookie, error: "That jeep line was not found." },
    { what: "meal rate save", path: "/api/office/rates", field: "id", values: mealValues, cookie: managerCookie, error: "That meal rate was not found." },
    { what: "photo delete", path: "/api/office/photos/delete", field: "id", values: {}, cookie: editorCookie, error: "That photo was not found." },
    { what: "review delete", path: "/api/office/reviews/delete", field: "id", values: {}, cookie: editorCookie, error: "That review was not found." },
    { what: "slide delete", path: "/api/office/slides/delete", field: "id", values: {}, cookie: editorCookie, error: "That slide was not found." },
    { what: "login removal", path: "/api/office/users/remove", field: "userId", values: {}, cookie: ownerCookie, error: "That login was not found." },
    { what: "role change", path: "/api/office/users/role", field: "userId", values: { role: "manager" }, cookie: ownerCookie, error: "That login was not found." },
    { what: "request status", path: "/api/office/requests/status", field: "id", values: { status: "closed" }, cookie: managerCookie, error: "That request was not found." },
    { what: "request delete", path: "/api/office/requests/delete", field: "id", values: {}, cookie: ownerCookie, error: "That request was not found." },
  ];
  const snapshot = async () =>
    JSON.stringify([
      await db.select().from(hotelRates).orderBy(hotelRates.id),
      await db.select().from(vehicleRates).orderBy(vehicleRates.id),
      await db.select().from(jeepLines).orderBy(jeepLines.id),
      await db.select().from(mealRates).orderBy(mealRates.id),
      await db.select().from(photos).orderBy(photos.id),
      await db.select().from(reviews).orderBy(reviews.id),
      await db.select().from(slides).orderBy(slides.id),
      await db.select({ id: users.id, email: users.email, roleId: users.roleId }).from(users).orderBy(users.id),
      await db.select().from(guestRequests).orderBy(guestRequests.id),
      await activityCount(),
    ]);
  for (const table of [hotelRates, vehicleRates, jeepLines, mealRates, photos, reviews, slides, users, guestRequests]) {
    const [taken] = await db.select({ id: table.id }).from(table).where(eq(table.id, 999999)).limit(1);
    if (taken) throw new Error("A record has id 999999, so the missing-id case cannot run.");
  }
  const before = await snapshot();
  for (const save of saves) {
    for (const badId of badIds) {
      const reply = await officePost(save.path, formOf({ ...save.values, [save.field]: badId }), save.cookie);
      if (reply.status !== 400 || reply.body.error !== save.error) {
        throw new Error(`A ${save.what} with id "${badId}" returned ${reply.status} (${reply.body.error ?? ""}), not 400 with "${save.error}".`);
      }
    }
  }
  // The request saves check the role before the id, like the others.
  for (const [what, pathname, values] of [
    ["request status", "/api/office/requests/status", { status: "closed" }],
    ["request delete", "/api/office/requests/delete", {}],
  ] as const) {
    const reply = await officePost(pathname, formOf({ ...values, id: "abc" }), editorCookie);
    if (reply.status !== 403) throw new Error(`An Editor's ${what} with id "abc" returned ${reply.status}, not 403.`);
  }
  if ((await snapshot()) !== before) throw new Error("A save with a bad record id changed something.");

  // A good id still saves.
  const good: [string, string, FormData, string][] = [
    ["hotel rate save", "/api/office/rates", formOf({ ...hotelValues, id: hotel.id }), managerCookie],
    ["vehicle rate save", "/api/office/rates", formOf({ ...vehicleValues, id: vehicle.id }), managerCookie],
    ["jeep line save", "/api/office/rates", formOf({ ...jeepValues, id: jeep.id }), managerCookie],
    ["meal rate save", "/api/office/rates", formOf({ ...mealValues, id: meal.id }), managerCookie],
    ["request status", "/api/office/requests/status", formOf({ id: requestId, status: "in_progress" }), managerCookie],
  ];
  const [manager] = await db.select({ id: users.id }).from(users).where(eq(users.email, MANAGER_EMAIL)).limit(1);
  if (manager) good.push(["role change", "/api/office/users/role", formOf({ userId: manager.id, role: "manager" }), ownerCookie]);
  for (const [what, pathname, form, cookie] of good) {
    const reply = await officePost(pathname, form, cookie);
    if (reply.status !== 200 || !reply.body.ok) throw new Error(`A ${what} with a good id returned ${reply.status} (${reply.body.error ?? ""}).`);
  }
  const [shipped] = await db.select({ image: tours.image }).from(tours).where(like(tours.image, "/images/%")).limit(1);
  const [photo] = await db.insert(photos).values({ src: shipped?.image ?? "/images/x.jpg", alt: "T-52 check photo", category: "private" }).returning({ id: photos.id });
  const [review] = await db.insert(reviews).values({ name: "T-52 check review", avatar: "", location: "", text: "x", rating: 5 }).returning({ id: reviews.id });
  const [slide] = await db.insert(slides).values({ image: shipped?.image ?? "/images/x.jpg", title: "T-52 check slide", rotation: 0, sortOrder: 999 }).returning({ id: slides.id });
  const loginAdded = await officePost("/api/office/users", formOf({ email: "t52-check@travelwithmoeen.test", password: "T52Check-pass1", role: "editor" }), ownerCookie);
  const [login] = await db.select({ id: users.id }).from(users).where(eq(users.email, "t52-check@travelwithmoeen.test")).limit(1);
  try {
    if (loginAdded.status !== 200 || !login) throw new Error("The T-52 check login was not added.");
    const deletes: [string, string, FormData, string, () => Promise<unknown[]>][] = [
      ["photo delete", "/api/office/photos/delete", formOf({ id: photo.id }), editorCookie, () => db.select().from(photos).where(eq(photos.id, photo.id))],
      ["review delete", "/api/office/reviews/delete", formOf({ id: review.id }), editorCookie, () => db.select().from(reviews).where(eq(reviews.id, review.id))],
      ["slide delete", "/api/office/slides/delete", formOf({ id: slide.id }), editorCookie, () => db.select().from(slides).where(eq(slides.id, slide.id))],
      ["login removal", "/api/office/users/remove", formOf({ userId: login.id }), ownerCookie, () => db.select().from(users).where(eq(users.id, login.id))],
    ];
    for (const [what, pathname, form, cookie, left] of deletes) {
      const reply = await officePost(pathname, form, cookie);
      if (reply.status !== 200 || !reply.body.ok || (await left()).length) throw new Error(`A ${what} with a good id did not delete it (${reply.status}).`);
    }
  } finally {
    await db.delete(photos).where(eq(photos.alt, "T-52 check photo"));
    await db.delete(reviews).where(eq(reviews.name, "T-52 check review"));
    await db.delete(slides).where(eq(slides.title, "T-52 check slide"));
    await db.delete(users).where(eq(users.email, "t52-check@travelwithmoeen.test"));
  }
}

// T-51 (design section 14): an office file goes from the browser straight to the media store with
// a short-lived permission, and the save checks the stored file before the record changes.
async function assertDirectUploads(editorCookie: string, managerCookie: string) {
  const uploadsPath = `${siteBase()}/api/office/uploads`;
  const permission = async (pathname: string, kind: string, cookie: string) => {
    const response = await fetch(uploadsPath, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(cookie ? { cookie } : {}) },
      body: JSON.stringify({ type: "blob.generate-client-token", payload: { pathname, clientPayload: JSON.stringify({ kind }), multipart: false } }),
    });
    return { status: response.status, body: (await response.json().catch(() => ({}))) as { clientToken?: string; error?: string } };
  };
  const sent: string[] = [];
  const direct = async (bytes: Uint8Array, extension: string, kind: string, contentType: string) => {
    const stored = await upload(`media/upload.${extension}`, new Blob([new Uint8Array(bytes)], { type: contentType }), {
      access: "public",
      handleUploadUrl: uploadsPath,
      clientPayload: JSON.stringify({ kind }),
      contentType,
      headers: { cookie: editorCookie },
    });
    sent.push(stored.url);
    return stored.url;
  };
  const jpegBytes = (size: number) => {
    const bytes = new Uint8Array(size);
    bytes.set([0xff, 0xd8, 0xff, 0xe0]);
    return bytes;
  };
  const photoCount = async () => (await db.select({ total: count() }).from(photos))[0]?.total ?? 0;
  const [shipped] = await db.select({ image: tours.image }).from(tours).where(like(tours.image, "/images/%")).limit(1);
  let tourId = "";
  try {
    // The permission route: no session 401, a Manager 403, an Editor a permission.
    const signedOut = await permission("media/upload.jpg", "image", "");
    const manager = await permission("media/upload.jpg", "image", managerCookie);
    const editor = await permission("media/upload.jpg", "image", editorCookie);
    if (signedOut.status !== 401 || manager.status !== 403 || editor.status !== 200 || !editor.body.clientToken) {
      throw new Error(`The upload permission answered ${signedOut.status} signed out, ${manager.status} for a Manager, and ${editor.status} for an Editor.`);
    }
    // A path with a folder or another name, a kind that is not image or pdf, and an SVG are refused.
    for (const [pathname, kind] of [
      ["media/folder/upload.jpg", "image"],
      ["media/../upload.jpg", "image"],
      ["images/upload.jpg", "image"],
      ["media/photo.jpg", "image"],
      ["media/upload.jpg", "video"],
      ["media/upload.svg", "image"],
      ["media/upload.pdf", "image"],
    ]) {
      const refused = await permission(pathname, kind, editorCookie);
      if (refused.status !== 400 || refused.body.clientToken) throw new Error(`An upload permission for ${pathname} as ${kind} returned ${refused.status}, not 400.`);
    }

    // A save naming a file that is not in this store, or not under media/, is refused and changes nothing.
    const store = new URL(await direct(jpegBytes(1024), "jpg", "image", "image/jpeg"));
    const before = await photoCount();
    for (const url of [
      `https://example.com${store.pathname}`,
      `https://another-store.public.blob.vercel-storage.com${store.pathname}`,
      `${store.origin}/images/no-such-photo.jpg`,
      `${store.origin}/media/no-such-photo.jpg`,
    ]) {
      const reply = await officePost("/api/office/photos", galleryForm({ alt: "T-51 check photo", category: "private", src: "", photoUploaded: url }), editorCookie);
      if (reply.status !== 400) throw new Error(`A gallery save naming ${url} returned ${reply.status}, not 400.`);
    }
    if ((await photoCount()) !== before) throw new Error("A save naming a file outside this store added a photo.");
    if (!(await mediaFileExists(store.href))) throw new Error("A refused save naming another file removed this store's file.");

    // Only a fresh direct upload is accepted. An existing office file, named the older way, is refused
    // and kept, whatever else is wrong with the save, so a record that still uses it keeps it.
    const olderName = (extension: string) => `media/${Date.now()}-${Math.random().toString(16).slice(2, 18)}.${extension}`;
    const olderPhoto = (await put(olderName("jpg"), Buffer.from(JPEG), { access: "public", token: process.env.MEDIA_READ_WRITE_TOKEN, contentType: "image/jpeg", addRandomSuffix: false })).url;
    const olderPdf = (await put(olderName("pdf"), Buffer.from("%PDF-1.7\nT-51 older PDF"), { access: "public", token: process.env.MEDIA_READ_WRITE_TOKEN, contentType: "application/pdf", addRandomSuffix: false })).url;
    sent.push(olderPhoto, olderPdf);
    const notInStore = "That file is not in the office media store. Choose it again.";
    const emptyDescription = await officePost("/api/office/photos", galleryForm({ alt: "", category: "private", src: "", photoUploaded: olderPhoto }), editorCookie);
    if (emptyDescription.status !== 400 || emptyDescription.body.error !== notInStore || !(await mediaFileExists(olderPhoto))) {
      throw new Error(`A gallery save with an empty description, naming an existing office photo, returned ${emptyDescription.status} (${emptyDescription.body.error ?? ""}), or the photo was deleted.`);
    }
    const pdfAsPhoto = await officePost("/api/office/photos", galleryForm({ alt: "T-51 check photo", category: "private", src: "", photoUploaded: olderPdf }), editorCookie);
    if (pdfAsPhoto.status !== 400 || pdfAsPhoto.body.error !== notInStore || !(await mediaFileExists(olderPdf))) {
      throw new Error(`A gallery save naming an existing tour PDF returned ${pdfAsPhoto.status} (${pdfAsPhoto.body.error ?? ""}), or the PDF was deleted.`);
    }
    if ((await photoCount()) !== before) throw new Error("A save naming an existing office file added a photo.");

    // A file uploaded as image/jpeg whose bytes are not an image is refused and deleted.
    const fake = await direct(new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"></svg>'), "jpg", "image", "image/jpeg");
    const fakeSave = await officePost("/api/office/photos", galleryForm({ alt: "T-51 check photo", category: "private", src: "", photoUploaded: fake }), editorCookie);
    if (fakeSave.status !== 400 || fakeSave.body.error !== "Use a JPEG, PNG, or WebP file.") throw new Error(`A fake JPEG upload returned ${fakeSave.status} (${fakeSave.body.error ?? ""}).`);
    if (await mediaFileExists(fake)) throw new Error("A fake JPEG upload was not deleted.");

    // A refused save deletes the file it uploaded, as T-40 does.
    const unsaved = await direct(jpegBytes(2048), "jpg", "image", "image/jpeg");
    const noAlt = await officePost("/api/office/photos", galleryForm({ alt: "", category: "private", src: "", photoUploaded: unsaved }), editorCookie);
    if (noAlt.status !== 400 || (await mediaFileExists(unsaved))) throw new Error("A refused save kept the file it uploaded.");

    // A Manager naming an uploaded file is refused with 403, and the file is not touched.
    const kept = await direct(jpegBytes(2048), "jpg", "image", "image/jpeg");
    if (!shipped) throw new Error("No tour has a shipped photo for the T-51 tour.");
    const tourAdded = await officePost("/api/office/tours/create", (() => { const form = newTourForm("T-51 Valley", {}); form.set("image", shipped.image); return form; })(), editorCookie);
    const [tour] = await db.select().from(tours).where(eq(tours.location, "T-51 Valley")).limit(1);
    if (tourAdded.status !== 200 || !tour) throw new Error("The T-51 tour was not added.");
    tourId = tour.id;
    const managerForm = tourForm(tour);
    managerForm.set("photoUploaded", kept);
    const managerSave = await officePost("/api/office/tours", managerForm, managerCookie);
    if (managerSave.status !== 403 || !(await mediaFileExists(kept))) throw new Error(`A Manager's tour save naming an upload returned ${managerSave.status}, or the file was removed.`);

    // T-56: the extension must fit the kind. A fresh upload-<suffix>.pdf holding JPEG bytes, named as
    // a gallery photo, and a fresh upload-<suffix>.jpg holding PDF bytes, named as a tour PDF, are
    // refused and deleted.
    const pdfNamedPhoto = await direct(jpegBytes(2048), "pdf", "pdf", "application/pdf");
    const pdfNamedSave = await officePost("/api/office/photos", galleryForm({ alt: "T-51 check photo", category: "private", src: "", photoUploaded: pdfNamedPhoto }), editorCookie);
    if (pdfNamedSave.status !== 400 || pdfNamedSave.body.error !== notInStore || (await mediaFileExists(pdfNamedPhoto))) {
      throw new Error(`A gallery save naming a fresh .pdf upload with JPEG bytes returned ${pdfNamedSave.status} (${pdfNamedSave.body.error ?? ""}), or the file was kept.`);
    }
    if ((await photoCount()) !== before) throw new Error("A gallery save naming a .pdf upload added a photo.");
    const jpgNamedPdf = await direct(new TextEncoder().encode("%PDF-1.7\nT-56 PDF named .jpg"), "jpg", "image", "image/jpeg");
    const jpgNamedForm = tourForm(tour);
    jpgNamedForm.set("pdfFileUploaded", jpgNamedPdf);
    const jpgNamedSave = await officePost("/api/office/tours", jpgNamedForm, editorCookie);
    const [unchanged] = await db.select({ pdf: tours.pdf }).from(tours).where(eq(tours.id, tour.id)).limit(1);
    if (jpgNamedSave.status !== 400 || jpgNamedSave.body.error !== notInStore || (await mediaFileExists(jpgNamedPdf)) || unchanged?.pdf !== tour.pdf) {
      throw new Error(`A tour save naming a fresh .jpg upload with PDF bytes as its PDF returned ${jpgNamedSave.status} (${jpgNamedSave.body.error ?? ""}), or the file was kept.`);
    }

    // The stand-in refuses what Vercel refuses: a photo over 5 MB, and a type the permission does not allow.
    const refusedUpload = async (bytes: Uint8Array, extension: string, kind: string, contentType: string) => {
      try {
        await direct(bytes, extension, kind, contentType);
        return false;
      } catch {
        return true;
      }
    };
    if (!(await refusedUpload(jpegBytes(6 * 1024 * 1024), "jpg", "image", "image/jpeg"))) throw new Error("A 6 MB photo upload was not refused.");
    if (!(await refusedUpload(jpegBytes(1024), "jpg", "image", "image/gif"))) throw new Error("A GIF upload under a photo permission was not refused.");

    // A 4.8 MB JPEG and a 9 MB PDF save through the direct upload.
    const bigPhoto = await direct(jpegBytes(Math.round(4.8 * 1024 * 1024)), "jpg", "image", "image/jpeg");
    const photoSave = await officePost("/api/office/photos", galleryForm({ alt: "T-51 check photo", category: "private", src: "", photoUploaded: bigPhoto }), editorCookie);
    const [bigRow] = await db.select().from(photos).where(eq(photos.alt, "T-51 check photo")).limit(1);
    if (photoSave.status !== 200 || bigRow?.src !== bigPhoto) throw new Error(`A 4.8 MB photo did not save through the direct upload (${photoSave.status} ${photoSave.body.error ?? ""}).`);
    const pdfBytes = new Uint8Array(9 * 1024 * 1024);
    pdfBytes.set(new TextEncoder().encode("%PDF-1.7\n"));
    const bigPdf = await direct(pdfBytes, "pdf", "pdf", "application/pdf");
    const pdfForm = tourForm(tour);
    pdfForm.set("pdfFileUploaded", bigPdf);
    const pdfSave = await officePost("/api/office/tours", pdfForm, editorCookie);
    const [withPdf] = await db.select({ pdf: tours.pdf }).from(tours).where(eq(tours.id, tour.id)).limit(1);
    if (pdfSave.status !== 200 || withPdf?.pdf !== bigPdf) throw new Error(`A 9 MB PDF did not save through the direct upload (${pdfSave.status} ${pdfSave.body.error ?? ""}).`);
  } finally {
    const [row] = await db.select({ id: photos.id }).from(photos).where(eq(photos.alt, "T-51 check photo")).limit(1);
    if (row) await officePost("/api/office/photos/delete", galleryForm({ id: String(row.id) }), editorCookie);
    if (tourId) await officePost("/api/office/tours/delete", formOf({ id: tourId }), editorCookie);
    await db.delete(photos).where(eq(photos.alt, "T-51 check photo"));
    await db.delete(tours).where(eq(tours.location, "T-51 Valley"));
    // Every file this check uploaded is removed, used or not.
    const left = [];
    for (const url of sent) if (await mediaFileExists(url)) left.push(url);
    if (left.length) await del(left, { token: process.env.MEDIA_READ_WRITE_TOKEN });
  }
}

// T-54: text with a NUL character is refused before any query, instead of Postgres failing with a
// 500. Text without it, including Urdu and emoji, still saves.
async function assertNulText(editorCookie: string) {
  const NUL = "\u0000";
  const nulError = "Some text has a character that cannot be saved.";
  const [review] = await db
    .insert(reviews)
    .values({ name: "T-54 check review", avatar: "", location: "", text: "T-54", rating: 5 })
    .returning({ id: reviews.id });
  const reviewForm = (name: string, text: string) => formOf({ id: review.id, name, avatar: "", location: "", text, rating: 5 });
  const savedIds: number[] = [];
  try {
    const snapshot = async () =>
      JSON.stringify([
        await db.select({ id: tours.id }).from(tours).orderBy(tours.id),
        await db.select().from(reviews).orderBy(reviews.id),
        await db.select({ id: guestRequests.id }).from(guestRequests).orderBy(guestRequests.id),
        await activityCount(),
      ]);
    const before = await snapshot();
    const refused: [string, { status: number; body: { error?: string } }][] = [
      ["a tour delete with id a\\0b", await officePost("/api/office/tours/delete", formOf({ id: `a${NUL}b` }), editorCookie)],
      ["a review save with a name holding \\0", await officePost("/api/office/reviews", reviewForm(`T-54${NUL}name`, "T-54"), editorCookie)],
      ["a guest request with a message holding \\0", await postRequest({ kind: "contact", name: "T-54 Guest", email: "t54@travelwithmoeen.test", message: `Hello${NUL}there` })],
    ];
    for (const [what, reply] of refused) {
      if (reply.status !== 400 || reply.body.error !== nulError) throw new Error(`${what} returned ${reply.status} (${reply.body.error ?? ""}), not 400 "${nulError}".`);
    }
    // A guest request reads only its five text fields, so deep nesting cannot crash the check, and a
    // body that is not a plain object is not read at all.
    const rawRequest = async (raw: string) => {
      const response = await fetch(`${siteBase()}/api/requests`, { method: "POST", headers: { "Content-Type": "application/json" }, body: raw });
      return { status: response.status, body: (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string } };
    };
    const deep = (depth: number) => "[".repeat(depth) + "]".repeat(depth);
    for (const [what, raw] of [
      ["a kind nested 10,000 deep", `{"kind":${deep(10_000)}}`],
      ["a message nested 10,000 deep", `{"kind":"contact","name":"T-54 Guest","email":"t54@travelwithmoeen.test","message":${deep(10_000)}}`],
    ]) {
      const reply = await rawRequest(raw);
      if (reply.status !== 400) throw new Error(`A guest request with ${what} returned ${reply.status}, not 400.`);
    }
    for (const raw of ["null", "[]", "5"]) {
      const reply = await rawRequest(raw);
      if (reply.status !== 400 || reply.body.error !== "The request could not be read.") {
        throw new Error(`A guest request with the body ${raw} returned ${reply.status} (${reply.body.error ?? ""}), not 400 "The request could not be read.".`);
      }
    }
    const signedOut = await officePost("/api/office/tours/delete", formOf({ id: `a${NUL}b` }), "");
    if (signedOut.status !== 401) throw new Error(`A signed-out office save with \\0 returned ${signedOut.status}, not 401.`);
    if ((await snapshot()) !== before) throw new Error("A request with a NUL character changed a tour, a review, a guest request, or the activity record.");

    // The sign-in gives its usual refusal, for a NUL character and for no body at all.
    const nulSignIn = await signIn(`owner${NUL}@travelwithmoeen.test`, "T54-any-password");
    const noBody = await fetch(`${siteBase()}/api/office/login`, { method: "POST" });
    const noBodyReply = (await noBody.json().catch(() => ({}))) as { error?: string };
    if (nulSignIn.status !== 401 || noBody.status !== 401 || nulSignIn.body.error !== noBodyReply.error || noBodyReply.error !== "That email or password is not right.") {
      throw new Error(`A sign-in with \\0 returned ${nulSignIn.status} and one with no body ${noBody.status}, not the usual 401.`);
    }

    // A content route with NUL in its id answers as for a missing record.
    for (const kind of ["tours", "places", "posts"]) {
      const reply = await fetch(`${siteBase()}/api/content/${kind}/a%00b`);
      if (reply.status !== 404) throw new Error(`GET /api/content/${kind}/a%00b returned ${reply.status}, not 404.`);
    }

    // Text without NUL, such as Urdu and emoji, still saves exactly.
    const urduName = "سلیم خان 😊";
    const urduText = "بہت اچھا سفر تھا ✈️🏔️";
    const urduSave = await officePost("/api/office/reviews", reviewForm(urduName, urduText), editorCookie);
    const [kept] = await db.select().from(reviews).where(eq(reviews.id, review.id)).limit(1);
    if (urduSave.status !== 200 || kept?.name !== urduName || kept?.text !== urduText) throw new Error("A review in Urdu with emoji did not save exactly.");
    const guest = await postRequest({ kind: "contact", name: urduName, email: "t54@travelwithmoeen.test", message: urduText });
    if (guest.status !== 200 || !guest.body.id) throw new Error("A guest request in Urdu with emoji was not saved.");
    savedIds.push(guest.body.id);
    const [stored] = await db.select().from(guestRequests).where(eq(guestRequests.id, guest.body.id)).limit(1);
    if (stored?.name !== urduName || stored?.message !== urduText) throw new Error("A guest request in Urdu with emoji did not save exactly.");
  } finally {
    await db.delete(reviews).where(eq(reviews.id, review.id));
    for (const id of savedIds) await db.delete(guestRequests).where(eq(guestRequests.id, id));
  }
}

// T-53: a tour delete with an id no tour has, or an empty id, returns 400 and changes nothing. A
// Manager still gets 403 for any id, and a real tour still goes with its day plan, place links, and
// office files, with one activity row.
async function assertTourDeleteNotFound(editorCookie: string, managerCookie: string) {
  const snapshot = async () =>
    JSON.stringify([
      await db.select({ id: tours.id }).from(tours).orderBy(tours.id),
      await db.select({ id: tourDays.id }).from(tourDays).orderBy(tourDays.id),
      await db.select().from(tourPlaces).orderBy(tourPlaces.tourId, tourPlaces.placeSlug),
      await activityCount(),
    ]);
  const before = await snapshot();
  for (const id of ["no-such-tour-t53", ""]) {
    const reply = await officePost("/api/office/tours/delete", formOf({ id }), editorCookie);
    if (reply.status !== 400 || reply.body.error !== "That tour was not found.") {
      throw new Error(`An Editor's tour delete with id "${id}" returned ${reply.status} (${reply.body.error ?? ""}), not 400 "That tour was not found.".`);
    }
  }
  const [anyTour] = await db.select({ id: tours.id }).from(tours).limit(1);
  for (const id of ["no-such-tour-t53", "", anyTour?.id ?? "x"]) {
    const reply = await officePost("/api/office/tours/delete", formOf({ id }), managerCookie);
    if (reply.status !== 403) throw new Error(`A Manager's tour delete with id "${id}" returned ${reply.status}, not 403.`);
  }
  if ((await snapshot()) !== before) throw new Error("A tour delete with no tour changed a tour, day plan, place link, or activity row.");

  // A real tour still goes with everything that belongs to it.
  const [place] = await db.select({ slug: places.slug }).from(places).limit(1);
  if (!place) throw new Error("The T-53 check needs a place to link.");
  const form = newTourForm("T-53 Valley", { photo: jpegFile("t53.jpg") });
  form.set("itinerary", JSON.stringify([{ title: "Day one", description: "T-53", highlights: [] }]));
  form.append("placeSlug", place.slug);
  const added = await officePost("/api/office/tours/create", form, editorCookie);
  const [tour] = await db.select().from(tours).where(eq(tours.location, "T-53 Valley")).limit(1);
  try {
    if (added.status !== 200 || !tour) throw new Error(`The T-53 tour was not added: ${added.body.error ?? added.status}.`);
    const days = await db.select().from(tourDays).where(eq(tourDays.tourId, tour.id));
    const links = await db.select().from(tourPlaces).where(eq(tourPlaces.tourId, tour.id));
    if (days.length !== 1 || links.length !== 1 || !(await mediaFileExists(tour.image))) throw new Error("The T-53 tour does not have its day, place link, and office photo.");
    const deleted = await officePost("/api/office/tours/delete", formOf({ id: tour.id }), editorCookie);
    if (deleted.status !== 200 || !deleted.body.ok) throw new Error(`An Editor could not delete the T-53 tour (${deleted.status}).`);
    const [left] = await db.select({ id: tours.id }).from(tours).where(eq(tours.id, tour.id));
    const daysLeft = await db.select({ id: tourDays.id }).from(tourDays).where(eq(tourDays.tourId, tour.id));
    const linksLeft = await db.select().from(tourPlaces).where(eq(tourPlaces.tourId, tour.id));
    if (left || daysLeft.length || linksLeft.length || (await mediaFileExists(tour.image))) {
      throw new Error("Deleting a real tour left the tour, its day plan, a place link, or its office photo.");
    }
    const rows = await db.select().from(activity).where(eq(activity.recordId, tour.id));
    const deleteRows = rows.filter((row) => row.text === `Deleted tour ${tour.name}`);
    if (deleteRows.length !== 1) throw new Error(`Deleting a real tour wrote ${deleteRows.length} delete rows, not one.`);
  } finally {
    if (tour) await db.delete(tours).where(eq(tours.id, tour.id));
  }
}

function rulesForm(values: Record<string, string | number>) {
  const form = new FormData();
  form.set("kind", "pricing_rule");
  for (const [key, value] of Object.entries(values)) form.set(key, String(value));
  return form;
}

function mealForm(id: number, dinner: string | number, lunch: string | number) {
  const form = new FormData();
  form.set("kind", "meal_rate");
  form.set("id", String(id));
  form.set("dinner", String(dinner));
  form.set("lunch", String(lunch));
  return form;
}

// T-47 (BR-87, BR-88): the pricing rules and meal rates are read from the database, an Owner or a
// Manager changes them on the Pricing rules tab, and an office quote can add lunch.
async function assertPricingRules(editorCookie: string, managerCookie: string) {
  const [rules] = await db.select().from(pricingRules).limit(1);
  const meals = await db.select().from(mealRates);
  const deluxe = meals.find((row) => row.grade === "Deluxe");
  if (!rules || !deluxe || meals.length !== 4) throw new Error("The pricing rules and the four meal rates are not stored.");
  const current = {
    guidePerDay: rules.guidePerDay,
    breakfastPerPerson: rules.breakfastPerPerson,
    childFarePercent: rules.childFarePercent,
    lapInfantFare: rules.lapInfantFare,
    seatInfantFare: rules.seatInfantFare,
    peoplePerRoom: rules.peoplePerRoom,
  };
  const stored = async () => JSON.stringify([await db.select().from(pricingRules).orderBy(pricingRules.id), await db.select().from(mealRates).orderBy(mealRates.id)]);
  const before = await stored();
  try {
    // An Editor cannot open the tab, and the server refuses the saves.
    const tab = await fetch(`${siteBase()}/office/rates/rules`, { headers: { cookie: editorCookie }, redirect: "manual" });
    if (tab.status === 200) throw new Error("An Editor opened the Pricing rules tab.");
    const managerTab = await fetch(`${siteBase()}/office/rates/rules`, { headers: { cookie: managerCookie }, redirect: "manual" });
    const managerHtml = await managerTab.text();
    if (managerTab.status !== 200 || !managerHtml.includes("Pricing rules") || !managerHtml.includes("Meal rates")) {
      throw new Error(`A Manager could not open the Pricing rules tab (${managerTab.status}).`);
    }
    const editorRules = await officePost("/api/office/rates", rulesForm({ ...current, guidePerDay: 6000 }), editorCookie);
    const editorMeal = await officePost("/api/office/rates", mealForm(deluxe.id, 1, 1), editorCookie);
    if (editorRules.status !== 403 || editorMeal.status !== 403) {
      throw new Error(`An Editor's pricing rule save returned ${editorRules.status}, and a meal rate save ${editorMeal.status}.`);
    }

    // Blank, negative, and non-numeric amounts, a child fare over 100, and 0 or 7 people per room are refused.
    const refused: [string, FormData][] = [
      ["a blank guide", rulesForm({ ...current, guidePerDay: "" })],
      ["a negative guide", rulesForm({ ...current, guidePerDay: "-5" })],
      ["a guide of abc", rulesForm({ ...current, guidePerDay: "abc" })],
      ["a child fare of 101", rulesForm({ ...current, childFarePercent: 101 })],
      ["a child fare of 12.5", rulesForm({ ...current, childFarePercent: "12.5" })],
      ["0 people per room", rulesForm({ ...current, peoplePerRoom: 0 })],
      ["7 people per room", rulesForm({ ...current, peoplePerRoom: 7 })],
      ["a negative lunch", mealForm(deluxe.id, deluxe.dinner, "-1")],
      ["a blank dinner", mealForm(deluxe.id, "", deluxe.lunch)],
    ];
    for (const [what, form] of refused) {
      const reply = await officePost("/api/office/rates", form, managerCookie);
      if (reply.status !== 400) throw new Error(`The rates save accepted ${what} (${reply.status}).`);
    }
    if ((await stored()) !== before) throw new Error("A refused pricing rule or meal rate save changed the stored values.");

    // A Manager changes the guide to 6,000 a day, and a quote with a guide uses 6,000.
    const saved = await officePost("/api/office/rates", rulesForm({ ...current, guidePerDay: 6000 }), managerCookie);
    if (saved.status !== 200 || !saved.body.ok) throw new Error(`A Manager could not save the pricing rules (${saved.status}).`);
    const withGuide = await quoteReply({ guide: true, seasonPercent: 20 }, managerCookie);
    const guideLine = withGuide.lines?.find((line) => line.label === "Guide");
    if (guideLine?.amount !== 6000 * SKARDU_QUOTE.days) throw new Error(`A quote with a guide used ${guideLine?.amount}, not 6,000 a day.`);

    // Each save writes one activity row, which a Manager can read and an Editor cannot.
    const ruleRows = await db.select().from(activity).where(eq(activity.kind, "pricing_rule"));
    const managerRows = ruleRows.filter((row) => row.userEmail === MANAGER_EMAIL);
    if (managerRows.length !== 1 || managerRows[0].text !== "Saved the pricing rules" || managerRows[0].area !== "rates") {
      throw new Error(`The pricing rule save wrote ${managerRows.length} activity rows.`);
    }
    const managerRead = await activityGet("?kind=pricing_rule", managerCookie);
    const editorRead = await activityGet("?kind=pricing_rule", editorCookie);
    if (managerRead.status !== 200 || managerRead.rows[0]?.userEmail !== MANAGER_EMAIL || editorRead.status !== 403) {
      throw new Error(`The pricing rule row read as ${managerRead.status} for a Manager and ${editorRead.status} for an Editor.`);
    }

    // Lunch is the grade's lunch rate times adults and children times days. Infants are not counted.
    // Dinner, the meal rule per night, is labelled Dinner.
    const party = { children: 1, lapInfants: 1, seatInfants: 0, seasonPercent: 20 };
    const plain = await quoteReply(party, managerCookie);
    const lunch = await quoteReply({ ...party, lunch: true }, managerCookie);
    const lunchLine = lunch.lines?.find((line) => line.label === "Lunch");
    const lunchAmount = deluxe.lunch * 3 * SKARDU_QUOTE.days;
    if (lunchLine?.amount !== lunchAmount || (lunch.subtotal ?? 0) - (plain.subtotal ?? 0) !== lunchAmount) {
      throw new Error(`Lunch for 2 adults and a child over 5 days was ${lunchLine?.amount}, not ${lunchAmount}.`);
    }
    const dinner = await quoteReply({ ...party, meals: true }, managerCookie);
    const dinnerLine = dinner.lines?.find((line) => line.label === "Dinner");
    if (dinnerLine?.amount !== deluxe.dinner * 3 * (SKARDU_QUOTE.days - 1) || dinner.lines?.some((line) => line.label === "Meals")) {
      throw new Error(`Dinner for 3 people over 4 nights was ${dinnerLine?.amount}, or the line was still called Meals.`);
    }
    const mealSaved = await officePost("/api/office/rates", mealForm(deluxe.id, deluxe.dinner, 2000), managerCookie);
    const newLunch = await quoteReply({ ...party, lunch: true }, managerCookie);
    if (mealSaved.status !== 200 || newLunch.lines?.find((line) => line.label === "Lunch")?.amount !== 2000 * 3 * SKARDU_QUOTE.days) {
      throw new Error("A changed Deluxe lunch rate was not used.");
    }
    const [mealRow] = await db.select().from(activity).where(eq(activity.kind, "meal_rate"));
    if (!mealRow || mealRow.text !== "Saved the meal rates for Deluxe" || mealRow.recordId !== String(deluxe.id)) {
      throw new Error("The meal rate save did not write its activity row.");
    }

    // A guest cannot add lunch.
    const guestPlain = await quoteReply({}, "");
    const guestLunch = await quoteReply({ lunch: true }, "");
    if (!guestLunch.ok || guestLunch.total !== guestPlain.total || guestLunch.lines !== undefined) {
      throw new Error("A guest quote added lunch.");
    }

    // A saved office quote keeps lunch.
    const quoteForm = new FormData();
    for (const [key, value] of Object.entries({ kind: "quote", ...SKARDU_QUOTE, seasonPercent: "", lunch: "on" })) quoteForm.set(key, String(value));
    const [top] = await db.select({ id: max(quotes.id) }).from(quotes);
    const savedQuote = await officePost("/api/office/rates", quoteForm, managerCookie);
    const [kept] = await db.select().from(quotes).where(gt(quotes.id, top?.id ?? 0));
    try {
      if (savedQuote.status !== 200 || !kept?.lunch) throw new Error("A saved office quote did not keep lunch.");
    } finally {
      if (kept) await db.delete(quotes).where(eq(quotes.id, kept.id));
    }
  } finally {
    await db.update(pricingRules).set(current).where(eq(pricingRules.id, rules.id));
    await db.update(mealRates).set({ dinner: deluxe.dinner, lunch: deluxe.lunch }).where(eq(mealRates.id, deluxe.id));
  }
  if ((await stored()) !== before) throw new Error("The pricing rules were not put back.");

  // With the starting values, the Skardu test is still 140,400.
  const skardu = await quoteReply({ seasonPercent: 20 }, managerCookie);
  if (skardu.subtotal !== 117000 || skardu.total !== 140400) throw new Error(`The Skardu quote is ${skardu.total}, not 140,400.`);

  // Both tables are backed up, before activity.
  const names = BACKUP_TABLES.map(([name]) => name);
  if (names.indexOf("pricing_rules") < 0 || names.indexOf("meal_rates") < 0 || names.indexOf("meal_rates") > names.indexOf("activity") || names.indexOf("pricing_rules") > names.indexOf("activity")) {
    throw new Error("pricing_rules and meal_rates are not in BACKUP_TABLES before activity.");
  }
}

// T-55 (BR-41, BR-84, BR-27, sign-off rows S-10 to S-12): the sticker is per vehicle, only the rooms
// with a third guest use the 3-share rate, and jeeps count adults and children, not infants. The
// amounts come from the stored rates, so the cases hold when the v1.2 rates are loaded.
async function assertDeskPricing(managerCookie: string) {
  const catalog = await loadCatalog();
  const road: QuoteInput = {
    place: "Skardu Valley",
    startCity: "Islamabad",
    mode: "road",
    days: 5,
    adults: 2,
    children: 0,
    lapInfants: 0,
    seatInfants: 0,
    grade: "Deluxe",
    vehicle: "Gli Car",
    guide: false,
    meals: false,
    seasonPercent: 20,
  };
  const hotel = catalog.hotels.find((row) => row.place === "Skardu Valley" && row.startCity === "Islamabad" && row.grade === "Deluxe" && row.offered);
  if (!hotel || hotel.triple === hotel.twin) throw new Error("The T-55 check needs a Skardu Deluxe hotel rate with different twin and 3-share rates.");
  const priced = (input: QuoteInput) => {
    const quote = buildQuote(input, catalog);
    if (!quote.ok) throw new Error(`A T-55 quote could not be priced: ${quote.error}`);
    return quote;
  };
  const hotelLine = (input: QuoteInput) => {
    const line = priced(input).lines.find((row) => row.label === "Hotel");
    if (!line) throw new Error("A T-55 quote has no hotel line.");
    return line;
  };
  const nights = road.days - 1;
  const twin = hotel.twin.toLocaleString("en-US");
  const triple = hotel.triple.toLocaleString("en-US");

  // 5 adults in 2 rooms: 1 room at 3-share and 1 at twin, and the working shows both.
  const five = hotelLine({ ...road, adults: 5, roomCount: 2 });
  if (five.amount !== (hotel.triple + hotel.twin) * nights || five.working !== `(1 room × ${triple} 3-share + 1 room × ${twin} twin) × ${nights} nights`) {
    throw new Error(`5 adults in 2 rooms priced the hotel at ${five.amount} (${five.working ?? ""}).`);
  }
  // 6 adults in 2 rooms: both at 3-share. 4 adults in 2 rooms: all twin.
  const six = hotelLine({ ...road, adults: 6, roomCount: 2 });
  if (six.amount !== hotel.triple * 2 * nights || six.working !== `2 rooms × ${triple} 3-share × ${nights} nights`) {
    throw new Error(`6 adults in 2 rooms priced the hotel at ${six.amount} (${six.working ?? ""}).`);
  }
  const four = hotelLine({ ...road, adults: 4, roomCount: 2 });
  if (four.amount !== hotel.twin * 2 * nights || four.working !== `2 rooms × ${twin} twin × ${nights} nights`) {
    throw new Error(`4 adults in 2 rooms priced the hotel at ${four.amount} (${four.working ?? ""}).`);
  }
  // Lap infants take no room: 4 adults and 2 lap infants in 2 rooms is still all twin.
  if (hotelLine({ ...road, adults: 4, lapInfants: 2, roomCount: 2 }).amount !== four.amount) throw new Error("Lap infants changed the hotel rooms.");
  // A typed share prices every room at that rate, and a typed night rate is for every room that night.
  if (hotelLine({ ...road, adults: 5, roomCount: 2, share: "twin" }).amount !== hotel.twin * 2 * nights) throw new Error("A typed twin share did not price every room at twin.");
  if (hotelLine({ ...road, adults: 4, roomCount: 2, share: "triple" }).amount !== hotel.triple * 2 * nights) throw new Error("A typed triple share did not price every room at 3-share.");
  const editedNight = hotelLine({ ...road, adults: 5, roomCount: 2, nightEdits: [{ night: 2, rate: 30000 }] });
  if (editedNight.amount !== (hotel.triple + hotel.twin) * (nights - 1) + 30000 * 2) {
    throw new Error(`A typed night rate with 5 adults in 2 rooms priced the hotel at ${editedNight.amount}.`);
  }
  const mixedNight = priced({ ...road, adults: 5, roomCount: 2 }).nights[0];
  if (mixedNight?.rate !== Math.round((hotel.triple + hotel.twin) / 2)) throw new Error("A night with both kinds of room did not keep the average room rate.");

  // An air quote with 2 vehicles and 3 rooms has a sticker of 2 vehicles, not 3 rooms.
  const air = priced({ ...road, mode: "air", days: 4, adults: 6, vehicle: "Prado", vehicleCount: 2, roomCount: 3 });
  const sticker = air.lines.find((line) => line.label === "Sticker");
  if (sticker?.amount !== catalog.air.sticker * 2) throw new Error(`The sticker for 2 vehicles and 3 rooms is ${sticker?.amount ?? 0}, not ${catalog.air.sticker * 2}.`);
  if (catalog.air.sticker === 500 && sticker.amount !== 1000) throw new Error("The sticker for 2 vehicles is not 1,000.");

  // 6 adults and 2 infants on a jeep line add 1 jeep, and 7 adults add 2.
  const jeepPlace = "Kalash Valley & Chitral";
  const jeep = catalog.jeeps.find((line) => line.live && line.place === jeepPlace && (line.mode === "both" || line.mode === "road"));
  if (!jeep || jeep.people !== 6) throw new Error("The T-55 check needs a live Kalash jeep line for 6 people.");
  const jeepAmount = (input: QuoteInput) => priced(input).lines.find((line) => line.label === jeep.label)?.amount;
  const jeepTrip = { ...road, place: jeepPlace, days: 6, vehicleCount: 2 };
  const withInfants = jeepAmount({ ...jeepTrip, adults: 6, lapInfants: 1, seatInfants: 1 });
  if (withInfants !== jeep.amount) throw new Error(`6 adults and 2 infants added ${withInfants ?? 0}, not 1 jeep.`);
  const seven = jeepAmount({ ...jeepTrip, adults: 7 });
  if (seven !== jeep.amount * 2) throw new Error(`7 adults added ${seven ?? 0}, not 2 jeeps.`);

  // The Skardu test is still 140,400, and the office quote route shows the hotel working.
  const skardu = priced(road);
  if (skardu.subtotal !== 117000 || skardu.total !== 140400) throw new Error(`The Skardu quote is ${skardu.total}, not 140,400.`);
  const office = await quoteReply({ seasonPercent: 20 }, managerCookie);
  const officeHotel = office.lines?.find((line) => line.label === "Hotel");
  if (office.total !== 140400 || officeHotel?.working !== `1 room × ${twin} twin × ${nights} nights`) {
    throw new Error(`The office Skardu quote is ${office.total ?? 0} with hotel working "${officeHotel?.working ?? ""}".`);
  }
}

type DeskReply = {
  hotels: { place: string; startCity: string; offered: boolean }[];
  vehicles: { place: string; startCity: string; mode: string; live: boolean }[];
  startCities: { id: number; name: string; road: boolean; air: boolean; airExtra: number; longRouteAfterDays: number | null; longRoutePerVehicleDay: number }[];
};

// The office Quote screen's lists, from GET /api/office/rates and the one lib/ function the page uses.
async function officeQuoteOptions(managerCookie: string) {
  const response = await fetch(`${siteBase()}/api/office/rates`, { headers: { cookie: managerCookie } });
  const body = (await response.json()) as { ok?: boolean; desk?: DeskReply };
  if (!body.ok || !body.desk) throw new Error(`A Manager could not read the rates (${response.status}).`);
  return { desk: body.desk, options: quoteOptions(body.desk.hotels, body.desk.vehicles, body.desk.startCities) };
}

// The options of one select on a server-rendered office page.
function selectOptions(html: string, id: string) {
  const select = new RegExp(`<select[^>]*id="${id}"[^>]*>([\\s\\S]*?)</select>`).exec(html);
  if (!select) return null;
  return [...select[1].matchAll(/<option[^>]*value="([^"]*)"/g)].map((match) => decodeHtml(match[1]));
}

// T-48 (BR-90, BR-91, BR-19 to BR-21, BR-42, BR-86): the start cities and the rate places. The Lahore
// and Karachi amounts come from the start city, a place is offered only with a hotel rate and a
// vehicle rate, a rename moves every rate row, and only an Owner or a Manager can save.
async function assertStartCities(editorCookie: string, managerCookie: string) {
  const stamp = Date.now();
  const place = `T48 Place ${stamp}`;
  const renamed = `T48 Renamed ${stamp}`;
  const city = `T48 City ${stamp}`;
  const town = `T48 Town ${stamp}`;
  const twinCity = `T48 Twin ${stamp}`;
  const [lahore] = await db.select().from(startCities).where(eq(startCities.name, "Lahore"));
  const [karachi] = await db.select().from(startCities).where(eq(startCities.name, "Karachi"));
  const [islamabad] = await db.select().from(startCities).where(eq(startCities.name, "Islamabad"));
  if (!lahore || !karachi || !islamabad) throw new Error("The start cities Islamabad, Lahore, and Karachi are not stored.");
  if (!islamabad.road || !islamabad.air || islamabad.airExtra !== 0) throw new Error("Islamabad does not start road and air trips with no air extra.");
  if (!lahore.road || !lahore.air || lahore.longRouteAfterDays !== 3 || lahore.longRoutePerVehicleDay !== 5000) throw new Error("Lahore does not have the 5,000 long-route extra after 3 days.");
  if (karachi.road || !karachi.air || karachi.airExtra !== 30000) throw new Error("Karachi is not air only with a 30,000 air extra.");
  const lahoreForm = (airExtra: number) =>
    formOf({ kind: "start_city", id: lahore.id, name: lahore.name, road: "on", air: "on", airExtra, longRouteAfterDays: lahore.longRouteAfterDays ?? "", longRoutePerVehicleDay: lahore.longRoutePerVehicleDay });
  // A good save writes one activity row, and a refused save writes none.
  const saves = async (form: FormData, cookie: string, status: number, what: string) => {
    const before = await activityCount();
    const result = await officePost("/api/office/rates", form, cookie);
    if (result.status !== status) throw new Error(`${what} returned ${result.status}, not ${status}: ${result.body.error ?? ""}`);
    const written = (await activityCount()) - before;
    if (written !== (status === 200 ? 1 : 0)) throw new Error(`${what} wrote ${written} activity rows.`);
    return result;
  };
  const quote = (extra: Record<string, unknown>) => quoteReply({ seasonPercent: 20, ...extra }, managerCookie);
  const line = (reply: QuoteReply, label: string) => reply.lines?.find((row) => row.label === label)?.amount;

  try {
    // Karachi is not offered for a road trip, on the screen or in its lists, and a road quote from
    // Karachi is refused with 400 through the quote route and the office save.
    const page = await officePage("/office/rates/quote", managerCookie);
    const shownCities = selectOptions(page.html, "quote-startCity");
    if (page.status !== 200 || !shownCities || shownCities.includes("Karachi") || !shownCities.includes("Islamabad") || !shownCities.includes("Lahore")) {
      throw new Error(`The office Quote screen offers these road start cities: ${shownCities?.join(", ") ?? "none"}.`);
    }
    const start = await officeQuoteOptions(managerCookie);
    if (start.options.startCities.road.includes("Karachi") || !start.options.startCities.air.includes("Karachi")) throw new Error("Karachi is offered for a road trip, or not for an air trip.");
    if (!start.options.places.road.Islamabad?.includes("Skardu Valley")) throw new Error("Skardu Valley is not offered from Islamabad by road.");
    const karachiRoad = await fetch(`${siteBase()}/api/quote`, {
      method: "POST",
      headers: { "content-type": "application/json", cookie: managerCookie },
      body: JSON.stringify({ ...SKARDU_QUOTE, startCity: "Karachi" }),
    });
    if (karachiRoad.status !== 400) throw new Error(`A road quote from Karachi returned ${karachiRoad.status}.`);
    const savedKarachi = await officePost("/api/office/rates", formOf({ kind: "quote", place: SKARDU_QUOTE.place, mode: "road", startCity: "Karachi", days: 5, adults: 2, grade: "Deluxe", vehicle: "Gli Car" }), managerCookie);
    if (savedKarachi.status !== 400) throw new Error(`An office save of a road quote from Karachi returned ${savedKarachi.status}.`);
    const unknown = await quote({ startCity: "Nowhere" });
    if (unknown.ok) throw new Error("A quote from a city that is not a start city was priced.");

    // A Lahore 5-day road trip adds 10,000 for one vehicle, as before.
    const lahoreRoad = await quote({ startCity: "Lahore" });
    if (line(lahoreRoad, "Lahore road extra") !== 10000) throw new Error(`A Lahore 5-day road trip added ${line(lahoreRoad, "Lahore road extra") ?? 0}, not 10,000.`);
    const lahoreFour = await quote({ startCity: "Lahore", adults: 5 });
    if (line(lahoreFour, "Lahore road extra") !== 10000 * Math.ceil(5 / 4)) throw new Error(`A Lahore 5-day trip for 5 adults added ${line(lahoreFour, "Lahore road extra") ?? 0}, not 10,000 for each vehicle.`);
    if (line(await quote({ startCity: "Lahore", days: 3 }), "Lahore road extra") !== undefined) throw new Error("A 3-day Lahore trip added the long-route extra.");
    const islamabadRoad = await quote({});
    if (line(islamabadRoad, "Islamabad road extra") !== undefined || islamabadRoad.total !== 140400) throw new Error("The Islamabad Skardu quote changed.");

    // Changing Lahore's air extra changes a Lahore air quote, and only by that amount per adult.
    const air = { startCity: "Lahore", mode: "air", vehicle: "Prado", days: 4, adults: 1 };
    const airBefore = line(await quote(air), "Air tickets");
    const [ticket] = await db.select({ islamabadTicket: airExtrasTable.islamabadTicket }).from(airExtrasTable).limit(1);
    if (airBefore !== (ticket?.islamabadTicket ?? 0) + lahore.airExtra) throw new Error(`A Lahore air ticket is ${airBefore ?? 0}, not the Islamabad ticket plus Lahore's air extra.`);
    await saves(lahoreForm(lahore.airExtra + 2500), editorCookie, 403, "An Editor's start city save");
    await saves(lahoreForm(lahore.airExtra + 2500), managerCookie, 200, "A Manager's Lahore air extra save");
    const airAfter = line(await quote(air), "Air tickets");
    if (airAfter !== (airBefore ?? 0) + 2500) throw new Error(`After a 2,500 change to Lahore's air extra, the Lahore air ticket is ${airAfter ?? 0}.`);
    const karachiAir = line(await quote({ ...air, startCity: "Karachi" }), "Air tickets");
    if (karachiAir !== (ticket?.islamabadTicket ?? 0) + karachi.airExtra) throw new Error("Changing Lahore's air extra changed a Karachi air ticket.");
    await saves(lahoreForm(lahore.airExtra), managerCookie, 200, "Putting Lahore's air extra back");

    // The Air extras tab saves without the old Lahore and Karachi adds, and leaves them as they were.
    const [airRow] = await db.select().from(airExtrasTable).limit(1);
    if (!airRow) throw new Error("The air extras are not stored.");
    const airPage = await officePage("/office/rates/air", managerCookie);
    if (airPage.html.includes('name="lahoreAdd"') || airPage.html.includes('name="karachiAdd"')) throw new Error("The Air extras tab still shows the Lahore and Karachi adds.");
    await saves(
      formOf({ kind: "air", islamabadTicket: airRow.islamabadTicket, welcomePack: airRow.welcomePack, entry: airRow.entry, infantExtra: airRow.infantExtra, sticker: airRow.sticker }),
      managerCookie,
      200,
      "An Air extras save without the Lahore and Karachi adds",
    );
    const [airKept] = await db.select().from(airExtrasTable).limit(1);
    if (JSON.stringify(airKept) !== JSON.stringify(airRow)) throw new Error("An unchanged Air extras save changed the row.");

    // The Start cities tab: Owner and Manager only.
    const editorTab = await officePage("/office/rates/start-cities", editorCookie);
    if (editorTab.status === 200) throw new Error("An Editor opened the Start cities tab.");
    const managerTab = await officePage("/office/rates/start-cities", managerCookie);
    if (managerTab.status !== 200 || !managerTab.html.includes("Karachi") || !managerTab.html.includes("Add start city")) throw new Error(`A Manager could not open the Start cities tab (${managerTab.status}).`);

    // A start city save checks every field.
    const cityForm = (values: Record<string, string | number>) => formOf({ kind: "start_city", name: city, road: "on", airExtra: 0, longRoutePerVehicleDay: 0, ...values });
    const refusedCities: [Record<string, string | number>, string][] = [
      [{ name: "Air" }, "the name Air"],
      [{ name: "lahore" }, "a second Lahore"],
      [{ name: "" }, "no name"],
      [{ road: "" }, "neither road nor air"],
      [{ airExtra: "-1" }, "a negative air extra"],
      [{ airExtra: "abc" }, "an air extra that is not a number"],
      [{ longRoutePerVehicleDay: 100 }, "a long-route extra with no days"],
      [{ longRouteAfterDays: "1.5", longRoutePerVehicleDay: 100 }, "1.5 days"],
      [{ id: "abc" }, "the id abc"],
      [{ id: 999999 }, "a start city that is not stored"],
    ];
    for (const [values, what] of refusedCities) {
      const form = cityForm(values);
      if (values.road === "") form.delete("road");
      await saves(form, managerCookie, 400, `A start city with ${what}`);
    }
    if ((await db.select().from(startCities).where(like(startCities.name, `T48 % ${stamp}`))).length) throw new Error("A refused start city was stored.");

    // Two saves of one new start city at the same moment: one is stored, and the other gets 400 with
    // the clash message, not a 500. The same holds for two renames of different places onto one name.
    const twin = await Promise.all([1, 2].map(() => officePost("/api/office/rates", cityForm({ name: twinCity }), managerCookie)));
    const twinStatuses = twin.map((reply) => reply.status).sort();
    if (twinStatuses.join() !== "200,400" || !twin.some((reply) => reply.body.error === "A start city with that name already exists.")) {
      throw new Error(`Two saves of one new start city at the same moment returned ${twinStatuses.join(" and ")}.`);
    }
    if ((await db.select().from(startCities).where(eq(startCities.name, twinCity))).length !== 1) throw new Error("Two saves at the same moment stored two start cities.");

    // A new road start city is offered for road trips only, with no place until it has rates.
    await saves(cityForm({}), editorCookie, 403, "An Editor's new start city");
    await saves(cityForm({}), managerCookie, 200, "A Manager's new start city");
    const [added] = await db.select().from(startCities).where(eq(startCities.name, city));
    if (!added || !added.road || added.air || added.longRouteAfterDays !== null) throw new Error("The new start city was not stored as sent.");
    const withCity = await officeQuoteOptions(managerCookie);
    if (!withCity.options.startCities.road.includes(city) || withCity.options.startCities.air.includes(city)) throw new Error("The new road start city is not offered for road trips only.");
    if ((withCity.options.places.road[city] ?? []).length !== 0) throw new Error("A start city with no rates offers a place.");
    const airFromCity = await quote({ ...air, startCity: city });
    if (airFromCity.ok || !airFromCity.error?.includes("air trip")) throw new Error("An air quote from a road-only start city was priced.");

    // A place with hotel rates only is not offered. A new place name adds the place.
    const hotelForm = (values: Record<string, string | number>) =>
      formOf({ kind: "hotel_rate_add", place, startCity: "Islamabad", grade: "Deluxe", twin: 7000, triple: 9000, hotelName: "T48 Hotel", offered: "on", ...values });
    await saves(hotelForm({}), editorCookie, 403, "An Editor's new hotel rate");
    for (const [values, what] of [
      [{ place: "" }, "no place"],
      [{ startCity: "Karachi" }, "a start city with no road trips"],
      [{ startCity: "Nowhere" }, "a city that is not a start city"],
      [{ grade: "Budget" }, "a grade that is not stored"],
      [{ twin: "-5" }, "a negative twin rate"],
      [{ triple: "" }, "no 3-share rate"],
    ] as [Record<string, string | number>, string][]) {
      await saves(hotelForm(values), managerCookie, 400, `A new hotel rate with ${what}`);
    }
    await saves(hotelForm({}), managerCookie, 200, "A Manager's first hotel rate for a new place");
    await saves(hotelForm({ place: place.toUpperCase() }), managerCookie, 400, "The same hotel rate again, in capitals");
    const hotelOnly = await officeQuoteOptions(managerCookie);
    if (hotelOnly.options.places.road.Islamabad?.includes(place)) throw new Error("A place with hotel rates only is offered.");
    const noVehicle = await quote({ place });
    if (noVehicle.ok) throw new Error("A place with hotel rates only was quoted.");

    // A place given a vehicle rate as well is offered, and quotes from its rates.
    const vehicleForm = (values: Record<string, string | number>) =>
      formOf({ kind: "vehicle_rate_add", place, startCity: "Islamabad", vehicle: "Gli Car", rent: 10000, fuel: 3000, toll: 1000, seats: 4, live: "on", ...values });
    await saves(vehicleForm({}), editorCookie, 403, "An Editor's new vehicle rate");
    for (const [values, what] of [
      [{ place: "T48 Never Added" }, "a place with no rates"],
      [{ vehicle: "Other" }, "the vehicle Other"],
      [{ seats: 0 }, "no seats"],
      [{ rent: "1.5" }, "a rent of 1.5"],
      [{ startCity: "Karachi" }, "a start city with no road trips"],
    ] as [Record<string, string | number>, string][]) {
      await saves(vehicleForm(values), managerCookie, 400, `A new vehicle rate with ${what}`);
    }
    await saves(vehicleForm({}), managerCookie, 200, "A Manager's vehicle rate for the new place");
    await saves(vehicleForm({ vehicle: "gli  car" }), managerCookie, 400, "The same vehicle rate again, in another case");
    const offeredPlace = await officeQuoteOptions(managerCookie);
    if (!offeredPlace.options.places.road.Islamabad?.includes(place)) throw new Error("A place with a hotel rate and a vehicle rate is not offered.");
    if (offeredPlace.options.places.road.Lahore?.includes(place)) throw new Error("A place with Islamabad rates only is offered from Lahore.");
    const trip = { place, days: 3, adults: 2 };
    const priced = await quote(trip);
    if (!priced.ok || line(priced, "Hotel") !== 7000 * 2 || line(priced, "Vehicle") !== 3 * 13000 + 1000) {
      throw new Error(`The new place quoted ${priced.total ?? priced.error}, with hotel ${line(priced, "Hotel") ?? 0} and vehicle ${line(priced, "Vehicle") ?? 0}.`);
    }

    // Renaming a place renames its hotel rates, vehicle rates, and jeep lines, and its quote still works.
    await db.insert(jeepLines).values({ place, mode: "both", label: "T48 jeep", people: 6, amount: 4000, live: true });
    const withJeep = await quote(trip);
    if (line(withJeep, "T48 jeep") !== 4000) throw new Error("The new place's jeep line was not priced.");
    const renameForm = (values: Record<string, string>) => formOf({ kind: "place_rename", place, name: renamed, ...values });
    await saves(renameForm({}), editorCookie, 403, "An Editor's place rename");
    await saves(renameForm({ name: "Skardu Valley" }), managerCookie, 400, "A rename onto Skardu Valley");
    await saves(renameForm({ name: "skardu valley" }), managerCookie, 400, "A rename onto Skardu Valley in lower case");
    await saves(renameForm({ name: place }), managerCookie, 400, "A rename to the same name");
    await saves(renameForm({ name: "" }), managerCookie, 400, "A rename to no name");
    await saves(renameForm({ place: "T48 Never Added" }), managerCookie, 400, "A rename of a place with no rates");
    await saves(renameForm({}), managerCookie, 200, "A Manager's place rename");
    const rowsNamed = async (name: string) =>
      [
        (await db.select({ id: hotelRates.id }).from(hotelRates).where(eq(hotelRates.place, name))).length,
        (await db.select({ id: vehicleRates.id }).from(vehicleRates).where(eq(vehicleRates.place, name))).length,
        (await db.select({ id: jeepLines.id }).from(jeepLines).where(eq(jeepLines.place, name))).length,
      ].join(",");
    if ((await rowsNamed(place)) !== "0,0,0" || (await rowsNamed(renamed)) !== "1,1,1") throw new Error("The rename did not move every hotel rate, vehicle rate, and jeep line.");
    const afterRename = await quote({ ...trip, place: renamed });
    if (afterRename.total !== withJeep.total || line(afterRename, "T48 jeep") !== 4000) throw new Error("The renamed place does not quote as before.");
    if ((await quote(trip)).ok) throw new Error("The old place name still quotes.");
    const skarduRows = await rowsNamed("Skardu Valley");

    // A road start city with its own hotel and vehicle rates offers the place. Renaming the city
    // renames it on those rate rows in the same save.
    await saves(hotelForm({ place: renamed, startCity: city }), managerCookie, 200, "A hotel rate from the new start city");
    await saves(vehicleForm({ place: renamed, startCity: city }), managerCookie, 200, "A vehicle rate from the new start city");
    const fromCity = await officeQuoteOptions(managerCookie);
    if (!fromCity.options.places.road[city]?.includes(renamed)) throw new Error("A start city with its own rates does not offer the place.");
    if (!(await quote({ ...trip, place: renamed, startCity: city })).ok) throw new Error("A quote from the new start city was not priced.");
    await saves(cityForm({ id: added.id, name: "Islamabad" }), managerCookie, 400, "A start city renamed onto Islamabad");
    await saves(cityForm({ id: added.id, name: town }), managerCookie, 200, "A start city rename");
    const cityRows = async (name: string) =>
      [
        (await db.select({ id: hotelRates.id }).from(hotelRates).where(eq(hotelRates.startCity, name))).length,
        (await db.select({ id: vehicleRates.id }).from(vehicleRates).where(eq(vehicleRates.startCity, name))).length,
      ].join(",");
    if ((await cityRows(city)) !== "0,0" || (await cityRows(town)) !== "1,1") throw new Error("Renaming the start city did not rename its hotel and vehicle rates.");
    if (!(await quote({ ...trip, place: renamed, startCity: town })).ok) throw new Error("A quote from the renamed start city was not priced.");
    if ((await rowsNamed("Skardu Valley")) !== skarduRows) throw new Error("The T-48 checks changed the Skardu Valley rates.");
  } finally {
    await db.delete(hotelRates).where(inArray(hotelRates.place, [place, renamed]));
    await db.delete(vehicleRates).where(inArray(vehicleRates.place, [place, renamed]));
    await db.delete(jeepLines).where(inArray(jeepLines.place, [place, renamed]));
    await db.delete(startCities).where(and(like(startCities.name, "T48 %"), inArray(startCities.name, [city, town, twinCity])));
    await db.update(startCities).set({ airExtra: lahore.airExtra, road: lahore.road, air: lahore.air, longRouteAfterDays: lahore.longRouteAfterDays, longRoutePerVehicleDay: lahore.longRoutePerVehicleDay }).where(eq(startCities.id, lahore.id));
  }

  // The Skardu test is still 140,400, and start_cities is backed up before activity.
  const skardu = await quote({});
  if (skardu.subtotal !== 117000 || skardu.total !== 140400) throw new Error(`The Skardu quote is ${skardu.total}, not 140,400.`);
  const names = BACKUP_TABLES.map(([name]) => name);
  if (names.indexOf("start_cities") < 0 || names.indexOf("start_cities") > names.indexOf("activity")) throw new Error("start_cities is not in BACKUP_TABLES before activity.");
}

// T-49 (BR-93): a line's working read as a sum, with the words and "on night 2" left out. NaN when it
// is not a sum.
function workingValue(text: string) {
  const sum = text
    .replace(/\b(?:on |after )?(?:night|day) \d+/g, " ")
    .replace(/[A-Za-z0-9-]*[A-Za-z][A-Za-z0-9-]*/g, " ")
    .replace(/[·,]/g, "")
    .replace(/×/g, "*");
  const tokens = sum.match(/\d+|[+*()]|\S/g) ?? [];
  let at = 0;
  // sum := product ("+" product)*, product := part ("*" part)*, part := number | "(" sum ")"
  const part = (): number => {
    const token = tokens[at++];
    if (token === "(") {
      const value = add();
      return tokens[at++] === ")" ? value : Number.NaN;
    }
    return token !== undefined && /^\d+$/.test(token) ? Number(token) : Number.NaN;
  };
  const multiply = (): number => {
    let value = part();
    while (tokens[at] === "*") {
      at += 1;
      value *= part();
    }
    return value;
  };
  const add = (): number => {
    let value = multiply();
    while (tokens[at] === "+") {
      at += 1;
      value += multiply();
    }
    return value;
  };
  const value = add();
  return at === tokens.length ? value : Number.NaN;
}

// T-49 (BR-89, BR-92, BR-93, BR-94, BR-50): each line's working adds up to its amount, the office can
// leave the air tickets out and type the rooms and vehicles, a guest cannot, and a saved quote keeps
// the typed counts and the tickets.
async function assertQuoteScreenV2(editorCookie: string, managerCookie: string) {
  const office = (extra: Record<string, unknown>) => quoteReply({ seasonPercent: 20, ...extra }, managerCookie);
  const guest = (extra: Record<string, unknown>) => quoteReply(extra, "");
  const line = (reply: QuoteReply, label: string) => reply.lines?.find((row) => row.label === label);
  const air = { mode: "air", vehicle: "Prado", days: 4 };

  // Each line has a working, and its numbers add up to the amount.
  const cases: [string, Record<string, unknown>][] = [
    ["Skardu", {}],
    ["Lahore road, 6 days, guide, dinner, lunch", { startCity: "Lahore", days: 6, guide: true, meals: true, lunch: true }],
    ["5 adults, typed rooms and vehicles", { adults: 5, roomCount: 2, vehicleCount: 2 }],
    ["a night edit, a cleared day, and a jeep day", { days: 6, nightEdits: [{ night: 2, rate: 30000 }], dayEdits: [{ day: 3, jeep: true, rent: 20000, fuel: 1000 }] }],
    ["Karachi air with a child and two infants", { ...air, startCity: "Karachi", children: 1, lapInfants: 1, seatInfants: 1, meals: true }],
    ["Lahore air with the tickets off", { ...air, startCity: "Lahore", tickets: false }],
    ["Kalash with jeeps and a paid extra", { place: "Kalash Valley & Chitral", days: 6, adults: 7, paidExtras: [{ name: "T49 permit", amount: 3500 }] }],
  ];
  for (const [name, extra] of cases) {
    const reply = await office(extra);
    if (!reply.ok || !reply.lines?.length) throw new Error(`The T-49 quote "${name}" was not priced: ${reply.error ?? ""}`);
    for (const row of reply.lines) {
      if (!row.working) throw new Error(`The ${row.label} line of "${name}" has no working.`);
      const value = workingValue(row.working);
      if (value !== row.amount) throw new Error(`The ${row.label} working of "${name}" reads ${value}, not ${row.amount}: ${row.working}`);
    }
  }

  // An air quote with the tickets off has no ticket line and keeps the welcome pack, entry, infant
  // extra, and sticker. On by default.
  const withTickets = await office({ ...air, lapInfants: 1 });
  const noTickets = await office({ ...air, lapInfants: 1, tickets: false });
  if (!line(withTickets, "Air tickets") || line(noTickets, "Air tickets")) throw new Error("Turning the tickets off did not remove the ticket line.");
  for (const label of ["Welcome pack", "Entry", "Infant extra", "Sticker"]) {
    if (line(noTickets, label)?.amount !== line(withTickets, label)?.amount) throw new Error(`With the tickets off, the ${label} line changed.`);
  }
  if ((noTickets.subtotal ?? 0) !== (withTickets.subtotal ?? 0) - (line(withTickets, "Air tickets")?.amount ?? 0)) throw new Error("With the tickets off, more than the ticket line changed.");

  // Typing 3 rooms for 2 adults prices 3 rooms. Leaving the count out goes back to 1.
  const auto = await office({});
  const autoHotel = line(auto, "Hotel");
  const threeRooms = await office({ roomCount: 3 });
  const threeHotel = line(threeRooms, "Hotel");
  if (!autoHotel || !threeHotel || threeHotel.amount !== autoHotel.amount * 3 || !threeHotel.working.startsWith("3 rooms × ")) {
    throw new Error(`3 typed rooms priced the hotel at ${threeHotel?.amount ?? 0} (${threeHotel?.working ?? ""}).`);
  }
  const back = (await office({})) as QuoteReply & { rooms?: number; autoRooms?: number };
  if (back.rooms !== 1 || back.autoRooms !== 1 || line(back, "Hotel")?.amount !== autoHotel.amount) throw new Error("Back to auto counts did not return to 1 room.");

  // Typing 2 vehicles doubles the vehicle line.
  const twoVehicles = await office({ vehicleCount: 2 });
  if (line(twoVehicles, "Vehicle")?.amount !== (line(auto, "Vehicle")?.amount ?? 0) * 2) throw new Error("2 typed vehicles did not double the vehicle line.");
  for (const bad of ["0", "61", "abc", "1.5"]) {
    const refused = await fetch(`${siteBase()}/api/quote`, { method: "POST", headers: { "content-type": "application/json", cookie: managerCookie }, body: JSON.stringify({ ...SKARDU_QUOTE, vehicleCount: bad }) });
    if (refused.status !== 400) throw new Error(`A typed vehicle count of "${bad}" returned ${refused.status}, not 400.`);
  }

  // A guest who sends a vehicle count or tickets off gets the normal quote, with no lines or profit.
  const guestPlain = await guest({});
  const guestTyped = await guest({ vehicleCount: 2 });
  const guestAir = await guest({ ...air });
  const guestAirOff = await guest({ ...air, tickets: false });
  if (guestTyped.total !== guestPlain.total || guestAirOff.total !== guestAir.total) throw new Error("A guest changed the quote with a vehicle count or tickets off.");
  if (guestTyped.lines !== undefined || guestAirOff.lines !== undefined || guestAirOff.profit !== undefined) throw new Error("A guest quote showed the lines or the profit.");

  // A night-two edit still changes only that night and the average.
  const night = await office({ nightEdits: [{ night: 2, rate: 20000 }] });
  if (night.nights?.[1]?.rate !== 20000 || night.nights.some((row, index) => index !== 1 && row.rate !== auto.nights?.[index]?.rate)) throw new Error("A night-two edit changed another night.");
  if (night.averageNightly !== ((auto.averageNightly ?? 0) * 4 - (auto.nights?.[1]?.rate ?? 0) + 20000) / 4) throw new Error("A night-two edit did not move the average.");

  // A saved quote keeps the typed counts and the tickets, and rebuilt from the saved row it prices
  // the same. Without typed counts the columns are empty and the tickets are on.
  const [before] = await db.select({ id: max(quotes.id) }).from(quotes);
  const saveForm = (values: Record<string, string | number>) =>
    formOf({ kind: "quote", place: "Skardu Valley", startCity: "Islamabad", mode: "air", days: 4, adults: 2, grade: "Deluxe", vehicle: "Prado", seasonPercent: 20, ...values });
  try {
    const editorSave = await officePost("/api/office/rates", saveForm({ roomCount: 3, vehicleCount: 2, tickets: "off" }), editorCookie);
    if (editorSave.status !== 403) throw new Error(`An Editor's quote save returned ${editorSave.status}.`);
    const typedSave = await officePost("/api/office/rates", saveForm({ roomCount: 3, vehicleCount: 2, tickets: "off" }), managerCookie);
    const plainSave = await officePost("/api/office/rates", saveForm({}), managerCookie);
    const badSave = await officePost("/api/office/rates", saveForm({ roomCount: "abc" }), managerCookie);
    if (typedSave.status !== 200 || plainSave.status !== 200 || badSave.status !== 400) throw new Error(`The quote saves returned ${typedSave.status}, ${plainSave.status}, and ${badSave.status}.`);
    const saved = await db.select().from(quotes).where(gt(quotes.id, before?.id ?? 0)).orderBy(quotes.id);
    const [typed, plain] = saved;
    if (saved.length !== 2 || !typed || !plain) throw new Error(`The quote saves stored ${saved.length} quotes, not 2.`);
    if (typed.roomCount !== 3 || typed.vehicleCount !== 2 || typed.tickets !== false) throw new Error(`A saved quote kept rooms ${typed.roomCount}, vehicles ${typed.vehicleCount}, tickets ${typed.tickets}.`);
    if (plain.roomCount !== null || plain.vehicleCount !== null || plain.tickets !== true) throw new Error("A saved quote without typed counts did not keep empty counts and the tickets on.");
    const catalog = await loadCatalog();
    for (const row of saved) {
      const rebuilt = buildQuote(
        {
          place: row.place,
          startCity: row.startCity,
          mode: row.mode === "air" ? "air" : "road",
          days: row.days,
          adults: row.adults,
          children: row.children,
          lapInfants: row.lapInfants,
          seatInfants: row.seatInfants,
          grade: row.grade,
          vehicle: row.vehicle,
          guide: row.guide,
          meals: row.meals,
          lunch: row.lunch,
          tickets: row.tickets !== false,
          roomCount: row.roomCount ?? undefined,
          vehicleCount: row.vehicleCount ?? undefined,
          seasonPercent: row.seasonPercent,
        },
        catalog,
      );
      if (!rebuilt.ok || rebuilt.total !== row.total) throw new Error(`Saved quote ${row.id} rebuilt to ${rebuilt.ok ? rebuilt.total : rebuilt.error}, not ${row.total}.`);
    }
  } finally {
    const made = await db.select({ id: quotes.id }).from(quotes).where(gt(quotes.id, before?.id ?? 0));
    for (const { id } of made) {
      await db.delete(quoteNights).where(eq(quoteNights.quoteId, id));
      await db.delete(quoteDays).where(eq(quoteDays.quoteId, id));
      await db.delete(quoteExtras).where(eq(quoteExtras.quoteId, id));
      await db.delete(quotes).where(eq(quotes.id, id));
    }
  }

  // The Skardu test is still 140,400.
  if (auto.subtotal !== 117000 || auto.total !== 140400) throw new Error(`The Skardu quote is ${auto.total}, not 140,400.`);
}

// T-62 (BR-117 to BR-119): each person sets, changes, and clears only their own name, and the office
// shows it in the account menu, the Users list, and "Saved by", with the email when it is cleared.
async function assertProfileSettings(editorCookie: string, managerCookie: string, ownerCookie: string) {
  const people = [["Owner", ownerCookie], ["Manager", managerCookie], ["Editor", editorCookie]] as const;
  const sessionOf = async (cookie: string) => (await (await fetch(`${siteBase()}/api/office/session`, { headers: { cookie } })).json()) as { id: number; email: string; name?: string | null };
  const sessions = await Promise.all(people.map(([, cookie]) => sessionOf(cookie)));
  const ids = sessions.map((session) => session.id);
  const before = await db.select({ id: users.id, name: users.name }).from(users).where(inArray(users.id, ids));
  const nameOf = async (id: number) => (await db.select({ name: users.name }).from(users).where(eq(users.id, id)))[0]?.name ?? null;
  const save = (form: Record<string, string>, cookie: string) => officePost("/api/office/settings/profile", formOf(form), cookie);
  const stamp = Date.now();
  try {
    // The Settings page opens for every role, from the Settings item in the account menu.
    for (const [role, cookie] of people) {
      const page = await officePage("/office/settings", cookie);
      if (page.status !== 200 || !page.html.includes("Profile") || !page.html.includes("Appearance") || !page.html.includes("Density")) throw new Error(`The ${role} could not open the Settings page (${page.status}).`);
      if (!page.html.includes('href="/office/settings"')) throw new Error(`The ${role}'s account menu has no Settings item.`);
    }
    // No session: 401, and nothing changes.
    const signedOut = await officePost("/api/office/settings/profile", formOf({ name: "Nobody" }), "");
    if (signedOut.status !== 401) throw new Error(`A name save with no session returned ${signedOut.status}.`);
    for (const [index, [role, cookie]] of people.entries()) {
      const id = ids[index];
      const name = `T62 ${role} ${stamp}`;
      const activityBefore = await activityCount();
      // Set: the name is trimmed and saved, and one activity row is written.
      const set = await save({ name: `  ${name}  ` }, cookie);
      if (set.status !== 200 || (await nameOf(id)) !== name) throw new Error(`The ${role} could not set a name (${set.status}).`);
      if ((await activityCount()) - activityBefore !== 1) throw new Error(`The ${role}'s name save did not write one activity row.`);
      const [row] = await db.select().from(activity).where(and(eq(activity.kind, "profile"), eq(activity.userId, id))).orderBy(desc(activity.id)).limit(1);
      if (row?.text !== "Changed their name" || row.area !== "users" || row.recordId !== String(id)) throw new Error(`The ${role}'s name change activity row is wrong: ${JSON.stringify(row)}`);
      // The session reply carries the name, for the account menu.
      if ((await sessionOf(cookie)).name !== name) throw new Error(`The ${role}'s session does not carry the name.`);
      const dashboard = await officePage("/office", cookie);
      if (!dashboard.html.includes(name)) throw new Error(`The ${role}'s account menu does not show the name.`);
      // Change, with another login's id sent: still only the signed-in person's own name changes.
      const otherId = ids[(index + 1) % ids.length];
      const otherBefore = await nameOf(otherId);
      const changed = await save({ name: `${name} changed`, id: String(otherId), userId: String(otherId) }, cookie);
      if (changed.status !== 200 || (await nameOf(id)) !== `${name} changed` || (await nameOf(otherId)) !== otherBefore) throw new Error(`A ${role} name save with another login's id changed the wrong row.`);
      // 60 characters is allowed. 61 returns 400 and changes nothing.
      const sixty = "N".repeat(60);
      if ((await save({ name: sixty }, cookie)).status !== 200 || (await nameOf(id)) !== sixty) throw new Error(`The ${role} could not save a 60-character name.`);
      const tooLong = await save({ name: "N".repeat(61) }, cookie);
      if (tooLong.status !== 400 || tooLong.body.error !== "A name can be up to 60 characters." || (await nameOf(id)) !== sixty) throw new Error(`A 61-character name returned ${tooLong.status} or changed the name.`);
      // Clear: an empty name is no name, and the email shows again.
      const cleared = await save({ name: "   " }, cookie);
      if (cleared.status !== 200 || (await nameOf(id)) !== null || (await sessionOf(cookie)).name !== null) throw new Error(`The ${role} could not clear the name.`);
      await save({ name }, cookie);
    }
    // The Users list shows the names above the emails.
    const list = (await (await fetch(`${siteBase()}/api/office/users`, { headers: { cookie: ownerCookie } })).json()) as { users?: { id: number; name: string | null }[] };
    for (const [index, [role]] of people.entries()) {
      if (list.users?.find((user) => user.id === ids[index])?.name !== `T62 ${role} ${stamp}`) throw new Error(`The Users list does not show the ${role}'s name.`);
    }
    const usersPage = await officePage("/office/users", ownerCookie);
    if (!usersPage.html.includes(`T62 Manager ${stamp}`) || !usersPage.html.includes(sessions[1].email)) throw new Error("The Users page does not show the name with the email.");
    // "Saved by" shows the current name, with the email kept on the row and shown on hover.
    const feed = (await (await fetch(`${siteBase()}/api/office/activity?kind=profile`, { headers: { cookie: ownerCookie } })).json()) as { rows?: { userEmail: string; userName: string | null; recordId: string }[] };
    const editorRow = feed.rows?.find((row) => row.recordId === String(ids[2]));
    if (editorRow?.userName !== `T62 Editor ${stamp}` || editorRow.userEmail !== sessions[2].email) throw new Error(`"Saved by" does not show the Editor's current name: ${JSON.stringify(editorRow)}`);
    const ownerDashboard = await officePage("/office", ownerCookie);
    if (!ownerDashboard.html.includes(`title="${sessions[2].email}"`)) throw new Error("The activity feed does not keep the email on hover.");
    // The name change rows are for the Owner: a Manager and an Editor cannot read them.
    const managerFeed = await fetch(`${siteBase()}/api/office/activity?kind=profile`, { headers: { cookie: managerCookie } });
    const editorFeed = await fetch(`${siteBase()}/api/office/activity?kind=profile`, { headers: { cookie: editorCookie } });
    if (managerFeed.status !== 403 || editorFeed.status !== 403) throw new Error(`A Manager or an Editor read the name change rows (${managerFeed.status}, ${editorFeed.status}).`);
    // Cleared: "Saved by" falls back to the email.
    await save({ name: "" }, editorCookie);
    const after = (await (await fetch(`${siteBase()}/api/office/activity?kind=profile`, { headers: { cookie: ownerCookie } })).json()) as { rows?: { userName: string | null; recordId: string }[] };
    if (after.rows?.find((row) => row.recordId === String(ids[2]))?.userName !== null) throw new Error('"Saved by" did not fall back to the email for a cleared name.');
  } finally {
    for (const row of before) await db.update(users).set({ name: row.name }).where(eq(users.id, row.id));
  }
}

async function assertProfitMargin(editorCookie: string, managerCookie: string) {
  const [saved] = await db.select({ percent: seasons.percent }).from(seasons).limit(1);
  if (saved?.percent !== 20) throw new Error(`The profit margin starts at ${saved?.percent ?? "nothing"}, not 20.`);
  try {
    const editorSave = await officePost("/api/office/rates", marginForm("16"), editorCookie);
    if (editorSave.status !== 403) throw new Error(`An Editor margin save returned ${editorSave.status}.`);
    for (const refused of ["101", "12.5", "-1", ""]) {
      const result = await officePost("/api/office/rates", marginForm(refused), managerCookie);
      if (result.status !== 400 || result.body.ok) throw new Error(`The margin "${refused}" was not refused: ${result.status}.`);
    }
    const [unchanged] = await db.select({ percent: seasons.percent }).from(seasons).limit(1);
    if (unchanged?.percent !== 20) throw new Error("A refused margin changed the saved margin.");

    const atTwenty = await skarduQuote(managerCookie);
    if (atTwenty.subtotal !== 117000 || atTwenty.profit !== 23400 || atTwenty.total !== 140400) {
      throw new Error(`The Skardu quote at 20 percent was ${atTwenty.total}.`);
    }
    for (const [percent, profit] of [["16", 18720], ["30", 35100]] as const) {
      const result = await officePost("/api/office/rates", marginForm(percent), managerCookie);
      if (result.status !== 200 || !result.body.ok) throw new Error(`The margin ${percent} was not saved: ${result.body.error ?? result.status}.`);
      const quote = await skarduQuote(managerCookie);
      if (quote.seasonPercent !== Number(percent) || quote.subtotal !== 117000 || quote.profit !== profit || quote.total !== 117000 + profit) {
        throw new Error(`At ${percent} percent the Skardu quote was ${quote.subtotal} plus ${quote.profit}.`);
      }
      const guest = await skarduQuote("");
      if (guest.total !== 117000 + profit || guest.profit !== undefined) {
        throw new Error(`At ${percent} percent the guest total was ${guest.total}.`);
      }
    }
  } finally {
    await db.update(seasons).set({ percent: 20 });
  }
  const [back] = await db.select({ percent: seasons.percent }).from(seasons).limit(1);
  if (back?.percent !== 20) throw new Error("The profit margin was not put back to 20.");
}

async function mediaFiles() {
  const token = process.env.MEDIA_READ_WRITE_TOKEN;
  if (!token) throw new Error("The T-40 check needs MEDIA_READ_WRITE_TOKEN.");
  const names = new Set<string>();
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: "media/", token, cursor });
    for (const blob of page.blobs) names.add(blob.pathname);
    cursor = page.cursor;
  } while (cursor);
  return names;
}

async function mediaFileExists(url: string) {
  try {
    await head(url, { token: process.env.MEDIA_READ_WRITE_TOKEN });
    return true;
  } catch {
    return false;
  }
}

function newTourForm(location: string, files: { photo?: File; pdf?: File }) {
  const form = new FormData();
  form.set("name", "T-40 check tour");
  form.set("location", location);
  form.set("region", "T-40 Valley");
  form.set("description", "T-40 check.");
  form.set("duration", "1");
  form.set("image", "");
  form.set("pdf", "");
  form.set("transport", "By Road");
  form.set("itinerary", "[]");
  form.set("galleryImageSet", "1");
  form.set("placeSet", "1");
  if (files.photo) form.set("photo", files.photo);
  if (files.pdf) form.set("pdfFile", files.pdf);
  return form;
}

// T-40: a refused save deletes the files it stored. An accepted save keeps them.
async function assertRefusedSaveCleanup(editorCookie: string) {
  const jpeg = () => new File([new Uint8Array(JPEG)], "t40.jpg", { type: "image/jpeg" });
  const before = await mediaFiles();
  const refusedSaves: [string, string, FormData][] = [
    ["a tour with no location", "/api/office/tours/create", newTourForm("", { photo: jpeg() })],
    ["a tour whose PDF is not a PDF", "/api/office/tours/create", newTourForm("T-40 Valley", { photo: jpeg(), pdf: new File([Buffer.from("hello")], "t40.pdf", { type: "application/pdf" }) })],
  ];
  const photoForm = new FormData();
  photoForm.set("alt", "");
  photoForm.set("category", "private");
  photoForm.set("photo", jpeg());
  refusedSaves.push(["a gallery photo with no description", "/api/office/photos", photoForm]);
  for (const [what, path, form] of refusedSaves) {
    const refused = await officePost(path, form, editorCookie);
    if (refused.status !== 400 || refused.body.ok) throw new Error(`Saving ${what} was not refused: ${refused.status}.`);
  }
  const after = await mediaFiles();
  const left = [...after].filter((name) => !before.has(name));
  if (left.length > 0) throw new Error(`A refused save left ${left.length} file(s) in the media store: ${left.join(", ")}`);

  const accepted = await officePost("/api/office/tours/create", newTourForm("T-40 Valley", { photo: jpeg() }), editorCookie);
  if (accepted.status !== 200 || !accepted.body.ok) throw new Error(`The accepted T-40 tour was refused: ${accepted.body.error ?? accepted.status}.`);
  const [tour] = await db.select().from(tours).where(eq(tours.name, "T-40 check tour")).limit(1);
  try {
    if (!tour || !tour.image.includes("/media/")) throw new Error("The accepted T-40 tour did not keep its photo.");
    if (!(await mediaFileExists(tour.image))) throw new Error("The accepted T-40 tour's photo is not in the media store.");
  } finally {
    if (tour) {
      const form = new FormData();
      form.set("id", tour.id);
      await officePost("/api/office/tours/delete", form, editorCookie);
      await db.delete(tours).where(eq(tours.id, tour.id));
    }
  }
}

function galleryForm(fields: Record<string, string>, photo?: File) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  if (photo) form.set("photo", photo);
  return form;
}

// T-42: a save deletes the old file only after the new record is written. Replacing a photo still
// removes the old office file, and a refused save leaves the current file in the record and the store.
async function assertOldFileRemovedAfterSave(editorCookie: string) {
  const jpeg = () => new File([new Uint8Array(JPEG)], "t42.jpg", { type: "image/jpeg" });
  const added = await officePost("/api/office/photos", galleryForm({ alt: "T-42 check photo", category: "private", src: "" }, jpeg()), editorCookie);
  if (added.status !== 200 || !added.body.ok) throw new Error(`The T-42 photo was not added: ${added.body.error ?? added.status}.`);
  const [photo] = await db.select().from(photos).where(eq(photos.alt, "T-42 check photo")).limit(1);
  if (!photo || !photo.src.includes("/media/")) throw new Error("The T-42 photo did not keep its upload.");
  try {
    const first = photo.src;
    const replaced = await officePost("/api/office/photos", galleryForm({ id: String(photo.id), alt: "T-42 check photo", category: "private", src: first }, jpeg()), editorCookie);
    if (replaced.status !== 200 || !replaced.body.ok) throw new Error(`Replacing the T-42 photo was refused: ${replaced.body.error ?? replaced.status}.`);
    const [afterReplace] = await db.select({ src: photos.src }).from(photos).where(eq(photos.id, photo.id)).limit(1);
    if (!afterReplace || afterReplace.src === first) throw new Error("Replacing the T-42 photo did not store the new file.");
    if (await mediaFileExists(first)) throw new Error("Replacing a photo left the old office file in the media store.");
    if (!(await mediaFileExists(afterReplace.src))) throw new Error("The replaced photo is not in the media store.");

    const refused = await officePost("/api/office/photos", galleryForm({ id: String(photo.id), alt: "", category: "private", src: afterReplace.src }, jpeg()), editorCookie);
    if (refused.status !== 400) throw new Error(`A T-42 save with no description returned ${refused.status}.`);
    const [afterRefused] = await db.select({ src: photos.src }).from(photos).where(eq(photos.id, photo.id)).limit(1);
    if (afterRefused?.src !== afterReplace.src) throw new Error("A refused save changed the photo the record points at.");
    if (!(await mediaFileExists(afterReplace.src))) throw new Error("A refused save removed the record's current file.");
  } finally {
    await officePost("/api/office/photos/delete", galleryForm({ id: String(photo.id) }), editorCookie);
    await db.delete(photos).where(eq(photos.id, photo.id));
  }
}

// T-43: a delete removes the record, then its office file, and leaves nothing in the media store.
async function assertDeleteRemovesRecordAndFile(editorCookie: string) {
  const jpeg = () => new File([new Uint8Array(JPEG)], "t43.jpg", { type: "image/jpeg" });
  const before = await mediaFiles();

  const added = await officePost("/api/office/photos", galleryForm({ alt: "T-43 check photo", category: "private", src: "" }, jpeg()), editorCookie);
  if (added.status !== 200 || !added.body.ok) throw new Error(`The T-43 photo was not added: ${added.body.error ?? added.status}.`);
  const [photo] = await db.select().from(photos).where(eq(photos.alt, "T-43 check photo")).limit(1);
  try {
    if (!photo || !(await mediaFileExists(photo.src))) throw new Error("The T-43 photo is not in the media store.");
    const photoDeleted = await officePost("/api/office/photos/delete", galleryForm({ id: String(photo.id) }), editorCookie);
    if (photoDeleted.status !== 200 || !photoDeleted.body.ok) throw new Error(`Deleting the T-43 photo was refused: ${photoDeleted.body.error ?? photoDeleted.status}.`);
    const [photoLeft] = await db.select({ id: photos.id }).from(photos).where(eq(photos.id, photo.id)).limit(1);
    if (photoLeft) throw new Error("Deleting a gallery photo left its record.");
    if (await mediaFileExists(photo.src)) throw new Error("Deleting a gallery photo left its office file.");
  } finally {
    await db.delete(photos).where(eq(photos.alt, "T-43 check photo"));
  }

  const tourAdded = await officePost("/api/office/tours/create", newTourForm("T-43 Valley", { photo: jpeg() }), editorCookie);
  if (tourAdded.status !== 200 || !tourAdded.body.ok) throw new Error(`The T-43 tour was not added: ${tourAdded.body.error ?? tourAdded.status}.`);
  const [tour] = await db.select().from(tours).where(eq(tours.location, "T-43 Valley")).limit(1);
  try {
    if (!tour || !(await mediaFileExists(tour.image))) throw new Error("The T-43 tour's photo is not in the media store.");
    const tourForm = new FormData();
    tourForm.set("id", tour.id);
    const tourDeleted = await officePost("/api/office/tours/delete", tourForm, editorCookie);
    if (tourDeleted.status !== 200 || !tourDeleted.body.ok) throw new Error(`Deleting the T-43 tour was refused: ${tourDeleted.body.error ?? tourDeleted.status}.`);
    const [tourLeft] = await db.select({ id: tours.id }).from(tours).where(eq(tours.id, tour.id)).limit(1);
    if (tourLeft) throw new Error("Deleting a tour left its record.");
    if (await mediaFileExists(tour.image)) throw new Error("Deleting a tour left its office photo.");
  } finally {
    if (tour) await db.delete(tours).where(eq(tours.id, tour.id));
  }

  const after = await mediaFiles();
  const left = [...after].filter((name) => !before.has(name));
  if (left.length > 0) throw new Error(`The T-43 deletes left ${left.length} file(s) in the media store.`);
}

type ActivityReplyRow = { id: number; at: string; userEmail: string; area: string; kind: string; recordId: string; text: string };

async function activityGet(query: string, cookie: string) {
  const response = await fetch(`${siteBase()}/api/office/activity${query}`, { headers: cookie ? { cookie } : {} });
  const body = (await response.json().catch(() => ({}))) as { ok?: boolean; rows?: ActivityReplyRow[] };
  return { status: response.status, rows: body.rows ?? [] };
}

async function activityCount() {
  const [row] = await db.select({ total: count() }).from(activity);
  return row?.total ?? 0;
}

async function officePage(pathname: string, cookie: string) {
  const response = await fetch(`${siteBase()}${pathname}`, { headers: { cookie }, redirect: "manual" });
  return { status: response.status, html: await response.text() };
}

// T-37k (BR-86): each office save writes one activity row, and a person reads only the rows for
// areas their role can open.
async function assertActivity(editorCookie: string, managerCookie: string, ownerCookie: string, request: { id: number; phone: string; message: string }) {
  const signedOut = await activityGet("", "");
  if (signedOut.status !== 401) throw new Error(`An activity read with no cookie returned ${signedOut.status}.`);

  // An Editor saves a tour, and the dashboard and the tour screen show who saved it and when.
  const [shipped] = await db.select({ image: tours.image }).from(tours).where(like(tours.image, "/images/%")).limit(1);
  if (!shipped) throw new Error("No tour has a shipped photo for the T-37k tour.");
  const addForm = newTourForm("T-37k Valley", {});
  addForm.set("name", "T-37k check tour");
  addForm.set("image", shipped.image);
  const added = await officePost("/api/office/tours/create", addForm, editorCookie);
  if (added.status !== 200 || !added.body.ok) throw new Error(`The T-37k tour was not added: ${added.body.error ?? added.status}.`);
  const [tour] = await db.select().from(tours).where(eq(tours.location, "T-37k Valley")).limit(1);
  try {
    if (!tour) throw new Error("The T-37k tour is not in the database.");
    const savedAt = Date.now();
    const saved = await officePost("/api/office/tours", tourForm(tour), editorCookie);
    if (saved.status !== 200 || !saved.body.ok) throw new Error(`The Editor could not save the T-37k tour: ${saved.body.error ?? saved.status}.`);
    const feed = await activityGet("?limit=20", editorCookie);
    const row = feed.rows.find((item) => item.kind === "tour" && item.recordId === tour.id && item.text === "Saved tour T-37k check tour");
    if (feed.status !== 200 || !row || row.userEmail !== EDITOR_EMAIL || row.area !== "content") {
      throw new Error("The Editor's tour save is not in the activity feed with the Editor's login.");
    }
    if (Math.abs(Date.parse(row.at) - savedAt) > 60_000) throw new Error("The tour save's activity time is not the time of the save.");
    const addedRow = feed.rows.find((item) => item.kind === "tour" && item.recordId === tour.id && item.text === "Added tour T-37k check tour");
    if (!addedRow || addedRow.id >= row.id) throw new Error("Adding the T-37k tour did not write its own activity row first.");
    const screen = await activityGet(`?kind=tour&record=${encodeURIComponent(tour.id)}`, editorCookie);
    if (screen.status !== 200 || screen.rows.length !== 1 || screen.rows[0].id !== row.id) {
      throw new Error("Saved by for the T-37k tour is not its newest save.");
    }
    const dashboard = await officePage("/office", editorCookie);
    if (dashboard.status !== 200 || !dashboard.html.includes("Saved tour T-37k check tour") || !dashboard.html.includes(EDITOR_EMAIL)) {
      throw new Error("The dashboard does not show the Editor's tour save.");
    }
    const tourScreen = await officePage(`/office/tours/${encodeURIComponent(tour.id)}`, editorCookie);
    if (tourScreen.status !== 200 || !tourScreen.html.includes(`by ${EDITOR_EMAIL}`) || !tourScreen.html.includes("Last saved")) {
      throw new Error("The tour screen does not show who saved the T-37k tour.");
    }
  } finally {
    if (tour) await db.delete(tours).where(eq(tours.id, tour.id));
  }

  // A Manager reads rate and request rows and no content rows. An Editor reads no rate rows.
  const [season] = await db.select({ percent: seasons.percent }).from(seasons).limit(1);
  const marginForm = new FormData();
  marginForm.set("kind", "season");
  marginForm.set("percent", String(season?.percent ?? 20));
  const marginSaved = await officePost("/api/office/rates", marginForm, managerCookie);
  if (marginSaved.status !== 200) throw new Error(`The Manager's margin save returned ${marginSaved.status}.`);
  const managerFeed = await activityGet("?limit=100", managerCookie);
  if (managerFeed.status !== 200 || managerFeed.rows.some((item) => item.area !== "rates" && item.area !== "requests")) {
    throw new Error("A Manager received activity rows outside rates and requests.");
  }
  if (!managerFeed.rows.some((item) => item.kind === "margin" && item.userEmail === MANAGER_EMAIL)) {
    throw new Error("The Manager's margin save is not in the Manager's activity feed.");
  }
  const requestText = `Moved request ${request.id} to In progress`;
  for (const cookie of [managerCookie, editorCookie]) {
    const requestRows = await activityGet(`?kind=request&record=${request.id}`, cookie);
    if (requestRows.status !== 200 || requestRows.rows[0]?.text !== requestText || requestRows.rows[0]?.userEmail !== MANAGER_EMAIL) {
      throw new Error("The request status change is not readable as a request row.");
    }
  }
  const managerTours = await activityGet("?kind=tour", managerCookie);
  if (managerTours.status !== 403 || managerTours.rows.length) throw new Error(`A Manager content activity read returned ${managerTours.status}.`);
  const editorFeed = await activityGet("?limit=100", editorCookie);
  if (editorFeed.status !== 200 || editorFeed.rows.some((item) => item.area !== "content" && item.area !== "requests")) {
    throw new Error("An Editor received activity rows outside content and requests.");
  }
  for (const kind of ["margin", "hotel_rate", "quote", "user", "backup"]) {
    const refused = await activityGet(`?kind=${kind}`, editorCookie);
    if (refused.status !== 403 || refused.rows.length) throw new Error(`An Editor ${kind} activity read returned ${refused.status}.`);
  }
  for (const kind of ["user", "backup"]) {
    const refused = await activityGet(`?kind=${kind}`, managerCookie);
    if (refused.status !== 403) throw new Error(`A Manager ${kind} activity read returned ${refused.status}.`);
  }
  const ownerUsers = await activityGet("?kind=user", ownerCookie);
  if (ownerUsers.status !== 200 || !ownerUsers.rows.some((item) => item.text === `Created a login for ${EDITOR_EMAIL} as Editor`)) {
    throw new Error("The Owner cannot read the login rows.");
  }
  const badKind = await activityGet("?kind=password", ownerCookie);
  if (badKind.status !== 400) throw new Error(`An unknown activity kind returned ${badKind.status}.`);

  // A failed or refused save writes no row.
  const before = await activityCount();
  const refusedSaves: [string, FormData, string][] = [];
  const editorMargin = new FormData();
  editorMargin.set("kind", "season");
  editorMargin.set("percent", "30");
  refusedSaves.push(["/api/office/rates", editorMargin, editorCookie]);
  const badMargin = new FormData();
  badMargin.set("kind", "season");
  badMargin.set("percent", "101");
  refusedSaves.push(["/api/office/rates", badMargin, managerCookie]);
  const noLocation = newTourForm("", {});
  noLocation.set("image", shipped.image);
  refusedSaves.push(["/api/office/tours/create", noLocation, editorCookie]);
  refusedSaves.push(["/api/office/tours/create", addForm, managerCookie]);
  const editorStatus = new FormData();
  editorStatus.set("id", String(request.id));
  editorStatus.set("status", "closed");
  refusedSaves.push(["/api/office/requests/status", editorStatus, editorCookie]);
  const badStatus = new FormData();
  badStatus.set("id", String(request.id));
  badStatus.set("status", "done");
  refusedSaves.push(["/api/office/requests/status", badStatus, managerCookie]);
  for (const [pathname, form, cookie] of refusedSaves) {
    const refused = await officePost(pathname, form, cookie);
    if (refused.status === 200) throw new Error(`A save that should be refused was accepted: ${pathname}.`);
  }
  if ((await activityCount()) !== before) throw new Error("A refused save wrote an activity row.");

  // No row holds a password, a token, a secret, or a guest phone or message.
  const secrets = [
    EDITOR_PASSWORD,
    MANAGER_PASSWORD,
    process.env.OWNER_PASSWORD,
    process.env.SESSION_SECRET,
    process.env.MEDIA_READ_WRITE_TOKEN,
    process.env.BLOB_READ_WRITE_TOKEN,
    process.env.BACKUP_SECRET,
    request.phone,
    request.message,
    "Office List Guest",
  ].filter((value): value is string => Boolean(value && value.length >= 6));
  const everyRow = await db.select().from(activity);
  for (const row of everyRow) {
    const stored = `${row.userEmail} ${row.kind} ${row.recordId} ${row.text}`;
    if (secrets.some((secret) => stored.includes(secret))) throw new Error(`Activity row ${row.id} holds a password, a secret, or guest details.`);
  }

  // Rows older than 365 days go when a new row is written. A row of 364 days stays.
  const day = 24 * 60 * 60 * 1000;
  const old = await db
    .insert(activity)
    .values([
      { at: new Date(Date.now() - 366 * day), userId: 0, userEmail: "t37k@travelwithmoeen.test", area: "rates", kind: "margin", text: "T-37k row of 366 days" },
      { at: new Date(Date.now() - 364 * day), userId: 0, userEmail: "t37k@travelwithmoeen.test", area: "rates", kind: "margin", text: "T-37k row of 364 days" },
    ])
    .returning({ id: activity.id, text: activity.text });
  try {
    const pruneSave = await officePost("/api/office/rates", marginForm, managerCookie);
    if (pruneSave.status !== 200) throw new Error(`The Manager's margin save returned ${pruneSave.status}.`);
    const left = await db.select({ text: activity.text }).from(activity).where(eq(activity.userEmail, "t37k@travelwithmoeen.test"));
    if (left.length !== 1 || left[0].text !== "T-37k row of 364 days") throw new Error("Activity rows older than 365 days were not removed, or a newer one was.");
  } finally {
    await db.delete(activity).where(eq(activity.userEmail, "t37k@travelwithmoeen.test"));
  }
  if (old.length !== 2) throw new Error("The old T-37k activity rows were not written.");

  // A backup and a restore keep the activity table.
  if (BACKUP_TABLES.at(-1)?.[0] !== "activity") throw new Error("The activity table is not the last backup table.");
}

// T-45: the database assigns a new photo's id, so adds sent at the same moment all save, each with its
// own id and one activity row.
async function assertParallelPhotoAdds(editorCookie: string) {
  const [shipped] = await db.select({ image: tours.image }).from(tours).where(like(tours.image, "/images/%")).limit(1);
  if (!shipped) throw new Error("No tour has a shipped photo for the T-45 photos.");
  const alts = [1, 2, 3, 4, 5, 6, 7, 8].map((number) => `T-45 parallel photo ${number}`);
  try {
    const replies = await Promise.all(alts.map((alt) => officePost("/api/office/photos", galleryForm({ alt, category: "private", src: shipped.image }), editorCookie)));
    const refused = replies.filter((reply) => reply.status !== 200 || !reply.body.ok);
    if (refused.length) throw new Error(`${refused.length} of ${alts.length} gallery photo adds sent at the same time failed (${refused[0].status}).`);
    const added = await db.select({ id: photos.id, alt: photos.alt }).from(photos).where(like(photos.alt, "T-45 parallel photo %"));
    if (added.length !== alts.length || new Set(added.map((photo) => photo.id)).size !== alts.length) {
      throw new Error(`The parallel adds made ${added.length} photos with ${new Set(added.map((photo) => photo.id)).size} distinct ids.`);
    }
    const rows = await db.select({ recordId: activity.recordId, text: activity.text }).from(activity).where(like(activity.text, "Added gallery photo T-45 parallel photo %"));
    for (const photo of added) {
      const own = rows.filter((row) => row.recordId === String(photo.id));
      if (own.length !== 1 || own[0].text !== `Added gallery photo ${photo.alt}`) throw new Error(`Photo ${photo.id} does not have exactly one activity row.`);
    }
    if (rows.length !== alts.length) throw new Error(`The parallel adds wrote ${rows.length} activity rows for ${alts.length} photos.`);
  } finally {
    await db.delete(photos).where(like(photos.alt, "T-45 parallel photo %"));
    await db.delete(activity).where(like(activity.text, "Added gallery photo T-45 parallel photo %"));
  }
}

const RESTORE_COPY = "travelwithmoeen_restore_check";

function runWithDatabase(command: string, args: string[], databaseUrl: string) {
  return new Promise<{ code: number | null; output: string }>((resolve) => {
    const child = spawn(command, args, { env: { ...process.env, DATABASE_URL: databaseUrl }, shell: process.platform === "win32" });
    let output = "";
    child.stdout.on("data", (chunk) => (output += chunk));
    child.stderr.on("data", (chunk) => (output += chunk));
    child.on("close", (code) => resolve({ code, output }));
  });
}

// One table's rows in a fixed order, so the backup and the copy compare whatever order they come in.
function sortedRows(rows: Record<string, unknown>[]) {
  return rows.map((row) => JSON.stringify(row)).sort();
}

// T-44: a backup restores into a copy database with every table and row, tours included. It runs
// the real npm run db:restore on a copy made for this check, then removes the copy.
async function assertBackupRestoresIntoCopy() {
  const copyUrl = new URL(process.env.DATABASE_URL ?? "");
  copyUrl.pathname = `/${RESTORE_COPY}`;
  const file = await readBackupFile();
  if (file.tables.tours.length === 0) throw new Error("The backup has no tours to restore.");
  // The file holds logins, so it is readable only by this user and removed at the end.
  const folder = mkdtempSync(path.join(os.tmpdir(), "twm-restore-check-"));
  const filePath = path.join(folder, "backup.json");
  writeFileSync(filePath, JSON.stringify(file), { mode: 0o600 });
  await sql.unsafe(`drop database if exists ${RESTORE_COPY} with (force)`);
  await sql.unsafe(`create database ${RESTORE_COPY}`);
  const copySql = postgres(copyUrl.toString(), { max: 1, onnotice: () => {} });
  try {
    const pushed = await runWithDatabase("npx", ["drizzle-kit", "push", "--force"], copyUrl.toString());
    if (pushed.code !== 0) throw new Error(`The copy database did not get its tables: ${pushed.output.slice(-300)}`);
    const restored = await runWithDatabase("npm", ["run", "-s", "db:restore", "--", filePath, "--yes"], copyUrl.toString());
    if (!restored.output.includes(`into ${copyUrl.hostname}/${RESTORE_COPY}`)) throw new Error("The restore did not name the copy database.");
    if (restored.code !== 0 || !restored.output.includes("Restore finished.")) {
      const reason = restored.output.split("\n").find((line) => /(Error|error):/.test(line) && !line.trim().startsWith("at ")) ?? restored.output.slice(-300);
      throw new Error(`The backup did not restore into a copy database: ${reason.trim()}`);
    }
    const copy = drizzle(copySql);
    for (const [name, table] of BACKUP_TABLES) {
      const backedUp = sortedRows(JSON.parse(JSON.stringify(file.tables[name])));
      const inCopy = sortedRows(JSON.parse(JSON.stringify(await copy.select().from(table))));
      if (inCopy.length !== backedUp.length) throw new Error(`The copy has ${inCopy.length} ${name} rows. The backup has ${backedUp.length}.`);
      if (inCopy.some((row, index) => row !== backedUp[index])) throw new Error(`The restored ${name} rows differ from the backup.`);
    }
    // Every table with a serial id carries on after the restored rows. Photos, reviews, and slides
    // have one since T-45.
    const sequenced: string[] = [];
    for (const [name] of BACKUP_TABLES) {
      const [row] = await copySql`select pg_get_serial_sequence(${name}, 'id') as seq`.catch(() => [{ seq: null }]);
      if (!row?.seq) continue;
      sequenced.push(name);
      const [next] = await copySql.unsafe(`select nextval('${row.seq}')::int as id, (select max(id) from ${name})::int as top`);
      if (next.top !== null && next.id <= next.top) throw new Error(`After a restore, a new ${name} row would reuse an id.`);
    }
    if (!["photos", "reviews", "slides", "users"].every((name) => sequenced.includes(name))) {
      throw new Error(`After a restore, these tables have an id sequence: ${sequenced.join(", ")}.`);
    }
  } finally {
    await copySql.end({ timeout: 5 });
    await sql.unsafe(`drop database if exists ${RESTORE_COPY} with (force)`);
    rmSync(folder, { recursive: true, force: true });
  }
}

// T-58 (BR-105, BR-106, BR-111, BR-116, design section 15): the days a package is built from, and
// the Day plans screen and its route.
function assertPackageDaysRules() {
  const place = "T58 Rules Place";
  const section = (text: string) => [{ label: "Morning", text }];
  const plan = (id: number, part: DayPlanRow["part"], position: number, title: string, overnight: string, pricePlace: string | null = null): DayPlanRow => ({
    id,
    place,
    part,
    position,
    title,
    overnight,
    pricePlace,
    sections: section(`${title} from {ORIGIN}.`),
  });
  const plans: DayPlanRow[] = [
    plan(1, "out_air", 0, "Fly {ORIGIN} to Skardu", "Skardu"),
    // Stored out of order on purpose: position decides, not the id.
    plan(5, "middle", 3, "Khaplu", "Khaplu", "T58 Khaplu"),
    plan(2, "middle", 0, "Shigar", "Skardu"),
    plan(3, "middle", 1, "Deosai", "Skardu"),
    plan(4, "middle", 2, "Basho", "Skardu"),
    plan(6, "back_air", 0, "Fly home to {ORIGIN}", "Home"),
    plan(7, "out_road", 0, "Drive {ORIGIN} to Chilas", "Chilas"),
    plan(8, "out_road", 1, "Chilas to Skardu", "Skardu"),
    plan(9, "back_road", 0, "Skardu to Chilas", "Chilas"),
    plan(10, "back_road", 1, "Chilas to {ORIGIN}", "Home"),
    // Another place's day is never used.
    { ...plan(11, "middle", 0, "Other place day", "Hunza"), place: "T58 Other" },
  ];
  const trip = (mode: "air" | "road", days: number) => ({ place, mode, days, startCity: "Lahore" });

  const five = packageDays(trip("air", 5), plans);
  if (!five.ok) throw new Error(`A 5-day air plan was refused: ${five.error}`);
  const fiveTitles = five.days.map((day) => day.title).join(" | ");
  if (fiveTitles !== "Fly Lahore to Skardu | Shigar | Deosai | Basho | Fly home to Lahore") throw new Error(`A 5-day air plan gave: ${fiveTitles}`);
  if (five.days.some((day, index) => day.day !== index + 1 || day.free)) throw new Error("A 5-day air plan numbered its days wrongly or added a free day.");

  const nine = packageDays(trip("air", 9), plans);
  if (!nine.ok) throw new Error(`A 9-day air plan was refused: ${nine.error}`);
  const nineTitles = nine.days.map((day) => day.title);
  const free = nine.days.filter((day) => day.free);
  if (nine.days.length !== 9 || free.length !== 3) throw new Error(`A 9-day air plan gave ${nine.days.length} days with ${free.length} free days.`);
  if (nineTitles.slice(0, 5).join(" | ") !== "Fly Lahore to Skardu | Shigar | Deosai | Basho | Khaplu" || nineTitles[8] !== "Fly home to Lahore") {
    throw new Error(`A 9-day air plan gave: ${nineTitles.join(" | ")}`);
  }
  // The free days come after the middle days, at the last overnight place, priced as that day was.
  for (const [index, day] of nine.days.slice(5, 8).entries()) {
    if (!day.free || day.day !== 6 + index || day.title !== freeDayTitle("Khaplu") || day.overnight !== "Khaplu" || day.pricePlace !== "T58 Khaplu") {
      throw new Error(`Day ${6 + index} of a 9-day plan is not a free day in Khaplu: ${JSON.stringify(day)}`);
    }
    if (day.sections.length !== 1 || day.sections[0].label !== FREE_DAY_LABEL || day.sections[0].text !== FREE_DAY_TEXT) throw new Error("A free day does not have the agreed text.");
  }
  if (freeDayTitle("Khaplu") !== "Free day in Khaplu") throw new Error("The free day title changed.");

  // {ORIGIN} becomes the start city in titles and paragraphs, and nothing is left behind.
  if (JSON.stringify(nine.days).includes("{ORIGIN}")) throw new Error("{ORIGIN} was left in a package day.");
  if (nine.days[0].sections[0].text !== "Fly Lahore to Skardu from Lahore.") throw new Error(`{ORIGIN} was not replaced in a paragraph: ${nine.days[0].sections[0].text}`);
  // A day with no "priced as" is priced at the quote's own place.
  if (nine.days[1].pricePlace !== place || nine.days[4].pricePlace !== "T58 Khaplu") throw new Error("A day's priced-as place is wrong.");

  // By road, the road parts are used. 6 days: 2 out, 2 middle, 2 back.
  const road = packageDays(trip("road", 6), plans);
  if (!road.ok || road.days.map((day) => day.title).join(" | ") !== "Drive Lahore to Chilas | Chilas to Skardu | Shigar | Deosai | Skardu to Chilas | Chilas to Lahore") {
    throw new Error(`A 6-day road plan gave: ${road.ok ? road.days.map((day) => day.title).join(" | ") : road.error}`);
  }
  // Exactly the way out and the way back is allowed, with no middle day.
  const two = packageDays(trip("air", 2), plans);
  if (!two.ok || two.days.map((day) => day.title).join(" | ") !== "Fly Lahore to Skardu | Fly home to Lahore") throw new Error("A 2-day air plan is not the way out and the way back.");
  // Shorter than the way out and the way back: no package, with the lead's message.
  const short = packageDays(trip("road", 3), plans);
  if (short.ok || short.error !== `A ${place} trip by road needs at least 4 days.` || short.minimumDays !== 4) throw new Error(`A 3-day road plan gave: ${JSON.stringify(short)}`);
  if (packageMinimumDays(plans, { place, mode: "road" }) !== 4 || packageMinimumDays(plans, { place, mode: "air" }) !== 2) throw new Error("The fewest days of a trip are wrong.");
  const none = packageDays({ place: "T58 No Plans", mode: "air", days: 5, startCity: "Lahore" }, plans);
  if (none.ok || none.error !== "T58 No Plans has no day plans by air yet.") throw new Error(`A place with no day plans gave: ${JSON.stringify(none)}`);
  // PR 69 review: a place with no way out or no way back for the trip's mode builds no package, so
  // it never starts or ends at a middle day. With only road days, an air trip is refused, and the
  // other way round.
  const roadOnly = plans.filter((row) => row.part !== "out_air" && row.part !== "back_air");
  const airOnRoadDays = packageDays(trip("air", 6), roadOnly);
  if (airOnRoadDays.ok || airOnRoadDays.error !== `${place} has no day plans by air yet.` || airOnRoadDays.minimumDays !== undefined) {
    throw new Error(`An air trip at a place with only road days gave: ${JSON.stringify(airOnRoadDays)}`);
  }
  if (!packageDays(trip("road", 6), roadOnly).ok) throw new Error("A road trip at a place with only road days was refused.");
  const airOnly = plans.filter((row) => row.part !== "out_road" && row.part !== "back_road");
  const roadOnAirDays = packageDays(trip("road", 6), airOnly);
  if (roadOnAirDays.ok || roadOnAirDays.error !== `${place} has no day plans by road yet.`) throw new Error(`A road trip at a place with only air days gave: ${JSON.stringify(roadOnAirDays)}`);
  const noBack = packageDays(trip("air", 5), plans.filter((row) => row.part !== "back_air"));
  if (noBack.ok || noBack.error !== `${place} has no day plans by air yet.`) throw new Error("An air trip with no way back by air was not refused.");
  const noOut = packageDays(trip("air", 5), plans.filter((row) => row.part !== "out_air"));
  if (noOut.ok || noOut.error !== `${place} has no day plans by air yet.`) throw new Error("An air trip with no way out by air was not refused.");
  const middleOnly = packageDays(trip("air", 3), plans.filter((row) => row.part === "middle"));
  if (middleOnly.ok) throw new Error("A place with only middle days built a package.");
  // With no middle days, the free days are at the way out's last overnight place.
  const noMiddle = packageDays(trip("air", 4), plans.filter((row) => row.part !== "middle"));
  if (!noMiddle.ok || noMiddle.days.map((day) => day.title).join(" | ") !== "Fly Lahore to Skardu | Free day in Skardu | Free day in Skardu | Fly home to Lahore") {
    throw new Error("A plan with no middle days did not add free days at the way out's overnight place.");
  }

  // BR-111: a grade's hotel line joins the lines of the places the nights are priced at, in order,
  // once each, and leaves out a blank line and another grade's line.
  const names = [
    { place, grade: "Deluxe", names: "Hotel Himalaya – Kesar Place Skardu" },
    { place: "T58 Khaplu", grade: "Deluxe", names: "North Palace Khaplu" },
    { place, grade: "Luxury", names: "Shangrila Resort" },
  ];
  if (hotelLine(nine.days, "Deluxe", names) !== "Hotel Himalaya – Kesar Place Skardu / North Palace Khaplu") throw new Error(`The Deluxe hotel line is ${hotelLine(nine.days, "Deluxe", names)}.`);
  if (hotelLine(nine.days, "Luxury", names) !== "Shangrila Resort") throw new Error("A place with a blank line was not left out of the hotel line.");
  if (hotelLine(five.days, "Deluxe", names) !== "Hotel Himalaya – Kesar Place Skardu") throw new Error("A place the trip does not stay at is in the hotel line.");
}

type DayPlanReply = { ok?: boolean; error?: string; desk?: { places: string[]; place: string | null; days: DayPlanRow[]; hotelNames: { grade: string; names: string }[] } };

async function dayPlansGet(query: string, cookie: string) {
  const response = await fetch(`${siteBase()}/api/office/day-plans${query}`, { headers: cookie ? { cookie } : {} });
  return { status: response.status, body: (await response.json().catch(() => ({}))) as DayPlanReply };
}

function dayForm(values: Record<string, string | number>, sections: [string, string][] = []) {
  const form = formOf(values);
  for (const [label, text] of sections) {
    form.append("sectionLabel", label);
    form.append("sectionText", text);
  }
  return form;
}

async function assertDayPlans(editorCookie: string, managerCookie: string) {
  assertPackageDaysRules();
  const place = "Skardu Valley";
  const stamp = Date.now();
  const [hotel] = await db.select({ id: hotelRates.id }).from(hotelRates).where(eq(hotelRates.place, place)).limit(1);
  if (!hotel) throw new Error("Skardu Valley has no hotel rate, so it is not a rate place.");
  const [savedLine] = await db.select().from(placeHotelNames).where(and(eq(placeHotelNames.place, place), eq(placeHotelNames.grade, "Deluxe")));
  const before = await db.select({ id: dayPlans.id }).from(dayPlans);
  const testPlace = `T58 Place ${stamp}`;
  const renamedPlace = `T58 Renamed ${stamp}`;
  // A good save writes one activity row. A refused save changes no day and writes no row.
  const saves = async (form: FormData, cookie: string, status: number, what: string, error?: string) => {
    const rowsBefore = await activityCount();
    const daysBefore = JSON.stringify(await db.select().from(dayPlans).orderBy(dayPlans.id));
    const namesBefore = JSON.stringify(await db.select().from(placeHotelNames).orderBy(placeHotelNames.place, placeHotelNames.grade));
    const result = await officePost("/api/office/day-plans", form, cookie);
    if (result.status !== status) throw new Error(`${what} returned ${result.status}, not ${status}: ${result.body.error ?? ""}`);
    if (error && result.body.error !== error) throw new Error(`${what} said "${result.body.error ?? ""}", not "${error}".`);
    const written = (await activityCount()) - rowsBefore;
    if (written !== (status === 200 ? 1 : 0)) throw new Error(`${what} wrote ${written} activity rows.`);
    if (status !== 200) {
      const daysAfter = JSON.stringify(await db.select().from(dayPlans).orderBy(dayPlans.id));
      const namesAfter = JSON.stringify(await db.select().from(placeHotelNames).orderBy(placeHotelNames.place, placeHotelNames.grade));
      if (daysAfter !== daysBefore || namesAfter !== namesBefore) throw new Error(`${what} changed a stored day or hotel line.`);
    }
    return result;
  };
  const middleDays = async () =>
    db.select().from(dayPlans).where(and(eq(dayPlans.place, place), eq(dayPlans.part, "middle"))).orderBy(dayPlans.position, dayPlans.id);
  const lastActivity = async () => (await db.select().from(activity).orderBy(desc(activity.id)).limit(1))[0];

  try {
    // Only a role with the rates permission reads or changes day plans.
    const editorRead = await dayPlansGet("", editorCookie);
    if (editorRead.status !== 403) throw new Error(`An Editor read the day plans with ${editorRead.status}.`);
    const signedOut = await dayPlansGet("", "");
    if (signedOut.status !== 401) throw new Error(`A signed-out read of the day plans returned ${signedOut.status}.`);
    await saves(dayForm({ action: "add", place, part: "middle", title: "T58 Editor day", overnight: "Skardu" }), editorCookie, 403, "An Editor's day add");
    await saves(dayForm({ action: "hotel_names", place, grade: "Deluxe", names: "T58 Editor hotel" }), editorCookie, 403, "An Editor's hotel-names save");
    const editorPage = await officePage("/office/rates/day-plans", editorCookie);
    if (editorPage.status < 300 || editorPage.status >= 400) throw new Error(`The Day plans page gave an Editor ${editorPage.status}, not a redirect.`);

    const read = await dayPlansGet(`?place=${encodeURIComponent(place)}`, managerCookie);
    if (read.status !== 200 || read.body.desk?.place !== place || !read.body.desk.places.includes("Hunza Valley")) throw new Error(`A Manager could not read the Skardu Valley day plans: ${read.status}.`);
    if (read.body.desk.hotelNames.map((row) => row.grade).join(", ") !== "Deluxe, Executive, Luxury, Ultra Luxury") throw new Error("The hotel-names lines are not the four guest grades.");
    const unknown = await dayPlansGet("?place=T58%20Nowhere", managerCookie);
    if (unknown.status !== 400) throw new Error(`A read of a place that is not a rate place returned ${unknown.status}.`);

    // Refused saves, each with its message.
    const good = { action: "add", place, part: "middle", title: `T58 Shigar ${stamp}`, overnight: "Skardu" };
    await saves(dayForm({ ...good, title: " " }), managerCookie, 400, "A day with no title", "Enter the day title.");
    await saves(dayForm({ ...good, title: "t".repeat(121) }), managerCookie, 400, "A title of 121 characters", "Enter the day title of 120 characters or less.");
    await saves(dayForm({ ...good, overnight: "" }), managerCookie, 400, "A day with no overnight place", "Enter the overnight place.");
    await saves(dayForm({ ...good, overnight: "o".repeat(61) }), managerCookie, 400, "An overnight place of 61 characters");
    await saves(dayForm({ ...good, pricePlace: "Skardu" }), managerCookie, 400, "A day priced as a place with no rates", "Choose a rate place to price the night at, or leave it blank.");
    await saves(dayForm({ ...good, part: "middle_air" }), managerCookie, 400, "A day in an unknown part", "Choose a part of the trip.");
    await saves(dayForm({ ...good, place: "T58 Nowhere" }), managerCookie, 400, "A day for a place with no rates", "That place was not found.");
    await saves(dayForm(good, [1, 2, 3, 4, 5, 6, 7].map((number) => [`Part ${number}`, "Text"] as [string, string])), managerCookie, 400, "A day with 7 paragraphs", "A day can have up to 6 paragraphs.");
    await saves(dayForm(good, [["", "Text with no label"]]), managerCookie, 400, "A paragraph with no label");
    await saves(dayForm(good, [["Morning", ""]]), managerCookie, 400, "A label with no paragraph");
    await saves(dayForm(good, [["l".repeat(31), "Text"]]), managerCookie, 400, "A label of 31 characters");
    await saves(dayForm(good, [["Morning", "p".repeat(2001)]]), managerCookie, 400, "A paragraph of 2,001 characters");
    await saves(dayForm({ ...good, action: "rename" }), managerCookie, 400, "An unknown action", "Choose what to save.");
    const lopsided = dayForm(good, [["Morning", "Text"]]);
    lopsided.append("sectionLabel", "Evening");
    await saves(lopsided, managerCookie, 400, "Labels and paragraphs that do not pair up", "Send the form again.");
    await saves(dayForm({ action: "update", id: "abc", title: "T58", overnight: "Skardu" }), managerCookie, 400, "A change with a bad id", "That day was not found.");
    await saves(dayForm({ action: "delete", id: 999999 }), managerCookie, 400, "A delete of a missing day", "That day was not found.");

    // A Manager adds two middle days, the second with labelled paragraphs, {ORIGIN}, and a
    // priced-as place. Blank paragraph pairs are dropped and line breaks kept.
    const first = await saves(dayForm(good, [["Morning", "Shigar Fort."], ["", ""]]), managerCookie, 200, "A Manager's first day add");
    if (first.body.ok !== true) throw new Error("A Manager's day add did not answer ok.");
    const secondTitle = `T58 Khaplu ${stamp}`;
    await saves(
      dayForm({ ...good, title: `  ${secondTitle}  `, overnight: "Khaplu", pricePlace: "Hunza Valley" }, [["Morning", "Leave {ORIGIN}\r\nearly."], ["Evening", "Khaplu Palace."]]),
      managerCookie,
      200,
      "A Manager's second day add",
    );
    let middle = await middleDays();
    const firstRow = middle.find((row) => row.title === good.title);
    const secondRow = middle.find((row) => row.title === secondTitle);
    if (!firstRow || !secondRow) throw new Error("The added days were not stored.");
    if (firstRow.sections.length !== 1 || firstRow.pricePlace !== null) throw new Error("A blank paragraph pair was stored, or a blank priced-as was not stored as none.");
    if (secondRow.overnight !== "Khaplu" || secondRow.pricePlace !== "Hunza Valley" || secondRow.sections.map((section) => `${section.label}: ${section.text}`).join(" | ") !== "Morning: Leave {ORIGIN}\nearly. | Evening: Khaplu Palace.") {
      throw new Error(`The second day was stored as ${JSON.stringify(secondRow)}.`);
    }
    if (middle.indexOf(secondRow) !== middle.indexOf(firstRow) + 1) throw new Error("A new day was not added at the end of its part.");
    const added = await lastActivity();
    if (added?.area !== "rates" || added.kind !== "day_plan" || added.recordId !== String(secondRow.id) || added.text !== `Added day ${secondTitle} to ${place}, middle days`) {
      throw new Error(`The add activity row is ${JSON.stringify(added)}.`);
    }

    // The second day moves up, above the first, and the part is numbered again from 0.
    await saves(dayForm({ action: "move", id: secondRow.id, direction: "up" }), managerCookie, 200, "Moving a day up");
    middle = await middleDays();
    if (middle.findIndex((row) => row.id === secondRow.id) !== middle.findIndex((row) => row.id === firstRow.id) - 1) throw new Error("Moving a day up did not put it above the day before.");
    if (middle.some((row, index) => row.position !== index)) throw new Error(`After a move, the middle days are at ${middle.map((row) => row.position).join(", ")}.`);
    const moved = await lastActivity();
    if (moved?.kind !== "day_plan" || !moved.text.startsWith(`Moved day ${secondTitle} up to day `)) throw new Error(`The move activity row is ${moved?.text}.`);
    await saves(dayForm({ action: "move", id: middle[0].id, direction: "up" }), managerCookie, 400, "Moving the first day up", "That day is already first.");
    await saves(dayForm({ action: "move", id: middle.at(-1)?.id ?? 0, direction: "down" }), managerCookie, 400, "Moving the last day down", "That day is already last.");
    await saves(dayForm({ action: "move", id: secondRow.id, direction: "sideways" }), managerCookie, 400, "A move with no direction", "Choose up or down.");

    // It is changed: a new title, no priced-as place, one paragraph. Its part and place stay.
    const changedTitle = `T58 Khaplu changed ${stamp}`;
    await saves(dayForm({ action: "update", id: secondRow.id, place: "Hunza Valley", part: "out_air", title: changedTitle, overnight: "Khaplu", pricePlace: "" }, [["Day", "One paragraph."]]), managerCookie, 200, "Changing a day");
    const [changed] = await db.select().from(dayPlans).where(eq(dayPlans.id, secondRow.id));
    if (!changed || changed.title !== changedTitle || changed.pricePlace !== null || changed.place !== place || changed.part !== "middle" || changed.sections.length !== 1) {
      throw new Error(`The changed day is ${JSON.stringify(changed)}.`);
    }
    const changeRow = await lastActivity();
    if (changeRow?.text !== `Changed day ${changedTitle}, ${place}, middle days` || changeRow.recordId !== String(secondRow.id)) throw new Error(`The change activity row is ${changeRow?.text}.`);

    // The screen lists the day, and the Day plans tab is on the rates pages.
    const page = await officePage(`/office/rates/day-plans?place=${encodeURIComponent(place)}`, managerCookie);
    if (page.status !== 200 || !page.html.includes(changedTitle) || !page.html.includes("Way out by air") || !page.html.includes("Hotel names")) throw new Error(`The Day plans page for a Manager returned ${page.status} without the day.`);
    const ratesPage = await officePage("/office/rates", managerCookie);
    if (!ratesPage.html.includes('href="/office/rates/day-plans"')) throw new Error("The rates pages have no Day plans tab.");
    const otherPlace = await officePage("/office/rates/day-plans?place=T58%20Nowhere", managerCookie);
    if (otherPlace.status < 300 || otherPlace.status >= 400) throw new Error(`The Day plans page for an unknown place returned ${otherPlace.status}, not a redirect.`);

    // Both days are deleted, each with one activity row.
    await saves(dayForm({ action: "delete", id: secondRow.id }), managerCookie, 200, "Deleting a day");
    const deleted = await lastActivity();
    if (deleted?.text !== `Deleted day ${changedTitle}, ${place}, middle days`) throw new Error(`The delete activity row is ${deleted?.text}.`);
    await saves(dayForm({ action: "delete", id: firstRow.id }), managerCookie, 200, "Deleting the other day");
    if ((await db.select().from(dayPlans).where(inArray(dayPlans.id, [firstRow.id, secondRow.id]))).length !== 0) throw new Error("A deleted day is still stored.");

    // BR-111: the Skardu Valley Deluxe line is set, changed, and cleared, one row each. Premier and
    // an unknown grade are refused, and a line of 301 characters.
    const names = (value: string, grade = "Deluxe") => dayForm({ action: "hotel_names", place, grade, names: value });
    await saves(names("x", "Premier"), managerCookie, 400, "A Premier hotel-names line", "Choose Deluxe, Executive, Luxury, or Ultra Luxury.");
    await saves(names("x", "Gold"), managerCookie, 400, "A hotel-names line for an unknown grade");
    await saves(names("h".repeat(301)), managerCookie, 400, "A hotel-names line of 301 characters", "Enter the hotel names of 300 characters or less.");
    await saves(dayForm({ action: "hotel_names", place: "T58 Nowhere", grade: "Deluxe", names: "x" }), managerCookie, 400, "A hotel-names line for a place with no rates");
    const line = "Hotel Himalaya – Kesar Place Skardu";
    await saves(names(`  ${line}  `), managerCookie, 200, "Setting the Skardu Valley Deluxe hotel names");
    const stored = async () => (await db.select().from(placeHotelNames).where(and(eq(placeHotelNames.place, place), eq(placeHotelNames.grade, "Deluxe"))))[0];
    if ((await stored())?.names !== line) throw new Error("The Skardu Valley Deluxe hotel names were not stored, trimmed.");
    const setRow = await lastActivity();
    if (setRow?.kind !== "hotel_names" || setRow.area !== "rates" || setRow.recordId !== `${place}: Deluxe` || setRow.text !== `Saved the hotel names for ${place}, Deluxe`) throw new Error(`The hotel-names activity row is ${JSON.stringify(setRow)}.`);
    const shown = await dayPlansGet(`?place=${encodeURIComponent(place)}`, managerCookie);
    if (shown.body.desk?.hotelNames.find((row) => row.grade === "Deluxe")?.names !== line) throw new Error("GET /api/office/day-plans does not show the saved hotel names.");
    await saves(names(`${line} / North Palace`), managerCookie, 200, "Changing the Skardu Valley Deluxe hotel names");
    if ((await stored())?.names !== `${line} / North Palace`) throw new Error("A changed hotel-names line was not stored.");
    await saves(names("   "), managerCookie, 200, "Clearing the Skardu Valley Deluxe hotel names");
    if (await stored()) throw new Error("A blank hotel-names line is still stored.");
    if ((await lastActivity())?.text !== `Cleared the hotel names for ${place}, Deluxe`) throw new Error("Clearing a hotel-names line did not write its own activity row.");

    // BR-90: renaming a rate place renames its days, the days priced as it, and its hotel names.
    await db.insert(hotelRates).values({ place: testPlace, startCity: "Air", grade: "Deluxe", twin: 1000, triple: 1200 });
    await saves(dayForm({ action: "add", place: testPlace, part: "middle", title: `T58 Rename day ${stamp}`, overnight: "Town", pricePlace: testPlace }), managerCookie, 200, "A day for the place to rename");
    await saves(dayForm({ action: "add", place, part: "back_air", title: `T58 Priced elsewhere ${stamp}`, overnight: "Town", pricePlace: testPlace }), managerCookie, 200, "A Skardu Valley day priced as the place to rename");
    await saves(dayForm({ action: "hotel_names", place: testPlace, grade: "Luxury", names: "T58 Rename Hotel" }), managerCookie, 200, "Hotel names for the place to rename");
    const rename = await officePost("/api/office/rates", formOf({ kind: "place_rename", place: testPlace, name: renamedPlace }), managerCookie);
    if (rename.status !== 200) throw new Error(`Renaming the test place returned ${rename.status}: ${rename.body.error ?? ""}`);
    const renamedDays = await db.select().from(dayPlans).where(like(dayPlans.title, `T58 % ${stamp}`));
    if (renamedDays.length !== 2 || renamedDays.some((row) => row.pricePlace !== renamedPlace) || !renamedDays.some((row) => row.place === renamedPlace)) {
      throw new Error(`After a rename, the days are ${JSON.stringify(renamedDays)}.`);
    }
    const renamedNames = await db.select().from(placeHotelNames).where(eq(placeHotelNames.place, renamedPlace));
    if (renamedNames.length !== 1 || renamedNames[0].names !== "T58 Rename Hotel") throw new Error("A rename did not move the hotel-names line.");

    // The package tables are backed up before activity, and quote_packages after quotes.
    const tables: string[] = BACKUP_TABLES.map(([name]) => name);
    for (const name of ["day_plans", "place_hotel_names", "package_options", "package_sections", "quote_packages"]) {
      if (tables.indexOf(name) < 0 || tables.indexOf(name) > tables.indexOf("activity")) throw new Error(`${name} is not in BACKUP_TABLES before activity.`);
    }
    if (tables.indexOf("quote_packages") < tables.indexOf("quotes")) throw new Error("quote_packages is backed up before the quotes it points at.");
  } finally {
    const kept = before.map((row) => row.id);
    const added = await db.select({ id: dayPlans.id }).from(dayPlans);
    const extra = added.map((row) => row.id).filter((id) => !kept.includes(id));
    if (extra.length) await db.delete(dayPlans).where(inArray(dayPlans.id, extra));
    await db.delete(placeHotelNames).where(inArray(placeHotelNames.place, [testPlace, renamedPlace]));
    await db.delete(hotelRates).where(inArray(hotelRates.place, [testPlace, renamedPlace]));
    await db.delete(placeHotelNames).where(and(eq(placeHotelNames.place, place), eq(placeHotelNames.grade, "Deluxe")));
    if (savedLine) await db.insert(placeHotelNames).values(savedLine);
  }
}

// T-58: the restore check copies a row of each package table, so the jsonb and array columns are
// restored too, not only empty tables. The rows are removed after.
async function withPackageRows(run: () => Promise<void>) {
  const [quote] = await db.select({ id: quotes.id }).from(quotes).limit(1);
  const marker = `T58 restore ${Date.now()}`;
  const [day] = await db
    .insert(dayPlans)
    .values({ place: marker, part: "middle", position: 0, title: marker, overnight: "Skardu", pricePlace: "Skardu Valley", sections: [{ label: "Morning", text: "Leave {ORIGIN}." }] })
    .returning({ id: dayPlans.id });
  await db.insert(placeHotelNames).values({ place: marker, grade: "Deluxe", names: "Hotel Himalaya – Kesar Place Skardu" });
  const [option] = await db
    .insert(packageOptions)
    .values({ name: marker, places: ["Skardu Valley", "Hunza Valley"], dayOne: { label: "Autumn", text: "Golden trees." }, swapFrom: "Deosai", swapTo: day.id, restDays: true, badge: "Autumn", intro: "Intro", notIncluded: ["Travel insurance"], sortOrder: 1 })
    .returning({ id: packageOptions.id });
  const [section] = await db.insert(packageSections).values({ title: marker, kind: "rows", body: [["Check-in", "2 pm"]], sortOrder: 1 }).returning({ id: packageSections.id });
  const hadPackage = quote ? (await db.select().from(quotePackages).where(eq(quotePackages.quoteId, quote.id))).length > 0 : true;
  if (quote && !hadPackage) await db.insert(quotePackages).values({ quoteId: quote.id, title: marker, allGrades: true, flightNote: false, optionIds: [option.id], pictures: ["/images/a.jpg", "/images/b.jpg"] });
  try {
    await run();
  } finally {
    if (quote && !hadPackage) await db.delete(quotePackages).where(eq(quotePackages.quoteId, quote.id));
    await db.delete(packageSections).where(eq(packageSections.id, section.id));
    await db.delete(packageOptions).where(eq(packageOptions.id, option.id));
    await db.delete(placeHotelNames).where(eq(placeHotelNames.place, marker));
    await db.delete(dayPlans).where(eq(dayPlans.id, day.id));
  }
}

// T-41: an office save with no body is a 400, not a 500. With no session it is still a 401.
async function assertEmptyOfficeSave(editorCookie: string) {
  const empty = await fetch(`${siteBase()}/api/office/tours`, { method: "POST", headers: { cookie: editorCookie } });
  const emptyBody = (await empty.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (empty.status !== 400 || emptyBody.error !== "Send the form again.") throw new Error(`A signed-in save with no body returned ${empty.status}.`);
  const notForm = await fetch(`${siteBase()}/api/office/rates`, {
    method: "POST",
    headers: { cookie: editorCookie, "content-type": "application/json" },
    body: JSON.stringify({ kind: "season", percent: "20" }),
  });
  if (notForm.status !== 400) throw new Error(`A signed-in save that is not a form returned ${notForm.status}.`);
  const signedOut = await fetch(`${siteBase()}/api/office/tours`, { method: "POST" });
  if (signedOut.status !== 401) throw new Error(`A save with no body and no session returned ${signedOut.status}.`);
}

// T-37b: the session reply carries the sidebar count of new requests, and only with a session.
async function assertSessionRequestCount(ownerCookie: string) {
  const [row] = await db.select({ total: count() }).from(guestRequests).where(eq(guestRequests.status, "new"));
  const expected = row?.total ?? 0;
  const signedIn = await fetch(`${siteBase()}/api/office/session`, { headers: { cookie: ownerCookie } });
  const body = (await signedIn.json()) as { ok?: boolean; newRequestCount?: unknown };
  if (signedIn.status !== 200 || !body.ok || body.newRequestCount !== expected) {
    throw new Error(`The session reply has newRequestCount ${String(body.newRequestCount)}, not ${expected}.`);
  }
  const signedOut = await fetch(`${siteBase()}/api/office/session`);
  const outText = await signedOut.text();
  if (signedOut.status !== 401 || outText.includes("newRequestCount")) {
    throw new Error(`Without a session the session reply returned ${signedOut.status} or a request count.`);
  }
}

// T-37a: the Meadow shell shows each role only the links it may use.
async function assertOfficeShellLinks(editorCookie: string, managerCookie: string, ownerCookie: string) {
  const cookies = { owner: ownerCookie, manager: managerCookie, editor: editorCookie };
  for (const role of ["owner", "manager", "editor"] as const) {
    const page = await officeGet("/office", cookies[role]);
    if (page.status !== 200) throw new Error(`The ${role} office page returned ${page.status}.`);
    const shown = sidebarLinks(page.text).join(" ");
    const expected = OFFICE_LINKS_BY_ROLE[role].join(" ");
    if (shown !== expected) throw new Error(`The ${role} sidebar shows ${shown || "no links"}, not ${expected}.`);
    if (page.text.includes("Trip plans") || page.text.includes("View as")) {
      throw new Error(`The ${role} office shows a prototype-only control.`);
    }
  }
}

function assertBookNowOpensOnClick() {
  const source = readFileSync(new URL("../components/tours/TourDetail.tsx", import.meta.url), "utf8");
  if (!source.includes(WHATSAPP) || source.includes("preventDefault") || source.includes("window.open")) {
    throw new Error("Book Now must open the WhatsApp link on the click.");
  }
}

// T-56 (design section 14a): the check runs only against the local media stand-in, never a Vercel
// store. It stops before its first request otherwise, and prints the store id, never the token.
function assertLocalStandIn() {
  const apiUrl = process.env.VERCEL_BLOB_API_URL?.trim() ?? "";
  let local = false;
  try {
    const host = new URL(apiUrl).hostname;
    local = host === "localhost" || host === "127.0.0.1";
  } catch {
    local = false;
  }
  const storeId = (process.env.MEDIA_READ_WRITE_TOKEN ?? "").split("_")[3] ?? "";
  const backupToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
  if (!local || storeId !== "localtest" || backupToken) {
    console.error(`Media store id: ${storeId || "(none)"}. VERCEL_BLOB_API_URL: ${apiUrl || "(not set)"}.${backupToken ? " BLOB_READ_WRITE_TOKEN is set." : ""}`);
    throw new Error("check-step3 runs only against the local media stand-in. See design section 14a.");
  }
}

// Every file in the stand-in that was not there when the check started is one the check uploaded,
// through the site or directly. They are all removed at the end, and on Ctrl+C.
async function storedNames() {
  const names = new Set<string>();
  let cursor: string | undefined;
  do {
    const page = await list({ token: process.env.MEDIA_READ_WRITE_TOKEN, cursor });
    for (const blob of page.blobs) names.add(blob.pathname);
    cursor = page.cursor;
  } while (cursor);
  return names;
}

async function removeUploadsSince(before: Set<string>) {
  const added = [...(await storedNames())].filter((name) => !before.has(name));
  if (added.length) await del(added, { token: process.env.MEDIA_READ_WRITE_TOKEN });
}

async function main() {
  assertLocalStandIn();
  let storedAtStart: Set<string>;
  try {
    storedAtStart = await storedNames();
  } catch {
    throw new Error("The local media stand-in did not answer. Start it with npm run blob:local.");
  }
  process.once("SIGINT", () => {
    removeUploadsSince(storedAtStart)
      .catch(() => console.error("Some uploaded files could not be removed from .local-blob/."))
      .finally(() => process.exit(130));
  });
  try {
    await checkSteps();
  } finally {
    await removeUploadsSince(storedAtStart);
  }
}

async function checkSteps() {
  // The checks' own office saves write activity rows. They are removed at the end, with the other
  // test data, so a run leaves the activity record as it found it.
  const [activityStart] = await db.select({ id: max(activity.id) }).from(activity);
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
    await assertBookingOnOfficeList(booking.body.id, `${marker} booking`);

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
    await withPackageRows(assertBackupRestoresIntoCopy);
    console.log("Step 3 checks passed.");
  } finally {
    for (const id of savedIds) {
      await db.delete(guestRequests).where(eq(guestRequests.id, id));
    }
    await db.delete(activity).where(gt(activity.id, activityStart?.id ?? 0));
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
