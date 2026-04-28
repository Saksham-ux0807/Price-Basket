/**
 * URL classifier utility for the veggie-price-compare app.
 * Classifies search bar input as a text query, supported product link,
 * unsupported URL, or malformed URL.
 */

export type InputClassification =
  | 'text_query'
  | 'product_link'
  | 'unsupported_url'
  | 'malformed_url';

/**
 * Regex pattern for Blinkit product URLs.
 * Example: https://blinkit.com/prn/tomato-500g/prid/12345
 */
export const BLINKIT_URL_PATTERN = /blinkit\.com\/prn\/[^/]+\/prid\/\d+/;

/**
 * Regex pattern for Zepto product URLs.
 * Example: https://www.zeptonow.com/pn/tomato/pvid/abc-123
 */
export const ZEPTO_URL_PATTERN = /zeptonow\.com\/pn\/[^/]+\/pvid\/[^/?]+/;

/**
 * Regex pattern for BigBasket product URLs.
 * Example: https://www.bigbasket.com/pd/40123456/fresho-tomato-500g/
 */
export const BIGBASKET_URL_PATTERN = /bigbasket\.com\/pd\/\d+\/[^/?]+/;

/**
 * All supported platform URL patterns, exported for reuse in adapters.
 */
export const PLATFORM_URL_PATTERNS = {
  blinkit: BLINKIT_URL_PATTERN,
  zepto: ZEPTO_URL_PATTERN,
  bigbasket: BIGBASKET_URL_PATTERN,
} as const;

/**
 * Returns true if the input string looks like it is intended to be a URL
 * (contains "://" or starts with "http" or "www."), but may or may not be valid.
 */
function looksLikeUrl(input: string): boolean {
  const trimmed = input.trim();
  return (
    trimmed.includes('://') ||
    trimmed.startsWith('www.')
  );
}

/**
 * Attempts to parse the input as a URL. Returns the URL object on success,
 * or null if parsing fails.
 */
function tryParseUrl(input: string): URL | null {
  try {
    // Prepend https:// for www. inputs that lack a scheme
    const candidate = input.trim().startsWith('www.')
      ? `https://${input.trim()}`
      : input.trim();
    return new URL(candidate);
  } catch {
    return null;
  }
}

/**
 * Classifies a search bar input string.
 *
 * - `'product_link'`    — valid URL matching a supported platform pattern
 * - `'unsupported_url'` — valid URL from an unrecognised domain
 * - `'malformed_url'`   — looks like a URL but fails URL parsing
 * - `'text_query'`      — plain text / vegetable name
 *
 * Requirements: 4.1, 4.3, 4.4, 4.5
 */
export function classifyInput(input: string): InputClassification {
  const trimmed = input.trim();

  if (!looksLikeUrl(trimmed)) {
    // Plain text — not URL-like at all
    return 'text_query';
  }

  const parsed = tryParseUrl(trimmed);

  if (parsed === null) {
    // Looks like a URL but could not be parsed
    return 'malformed_url';
  }

  // Check against each supported platform pattern
  if (
    BLINKIT_URL_PATTERN.test(trimmed) ||
    ZEPTO_URL_PATTERN.test(trimmed) ||
    BIGBASKET_URL_PATTERN.test(trimmed)
  ) {
    return 'product_link';
  }

  // Valid URL but not a supported platform
  return 'unsupported_url';
}
