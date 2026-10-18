-- Publish Bar & Drinks and The Shisha Experience on the guest menu, on the
-- owner's go-ahead (2026-10-18). Prices and brands remain provisional.
UPDATE "Chapter" SET "published" = true WHERE "id" IN ('bar-drinks', 'shisha');
