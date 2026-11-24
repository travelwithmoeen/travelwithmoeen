import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { dayPlans, packageOptions } from "@/lib/db/schema";
import { can } from "@/lib/auth/permissions";
import type { SessionUser } from "@/lib/auth/session";
import { forbidden, type ActionResult } from "@/lib/http/result";
import { recordActivity } from "@/lib/office/activity";
import { oneLine, readLine, type Read } from "@/lib/office/day-plans";
import { lockRateNames, ratePlaces, type Transaction } from "@/lib/office/rates";
import { readRecordId } from "@/lib/office/record-id";
import { DAY_PLAN_LIMITS, PACKAGE_OPTION_LIMITS, type DayPlanSection, type PackageOption } from "@/lib/package";

// T-59 (BR-107, BR-116, design section 15): the package options staff add, change, order, and
// delete. Owner and Manager only, through the rates permission. Each save writes one activity row in
// area rates.

export type SwapDay = { id: number; place: string; title: string };

export type PackageOptionDesk = {
  options: PackageOption[];
  places: string[];
  // Every middle day, for the swap fields: the day to swap to, and the titles at its place.
  middleDays: SwapDay[];
};

function toOption(row: typeof packageOptions.$inferSelect): PackageOption {
  return {
    id: row.id,
    name: row.name,
    places: row.places,
    dayOne: row.dayOne ?? null,
    swapFrom: row.swapFrom,
    swapTo: row.swapTo,
    restDays: row.restDays,
    badge: row.badge,
    intro: row.intro,
    notIncluded: row.notIncluded,
    sortOrder: row.sortOrder,
  };
}

async function storedOptions(reader: typeof db | Transaction) {
  return (await reader.select().from(packageOptions).orderBy(asc(packageOptions.sortOrder), asc(packageOptions.id))).map(toOption);
}

// GET /api/office/package-options.
export async function loadPackageOptionsAs(actor: SessionUser) {
  if (!can(actor, "rates.edit")) return forbidden("You cannot read the package options.");
  const [options, places, middle] = await Promise.all([
    storedOptions(db),
    ratePlaces(),
    db
      .select({ id: dayPlans.id, place: dayPlans.place, title: dayPlans.title })
      .from(dayPlans)
      .where(eq(dayPlans.part, "middle"))
      .orderBy(asc(dayPlans.place), asc(dayPlans.position), asc(dayPlans.id)),
  ]);
  const desk: PackageOptionDesk = { options, places: places.sort((a, b) => a.localeCompare(b)), middleDays: middle };
  return { ok: true as const, desk };
}

