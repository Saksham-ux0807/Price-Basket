/**
 * Tests for BlinkitAdapter.
 * Verifies matchesUrl() and extractQueryFromUrl() work correctly.
 */

import { describe, it, expect } from 'vitest';
import { BlinkitAdapter } from './BlinkitAdapter';

const adapter = new BlinkitAdapter();

describe('BlinkitAdapter.matchesUrl', () => {
  it('returns true for a valid Blinkit product URL', () => {
    expect(adapter.matchesUrl('https://blinkit.com/prn/tomato-500g/prid/12345')).toBe(true);
  });

  it('returns true for a Blinkit URL with www subdomain', () => {
    expect(adapter.matchesUrl('https://www.blinkit.com/prn/onion-1kg/prid/99999')).toBe(true);
  });

  it('returns false for a Zepto URL', () => {
    expect(adapter.matchesUrl('https://www.zeptonow.com/pn/tomato/pvid/abc-123')).toBe(false);
  });

  it('returns false for a BigBasket URL', () => {
    expect(adapter.matchesUrl('https://www.bigbasket.com/pd/40123456/fresho-tomato-500g/')).toBe(false);
  });

  it('returns false for a plain text query', () => {
    expect(adapter.matchesUrl('tomato')).toBe(false);
  });

  it('returns false for an unrelated URL', () => {
    expect(adapter.matchesUrl('https://example.com/product/123')).toBe(false);
  });
});

describe('BlinkitAdapter.extractQueryFromUrl', () => {
  it('extracts a simple vegetable slug', () => {
    const query = adapter.extractQueryFromUrl('https://blinkit.com/prn/tomato-500g/prid/12345');
    expect(query).toBe('tomato');
  });

  it('extracts a multi-word slug with hyphens', () => {
    const query = adapter.extractQueryFromUrl('https://blinkit.com/prn/fresh-spinach-250g/prid/67890');
    expect(query).toBe('fresh spinach');
  });

  it('extracts slug without weight suffix', () => {
    const query = adapter.extractQueryFromUrl('https://blinkit.com/prn/onion-1kg/prid/11111');
    expect(query).toBe('onion');
  });

  it('returns null for a non-Blinkit URL', () => {
    const query = adapter.extractQueryFromUrl('https://www.zeptonow.com/pn/tomato/pvid/abc-123');
    expect(query).toBeNull();
  });

  it('returns null for a plain text string', () => {
    const query = adapter.extractQueryFromUrl('tomato');
    expect(query).toBeNull();
  });
});

describe('BlinkitAdapter metadata', () => {
  it('has the correct id', () => {
    expect(adapter.id).toBe('blinkit');
  });

  it('has the correct displayName', () => {
    expect(adapter.displayName).toBe('Blinkit');
  });
});
