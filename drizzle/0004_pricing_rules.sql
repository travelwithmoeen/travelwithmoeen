-- Additive. T-47 (BR-87, BR-88): the pricing rules and the meal rates the quote reads, and lunch on
-- a saved quote. The starting rows are today's values, so the Skardu test stays 140,400. They are
-- inserted only into an empty table, so running this again changes nothing.
-- npm run db:push gives the same tables and column from lib/db/schema.ts, without the rows.
SET client_min_messages TO warning;
BEGIN;

CREATE TABLE IF NOT EXISTS pricing_rules (
  id serial PRIMARY KEY,
  guide_per_day integer NOT NULL,
  breakfast_per_person integer NOT NULL,
  child_fare_percent integer NOT NULL,
  lap_infant_fare integer NOT NULL,
  seat_infant_fare integer NOT NULL,
  people_per_room integer NOT NULL
);

CREATE TABLE IF NOT EXISTS meal_rates (
  id serial PRIMARY KEY,
  grade text NOT NULL,
  dinner integer NOT NULL,
  lunch integer NOT NULL,
  CONSTRAINT meal_rates_grade_unique UNIQUE (grade)
);

INSERT INTO pricing_rules (guide_per_day, breakfast_per_person, child_fare_percent, lap_infant_fare, seat_infant_fare, people_per_room)
SELECT 5000, 500, 75, 1000, 5000, 3
WHERE NOT EXISTS (SELECT 1 FROM pricing_rules);

INSERT INTO meal_rates (grade, dinner, lunch)
SELECT grade, dinner, lunch
FROM (VALUES ('Deluxe', 1200, 1800), ('Executive', 2000, 3000), ('Luxury', 2500, 3500), ('Ultra Luxury', 3000, 4000)) AS starting (grade, dinner, lunch)
WHERE NOT EXISTS (SELECT 1 FROM meal_rates);

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS lunch boolean NOT NULL DEFAULT false;

COMMIT;