function checked(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

// A paragraph: trimmed, with Windows line ends made plain.
function paragraph(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .trim();
}

type OptionFields = Omit<PackageOption, "id" | "sortOrder">;

async function readOption(tx: Transaction, formData: FormData, id: number | null): Promise<Read<OptionFields>> {
  const limits = PACKAGE_OPTION_LIMITS;
  const name = readLine(formData.get("name"), "the option name", limits.name);
  if (!name.ok) return name;
  const options = await storedOptions(tx);
  if (options.some((option) => option.id !== id && option.name.toLowerCase() === name.value.toLowerCase())) {
    return { ok: false, error: "Another option already has that name." };
  }

  // Places: none means every place. Each must be a rate place.
  const known = await ratePlaces(tx);
  const places = [...new Set(formData.getAll("places").map((value) => oneLine(value)).filter(Boolean))];
  if (places.some((place) => !known.includes(place))) return { ok: false, error: "Choose rate places only, or none for every place." };

  // The day-one paragraph: both parts, or neither.
  const label = oneLine(formData.get("dayOneLabel"));
  const text = paragraph(formData.get("dayOneText"));
  let dayOne: DayPlanSection | null = null;
  if (label || text) {
    if (!label) return { ok: false, error: "Enter a label for the day 1 paragraph, such as Autumn." };
    if (!text) return { ok: false, error: "Enter the text of the day 1 paragraph." };
    if (label.length > DAY_PLAN_LIMITS.label) return { ok: false, error: `Enter a label of ${DAY_PLAN_LIMITS.label} characters or less.` };
    if (text.length > DAY_PLAN_LIMITS.text) return { ok: false, error: `Enter a paragraph of ${DAY_PLAN_LIMITS.text.toLocaleString("en-US")} characters or less.` };
    dayOne = { label, text };
  }

  // The swap: a middle day to swap to, and the title of the middle day at its place that it replaces.
  const swapToText = String(formData.get("swapTo") ?? "").trim();
  const swapFromText = oneLine(formData.get("swapFrom"));
  let swapTo: number | null = null;
  let swapFrom: string | null = null;
  if (swapToText || swapFromText) {
    const targetId = readRecordId(swapToText);
    if (targetId === null) return { ok: false, error: "Choose the day to swap to." };
    const [target] = await tx.select().from(dayPlans).where(eq(dayPlans.id, targetId)).limit(1);
    if (!target || target.part !== "middle") return { ok: false, error: "Choose a middle day to swap to." };
    if (!swapFromText) return { ok: false, error: "Choose the middle day it replaces." };
    const middleTitles = (await tx.select({ id: dayPlans.id, title: dayPlans.title, part: dayPlans.part }).from(dayPlans).where(eq(dayPlans.place, target.place)))
      .filter((day) => day.part === "middle" && day.id !== target.id)
      .map((day) => day.title);
    if (!middleTitles.includes(swapFromText)) return { ok: false, error: `Choose a middle day of ${target.place} for it to replace.` };
    if (places.length > 0 && !places.includes(target.place)) return { ok: false, error: `Offer the option at ${target.place}, the place of its swap, or at every place.` };
    swapTo = target.id;
    swapFrom = swapFromText;
  }

  const badge = readLine(formData.get("badge"), "the badge", limits.badge, false);
  if (!badge.ok) return badge;
  const intro = paragraph(formData.get("intro"));
  if (intro.length > limits.intro) return { ok: false, error: `Enter an opening paragraph of ${limits.intro.toLocaleString("en-US")} characters or less.` };
  const notIncluded = String(formData.get("notIncluded") ?? "")
    .split(/\r\n?|\n/)
    .map((line) => line.trim().replace(/\s+/g, " "))
    .filter(Boolean);
  if (notIncluded.length > limits.notIncludedLines) return { ok: false, error: `Enter up to ${limits.notIncludedLines} not included lines.` };
  if (notIncluded.some((line) => line.length > limits.notIncludedLine)) return { ok: false, error: `Enter not included lines of ${limits.notIncludedLine} characters or less.` };

  return {
    ok: true,
    value: {
      name: name.value,
      places,
      dayOne,
      swapFrom,
      swapTo,
      restDays: checked(formData.get("restDays")),
      badge: badge.value || null,
      intro: intro || null,
      notIncluded,
    },
  };
}

async function findOption(tx: Transaction, formData: FormData) {
  const id = readRecordId(formData.get("id"));
  if (id === null) return null;
  const [row] = await tx.select().from(packageOptions).where(eq(packageOptions.id, id)).limit(1);
  return row ?? null;
}

async function addOption(tx: Transaction, actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const options = await storedOptions(tx);
  if (options.length >= PACKAGE_OPTION_LIMITS.options) return { ok: false, error: `The office can keep up to ${PACKAGE_OPTION_LIMITS.options} package options.` };
  const fields = await readOption(tx, formData, null);
  if (!fields.ok) return fields;
  const sortOrder = (options.at(-1)?.sortOrder ?? -1) + 1;
  const [row] = await tx
    .insert(packageOptions)
    .values({ ...fields.value, sortOrder })
    .returning({ id: packageOptions.id });
  if (!row) return { ok: false, error: "The option could not be added." };
  await recordActivity(tx, actor, { kind: "package_option", recordId: row.id, text: `Added package option ${fields.value.name}` });
  return { ok: true, message: `Option added: ${fields.value.name}.` };
}

async function updateOption(tx: Transaction, actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const row = await findOption(tx, formData);
  if (!row) return { ok: false, error: "That option was not found." };
  const fields = await readOption(tx, formData, row.id);
  if (!fields.ok) return fields;
  await tx.update(packageOptions).set(fields.value).where(eq(packageOptions.id, row.id));
  await recordActivity(tx, actor, { kind: "package_option", recordId: row.id, text: `Changed package option ${fields.value.name}` });
  return { ok: true, message: `Option saved: ${fields.value.name}.` };
}

async function deleteOption(tx: Transaction, actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const row = await findOption(tx, formData);
  if (!row) return { ok: false, error: "That option was not found." };
  await tx.delete(packageOptions).where(eq(packageOptions.id, row.id));
  await recordActivity(tx, actor, { kind: "package_option", recordId: row.id, text: `Deleted package option ${row.name}` });
  return { ok: true, message: `Option deleted: ${row.name}.` };
}

// Moves an option one place up or down. The options are numbered again from 0.
async function moveOption(tx: Transaction, actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const row = await findOption(tx, formData);
  if (!row) return { ok: false, error: "That option was not found." };
  const direction = String(formData.get("direction") ?? "");
  if (direction !== "up" && direction !== "down") return { ok: false, error: "Choose up or down." };
  const order = await storedOptions(tx);
  const from = order.findIndex((option) => option.id === row.id);
  const to = direction === "up" ? from - 1 : from + 1;
  if (to < 0 || to >= order.length) return { ok: false, error: direction === "up" ? "That option is already first." : "That option is already last." };
  [order[from], order[to]] = [order[to], order[from]];
  for (const [sortOrder, option] of order.entries()) {
    if (option.sortOrder !== sortOrder) await tx.update(packageOptions).set({ sortOrder }).where(eq(packageOptions.id, option.id));
  }
  await recordActivity(tx, actor, { kind: "package_option", recordId: row.id, text: `Moved package option ${row.name} ${direction} to place ${to + 1}` });
  return { ok: true, message: `Option moved ${direction}: ${row.name}.` };
}

// POST /api/office/package-options. Each save takes the rate-names lock, as a place rename and a day
// plan save do, so a swap never points at a day deleted at the same moment.
export async function savePackageOptionAs(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  if (!can(actor, "rates.edit")) return forbidden("You cannot change the package options.");
  const action = String(formData.get("action") ?? "");
  if (!["add", "update", "delete", "move"].includes(action)) return { ok: false, error: "Choose what to save." };
  return db.transaction(async (tx): Promise<ActionResult> => {
    await lockRateNames(tx);
    if (action === "add") return addOption(tx, actor, formData);
    if (action === "update") return updateOption(tx, actor, formData);
    if (action === "delete") return deleteOption(tx, actor, formData);
    return moveOption(tx, actor, formData);
  });
}
