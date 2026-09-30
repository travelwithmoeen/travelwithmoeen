import TourTemplatePage from "@/components/tours/TourTemplateView";
import { getTour } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tour = await getTour(id);
  return <TourTemplatePage tour={tour} />;
}
