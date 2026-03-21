import { useEffect, useState } from "react";
import CommonBlogList from "@/components/common/CommonBlogList";
import { Pagination } from "@mantine/core";

interface BlogPostGridProps {
  fetchFunction: (page: number, limit: number) => Promise<any>;
  title: string;
  limit?: number;
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
      setPostData(response?.data?.data || []);
      setTotalPages(response?.data?.meta?.totalPages || response?.data?.totalPages  || 1);
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
      <h2 className="text-primary">{title}</h2>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading
          ? [...Array(limit)].map((_, i) => (
            <div key={i} className="h-full">
              <CommonBlogList loading />
            </div>
          ))
          : postData.map((post) => (
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
    </section>
  );
};

export default BlogPostGrid;