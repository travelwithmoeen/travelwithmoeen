import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { packageSections } from "@/lib/db/schema";
import { can } from "@/lib/auth/permissions";
import type { SessionUser } from "@/lib/auth/session";
import { forbidden, type ActionResult } from "@/lib/http/result";
import { recordActivity } from "@/lib/office/activity";
import { oneLine, readLine, type Read } from "@/lib/office/day-plans";
import { lockRateNames, type Transaction } from "@/lib/office/rates";
import { readRecordId } from "@/lib/office/record-id";
import { PACKAGE_SECTION_KINDS, PACKAGE_SECTION_LIMITS, type PackageSection, type PackageSectionBody, type PackageSectionKind, type SectionRow } from "@/lib/package";

// T-60 (BR-108, BR-116, design section 15): the fixed sections of the package document, such as
// check-in and check-out, payment procedure, cancellation policy, code of conduct, and contact.
// Owner and Manager only, through the rates permission. Each save writes one activity row in area
// rates.

function isKind(value: string): value is PackageSectionKind {
  return (PACKAGE_SECTION_KINDS as readonly string[]).includes(value);
}

function toSection(row: typeof packageSections.$inferSelect): PackageSection {
  return { id: row.id, title: row.title, kind: row.kind, body: row.body as PackageSectionBody, sortOrder: row.sortOrder };
}

export async function storedSections(reader: typeof db | Transaction) {
  return (await reader.select().from(packageSections).orderBy(asc(packageSections.sortOrder), asc(packageSections.id))).map(toSection);
}

// GET /api/office/package-sections.
export async function loadPackageSectionsAs(actor: SessionUser) {
  if (!can(actor, "rates.edit")) return forbidden("You cannot read the fixed sections.");
  return { ok: true as const, sections: await storedSections(db) };
}

function plain(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .trim();
}

// Text: paragraphs, with a blank line starting a new one. A paragraph keeps its single line breaks.
function readText(formData: FormData): Read<string[]> {
  const text = plain(formData.get("text"));
  if (!text) return { ok: false, error: "Enter the section text." };
  if (text.length > PACKAGE_SECTION_LIMITS.text) return { ok: false, error: `Enter text of ${PACKAGE_SECTION_LIMITS.text.toLocaleString("en-US")} characters or less.` };
  return { ok: true, value: text.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean) };
}

// Rows: a label and its value, such as Check-in and 2:00 pm. A pair left blank is dropped.
function readRows(formData: FormData): Read<SectionRow[]> {
  const limits = PACKAGE_SECTION_LIMITS;
  const labels = formData.getAll("rowLabel");
  const values = formData.getAll("rowValue");
  if (labels.length !== values.length) return { ok: false, error: "Send the form again." };
  const rows: SectionRow[] = [];
  for (let index = 0; index < labels.length; index += 1) {
    const label = oneLine(labels[index]);
    const value = oneLine(values[index]);
    if (!label && !value) continue;
    if (!label) return { ok: false, error: `Enter a label for row ${index + 1}, such as Check-in.` };
    if (!value) return { ok: false, error: `Enter the value for ${label}.` };
    if (label.length > limits.rowLabel) return { ok: false, error: `Enter a row label of ${limits.rowLabel} characters or less.` };
    if (value.length > limits.rowValue) return { ok: false, error: `Enter a row value of ${limits.rowValue} characters or less.` };
    rows.push({ label, value });
  }
  if (rows.length === 0) return { ok: false, error: "Enter at least one row." };
  if (rows.length > limits.rows) return { ok: false, error: `A section can have up to ${limits.rows} rows.` };
  return { ok: true, value: rows };
}

// Numbered items, in order. A blank item is dropped. The document numbers them 1, 2, 3.
function readSteps(formData: FormData): Read<string[]> {
  const limits = PACKAGE_SECTION_LIMITS;
  const steps = formData
    .getAll("step")
    .map((value) => oneLine(value))
    .filter(Boolean);
  if (steps.length === 0) return { ok: false, error: "Enter at least one item." };
  if (steps.length > limits.steps) return { ok: false, error: `A section can have up to ${limits.steps} items.` };
  if (steps.some((step) => step.length > limits.step)) return { ok: false, error: `Enter items of ${limits.step} characters or less.` };
  return { ok: true, value: steps };
}

type SectionFields = { title: string; kind: PackageSectionKind; body: PackageSectionBody };

