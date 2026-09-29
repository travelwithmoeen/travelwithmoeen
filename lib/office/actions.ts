"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authenticate } from "@/lib/auth/authenticate";
import { clearSessionCookie, requireUser, setSessionCookie } from "@/lib/auth/session";
import { createUserAs, changeRoleAs, removeUserAs, type ActionResult } from "@/lib/office/users";
import {
  deletePhotoAs,
  deleteReviewAs,
  deleteSlideAs,
  deleteTourAs,
  savePhotoAs,
  savePriceAs,
  saveReviewAs,
  saveSlideAs,
  saveUploadedImage,
  updatePlaceAs,
  updatePostAs,
  updateSiteSettingsAs,
  updateTourAs,
  type TourEditInput,
} from "@/lib/office/content-writes";
import type { BlogSection } from "@/data/blog";
import type { DestinationSection } from "@/data/destinations";

export async function loginAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const user = await authenticate(email, password);
  if (!user) {
    return { ok: false, error: "That email or password is not right." };
  }
  await setSessionCookie(user.id);
  redirect("/office");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/office/login");
}

export async function createUserAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const actor = await requireUser();
  const result = await createUserAs(actor, {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    role: String(formData.get("role") ?? ""),
  });
  if (result.ok) revalidatePath("/office/users");
  return result;
}

export async function changeRoleAction(formData: FormData) {
  const actor = await requireUser();
  const userId = Number(formData.get("userId"));
  const role = String(formData.get("role") ?? "");
  const result = await changeRoleAs(actor, userId, role);
  if (result.ok) revalidatePath("/office/users");
  return result;
}

export async function removeUserAction(formData: FormData) {
  const actor = await requireUser();
  const userId = Number(formData.get("userId"));
  const result = await removeUserAs(actor, userId);
  if (result.ok) revalidatePath("/office/users");
  return result;
}

export async function savePriceAction(): Promise<ActionResult> {
  const actor = await requireUser();
  return savePriceAs(actor);
}

function lines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function updateTourAction(formData: FormData): Promise<ActionResult> {
  const actor = await requireUser();
  let image = String(formData.get("image") ?? "");
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    try {
      image = await saveUploadedImage(file);
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "The photo could not be saved." };
    }
  }
  const itinerary = JSON.parse(String(formData.get("itinerary") ?? "[]")) as TourEditInput["itinerary"];
  const result = await updateTourAs(actor, {
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? ""),
    location: String(formData.get("location") ?? ""),
    region: String(formData.get("region") ?? ""),
    description: String(formData.get("description") ?? ""),
    duration: Number(formData.get("duration") ?? 0),
    image,
    pdf: String(formData.get("pdf") ?? ""),
    galleryImages: lines(String(formData.get("galleryImages") ?? "")),
    categories: lines(String(formData.get("categories") ?? "")) as TourEditInput["categories"],
    packageTypes: lines(String(formData.get("packageTypes") ?? "")) as TourEditInput["packageTypes"],
    transport: String(formData.get("transport") ?? ""),
    included: lines(String(formData.get("included") ?? "")),
    notIncluded: lines(String(formData.get("notIncluded") ?? "")),
    featured: formData.get("featured") === "on",
    itinerary,
  });
  if (result.ok) {
    revalidatePath("/");
    revalidatePath("/tours");
    revalidatePath(`/tours/${String(formData.get("id") ?? "")}`);
  }
  return result;
}

export async function deleteTourAction(formData: FormData): Promise<ActionResult> {
  const actor = await requireUser();
  const id = String(formData.get("id") ?? "");
  const result = await deleteTourAs(actor, id);
  if (result.ok) {
    revalidatePath("/tours");
    redirect("/office/tours");
  }
  return result;
}

