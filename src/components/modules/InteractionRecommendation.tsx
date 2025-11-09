import { APIInteractionRecommendedPosts } from "@/api/recommendation";
import BlogPostGrid from "../common/CommonBlogPostGrid";

/**
 * A component that displays a grid of blog posts recommended based on user interactions.
 *
 * Utilizes the APIInteractionRecommendedPosts function to fetch a list of recommended posts
 * derived from the user's interactions with other users.
 *
 * @param limit - The number of posts to display in the grid.
 * @returns A JSX element that renders a grid of interaction-based recommended blog posts.
 */
const InteractionRecommendation = ({ limit }: any) => {
  return (
    <BlogPostGrid
      fetchFunction={APIInteractionRecommendedPosts}
      title="For You"
      limit={limit}
    />
  );
};

export default InteractionRecommendation;
