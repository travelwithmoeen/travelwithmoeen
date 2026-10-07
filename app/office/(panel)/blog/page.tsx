import Link from "next/link";
import { redirect } from "next/navigation";
import { getPosts } from "@/lib/content";
import { getOfficeSession } from "@/lib/http/office-session";

export default async function OfficeBlogPage() {
  const user = await getOfficeSession();
  if (!user?.canEditContent) redirect("/office");
  const posts = await getPosts();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Blog</h1>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link className="block rounded-lg bg-white px-4 py-3 shadow hover:bg-slate-50" href={`/office/blog/${post.slug}`}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
