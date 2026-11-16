-- Additive. T-49 (BR-89, BR-92): a saved quote keeps the room count and the vehicle count that staff
-- typed, and whether the air tickets were in. Each column is null when it was not set: a null count
-- means the quote used the automatic count, and a null tickets is a quote saved before T-49, which
-- had the tickets. Old quotes and their totals do not change. Running this again changes nothing.
-- npm run db:push gives the same columns from lib/db/schema.ts.
SET client_min_messages TO warning;
BEGIN;

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS room_count integer;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS vehicle_count integer;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS tickets boolean;

COMMIT;
