import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type { BlogSection } from "@/data/blog";
import type { DestinationSection } from "@/data/destinations";
import type { TourCategory, TourPackage, PackageType } from "@/data/tours";

export const userRole = pgEnum("user_role", ["owner", "manager", "editor"]);
export const priceSource = pgEnum("price_source", ["excel", "website"]);

export const loginFailures = pgTable(
  "login_failures",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    failedAt: timestamp("failed_at", { withTimezone: true }).notNull(),
  },
  (table) => [index("login_failures_email_failed_at_idx").on(table.email, table.failedAt)],
);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRole("role").notNull(),
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
  id: integer("id").primaryKey(),
  src: text("src").notNull(),
  alt: text("alt").notNull(),
  category: text("category").notNull(),
  span: text("span"),
  homeOnly: boolean("home_only").notNull().default(false),
});

export const reviews = pgTable("reviews", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  avatar: text("avatar").notNull(),
  location: text("location").notNull(),
  text: text("text").notNull(),
  rating: integer("rating").notNull(),
});

export const slides = pgTable("slides", {
  id: integer("id").primaryKey(),
  image: text("image").notNull(),
  title: text("title").notNull(),
  rotation: integer("rotation").notNull(),
  sortOrder: integer("sort_order").notNull(),
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
