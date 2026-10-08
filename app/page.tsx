import HomePage from "@/components/home/HomePage";
import { getPhotos, getPlaces, getPosts, getReviews, getSlides, getTours } from "@/lib/http/site-content";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [tours, destinations, posts, photos, reviews, slides] = await Promise.all([
    getTours(),
    getPlaces(),
    getPosts(),
    getPhotos(),
    getReviews(),
    getSlides(),
  ]);

  return (
    <HomePage
      tours={tours}
      destinations={destinations}
      posts={posts}
      photos={photos}
      reviews={reviews}
      slides={slides}
    />
  );
}
