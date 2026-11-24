import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  index,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type { BlogSection } from "@/data/blog";
import type { DestinationSection } from "@/data/destinations";
import type { TourCategory, TourPackage, PackageType } from "@/data/tours";
import type { DayPlanPart, DayPlanSection } from "@/lib/package";

export const priceSource = pgEnum("price_source", ["excel", "website"]);
export const guestRequestKind = pgEnum("guest_request_kind", ["contact", "custom", "booking"]);
export const guestRequestStatus = pgEnum("guest_request_status", ["new", "in_progress", "closed"]);

export const loginFailures = pgTable(
  "login_failures",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    failedAt: timestamp("failed_at", { withTimezone: true }).notNull(),
  },
  (table) => [index("login_failures_email_failed_at_idx").on(table.email, table.failedAt)],
);

// T-63 (BR-123 to BR-127): the roles the Owner manages. Exactly one row is the Owner role, which has
// every permission and cannot be changed. A name is unique without regard to case.
export const roles = pgTable(
  "roles",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    isOwner: boolean("is_owner").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("roles_name_lower_idx").on(sql`lower(${table.name})`),
    uniqueIndex("roles_one_owner_idx").on(table.isOwner).where(sql`${table.isOwner}`),
  ],
);

// The permissions of each role other than Owner. Keys are the list in lib/auth/permissions.ts.
export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: integer("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permission: text("permission").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.roleId, table.permission] }),
    check("role_permissions_permission_check", sql`${table.permission} in ('requests.read', 'requests.status', 'content.edit', 'tours.delete', 'rates.edit')`),
  ],
);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  // T-63: the login's role. A role with logins cannot be deleted, so there is no cascade.
  roleId: integer("role_id")
    .notNull()
    .references(() => roles.id),
  // T-62 (BR-118): the person's own name, set on the Settings page. Null shows the email.
  name: text("name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const tours = pgTable("tours", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  region: text("region").notNull(),
  duration: integer("duration").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  pdf: text("pdf").notNull(),
  code: text("code").notNull(),
  galleryImages: jsonb("gallery_images").$type<string[]>().notNull(),
  categories: jsonb("categories").$type<TourCategory[]>().notNull(),
  packageTypes: jsonb("package_types").$type<PackageType[]>().notNull(),
  transport: text("transport").notNull(),
  basePrice: integer("base_price").notNull(),
  packages: jsonb("packages").$type<TourPackage[]>().notNull(),
  included: jsonb("included").$type<string[]>().notNull(),
  notIncluded: jsonb("not_included").$type<string[]>().notNull(),
  featured: boolean("featured").notNull().default(false),
  priceSource: priceSource("price_source").notNull().default("excel"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const tourDays = pgTable(
  "tour_days",
  {
    id: serial("id").primaryKey(),
    tourId: text("tour_id")
      .notNull()
      .references(() => tours.id, { onDelete: "cascade" }),
    dayNumber: integer("day_number").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    highlights: jsonb("highlights").$type<string[]>().notNull(),
  },
  (table) => [uniqueIndex("tour_days_tour_day_idx").on(table.tourId, table.dayNumber)],
);

export const places = pgTable("places", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  bannerImage: text("banner_image").notNull(),
  location: text("location"),
  listingNumber: integer("listing_number").notNull(),
  content: jsonb("content").$type<DestinationSection[]>().notNull(),
});

export const tourPlaces = pgTable(
  "tour_places",
  {
    tourId: text("tour_id")
      .notNull()
      .references(() => tours.id, { onDelete: "cascade" }),
    placeSlug: text("place_slug")
      .notNull()
      .references(() => places.slug, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.tourId, table.placeSlug] })],
);

export const posts = pgTable("posts", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  author: text("author").notNull(),
  date: text("date").notNull(),
  coverImage: text("cover_image").notNull(),
  content: jsonb("content").$type<BlogSection[]>().notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  src: text("src").notNull(),
  alt: text("alt").notNull(),
  category: text("category").notNull(),
  span: text("span"),
  homeOnly: boolean("home_only").notNull().default(false),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  avatar: text("avatar").notNull(),
  location: text("location").notNull(),
  text: text("text").notNull(),
  rating: integer("rating").notNull(),
});

export const slides = pgTable("slides", {
  id: serial("id").primaryKey(),
  image: text("image").notNull(),
  title: text("title").notNull(),
  rotation: integer("rotation").notNull(),
  sortOrder: integer("sort_order").notNull(),
});

export const hotelRates = pgTable(
  "hotel_rates",
  {
    id: serial("id").primaryKey(),
    place: text("place").notNull(),
    startCity: text("start_city").notNull(),
    grade: text("grade").notNull(),
    twin: integer("twin").notNull(),
    triple: integer("triple").notNull(),
    hotelName: text("hotel_name").notNull().default(""),
    offered: boolean("offered").notNull().default(true),
  },
  (table) => [uniqueIndex("hotel_rates_place_city_grade_idx").on(table.place, table.startCity, table.grade)],
);

