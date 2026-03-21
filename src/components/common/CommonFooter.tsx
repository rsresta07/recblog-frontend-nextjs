import { Anchor } from "@mantine/core";
import CommonLogo from "./CommonLogo";
import Link from "next/link";

const links = [{ link: "/blog", label: "Blog" }];

export default function CommonFooter() {
  return (
    <footer className="bg-background/80 backdrop-blur-xl text-foreground border-t border-border/50 py-8">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center">
          <CommonLogo />
        </div>

        <nav className="flex flex-wrap justify-center gap-6">
          {links.map((link) => (
            <Anchor
              component={Link}
              key={link.label}
              href={link.link}
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              {link.label}
            </Anchor>
          ))}
        </nav>

        <div className="text-xs text-muted-foreground text-center md:text-right font-medium">
          &copy; {new Date().getFullYear()} Rameshwor Shrestha. All rights reserved.
        </div>
      </div>
    </footer>
  );
}