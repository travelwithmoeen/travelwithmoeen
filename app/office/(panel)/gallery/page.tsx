import { redirect } from "next/navigation";
import { getPhotos } from "@/lib/http/site-content";
import { getOfficeSession } from "@/lib/http/office-session";
import { GalleryEditor } from "@/components/office/GalleryEditor";

export default async function OfficeGalleryPage() {
  const user = await getOfficeSession();
  if (!user?.canEditContent) redirect("/office");
  const photos = await getPhotos();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Gallery</h1>
      <GalleryEditor photos={photos} />
    </div>
  );
}
