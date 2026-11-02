-- Existing production rows were checked and none break these rules, so they now
-- cover all data. On a database built from scratch, the October 2026 poster from an
-- earlier migration starts "now" and ends in the past, so it gets a start before its end.
UPDATE "Poster" SET "startsAt" = "endsAt" - INTERVAL '1 day' WHERE "endsAt" <= "startsAt";

ALTER TABLE "Service" VALIDATE CONSTRAINT "Service_price_check";
ALTER TABLE "Service" VALIDATE CONSTRAINT "Service_duration_check";
ALTER TABLE "Dish" VALIDATE CONSTRAINT "Dish_price_check";
ALTER TABLE "Accommodation" VALIDATE CONSTRAINT "Accommodation_price_check";
ALTER TABLE "Accommodation" VALIDATE CONSTRAINT "Accommodation_capacity_check";
ALTER TABLE "Chapter" VALIDATE CONSTRAINT "Chapter_columns_check";
ALTER TABLE "Chapter" VALIDATE CONSTRAINT "Chapter_stock_check";
ALTER TABLE "Poster" VALIDATE CONSTRAINT "Poster_dates_check";
ALTER TABLE "Poster" VALIDATE CONSTRAINT "Poster_kind_check";

-- Supabase adds this event-trigger function to new projects. It runs by itself on
-- table creation, so nothing needs permission to call it, and it holds elevated
-- rights. Functions are executable by PUBLIC by default, which the API roles inherit.
DO $$
DECLARE
  api_role TEXT;
BEGIN
  IF to_regprocedure('public.rls_auto_enable()') IS NOT NULL THEN
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
    FOREACH api_role IN ARRAY ARRAY['anon', 'authenticated'] LOOP
      IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = api_role) THEN
        EXECUTE format('REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM %I', api_role);
      END IF;
    END LOOP;
  END IF;
END $$;
