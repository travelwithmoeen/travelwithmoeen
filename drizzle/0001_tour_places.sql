-- Additive. Creates the tour-to-place link table only.
-- Does not update or delete tours or places. Run npm run db:link-tours
-- to create this table if needed and insert links that can be inferred.
SET client_min_messages TO warning;
CREATE TABLE IF NOT EXISTS tour_places (
  tour_id text NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  place_slug text NOT NULL REFERENCES places(slug) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  PRIMARY KEY (tour_id, place_slug)
);
