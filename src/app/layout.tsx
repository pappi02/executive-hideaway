import type { Metadata } from "next";
import ScrollToTop from "@/components/layout/ScrollToTop";
import "./globals.css";

export const metadata: Metadata = {
  title: "Executive Hideaway Barber and Spa",
  description:
    "Executive Hideaway Barber and Spa — premium grooming, relaxation and wellness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
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
      </head>
      <body>
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}