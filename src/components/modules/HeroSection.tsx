import { useState, useEffect } from "react";
import RecentBlog from "@/components/modules/RecentBlog";
import RecommendedBlog from "./RecommendedBlog";
import PostPagination from "./BlogPostPagination";
import { ApiGetPost } from "@/api/blog";
import { useAuth } from "@/utils/hooks/useAuth";

export default function HeroSection() {
  const { user } = useAuth();
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoadingPosts(true);
      ApiGetPost(1, 10) // fetch first 10 posts
        .then((res: any) => setRecentPosts(res?.data?.data || []))
        .finally(() => setLoadingPosts(false));
    }
  }, [user]);

  return (
    <main className="flex flex-col w-full bg-background text-foreground pt-4">
      <section className="flex-grow pt-8 container mx-auto">
        {!user && (
          <div className="flex flex-col gap-4 mb-16 md:mt-[5rem] md:mb-[10rem]">
            <h1 className="text-center text-4xl md:text-5xl font-bold text-primary">
              Welcome to RecBlog
            </h1>
            <h2 className="text-center text-lg md:text-2xl text-foreground">
              A platform where you can read and write about your favorite
              topics.
            </h2>
          </div>
        )}

        <div className="mb-16">
          <RecentBlog posts={recentPosts.slice(0, 4)} loading={loadingPosts} />
        </div>

        {user && (
          <div className="mb-16">
            <RecommendedBlog />
          </div>
        )}

        <div className="mb-40">
          <PostPagination />
        </div>
      </section>
    </main>
  );
}
