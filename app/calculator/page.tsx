import CalculatorPage from "@/components/calculator/CalculatorView";
import { getTours } from "@/lib/http/site-content";

export const dynamic = "force-dynamic";

export default async function Page() {
  const tours = await getTours();
  return <CalculatorPage tours={tours} />;
}
