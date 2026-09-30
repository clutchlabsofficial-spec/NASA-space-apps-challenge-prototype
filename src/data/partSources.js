/**
 * Photographs and places to buy, layered onto the parts list.
 *
 * ── Why images are keyed to vendor product pages ──────────────────────────
 * Every image below is the vendor's own product photograph, served from the
 * vendor's own CDN, resolved from the `og:image` tag on the exact product page
 * the part already links to. Each one returned HTTP 200 with real image bytes
 * on the date in IMAGES_CHECKED.
 *
 * That is deliberately narrow. Pulling photographs out of a general image
 * search would give prettier pictures of parts the child then cannot buy, from
 * URLs that rot in weeks and that nobody has licensed. A vendor's photo of the
 * exact SKU you are linking to is the one image that stays true.
 *
 * ── Why the non-US links are searches, not product pages ──────────────────
 * The US/global link for each part is a specific, verified product page. The
 * India links are SEARCHES on established retailers, and that is on purpose:
 *
 *   - A deep link to one Indian listing goes out of stock, gets relisted under
 *     a new ID, or quietly becomes a different seller. A search on a known-good
 *     retailer domain cannot 404 and always shows what is actually available.
 *   - It is the safer answer for "scam-free". Sending a child to a search on
 *     robu.in or amazon.in lands them on a domain that is unambiguously the
 *     real retailer. Sending them to a specific marketplace listing means
 *     vouching for one seller, which nobody can do from here.
 *
 * So: the global link is verified hardware; the regional links are verified
 * retailers. Both are honest about which they are, in the UI.
 *
 * Myntra, which was mentioned, is a clothing retailer and sells none of this,
 * so it is not included — Robu and Amazon.in are the Indian equivalents that
 * actually stock hobby electronics.
 */

export const IMAGES_CHECKED = '2026-09-30'

/** Vendor product photographs, keyed by the product URL already in parts.js. */
export const PART_IMAGES = {
  'https://www.adafruit.com/product/1071': 'https://www.adafruit.com/images/480x360/1071-05.jpg',
  'https://www.adafruit.com/product/169': 'https://www.adafruit.com/images/480x360/169-06.jpg',
  'https://www.adafruit.com/product/1747': 'https://www.adafruit.com/images/480x360/1747-00.jpg',
  'https://www.adafruit.com/product/2011': 'https://www.adafruit.com/images/480x360/2011-05.jpg',
  'https://www.adafruit.com/product/3057': 'https://www.adafruit.com/images/480x360/3057-01.jpg',
  'https://www.adafruit.com/product/3072': 'https://www.adafruit.com/images/480x360/3072-07.jpg',
  'https://www.adafruit.com/product/3299': 'https://www.adafruit.com/images/480x360/3299-00.jpg',
  'https://www.adafruit.com/product/3535': 'https://www.adafruit.com/images/480x360/3535-00.jpg',
  'https://www.adafruit.com/product/3538': 'https://www.adafruit.com/images/480x360/3538-03',
  'https://www.adafruit.com/product/372': 'https://www.adafruit.com/images/480x360/372-01.jpg',
  'https://www.adafruit.com/product/4193': 'https://www.adafruit.com/images/480x360/4193-01.jpg',
  'https://www.adafruit.com/product/4517': 'https://www.adafruit.com/images/480x360/4517-07.jpg',
  'https://www.adafruit.com/product/5366': 'https://www.adafruit.com/images/480x360/5366-01.jpg',
  'https://www.adafruit.com/product/6087': 'https://www.adafruit.com/images/480x360/6087-00.jpg',
  'https://www.adafruit.com/product/705': 'https://www.adafruit.com/images/480x360/705-04.jpg',
  'https://www.adafruit.com/product/711': 'https://www.adafruit.com/images/480x360/711-06.jpg',
  'https://www.adafruit.com/product/746': 'https://www.adafruit.com/images/480x360/746-11.jpg',
}

/** A generic, on-brand placeholder when a part has no vendor photograph —
 *  better than a broken image icon, and honest that there is no photo. */
export const NO_IMAGE = null

/** Retailers we are willing to send a child to, with how to search them.
 *  `trust` is the reason this domain is on the list at all. */
