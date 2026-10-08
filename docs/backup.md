# Database backup

The database is backed up once a day. From the project folder, with Postgres running, run:

```bash
npm run db:backup
```

The file is `backups/travelwithmoeen-YYYY-MM-DD.sql`. That folder is not committed and is not under `public/`.

A restore is used only when the data is damaged. Tell the client before restoring the live database.

Try the file on a copy first. Replace the date in the file name with the backup you are checking.

```bash
docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d postgres -c "CREATE DATABASE travelwithmoeen_restore_copy;"'
docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d travelwithmoeen_restore_copy' < backups/travelwithmoeen-YYYY-MM-DD.sql
```

Check that the copy has the tables. When the check is done, remove the copy:

```bash
docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d postgres -c "DROP DATABASE travelwithmoeen_restore_copy;"'
```

Restore the live database only after that copy looks right and the client has been told. Stop the site so it is not writing, then load the same file into `travelwithmoeen`. That load replaces the live data.
