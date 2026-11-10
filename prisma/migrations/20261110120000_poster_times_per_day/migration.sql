-- How many times a day a poster may pop up on one device. Existing posters keep
-- showing once a day. Safe to apply before the code that reads it is deployed.
ALTER TABLE "Poster" ADD COLUMN "timesPerDay" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Poster" ADD CONSTRAINT "Poster_timesPerDay_range" CHECK ("timesPerDay" BETWEEN 1 AND 10);
