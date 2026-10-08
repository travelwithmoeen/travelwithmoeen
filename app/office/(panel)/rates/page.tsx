import { redirect } from "next/navigation";
import { RatesDesk } from "@/components/office/RatesDesk";
import { getOfficeSession } from "@/lib/http/office-session";
import { getRateDesk } from "@/lib/http/site-content";

export const dynamic = "force-dynamic";

export default async function OfficeRatesPage() {
  const user = await getOfficeSession();
  if (!user?.canEditRates) redirect("/office");
  const desk = await getRateDesk();
  if (!desk) redirect("/office");
  return (
    <RatesDesk
      desk={{
        hotels: desk.hotels,
        vehicles: desk.vehicles,
        air: desk.air,
        jeeps: desk.jeeps,
        seasonPercent: desk.seasonPercent,
      }}
    />
  );
}
