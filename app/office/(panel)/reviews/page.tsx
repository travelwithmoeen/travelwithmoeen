import { redirect } from "next/navigation";
import { getReviews } from "@/lib/content";
import { getCurrentUser } from "@/lib/auth/session";
import { canEditContent } from "@/lib/auth/permissions";
import { ReviewsEditor } from "@/components/office/ReviewsEditor";

export default async function OfficeReviewsPage() {
  const user = await getCurrentUser();
  if (!user || !canEditContent(user.role)) redirect("/office");
  const reviews = await getReviews();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Reviews</h1>
      <ReviewsEditor reviews={reviews} />
    </div>
  );
}
