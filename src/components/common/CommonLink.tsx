import Link from "next/link";

interface CommonLinkProps {
  link: string;
  linkLabel: string;
}

const CommonLink = ({ link, linkLabel }: CommonLinkProps) => {
  return (
    <Link
      href={link}
      className="inline-flex justify-center px-6 py-2.5 text-sm font-semibold bg-primary/90 text-primary-foreground backdrop-blur-md rounded-full shadow-sm hover:bg-primary hover:shadow-md transition-all duration-300"
    >
      {linkLabel}
    </Link>
  );
};

export default CommonLink;