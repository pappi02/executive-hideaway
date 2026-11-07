import type { Metadata } from "next";
import { siteConfig, siteUrl } from "./site-config";

type BuildMetadataOptions = {
  /** Page-specific title. Rendered as "{title} | Executive Hideaway". Omit for the homepage. */
  title?: string;
  description: string;
  /** Route path starting with "/", e.g. "/services". */
  path: string;
  /** Absolute or root-relative path to a page-specific OG image. Defaults to the branded spa share card. */
  image?: string;
};

/**
 * Builds a consistent Metadata object (title, description, canonical,
 * Open Graph, Twitter card) for a route. Centralizing this means every page
 * automatically gets correctly-resolved absolute URLs and social preview
 * data without repeating boilerplate — see app/layout.tsx, app/services,
 * app/contact, and app/booking for usage.
 */
export function buildMetadata({
  title,
  description,
  path,
  image = "/images/og-share.jpg",
}: BuildMetadataOptions): Metadata {
  const resolvedTitle = title
    ? `${title} | ${siteConfig.shortName}`
    : siteConfig.name;

  const url = new URL(path, siteUrl).toString();
  const imageUrl = new URL(image, siteUrl).toString();

  return {
    title: { absolute: resolvedTitle },
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: resolvedTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [imageUrl],
    },
  };
}
