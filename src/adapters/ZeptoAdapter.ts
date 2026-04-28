/**
 * ZeptoAdapter — simulated adapter for the Zepto platform.
 *
 * Since Zepto has CORS restrictions and no public API, this adapter uses
 * deterministic mock data based on a hash of the vegetable query. Prices are
 * slightly different from other platforms to make comparisons meaningful.
 *
 * Requirements: 4.2, 4.5
 */

import { PlatformAdapter, PlatformResult } from '../types';
import { ZEPTO_URL_PATTERN } from '../utils/urlClassifier';

/** Vegetable catalogue with Zepto-specific prices (in INR paise). */
const VEGETABLE_CATALOGUE: Record<string, { name: string; price: number; unit: string }> = {
  tomato:      { name: 'Tomato',      price: 2700,  unit: '500g' },
  potato:      { name: 'Potato',      price: 2300,  unit: '1 kg' },
  onion:       { name: 'Onion',       price: 3000,  unit: '1 kg' },
  carrot:      { name: 'Carrot',      price: 3800,  unit: '500g' },
  spinach:     { name: 'Spinach',     price: 2000,  unit: '250g' },
  cauliflower: { name: 'Cauliflower', price: 4200,  unit: '1 pc' },
  brinjal:     { name: 'Brinjal',     price: 2600,  unit: '500g' },
  capsicum:    { name: 'Capsicum',    price: 5200,  unit: '500g' },
  cucumber:    { name: 'Cucumber',    price: 2400,  unit: '500g' },
  peas:        { name: 'Peas',        price: 5800,  unit: '500g' },
  beans:       { name: 'Beans',       price: 4500,  unit: '500g' },
  cabbage:     { name: 'Cabbage',     price: 2800,  unit: '1 pc' },
  ginger:      { name: 'Ginger',      price: 1400,  unit: '100g' },
  garlic:      { name: 'Garlic',      price: 1800,  unit: '100g' },
  coriander:   { name: 'Coriander',   price: 1000,  unit: '100g' },
};

/**
 * Simple deterministic hash of a string, used to generate a consistent
 * price offset for unknown vegetables.
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Simulate a network delay between 300 ms and 800 ms.
 * The delay is deterministic based on the query so tests are predictable.
 */
function simulatedDelay(query: string): Promise<void> {
  const hash = simpleHash(query);
  // Offset by 150 so Zepto's delay differs from Blinkit's for the same query
  const delay = 300 + ((hash + 150) % 501);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Strip hyphens and weight/quantity suffixes from a URL slug to produce a
 * clean vegetable name suitable for catalogue lookup.
 *
 * Examples:
 *   "tomato"             → "tomato"
 *   "fresh-spinach"      → "fresh spinach"
 *   "baby-potato-500g"   → "baby potato"
 */
function normaliseSlug(slug: string): string {
  // Remove weight suffixes like -500g, -1kg, -250ml, etc.
  const withoutWeight = slug.replace(/-?\d+[\d.-]*\s*(g|kg|ml|l|gm|gms|pc|pcs)\b/gi, '');
  // Replace remaining hyphens with spaces and trim
  return withoutWeight.replace(/-+/g, ' ').trim().toLowerCase();
}

export class ZeptoAdapter implements PlatformAdapter {
  readonly id = 'zepto' as const;
  readonly displayName = 'Zepto';

  matchesUrl(url: string): boolean {
    return ZEPTO_URL_PATTERN.test(url);
  }

  extractQueryFromUrl(url: string): string | null {
    // Pattern: zeptonow.com/pn/<slug>/pvid/<id>
    const match = url.match(/zeptonow\.com\/pn\/([^/]+)\/pvid\/[^/?]+/);
    if (!match) return null;
    const slug = match[1];
    return normaliseSlug(slug) || null;
  }

  async fetchPrice(query: string): Promise<PlatformResult> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    try {
      await Promise.race([
        simulatedDelay(query),
        new Promise<never>((_, reject) => {
          controller.signal.addEventListener('abort', () =>
            reject(new Error('Zepto request timed out after 10 seconds'))
          );
        }),
      ]);

      clearTimeout(timeoutId);

      const normalised = query.trim().toLowerCase();
      const entry = VEGETABLE_CATALOGUE[normalised];

      if (entry) {
        return {
          platform: 'zepto',
          productName: entry.name,
          price: entry.price,
          displayPrice: `₹${(entry.price / 100).toFixed(0)}`,
          unit: entry.unit,
          availability: true,
          productUrl: `https://www.zeptonow.com/pn/${normalised}/pvid/${simpleHash(normalised).toString(16)}`,
        };
      }

      // Unknown vegetable — generate a deterministic price from the hash
      const hash = simpleHash(normalised);
      // Offset by 200 so Zepto prices differ from Blinkit for unknown items
      const price = 1500 + ((hash + 200) % 8500);
      const units = ['250g', '500g', '1 kg'];
      const unit = units[(hash + 1) % units.length];
      const productName = normalised.charAt(0).toUpperCase() + normalised.slice(1);

      return {
        platform: 'zepto',
        productName,
        price,
        displayPrice: `₹${(price / 100).toFixed(0)}`,
        unit,
        availability: (hash + 1) % 10 !== 0,
        productUrl: `https://www.zeptonow.com/pn/${normalised}/pvid/${hash.toString(16)}`,
      };
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }
}

export const zeptoAdapter = new ZeptoAdapter();
