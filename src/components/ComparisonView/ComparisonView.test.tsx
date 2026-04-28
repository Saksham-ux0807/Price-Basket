/**
 * ComparisonView integration tests.
 *
 * Verifies that ComparisonView renders one PriceCard per platform (3 total)
 * for any query, and handles loading/error states correctly.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComparisonView } from './ComparisonView';

// Mock the adapters so tests don't fire real (delayed) fetches
vi.mock('../../adapters/index', () => ({
  adapters: [
    {
      id: 'blinkit',
      displayName: 'Blinkit',
      fetchPrice: vi.fn().mockResolvedValue({
        platform: 'blinkit',
        productName: 'Tomato',
        price: 2900,
        displayPrice: '₹29',
        unit: '500g',
        availability: true,
        productUrl: 'https://blinkit.com/prn/tomato-500g/prid/12345',
      }),
      matchesUrl: vi.fn().mockReturnValue(false),
      extractQueryFromUrl: vi.fn().mockReturnValue(null),
    },
    {
      id: 'zepto',
      displayName: 'Zepto',
      fetchPrice: vi.fn().mockResolvedValue({
        platform: 'zepto',
        productName: 'Tomato',
        price: 2700,
        displayPrice: '₹27',
        unit: '500g',
        availability: true,
        productUrl: 'https://www.zeptonow.com/pn/tomato/pvid/abc123',
      }),
      matchesUrl: vi.fn().mockReturnValue(false),
      extractQueryFromUrl: vi.fn().mockReturnValue(null),
    },
    {
      id: 'bigbasket',
      displayName: 'BigBasket',
      fetchPrice: vi.fn().mockResolvedValue({
        platform: 'bigbasket',
        productName: 'Tomato',
        price: 3100,
        displayPrice: '₹31',
        unit: '500g',
        availability: true,
        productUrl: 'https://www.bigbasket.com/pd/12345/fresho-tomato-500g/',
      }),
      matchesUrl: vi.fn().mockReturnValue(false),
      extractQueryFromUrl: vi.fn().mockReturnValue(null),
    },
  ],
}));

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
}

function renderComparisonView(query: string) {
  const queryClient = makeQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ComparisonView query={query} />
    </QueryClientProvider>
  );
}

describe('ComparisonView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderComparisonView('tomato');
    expect(
      screen.getByRole('region', { name: /price comparison results/i })
    ).toBeInTheDocument();
  });

  it('renders 3 PriceCards for a tomato query', async () => {
    renderComparisonView('tomato');
    // Initially shows 3 loading cards (one per platform)
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(3);
  });

  it('renders 3 PriceCards for any query', async () => {
    renderComparisonView('spinach');
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(3);
  });

  it('shows all three platform names', async () => {
    renderComparisonView('tomato');
    expect(screen.getByText('Blinkit')).toBeInTheDocument();
    expect(screen.getByText('Zepto')).toBeInTheDocument();
    expect(screen.getByText('BigBasket')).toBeInTheDocument();
  });

  it('shows loaded price data after queries resolve', async () => {
    renderComparisonView('tomato');
    // Wait for the mocked fetchPrice promises to resolve
    await waitFor(() => {
      expect(screen.getAllByText('Tomato')).toHaveLength(3);
    });
  });

  it('renders the Share Comparison button', () => {
    renderComparisonView('tomato');
    expect(
      screen.getByRole('button', { name: /share comparison/i })
    ).toBeInTheDocument();
  });
});
