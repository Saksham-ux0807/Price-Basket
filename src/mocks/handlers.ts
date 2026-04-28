import { http, HttpResponse, RequestHandler } from 'msw'
import type { PlatformResult } from '../types'

// ---------------------------------------------------------------------------
// Shared vegetable data used across all platform handlers
// ---------------------------------------------------------------------------

const TOMATO_BLINKIT: PlatformResult = {
  platform: 'blinkit',
  productName: 'Tomato',
  price: 2900,
  displayPrice: '₹29',
  unit: '500g',
  availability: true,
  productUrl: 'https://blinkit.com/prn/tomato-500g/prid/12345',
}

const TOMATO_ZEPTO: PlatformResult = {
  platform: 'zepto',
  productName: 'Tomato',
  price: 2700,
  displayPrice: '₹27',
  unit: '500g',
  availability: true,
  productUrl: 'https://www.zeptonow.com/pn/tomato/pvid/abc123',
}

const TOMATO_BIGBASKET: PlatformResult = {
  platform: 'bigbasket',
  productName: 'Tomato',
  price: 3100,
  displayPrice: '₹31',
  unit: '500g',
  availability: true,
  productUrl: 'https://www.bigbasket.com/pd/40000001/fresho-tomato-500g/',
}

const POTATO_BLINKIT: PlatformResult = {
  platform: 'blinkit',
  productName: 'Potato',
  price: 2500,
  displayPrice: '₹25',
  unit: '1 kg',
  availability: true,
  productUrl: 'https://blinkit.com/prn/potato-1kg/prid/23456',
}

const POTATO_ZEPTO: PlatformResult = {
  platform: 'zepto',
  productName: 'Potato',
  price: 2300,
  displayPrice: '₹23',
  unit: '1 kg',
  availability: true,
  productUrl: 'https://www.zeptonow.com/pn/potato/pvid/def456',
}

const POTATO_BIGBASKET: PlatformResult = {
  platform: 'bigbasket',
  productName: 'Potato',
  price: 2700,
  displayPrice: '₹27',
  unit: '1 kg',
  availability: true,
  productUrl: 'https://www.bigbasket.com/pd/40000002/fresho-potato-1kg/',
}

/** Catalogue of known vegetables per platform, keyed by normalised query. */
const BLINKIT_CATALOGUE: Record<string, PlatformResult> = {
  tomato: TOMATO_BLINKIT,
  potato: POTATO_BLINKIT,
  onion: {
    platform: 'blinkit', productName: 'Onion', price: 3200, displayPrice: '₹32',
    unit: '1 kg', availability: true,
    productUrl: 'https://blinkit.com/prn/onion-1kg/prid/34567',
  },
  spinach: {
    platform: 'blinkit', productName: 'Spinach', price: 1800, displayPrice: '₹18',
    unit: '250g', availability: true,
    productUrl: 'https://blinkit.com/prn/spinach-250g/prid/45678',
  },
}

const ZEPTO_CATALOGUE: Record<string, PlatformResult> = {
  tomato: TOMATO_ZEPTO,
  potato: POTATO_ZEPTO,
  onion: {
    platform: 'zepto', productName: 'Onion', price: 3000, displayPrice: '₹30',
    unit: '1 kg', availability: true,
    productUrl: 'https://www.zeptonow.com/pn/onion/pvid/ghi789',
  },
  spinach: {
    platform: 'zepto', productName: 'Spinach', price: 2000, displayPrice: '₹20',
    unit: '250g', availability: true,
    productUrl: 'https://www.zeptonow.com/pn/spinach/pvid/jkl012',
  },
}

const BIGBASKET_CATALOGUE: Record<string, PlatformResult> = {
  tomato: TOMATO_BIGBASKET,
  potato: POTATO_BIGBASKET,
  onion: {
    platform: 'bigbasket', productName: 'Onion', price: 3400, displayPrice: '₹34',
    unit: '1 kg', availability: true,
    productUrl: 'https://www.bigbasket.com/pd/40000003/fresho-onion-1kg/',
  },
  spinach: {
    platform: 'bigbasket', productName: 'Spinach', price: 1600, displayPrice: '₹16',
    unit: '250g', availability: true,
    productUrl: 'https://www.bigbasket.com/pd/40000004/fresho-spinach-250g/',
  },
}

// ---------------------------------------------------------------------------
// Blinkit handlers
// ---------------------------------------------------------------------------

