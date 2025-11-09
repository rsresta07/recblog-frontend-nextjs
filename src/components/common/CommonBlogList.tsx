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
      className="w-full h-full bg-card p-4 rounded-lg flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
      key={post?.id}
    >
      <div className="overflow-hidden rounded-lg flex-shrink-0 mb-4">
        <Link href={`/blog/${post?.slug}`}>
          <Image
            src={post?.image}
            alt={post?.title}
            width={1024}
            height={1024}
            className="w-full h-[18rem] object-cover hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>
      <div>
        <span className="text-sm text-primary mb-1 block">
          {post?.user && (
            <Link
              href={`/user/${post?.user?.slug}`}
              className="hover:text-accent"
            >
              {post?.user?.fullName}
            </Link>
          )}
        </span>
        <Link href={`/blog/${post?.slug}`}>
          <h3 className="text-lg line-clamp-1 text-primary font-bold hover:text-accent">
            {post?.title}
          </h3>
          <div
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
            className="mb-4 text-foreground text-sm [&_*]:text-sm [&_*]:m-0 line-clamp-2"
          />
          {post?.tags?.map((tag: any) => (
            <span
              key={tag?.id}
              className="text-sm px-2 bg-primary rounded-lg text-primary-foreground m-1"
            >
              {tag?.title}
            </span>
          ))}
          <div className="mt-6 text-sm flex items-center justify-end space-x-6 text-foreground">
            <div className="flex items-center gap-2 text-sm">
              <IconEye className="text-muted-foreground" />{" "}
              {post?.viewCount || 0}
            </div>
            <div className="flex items-center gap-2">
              <IconHeart className="text-heart-red" /> {post?.likeCount || 0}
            </div>
            <div className="flex items-center gap-2">
              <IconMessage className="text-muted-foreground" />{" "}
              {post?.commentCount || 0}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CommonBlogList;
