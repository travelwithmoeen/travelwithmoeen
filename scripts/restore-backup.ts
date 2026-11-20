import { readFileSync } from "fs";
import { getTableColumns, sql } from "drizzle-orm";
import { db } from "../lib/db";
import { STARTING_ROLES } from "../lib/auth/permissions";
import { BACKUP_FORMAT, BACKUP_TABLES, type BackupFile } from "../lib/office/backup";

const CHUNK = 100;

function usage(): never {
  console.error("Usage: npm run db:restore -- <backup.json> --yes");
  console.error("DATABASE_URL in .env is the database that will be replaced.");
  process.exit(1);
}

function toRows(table: (typeof BACKUP_TABLES)[number][1], rows: Record<string, unknown>[]) {
  const dateKeys = Object.entries(getTableColumns(table))
    .filter(([, column]) => column.columnType === "PgTimestamp")
    .map(([key]) => key);
  return rows.map((row) => {
    const copy = { ...row };
    for (const key of dateKeys) {
      if (typeof copy[key] === "string") copy[key] = new Date(copy[key] as string);
    }
    return copy;
  });
}

function isSerialId(table: (typeof BACKUP_TABLES)[number][1]) {
  const id = (getTableColumns(table) as Record<string, { columnType: string } | undefined>).id;
  return id?.columnType === "PgSerial";
}

// T-63: a backup made before T-63 has no roles tables, and each login has a role of owner, manager,
// or editor. It gets the starting roles, with the permissions they had then, the same as migration
// 0008, and each login the id of its role. A role it cannot match stops the restore.
function withRoles(backup: BackupFile): BackupFile {
  if (backup.tables.roles) return backup;
  const roleRows = STARTING_ROLES.map((role, index) => ({ id: index + 1, name: role.name, isOwner: role.isOwner, createdAt: backup.createdAt }));
  const permissionRows = STARTING_ROLES.flatMap((role, index) => role.permissions.map((permission) => ({ roleId: index + 1, permission })));
  const users = (backup.tables.users ?? []).map((row) => {
    const { role, ...rest } = row as Record<string, unknown> & { role?: unknown };
    const found = roleRows.find((item) => item.name.toLowerCase() === String(role));
    if (!found) throw new Error(`The login ${String(rest.email)} has the role ${String(role)}, which is not owner, manager, or editor.`);
    return { ...rest, roleId: found.id };
  });
  console.log("This backup was made before T-63. It gets the Owner, Manager, and Editor roles.");
  return { ...backup, tables: { ...backup.tables, roles: roleRows, role_permissions: permissionRows, users } };
}

async function main() {
  const [file, flag] = process.argv.slice(2);
  if (!file || flag !== "--yes") usage();

  const read = JSON.parse(readFileSync(file, "utf8")) as BackupFile;
  if (read.format !== BACKUP_FORMAT) {
    throw new Error(`${file} is not a ${BACKUP_FORMAT} file.`);
  }
  const backup = withRoles(read);
  const target = new URL(process.env.DATABASE_URL ?? "");
  console.log(`Restoring ${file} (taken ${backup.createdAt}) into ${target.hostname}${target.pathname}`);

  await db.transaction(async (tx) => {
    for (const [, table] of [...BACKUP_TABLES].reverse()) {
      await tx.delete(table);
    }
    for (const [name, table] of BACKUP_TABLES) {
      const rows = toRows(table, backup.tables[name] ?? []);
      for (let i = 0; i < rows.length; i += CHUNK) {
        await tx.insert(table).values(rows.slice(i, i + CHUNK) as never);
      }
      // Only a serial id has a sequence to move on. tours has a text id, and photos, reviews, slides,
      // and site_settings set their own whole-number ids, so they are left alone.
      if (isSerialId(table)) {
        await tx.execute(
          sql`select setval(pg_get_serial_sequence(${name}, 'id'), coalesce(max(id), 1), max(id) is not null) from ${sql.identifier(name)}`,
        );
      }
      console.log(`${name}: ${rows.length} rows`);
    }
  });
  console.log("Restore finished.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
