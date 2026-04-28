import { describe, it, expect } from 'vitest'
import type { Platform, VegetableSuggestion, PlatformResult, PlatformAdapter } from './types'

describe('Core types', () => {
  it('Platform type accepts valid platform values', () => {
    const platforms: Platform[] = ['blinkit', 'zepto', 'bigbasket']
    expect(platforms).toHaveLength(3)
  })

  it('VegetableSuggestion has required fields', () => {
    const suggestion: VegetableSuggestion = {
      id: 'tomato-1',
      name: 'Tomato',
      query: 'tomato',
    }
    expect(suggestion.id).toBe('tomato-1')
    expect(suggestion.name).toBe('Tomato')
    expect(suggestion.query).toBe('tomato')
  })

  it('PlatformResult has required fields including paise-based price', () => {
    const result: PlatformResult = {
      platform: 'blinkit',
      productName: 'Fresh Tomato',
      price: 2900, // 29 rupees in paise
      displayPrice: '₹29',
      unit: '500g',
      availability: true,
      productUrl: 'https://blinkit.com/prn/tomato-500g/prid/12345',
    }
    expect(result.price).toBe(2900)
    expect(result.displayPrice).toBe('₹29')
    expect(result.availability).toBe(true)
  })

  it('PlatformAdapter interface shape is correct', () => {
    // Verify the interface can be implemented with the expected shape
    const mockAdapter: PlatformAdapter = {
      id: 'blinkit',
      displayName: 'Blinkit',
      fetchPrice: async (_query: string) => ({
        platform: 'blinkit',
        productName: 'Tomato',
        price: 2900,
        displayPrice: '₹29',
        unit: '500g',
        availability: true,
        productUrl: 'https://blinkit.com/prn/tomato-500g/prid/12345',
      }),
      matchesUrl: (url: string) => url.includes('blinkit.com'),
      extractQueryFromUrl: (_url: string) => 'tomato',
    }
    expect(mockAdapter.id).toBe('blinkit')
    expect(mockAdapter.displayName).toBe('Blinkit')
    expect(typeof mockAdapter.fetchPrice).toBe('function')
    expect(typeof mockAdapter.matchesUrl).toBe('function')
    expect(typeof mockAdapter.extractQueryFromUrl).toBe('function')
  })
})