/**
 * Blinkit mock search endpoint handlers.
 *
 * Scenarios covered:
 *   GET /api/blinkit/search?q=<vegetable>  → success with price data
 *   GET /api/blinkit/search?q=out-of-stock → availability: false
 *   GET /api/blinkit/search?q=error        → 500 Internal Server Error
 *   GET /api/blinkit/search?q=empty        → empty results array
 */
export const blinkitHandlers: RequestHandler[] = [
  http.get('/api/blinkit/search', ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')?.toLowerCase().trim() ?? ''

    if (query === 'error') {
      return new HttpResponse(null, { status: 500 })
    }

    if (query === 'empty') {
      return HttpResponse.json([])
    }

    if (query === 'out-of-stock') {
      const result: PlatformResult = {
        platform: 'blinkit',
        productName: 'Out of Stock Item',
        price: 0,
        displayPrice: '₹0',
        unit: '500g',
        availability: false,
        productUrl: 'https://blinkit.com/prn/out-of-stock-item-500g/prid/99999',
      }
      return HttpResponse.json([result])
    }

    const result = BLINKIT_CATALOGUE[query]
    if (result) {
      return HttpResponse.json([result])
    }

    // Unknown query — return empty results
    return HttpResponse.json([])
  }),
]

// ---------------------------------------------------------------------------
// Zepto handlers
// ---------------------------------------------------------------------------

/**
 * Zepto mock search endpoint handlers.
 *
 * Scenarios covered:
 *   GET /api/zepto/search?q=<vegetable>  → success with price data
 *   GET /api/zepto/search?q=out-of-stock → availability: false
 *   GET /api/zepto/search?q=error        → 500 Internal Server Error
 *   GET /api/zepto/search?q=empty        → empty results array
 */
export const zeptoHandlers: RequestHandler[] = [
  http.get('/api/zepto/search', ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')?.toLowerCase().trim() ?? ''

    if (query === 'error') {
      return new HttpResponse(null, { status: 500 })
    }

    if (query === 'empty') {
      return HttpResponse.json([])
    }

    if (query === 'out-of-stock') {
      const result: PlatformResult = {
        platform: 'zepto',
        productName: 'Out of Stock Item',
        price: 0,
        displayPrice: '₹0',
        unit: '500g',
        availability: false,
        productUrl: 'https://www.zeptonow.com/pn/out-of-stock-item/pvid/oos999',
      }
      return HttpResponse.json([result])
    }

    const result = ZEPTO_CATALOGUE[query]
    if (result) {
      return HttpResponse.json([result])
    }

    return HttpResponse.json([])
  }),
]

// ---------------------------------------------------------------------------
// BigBasket handlers
// ---------------------------------------------------------------------------

/**
 * BigBasket mock search endpoint handlers.
 *
 * Scenarios covered:
 *   GET /api/bigbasket/search?q=<vegetable>  → success with price data
 *   GET /api/bigbasket/search?q=out-of-stock → availability: false
 *   GET /api/bigbasket/search?q=error        → 500 Internal Server Error
 *   GET /api/bigbasket/search?q=empty        → empty results array
 */
export const bigbasketHandlers: RequestHandler[] = [
  http.get('/api/bigbasket/search', ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')?.toLowerCase().trim() ?? ''

    if (query === 'error') {
      return new HttpResponse(null, { status: 500 })
    }

    if (query === 'empty') {
      return HttpResponse.json([])
    }

    if (query === 'out-of-stock') {
      const result: PlatformResult = {
        platform: 'bigbasket',
        productName: 'Out of Stock Item',
        price: 0,
        displayPrice: '₹0',
        unit: '500g',
        availability: false,
        productUrl: 'https://www.bigbasket.com/pd/99999999/fresho-out-of-stock-item-500g/',
      }
      return HttpResponse.json([result])
    }

    const result = BIGBASKET_CATALOGUE[query]
    if (result) {
      return HttpResponse.json([result])
    }

    return HttpResponse.json([])
  }),
]

// ---------------------------------------------------------------------------
// Default export
// ---------------------------------------------------------------------------

/**
 * Default handlers array — intentionally empty because the platform adapters
 * use simulated data and make no real HTTP calls. The named handler groups
 * (blinkitHandlers, zeptoHandlers, bigbasketHandlers) are exported for use in
 * future integration tests if the adapters are ever replaced with real API calls.
 */
export const handlers: RequestHandler[] = []
