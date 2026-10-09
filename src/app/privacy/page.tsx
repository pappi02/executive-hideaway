import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/legal/LegalPage";
import { buildMetadata } from "@/lib/seo";
import { businessContact, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Notice",
  description: `How ${siteConfig.name} collects, uses and protects the personal data you share when you make a booking request or contact us.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  const { email, emailHref, primaryPhone, primaryPhoneHref, location } = businessContact;

  return (
    <LegalPage
      eyebrow="Your data"
      title="Privacy Notice"
      updated="2026-10-09"
      intro={
        <p>
          This notice explains what personal data {siteConfig.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects through this
          website, why we collect it, and the rights you have under Kenya&apos;s Data Protection Act, 2019.
        </p>
      }
    >
      <section>
        <h2>Who is responsible for your data</h2>
        <p>
          {siteConfig.name}, {location.address}, is the data controller for the personal data described here. Questions or
          requests about your data can be sent to <a href={emailHref}>{email}</a> or by phone on{" "}
          <a href={primaryPhoneHref}>{primaryPhone}</a>.
        </p>
      </section>

      <section>
        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Appointment requests</strong> (spa, barber and wellness): your name, phone number, preferred date and
            time, the services you choose, and any notes you add.
          </li>
          <li>
            <strong>Accommodation requests:</strong> your name, phone number, the room, check-in and check-out dates, number
            of guests, and any special request.
          </li>
          <li>
            <strong>Messages you send us</strong> by WhatsApp, phone or email.
          </li>
        </ul>
        <p className="mt-3">
          Please don&apos;t include health details in the notes unless they matter for your treatment (for example, a
          pregnancy or an allergy). If you do, we use them only to keep your treatment safe.
        </p>
      </section>

      <section>
        <h2>How the website handles it</h2>
        <p>
          The booking forms on this website don&apos;t store your details on our servers. When you press send, the website
          prepares a WhatsApp message containing your request and opens WhatsApp so that you can review it and send it to
          us yourself. Until you send that message, we receive nothing.
        </p>
        <p className="mt-3">
          While you choose services, your selection is kept in your own browser for that session only (session storage) so
          that it survives a page refresh. It is cleared when you close the tab. This website doesn&apos;t use advertising
          or analytics cookies.
        </p>
      </section>

      <section>
        <h2>Why we use it</h2>
        <ul>
          <li>To respond to your request, confirm availability, and arrange your appointment or stay.</li>
          <li>To contact you about your booking, including changes and reminders.</li>
          <li>To keep the records we need to run the business and meet our legal and tax obligations.</li>
        </ul>
        <p className="mt-3">
          We use your details because you asked us to arrange a booking, and because we have a legitimate interest in
          running our bookings. We don&apos;t sell your data or use it for marketing without your consent.
        </p>
      </section>

      <section>
        <h2>Who else processes it</h2>
        <p>
          Booking messages travel through WhatsApp, a service of Meta Platforms, which may process data outside Kenya under
          its own privacy policy. Our website is hosted by Vercel. We don&apos;t share your details with anyone else except
          where the law requires it.
        </p>
      </section>

      <section>
        <h2>How long we keep it</h2>
        <p>
          We keep booking conversations for as long as we need them to manage your booking and any follow-up, and then delete
          them, unless we must keep a record for legal, tax or accounting reasons.
        </p>
      </section>

      <section>
        <h2>Your rights</h2>
        <p>Under the Data Protection Act, 2019 you have the right to:</p>
        <ul>
          <li>be told how your personal data is used (this notice);</li>
          <li>access the personal data we hold about you;</li>
          <li>ask us to correct data that is wrong or delete data we no longer need;</li>
          <li>object to processing, including any direct marketing.</li>
        </ul>
        <p className="mt-3">
          Contact us at <a href={emailHref}>{email}</a> to use these rights. If you&apos;re unhappy with our response, you can
          complain to the{" "}
          <a href="https://www.odpc.go.ke" target="_blank" rel="noopener noreferrer">
            Office of the Data Protection Commissioner
          </a>
          .
        </p>
      </section>

      <section>
        <h2>Related</h2>
        <p>
          See our <Link href="/terms">booking terms</Link> for how requests, confirmations and cancellations work.
        </p>
      </section>
    </LegalPage>
  );
}
