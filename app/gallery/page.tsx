import Gallery from "@/components/gallery/GalleryBrowse";
import { getPhotos } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Page() {
  const photos = await getPhotos();
  return <Gallery photos={photos} />;
}
