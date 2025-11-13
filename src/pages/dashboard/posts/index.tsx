// AdminPost.tsx
import CommonBlogList from "@/components/common/CommonBlogList";
import CommonLoader from "@/components/common/CommonLoader";
import { AdminDashboardLayout } from "@/layouts/AdminDashboardLayout";
import { useState, useEffect } from "react";
import { ApiGetAllPost, ApiDeletePost, ApiTogglePostStatus } from "@/api/blog";
import { Loader, Pagination, Switch, Text } from "@mantine/core";
import Link from "next/link";

const AdminPost = () => {
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [postData, setPostData] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 30;

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await ApiGetAllPost(page, itemsPerPage);
      setPostData(response?.data?.data || []);
      setTotalPages(response?.data?.meta?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await ApiDeletePost(id);
      fetchData(activePage);
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Failed to delete post.");
    }
  };

  useEffect(() => {
    fetchData(activePage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activePage]);

  const darkBg = "#171717";
  const darkCard = "#262626";
  const textColor = "#e5e5e5";
  const accentColor = "#3b82f6";
  const secondaryColor = "#1e3a8a";

  return (
    <main
      style={{ backgroundColor: darkBg, color: textColor, minHeight: "100vh" }}
    >
      <section className="grid grid-cols-3 gap-8">
        {loading ? (
          <Loader color="white" size="md" />
        ) : postData.length === 0 ? (
          <div className="flex justify-center items-center col-span-3">
            <h2>No post found</h2>
          </div>
        ) : (
          postData.map((post) => (
            <div key={post.id} className="flex flex-col mb-8">
              <CommonBlogList post={post} dark />

              <div className="flex justify-between items-center">
                <Link href={`/dashboard/posts/${post.id}/edit`}>
                  <button
                    style={{
                      backgroundColor: secondaryColor,
                      color: "#fff",
                    }}
                    className="px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300"
                  >
                    Edit
                  </button>
                </Link>
                <div className="flex items-center gap-2">
                  <Text style={{ color: accentColor }}>
                    {post.status ? "Active" : "Inactive"}
                  </Text>
                  <Switch
                    checked={post.status}
                    onChange={async () => {
                      try {
                        await ApiTogglePostStatus(post.id); // toggle status
                        fetchData(activePage);
                      } catch (err) {
                        console.error("Failed to toggle post status:", err);
                        alert("Failed to toggle post status.");
                      }
                    }}
                    size="md"
                    color={accentColor}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            total={totalPages}
            siblings={2}
            value={activePage}
            onChange={setActivePage}
            mt="sm"
            color={accentColor}
          />
        </div>
      )}
    </main>
  );
};

export default AdminPost;

AdminPost.getLayout = (page: any) => (
  <AdminDashboardLayout>{page}</AdminDashboardLayout>
);
