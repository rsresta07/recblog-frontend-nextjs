import { useEffect, useState } from "react";
import CommonLoader from "@/components/common/CommonLoader";
import CommonBlogList from "@/components/common/CommonBlogList";
import { Pagination } from "@mantine/core";
import { APIUserRecommendedPosts } from "@/api/recommendation";

/**
 * Splits an array into chunks of a specified size.
 *
 * @param array - The array to be split into chunks.
 * @param size - The size of each chunk.
 * @returns A two-dimensional array where each sub-array is a chunk of the specified size.
 */
function chunk<T>(array: T[], size: number): T[][] {
  return array.length
    ? [array.slice(0, size), ...chunk(array.slice(size), size)]
    : [];
}

/**
 * A component that displays a grid of user-based recommended blog posts.
 *
 * Uses the APIUserRecommendedPosts function to fetch a list of recommended posts
 * based on user-based collaborative filtering algorithm.
 *
 * @param limit - The number of posts to display in the grid.
 * @returns A JSX element that renders the grid of recommended blog posts.
 */
const UserBasedRecommendation = ({ limit }: any) => {
  const itemsPerPage = 30;
  const [loading, setLoading] = useState(false);
  const [activePage, setPage] = useState(1);
  const [postData, setPostData] = useState<any[]>([]);
  const paginatedPosts = chunk(postData, itemsPerPage);
  const currentPosts = paginatedPosts[activePage - 1] || [];

  /**
   * Fetches the list of blog posts from the server using the APIUserRecommendedPosts
   * function and updates the state of the component.
   *
   * @async
   * @function
   * @returns {Promise<void>}
   */
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
    <section className="container mx-auto py-12">
      <h2 className="text-2xl font-bold text-primary mb-4">All Blog Posts</h2>

      <section className={`grid grid-cols-12 gap-8`}>
        {loading ? (
          <CommonLoader />
        ) : currentPosts.length === 0 ? (
          <div className="flex justify-center items-center">
            <h2>No post found</h2>
          </div>
        ) : (
          currentPosts?.slice(0, limit)?.map((post) => (
            <div
              key={post?.id}
              className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-4 transform transition-transform duration-300 hover:scale-[1.05]"
            >
              <CommonBlogList post={post} />
            </div>
          ))
        )}
      </section>
      <div className="flex justify-center mt-4">
        <Pagination
          total={paginatedPosts.length}
          siblings={2}
          value={activePage}
          onChange={setPage}
          mt="sm"
        />
      </div>
    </section>
  );
};

export default UserBasedRecommendation;
