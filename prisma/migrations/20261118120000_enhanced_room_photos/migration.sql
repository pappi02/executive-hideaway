-- Point the seeded room photos at the enhanced (upscaled, colour-corrected) versions of
-- the same real photographs. New file names, because optimised images are cached for 31
-- days. Only the four seeded rows are touched; admin uploads keep their own URLs.
UPDATE "AccommodationImage" SET "url" = '/images/accommodation/premium-room-photo-enhanced.webp'
WHERE "url" = '/images/accommodation/premium-room-photo.webp';
UPDATE "AccommodationImage" SET "url" = '/images/accommodation/deluxe-room-photo-enhanced.webp'
WHERE "url" = '/images/accommodation/deluxe-room-photo.webp';
UPDATE "AccommodationImage" SET "url" = '/images/accommodation/executive-room-photo-1-enhanced.webp',
  "altText" = 'Rose-petal bed with a tall tufted headboard under purple-lit greenery, with grey armchairs and a massage table'
WHERE "url" = '/images/accommodation/executive-room-photo-1.webp';
UPDATE "AccommodationImage" SET "url" = '/images/accommodation/executive-room-photo-2-enhanced.webp'
WHERE "url" = '/images/accommodation/executive-room-photo-2.webp';
