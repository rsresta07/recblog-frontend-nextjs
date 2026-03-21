import { Pagination } from "@mantine/core";
import ListSkeleton from "../common/CommonListSkeleton";
import { useRecommendedPosts } from "@/utils/hooks/useRecommendedPosts";
import CommonBlogList from "../common/CommonBlogList";

const RecommendedBlog = () => {
  const { currentPosts, totalPages, activePage, setPage, loading } =
    useRecommendedPosts();

  if (!currentPosts.length && !loading) return null;

  return (
    <main className="container mx-auto mb-[10rem]">
      <h2 className="text-primary">
        Recommended For You
      </h2>

      {loading ? (
        <ListSkeleton />
      ) : (
        <>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.map((post) => (
              <div key={post.id} className="h-full">
                <CommonBlogList post={post} />
              </div>
            ))}
          </section>

          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <Pagination
                total={totalPages}
                siblings={1}
                value={activePage}
                onChange={setPage}
                className="bg-background/50 backdrop-blur-md border border-border/50 p-2 rounded-full shadow-sm"
                color="primary"
                radius="xl"
              />
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default RecommendedBlog;