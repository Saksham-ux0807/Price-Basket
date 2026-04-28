/**
 * SearchPage integration tests.
 *
 * Verifies that SearchPage renders correctly and conditionally shows
 * ComparisonView based on the `?q=` URL parameter.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SearchPage from './SearchPage';

// Mock the adapters so ComparisonView doesn't fire real (delayed) fetches
vi.mock('../adapters/index', () => ({
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

function renderSearchPage(initialPath = '/') {
  const queryClient = makeQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <SearchPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderSearchPage();
    expect(screen.getByRole('search')).toBeInTheDocument();
  });

  it('renders the page title', () => {
    renderSearchPage();
    expect(screen.getByText('VeggiePriceCompare')).toBeInTheDocument();
  });

  it('renders the SearchBar', () => {
    renderSearchPage();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('does not show ComparisonView when there is no query', () => {
    renderSearchPage('/');
    // ComparisonView renders a section with aria-label "Price comparison results"
    expect(
      screen.queryByRole('region', { name: /price comparison results/i })
    ).not.toBeInTheDocument();
  });

  it('shows ComparisonView when ?q=tomato is in the URL', () => {
    renderSearchPage('/?q=tomato');
    expect(
      screen.getByRole('region', { name: /price comparison results/i })
    ).toBeInTheDocument();
  });

  it('pre-populates the search input with the query from the URL', () => {
    renderSearchPage('/?q=tomato');
    const input = screen.getByRole('searchbox') as HTMLInputElement;
    expect(input.value).toBe('tomato');
  });
});
