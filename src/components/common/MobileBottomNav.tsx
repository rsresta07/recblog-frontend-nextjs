import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/utils/hooks/useAuth";
import { spotlight } from "@mantine/spotlight";
import {
  IconHome,
  IconSearch,
  IconSquarePlus,
  IconUser,
  IconLogin,
  IconMenu2,
  IconSparkles,
  IconLogout,
  IconLink
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import LoginModal from "../modals/LoginModal";
import RegisterModal from "../modals/RegisterModal";
import headerData from "@/utils/mock/headerData.json";

export default function MobileBottomNav() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Scroll detection logic
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Close menu if scrolling occurs
      if (isMenuOpen) setIsMenuOpen(false);

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [isMenuOpen]);

  // Main 5 Bottom Nav Items (Swapped Profile for "For You")
  const navItems = [
    { icon: IconHome, label: "Home", href: "/" },
    { icon: IconSearch, label: "Search", onClick: () => spotlight.open() },
    ...(user
      ? [
        { icon: IconSquarePlus, label: "Add", href: `/user/${user.slug}/add-post` },
        { icon: IconSparkles, label: "For You", href: "/recommendation" },
        { icon: IconMenu2, label: "Menu", onClick: () => setIsMenuOpen(!isMenuOpen) },
      ]
      : [
        { icon: IconLogin, label: "Sign In", onClick: () => setShowLoginModal(true) },
      ]),
  ];

  return (
    <>
      {/* Floating Menu Popover (Profile, Logout, etc.) */}
      {user && (
        <>
          {/* Backdrop overlay to close menu when clicking outside */}
          {isMenuOpen && (
            <div
              className="md:hidden fixed inset-0 z-40"
              onClick={() => setIsMenuOpen(false)}
            />
          )}

          <div
            className={`md:hidden fixed z-40 left-4 right-4 bg-background/95 backdrop-blur-3xl border border-border/60 shadow-2xl rounded-3xl p-4 transition-all duration-300 ease-out origin-bottom ${
              isMenuOpen && isVisible
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                : "opacity-0 scale-95 translate-y-10 pointer-events-none"
            }`}
            style={{ bottom: "calc(6rem + env(safe-area-inset-bottom))" }}
          >
            <div className="flex flex-col gap-2">
              {/* Swapped "For You" for Profile */}
              <Link
                href={user.role === "SUPER_ADMIN" ? `/dashboard/${user.slug}` : `/user/${user.slug}`}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-primary/10 text-foreground font-semibold transition-colors"
              >
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <IconUser size={20} />
                </div>
                Profile
              </Link>

              {headerData?.options?.map((item: any) => (
                <Link
                  key={item.id}
                  href={item.link}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-primary/10 text-foreground font-semibold transition-colors"
                >
                  <div className="p-2 bg-muted rounded-full text-muted-foreground">
                    <IconLink size={20} />
                  </div>
                  {item.title}
                </Link>
              ))}

              <div className="h-px bg-border/50 my-2" />

              <button
                onClick={() => { logout(); setIsMenuOpen(false); }}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-destructive/10 text-destructive font-semibold transition-colors text-left"
              >
                <div className="p-2 bg-destructive/10 rounded-full">
                  <IconLogout size={20} />
                </div>
                Logout
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Floating Bottom Bar */}
      <nav
        className={`md:hidden fixed z-50 left-4 right-4 max-w-sm mx-auto bg-background/85 backdrop-blur-2xl border border-border/60 shadow-2xl rounded-full transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "translate-y-[150%]"
        }`}
        style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
      >
        <div className="flex justify-around items-center h-16 px-4">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = item.href && router.asPath === item.href;

            // Highlight the menu icon if the menu is open
            const isMenuIconActive = item.label === "Menu" && isMenuOpen;

            const content = (
              <div className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive || isMenuIconActive ? 'text-primary drop-shadow-sm' : 'text-muted-foreground hover:text-foreground transition-colors'}`}>
                <Icon size={24} stroke={isActive || isMenuIconActive ? 2.5 : 1.5} />
                <span className="text-[10px] font-semibold tracking-wide">{item.label}</span>
              </div>
            );

            if (item.onClick) {
              return (
                <button key={idx} onClick={item.onClick} className="flex-1 h-full py-1 active:scale-90 transition-transform">
                  {content}
                </button>
              );
            }

            return (
              <Link key={idx} href={item.href!} className="flex-1 h-full py-1 active:scale-90 transition-transform">
                {content}
              </Link>
            );
          })}
        </div>
      </nav>

      <LoginModal
        triggerOpen={showLoginModal}
        setTriggerOpen={setShowLoginModal}
        openRegisterModal={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />
      <RegisterModal
        triggerOpen={showRegisterModal}
        setTriggerOpen={setShowRegisterModal}
        openLoginModal={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </>
  );
}