-- Additive. T-48 (BR-91): the start cities a quote reads. The starting rows are Islamabad, Lahore,
-- and Karachi. The Lahore and Karachi air extras are copied from air_extras, so every quote prices as
-- before and the Skardu test stays 140,400. air_extras.lahore_add and air_extras.karachi_add stay in
-- that table, and nothing reads them after this change. The rows are inserted only into an empty
-- table, so running this again changes nothing.
-- npm run db:push gives the same table from lib/db/schema.ts, without the rows.
SET client_min_messages TO warning;
BEGIN;

CREATE TABLE IF NOT EXISTS start_cities (
  id serial PRIMARY KEY,
  name text NOT NULL,
  road boolean NOT NULL,
  air boolean NOT NULL,
  air_extra integer NOT NULL DEFAULT 0,
  long_route_after_days integer,
  long_route_per_vehicle_day integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  CONSTRAINT start_cities_name_unique UNIQUE (name)
);

INSERT INTO start_cities (name, road, air, air_extra, long_route_after_days, long_route_per_vehicle_day, sort_order)
SELECT starting.name, starting.road, starting.air, starting.air_extra, starting.after_days, starting.per_vehicle_day, starting.sort_order
FROM (
  VALUES
    ('Islamabad', true, true, 0, NULL::integer, 0, 1),
    ('Lahore', true, true, COALESCE((SELECT lahore_add FROM air_extras ORDER BY id LIMIT 1), 10000), 3, 5000, 2),
    ('Karachi', false, true, COALESCE((SELECT karachi_add FROM air_extras ORDER BY id LIMIT 1), 30000), NULL::integer, 0, 3)
) AS starting (name, road, air, air_extra, after_days, per_vehicle_day, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM start_cities);

COMMIT;
