import { businessContact, siteConfig, siteUrl } from "./site-config";

/**
 * Schema.org LocalBusiness structured data. Feeds Google's rich results and
 * Knowledge Panel / Maps eligibility. Rendered once in the root layout.
 */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Resort", "HealthAndBeautyBusiness"],
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    description: siteConfig.description,
    url: siteUrl,
    telephone: businessContact.primaryPhone,
    email: businessContact.email,
    image: new URL("/images/og-hideaway-experience.jpg", siteUrl).toString(),
    priceRange: "KSh",
    address: {
      "@type": "PostalAddress",
      streetAddress: businessContact.location.address,
      addressLocality: businessContact.location.city,
      addressRegion: businessContact.location.region,
      postalCode: businessContact.location.postalCode,
      addressCountry: businessContact.location.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: businessContact.location.latitude,
      longitude: businessContact.location.longitude,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: businessContact.openingHours.map(({ day }) => day),
      opens: businessContact.spaHours.opens,
      closes: businessContact.spaHours.closes,
    },
    sameAs: businessContact.socialLinks.map((social) => social.href),
  };
}
