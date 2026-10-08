import { getPosts } from "@/lib/content";

export async function GET() {
  return Response.json({ ok: true, posts: await getPosts() });
}
