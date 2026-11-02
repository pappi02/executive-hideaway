-- Two-factor sign-in and per-admin session revocation.
ALTER TABLE "Admin" ADD COLUMN "sessionVersion" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Admin" ADD COLUMN "totpSecret" TEXT;
ALTER TABLE "Admin" ADD COLUMN "totpEnabledAt" TIMESTAMP(3);
ALTER TABLE "Admin" ADD COLUMN "totpLastStep" INTEGER;

-- Who changed what in the admin dashboard.
CREATE TABLE "AdminActivity" (
    "id" TEXT NOT NULL,
    "adminEmail" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminActivity_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AdminActivity_createdAt_idx" ON "AdminActivity"("createdAt");

-- Booking requests, saved when a guest continues to WhatsApp.
CREATE TABLE "BookingRequest" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingRequest_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "BookingRequest_kind_check" CHECK ("kind" IN ('appointment', 'accommodation')),
    CONSTRAINT "BookingRequest_status_check" CHECK ("status" IN ('new', 'contacted', 'confirmed', 'cancelled'))
);
CREATE INDEX "BookingRequest_createdAt_idx" ON "BookingRequest"("createdAt");

-- Closed to Supabase's Data API, like every other table.
ALTER TABLE "AdminActivity" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BookingRequest" ENABLE ROW LEVEL SECURITY;
