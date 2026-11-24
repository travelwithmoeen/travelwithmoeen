import { redirect } from "next/navigation";
import { savedByText } from "@/components/office/activity";
import { requestTime } from "@/components/office/format";
import { PackageOptionsPanel } from "@/components/office/rates/PackageOptionsPanel";
import { getOfficeSession, getSavedBy } from "@/lib/http/office-session";
import { getPackageOptionDesk } from "@/lib/http/site-content";

// T-59 (BR-107): the package options. Owner and Manager only, read through
// GET /api/office/package-options.
export default async function RatesPackageOptionsPage() {
  const user = await getOfficeSession();
  if (!user?.canEditRates) redirect("/office");
  const desk = await getPackageOptionDesk();
  if (!desk) redirect("/office");
  const saved = await getSavedBy("package_option", desk.options.map((option) => option.id));
  const now = requestTime();
  return (
    <PackageOptionsPanel
      options={desk.options}
      places={desk.places}
      middleDays={desk.middleDays}
      savedBy={Object.fromEntries(desk.options.map((option) => [option.id, savedByText(saved[String(option.id)], now)?.text ?? ""]))}
    />
  );
}
