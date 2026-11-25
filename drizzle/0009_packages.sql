-- T-58 (design section 15, BR-105 to BR-116): the five package tables, all new, so nothing stored is
-- changed. T-58 uses day_plans and place_hotel_names. T-59 to T-61 use package_options,
-- package_sections, and quote_packages. Running it again changes nothing.
-- npm run db:push gives the same tables, with the same constraint names, from lib/db/schema.ts.
SET client_min_messages TO warning;
BEGIN;

-- BR-105: one row per day of a rate place's plan. price_place is the rate place a night on this day is
-- priced at (BR-112), and whose hotel-names line it uses (BR-111). Null means the quote's own place.
CREATE TABLE IF NOT EXISTS day_plans (
  id serial PRIMARY KEY,
  place text NOT NULL,
  part text NOT NULL,
  position integer NOT NULL,
  title text NOT NULL,
  overnight text NOT NULL,
  price_place text,
  sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  CONSTRAINT day_plans_part_check CHECK (part IN ('out_air', 'out_road', 'middle', 'back_air', 'back_road'))
);
CREATE INDEX IF NOT EXISTS day_plans_place_part_position_idx ON day_plans (place, part, position);

-- BR-111: one hotel-names line for each rate place and grade. A blank line is not stored.
CREATE TABLE IF NOT EXISTS place_hotel_names (
  place text NOT NULL,
  grade text NOT NULL,
  names text NOT NULL,
  CONSTRAINT place_hotel_names_place_grade_pk PRIMARY KEY (place, grade)
);

-- BR-107: package options. places is empty for an option offered at every place.
CREATE TABLE IF NOT EXISTS package_options (
  id serial PRIMARY KEY,
  name text NOT NULL,
  places text[] NOT NULL DEFAULT '{}',
  day_one jsonb,
  swap_from text,
  swap_to integer,
  rest_days boolean NOT NULL DEFAULT false,
  badge text,
  intro text,
  not_included text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  CONSTRAINT package_options_name_unique UNIQUE (name)
);

-- BR-108: the fixed sections, in order.
CREATE TABLE IF NOT EXISTS package_sections (
  id serial PRIMARY KEY,
  title text NOT NULL,
  kind text NOT NULL,
  body jsonb NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  CONSTRAINT package_sections_kind_check CHECK (kind IN ('text', 'rows', 'steps'))
);

-- BR-109 and BR-114: a saved quote's package choices. Removed with its quote.
CREATE TABLE IF NOT EXISTS quote_packages (
  quote_id integer PRIMARY KEY,
  title text NOT NULL,
  all_grades boolean NOT NULL DEFAULT false,
  flight_note boolean NOT NULL DEFAULT true,
  option_ids integer[] NOT NULL DEFAULT '{}',
  pictures text[] NOT NULL DEFAULT '{}',
  CONSTRAINT quote_packages_quote_id_quotes_id_fk FOREIGN KEY (quote_id) REFERENCES quotes (id) ON DELETE CASCADE,
  CONSTRAINT quote_packages_pictures_check CHECK (cardinality(pictures) <= 3)
);

-- T-61 (BR-112): true when that night's rate was typed on the office Quote screen. Quotes saved
-- before this column have no typed nights.
ALTER TABLE quote_nights ADD COLUMN IF NOT EXISTS typed boolean NOT NULL DEFAULT false;

-- T-61: the seats of an Other vehicle, so the package works out the same vehicle count again. Null on
-- every other quote, and on Other quotes saved before this column.
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS other_seats integer;

COMMIT;
