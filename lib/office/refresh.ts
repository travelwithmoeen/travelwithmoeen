import { revalidatePath } from "next/cache";

export function refreshTour(id: string) {
  revalidatePath("/");
  revalidatePath("/tours");
  revalidatePath("/office/tours");
  if (id) revalidatePath(`/tours/${id}`);
}

export function refreshPlace(slug: string) {
  revalidatePath("/destinations");
  if (slug) revalidatePath(`/destinations/${slug}`);
}

export function refreshPost(slug: string) {
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export function refreshGallery() {
  revalidatePath("/gallery");
}

export function refreshHome() {
  revalidatePath("/");
}

export function refreshSite() {
  revalidatePath("/", "layout");
}

export function refreshUsers() {
  revalidatePath("/office/users");
}

export function refreshRequests() {
  revalidatePath("/office/requests");
}
