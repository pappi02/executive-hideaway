-- AlterTable: chapters can be held back from the public menu as drafts.
-- Every existing chapter stays published.
ALTER TABLE "Chapter" ADD COLUMN "published" BOOLEAN NOT NULL DEFAULT true;

-- Bar & Drinks and The Shisha Experience, both as UNPUBLISHED drafts pending
-- owner approval of brands, prices and (for shisha) legal compliance. Content
-- mirrors src/app/menu/data/menu.ts. Inserts only: nothing an admin has
-- already edited is overwritten.

-- Slot the two chapters in straight after The Bar (or at the end if it has
-- been removed), shifting the chapters after it down by two.
CREATE TEMP TABLE "anchor" AS
SELECT COALESCE(
  (SELECT "order" FROM "Chapter" WHERE "id" = 'bar'),
  (SELECT MAX("order") FROM "Chapter"),
  -1
) AS "base";

UPDATE "Chapter" SET "order" = "order" + 2
WHERE "order" > (SELECT "base" FROM "anchor")
  AND "id" NOT IN ('bar-drinks', 'shisha');

INSERT INTO "Chapter" ("id", "eyebrow", "title", "standfirst", "image", "imagePosition", "note", "footnote", "columns", "stock", "order", "published")
VALUES ('bar-drinks', 'Wine & Spirits', 'Bar & Drinks', 'Spirits, cocktails and wine', '/images/menu/cover.jpg', '12% center', 'Ask for your spirit neat, over ice or with a mixer.', 'Selection and prices subject to availability. Please drink responsibly. Not served to anyone under 18.', 2, 'onyx', (SELECT "base" FROM "anchor") + 1, false)
ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Section" ("id", "chapterId", "title", "note", "order") VALUES ('beer-cider', 'bar-drinks', 'Beer & Cider', NULL, 0) ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Dish" ("id", "sectionId", "name", "description", "price", "priceNote", "order") VALUES
  ('bd-beer-1', 'beer-cider', 'Tusker Lager', NULL, 450, NULL, 0),
  ('bd-beer-2', 'beer-cider', 'White Cap Lager', NULL, 450, NULL, 1),
  ('bd-beer-3', 'beer-cider', 'Tusker Lite', NULL, 450, NULL, 2),
  ('bd-beer-4', 'beer-cider', 'Heineken', NULL, 600, NULL, 3),
  ('bd-beer-5', 'beer-cider', 'Corona Extra', NULL, 750, NULL, 4),
  ('bd-beer-6', 'beer-cider', 'Savanna Cider', NULL, 600, NULL, 5)
ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Section" ("id", "chapterId", "title", "note", "order") VALUES ('whisky-bourbon', 'bar-drinks', 'Whisky & Bourbon', 'Per 30 ml', 1) ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Dish" ("id", "sectionId", "name", "description", "price", "priceNote", "order") VALUES
  ('bd-wh-1', 'whisky-bourbon', 'Jameson', NULL, 550, NULL, 0),
  ('bd-wh-2', 'whisky-bourbon', 'Jack Daniel''s', NULL, 600, NULL, 1),
  ('bd-wh-6', 'whisky-bourbon', 'Johnnie Walker Red Label', NULL, 500, NULL, 2),
  ('bd-wh-3', 'whisky-bourbon', 'Johnnie Walker Black Label', NULL, 650, NULL, 3),
  ('bd-wh-4', 'whisky-bourbon', 'Chivas Regal 12 Year', NULL, 700, NULL, 4),
  ('bd-wh-5', 'whisky-bourbon', 'Glenfiddich 12 Year', NULL, 950, NULL, 5)
ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Section" ("id", "chapterId", "title", "note", "order") VALUES ('gin-vodka-rum', 'bar-drinks', 'Gin, Vodka & Rum', 'Per 30 ml', 2) ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Dish" ("id", "sectionId", "name", "description", "price", "priceNote", "order") VALUES
  ('bd-gvr-1', 'gin-vodka-rum', 'Gordon''s Gin', NULL, 500, NULL, 0),
  ('bd-gvr-2', 'gin-vodka-rum', 'Tanqueray Gin', NULL, 650, NULL, 1),
  ('bd-gvr-3', 'gin-vodka-rum', 'Smirnoff Vodka', NULL, 500, NULL, 2),
  ('bd-gvr-4', 'gin-vodka-rum', 'Absolut Vodka', NULL, 550, NULL, 3),
  ('bd-gvr-5', 'gin-vodka-rum', 'Captain Morgan Spiced Rum', NULL, 500, NULL, 4),
  ('bd-gvr-6', 'gin-vodka-rum', 'Bacardi Carta Blanca', NULL, 550, NULL, 5)
ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Section" ("id", "chapterId", "title", "note", "order") VALUES ('cognac-brandy', 'bar-drinks', 'Cognac & Brandy', 'Per 30 ml', 3) ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Dish" ("id", "sectionId", "name", "description", "price", "priceNote", "order") VALUES
  ('bd-cb-1', 'cognac-brandy', 'Viceroy Brandy', NULL, 450, NULL, 0),
  ('bd-cb-2', 'cognac-brandy', 'Hennessy VS', NULL, 900, NULL, 1),
  ('bd-cb-3', 'cognac-brandy', 'Martell VS', NULL, 850, NULL, 2),
  ('bd-cb-4', 'cognac-brandy', 'Rémy Martin VSOP', NULL, 1200, NULL, 3)
ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Section" ("id", "chapterId", "title", "note", "order") VALUES ('tequila-other', 'bar-drinks', 'Tequila & Other Spirits', 'Per 30 ml', 4) ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Dish" ("id", "sectionId", "name", "description", "price", "priceNote", "order") VALUES
  ('bd-tq-1', 'tequila-other', 'Jose Cuervo', NULL, 650, NULL, 0),
  ('bd-tq-2', 'tequila-other', 'Don Julio Blanco', NULL, 1100, NULL, 1)
ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Section" ("id", "chapterId", "title", "note", "order") VALUES ('classic-cocktails', 'bar-drinks', 'Classic Cocktails', NULL, 5) ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Dish" ("id", "sectionId", "name", "description", "price", "priceNote", "order") VALUES
  ('bd-cc-1', 'classic-cocktails', 'Mojito', 'White rum, lime, mint, sugar, soda', 1100, NULL, 0),
  ('bd-cc-2', 'classic-cocktails', 'Margarita', 'Tequila, orange liqueur, lime', 1200, NULL, 1),
  ('bd-cc-3', 'classic-cocktails', 'Passion Fruit Martini', 'Vodka, passion fruit, vanilla, lime', 1300, NULL, 2),
  ('bd-cc-4', 'classic-cocktails', 'Old Fashioned', 'Bourbon, sugar, bitters, orange', 1300, NULL, 3),
  ('bd-cc-5', 'classic-cocktails', 'Whisky Sour', 'Whisky, lemon, sugar', 1200, NULL, 4),
  ('bd-cc-6', 'classic-cocktails', 'Negroni', 'Gin, bitter aperitivo, sweet vermouth', 1300, NULL, 5),
  ('bd-cc-7', 'classic-cocktails', 'Espresso Martini', 'Vodka, coffee liqueur, espresso', 1400, NULL, 6),
  ('bd-cc-8', 'classic-cocktails', 'Aperol Spritz', 'Aperol, sparkling wine, soda', 1300, NULL, 7)
ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Section" ("id", "chapterId", "title", "note", "order") VALUES ('signature-cocktails', 'bar-drinks', 'Signature Cocktails', 'Proposed, recipes to be confirmed', 6) ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Dish" ("id", "sectionId", "name", "description", "price", "priceNote", "order") VALUES
  ('bd-sc-1', 'signature-cocktails', 'Hideaway Sunset', NULL, 1400, NULL, 0),
  ('bd-sc-2', 'signature-cocktails', 'Nairobi Garden', NULL, 1400, NULL, 1),
  ('bd-sc-3', 'signature-cocktails', 'Tropical No. 8', NULL, 1500, NULL, 2)
ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Section" ("id", "chapterId", "title", "note", "order") VALUES ('wine', 'bar-drinks', 'Red, White & Rosé Wine', NULL, 7) ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Dish" ("id", "sectionId", "name", "description", "price", "priceNote", "order") VALUES
  ('bd-wn-1', 'wine', 'House Red', '150 ml glass', 900, NULL, 0),
  ('bd-wn-2', 'wine', 'House White', '150 ml glass', 900, NULL, 1),
  ('bd-wn-3', 'wine', 'Rosé', '150 ml glass', 1000, NULL, 2),
  ('bd-wn-4', 'wine', 'Selected Bottle', 'Ask for the wine list', NULL, 'from 3,500', 3)
ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Section" ("id", "chapterId", "title", "note", "order") VALUES ('sparkling', 'bar-drinks', 'Sparkling Wine', NULL, 8) ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Dish" ("id", "sectionId", "name", "description", "price", "priceNote", "order") VALUES
  ('bd-sp-1', 'sparkling', 'Sparkling Wine', 'By the bottle', NULL, 'from 5,000', 0)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Chapter" ("id", "eyebrow", "title", "standfirst", "image", "imagePosition", "note", "footnote", "columns", "stock", "order", "published")
VALUES ('shisha', 'Packages', 'The Shisha Experience', 'Three ways to settle in', '/images/menu/cover.jpg', '88% center', 'Ask your host what each package includes.', NULL, 1, 'onyx', (SELECT "base" FROM "anchor") + 2, false)
ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Section" ("id", "chapterId", "title", "note", "order") VALUES ('shisha-packages', 'shisha', 'Packages', NULL, 0) ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Dish" ("id", "sectionId", "name", "description", "price", "priceNote", "order") VALUES
  ('sh-1', 'shisha-packages', 'Classic Experience', 'Our everyday package', 1500, NULL, 0),
  ('sh-2', 'shisha-packages', 'Premium Experience', 'A step up from the Classic', 2000, NULL, 1),
  ('sh-3', 'shisha-packages', 'Signature Experience', 'The house package', 2500, NULL, 2)
ON CONFLICT ("id") DO NOTHING;

DROP TABLE "anchor";
