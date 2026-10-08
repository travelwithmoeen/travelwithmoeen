import DestinationDetail from "@/components/destinations/DestinationDetailView";
import { getPlace } from "@/lib/http/site-content";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const destination = await getPlace(id);
  return <DestinationDetail destination={destination} />;
}
