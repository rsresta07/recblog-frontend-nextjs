import HeroLayout from "@/layouts/HeroLayout";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

const Custom404 = () => {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | RecBlog</title>
      </Head>

      <main className="container mx-auto px-4 md:px-8 py-12 md:py-24 flex justify-center items-center min-h-[75vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center w-full max-w-6xl">

          {/* Text Section */}
          <div className="order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-left bg-card/40 backdrop-blur-xl border border-border/50 p-8 md:p-12 rounded-3xl shadow-sm">
            <span className="text-6xl md:text-8xl font-extrabold text-primary mb-2 drop-shadow-sm">
              404
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Something is not right...
            </h1>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8 max-w-md">
              The page you are trying to open does not exist. You may have mistyped
              the address, or the page has been moved to another URL. If you think
              this is an error, please contact support.
            </p>

            <Link
              href="/"
              className="inline-flex justify-center items-center font-semibold py-3 px-8 rounded-full bg-primary/90 text-primary-foreground backdrop-blur-md shadow-sm hover:bg-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              Take me back home
            </Link>
          </div>

          {/* Illustration Section */}
          <div className="order-1 md:order-2 flex justify-center items-center w-full">
            <div className="relative w-full max-w-[300px] md:max-w-[450px] aspect-square">
              <Image
                src="/page-not-found.svg"
                alt="404 Page Not Found Illustration"
                fill
                priority
                className="object-contain hover:scale-105 transition-transform duration-700 drop-shadow-sm"
              />
            </div>
          </div>

        </div>
      </main>
    </>
  );
};

export default Custom404;

Custom404.getLayout = (p: any) => <HeroLayout>{p}</HeroLayout>;