function readSection(formData: FormData): Read<SectionFields> {
  const title = readLine(formData.get("title"), "the section title", PACKAGE_SECTION_LIMITS.title);
  if (!title.ok) return title;
  const kind = String(formData.get("kind") ?? "");
  if (!isKind(kind)) return { ok: false, error: "Choose text, rows, or numbered items." };
  const body = kind === "text" ? readText(formData) : kind === "rows" ? readRows(formData) : readSteps(formData);
  if (!body.ok) return body;
  return { ok: true, value: { title: title.value, kind, body: body.value } };
}

async function findSection(tx: Transaction, formData: FormData) {
  const id = readRecordId(formData.get("id"));
  if (id === null) return null;
  const [row] = await tx.select().from(packageSections).where(eq(packageSections.id, id)).limit(1);
  return row ?? null;
}

async function addSection(tx: Transaction, actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const sections = await storedSections(tx);
  if (sections.length >= PACKAGE_SECTION_LIMITS.sections) return { ok: false, error: `The office can keep up to ${PACKAGE_SECTION_LIMITS.sections} fixed sections.` };
  const fields = readSection(formData);
  if (!fields.ok) return fields;
  const sortOrder = (sections.at(-1)?.sortOrder ?? -1) + 1;
  const [row] = await tx
    .insert(packageSections)
    .values({ ...fields.value, sortOrder })
    .returning({ id: packageSections.id });
  if (!row) return { ok: false, error: "The section could not be added." };
  await recordActivity(tx, actor, { kind: "package_section", recordId: row.id, text: `Added fixed section ${fields.value.title}` });
  return { ok: true, message: `Section added: ${fields.value.title}.` };
}

async function updateSection(tx: Transaction, actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const row = await findSection(tx, formData);
  if (!row) return { ok: false, error: "That section was not found." };
  const fields = readSection(formData);
  if (!fields.ok) return fields;
  await tx.update(packageSections).set(fields.value).where(eq(packageSections.id, row.id));
  await recordActivity(tx, actor, { kind: "package_section", recordId: row.id, text: `Changed fixed section ${fields.value.title}` });
  return { ok: true, message: `Section saved: ${fields.value.title}.` };
}

async function deleteSection(tx: Transaction, actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const row = await findSection(tx, formData);
  if (!row) return { ok: false, error: "That section was not found." };
  await tx.delete(packageSections).where(eq(packageSections.id, row.id));
  await recordActivity(tx, actor, { kind: "package_section", recordId: row.id, text: `Deleted fixed section ${row.title}` });
  return { ok: true, message: `Section deleted: ${row.title}.` };
}

// Moves a section one place up or down. The sections are numbered again from 0.
async function moveSection(tx: Transaction, actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const row = await findSection(tx, formData);
  if (!row) return { ok: false, error: "That section was not found." };
  const direction = String(formData.get("direction") ?? "");
  if (direction !== "up" && direction !== "down") return { ok: false, error: "Choose up or down." };
  const order = await storedSections(tx);
  const from = order.findIndex((section) => section.id === row.id);
  const to = direction === "up" ? from - 1 : from + 1;
  if (to < 0 || to >= order.length) return { ok: false, error: direction === "up" ? "That section is already first." : "That section is already last." };
  [order[from], order[to]] = [order[to], order[from]];
  for (const [sortOrder, section] of order.entries()) {
    if (section.sortOrder !== sortOrder) await tx.update(packageSections).set({ sortOrder }).where(eq(packageSections.id, section.id));
  }
  await recordActivity(tx, actor, { kind: "package_section", recordId: row.id, text: `Moved fixed section ${row.title} ${direction} to place ${to + 1}` });
  return { ok: true, message: `Section moved ${direction}: ${row.title}.` };
}

// POST /api/office/package-sections. Each save takes the rate-names lock, as the other package saves
// do, so two moves at the same moment never number the sections twice.
export async function savePackageSectionAs(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  if (!can(actor, "rates.edit")) return forbidden("You cannot change the fixed sections.");
  const action = String(formData.get("action") ?? "");
  if (!["add", "update", "delete", "move"].includes(action)) return { ok: false, error: "Choose what to save." };
  return db.transaction(async (tx): Promise<ActionResult> => {
    await lockRateNames(tx);
    if (action === "add") return addSection(tx, actor, formData);
    if (action === "update") return updateSection(tx, actor, formData);
    if (action === "delete") return deleteSection(tx, actor, formData);
    return moveSection(tx, actor, formData);
  });
}
