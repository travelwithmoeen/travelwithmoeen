#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
mkdir -p backups
stamp=$(date +%Y-%m-%d)
out="backups/travelwithmoeen-${stamp}.sql"
docker compose exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --no-owner --no-acl' > "$out"
if [ ! -s "$out" ]; then
  rm -f "$out"
  echo "The backup file is empty." >&2
  exit 1
fi
echo "Backup written to $out"
