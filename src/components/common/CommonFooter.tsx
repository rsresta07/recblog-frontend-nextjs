import { Anchor, Group } from "@mantine/core";
import CommonLogo from "./CommonLogo";
import Link from "next/link";

const links = [{ link: "/blog", label: "Blog" }];

export default function CommonFooter() {
  return (
    <footer className="bg-background text-foreground border-t border-border py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
        {/* Logo */}
        <div className="flex items-center">
          <CommonLogo />
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center md:justify-end gap-4">
          {links.map((link) => (
            <Anchor
              component={Link}
              key={link.label}
              href={link.link}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
            >
              {link.label}
            </Anchor>
          ))}
        </nav>

        {/* Copyright */}
        <div className="text-xs text-muted-foreground mt-4 md:mt-0 text-center md:text-right">
          &copy; {new Date().getFullYear()} Rameshwor Shrestha. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
