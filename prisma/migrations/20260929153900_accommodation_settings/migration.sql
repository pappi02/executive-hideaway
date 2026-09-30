-- AlterTable
ALTER TABLE "Accommodation" ADD COLUMN     "priceIsIndicative" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "AccommodationSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "checkIn" TEXT,
    "checkOut" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccommodationSettings_pkey" PRIMARY KEY ("id")
);
