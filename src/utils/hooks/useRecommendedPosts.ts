import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/utils/hooks/useAuth";
import { APIFinalRecommendedPosts } from "@/api/recommendation";

export function useRecommendedPosts(itemsPerPage: number = 6) {
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [currentPosts, setCurrentPosts] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const { user } = useAuth();
  const userId = user?.id;
  const router = useRouter();

  const fetchData = async (page: number = 1, limit: number = itemsPerPage) => {
    setLoading(true);
    try {
      const response = await APIFinalRecommendedPosts(page, limit);
      const posts = response?.data?.data || [];
      const filteredPosts = userId
        ? posts.filter((post: any) => post.user?.id !== userId)
        : posts;

      setCurrentPosts(filteredPosts);
      setTotalPages(Math.ceil(response?.total / itemsPerPage) || 1);
    } catch (error) {
      console.error("Failed to fetch:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!router.isReady) return;
    fetchData(activePage, itemsPerPage);
  }, [router.isReady, activePage]);

  return {
    currentPosts,
    totalPages,
    activePage,
    setPage: setActivePage,
    loading,
  };
}
