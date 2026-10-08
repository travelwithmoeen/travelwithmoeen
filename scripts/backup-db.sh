#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
mkdir -p backups
stamp=$(date +%Y-%m-%d)
out="backups/travelwithmoeen-${stamp}.sql"
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
if (url.hostname === "localhost" || url.hostname === "127.0.0.1") url.hostname = "host.docker.internal";
fs.writeFileSync(process.argv[1], "DUMP_URL=" + url.toString() + "\n", { mode: 0o600 });
' "$urlfile"
docker run --rm --env-file "$urlfile" postgres:16 sh -c 'pg_dump --no-owner --no-acl "$DUMP_URL"' > "$out" 2>/tmp/twm-backup.err || {
  cat /tmp/twm-backup.err >&2
  rm -f "$out"
  exit 1
}
rm -f /tmp/twm-backup.err
if [ ! -s "$out" ]; then
  rm -f "$out"
  echo "The backup file is empty." >&2
  exit 1
fi
echo "Backup written to $out"
