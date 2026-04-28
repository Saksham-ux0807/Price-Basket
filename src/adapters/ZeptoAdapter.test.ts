/**
 * Tests for ZeptoAdapter.
 * Verifies matchesUrl() and extractQueryFromUrl() work correctly.
 */

import { describe, it, expect } from 'vitest';
import { ZeptoAdapter } from './ZeptoAdapter';

const adapter = new ZeptoAdapter();

describe('ZeptoAdapter.matchesUrl', () => {
  it('returns true for a valid Zepto product URL', () => {
    expect(adapter.matchesUrl('https://www.zeptonow.com/pn/tomato/pvid/abc-123')).toBe(true);
  });

  it('returns true for a Zepto URL without www', () => {
    expect(adapter.matchesUrl('https://zeptonow.com/pn/spinach/pvid/xyz-456')).toBe(true);
  });

  it('returns false for a Blinkit URL', () => {
    expect(adapter.matchesUrl('https://blinkit.com/prn/tomato-500g/prid/12345')).toBe(false);
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

describe('ZeptoAdapter.extractQueryFromUrl', () => {
  it('extracts a simple vegetable slug', () => {
    const query = adapter.extractQueryFromUrl('https://www.zeptonow.com/pn/tomato/pvid/abc-123');
    expect(query).toBe('tomato');
  });

  it('extracts a multi-word slug with hyphens', () => {
    const query = adapter.extractQueryFromUrl('https://www.zeptonow.com/pn/fresh-spinach/pvid/def-456');
    expect(query).toBe('fresh spinach');
  });

  it('strips weight suffix from slug', () => {
    const query = adapter.extractQueryFromUrl('https://www.zeptonow.com/pn/baby-potato-500g/pvid/ghi-789');
    expect(query).toBe('baby potato');
  });

  it('returns null for a non-Zepto URL', () => {
    const query = adapter.extractQueryFromUrl('https://blinkit.com/prn/tomato-500g/prid/12345');
    expect(query).toBeNull();
  });

  it('returns null for a plain text string', () => {
    const query = adapter.extractQueryFromUrl('tomato');
    expect(query).toBeNull();
  });
});

describe('ZeptoAdapter metadata', () => {
  it('has the correct id', () => {
    expect(adapter.id).toBe('zepto');
  });

  it('has the correct displayName', () => {
    expect(adapter.displayName).toBe('Zepto');
  });
});
