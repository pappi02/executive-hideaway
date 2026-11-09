-- Replace the seeded placeholder room images with photographs of the real rooms.
-- The files ship under /public/images/accommodation. Only rows still carrying the
-- placeholder description are removed, so a photo uploaded through the admin stays.
DELETE FROM "AccommodationImage"
WHERE "url" IS NULL
  AND "altText" LIKE 'Temporary illustrative room preview%';

INSERT INTO "AccommodationImage" ("id", "accommodationId", "url", "contentType", "altText", "order")
SELECT photo."id", room."id", photo."url", 'image/webp', photo."altText", photo."order"
FROM (
    VALUES
        ('room-photo-premium-1', 'premium-room', '/images/accommodation/premium-room-photo.webp', 'Massage table by curtained windows with, through an arched opening, a rose-petal bed with yellow cushions', 0),
        ('room-photo-deluxe-1', 'deluxe-room', '/images/accommodation/deluxe-room-photo.webp', 'Massage table and rose-petal bed with a navy headboard, a white wingback chair and a magenta sofa under lit greenery', 0),
        ('room-photo-executive-1', 'executive-room', '/images/accommodation/executive-room-photo-1.webp', 'Rose-petal bed with a tall tufted headboard under purple-lit greenery, with grey armchairs and a massage table', 0),
        ('room-photo-executive-2', 'executive-room', '/images/accommodation/executive-room-photo-2.webp', 'The same room from the window end, with a massage table, the bed, and armchairs around a glass coffee table', 1)
) AS photo("id", "slug", "url", "altText", "order")
JOIN "Accommodation" room ON room."slug" = photo."slug";
