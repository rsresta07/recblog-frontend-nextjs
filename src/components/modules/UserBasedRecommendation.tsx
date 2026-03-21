import { useEffect, useState } from "react";
import CommonLoader from "@/components/common/CommonLoader";
import CommonBlogList from "@/components/common/CommonBlogList";
import { Pagination } from "@mantine/core";
import { APIUserRecommendedPosts } from "@/api/recommendation";

function chunk<T>(array: T[], size: number): T[][] {
  return array.length
    ? [array.slice(0, size), ...chunk(array.slice(size), size)]
    : [];
}

const UserBasedRecommendation = ({ limit }: any) => {
  const itemsPerPage = 30;
  const [loading, setLoading] = useState(false);
  const [activePage, setPage] = useState(1);
  const [postData, setPostData] = useState<any[]>([]);
  const paginatedPosts = chunk(postData, itemsPerPage);
  const currentPosts = paginatedPosts[activePage - 1] || [];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await APIUserRecommendedPosts();
      setPostData(response?.data);
    } catch (error) {
      console.error("Failed to fetch:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <section className="container mx-auto py-12 mb-[10rem]">
      <h2 className="text-primary">Recommended By Users</h2>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          <CommonLoader />
        ) : currentPosts.length === 0 ? (
          <div className="col-span-full flex justify-center items-center py-20 text-muted-foreground">
            <h3>No posts found</h3>
          </div>
        ) : (
          currentPosts?.slice(0, limit)?.map((post) => (
            <div key={post?.id} className="h-full">
              <CommonBlogList post={post} />
            </div>
          ))
        )}
      </section>

      {paginatedPosts.length > 1 && (
        <div className="flex justify-center mt-12">
          <Pagination
            total={paginatedPosts.length}
            siblings={2}
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

export default UserBasedRecommendation;