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
  name: "Executive Hideaway Barber and Spa",
  shortName: "Executive Hideaway",
  tagline: "Barber · Spa · Wellness",
  description:
    "Executive Hideaway Barber and Spa in Nairobi — premium grooming, massage, spa treatments, and wellness experiences. Book your appointment today.",
  url: siteUrl,
  locale: "en_KE",
  themeColor: "#0b0b0a",
} as const;

export const businessContact = {
  primaryPhone: "+254 759 944 566",
  primaryPhoneHref: "tel:+254759944566",
  whatsappNumber: "254759944566",
  whatsappUrl: "https://wa.me/254759944566",
  secondaryPhones: [
    { label: "+254 111 500 150", href: "tel:+254111500150" },
    { label: "+254 719 506 995", href: "tel:+254719506995" },
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
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=275+Nyeri+Cl%2C+Nairobi%2C+Kenya",
    embedUrl:
      "https://www.google.com/maps?q=275+Nyeri+Cl,+Nairobi,+Kenya&output=embed",
    // Approximate coordinates for Kileleshwa, Nairobi — used for JSON-LD geo.
    // Replace with the exact venue coordinates once confirmed.
    latitude: -1.2769,
    longitude: 36.7793,
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
