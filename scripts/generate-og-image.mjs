// Regenerates the 1200x630 picture shown when the site link is shared: the full-size
// lounge photo behind the homepage hero, cropped to shape. Social apps cache by URL, so a
// new picture needs a new filename, also updated in src/lib/seo.ts, src/lib/json-ld.ts and
// the room page fallback.
// Run: node scripts/generate-og-image.mjs
import sharp from 'sharp';
const out = process.argv[2] ?? 'public/images/og-hideaway-lounge.jpg';
await sharp('public/images/venue/lounge-pool-wide-landscape.jpg')
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(out);
