import { useRouter } from "next/router";
import { useEffect } from "react";

const AdminPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Navigate to AdminDash page
    router.push("/dashboard/dashboard"); // replace with the actual route of AdminDash
  }, []);

  return null; // or your JSX
};

export default AdminPage;
