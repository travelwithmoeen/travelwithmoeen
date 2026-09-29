import { redirect } from "next/navigation";
import { getSiteSettings } from "@/lib/content";
import { getCurrentUser } from "@/lib/auth/session";
import { canEditContent } from "@/lib/auth/permissions";
import { SiteForm } from "@/components/office/SiteForm";

export default async function OfficeSitePage() {
  const user = await getCurrentUser();
  if (!user || !canEditContent(user.role)) redirect("/office");
  const settings = await getSiteSettings();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Site details</h1>
      <SiteForm settings={settings} />
    </div>
  );
}