export async function updatePlaceAction(formData: FormData): Promise<ActionResult> {
  const actor = await requireUser();
  const content = JSON.parse(String(formData.get("content") ?? "[]")) as DestinationSection[];
  const result = await updatePlaceAs(actor, {
    slug: String(formData.get("slug") ?? ""),
    title: String(formData.get("title") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    bannerImage: String(formData.get("bannerImage") ?? ""),
    location: String(formData.get("location") ?? ""),
    content,
  });
  if (result.ok) {
    revalidatePath("/destinations");
    revalidatePath(`/destinations/${String(formData.get("slug") ?? "")}`);
  }
  return result;
}

export async function updatePostAction(formData: FormData): Promise<ActionResult> {
  const actor = await requireUser();
  const content = JSON.parse(String(formData.get("content") ?? "[]")) as BlogSection[];
  const result = await updatePostAs(actor, {
    slug: String(formData.get("slug") ?? ""),
    title: String(formData.get("title") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    author: String(formData.get("author") ?? ""),
    date: String(formData.get("date") ?? ""),
    coverImage: String(formData.get("coverImage") ?? ""),
    content,
  });
  if (result.ok) {
    revalidatePath("/blog");
    revalidatePath(`/blog/${String(formData.get("slug") ?? "")}`);
  }
  return result;
}

export async function savePhotoAction(formData: FormData): Promise<ActionResult> {
  const actor = await requireUser();
  let src = String(formData.get("src") ?? "");
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    try {
      src = await saveUploadedImage(file);
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "The photo could not be saved." };
    }
  }
  const idValue = String(formData.get("id") ?? "");
  const result = await savePhotoAs(actor, {
    id: idValue ? Number(idValue) : undefined,
    src,
    alt: String(formData.get("alt") ?? ""),
    category: String(formData.get("category") ?? ""),
    span: String(formData.get("span") ?? ""),
    homeOnly: formData.get("homeOnly") === "on",
  });
  if (result.ok) revalidatePath("/gallery");
  return result;
}

export async function deletePhotoAction(formData: FormData): Promise<ActionResult> {
  const actor = await requireUser();
  const result = await deletePhotoAs(actor, Number(formData.get("id")));
  if (result.ok) revalidatePath("/gallery");
  return result;
}

export async function saveReviewAction(formData: FormData): Promise<ActionResult> {
  const actor = await requireUser();
  const idValue = String(formData.get("id") ?? "");
  const result = await saveReviewAs(actor, {
    id: idValue ? Number(idValue) : undefined,
    name: String(formData.get("name") ?? ""),
    avatar: String(formData.get("avatar") ?? ""),
    location: String(formData.get("location") ?? ""),
    text: String(formData.get("text") ?? ""),
    rating: Number(formData.get("rating") ?? 5),
  });
  if (result.ok) revalidatePath("/");
  return result;
}

export async function deleteReviewAction(formData: FormData): Promise<ActionResult> {
  const actor = await requireUser();
  const result = await deleteReviewAs(actor, Number(formData.get("id")));
  if (result.ok) revalidatePath("/");
  return result;
}

export async function saveSlideAction(formData: FormData): Promise<ActionResult> {
  const actor = await requireUser();
  let image = String(formData.get("image") ?? "");
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    try {
      image = await saveUploadedImage(file);
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "The photo could not be saved." };
    }
  }
  const idValue = String(formData.get("id") ?? "");
  const result = await saveSlideAs(actor, {
    id: idValue ? Number(idValue) : undefined,
    image,
    title: String(formData.get("title") ?? ""),
    rotation: Number(formData.get("rotation") ?? 0),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  });
  if (result.ok) revalidatePath("/");
  return result;
}

export async function deleteSlideAction(formData: FormData): Promise<ActionResult> {
  const actor = await requireUser();
  const result = await deleteSlideAs(actor, Number(formData.get("id")));
  if (result.ok) revalidatePath("/");
  return result;
}

export async function updateSiteSettingsAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const actor = await requireUser();
  const result = await updateSiteSettingsAs(actor, {
    phoneDisplay: String(formData.get("phoneDisplay") ?? ""),
    phoneE164: String(formData.get("phoneE164") ?? ""),
    email: String(formData.get("email") ?? ""),
    address: String(formData.get("address") ?? ""),
    mapsUrl: String(formData.get("mapsUrl") ?? ""),
    facebookUrl: String(formData.get("facebookUrl") ?? ""),
    instagramUrl: String(formData.get("instagramUrl") ?? ""),
    tiktokUrl: String(formData.get("tiktokUrl") ?? ""),
    youtubeUrl: String(formData.get("youtubeUrl") ?? ""),
  });
  if (result.ok) revalidatePath("/", "layout");
  return result;
}
