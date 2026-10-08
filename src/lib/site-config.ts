/**
 * Single source of truth for site-wide identity: name, description, contact
 * details, and social links. Consumed by layout metadata, JSON-LD, the
 * Footer, and the Contact page so these facts never drift out of sync.
 *
 * Set NEXT_PUBLIC_SITE_URL in the deployment environment to the real
 * production domain once one is registered — it feeds metadataBase,
 * canonical URLs, sitemap.xml, and robots.txt.
 */

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://executivehideaway.co.ke";

export const siteConfig = {
  name: "Executive Hideaway Resort & Spa",
  shortName: "Executive Hideaway",
  tagline: "Resort · Spa · Wellness",
  description:
    "Executive Hideaway Resort & Spa in Nairobi — accommodation, dining, grooming, spa, and wellness experiences. Contact our team to plan your stay.",
  url: siteUrl,
  locale: "en_KE",
  themeColor: "#0b0b0a",
} as const;

export const businessContact = {
  primaryPhone: "+254 719 506 995",
  primaryPhoneHref: "tel:+254719506995",
  whatsappNumber: "254759944566",
  whatsappUrl: "https://wa.me/254759944566",
  secondaryPhones: [
    { label: "+254 111 500 150", href: "tel:+254111500150" },
    { label: "+254 759 944 566", href: "tel:+254759944566" },
  ],
  email: "executivehideawaybarberandspa@gmail.com",
  emailHref: "mailto:executivehideawaybarberandspa@gmail.com",
  location: {
    address: "275 Nyeri close, kileleshwa estate, Moi, Nairobi Area, 00100",
    city: "Nairobi",
    region: "Nairobi County",
    country: "KE",
    postalCode: "00100",
    placeLabel: "PQ9H+2M Nairobi",
    // The venue's own Google Maps listing (place 0x182f1b003f17d659:0xcd16e03dedfdc84d).
    googleMapsUrl: "https://maps.app.goo.gl/5pxCeKhh6aQ1fR1R6",
    embedUrl:
      "https://www.google.com/maps?q=-1.2824949,36.7792489&z=17&output=embed",
    // Exact pin of the Google Maps listing — used for the embed and JSON-LD geo.
    latitude: -1.2824949,
    longitude: 36.7792489,
  },
  socialLinks: [
    {
      platform: "Instagram",
      href: "https://www.instagram.com/executivehideawayspa?igsh=MW5lMW5uN3g2eHdmYg==",
      ariaLabel: "Follow us on Instagram",
    },
    {
      platform: "TikTok",
      href: "https://vm.tiktok.com/ZS9BygQc6QDqW-CcJUt/",
      ariaLabel: "Follow us on TikTok",
    },
  ],
  // Every day currently reads "Hours to be confirmed" — this is the single
  // source of truth. Update here once real opening hours are confirmed;
  // every page that displays hours reads from this array, so it can never
  // contradict itself again.
  openingHours: [
    { day: "Monday", time: "Hours to be confirmed" },
    { day: "Tuesday", time: "Hours to be confirmed" },
    { day: "Wednesday", time: "Hours to be confirmed" },
    { day: "Thursday", time: "Hours to be confirmed" },
    { day: "Friday", time: "Hours to be confirmed" },
    { day: "Saturday", time: "Hours to be confirmed" },
    { day: "Sunday", time: "Hours to be confirmed" },
  ],
};

/**
 * Collapses consecutive days that share identical hours into a single
 * "Monday – Sunday" style range, so the UI never has to hardcode a summary
 * that can drift out of sync with the day-by-day source above.
 */
function summarizeOpeningHours(
  hours: typeof businessContact.openingHours,
): { label: string; time: string }[] {
  const summary: { firstDay: string; lastDay: string; time: string }[] = [];

  for (const { day, time } of hours) {
    const last = summary[summary.length - 1];

    if (last && last.time === time) {
      last.lastDay = day;
    } else {
      summary.push({ firstDay: day, lastDay: day, time });
    }
  }

  return summary.map(({ firstDay, lastDay, time }) => ({
    label: firstDay === lastDay ? firstDay : `${firstDay} – ${lastDay}`,
    time,
  }));
}

export const openingHoursSummary = summarizeOpeningHours(
  businessContact.openingHours,
);
