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
      <h2 className="text-3xl font-bold text-primary mb-6">
        Recommended For You
      </h2>

      {loading ? (
        <ListSkeleton />
      ) : (
        <>
          <section className="grid grid-cols-12 gap-6">
            {currentPosts.map((post) => (
              <div
                key={post.id}
                className="col-span-12 sm:col-span-6 md:col-span-4 transform duration-300 hover:scale-[1.03] bg-card border border-border rounded-lg shadow-md hover:shadow-lg transition"
              >
                <CommonBlogList post={post} />
              </div>
            ))}
          </section>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                total={totalPages}
                siblings={1}
                value={activePage}
                onChange={setPage}
                className="bg-background rounded-md shadow-sm"
                color="primary"
                radius="md"
              />
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default RecommendedBlog;
