// Regenerates public/images/og-share.jpg, the 1200x630 picture shown when the site link is shared.
// Run: node scripts/generate-og-image.mjs
import sharp from 'sharp';
const out = process.argv[2] ?? 'public/images/og-share.jpg';
(async () => {
  const W = 1200, H = 630, PW = 480;
  // Photo: the homepage hero (portrait). Scaled to 720 wide, then a 630-tall band
  // from the therapist's face down to the guest is cut out for the right side.
  const PHOTO_TOP = 150;
  const photo = await sharp('public/images/hero-spa-massage.jpg')
    .resize({ width: 720 })
    .extract({ left: 0, top: PHOTO_TOP, width: 720, height: 630 })
    .toBuffer();
  const logo = await sharp('public/images/hideaway-lockup-light.svg', { density: 600 })
    .resize({ width: 400 }).png().toBuffer();
  const logoMeta = await sharp(logo).metadata();
  const overlay = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#0b0b0a" stop-opacity="1"/>
      <stop offset="${PW/W}" stop-color="#0b0b0a" stop-opacity="1"/>
      <stop offset="${(PW+70)/W}" stop-color="#0b0b0a" stop-opacity="0"/>
    </linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <rect x="50" y="${150+logoMeta.height+40}" width="56" height="3" fill="#FBB040"/>
    <text x="50" y="${150+logoMeta.height+100}" font-family="Georgia, serif" font-size="36" fill="#ffffff">Massage · Spa · Grooming</text>
    <text x="50" y="${150+logoMeta.height+150}" font-family="Segoe UI, Arial, sans-serif" font-size="24" letter-spacing="3" fill="#FBB040">KILELESHWA · NAIROBI</text>
    <text x="50" y="${H-50}" font-family="Segoe UI, Arial, sans-serif" font-size="22" fill="#b9b4aa">Book your treatment today</text>
  </svg>`);
  await sharp({ create: { width: W, height: H, channels: 3, background: '#0b0b0a' } })
    .composite([
      { input: photo, left: W - 720, top: 0 },
      { input: overlay, left: 0, top: 0 },
      { input: logo, left: 50, top: 150 },
    ])
    .jpeg({ quality: 86, mozjpeg: true }).toFile(out);
})();
