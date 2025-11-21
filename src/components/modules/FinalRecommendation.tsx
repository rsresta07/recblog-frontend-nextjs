import { APIFinalRecommendedPosts } from "@/api/recommendation";
import BlogPostGrid from "../common/CommonBlogPostGrid";
import Head from "next/head";

/**
 * A component that displays a grid of final recommended blog posts.
 *
 * Uses the APIFinalRecommendedPosts function to fetch a list of recommended posts
 * based on combined user-based and interaction-based recommendations.
 *
 * @param limit - The number of posts to display in the grid.
 * @returns A JSX element that renders the grid of recommended blog posts.
 */
const FinalRecommendation = ({ limit }: any) => {
  return (
    <>
      <Head>
        <title>RecBlog | For You</title>
      </Head>
      <BlogPostGrid
        fetchFunction={APIFinalRecommendedPosts}
        title="For You"
        limit={limit}
      />
    </>
  );
};

export default FinalRecommendation;
