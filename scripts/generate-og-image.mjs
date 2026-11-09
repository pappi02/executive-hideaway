// Regenerates the 1200x630 picture shown when the site link is shared: the homepage
// hero photo, cropped to shape. Social apps cache by URL, so a new picture needs a new
// filename, also updated in src/lib/seo.ts, src/lib/json-ld.ts and the room page fallback.
// Run: node scripts/generate-og-image.mjs
import sharp from 'sharp';
const out = process.argv[2] ?? 'public/images/og-hideaway-experience.jpg';
await sharp('public/images/hero-hideaway-experience.jpg')
  .extract({ left: 0, top: 30, width: 1600, height: 840 })
  .resize(1200, 630)
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(out);
