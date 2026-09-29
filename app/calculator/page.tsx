import CalculatorPage from "@/components/calculator/CalculatorView";
import { getTours } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Page() {
  const tours = await getTours();
  return <CalculatorPage tours={tours} />;
}
