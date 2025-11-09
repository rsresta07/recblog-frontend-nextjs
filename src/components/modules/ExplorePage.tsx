import { ApiGetPost } from "@/api/blog";
import BlogPostGrid from "../common/CommonBlogPostGrid";

const ExplorePage = ({ limit }: any) => {
  return (
    <BlogPostGrid
      fetchFunction={ApiGetPost}
      title="All Blog Posts"
      limit={limit}
    />
  );
};

export default ExplorePage;
