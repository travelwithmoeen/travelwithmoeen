import { and, desc, eq, inArray, lt } from "drizzle-orm";
import { db } from "@/lib/db";
import { activity, users } from "@/lib/db/schema";
import { can, isOwner, type Actor } from "@/lib/auth/permissions";
import type { SessionUser } from "@/lib/auth/session";

// BR-86 and design section 11: who saved what, and when.
export const ACTIVITY_AREA_OF_KIND = {
  tour: "content",
  place: "content",
  post: "content",
  photo: "content",
  review: "content",
  slide: "content",
  site: "content",
  hotel_rate: "rates",
  vehicle_rate: "rates",
  jeep_line: "rates",
  air_extra: "rates",
  start_city: "rates",
  place_rename: "rates",
  margin: "rates",
  pricing_rule: "rates",
  meal_rate: "rates",
  quote: "rates",
  request: "requests",
  user: "users",
  // T-62: a person changed their own name. The Owner sees it with the other login rows.
  profile: "users",
  backup: "backups",
  // T-63 (BR-130): a role added, renamed, changed, or deleted. Owner only.
  role: "roles",
} as const;

export type ActivityKind = keyof typeof ACTIVITY_AREA_OF_KIND;
export type ActivityArea = (typeof ACTIVITY_AREA_OF_KIND)[ActivityKind];

export type ActivityRow = {
  id: number;
  at: string;
  userEmail: string;
  // T-62 (BR-119): the current name of the login with that email. Null for no name or a removed login.
  userName: string | null;
  area: ActivityArea;
  kind: ActivityKind;
  recordId: string;
  text: string;
};

const KEEP_DAYS = 365;
const DAY_MS = 24 * 60 * 60 * 1000;
const FEED_LIMIT = 20;
const FEED_MAX = 100;

// The database, or the transaction a save already runs in, so the row commits with the save.
type ActivityWriter = Pick<typeof db, "insert" | "delete">;

export function isActivityKind(value: string): value is ActivityKind {
  return Object.hasOwn(ACTIVITY_AREA_OF_KIND, value);
}

// Which activity areas a person may read: the Owner reads every area, and another role reads the
// areas its permissions open.
export function activityAreasFor(actor: Actor): ActivityArea[] {
  // T-63 (design section 17): each area follows the permission that opens it. Users, backups, and
  // roles are Owner only.
  const areas: ActivityArea[] = [];
  if (can(actor, "content.edit")) areas.push("content");
  if (can(actor, "rates.edit")) areas.push("rates");
  if (can(actor, "requests.read")) areas.push("requests");
  if (isOwner(actor)) areas.push("users", "backups", "roles");
  return areas;
}

// Called by a lib/ save after the save has succeeded. The text names the record. It never holds a
// password, a token, a secret, or a guest phone or message. Rows older than 365 days go here.
export async function recordActivity(
  writer: ActivityWriter,
  actor: SessionUser,
  entry: { kind: ActivityKind; recordId?: string | number; text: string },
) {
  await writer.insert(activity).values({
    userId: actor.id,
    userEmail: actor.email,
    area: ACTIVITY_AREA_OF_KIND[entry.kind],
    kind: entry.kind,
    recordId: entry.recordId === undefined ? "" : String(entry.recordId),
    text: entry.text,
  });
  await writer.delete(activity).where(lt(activity.at, new Date(Date.now() - KEEP_DAYS * DAY_MS)));
}

function toRow(row: typeof activity.$inferSelect, names: Map<string, string>): ActivityRow {
  return {
    id: row.id,
    at: row.at.toISOString(),
    userEmail: row.userEmail,
    userName: names.get(row.userEmail) ?? null,
    area: row.area as ActivityArea,
    kind: row.kind as ActivityKind,
    recordId: row.recordId,
    text: row.text,
  };
}

// The rows keep the email that saved them. The name shown is the current name of that login, so a
// rename shows on old rows too, and a removed login shows its email.
async function withNames(rows: (typeof activity.$inferSelect)[]) {
  const emails = [...new Set(rows.map((row) => row.userEmail))];
  const named = emails.length
    ? await db.select({ email: users.email, name: users.name }).from(users).where(inArray(users.email, emails))
    : [];
  const names = new Map(named.flatMap((row) => (row.name ? [[row.email, row.name] as const] : [])));
  return rows.map((row) => toRow(row, names));
}

// The newest rows the actor's role may read, for the dashboard feed.
export async function listActivityAs(actor: SessionUser, limit = FEED_LIMIT) {
  const take = Number.isInteger(limit) && limit > 0 ? Math.min(limit, FEED_MAX) : FEED_LIMIT;
  const rows = await db
    .select()
    .from(activity)
    .where(inArray(activity.area, activityAreasFor(actor)))
    .orderBy(desc(activity.at), desc(activity.id))
    .limit(take);
  return { ok: true as const, rows: await withNames(rows) };
}

// "Saved by" on a screen: the newest row for each record of one kind, or for the records named.
export async function latestActivityAs(actor: SessionUser, kind: string, recordIds: string[] = []) {
  if (!isActivityKind(kind)) return { ok: false as const, error: "Choose a record type." };
  if (!activityAreasFor(actor).includes(ACTIVITY_AREA_OF_KIND[kind])) {
    return { ok: false as const, error: "You cannot read that activity.", status: 403 as const };
  }
  const rows = await db
    .selectDistinctOn([activity.recordId])
    .from(activity)
    .where(recordIds.length ? and(eq(activity.kind, kind), inArray(activity.recordId, recordIds)) : eq(activity.kind, kind))
    .orderBy(activity.recordId, desc(activity.at), desc(activity.id));
  return { ok: true as const, rows: await withNames(rows) };
}
