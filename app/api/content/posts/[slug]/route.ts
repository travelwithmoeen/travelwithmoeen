import { getPost } from "@/lib/content";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return Response.json({ ok: false, error: "That post was not found." }, { status: 404 });
  return Response.json({ ok: true, post });
}
