import { useEffect, useState } from "react";
import CommonBlogList from "@/components/common/CommonBlogList";
import { Pagination } from "@mantine/core";

interface BlogPostGridProps {
  fetchFunction: (page: number, limit: number) => Promise<any>; // pass page & limit
  title: string;
  limit?: number; // posts per page
}

const BlogPostGrid = ({
  fetchFunction,
  title,
  limit = 12,
}: BlogPostGridProps) => {
  const [loading, setLoading] = useState(false);
  const [activePage, setPage] = useState(1);
  const [postData, setPostData] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetchFunction(page, limit);
      // Handle paginated API response
      setPostData(response?.data?.data || []);
      setTotalPages(response?.data?.meta?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(activePage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activePage]);

  return (
    <section className="container mx-auto mb-[10rem] py-12">
      <h2 className="text-3xl font-bold text-primary mb-6">{title}</h2>

      <section className="grid grid-cols-12 gap-6">
        {loading
          ? [...Array(limit)].map((_, i) => (
              <div
                key={i}
                className="col-span-12 sm:col-span-6 md:col-span-4 transform duration-300 hover:scale-[1.03] bg-card border border-border rounded-lg shadow-md hover:shadow-lg transition"
              >
                <CommonBlogList loading />
              </div>
            ))
          : postData.map((post) => (
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
    </section>
  );
};

export default BlogPostGrid;
