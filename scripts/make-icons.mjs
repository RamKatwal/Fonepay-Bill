// One-off: build Quickbill app icons from the Fonepay wordmark.
// Run: node scripts/make-icons.mjs
import sharp from 'sharp';
import path from 'node:path';

const SRC = 'C:/Users/user/Downloads/fonepay (1).png';
const OUT = path.resolve('assets/images');
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

/** Center the wordmark on a `size`×`size` canvas, occupying `frac` of the width. */
async function squareIcon(size, frac, background, outFile) {
  const logo = await sharp(SRC)
    .resize({ width: Math.round(size * frac), fit: 'inside' })
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toFile(path.join(OUT, outFile));
  console.log('wrote', outFile);
}

await squareIcon(1024, 0.82, WHITE, 'icon.png');
await squareIcon(1024, 0.62, TRANSPARENT, 'android-icon-foreground.png');
await squareIcon(1024, 1.0, WHITE, 'android-icon-background.png');
await squareIcon(1024, 0.6, TRANSPARENT, 'android-icon-monochrome.png');
await squareIcon(96, 0.86, WHITE, 'favicon.png');

// Wide splash logo on transparent.
await sharp(SRC).resize({ width: 512, fit: 'inside' }).png().toFile(path.join(OUT, 'splash-icon.png'));
console.log('wrote splash-icon.png');
