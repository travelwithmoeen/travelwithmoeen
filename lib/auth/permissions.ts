// T-63 (BR-123 to BR-130, design section 17): what a role may do. The list is fixed here, and a new
// permission is added only by a task. Every check keeps its place in the code; only its answer
// comes from the database, through the signed-in person's role, read on each request. short heads
// the column on the Roles page.

export const PERMISSIONS = [
  { key: "requests.read", short: "Read requests", name: "Read guest requests", help: "See the request inbox, each request, and the count of new requests." },
  { key: "requests.status", short: "Request status", name: "Change a guest request's status", help: "Move a request to New, In progress, or Closed." },
  {
    key: "content.edit",
    short: "Content",
    name: "Edit tours, places, blog, gallery, reviews, home slides, and site details",
    help: "Includes photo and PDF uploads. Content activity in Saved by and the dashboard comes with it.",
  },
  { key: "tours.delete", short: "Delete a tour", name: "Delete a tour", help: "Remove a tour, its day plan, and its place links from the website." },
  {
    key: "rates.edit",
    short: "Rates and quotes",
    name: "Edit rates, quotes, profit margin, and the live price download",
    help: "Hotel, vehicle, and jeep rates, start cities, pricing rules, the Quote screen, and rate activity.",
  },
] as const;

export type PermissionKey = (typeof PERMISSIONS)[number]["key"];
export const PERMISSION_KEYS: readonly PermissionKey[] = PERMISSIONS.map((permission) => permission.key);

// BR-125: these stay with the Owner role and are not permission keys, so no role can be given them.
export const OWNER_ONLY = [
  "Create, remove, or change a login",
  "Manage roles",
  "Back up and download backups",
  "Delete a price row",
  "Delete a guest request",
] as const;

export function isPermissionKey(value: string): value is PermissionKey {
  return (PERMISSION_KEYS as readonly string[]).includes(value);
}

// The part of a signed-in person a check reads: whether their role is the Owner role, and its keys.
export type Actor = { isOwner: boolean; permissions: readonly PermissionKey[] };

// The Owner role always has every permission (BR-125).
export function can(user: Actor, key: PermissionKey) {
  return user.isOwner || user.permissions.includes(key);
}

// Logins, roles, backups, deleting a price row, and deleting a guest request.
export function isOwner(user: Actor) {
  return user.isOwner;
}

// Manager and Editor start with exactly the permissions they had before T-63 (BR-126). The migration
// seeds these, and a restore of a backup made before T-63 uses them too.
export const STARTING_ROLES: { name: string; isOwner: boolean; permissions: PermissionKey[] }[] = [
  { name: "Owner", isOwner: true, permissions: [] },
  { name: "Manager", isOwner: false, permissions: ["requests.read", "requests.status", "rates.edit"] },
  { name: "Editor", isOwner: false, permissions: ["requests.read", "content.edit", "tours.delete"] },
];
