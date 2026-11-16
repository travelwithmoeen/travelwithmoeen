import { loadRateDesk } from "@/components/office/rates/load-rates";
import { QuoteScreen } from "@/components/office/rates/QuoteScreen";
import { quoteOptions } from "@/lib/quote";

export default async function RatesQuotePage() {
  const desk = await loadRateDesk();
  // BR-90 and BR-91: only the start cities for each travel mode, and only the places with an offered
  // hotel rate and a live vehicle rate from there.
  const options = quoteOptions(desk.hotels, desk.vehicles, desk.startCities);
  const vehicles = [...new Set(desk.vehicles.filter((row) => row.live).map((row) => row.vehicle))];
  return <QuoteScreen options={options} vehicles={vehicles} margin={desk.seasonPercent} />;
}
