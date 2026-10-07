/**
 * One-time move of room images from Postgres (bytea) to Vercel Blob.
 *
 *   npm run images:migrate            # copy every remaining image, then clear its bytes
 *   npm run images:migrate -- --dry-run
 *
 * Needs DATABASE_URL and BLOB_READ_WRITE_TOKEN (e.g. `vercel env pull .env.local`
 * then run with those loaded). Safe to re-run: rows that already have a URL are skipped,
 * and each row is handled on its own so a failure never loses an image.
 *
 * Afterwards, run `VACUUM FULL "AccommodationImage";` on the database to hand the
 * freed space back — Postgres keeps it reserved until then.
 */
import { PrismaClient } from "@prisma/client";
import { storeAccommodationImage } from "../src/lib/accommodation-images";

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set. Connect a Blob store to the project and pull its env vars first.");
  }

  // Only ids here; the bytes are loaded one image at a time below.
  const pending = await prisma.accommodationImage.findMany({
    where: { url: null, data: { not: null } },
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });
  console.log(`${pending.length} image(s) still stored in the database.${dryRun ? " (dry run)" : ""}`);

  let moved = 0;
  let movedBytes = 0;
  for (const { id } of pending) {
    const image = await prisma.accommodationImage.findUnique({
      where: { id },
      select: { accommodationId: true, contentType: true, data: true, url: true },
    });
    if (!image?.data || image.url) continue;

    const size = image.data.byteLength;
    if (dryRun) {
      console.log(`would move ${id} (${(size / 1024).toFixed(0)} KB, ${image.contentType})`);
      continue;
    }

    try {
      const url = await storeAccommodationImage(image.accommodationId, image.data, image.contentType);
      await prisma.accommodationImage.update({ where: { id }, data: { url, data: null } });
      moved += 1;
      movedBytes += size;
      console.log(`moved ${id} -> ${url}`);
    } catch (error) {
      console.error(`failed ${id}; left in the database`, error);
    }
  }

  if (!dryRun) {
    console.log(`Done: moved ${moved}/${pending.length} image(s), ${(movedBytes / 1024 / 1024).toFixed(1)} MB out of Postgres.`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
