import { redirect } from "next/navigation";
import { getSlides } from "@/lib/content";
import { getCurrentUser } from "@/lib/auth/session";
import { canEditContent } from "@/lib/auth/permissions";
import { SlidesEditor } from "@/components/office/SlidesEditor";

export default async function OfficeSlidesPage() {
  const user = await getCurrentUser();
  if (!user || !canEditContent(user.role)) redirect("/office");
  const slides = await getSlides();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Home slides</h1>
      <SlidesEditor slides={slides} />
    </div>
  );
}
