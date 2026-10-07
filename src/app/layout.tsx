import type { Metadata, Viewport } from "next";
import { BookingProvider } from "@/components/booking/BookingProvider";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { buildMetadata } from "@/lib/seo";
import { localBusinessJsonLd } from "@/lib/json-ld";
import { siteConfig, siteUrl } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  ...buildMetadata({
    description: siteConfig.description,
    path: "/",
  }),
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  keywords: [
    "barber Nairobi",
    "spa Nairobi",
    "Kileleshwa barbershop",
    "massage Nairobi",
    "men's grooming Kenya",
    "wellness spa Nairobi",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/*
          Runs synchronously before hydration so the browser's own
          back/forward scroll restoration never flashes before this resets
          it — ScrollToTop.tsx (a useEffect) runs too late to prevent that
          flash by itself, so the two are complementary, not redundant.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ("scrollRestoration" in history) history.scrollRestoration = "manual";
              const resetScroll = () => {
                if (!location.hash) {
                  document.documentElement.style.scrollBehavior = "auto";
                  window.scrollTo(0, 0);
                  document.documentElement.style.scrollBehavior = "";
                }
              };
              resetScroll();
              requestAnimationFrame(resetScroll);
              window.addEventListener("load", resetScroll, { once: true });
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd()),
          }}
        />
      </head>
      <body>
        <BookingProvider>
          <ScrollToTop />
          {children}
        </BookingProvider>
      </body>
    </html>
  );
}