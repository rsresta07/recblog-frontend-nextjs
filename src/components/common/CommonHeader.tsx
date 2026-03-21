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
import { Spotlight, spotlight, type SpotlightActionData } from "@mantine/spotlight";
import { IconSearch } from "@tabler/icons-react";
import { ApiGetPost } from "@/api/blog";
import { TextInput } from "@mantine/core";

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
    window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank", "noopener,noreferrer");

  function GlobalHotkeys() {
    useHotkeys([
      ["mod+K", () => spotlight.open()],
      ["mod+shift+alt+X", rickroll],
    ]);
    return null;
  }

  async function loadData(query: string = "") {
    try {
      const response = await ApiGetPost(1, 10);
      const blogPosts = response?.data?.data || [];
      const filteredPosts = query
        ? blogPosts.filter((post: any) =>
          post.title.toLowerCase().includes(query.toLowerCase())
        )
        : blogPosts;

      const actions = filteredPosts.map((post: any) => ({
        id: post.id,
        label: post.title,
        onClick: () => router.push(`/blog/${post.slug}`),
        component: () => (
          <div
            onClick={() => router.push(`/blog/${post.slug}`)}
            className="flex items-center gap-4 p-3 hover:bg-primary/10 rounded-2xl cursor-pointer transition-colors"
          >
            <img src={post.image} alt={post.title} className="w-12 h-12 object-cover rounded-xl shadow-sm" />
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-foreground">{post.title}</span>
              <span className="text-xs text-muted-foreground line-clamp-1">
                {post.content?.replace(/<[^>]+>/g, "").slice(0, 100).trim() + "…"}
              </span>
            </div>
          </div>
        ),
      }));
      setActions(actions);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  }

  useEffect(() => {
    if (searchQuery.trim().length >= 3) loadData(searchQuery);
    else setActions([]);
  }, [searchQuery]);

  return (
  <header className="hidden md:block sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
    <section className="container mx-auto flex justify-between items-center py-3 px-8">
      <CommonLogo />

      {/* Desktop Search */}
      <div className="flex w-[20rem]">
        <TextInput
          placeholder="Search (Ctrl + K)"
          readOnly
          onClick={() => spotlight.open()}
          leftSection={<IconSearch size={18} stroke={1.5} className="text-muted-foreground" />}
          className="w-full"
          classNames={{ input: 'bg-card/50 backdrop-blur-md border-border/50 cursor-pointer hover:border-primary/50 transition-colors' }}
          radius="xl"
        />
      </div>

      <Spotlight
        actions={actions}
        searchProps={{
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.currentTarget.value),
          leftSection: <IconSearch size={20} stroke={1.5} />,
          placeholder: "Type at least 3 characters to search…",
        }}
        highlightQuery
        classNames={{ content: 'rounded-3xl', body: 'bg-background/90 backdrop-blur-xl border border-border/50' }}
      >
        <GlobalHotkeys />
        <Shortcut symbol="K" description="Open Spotlight Search" />
        <Shortcut symbol="X" description="Rickroll" />
      </Spotlight>

      {/* Desktop Nav */}
      <nav className="flex items-center gap-6 font-medium text-sm">
        {user && (
          <>
            <Link href={`/user/${user?.slug}/add-post`} className="text-foreground hover:text-primary transition-colors">Add Post</Link>
            <Link href={`/recommendation`} className="text-foreground hover:text-primary transition-colors">For You</Link>
          </>
        )}
        {headerData?.options?.map((item: any) => (
          <Link key={item.id} href={item?.link} className="text-foreground hover:text-primary transition-colors">
            {item?.title}
          </Link>
        ))}
        <div className="flex items-center gap-4 ml-2 border-l border-border/50 pl-6">
          {user ? (
            <>
              <Link href={user.role === "SUPER_ADMIN" ? `/dashboard/${user?.slug}` : `/user/${user?.slug}`} className="text-primary hover:text-primary/80 transition-colors">Profile</Link>
              <button onClick={logout} className="px-4 py-2 bg-destructive/10 text-destructive rounded-full hover:bg-destructive hover:text-white transition-colors">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => setShowLoginModal(true)} className="px-5 py-2 bg-primary text-primary-foreground rounded-full shadow-sm hover:opacity-90 transition-opacity">Sign In</button>
              <LoginModal triggerOpen={showLoginModal} setTriggerOpen={setShowLoginModal} openRegisterModal={openRegisterModal} />
              <RegisterModal openLoginModal={() => setShowLoginModal(true)} />
            </>
          )}
        </div>
      </nav>
    </section>
  </header>
);
}