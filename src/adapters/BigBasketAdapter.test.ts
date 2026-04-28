/**
 * Tests for BigBasketAdapter.
 * Verifies matchesUrl() and extractQueryFromUrl() work correctly.
 */

import { describe, it, expect } from 'vitest';
import { BigBasketAdapter } from './BigBasketAdapter';

const adapter = new BigBasketAdapter();

describe('BigBasketAdapter.matchesUrl', () => {
  it('returns true for a valid BigBasket product URL', () => {
    expect(adapter.matchesUrl('https://www.bigbasket.com/pd/40123456/fresho-tomato-500g/')).toBe(true);
  });

  it('returns true for a BigBasket URL without trailing slash', () => {
    expect(adapter.matchesUrl('https://www.bigbasket.com/pd/12345678/bb-royal-potato-1kg')).toBe(true);
  });

  it('returns true for a BigBasket URL without www', () => {
    expect(adapter.matchesUrl('https://bigbasket.com/pd/99999999/spinach-250g')).toBe(true);
  });

  it('returns false for a Blinkit URL', () => {
    expect(adapter.matchesUrl('https://blinkit.com/prn/tomato-500g/prid/12345')).toBe(false);
  });

  it('returns false for a Zepto URL', () => {
    expect(adapter.matchesUrl('https://www.zeptonow.com/pn/tomato/pvid/abc-123')).toBe(false);
  });

  it('returns false for a plain text query', () => {
    expect(adapter.matchesUrl('tomato')).toBe(false);
  });

  it('returns false for an unrelated URL', () => {
    expect(adapter.matchesUrl('https://example.com/product/123')).toBe(false);
  });
});

describe('BigBasketAdapter.extractQueryFromUrl', () => {
  it('extracts a slug with brand prefix and weight suffix', () => {
    const query = adapter.extractQueryFromUrl('https://www.bigbasket.com/pd/40123456/fresho-tomato-500g/');
    // "fresho tomato" — brand prefix is kept, weight stripped
    expect(query).toBe('fresho tomato');
  });

  it('extracts a slug with multi-part brand prefix', () => {
    const query = adapter.extractQueryFromUrl('https://www.bigbasket.com/pd/12345678/bb-royal-potato-1kg');
    expect(query).toBe('bb royal potato');
  });

  it('extracts a simple slug without brand prefix', () => {
    const query = adapter.extractQueryFromUrl('https://bigbasket.com/pd/99999999/spinach-250g');
    expect(query).toBe('spinach');
  });

  it('returns null for a non-BigBasket URL', () => {
    const query = adapter.extractQueryFromUrl('https://blinkit.com/prn/tomato-500g/prid/12345');
    expect(query).toBeNull();
  });

  it('returns null for a plain text string', () => {
    const query = adapter.extractQueryFromUrl('tomato');
    expect(query).toBeNull();
  });
});

describe('BigBasketAdapter metadata', () => {
  it('has the correct id', () => {
    expect(adapter.id).toBe('bigbasket');
  });

  it('has the correct displayName', () => {
    expect(adapter.displayName).toBe('BigBasket');
  });
});
