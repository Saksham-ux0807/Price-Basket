/**
 * BigBasketAdapter — simulated adapter for the BigBasket platform.
 *
 * Since BigBasket has CORS restrictions and no public API, this adapter uses
 * deterministic mock data based on a hash of the vegetable query. Prices are
 * slightly different from other platforms to make comparisons meaningful.
 *
 * Requirements: 4.2, 4.5
 */

import { PlatformAdapter, PlatformResult } from '../types';
import { BIGBASKET_URL_PATTERN } from '../utils/urlClassifier';

/** Vegetable catalogue with BigBasket-specific prices (in INR paise). */
const VEGETABLE_CATALOGUE: Record<string, { name: string; price: number; unit: string }> = {
  tomato:      { name: 'Tomato',      price: 3100,  unit: '500g' },
  potato:      { name: 'Potato',      price: 2700,  unit: '1 kg' },
  onion:       { name: 'Onion',       price: 3400,  unit: '1 kg' },
  carrot:      { name: 'Carrot',      price: 3300,  unit: '500g' },
  spinach:     { name: 'Spinach',     price: 1600,  unit: '250g' },
  cauliflower: { name: 'Cauliflower', price: 4800,  unit: '1 pc' },
  brinjal:     { name: 'Brinjal',     price: 3000,  unit: '500g' },
  capsicum:    { name: 'Capsicum',    price: 5800,  unit: '500g' },
  cucumber:    { name: 'Cucumber',    price: 2000,  unit: '500g' },
  peas:        { name: 'Peas',        price: 6200,  unit: '500g' },
  beans:       { name: 'Beans',       price: 5000,  unit: '500g' },
  cabbage:     { name: 'Cabbage',     price: 3200,  unit: '1 pc' },
  ginger:      { name: 'Ginger',      price: 1600,  unit: '100g' },
  garlic:      { name: 'Garlic',      price: 2200,  unit: '100g' },
  coriander:   { name: 'Coriander',   price: 1400,  unit: '100g' },
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
  // Offset by 300 so BigBasket's delay differs from the other adapters
  const delay = 300 + ((hash + 300) % 501);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Strip hyphens and weight/quantity suffixes from a URL slug to produce a
 * clean vegetable name suitable for catalogue lookup.
 *
 * BigBasket slugs often include a brand prefix, e.g. "fresho-tomato-500g".
 * We strip the weight suffix first, then replace hyphens with spaces.
 *
 * Examples:
 *   "fresho-tomato-500g"   → "fresho tomato"
 *   "bb-royal-potato-1kg"  → "bb royal potato"
 *   "spinach-250g"         → "spinach"
 */
function normaliseSlug(slug: string): string {
  // Remove trailing slash if present
  const clean = slug.replace(/\/$/, '');
  // Remove weight suffixes like -500g, -1kg, -250ml, etc.
  const withoutWeight = clean.replace(/-?\d+[\d.-]*\s*(g|kg|ml|l|gm|gms|pc|pcs)\b/gi, '');
  // Replace remaining hyphens with spaces and trim
  return withoutWeight.replace(/-+/g, ' ').trim().toLowerCase();
}

export class BigBasketAdapter implements PlatformAdapter {
  readonly id = 'bigbasket' as const;
  readonly displayName = 'BigBasket';

  matchesUrl(url: string): boolean {
    return BIGBASKET_URL_PATTERN.test(url);
  }

  extractQueryFromUrl(url: string): string | null {
    // Pattern: bigbasket.com/pd/<id>/<slug>
    const match = url.match(/bigbasket\.com\/pd\/\d+\/([^/?]+)/);
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
            reject(new Error('BigBasket request timed out after 10 seconds'))
          );
        }),
      ]);

      clearTimeout(timeoutId);

      const normalised = query.trim().toLowerCase();
      const entry = VEGETABLE_CATALOGUE[normalised];

      if (entry) {
        const productId = simpleHash(normalised) % 100000000;
        return {
          platform: 'bigbasket',
          productName: entry.name,
          price: entry.price,
          displayPrice: `₹${(entry.price / 100).toFixed(0)}`,
          unit: entry.unit,
          availability: true,
          productUrl: `https://www.bigbasket.com/pd/${productId}/fresho-${normalised}-${entry.unit.replace(/\s/g, '')}/`,
        };
      }

      // Unknown vegetable — generate a deterministic price from the hash
      const hash = simpleHash(normalised);
      // Offset by 400 so BigBasket prices differ from other adapters for unknown items
      const price = 1500 + ((hash + 400) % 8500);
      const units = ['250g', '500g', '1 kg'];
      const unit = units[(hash + 2) % units.length];
      const productName = normalised.charAt(0).toUpperCase() + normalised.slice(1);
      const productId = hash % 100000000;

      return {
        platform: 'bigbasket',
        productName,
        price,
        displayPrice: `₹${(price / 100).toFixed(0)}`,
        unit,
        availability: (hash + 2) % 10 !== 0,
        productUrl: `https://www.bigbasket.com/pd/${productId}/fresho-${normalised}-${unit.replace(/\s/g, '')}/`,
      };
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }
}

export const bigBasketAdapter = new BigBasketAdapter();