export const vehicleRates = pgTable(
  "vehicle_rates",
  {
    id: serial("id").primaryKey(),
    place: text("place").notNull(),
    startCity: text("start_city").notNull(),
    mode: text("mode").notNull(),
    vehicle: text("vehicle").notNull(),
    rent: integer("rent").notNull(),
    fuel: integer("fuel").notNull(),
    toll: integer("toll").notNull(),
    seats: integer("seats").notNull(),
    live: boolean("live").notNull().default(true),
  },
  (table) => [uniqueIndex("vehicle_rates_place_city_mode_vehicle_idx").on(table.place, table.startCity, table.mode, table.vehicle)],
);

export const airExtras = pgTable("air_extras", {
  id: serial("id").primaryKey(),
  islamabadTicket: integer("islamabad_ticket").notNull(),
  lahoreAdd: integer("lahore_add").notNull(),
  karachiAdd: integer("karachi_add").notNull(),
  welcomePack: integer("welcome_pack").notNull(),
  entry: integer("entry").notNull(),
  infantExtra: integer("infant_extra").notNull(),
  sticker: integer("sticker").notNull(),
});

// BR-91: where a trip starts. The air extra is added to the Islamabad ticket. The long-route extra
// is an amount per vehicle per day after a number of days on a road trip. A start city is not deleted.
export const startCities = pgTable("start_cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  road: boolean("road").notNull(),
  air: boolean("air").notNull(),
  airExtra: integer("air_extra").notNull().default(0),
  longRouteAfterDays: integer("long_route_after_days"),
  longRoutePerVehicleDay: integer("long_route_per_vehicle_day").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const jeepLines = pgTable("jeep_lines", {
  id: serial("id").primaryKey(),
  place: text("place").notNull(),
  mode: text("mode").notNull(),
  label: text("label").notNull(),
  people: integer("people").notNull(),
  amount: integer("amount").notNull(),
  live: boolean("live").notNull().default(true),
});

export const seasons = pgTable("seasons", {
  id: serial("id").primaryKey(),
  percent: integer("percent").notNull(),
});

// BR-87: the pricing rules the quote reads, changed on the Pricing rules tab. One row.
export const pricingRules = pgTable("pricing_rules", {
  id: serial("id").primaryKey(),
  guidePerDay: integer("guide_per_day").notNull(),
  breakfastPerPerson: integer("breakfast_per_person").notNull(),
  childFarePercent: integer("child_fare_percent").notNull(),
  lapInfantFare: integer("lap_infant_fare").notNull(),
  seatInfantFare: integer("seat_infant_fare").notNull(),
  peoplePerRoom: integer("people_per_room").notNull(),
});

// BR-87 and BR-88: the dinner rate per night and the lunch rate per day, per person, for each grade.
export const mealRates = pgTable("meal_rates", {
  id: serial("id").primaryKey(),
  grade: text("grade").notNull().unique(),
  dinner: integer("dinner").notNull(),
  lunch: integer("lunch").notNull(),
});

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  place: text("place").notNull(),
  startCity: text("start_city").notNull(),
  mode: text("mode").notNull(),
  days: integer("days").notNull(),
  adults: integer("adults").notNull(),
  children: integer("children").notNull(),
  lapInfants: integer("lap_infants").notNull(),
  seatInfants: integer("seat_infants").notNull(),
  grade: text("grade").notNull(),
  vehicle: text("vehicle").notNull(),
  otherNote: text("other_note").notNull().default(""),
  guide: boolean("guide").notNull(),
  meals: boolean("meals").notNull(),
  lunch: boolean("lunch").notNull().default(false),
  // T-49 (BR-89, BR-92): the counts staff typed, null when the quote used the automatic count, and
  // whether the air tickets were in. Null on quotes saved before T-49, which had the tickets.
  roomCount: integer("room_count"),
  vehicleCount: integer("vehicle_count"),
  tickets: boolean("tickets"),
  seasonPercent: integer("season_percent").notNull(),
  subtotal: integer("subtotal").notNull(),
  profit: integer("profit").notNull(),
  total: integer("total").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const quoteNights = pgTable("quote_nights", {
  id: serial("id").primaryKey(),
  quoteId: integer("quote_id")
    .notNull()
    .references(() => quotes.id, { onDelete: "cascade" }),
  night: integer("night").notNull(),
  rate: integer("rate").notNull(),
  hotelName: text("hotel_name").notNull(),
});

export const quoteDays = pgTable("quote_days", {
  id: serial("id").primaryKey(),
  quoteId: integer("quote_id")
    .notNull()
    .references(() => quotes.id, { onDelete: "cascade" }),
  day: integer("day").notNull(),
  vehicle: text("vehicle").notNull(),
  rent: integer("rent").notNull(),
  fuel: integer("fuel").notNull(),
  toll: integer("toll").notNull(),
  cleared: boolean("cleared").notNull().default(false),
});

export const quoteExtras = pgTable("quote_extras", {
  id: serial("id").primaryKey(),
  quoteId: integer("quote_id")
    .notNull()
    .references(() => quotes.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  amount: integer("amount").notNull(),
});

export const guestRequests = pgTable("guest_requests", {
  id: serial("id").primaryKey(),
  kind: guestRequestKind("kind").notNull(),
  status: guestRequestStatus("status").notNull().default("new"),
  name: text("name").notNull().default(""),
  phone: text("phone").notNull().default(""),
  email: text("email").notNull().default(""),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey(),
  phoneDisplay: text("phone_display").notNull(),
  phoneE164: text("phone_e164").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  mapsUrl: text("maps_url").notNull(),
  facebookUrl: text("facebook_url").notNull(),
  instagramUrl: text("instagram_url").notNull(),
  tiktokUrl: text("tiktok_url").notNull(),
  youtubeUrl: text("youtube_url").notNull(),
});

// BR-86: one row per successful office save. user_id has no foreign key, so removing a login keeps
// its old rows. area decides who may read the row. record_id is empty for a single record.
export const activity = pgTable(
  "activity",
  {
    id: serial("id").primaryKey(),
    at: timestamp("at", { withTimezone: true }).defaultNow().notNull(),
    userId: integer("user_id").notNull(),
    userEmail: text("user_email").notNull(),
    area: text("area").notNull(),
    kind: text("kind").notNull(),
    recordId: text("record_id").notNull().default(""),
    text: text("text").notNull(),
  },
  (table) => [index("activity_at_idx").on(table.at), index("activity_kind_record_at_idx").on(table.kind, table.recordId, table.at)],
);

// T-58 (design section 15): the package tables, drizzle/0009_packages.sql.

// BR-105: one day of a rate place's plan. pricedAs is the rate place this day's night is priced at
// (BR-112) and whose hotel-names line it uses (BR-111). Null means the quote's own place.
export const dayPlans = pgTable(
  "day_plans",
  {
    id: serial("id").primaryKey(),
    place: text("place").notNull(),
    part: text("part").$type<DayPlanPart>().notNull(),
    position: integer("position").notNull(),
    title: text("title").notNull(),
    overnight: text("overnight").notNull(),
    pricedAs: text("priced_as"),
    sections: jsonb("sections").$type<DayPlanSection[]>().notNull().default([]),
  },
  (table) => [
    index("day_plans_place_part_position_idx").on(table.place, table.part, table.position),
    check("day_plans_part_check", sql`${table.part} in ('out_air', 'out_road', 'middle', 'back_air', 'back_road')`),
  ],
);

// BR-111: one hotel-names line for each rate place and grade. A blank line is not stored.
export const placeHotelNames = pgTable(
  "place_hotel_names",
  {
    place: text("place").notNull(),
    grade: text("grade").notNull(),
    names: text("names").notNull(),
  },
  (table) => [primaryKey({ columns: [table.place, table.grade] })],
);

// BR-107: package options, used from T-59. places is empty for an option offered at every place.
export const packageOptions = pgTable("package_options", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  places: text("places").array().notNull().default(sql`'{}'::text[]`),
  dayOne: jsonb("day_one").$type<DayPlanSection>(),
  swapFrom: text("swap_from"),
  swapTo: integer("swap_to"),
  restDays: boolean("rest_days").notNull().default(false),
  badge: text("badge"),
  intro: text("intro"),
  notIncluded: text("not_included").array().notNull().default(sql`'{}'::text[]`),
  sortOrder: integer("sort_order").notNull().default(0),
});

// BR-108: the fixed sections, in order, used from T-60.
export const packageSections = pgTable(
  "package_sections",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    kind: text("kind").$type<"text" | "rows" | "steps">().notNull(),
    body: jsonb("body").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [check("package_sections_kind_check", sql`${table.kind} in ('text', 'rows', 'steps')`)],
);

// BR-109 and BR-114: a saved quote's package choices, used from T-61. Removed with its quote.
export const quotePackages = pgTable(
  "quote_packages",
  {
    quoteId: integer("quote_id")
      .primaryKey()
      .references(() => quotes.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    allGrades: boolean("all_grades").notNull().default(false),
    flightNote: boolean("flight_note").notNull().default(true),
    optionIds: integer("option_ids").array().notNull().default(sql`'{}'::integer[]`),
    pictures: text("pictures").array().notNull().default(sql`'{}'::text[]`),
  },
  (table) => [check("quote_packages_pictures_check", sql`cardinality(${table.pictures}) <= 3`)],
);
