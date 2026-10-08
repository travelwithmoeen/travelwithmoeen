import TourDetails from "@/components/tours/TourDetail";
import { getTour } from "@/lib/http/site-content";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tour = await getTour(id);
  return <TourDetails tour={tour} />;
}
