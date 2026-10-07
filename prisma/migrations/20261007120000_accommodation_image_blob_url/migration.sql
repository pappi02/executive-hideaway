-- Room images move to Vercel Blob: keep the URL, make the legacy bytes optional.
ALTER TABLE "AccommodationImage" ADD COLUMN "url" TEXT;
ALTER TABLE "AccommodationImage" ALTER COLUMN "data" DROP NOT NULL;
