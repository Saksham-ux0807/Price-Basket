/**
 * Tests for shareableLink utility.
 * Verifies buildShareableLink / parseShareableLink round-trip works correctly.
 */

import { describe, it, expect } from 'vitest';
import { buildShareableLink, parseShareableLink } from './shareableLink';

describe('buildShareableLink', () => {
  it('encodes a simple vegetable query into a URL', () => {
    const link = buildShareableLink('tomato', 'https://example.com');
    expect(link).toBe('https://example.com?q=tomato');
  });

  it('percent-encodes spaces in the query', () => {
    const link = buildShareableLink('baby potato', 'https://example.com');
    expect(link).toContain('q=baby%20potato');
  });

  it('percent-encodes special characters', () => {
    const link = buildShareableLink('spinach & kale', 'https://example.com');
    expect(link).toContain('q=spinach%20%26%20kale');
  });

  it('uses the provided base URL', () => {
    const link = buildShareableLink('onion', 'https://myapp.com/compare');
    expect(link).toBe('https://myapp.com/compare?q=onion');
  });
});

describe('parseShareableLink', () => {
  it('extracts the query from a shareable URL', () => {
    const query = parseShareableLink('https://example.com?q=tomato');
    expect(query).toBe('tomato');
  });

  it('decodes percent-encoded spaces', () => {
    const query = parseShareableLink('https://example.com?q=baby%20potato');
    expect(query).toBe('baby potato');
  });

  it('decodes percent-encoded special characters', () => {
    const query = parseShareableLink('https://example.com?q=spinach%20%26%20kale');
    expect(query).toBe('spinach & kale');
  });

  it('returns null when there is no q parameter', () => {
    const query = parseShareableLink('https://example.com?other=value');
    expect(query).toBeNull();
  });

  it('returns null for an invalid URL', () => {
    const query = parseShareableLink('not-a-url');
    expect(query).toBeNull();
  });

  it('returns null for an empty string', () => {
    const query = parseShareableLink('');
    expect(query).toBeNull();
  });
});

describe('buildShareableLink / parseShareableLink round-trip', () => {
  const queries = [
    'tomato',
    'baby potato',
    'fresh spinach',
    'spinach & kale',
    'गाजर', // Hindi: carrot
  ];

  for (const query of queries) {
    it(`round-trips query: "${query}"`, () => {
      const link = buildShareableLink(query, 'https://example.com');
      const parsed = parseShareableLink(link);
      expect(parsed).toBe(query);
    });
  }
});
