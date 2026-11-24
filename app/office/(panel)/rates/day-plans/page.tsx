import { redirect } from "next/navigation";
import { savedByText } from "@/components/office/activity";
import { requestTime } from "@/components/office/format";
import { DayPlansPanel } from "@/components/office/rates/DayPlansPanel";
import { Alert } from "@/components/office/ui/Alert";
import { getOfficeSession, getSavedBy } from "@/lib/http/office-session";
import { getDayPlanDesk } from "@/lib/http/site-content";

// T-58 (BR-105, BR-106, BR-111): each rate place's days and its hotel-names lines. Owner and Manager
// only, read through GET /api/office/day-plans.
export default async function RatesDayPlansPage({ searchParams }: { searchParams: Promise<{ place?: string }> }) {
  const user = await getOfficeSession();
  if (!user?.canEditRates) redirect("/office");
  const { place } = await searchParams;
  const desk = await getDayPlanDesk(typeof place === "string" && place ? place : null);
  // A place that is not a rate place, such as one renamed since the link was made, opens the first.
  if (!desk) redirect("/office/rates/day-plans");
  if (!desk.place) {
    return <Alert tone="info" title="No rate places yet">Add a hotel or vehicle rate first. Each rate place gets its own day plans.</Alert>;
  }
  const records = desk.hotelNames.map((row) => `${desk.place}: ${row.grade}`);
  const [daysSaved, namesSaved] = await Promise.all([
    getSavedBy("day_plan", desk.days.map((day) => day.id)),
    getSavedBy("hotel_names", records),
  ]);
  const now = requestTime();
  return (
    <DayPlansPanel
      key={desk.place}
      places={desk.places}
      place={desk.place}
      days={desk.days}
      hotelNames={desk.hotelNames.map((row, index) => ({ ...row, savedBy: savedByText(namesSaved[records[index]], now) }))}
      daySavedBy={Object.fromEntries(desk.days.map((day) => [day.id, savedByText(daysSaved[String(day.id)], now)?.text ?? ""]))}
    />
  );
}
