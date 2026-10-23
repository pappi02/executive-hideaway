-- The full story behind each poster. Clicking a poster pop-up now opens its
-- own section at the top of /services (#offer-<id>) with these details, and
-- linkUrl becomes that section's booking button.
ALTER TABLE "Poster" ADD COLUMN "ctaLabel" TEXT;
ALTER TABLE "Poster" ADD COLUMN "kind" TEXT NOT NULL DEFAULT 'offer';
ALTER TABLE "Poster" ADD COLUMN "summary" TEXT;
ALTER TABLE "Poster" ADD COLUMN "details" TEXT;
ALTER TABLE "Poster" ADD COLUMN "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Poster" ADD COLUMN "priceText" TEXT;
ALTER TABLE "Poster" ADD COLUMN "location" TEXT;
ALTER TABLE "Poster" ADD COLUMN "terms" TEXT;

-- This weekend's poster, filled in from the poster's own text.
UPDATE "Poster" SET
  "summary" = 'All spa services available with exclusive discounts, plus delicious food and refreshing drinks at special discounted rates.',
  "highlights" = ARRAY[
    'Massage therapy',
    'Facial treatments',
    'Body treatments',
    'Sauna & steam',
    'Nail care & more',
    'Food & drinks at special discounted rates'
  ],
  "details" = E'Relax, rejuvenate and reconnect this weekend: great food, premium drinks and an unforgettable stay.\n\nCall +254 719 506 995 or +254 111 500 150 for reservations and enquiries.',
  "location" = 'Kileleshwa, Nairobi',
  "linkUrl" = '/booking',
  "ctaLabel" = 'Book now',
  "terms" = 'Offer runs until Sunday 25 October at midnight.',
  "updatedAt" = CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
WHERE "id" = 'weekend-special-offers-2026-10-24';
