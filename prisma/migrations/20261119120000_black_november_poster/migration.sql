-- "Times per day" 0 now means "every visit": the pop-up shows once per browser
-- session (sessionStorage) instead of a daily count. See lib/poster-frequency.ts.
ALTER TABLE "Poster" DROP CONSTRAINT "Poster_timesPerDay_range";
ALTER TABLE "Poster" ADD CONSTRAINT "Poster_timesPerDay_range" CHECK ("timesPerDay" BETWEEN 0 AND 10);

-- Black November: up to 20% off, from now until Monday 30 November 2026,
-- 23:59 Nairobi time (20:59 UTC), shown on every visit.
INSERT INTO "Poster" (
    "id", "title", "imageUrl", "linkUrl", "ctaLabel", "kind", "summary", "details", "highlights", "priceText",
    "location", "terms", "startsAt", "endsAt", "delaySeconds", "autoCloseSeconds", "timesPerDay", "priority", "updatedAt"
)
VALUES (
    'black-november-2026',
    'Black November: up to 20% off',
    '/posters/black-november-2026.webp',
    '/booking',
    'Book now',
    'offer',
    'Black November at The Hideaway Spa and Resort: up to 20% off all month.',
    'Relax, rejuvenate and indulge for less this November. Our team will confirm which offer applies when you book.',
    ARRAY['Spa treatments', 'Luxury rooms', 'Fine dining', 'Wellness facilities'],
    'Up to 20% off',
    'Kileleshwa, Nairobi',
    'Offer runs until Monday 30 November 2026, 11:59 pm. Discounts vary by service, up to 20%.',
    CURRENT_TIMESTAMP AT TIME ZONE 'UTC',
    TIMESTAMP '2026-11-30 20:59:59.999',
    5,
    10,
    0,
    50,
    CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
)
ON CONFLICT ("id") DO NOTHING;
