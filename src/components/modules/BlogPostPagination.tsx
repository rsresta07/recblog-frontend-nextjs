import { useState, useEffect } from "react";
import { Pagination } from "@mantine/core";
import { ApiGetPost } from "@/api/blog";
import CommonBlogList from "@/components/common/CommonBlogList";
import { useRouter } from "next/router";

const PostPagination = () => {
  const itemsPerPage = 6;
  const [loading, setLoading] = useState(false);
  const [activePage, setPage] = useState(1);
  const [postData, setPostData] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await ApiGetPost(page, itemsPerPage); // pass page
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
        <h2 className="text-3xl font-bold text-primary mb-8">All Blog Posts</h2>
      </section>

      {loading ? (
        <div className="text-center text-muted-foreground py-16">
          Loading...
        </div>
      ) : (
        <section className="grid grid-cols-12 gap-6">
          {postData?.map((post) => (
            <div
              key={post?.id}
              className="col-span-12 sm:col-span-6 md:col-span-4 transform transition-transform duration-300 hover:scale-[1.03]"
            >
              <div className="bg-card border border-border rounded-lg shadow-md hover:shadow-lg overflow-hidden transition-shadow duration-300">
                <CommonBlogList post={post} />
              </div>
            </div>
          ))}
        </section>
      )}

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
    </main>
  );
};

export default PostPagination;
