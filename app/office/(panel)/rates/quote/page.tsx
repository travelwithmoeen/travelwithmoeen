import { loadRateDesk } from "@/components/office/rates/load-rates";
import { QuoteScreen, type QuoteRates } from "@/components/office/rates/QuoteScreen";
import { quoteOptions } from "@/lib/quote";

export default async function RatesQuotePage() {
  const desk = await loadRateDesk();
  // BR-90 and BR-91: only the start cities for each travel mode, and only the places with an offered
  // hotel rate and a live vehicle rate from there.
  const options = quoteOptions(desk.hotels, desk.vehicles, desk.startCities);
  const vehicles = [...new Set(desk.vehicles.filter((row) => row.live).map((row) => row.vehicle))];
  // BR-94: the rates the Stay and services switches show. The quote itself is priced on the server.
  const rates: QuoteRates = {
    guidePerDay: desk.rules?.guidePerDay ?? null,
    meals: desk.meals.map((row) => ({ grade: row.grade, dinner: row.dinner, lunch: row.lunch })),
    islamabadTicket: desk.air?.islamabadTicket ?? null,
    airExtras: Object.fromEntries(desk.startCities.map((city) => [city.name, city.airExtra])),
  };
  return <QuoteScreen options={options} vehicles={vehicles} margin={desk.seasonPercent} rates={rates} />;
}
