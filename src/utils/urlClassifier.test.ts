/**
 * Tests for urlClassifier utility.
 * Verifies classifyInput() returns correct classifications for sample inputs.
 */

import { describe, it, expect } from 'vitest';
import {
  classifyInput,
  BLINKIT_URL_PATTERN,
  ZEPTO_URL_PATTERN,
  BIGBASKET_URL_PATTERN,
} from './urlClassifier';

describe('classifyInput', () => {
  describe('text_query', () => {
    it('classifies plain vegetable names as text_query', () => {
      expect(classifyInput('tomato')).toBe('text_query');
      expect(classifyInput('potato')).toBe('text_query');
      expect(classifyInput('spinach')).toBe('text_query');
    });

    it('classifies multi-word vegetable names as text_query', () => {
      expect(classifyInput('baby potato')).toBe('text_query');
      expect(classifyInput('fresh spinach')).toBe('text_query');
    });

    it('classifies empty-ish input as text_query', () => {
      expect(classifyInput('')).toBe('text_query');
      expect(classifyInput('   ')).toBe('text_query');
    });
  });

  describe('product_link — Blinkit', () => {
    it('classifies a valid Blinkit product URL as product_link', () => {
      expect(classifyInput('https://blinkit.com/prn/tomato-500g/prid/12345')).toBe('product_link');
    });

    it('classifies a Blinkit URL with www as product_link', () => {
      expect(classifyInput('https://www.blinkit.com/prn/onion-1kg/prid/99999')).toBe('product_link');
    });

    it('classifies a Blinkit URL starting with www. (no scheme) as product_link', () => {
      expect(classifyInput('www.blinkit.com/prn/carrot-500g/prid/11111')).toBe('product_link');
    });
  });

  describe('product_link — Zepto', () => {
    it('classifies a valid Zepto product URL as product_link', () => {
      expect(classifyInput('https://www.zeptonow.com/pn/tomato/pvid/abc-123')).toBe('product_link');
    });

    it('classifies a Zepto URL without www as product_link', () => {
      expect(classifyInput('https://zeptonow.com/pn/spinach/pvid/xyz-456')).toBe('product_link');
    });
  });

  describe('product_link — BigBasket', () => {
    it('classifies a valid BigBasket product URL as product_link', () => {
      expect(classifyInput('https://www.bigbasket.com/pd/40123456/fresho-tomato-500g/')).toBe('product_link');
    });

    it('classifies a BigBasket URL without trailing slash as product_link', () => {
      expect(classifyInput('https://www.bigbasket.com/pd/12345678/bb-royal-potato-1kg')).toBe('product_link');
    });
  });

  describe('unsupported_url', () => {
    it('classifies a valid URL from an unknown domain as unsupported_url', () => {
      expect(classifyInput('https://www.amazon.in/dp/B08XYZ')).toBe('unsupported_url');
      expect(classifyInput('https://swiggy.com/instamart/item/tomato')).toBe('unsupported_url');
    });

    it('classifies a generic https URL as unsupported_url', () => {
      expect(classifyInput('https://example.com/product/123')).toBe('unsupported_url');
    });
  });

  describe('malformed_url', () => {
    it('classifies a URL-like string that fails parsing as malformed_url', () => {
      expect(classifyInput('http://')).toBe('malformed_url');
      expect(classifyInput('://broken')).toBe('malformed_url');
    });
  });
});

describe('URL pattern constants', () => {
  it('BLINKIT_URL_PATTERN matches valid Blinkit URLs', () => {
    expect(BLINKIT_URL_PATTERN.test('https://blinkit.com/prn/tomato-500g/prid/12345')).toBe(true);
    expect(BLINKIT_URL_PATTERN.test('https://example.com/other')).toBe(false);
  });

  it('ZEPTO_URL_PATTERN matches valid Zepto URLs', () => {
    expect(ZEPTO_URL_PATTERN.test('https://www.zeptonow.com/pn/tomato/pvid/abc-123')).toBe(true);
    expect(ZEPTO_URL_PATTERN.test('https://example.com/other')).toBe(false);
  });

  it('BIGBASKET_URL_PATTERN matches valid BigBasket URLs', () => {
    expect(BIGBASKET_URL_PATTERN.test('https://www.bigbasket.com/pd/40123456/fresho-tomato-500g/')).toBe(true);
    expect(BIGBASKET_URL_PATTERN.test('https://example.com/other')).toBe(false);
  });
});
