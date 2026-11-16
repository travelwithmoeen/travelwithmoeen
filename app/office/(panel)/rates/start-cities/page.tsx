import { savedByCells } from "@/components/office/activity";
import { requestTime } from "@/components/office/format";
import { loadRateDesk } from "@/components/office/rates/load-rates";
import { StartCityDrawer } from "@/components/office/rates/RateDrawers";
import { RateTable } from "@/components/office/rates/RateTable";
import { Alert } from "@/components/office/ui/Alert";
import { getSavedBy } from "@/lib/http/office-session";

// BR-91: where trips start. The Quote screen offers a start city only for the travel modes it starts,
// so Karachi is not offered for a road trip (BR-19).
export default async function RatesStartCitiesPage() {
  const [desk, savedBy] = await Promise.all([loadRateDesk(), getSavedBy("start_city")]);
  return (
    <>
      <Alert tone="info" title="Start cities">
        The air extra is added to the Islamabad ticket for each adult. The long-route extra is added for each vehicle on each day of a road trip after the days shown. Renaming a city renames it on its hotel and vehicle rates. A start city is not deleted.
      </Alert>
      <StartCityDrawer />
      <RateTable
        kind="start_city"
        noun="start cities"
        toolbar={false}
        busyLabel="Saving start cities"
        columns={[
          { key: "name", label: "City", type: "name" },
          { key: "road", label: "Road trips", type: "switch" },
          { key: "air", label: "Air trips", type: "switch" },
          { key: "airExtra", label: "Air extra", type: "money" },
          { key: "longRouteAfterDays", label: "Long-route after days", type: "count" },
          { key: "longRoutePerVehicleDay", label: "Long-route, per vehicle per day", type: "money" },
        ]}
        rows={desk.startCities.map((row) => ({
          id: row.id,
          values: {
            name: row.name,
            road: row.road,
            air: row.air,
            airExtra: row.airExtra,
            longRouteAfterDays: row.longRouteAfterDays ?? "",
            longRoutePerVehicleDay: row.longRoutePerVehicleDay,
          },
        }))}
        savedBy={savedByCells(savedBy, requestTime())}
        nameKeys={["name"]}
      />
    </>
  );
}
