import React, { ReactNode } from "react";
import Header from "@/components/common/CommonHeader";
import Footer from "@/components/common/CommonFooter";
import MobileBottomNav from "@/components/common/MobileBottomNav";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
});

interface LayoutProps {
  children: ReactNode;
}

const HeroLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <main className={`${poppins.className} min-h-screen flex flex-col bg-background text-foreground`}>
      <Header />

      {/* - pt-[env(safe-area-inset-top)] prevents content colliding with iPhone notch (since header is hidden)
        - pb-24 md:pb-0 ensures bottom nav doesn't cover content
      */}
      <section
        className="flex-grow pt-[env(safe-area-inset-top)] pb-28 md:pb-0"
      >
        {children}
      </section>

      <Footer />

      <MobileBottomNav />
    </main>
  );
};

export default HeroLayout;