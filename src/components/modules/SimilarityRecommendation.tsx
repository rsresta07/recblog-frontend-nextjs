import { APIGetRawRecommendedPosts } from "@/api/recommendation";
import BlogPostGrid from "../common/CommonBlogPostGrid";

/**
 * A component that displays a grid of blog posts recommended based on similarity.
 *
 * Utilizes the APIGetRawRecommendedPosts function to fetch a list of recommended posts
 * derived from the user's preferences and interactions.
 *
 * @param {object} props - The component props.
 * @param {number} props.limit - The number of posts to display in the grid.
 *
 * @returns {ReactElement} The component.
 */
const SimilarityRecommendation = ({ limit }: any) => {
  return (
    <BlogPostGrid
      fetchFunction={APIGetRawRecommendedPosts}
      title="For You"
      limit={limit}
    />
  );
};

export default SimilarityRecommendation;
