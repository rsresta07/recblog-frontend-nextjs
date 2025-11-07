import RecentBlog from "@/components/modules/RecentBlog";
import PostPagination from "./BlogPostPagination";
import RecommendedBlog from "./RecommendedBlog";
import Head from "next/head";
import { useAuth } from "@/utils/hooks/useAuth";

export default function HeroSection() {
  const { user } = useAuth();

  return (
    <main className="flex flex-col w-full bg-background text-foreground pt-4">
      <Head>
        <title>RecBlog</title>
        <meta name="description" content="Homepage of RecBlog" />
        <meta property="og:title" content="RecBlog" />
        <meta property="og:image" content="/favicon.ico" />
      </Head>

      <section className="flex-grow pt-8 container mx-auto">
        {!user && (
          <div className="flex flex-col gap-4 mb-16 md:mt-[5rem] md:mb-[10rem]">
            <h1 className="text-center text-4xl md:text-5xl font-bold text-primary">
              Welcome to RecBlog
            </h1>
            <h2 className="text-center text-lg md:text-2xl text-foreground">
              A platform where you can read and write about your favorite
              topics.
            </h2>
          </div>
        )}

        <div className="mb-16">
          <RecentBlog />
        </div>

        {user && (
          <div className="mb-16">
            <RecommendedBlog />
          </div>
        )}

        <div className="mb-40">
          <PostPagination />
        </div>
      </section>
    </main>
  );
}
