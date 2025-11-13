import { AppShell, Box, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { deleteCookie, getCookie } from "cookies-next";
import websiteData from "@/utils/mock/commonData.json";
import list from "@/utils/mock/sideBar.json";

export function AdminDashboardLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const token = getCookie("token");
    if (!token) router.push("/"); // Redirect if no token
  }, [router.isReady, router]);

  const handleLogout = async () => {
    await deleteCookie("user");
    await deleteCookie("token");
    router.push("/");
  };

  const darkBg = "#171717";
  const darkCard = "#262626";
  const darkText = "#e5e5e5";
  const accentColor = "#1e3a8a";
  const primaryColor = "#3b82f6";
  const sidebarColor = "#171717";
  const sidebarText = "#e5e5e5";
  const sidebarButtonActive = "#3b82f6";
  const sidebarButtonActiveText = "#ffffff";

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
      style={{ backgroundColor: darkBg }}
    >
      <AppShell.Header style={{ backgroundColor: darkBg }}>
        <div className="flex justify-between items-center pt-4 container mx-auto">
          <h1 className="text-2xl font-bold" style={{ color: darkText }}>
            {websiteData?.projectTitleSmall}
          </h1>
          <h1 className="text-2xl font-bold" style={{ color: darkText }}>
            ADMIN DASHBOARD
          </h1>
          <div>
            <Button
              onClick={handleLogout}
              radius="md"
              size="sm"
              color="black"
              variant="outline"
            >
              Logout
            </Button>
          </div>
        </div>
      </AppShell.Header>

      <AppShell.Navbar style={{ backgroundColor: sidebarColor }}>
        <Box
          className="flex flex-col gap-4 container mx-auto"
          style={{
            width: "100%",
            padding: "10px",
            borderRight: "1px solid #404040",
            height: "calc(100vh - 60px)",
            overflowY: "auto",
          }}
        >
          {list?.map((item: any) => (
            <Button
              key={item?.id}
              onClick={() => router.push(`/dashboard/${item?.slug}`)}
              radius="md"
              size="sm"
              color={accentColor}
              fullWidth
              variant={
                router.pathname === `/dashboard/${item?.slug}`
                  ? "filled"
                  : "outline"
              }
              style={{
                color:
                  router.pathname === `/dashboard/${item?.slug}`
                    ? sidebarButtonActiveText
                    : sidebarText,
                backgroundColor:
                  router.pathname === `/dashboard/${item?.slug}`
                    ? sidebarButtonActive
                    : "transparent",
              }}
            >
              {item.title}
            </Button>
          ))}
        </Box>
      </AppShell.Navbar>

      <AppShell.Main style={{ backgroundColor: darkBg }}>
        <Box style={{ padding: "20px", color: darkText }}>{children}</Box>
      </AppShell.Main>
    </AppShell>
  );
}
