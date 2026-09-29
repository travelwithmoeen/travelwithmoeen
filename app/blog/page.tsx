import Blog from "@/components/blog/BlogBrowse";
import { getPosts } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Page() {
  const posts = await getPosts();
  return <Blog posts={posts} />;
}
