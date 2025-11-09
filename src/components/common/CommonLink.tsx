import Link from "next/link";

interface CommonLinkProps {
  link: string;
  linkLabel: string;
}

const CommonLink = ({ link, linkLabel }: CommonLinkProps) => {
  return (
    <Link
      href={link}
      className="px-4 py-2 bg-primary text-foreground rounded-lg shadow-md hover:bg-accent transition-colors duration-200"
    >
      {linkLabel}
    </Link>
  );
};

export default CommonLink;
