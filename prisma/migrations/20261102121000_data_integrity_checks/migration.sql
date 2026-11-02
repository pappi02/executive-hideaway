-- Rules the admin forms already enforce, now held by the database as well.
-- NOT VALID applies them to new and changed rows without failing this migration
-- over an older row; run VALIDATE CONSTRAINT once the data has been checked.
ALTER TABLE "Service" ADD CONSTRAINT "Service_price_check" CHECK ("price" IS NULL OR "price" >= 0) NOT VALID;
ALTER TABLE "Service" ADD CONSTRAINT "Service_duration_check" CHECK ("duration" > 0) NOT VALID;
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_price_check" CHECK ("price" IS NULL OR "price" >= 0) NOT VALID;
ALTER TABLE "Accommodation" ADD CONSTRAINT "Accommodation_price_check" CHECK ("pricePerNight" IS NULL OR "pricePerNight" >= 0) NOT VALID;
ALTER TABLE "Accommodation" ADD CONSTRAINT "Accommodation_capacity_check" CHECK ("numberOfRooms" >= 0 AND "maxGuests" >= 1) NOT VALID;
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_columns_check" CHECK ("columns" IN (1, 2)) NOT VALID;
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_stock_check" CHECK ("stock" IN ('onyx', 'bone')) NOT VALID;
ALTER TABLE "Poster" ADD CONSTRAINT "Poster_dates_check" CHECK ("endsAt" > "startsAt") NOT VALID;
ALTER TABLE "Poster" ADD CONSTRAINT "Poster_kind_check" CHECK ("kind" IN ('offer', 'event', 'announcement')) NOT VALID;

-- Draft wording that reached the guest menu when the bar chapter was published.
UPDATE "Section" SET "note" = NULL WHERE "id" = 'signature-cocktails' AND "note" = 'Proposed, recipes to be confirmed';
