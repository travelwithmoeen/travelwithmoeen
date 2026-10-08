import BlogDetail from "@/components/blog/BlogDetailView";
import { getPost } from "@/lib/http/site-content";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = await getPost(id);
  return <BlogDetail blog={blog} />;
}
