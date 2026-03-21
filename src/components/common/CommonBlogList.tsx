import Link from "next/link";
import Image from "next/image";
import SidebarSkeleton from "./CommonListSkeleton";
import sanitizeHtml from "sanitize-html";
import { IconEye, IconHeart, IconMessage } from "@tabler/icons-react";

const CommonBlogList = ({ post, loading }: any) => {
  if (loading || !post) return <SidebarSkeleton />;

  const cleanHtml = sanitizeHtml(post.content, {
    allowedTags: sanitizeHtml.defaults.allowedTags,
    allowedAttributes: {
      "*": ["href", "src", "alt"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      "*": (tagName, attribs) => {
        delete attribs.style;
        return { tagName, attribs };
      },
    },
  });

  return (
    <div
      className="w-full h-full flex flex-col p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl shadow-sm hover:shadow-md transform transition-all duration-300 hover:-translate-y-1"
      key={post?.id}
    >
      <div className="overflow-hidden rounded-xl flex-shrink-0 mb-4">
        <Link href={`/blog/${post?.slug}`}>
          <Image
            src={post?.image}
            alt={post?.title}
            width={1024}
            height={1024}
            className="w-full h-[14rem] object-cover hover:scale-105 transition-transform duration-500"
          />
        </Link>
      </div>
      <div className="flex flex-col flex-grow">
        <span className="text-xs font-medium text-primary mb-2 block">
          {post?.user && (
            <Link
              href={`/user/${post?.user?.slug}`}
              className="hover:underline"
            >
              {post?.user?.fullName}
            </Link>
          )}
        </span>
        <Link href={`/blog/${post?.slug}`} className="group">
          <h3 className="line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {post?.title}
          </h3>
          <div
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
            className="mb-4 text-muted-foreground text-sm [&_*]:text-sm [&_*]:m-0 line-clamp-2"
          />
        </Link>

        <div className="flex flex-wrap gap-2 mt-auto mb-4">
          {post?.tags?.map((tag: any) => (
            <span
              key={tag?.id}
              className="text-xs px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary"
            >
              {tag?.title}
            </span>
          ))}
        </div>

        <div className="pt-4 border-t border-border/50 text-xs flex items-center justify-between text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <IconEye size={16} /> {post?.viewCount || 0}
            </div>
            <div className="flex items-center gap-1.5">
              <IconMessage size={16} /> {post?.commentCount || 0}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-destructive">
            <IconHeart size={16} /> {post?.likeCount || 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonBlogList;