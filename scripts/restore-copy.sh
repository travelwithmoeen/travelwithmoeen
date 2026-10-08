#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
dump=${1:-backups/travelwithmoeen-$(date +%Y-%m-%d).sql}
if [ ! -s "$dump" ]; then
  echo "The backup file is missing: $dump" >&2
  exit 1
fi
urlfile=$(mktemp)
trap 'rm -f "$urlfile"' EXIT
node --env-file=.env -e '
const fs = require("fs");
const raw = process.env.DATABASE_URL;
if (!raw) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}
const url = new URL(raw);
const name = url.pathname.replace(/^\//, "");
if (!/^[A-Za-z0-9_]+$/.test(name)) {
  console.error("The database name cannot be used for a restore copy.");
  process.exit(1);
}
if (url.hostname === "localhost" || url.hostname === "127.0.0.1") url.hostname = "host.docker.internal";
const admin = new URL(url);
admin.pathname = "/postgres";
const copy = new URL(url);
copy.pathname = "/" + name + "_restore_copy";
const lines = [
  "ADMIN_URL=" + admin.toString(),
  "COPY_URL=" + copy.toString(),
  "LIVE_URL=" + url.toString(),
  "COPY_NAME=" + name + "_restore_copy",
].join("\n") + "\n";
fs.writeFileSync(process.argv[1], lines, { mode: 0o600 });
' "$urlfile"
docker run --rm --env-file "$urlfile" -v "$PWD/$dump:/dump.sql:ro" postgres:16 sh -c '
  psql "$ADMIN_URL" -v ON_ERROR_STOP=1 -c "DROP DATABASE IF EXISTS \"$COPY_NAME\";"
  psql "$ADMIN_URL" -v ON_ERROR_STOP=1 -c "CREATE DATABASE \"$COPY_NAME\";"
  psql "$COPY_URL" -v ON_ERROR_STOP=1 -f /dump.sql >/tmp/restore.out
  live=$(psql "$LIVE_URL" -tAc "SELECT count(*) FROM information_schema.tables WHERE table_schema = '\''public'\'' AND table_type = '\''BASE TABLE'\'';")
  copy=$(psql "$COPY_URL" -tAc "SELECT count(*) FROM information_schema.tables WHERE table_schema = '\''public'\'' AND table_type = '\''BASE TABLE'\'';")
  live_users=$(psql "$LIVE_URL" -tAc "SELECT count(*) FROM users;")
  copy_users=$(psql "$COPY_URL" -tAc "SELECT count(*) FROM users;")
  psql "$ADMIN_URL" -v ON_ERROR_STOP=1 -c "DROP DATABASE \"$COPY_NAME\";"
  echo "live_tables=$live"
  echo "copy_tables=$copy"
  echo "live_users=$live_users"
  echo "copy_users=$copy_users"
'
