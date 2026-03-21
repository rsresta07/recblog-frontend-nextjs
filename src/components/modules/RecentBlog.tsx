import Image from "next/image";
import Link from "next/link";
import sanitizeHtml from "sanitize-html";

/** Skeleton Loader for placeholder UI */
const Skeleton = ({ className }: { className: string }) => (
  <div className={`bg-muted animate-pulse rounded-2xl ${className}`} />
);

/** Blog Post (Vertical Layout) */
const BlogPostVertical = ({ post, loading }: any) => {
  if (loading || !post)
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-[13rem] w-full" />
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
    <div className="flex flex-col gap-4 p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <Link href={`/blog/${post?.slug}`}>
        <Image
          src={post?.image}
          alt={post?.title || "Blog Post Image"}
          width={1024}
          height={1024}
          className="h-[15rem] w-full object-cover rounded-xl"
        />
      </Link>
      <div>
        <span className="text-primary font-medium text-sm mb-2 block">
          {post?.user && (
            <Link href={`/user/${post?.user?.slug}`}>
              {post?.user?.fullName}
            </Link>
          )}
        </span>
        <Link href={`/blog/${post?.slug}`}>
          <h3 className="line-clamp-2 text-foreground hover:text-primary transition-colors">
            {post?.title}
          </h3>
          <div
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
            className="mb-4 text-muted-foreground text-sm [&_*]:text-sm [&_*]:m-0 line-clamp-3"
          />
        </Link>
        <div className="flex flex-wrap gap-2 mt-2">
          {post?.tags?.map((tag: any) => (
            <span
              key={tag?.id}
              className="text-xs px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary"
            >
                <Link href={`#`}>{tag?.title}</Link>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

/** Blog Post (Horizontal Layout) */
const BlogPostHorizontal = ({ post, imageHeight, loading }: any) => {
  if (loading || !post)
    return (
      <div className="grid grid-cols-2 gap-6 p-4 rounded-2xl bg-card/50 border border-border/50">
        <Skeleton className={`${imageHeight} w-full`} />
        <div className="flex flex-col justify-center">
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-6 w-2/3 mb-4" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <Link href={`/blog/${post?.slug}`}>
        <Image
          src={post?.image}
          alt={post?.title || "Blog Post Image"}
          width={1024}
          height={1024}
          className={`${imageHeight} w-full object-cover rounded-xl`}
        />
      </Link>
      <div className="flex flex-col justify-center">
        <span className="text-primary font-medium text-sm mb-2 block">
          {post?.user && (
            <Link href={`/user/${post?.user?.slug}`}>
              {post?.user?.fullName}
            </Link>
          )}
        </span>
        <Link href={`/blog/${post?.slug}`}>
          <h3 className="line-clamp-2 text-foreground hover:text-primary transition-colors">
            {post?.title}
          </h3>
          <div
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
            className="mb-4 text-muted-foreground text-sm [&_*]:text-sm [&_*]:m-0 line-clamp-3"
          />
        </Link>
        <div className="flex flex-wrap gap-2 mt-auto">
          {post?.tags?.map((tag: any) => (
            <span
              key={tag?.id}
              className="text-xs px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary"
            >
                <Link href="#">{tag?.title}</Link>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const RecentBlog = ({ posts, loading }: { posts: any[]; loading: boolean }) => {
  const hasPosts = posts.length > 0;

  return (
    <main className="container mx-auto mb-[10rem]">
      <h2 className="text-primary">
        Recent Blog Posts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
        <div className="col-span-1 md:col-span-5">
          <BlogPostVertical
            post={hasPosts ? posts[0] : null}
            loading={loading}
          />
        </div>
        <div className="col-span-1 md:col-span-5">
          <div className="grid gap-6">
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
        <div className="col-span-1 md:col-span-10">
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