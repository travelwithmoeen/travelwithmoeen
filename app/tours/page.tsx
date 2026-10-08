import Tours from "@/components/tours/ToursBrowse";
import { getTours } from "@/lib/http/site-content";

export const dynamic = "force-dynamic";

export default async function Page() {
  const tours = await getTours();
  return <Tours tours={tours} />;
}