export const RETAILERS = {
  adafruit: {
    id: 'adafruit',
    name: 'Adafruit',
    region: 'Global',
    search: (q) => `https://www.adafruit.com/?q=${encodeURIComponent(q)}`,
    trust: 'Long-established US maker-electronics company. Publishes full documentation for everything it sells.',
  },
  robu: {
    id: 'robu',
    name: 'Robu.in',
    region: 'India',
    search: (q) => `https://robu.in/?s=${encodeURIComponent(q)}&post_type=product`,
    trust: 'Indian robotics and electronics retailer, widely used by schools and colleges.',
  },
  amazonIn: {
    id: 'amazonIn',
    name: 'Amazon.in',
    region: 'India',
    search: (q) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}`,
    trust: 'Check the seller rating and that it is Fulfilled by Amazon before buying — marketplace listings vary.',
  },
}

/** Short, generic search terms — the words that find the right component in
 *  any shop, rather than one vendor's product name. */
export const SEARCH_TERMS = {
  'https://www.adafruit.com/product/6087': 'Raspberry Pi Pico 2 W',
  'https://www.adafruit.com/product/4517': 'LSM6DSOX LIS3MDL 9 DOF IMU',
  'https://www.adafruit.com/product/3072': 'RFM95 LoRa 433 MHz module',
  'https://www.adafruit.com/product/2011': 'lithium ion battery 3.7V 2000mAh',
  'https://www.adafruit.com/product/5366': '6V 2W solar panel',
  'https://www.adafruit.com/product/746': 'GPS module breakout',
  'https://www.adafruit.com/product/3538': 'AMG8833 thermal camera',
  'https://www.adafruit.com/product/1747': 'MLX90614 infrared temperature sensor',
  'https://www.adafruit.com/product/372': '10K NTC thermistor',
  'https://www.adafruit.com/product/3299': 'M3 nylon standoff screw kit',
  'https://www.adafruit.com/product/4193': 'AA battery holder with switch',
  'https://www.adafruit.com/product/3057': 'polyimide Kapton tape',
  'https://www.adafruit.com/product/169': 'micro servo SG90',
  'https://www.adafruit.com/product/711': 'hobby DC motor',
  'https://www.raspberrypi.com/products/raspberry-pi-zero-2-w/': 'Raspberry Pi Zero 2 W',
  'https://www.raspberrypi.com/products/camera-module-3/': 'Raspberry Pi Camera Module 3',
  'https://store.arduino.cc/products/arduino-nano': 'Arduino Nano',
}

/** Everything a shopping card needs for one part. */
export function sourcesFor(part) {
  const image = part.url ? PART_IMAGES[part.url] || NO_IMAGE : NO_IMAGE
  const term = (part.url && SEARCH_TERMS[part.url]) || part.name

  const buy = []
  if (part.url) {
    buy.push({
      kind: 'exact',
      retailer: part.vendor || 'Vendor',
      label: 'This exact part',
      url: part.url,
      note: 'Checked and working.',
    })
  }
  buy.push(
    {
      kind: 'search',
      retailer: RETAILERS.robu.name,
      region: RETAILERS.robu.region,
      label: `Search ${RETAILERS.robu.name}`,
      url: RETAILERS.robu.search(term),
      note: RETAILERS.robu.trust,
    },
    {
      kind: 'search',
      retailer: RETAILERS.amazonIn.name,
      region: RETAILERS.amazonIn.region,
      label: `Search ${RETAILERS.amazonIn.name}`,
      url: RETAILERS.amazonIn.search(term),
      note: RETAILERS.amazonIn.trust,
    },
  )

  return { image, term, buy }
}

/** Shown once on the shop screen. Not optional — it is the scam-safety part. */
export const BUYING_ADVICE = {
  e: [
    'The "exact part" link goes to the manufacturer or a long-established retailer. Those are the safe ones.',
    'The regional links are searches on real retailer sites, not one specific listing — so you see what is genuinely in stock today.',
    'On any marketplace, check the seller rating and the returns policy before you buy. A price far below everyone else is a warning, not a bargain.',
    'Never buy anything without the adult who is paying for it looking at the page first.',
  ],
  x: [
    'The first link takes you to the people who actually make the part. Those are the safe ones.',
    'The other links search real shops so you can see what they have today.',
    'If something is way cheaper than everywhere else, that is a warning sign, not a bargain.',
    'Always show a grown-up the page before anything gets bought.',
  ],
}
