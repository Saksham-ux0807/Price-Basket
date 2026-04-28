/**
 * Supported grocery/quick-commerce platforms.
 */
export type Platform = 'blinkit' | 'zepto' | 'bigbasket';

/**
 * A vegetable suggestion returned by the autocomplete endpoint.
 */
export interface VegetableSuggestion {
  id: string;
  name: string;
  /** Canonical search term to use when this suggestion is selected */
  query: string;
  /** Optional badge shown in the autocomplete dropdown */
  badge?: 'bestseller' | 'trending';
  /** Emoji for display */
  emoji?: string;
}

/**
 * The normalised result returned by a platform adapter for a given vegetable query.
 * Prices are stored as integers in INR paise to avoid floating-point arithmetic issues.
 */
export interface PlatformResult {
  platform: Platform;
  productName: string;
  /** Price in INR paise (integer). Divide by 100 to get rupees. */
  price: number;
  /** Human-readable formatted price, e.g. "₹29" */
  displayPrice: string;
  /** Unit/weight description, e.g. "500g", "1 kg" */
  unit: string;
  availability: boolean;
  productUrl: string;
}

/**
 * Common interface that every platform adapter must implement.
 * Adding a new platform requires only a new file implementing this interface.
 */
export interface PlatformAdapter {
  /** Unique platform identifier */
  id: Platform;
  /** Human-readable display name shown in the UI */
  displayName: string;
  /** Fetch price data for a vegetable query */
  fetchPrice(query: string): Promise<PlatformResult>;
  /** Return true if the given URL belongs to this platform */
  matchesUrl(url: string): boolean;
  /** Extract a normalised vegetable search query from a product URL, or null if not possible */
  extractQueryFromUrl(url: string): string | null;
}
