-- Real details for the three rooms, written from photographs of each room. A room whose
-- placeholder description has already been replaced in the admin keeps its details.
UPDATE "Accommodation"
SET "description" = 'An intimate room in two parts: a treatment area with a massage table beside the windows and, through an arched opening, a double bed on a rustic wooden frame with bright yellow cushions.',
    "bedType" = 'Double bed',
    "amenities" = ARRAY['Wi-Fi', 'In-room massage table', 'Bathrobe', 'Slippers', 'Separate sleeping alcove', 'Original artwork'],
    "breakfastIncluded" = NULL,
    "featured" = false,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'premium-room'
  AND "description" LIKE 'A temporary room listing%';

UPDATE "Accommodation"
SET "description" = 'A bright, generous room with a queen bed, a tufted navy headboard and a wall of softly lit trailing greenery. A white wingback chair and a magenta sofa give you somewhere to unwind, with a massage table set up in the room.',
    "bedType" = 'Queen bed',
    "amenities" = ARRAY['Wi-Fi', 'In-room massage table', 'Bathrobe', 'Slippers', 'Sofa and wingback chair', 'Coat stand', 'Storage shelves'],
    "breakfastIncluded" = NULL,
    "featured" = false,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'deluxe-room'
  AND "description" LIKE 'A temporary room listing%';

UPDATE "Accommodation"
SET "description" = 'Our largest room, with a king bed against a tall tufted headboard and soft purple light through hanging greenery. Two armchairs and a coffee table make a sitting area by the windows, and a massage table is set up in the room.',
    "bedType" = 'King bed',
    "amenities" = ARRAY['Wi-Fi', 'In-room massage table', 'Slippers', 'Two armchairs and coffee table', 'Built-in wardrobes', 'Bedside tables', 'Coat stand', 'Ambient lighting'],
    "breakfastIncluded" = NULL,
    "featured" = true,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "slug" = 'executive-room'
  AND "description" LIKE 'A temporary room listing%';

-- Rooms and rates are no longer labelled as examples anywhere on the site.
ALTER TABLE "Accommodation" DROP COLUMN "priceIsIndicative";
ALTER TABLE "Accommodation" DROP COLUMN "isTemporary";
