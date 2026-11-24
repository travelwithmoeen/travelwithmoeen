import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { dayPlans, placeHotelNames } from "@/lib/db/schema";
import { can } from "@/lib/auth/permissions";
import type { SessionUser } from "@/lib/auth/session";
import { forbidden, type ActionResult } from "@/lib/http/result";
import { recordActivity } from "@/lib/office/activity";
import { lockRateNames, ratePlaces, type Transaction } from "@/lib/office/rates";
import { readRecordId } from "@/lib/office/record-id";
import { DAY_PLAN_LIMITS, DAY_PLAN_PART_LABELS, DAY_PLAN_PARTS, type DayPlanPart, type DayPlanRow, type DayPlanSection } from "@/lib/package";
import { GUEST_GRADES } from "@/lib/quote";

// T-58 (BR-105, BR-111, BR-116, design section 15): the day plans of each rate place and its
// hotel-names lines. Owner and Manager only, through the rates permission. Each save writes one
// activity row in area rates.

type Read<T> = { ok: true; value: T } | { ok: false; error: string };

function oneLine(value: FormDataEntryValue | null) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

function readLine(value: FormDataEntryValue | null, label: string, max: number, required = true): Read<string> {
  const text = oneLine(value);
  if (!text && required) return { ok: false, error: `Enter ${label}.` };
  if (text.length > max) return { ok: false, error: `Enter ${label} of ${max} characters or less.` };
  return { ok: true, value: text };
}

function isPart(value: string): value is DayPlanPart {
  return (DAY_PLAN_PARTS as readonly string[]).includes(value);
}

function partLabel(part: DayPlanPart) {
  return DAY_PLAN_PART_LABELS[part].toLowerCase();
}

// The labelled paragraphs, from the sectionLabel and sectionText fields in order. A pair left blank
// is dropped. A paragraph keeps its line breaks.
function readSections(formData: FormData): Read<DayPlanSection[]> {
  const labels = formData.getAll("sectionLabel");
  const texts = formData.getAll("sectionText");
  if (labels.length !== texts.length) return { ok: false, error: "Send the form again." };
  const sections: DayPlanSection[] = [];
  for (let index = 0; index < labels.length; index += 1) {
    const label = oneLine(labels[index]);
    const text = String(texts[index] ?? "")
      .replace(/\r\n?/g, "\n")
      .trim();
    if (!label && !text) continue;
    if (!label) return { ok: false, error: `Enter a label for paragraph ${index + 1}, such as Morning.` };
    if (!text) return { ok: false, error: `Enter the text of the ${label} paragraph.` };
    if (label.length > DAY_PLAN_LIMITS.label) return { ok: false, error: `Enter a label of ${DAY_PLAN_LIMITS.label} characters or less.` };
    if (text.length > DAY_PLAN_LIMITS.text) return { ok: false, error: `Enter a paragraph of ${DAY_PLAN_LIMITS.text.toLocaleString("en-US")} characters or less.` };
    sections.push({ label, text });
  }
  if (sections.length > DAY_PLAN_LIMITS.sections) return { ok: false, error: `A day can have up to ${DAY_PLAN_LIMITS.sections} paragraphs.` };
  return { ok: true, value: sections };
}

type DayFields = { title: string; overnight: string; pricePlace: string | null; sections: DayPlanSection[] };

// The fields of a day. "Priced as" is blank for the quote's own place, or one of the rate places.
function readDay(formData: FormData, places: string[]): Read<DayFields> {
  const title = readLine(formData.get("title"), "the day title", DAY_PLAN_LIMITS.title);
  if (!title.ok) return title;
  const overnight = readLine(formData.get("overnight"), "the overnight place", DAY_PLAN_LIMITS.overnight);
  if (!overnight.ok) return overnight;
  const pricedText = oneLine(formData.get("pricePlace"));
  if (pricedText && !places.includes(pricedText)) return { ok: false, error: "Choose a rate place to price the night at, or leave it blank." };
  const sections = readSections(formData);
  if (!sections.ok) return sections;
  return { ok: true, value: { title: title.value, overnight: overnight.value, pricePlace: pricedText || null, sections: sections.value } };
}

