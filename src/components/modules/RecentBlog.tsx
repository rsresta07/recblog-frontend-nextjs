import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiGetPost } from "@/api/blog";
import { useAuth } from "@/utils/hooks/useAuth";
import { APIGetRecommendedPosts } from "@/api/recommendation";
import sanitizeHtml from "sanitize-html";

/** Skeleton Loader for placeholder UI */
const Skeleton = ({ className }: { className: string }) => (
  <div className={`bg-muted animate-pulse rounded-md ${className}`} />
);

/** Blog Post (Vertical Layout) */
const BlogPostVertical = ({ post, loading }: any) => {
  if (loading || !post)
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-[13rem] w-full rounded-lg" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-12 w-full" />
      </div>
    );

  const cleanHtml = sanitizeHtml(post?.content, {
    allowedTags: sanitizeHtml.defaults.allowedTags,
    allowedAttributes: { "*": ["href", "src", "alt"] },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      "*": (tagName, attribs) => {
        delete attribs.style;
        return { tagName, attribs };
      },
    },
  });

  return (
    <div className="flex flex-col gap-4 transform transition-transform duration-300 hover:scale-[1.05]">
      <Link href={`/blog/${post?.slug}`}>
        <Image
          src={post?.image}
          alt={post?.title || "Blog Post Image"}
          width={1024}
          height={1024}
          className="h-[13rem] object-cover rounded-lg"
        />
      </Link>
      <div>
        <span className="text-primary text-sm">
          {post?.user && (
            <Link href={`/user/${post?.user?.slug}`}>
              {post?.user?.fullName}
            </Link>
          )}
        </span>
        <Link href={`/blog/${post?.slug}`}>
          <h3 className="text-lg font-bold line-clamp-2 text-primary">
            {post?.title}
          </h3>
          <div
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
            className="mb-4 text-foreground text-sm [&_*]:text-sm [&_*]:m-0 line-clamp-3"
          />
        </Link>
        {post?.tags?.map((tag: any) => (
          <span
            key={tag?.id}
            className="text-sm px-2 bg-primary rounded-lg text-primary-foreground m-1"
          >
            <Link href={`#`}>{tag?.title}</Link>
          </span>
        ))}
      </div>
    </div>
  );
};

/** Blog Post (Horizontal Layout) */
const BlogPostHorizontal = ({ post, imageHeight, loading }: any) => {
  if (loading || !post)
    return (
      <div className="grid grid-cols-2 gap-8">
        <Skeleton className={`${imageHeight} w-full rounded-lg`} />
        <div>
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-6 w-2/3 my-2" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );

  const cleanHtml = sanitizeHtml(post?.content, {
    allowedTags: sanitizeHtml.defaults.allowedTags,
    allowedAttributes: { "*": ["href", "src", "alt"] },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      "*": (tagName, attribs) => {
        delete attribs.style;
        return { tagName, attribs };
      },
    },
  });

  return (
    <div className="grid grid-cols-2 gap-8 transform transition-transform duration-300 hover:scale-[1.05]">
      <Link href={`/blog/${post?.slug}`}>
        <Image
          src={post?.image}
          alt={post?.title || "Blog Post Image"}
          width={1024}
          height={1024}
          className={`${imageHeight} w-full object-cover rounded-lg`}
        />
      </Link>
      <div>
        <span className="text-primary text-sm">
          {post?.user && (
            <Link href={`/user/${post?.user?.slug}`}>
              {post?.user?.fullName}
            </Link>
          )}
        </span>
        <Link href={`/blog/${post?.slug}`}>
          <h3 className="text-lg font-bold line-clamp-1 text-primary">
            {post?.title}
          </h3>
          <div
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
            className="mb-4 text-foreground text-sm [&_*]:text-sm [&_*]:m-0 line-clamp-3"
          />
        </Link>
        {post?.tags?.map((tag: any) => (
          <span
            key={tag?.id}
            className="text-sm px-2 bg-primary rounded-lg text-primary-foreground m-1"
          >
            <Link href="#">{tag?.title}</Link>
          </span>
        ))}
      </div>
    </div>
  );
};

/** Recent or Recommended Blog Section */
// RecentBlog.tsx
const RecentBlog = ({ posts, loading }: { posts: any[]; loading: boolean }) => {
  const hasPosts = posts.length > 0;

  return (
    <main className="container mx-auto mb-[10rem]">
      <h2 className="text-3xl font-bold text-primary mb-[1rem]">
        Recent Blog Posts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-10 gap-8">
        <div className="col-span-5">
          <BlogPostVertical
            post={hasPosts ? posts[0] : null}
            loading={loading}
          />
        </div>
        <div className="col-span-5">
          <div className="grid gap-8">
            {posts.slice(1, 3).map((post) => (
              <BlogPostHorizontal
                key={post.id}
                post={post}
                imageHeight="h-[11rem]"
                loading={loading}
              />
            ))}
          </div>
        </div>
        <div className="col-span-10">
          <BlogPostHorizontal
            post={hasPosts ? posts[3] : null}
            imageHeight="h-[16rem]"
            loading={loading}
          />
        </div>
      </div>
    </main>
  );
};

export default RecentBlog;
