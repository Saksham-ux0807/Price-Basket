/**
 * BlinkitAdapter — simulated adapter for the Blinkit platform.
 *
 * Since Blinkit has CORS restrictions and no public API, this adapter uses
 * deterministic mock data based on a hash of the vegetable query. Prices are
 * slightly different from other platforms to make comparisons meaningful.
 *
 * Requirements: 4.2, 4.5
 */

import { PlatformAdapter, PlatformResult } from '../types';
import { BLINKIT_URL_PATTERN } from '../utils/urlClassifier';

/** Vegetable catalogue with Blinkit-specific prices (in INR paise). */
const VEGETABLE_CATALOGUE: Record<string, { name: string; price: number; unit: string }> = {
  tomato:      { name: 'Tomato',      price: 2900,  unit: '500g' },
  potato:      { name: 'Potato',      price: 2500,  unit: '1 kg' },
  onion:       { name: 'Onion',       price: 3200,  unit: '1 kg' },
  carrot:      { name: 'Carrot',      price: 3500,  unit: '500g' },
  spinach:     { name: 'Spinach',     price: 1800,  unit: '250g' },
  cauliflower: { name: 'Cauliflower', price: 4500,  unit: '1 pc' },
  brinjal:     { name: 'Brinjal',     price: 2800,  unit: '500g' },
  capsicum:    { name: 'Capsicum',    price: 5500,  unit: '500g' },
  cucumber:    { name: 'Cucumber',    price: 2200,  unit: '500g' },
  peas:        { name: 'Peas',        price: 6000,  unit: '500g' },
  beans:       { name: 'Beans',       price: 4800,  unit: '500g' },
  cabbage:     { name: 'Cabbage',     price: 3000,  unit: '1 pc' },
  ginger:      { name: 'Ginger',      price: 1500,  unit: '100g' },
  garlic:      { name: 'Garlic',      price: 2000,  unit: '100g' },
  coriander:   { name: 'Coriander',   price: 1200,  unit: '100g' },
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
  const delay = 300 + (hash % 501); // 300–800 ms
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Strip hyphens and weight/quantity suffixes from a URL slug to produce a
 * clean vegetable name suitable for catalogue lookup.
 *
 * Examples:
 *   "tomato-500g"        → "tomato"
 *   "fresh-spinach-1kg"  → "fresh spinach"
 *   "baby-potato-2-5kg"  → "baby potato"
 */
function normaliseSlug(slug: string): string {
  // Remove weight suffixes like -500g, -1kg, -2-5kg, -250ml, etc.
  const withoutWeight = slug.replace(/-?\d+[\d.-]*\s*(g|kg|ml|l|gm|gms|pc|pcs)\b/gi, '');
  // Replace remaining hyphens with spaces and trim
  return withoutWeight.replace(/-+/g, ' ').trim().toLowerCase();
}

export class BlinkitAdapter implements PlatformAdapter {
  readonly id = 'blinkit' as const;
  readonly displayName = 'Blinkit';

  matchesUrl(url: string): boolean {
    return BLINKIT_URL_PATTERN.test(url);
  }

  extractQueryFromUrl(url: string): string | null {
    // Pattern: blinkit.com/prn/<slug>/prid/<id>
    const match = url.match(/blinkit\.com\/prn\/([^/]+)\/prid\/\d+/);
    if (!match) return null;
    const slug = match[1];
    return normaliseSlug(slug) || null;
  }

  async fetchPrice(query: string): Promise<PlatformResult> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    try {
      // Race the simulated fetch against the abort signal
      await Promise.race([
        simulatedDelay(query),
        new Promise<never>((_, reject) => {
          controller.signal.addEventListener('abort', () =>
            reject(new Error('Blinkit request timed out after 10 seconds'))
          );
        }),
      ]);

      clearTimeout(timeoutId);

      const normalised = query.trim().toLowerCase();
      const entry = VEGETABLE_CATALOGUE[normalised];

      if (entry) {
        return {
          platform: 'blinkit',
          productName: entry.name,
          price: entry.price,
          displayPrice: `₹${(entry.price / 100).toFixed(0)}`,
          unit: entry.unit,
          availability: true,
          productUrl: `https://blinkit.com/prn/${normalised}-${entry.unit.replace(/\s/g, '')}/prid/${simpleHash(normalised) % 100000}`,
        };
      }

      // Unknown vegetable — generate a deterministic price from the hash
      const hash = simpleHash(normalised);
      const price = 1500 + (hash % 8500); // 1500–9999 paise
      const units = ['250g', '500g', '1 kg'];
      const unit = units[hash % units.length];
      const productName = normalised.charAt(0).toUpperCase() + normalised.slice(1);

      return {
        platform: 'blinkit',
        productName,
        price,
        displayPrice: `₹${(price / 100).toFixed(0)}`,
        unit,
        availability: hash % 10 !== 0, // ~10% chance out of stock
        productUrl: `https://blinkit.com/prn/${normalised}-${unit.replace(/\s/g, '')}/prid/${hash % 100000}`,
      };
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }
}

export const blinkitAdapter = new BlinkitAdapter();
