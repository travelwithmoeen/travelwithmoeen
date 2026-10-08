import Destinations from "@/components/destinations/DestinationsBrowse";
import { getPlaces } from "@/lib/http/site-content";

export const dynamic = "force-dynamic";

export default async function Page() {
  const destinations = await getPlaces();
  return <Destinations destinations={destinations} />;
}
