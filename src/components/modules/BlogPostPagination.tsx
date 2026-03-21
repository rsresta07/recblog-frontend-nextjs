import { useState, useEffect } from "react";
import { Pagination } from "@mantine/core";
import { ApiGetPost } from "@/api/blog";
import CommonBlogList from "@/components/common/CommonBlogList";

const PostPagination = () => {
  const itemsPerPage = 6;
  const [loading, setLoading] = useState(false);
  const [activePage, setPage] = useState(1);
  const [postData, setPostData] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await ApiGetPost(page, itemsPerPage);
      setPostData(response?.data?.data || []);
      setTotalPages(response?.data?.meta?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activePage);
  }, [activePage]);

  return (
    <main className="container mx-auto px-4 mb-40">
      <section>
        <h2 className="text-primary">All Blog Posts</h2>
      </section>

      {loading ? (
        <div className="flex justify-center items-center py-16 text-muted-foreground">
          <div className="animate-pulse flex gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-75" />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-150" />
            <span className="ml-2">Loading...</span>
          </div>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {postData?.map((post) => (
            <div key={post?.id} className="h-full">
              <CommonBlogList post={post} />
            </div>
          ))}
        </section>
      )}

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
    </main>
  );
};

export default PostPagination;