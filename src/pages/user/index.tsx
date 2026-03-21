import { useRouter } from "next/router";
import { useEffect } from "react";

/**
 * Redirects to homepage if user is not logged in.
 * If user is logged in, redirects to user's profile page.
 */
const User = () => {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    router.push("/");
  }, [router.isReady, router]);

  return null; // Explicitly return null for a pure redirect component
};

export default User;