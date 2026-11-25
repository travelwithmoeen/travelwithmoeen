import { redirect } from "next/navigation";
import { savedByText } from "@/components/office/activity";
import { requestTime } from "@/components/office/format";
import { PackageSectionsPanel } from "@/components/office/rates/PackageSectionsPanel";
import { getOfficeSession, getSavedBy } from "@/lib/http/office-session";
import { getPackageSections } from "@/lib/http/site-content";

// T-60 (BR-108): the fixed sections of the package document. Owner and Manager only, read through
// GET /api/office/package-sections.
export default async function RatesPackageSectionsPage() {
  const user = await getOfficeSession();
  if (!user?.canEditRates) redirect("/office");
  const sections = await getPackageSections();
  if (!sections) redirect("/office");
  const saved = await getSavedBy("package_section", sections.map((section) => section.id));
  const now = requestTime();
  return (
    <PackageSectionsPanel
      sections={sections}
      savedBy={Object.fromEntries(sections.map((section) => [section.id, savedByText(saved[String(section.id)], now)?.text ?? ""]))}
    />
  );
}
