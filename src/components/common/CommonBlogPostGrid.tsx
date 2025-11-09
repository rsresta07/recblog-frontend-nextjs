import { useEffect, useState } from "react";
import CommonBlogList from "@/components/common/CommonBlogList";
import { Pagination } from "@mantine/core";

function chunk<T>(array: T[], size: number): T[][] {
  return array.length
    ? [array.slice(0, size), ...chunk(array.slice(size), size)]
    : [];
}

interface BlogPostGridProps {
  fetchFunction: () => Promise<any>;
  title: string;
  limit?: number;
  itemsPerPage?: number;
}

const BlogPostGrid = ({
  fetchFunction,
  title,
  limit,
  itemsPerPage = 60,
}: BlogPostGridProps) => {
  const [loading, setLoading] = useState(false);
  const [activePage, setPage] = useState(1);
  const [postData, setPostData] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("date");

  const sortPosts = (posts: any[]) => {
    switch (sortBy) {
      case "likes":
        return [...posts].sort(
          (a, b) => (b.likeCount || 0) - (a.likeCount || 0)
        );
      case "views":
        return [...posts].sort(
          (a, b) => (b.viewCount || 0) - (a.viewCount || 0)
        );
      case "comments":
        return [...posts].sort(
          (a, b) => (b.commentCount || 0) - (a.commentCount || 0)
        );
      case "relevance":
        return [...posts].sort(
          (a, b) =>
            (b.viewCount || 0) +
            (b.likeCount || 0) -
            ((a.viewCount || 0) + (a.likeCount || 0))
        );
      case "date":
      default:
        return posts;
    }
  };

  const paginatedPosts = chunk(sortPosts(postData), itemsPerPage);
  const currentPosts = paginatedPosts[activePage - 1] || [];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchFunction();
      setPostData(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [sortBy]);

  return (
    <section className="container mx-auto mb-[10rem] py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-primary">{title}</h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground"
        >
          <option value="date">Newest</option>
          <option value="likes">Most Liked</option>
          <option value="views">Most Viewed</option>
          <option value="comments">Most Commented</option>
          <option value="relevance">Relevance</option>
        </select>
      </div>

      <section className="grid grid-cols-12 gap-6">
        {loading
          ? [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="col-span-12 sm:col-span-6 md:col-span-4 transform duration-300 hover:scale-[1.03] bg-card border border-border rounded-lg shadow-md hover:shadow-lg transition"
              >
                <CommonBlogList loading />
              </div>
            ))
          : currentPosts?.slice(0, limit)?.map((post) => (
              <div
                key={post.id}
                className="col-span-12 sm:col-span-6 md:col-span-4 transform duration-300 hover:scale-[1.03] bg-card border border-border rounded-lg shadow-md hover:shadow-lg transition"
              >
                <CommonBlogList post={post} />
              </div>
            ))}
      </section>

      {paginatedPosts.length > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            total={paginatedPosts.length}
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
