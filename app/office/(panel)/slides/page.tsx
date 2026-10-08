import { redirect } from "next/navigation";
import { getSlides } from "@/lib/http/site-content";
import { getOfficeSession } from "@/lib/http/office-session";
import { SlidesEditor } from "@/components/office/SlidesEditor";

export default async function OfficeSlidesPage() {
  const user = await getOfficeSession();
  if (!user?.canEditContent) redirect("/office");
  const slides = await getSlides();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Home slides</h1>
      <SlidesEditor slides={slides} />
    </div>
  );
}
