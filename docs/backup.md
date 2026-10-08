# Database backup

The backup reads `DATABASE_URL`. That is the database the site uses. On this machine that is `localhost` port `5434`, database `travelwithmoeen`. The dump runs `pg_dump` in a Postgres client container. `localhost` is reached as `host.docker.internal` so the client can see that database. The script does not use `docker compose exec`.

The folder `backups/` is not committed and is not under `public/`.

## Every day

On this Mac the job `com.travelwithmoeen.db-backup` runs at 02:15. It calls `scripts/backup-db.sh`. The log is `backups/backup.log`. Install the same job on the machine that holds the database:

```bash
sh scripts/install-daily-backup.sh
```

A restore is used only when the data is damaged. Tell the client before restoring the live database.

## Restore onto a copy

```bash
npm run db:restore-copy
```

That loads `backups/travelwithmoeen-YYYY-MM-DD.sql` into `travelwithmoeen_restore_copy`, prints the table counts, and removes the copy. To restore the live database, stop the site and load that file into `travelwithmoeen` only after the copy looks right and the client has been told. That load replaces the live data.

## Tried on 8 October 2026

The daily job wrote `backups/travelwithmoeen-2026-10-08.sql` (294,726 bytes). `npm run db:restore-copy` loaded that file into `travelwithmoeen_restore_copy`.

| | Live database | Copy |
|---|---|---|
| Tables | 20 | 20 |
| Users | 3 | 3 |

The copy was removed after the check. The live database was not replaced.
