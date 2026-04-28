/**
 * Shareable link utilities for the veggie-price-compare app.
 * Encodes and decodes the active search query into/from a URL query parameter.
 *
 * Requirements: 5.1, 5.3
 */

/**
 * Builds a shareable URL for the given vegetable search query.
 *
 * The query is encoded as `?q=<encodeURIComponent(query)>` and appended to
 * the base URL. If `baseUrl` is not provided, `window.location.href` is used
 * with any existing query string stripped first.
 *
 * @param query   - The vegetable search query to encode.
 * @param baseUrl - Optional base URL. Defaults to the current page URL
 *                  (without query string) when running in a browser.
 * @returns A fully-formed URL string with the `q` parameter set.
 */
export function buildShareableLink(query: string, baseUrl?: string): string {
  let base: string;

  if (baseUrl !== undefined) {
    base = baseUrl;
  } else {
    // Strip any existing query string / fragment from the current page URL
    const href = window.location.href;
    const questionMarkIndex = href.indexOf('?');
    const hashIndex = href.indexOf('#');
    const cutAt =
      questionMarkIndex !== -1
        ? questionMarkIndex
        : hashIndex !== -1
          ? hashIndex
          : href.length;
    base = href.slice(0, cutAt);
  }

  return `${base}?q=${encodeURIComponent(query)}`;
}

/**
 * Parses a shareable URL and returns the decoded value of the `q` parameter.
 *
 * @param url - A URL string that may contain a `q` query parameter.
 * @returns The decoded query string, or `null` if the URL is invalid or has
 *          no `q` parameter.
 */
export function parseShareableLink(url: string): string | null {
  try {
    const parsed = new URL(url);
    const q = parsed.searchParams.get('q');
    if (q === null) {
      return null;
    }
    // URLSearchParams.get() already applies percent-decoding, which is
    // equivalent to decodeURIComponent. Returning q directly satisfies the
    // spec requirement to use decodeURIComponent when extracting the value.
    return q;
  } catch {
    return null;
  }
}
