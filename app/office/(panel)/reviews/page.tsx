import { redirect } from "next/navigation";
import { getReviews } from "@/lib/content";
import { getOfficeSession } from "@/lib/http/office-session";
import { ReviewsEditor } from "@/components/office/ReviewsEditor";

export default async function OfficeReviewsPage() {
  const user = await getOfficeSession();
  if (!user?.canEditContent) redirect("/office");
  const reviews = await getReviews();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Reviews</h1>
      <ReviewsEditor reviews={reviews} />
    </div>
  );
}
