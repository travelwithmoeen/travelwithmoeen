import { headers } from "next/headers";
import type { Blog } from "@/data/blog";
import type { Destination } from "@/data/destinations";
import type { GalleryImage } from "@/data/gallery";
import type { Testimonial } from "@/data/testimonials";
import type { Tour } from "@/data/tours";
import type { HomeSlide, SiteSettings } from "@/lib/content-types";
import type { loadRateDesk } from "@/lib/rates";

export type RateDesk = Awaited<ReturnType<typeof loadRateDesk>>;

async function apiUrl(path: string) {
  const configured = (process.env.API_BASE_URL ?? "").trim().replace(/\/$/, "");
  if (configured) return `${configured}${path}`;
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const proto = headerStore.get("x-forwarded-proto") ?? "http";
  if (!host) throw new Error("The API host is not set.");
  return `${proto}://${host}${path}`;
}

async function readJson<T>(path: string): Promise<T | null> {
  const response = await fetch(await apiUrl(path), { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`${path} answered ${response.status}.`);
  return (await response.json()) as T;
}

export async function getTours(): Promise<Tour[]> {
  const body = await readJson<{ tours: Tour[] }>("/api/content/tours");
  return body?.tours ?? [];
}

export async function getTour(id: string): Promise<Tour | null> {
  const body = await readJson<{ tour: Tour }>(`/api/content/tours/${encodeURIComponent(id)}`);
  return body?.tour ?? null;
}

export async function getPlaces(): Promise<Destination[]> {
  const body = await readJson<{ places: Destination[] }>("/api/content/places");
  return body?.places ?? [];
}

export async function getPlace(slug: string): Promise<Destination | null> {
  const body = await readJson<{ place: Destination }>(`/api/content/places/${encodeURIComponent(slug)}`);
  return body?.place ?? null;
}

export async function getPosts(): Promise<Blog[]> {
  const body = await readJson<{ posts: Blog[] }>("/api/content/posts");
  return body?.posts ?? [];
}

export async function getPost(slug: string): Promise<Blog | null> {
  const body = await readJson<{ post: Blog }>(`/api/content/posts/${encodeURIComponent(slug)}`);
  return body?.post ?? null;
}

export async function getPhotos(): Promise<GalleryImage[]> {
  const body = await readJson<{ photos: GalleryImage[] }>("/api/content/photos");
  return body?.photos ?? [];
}

export async function getReviews(): Promise<Testimonial[]> {
  const body = await readJson<{ reviews: Testimonial[] }>("/api/content/reviews");
  return body?.reviews ?? [];
}

export async function getSlides(): Promise<HomeSlide[]> {
  const body = await readJson<{ slides: HomeSlide[] }>("/api/content/slides");
  return body?.slides ?? [];
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const body = await readJson<{ settings: SiteSettings }>("/api/content/site");
  if (!body) throw new Error("Site settings are not loaded. Run the content seed.");
  return body.settings;
}

export async function getRateDesk(): Promise<RateDesk | null> {
  const headerStore = await headers();
  const response = await fetch(await apiUrl("/api/office/rates"), {
    headers: { cookie: headerStore.get("cookie") ?? "" },
    cache: "no-store",
  });
  if (!response.ok) return null;
  const body = (await response.json()) as { ok: boolean; desk?: RateDesk };
  return body.ok && body.desk ? body.desk : null;
}
