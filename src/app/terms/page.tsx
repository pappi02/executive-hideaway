import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/legal/LegalPage";
import { buildMetadata } from "@/lib/seo";
import { businessContact, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Booking Terms",
  description: `How booking requests, confirmations, prices and cancellations work at ${siteConfig.name}.`,
  path: "/terms",
});

export default function TermsPage() {
  const { email, emailHref, primaryPhone, primaryPhoneHref, whatsappUrl } = businessContact;

  return (
    <LegalPage
      eyebrow="Before you book"
      title="Booking Terms"
      updated="2026-10-09"
      intro={
        <p>
          These terms explain how booking requests made through this website work at {siteConfig.name}. Please read them
          before you send a request.
        </p>
      }
    >
      <section>
        <h2>A request is not yet a booking</h2>
        <p>
          The appointment and accommodation forms send us a request by WhatsApp. Nothing is reserved until a member of our
          team confirms the date, time or room with you directly. Until then, availability isn&apos;t guaranteed.
        </p>
      </section>

      <section>
        <h2>Prices</h2>
        <ul>
          <li>Prices are in Kenya Shillings (KSh).</li>
          <li>
            Room rates are shown per night. The rate that applies is the one we confirm with you before your stay.
          </li>
          <li>
            Services shown as &ldquo;price on request&rdquo; are quoted when we confirm your appointment. Totals shown in the
            booking form are estimates.
          </li>
        </ul>
      </section>

      <section>
        <h2>Deposits and payment</h2>
        <p>
          The website doesn&apos;t take payments. If a booking needs a deposit, we&apos;ll tell you the amount, how to pay,
          and whether it can be refunded before you pay anything.
        </p>
      </section>

      <section>
        <h2>Changes and cancellations</h2>
        <ul>
          <li>
            <strong>Spa, barber and wellness appointments:</strong> please give at least 24 hours&apos; notice if you need to
            cancel or move your appointment.
          </li>
          <li>
            <strong>Accommodation:</strong> cancellation terms depend on the room and dates, and are confirmed with you when
            we confirm your stay.
          </li>
        </ul>
        <p className="mt-3">
          To change or cancel, contact us on{" "}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          , by phone on <a href={primaryPhoneHref}>{primaryPhone}</a>, or at <a href={emailHref}>{email}</a>.
        </p>
      </section>

      <section>
        <h2>Questions and complaints</h2>
        <p>
          If something isn&apos;t right, tell us using any of the contact details above and we&apos;ll do our best to put it
          right.
        </p>
      </section>

      <section>
        <h2>Your data</h2>
        <p>
          Our <Link href="/privacy">privacy notice</Link> explains how we use the details you send with a request.
        </p>
      </section>
    </LegalPage>
  );
}
