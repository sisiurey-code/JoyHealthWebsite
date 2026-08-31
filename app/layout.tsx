import type { Metadata } from "next";
import "./globals.css";
import { PUBLICATIONS } from "./lib/publications";
import { SITE_URL } from "./lib/seo";

const siteUrl = SITE_URL;
const homeTitle = PUBLICATIONS.home.title;
const description = PUBLICATIONS.home.description;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Joy Health",
  title: {
    default: homeTitle,
    template: "%s | Joy Health",
  },
  description,
  authors: [{ name: "Joy Health", url: siteUrl }],
  creator: "Joy Health",
  publisher: "Joy Health",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Joy Health",
    title: homeTitle,
    description,
    images: [
      {
        url: "/og.png",
        width: 1731,
        height: 909,
        alt: "Joy Health, healthy living made clearer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/fraunces-variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/dm-sans-variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
