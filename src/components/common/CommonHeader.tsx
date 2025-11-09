import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import headerData from "@/utils/mock/headerData.json";
import CommonLogo from "@/components/common/CommonLogo";
import LoginModal from "../modals/LoginModal";
import RegisterModal from "../modals/RegisterModal";
import { useAuth } from "@/utils/hooks/useAuth";
import { useHotkeys } from "@mantine/hooks";
import { Shortcut } from "@/utils/lib/Shortcut";
import {
  Spotlight,
  spotlight,
  type SpotlightActionData,
} from "@mantine/spotlight";
import { IconSearch } from "@tabler/icons-react";
import { ApiGetPost } from "@/api/blog";
import { Button, TextInput } from "@mantine/core";

export default function CommonHeader() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [actions, setActions] = useState<SpotlightActionData[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { user, logout } = useAuth();
  const router = useRouter();

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
  };

  const rickroll = () =>
    window.open(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "_blank",
      "noopener,noreferrer"
    );

  function GlobalHotkeys() {
    useHotkeys([
      ["mod+K", () => spotlight.open()],
      ["mod+shift+alt+X", rickroll],
    ]);
    return null;
  }

  async function loadData() {
    const { data: blogPosts } = await ApiGetPost();
    const actions: SpotlightActionData[] = blogPosts?.map((post: any) => ({
      id: post.id,
      label: post.title,
      onClick: () => router.push(`/blog/${post.slug}`),
      component: () => (
        <div
          onClick={() => router.push(`/blog/${post.slug}`)}
          className="flex items-center gap-4 p-3 hover:bg-muted rounded cursor-pointer transition-colors"
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-12 h-12 object-cover rounded"
          />
          <div className="flex flex-col">
            <span className="font-medium text-sm text-foreground">
              {post.title}
            </span>
            <span className="text-xs text-muted-foreground line-clamp-2">
              {post.content
                ?.replace(/<[^>]+>/g, "")
                .slice(0, 100)
                .trim() + "…"}
            </span>
          </div>
        </div>
      ),
    }));
    setActions(actions);
  }

  useEffect(() => {
    loadData();
  }, [router]);

  return (
    <header className="bg-background border-b border-border">
      <section className="container mx-auto flex justify-between items-center py-4">
        <CommonLogo />

        {/* Search for small screens */}
        <div className="md:hidden">
          <button
            aria-label="Search"
            onClick={() => spotlight.open()}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <IconSearch size={22} stroke={1.5} className="text-foreground" />
          </button>
        </div>

        {/* Search for large screens */}
        <div className="hidden md:flex w-[20rem]">
          <TextInput
            placeholder="Search (Ctrl + K)"
            readOnly
            onClick={() => spotlight.open()}
            leftSection={
              <IconSearch
                size={18}
                stroke={1.5}
                className="text-muted-foreground"
              />
            }
            className="w-full bg-card text-foreground"
            radius="lg"
          />
        </div>

        {/* Spotlight */}
        <Spotlight
          actions={
            searchQuery.trim()
              ? actions.filter((action) =>
                  action?.label
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
              : []
          }
          searchProps={{
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.currentTarget.value),
            leftSection: <IconSearch size={20} stroke={1.5} />,
            placeholder: "Search anything…",
          }}
          highlightQuery
          className="bg-background text-foreground"
        >
          <GlobalHotkeys />
          <Shortcut symbol="K" description="Open Spotlight Search" />
          <Shortcut symbol="X" description="Rickroll" />
        </Spotlight>

        {/* Navigation */}
        <nav className="flex items-center gap-4 text-foreground">
          {user && (
            <>
              <Link
                href={`/user/${user?.slug}/add-post`}
                className="text-primary hover:text-accent transition-colors"
              >
                Add Post
              </Link>
              <Link
                href={`/recommendation`}
                className="text-primary hover:text-accent transition-colors"
              >
                For You
              </Link>
            </>
          )}
          {headerData?.options?.map((item: any) => (
            <Link
              key={item.id}
              href={item?.link}
              className="text-primary hover:text-accent transition-colors"
            >
              {item?.title}
            </Link>
          ))}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href={
                    user.role === "SUPER_ADMIN"
                      ? `/dashboard/${user?.slug}`
                      : `/user/${user?.slug}`
                  }
                  className="text-primary hover:text-accent transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="text-destructive hover:text-destructive-foreground transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-primary hover:text-accent transition-colors"
                >
                  Sign In
                </button>

                <LoginModal
                  triggerOpen={showLoginModal}
                  setTriggerOpen={setShowLoginModal}
                  openRegisterModal={openRegisterModal}
                />

                <RegisterModal openLoginModal={() => setShowLoginModal(true)} />
              </>
            )}
          </div>
        </nav>
      </section>
    </header>
  );
}
