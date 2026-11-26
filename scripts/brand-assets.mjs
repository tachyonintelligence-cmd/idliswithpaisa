// Derives every brand asset from the supplied logo artwork. The shapes are never
// redrawn: pixel luminance of the white-on-black source becomes the alpha channel.
import sharp from 'sharp'

const SOURCE = 'src/assets/tachyon-logo-source.jpg'
const BLACK_POINT = 24 // source background (~10) plus JPEG noise
const WHITE_POINT = 236

const { data, info } = await sharp(SOURCE).greyscale().raw().toBuffer({ resolveWithObject: true })
const { width, height, channels } = info

function alphaAt(i) {
  const v = (data[i * channels] - BLACK_POINT) / (WHITE_POINT - BLACK_POINT)
  return Math.round(Math.min(1, Math.max(0, v)) * 255)
}

function tinted(tone) {
  const out = Buffer.alloc(width * height * 4)
  for (let i = 0; i < width * height; i++) {
    out.fill(tone, i * 4, i * 4 + 3)
    out[i * 4 + 3] = alphaAt(i)
  }
  return sharp(out, { raw: { width, height, channels: 4 } }).png().toBuffer()
}

function bounds(x0 = 0, x1 = width) {
  let l = x1, t = height, r = x0, b = 0
  for (let y = 0; y < height; y++) {
    for (let x = x0; x < x1; x++) {
      if (alphaAt(y * width + x) > 40) {
        l = Math.min(l, x); r = Math.max(r, x); t = Math.min(t, y); b = Math.max(b, y)
      }
    }
  }
  return { left: l - 2, top: t - 2, width: r - l + 5, height: b - t + 5 }
}

const full = bounds()
const mark = bounds(0, 370) // the chevron sits left of the wordmark

for (const [name, tone] of [['white', 255], ['black', 5]]) {
  const png = await tinted(tone)
  await sharp(png).extract(full).png({ compressionLevel: 9 }).toFile(`public/brand/logo-${name}.png`)
  await sharp(png).extract(mark).png({ compressionLevel: 9 }).toFile(`public/brand/mark-${name}.png`)
}

const whiteLogo = await sharp('public/brand/logo-white.png').toBuffer()
const whiteMark = await sharp('public/brand/mark-white.png').toBuffer()

async function onBlack(art, w, h, artWidth, file) {
  const resized = await sharp(art).resize({ width: artWidth }).toBuffer()
  await sharp({ create: { width: w, height: h, channels: 4, background: '#0A0A0A' } })
    .composite([{ input: resized, gravity: 'centre' }])
    .png({ compressionLevel: 9 })
    .toFile(file)
}

await onBlack(whiteLogo, 1200, 630, 860, 'public/brand/og-image.png')
await onBlack(whiteMark, 180, 180, 86, 'public/brand/apple-touch-icon.png')
await onBlack(whiteMark, 64, 64, 34, 'public/brand/favicon.png')

console.log('logo', full, 'mark', mark)
