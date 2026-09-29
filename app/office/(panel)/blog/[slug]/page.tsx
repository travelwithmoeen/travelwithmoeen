import { notFound, redirect } from "next/navigation";
import { getPost } from "@/lib/content";
import { getCurrentUser } from "@/lib/auth/session";
import { canEditContent } from "@/lib/auth/permissions";
import { PostForm } from "@/components/office/PostForm";

export default async function OfficePostPage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser();
  if (!user || !canEditContent(user.role)) redirect("/office");
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit post</h1>
      <PostForm post={post} />
    </div>
  );
}