function toRow(row: typeof dayPlans.$inferSelect): DayPlanRow {
  return {
    id: row.id,
    place: row.place,
    part: row.part,
    position: row.position,
    title: row.title,
    overnight: row.overnight,
    pricePlace: row.pricePlace,
    sections: row.sections,
  };
}

async function partDays(reader: typeof db | Transaction, place: string, part: DayPlanPart) {
  return reader
    .select()
    .from(dayPlans)
    .where(and(eq(dayPlans.place, place), eq(dayPlans.part, part)))
    .orderBy(asc(dayPlans.position), asc(dayPlans.id));
}

export type DayPlanDesk = {
  places: string[];
  place: string | null;
  days: DayPlanRow[];
  hotelNames: { grade: string; names: string }[];
};

// GET /api/office/day-plans: the rate places, and the days and hotel-names lines of the place asked
// for, or of the first place.
export async function loadDayPlansAs(actor: SessionUser, asked: string | null) {
  if (!can(actor, "rates.edit")) return forbidden("You cannot read the day plans.");
  const places = (await ratePlaces()).sort((a, b) => a.localeCompare(b));
  const place = asked ? (places.find((name) => name === asked) ?? null) : (places[0] ?? null);
  if (asked && !place) return { ok: false as const, error: "That place was not found." };
  const desk: DayPlanDesk = { places, place, days: [], hotelNames: [] };
  if (place) {
    const [days, names] = await Promise.all([
      db.select().from(dayPlans).where(eq(dayPlans.place, place)).orderBy(asc(dayPlans.part), asc(dayPlans.position), asc(dayPlans.id)),
      db.select().from(placeHotelNames).where(eq(placeHotelNames.place, place)),
    ]);
    desk.days = days.map(toRow);
    desk.hotelNames = GUEST_GRADES.map((grade) => ({ grade, names: names.find((row) => row.grade === grade)?.names ?? "" }));
  }
  return { ok: true as const, desk };
}

async function addDay(tx: Transaction, actor: SessionUser, formData: FormData, places: string[]): Promise<ActionResult> {
  const place = oneLine(formData.get("place"));
  if (!places.includes(place)) return { ok: false, error: "That place was not found." };
  const part = String(formData.get("part") ?? "");
  if (!isPart(part)) return { ok: false, error: "Choose a part of the trip." };
  const day = readDay(formData, places);
  if (!day.ok) return day;
  const current = await partDays(tx, place, part);
  if (current.length >= DAY_PLAN_LIMITS.daysPerPart) return { ok: false, error: `A part can have up to ${DAY_PLAN_LIMITS.daysPerPart} days.` };
  const position = (current.at(-1)?.position ?? -1) + 1;
  const [row] = await tx
    .insert(dayPlans)
    .values({ place, part, position, ...day.value })
    .returning({ id: dayPlans.id });
  if (!row) return { ok: false, error: "The day could not be added." };
  await recordActivity(tx, actor, { kind: "day_plan", recordId: row.id, text: `Added day ${day.value.title} to ${place}, ${partLabel(part)}` });
  return { ok: true, message: `Day added: ${day.value.title}.` };
}

async function findDay(tx: Transaction, formData: FormData) {
  const id = readRecordId(formData.get("id"));
  if (id === null) return null;
  const [row] = await tx.select().from(dayPlans).where(eq(dayPlans.id, id)).limit(1);
  return row ?? null;
}

async function updateDay(tx: Transaction, actor: SessionUser, formData: FormData, places: string[]): Promise<ActionResult> {
  const row = await findDay(tx, formData);
  if (!row) return { ok: false, error: "That day was not found." };
  const day = readDay(formData, places);
  if (!day.ok) return day;
  await tx.update(dayPlans).set(day.value).where(eq(dayPlans.id, row.id));
  await recordActivity(tx, actor, { kind: "day_plan", recordId: row.id, text: `Changed day ${day.value.title}, ${row.place}, ${partLabel(row.part)}` });
  return { ok: true, message: `Day saved: ${day.value.title}.` };
}

