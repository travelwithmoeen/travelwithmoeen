import { getReviews } from "@/lib/content";

export async function GET() {
  return Response.json({ ok: true, reviews: await getReviews() });
}
