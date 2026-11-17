-- Additive. T-62 (BR-118, BR-119): a person's own name, set on the office Settings page. It is
-- nullable, and existing logins get no name, so the office shows their email as today. Running this
-- again changes nothing.
-- npm run db:push gives the same column from lib/db/schema.ts.
SET client_min_messages TO warning;
BEGIN;

ALTER TABLE users ADD COLUMN IF NOT EXISTS name text;

COMMIT;
