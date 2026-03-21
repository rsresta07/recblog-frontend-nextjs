import "@/styles/globals.css";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/notifications/styles.css";

import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { theme } from "@/utils/theme";
import Head from "next/head";
import { useEffect } from "react";

// --- ADD THESE IMPORTS ---
import { Antic, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

// --- CONFIGURE FONTS HERE ---
const fontSans = Antic({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const fontSerif = localFont({
  src: "../../public/fonts/Signifier-Regular.woff2",
  variable: "--font-serif",
});

type CustomAppProps = AppProps & {
  Component: {
    getLayout?: (page: React.ReactElement) => React.ReactElement;
  };
};

/**
 * The top-level component for the entire app.
 *
 * This component renders the following:
 * 1. The MantineProvider, which provides the Mantine theme to the entire app.
 * 2. The Notifications component, which displays notifications to the user.
 * 3. The page component, which is either a default page or a custom page depending
 *    on whether the page component has a getLayout method.
 *
 * The getLayout method is a method on the page component that takes the page as an
 * argument and returns a custom layout for the page. If the page component does not
 * have a getLayout method, the default layout is used.
 */
export default function App({ Component, pageProps }: CustomAppProps) {
  const getLayout = Component.getLayout ?? ((page: React.ReactElement) => page);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    // Wrap everything in a div that passes the font variables down the tree
    <main className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} font-sans antialiased`}>
      <Head>
        <link rel="icon" href="/globe.svg" />
      </Head>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <Notifications />
        {getLayout(<Component {...pageProps} />)}
      </MantineProvider>
    </main>
  );
}