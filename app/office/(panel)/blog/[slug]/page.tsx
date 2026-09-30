import { notFound, redirect } from "next/navigation";
import { getPost } from "@/lib/content";
import { getOfficeSession } from "@/lib/http/office-session";
import { PostForm } from "@/components/office/PostForm";

export default async function OfficePostPage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await getOfficeSession();
  if (!user?.canEditContent) redirect("/office");
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