async function deleteDay(tx: Transaction, actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const row = await findDay(tx, formData);
  if (!row) return { ok: false, error: "That day was not found." };
  await tx.delete(dayPlans).where(eq(dayPlans.id, row.id));
  await recordActivity(tx, actor, { kind: "day_plan", recordId: row.id, text: `Deleted day ${row.title}, ${row.place}, ${partLabel(row.part)}` });
  return { ok: true, message: `Day deleted: ${row.title}.` };
}

// Moves a day one place up or down in its part. The part's days are numbered again from 0, so two
// days never share a place.
async function moveDay(tx: Transaction, actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const row = await findDay(tx, formData);
  if (!row) return { ok: false, error: "That day was not found." };
  const direction = String(formData.get("direction") ?? "");
  if (direction !== "up" && direction !== "down") return { ok: false, error: "Choose up or down." };
  const days = await partDays(tx, row.place, row.part);
  const from = days.findIndex((day) => day.id === row.id);
  const to = direction === "up" ? from - 1 : from + 1;
  if (to < 0 || to >= days.length) return { ok: false, error: direction === "up" ? "That day is already first." : "That day is already last." };
  const order = [...days];
  [order[from], order[to]] = [order[to], order[from]];
  for (const [position, day] of order.entries()) {
    if (day.position !== position) await tx.update(dayPlans).set({ position }).where(eq(dayPlans.id, day.id));
  }
  await recordActivity(tx, actor, {
    kind: "day_plan",
    recordId: row.id,
    text: `Moved day ${row.title} ${direction} to day ${to + 1}, ${row.place}, ${partLabel(row.part)}`,
  });
  return { ok: true, message: `Day moved ${direction}: ${row.title}.` };
}

// BR-111: one line for each place and guest grade. Premier is stored on the rates but never offered
// (BR-18), so it has no line. A blank line removes the stored one.
async function saveHotelNames(tx: Transaction, actor: SessionUser, formData: FormData, places: string[]): Promise<ActionResult> {
  const place = oneLine(formData.get("place"));
  if (!places.includes(place)) return { ok: false, error: "That place was not found." };
  const grade = oneLine(formData.get("grade"));
  if (!(GUEST_GRADES as readonly string[]).includes(grade)) return { ok: false, error: "Choose Deluxe, Executive, Luxury, or Ultra Luxury." };
  const names = readLine(formData.get("names"), "the hotel names", DAY_PLAN_LIMITS.hotelNames, false);
  if (!names.ok) return names;
  const recordId = `${place}: ${grade}`;
  if (!names.value) {
    await tx.delete(placeHotelNames).where(and(eq(placeHotelNames.place, place), eq(placeHotelNames.grade, grade)));
    await recordActivity(tx, actor, { kind: "hotel_names", recordId, text: `Cleared the hotel names for ${place}, ${grade}` });
    return { ok: true, message: `Hotel names cleared: ${place}, ${grade}.` };
  }
  await tx
    .insert(placeHotelNames)
    .values({ place, grade, names: names.value })
    .onConflictDoUpdate({ target: [placeHotelNames.place, placeHotelNames.grade], set: { names: names.value } });
  await recordActivity(tx, actor, { kind: "hotel_names", recordId, text: `Saved the hotel names for ${place}, ${grade}` });
  return { ok: true, message: `Hotel names saved: ${place}, ${grade}.` };
}

// POST /api/office/day-plans. Each save takes the rate-names lock, as a place rename does, so a save
// and a rename at the same moment run one after the other, and two moves never number a part twice.
export async function saveDayPlanAs(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  if (!can(actor, "rates.edit")) return forbidden("You cannot change the day plans.");
  const action = String(formData.get("action") ?? "");
  if (!["add", "update", "delete", "move", "hotel_names"].includes(action)) return { ok: false, error: "Choose what to save." };
  return db.transaction(async (tx): Promise<ActionResult> => {
    await lockRateNames(tx);
    const places = await ratePlaces(tx);
    if (action === "add") return addDay(tx, actor, formData, places);
    if (action === "update") return updateDay(tx, actor, formData, places);
    if (action === "delete") return deleteDay(tx, actor, formData);
    if (action === "move") return moveDay(tx, actor, formData);
    return saveHotelNames(tx, actor, formData, places);
  });
}
