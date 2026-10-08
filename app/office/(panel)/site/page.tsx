import { redirect } from "next/navigation";
import { getSiteSettings } from "@/lib/http/site-content";
import { getOfficeSession } from "@/lib/http/office-session";
import { SiteForm } from "@/components/office/SiteForm";

export default async function OfficeSitePage() {
  const user = await getOfficeSession();
  if (!user?.canEditContent) redirect("/office");
  const settings = await getSiteSettings();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Site details</h1>
      <SiteForm settings={settings} />
    </div>
  );
}
