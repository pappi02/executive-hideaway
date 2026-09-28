import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { venue } from "./data/venue";

/**
 * The typefaces are committed to src/app/menu/fonts/ and served from our own
 * origin. Cinzel carries the engraved capitals, Cormorant Garamond the dish
 * names and prose, Inter the prices and interface.
 */
const cinzel = localFont({
  src: [
    { path: "./fonts/Cinzel-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Cinzel-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-cinzel",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const cormorant = localFont({
  src: [
    { path: "./fonts/CormorantGaramond-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/CormorantGaramond-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/CormorantGaramond-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const inter = localFont({
  src: [
    { path: "./fonts/Inter-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/Inter-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Inter-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const title = `${venue.name} ${venue.descriptor} — Menu`;
const description = `Dining, bar, spa and barber menu for ${venue.name} ${venue.descriptor}, ${venue.city}.`;

export const metadata: Metadata = {
  title,
  description,
  applicationName: `${venue.name} Menu`,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_KE",
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Pinch-zoom stays available: locking it out fails WCAG 1.4.4, and a guest
  // who wants a closer look at a price is exactly who this menu is for.
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${cinzel.variable} ${cormorant.variable} ${inter.variable}`}>
      {/* The cover is the first thing anyone sees after scanning the QR code,
          and it is a CSS background, so the browser cannot discover it until
          the stylesheet has parsed. Preloading it removes that round trip. */}
      <link rel="preload" as="image" href="/images/menu/cover.jpg" />
      {children}
    </div>
  );
}
