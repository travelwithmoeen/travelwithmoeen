import { getPhotos } from "@/lib/content";

export async function GET() {
  return Response.json({ ok: true, photos: await getPhotos() });
}
