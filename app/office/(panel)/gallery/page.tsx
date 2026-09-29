import { redirect } from "next/navigation";
import { getPhotos } from "@/lib/content";
import { getCurrentUser } from "@/lib/auth/session";
import { canEditContent } from "@/lib/auth/permissions";
import { GalleryEditor } from "@/components/office/GalleryEditor";

export default async function OfficeGalleryPage() {
  const user = await getCurrentUser();
  if (!user || !canEditContent(user.role)) redirect("/office");
  const photos = await getPhotos();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Gallery</h1>
      <GalleryEditor photos={photos} />
    </div>
  );
}
