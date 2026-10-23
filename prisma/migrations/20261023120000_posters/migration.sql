-- Promotional poster pop-ups, managed at /admin/posters.
CREATE TABLE "Poster" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imageData" BYTEA,
    "imageType" TEXT,
    "linkUrl" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "delaySeconds" INTEGER NOT NULL DEFAULT 10,
    "autoCloseSeconds" INTEGER NOT NULL DEFAULT 6,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Poster_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Poster_active_endsAt_idx" ON "Poster"("active", "endsAt");

-- This weekend's poster, "Spa & Resort Special Offers": live from now until
-- Sunday 25 October 2026 at midnight Nairobi time (TIMESTAMP(3) columns hold UTC).
INSERT INTO "Poster" ("id", "title", "imageUrl", "linkUrl", "startsAt", "endsAt", "delaySeconds", "autoCloseSeconds", "priority", "updatedAt")
VALUES (
    'weekend-special-offers-2026-10-24',
    'Spa & Resort Special Offers',
    '/posters/weekend-special-offers-oct-24.webp',
    '/services',
    CURRENT_TIMESTAMP AT TIME ZONE 'UTC',
    TIMESTAMP '2026-10-25 20:59:59.999',
    10,
    6,
    10,
    CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
);
