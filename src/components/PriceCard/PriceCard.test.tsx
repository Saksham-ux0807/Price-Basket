/**
 * PriceCard component tests.
 *
 * Smoke tests verifying all four render states: loading, error, out-of-stock, available.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import PriceCard from './PriceCard';
import type { PlatformResult } from '../../types';

const availableData: PlatformResult = {
  platform: 'blinkit',
  productName: 'Fresh Tomato',
  price: 2900,
  displayPrice: '₹29',
  unit: '500g',
  availability: true,
  productUrl: 'https://blinkit.com/prn/tomato/prid/123',
};

const outOfStockData: PlatformResult = {
  ...availableData,
  availability: false,
};

describe('PriceCard — loading state', () => {
  it('renders loading skeleton', () => {
    render(
      <PriceCard
        platform="blinkit"
        data={undefined}
        isLoading={true}
        isError={false}
        isLowestPrice={false}
      />
    );
    expect(screen.getByRole('article')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Blinkit')).toBeInTheDocument();
  });

  it('shows loading aria-label', () => {
    render(
      <PriceCard
        platform="zepto"
        data={undefined}
        isLoading={true}
        isError={false}
        isLowestPrice={false}
      />
    );
    expect(screen.getByRole('article')).toHaveAttribute(
      'aria-label',
      'Zepto — loading price'
    );
  });
});

describe('PriceCard — error state', () => {
  it('renders error message', () => {
    render(
      <PriceCard
        platform="blinkit"
        data={undefined}
        isLoading={false}
        isError={true}
        isLowestPrice={false}
      />
    );
    expect(screen.getByText(/Price unavailable/i)).toBeInTheDocument();
  });

  it('has role="alert" on the error message', () => {
    render(
      <PriceCard
        platform="blinkit"
        data={undefined}
        isLoading={false}
        isError={true}
        isLowestPrice={false}
      />
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

describe('PriceCard — out-of-stock state', () => {
  it('renders out-of-stock badge', () => {
    render(
      <PriceCard
        platform="blinkit"
        data={outOfStockData}
        isLoading={false}
        isError={false}
        isLowestPrice={false}
      />
    );
    expect(screen.getByText(/Out of Stock/i)).toBeInTheDocument();
  });

  it('renders the product name', () => {
    render(
      <PriceCard
        platform="blinkit"
        data={outOfStockData}
        isLoading={false}
        isError={false}
        isLowestPrice={false}
      />
    );
    expect(screen.getByText('Fresh Tomato')).toBeInTheDocument();
  });
});

describe('PriceCard — available state', () => {
  it('renders product name, price, and unit', () => {
    render(
      <PriceCard
        platform="blinkit"
        data={availableData}
        isLoading={false}
        isError={false}
        isLowestPrice={false}
      />
    );
    expect(screen.getByText('Fresh Tomato')).toBeInTheDocument();
    expect(screen.getByText('₹29')).toBeInTheDocument();
    expect(screen.getByText('500g')).toBeInTheDocument();
  });

  it('renders "View on Blinkit" link', () => {
    render(
      <PriceCard
        platform="blinkit"
        data={availableData}
        isLoading={false}
        isError={false}
        isLowestPrice={false}
      />
    );
    const link = screen.getByRole('link', { name: /View on Blinkit/i });
    expect(link).toHaveAttribute('href', availableData.productUrl);
  });

  it('shows "Best Price" badge when isLowestPrice is true', () => {
    render(
      <PriceCard
        platform="blinkit"
        data={availableData}
        isLoading={false}
        isError={false}
        isLowestPrice={true}
      />
    );
    expect(screen.getByText('Best Price')).toBeInTheDocument();
  });

  it('does not show "Best Price" badge when isLowestPrice is false', () => {
    render(
      <PriceCard
        platform="blinkit"
        data={availableData}
        isLoading={false}
        isError={false}
        isLowestPrice={false}
      />
    );
    expect(screen.queryByText('Best Price')).not.toBeInTheDocument();
  });

  it('renders Copy Link button', () => {
    render(
      <PriceCard
        platform="blinkit"
        data={availableData}
        isLoading={false}
        isError={false}
        isLowestPrice={false}
      />
    );
    expect(screen.getByRole('button', { name: /Copy product link/i })).toBeInTheDocument();
  });

  it('renders correct platform names for all platforms', () => {
    const platforms = [
      { platform: 'blinkit' as const, name: 'Blinkit' },
      { platform: 'zepto' as const, name: 'Zepto' },
      { platform: 'bigbasket' as const, name: 'BigBasket' },
    ];

    for (const { platform, name } of platforms) {
      const { unmount } = render(
        <PriceCard
          platform={platform}
          data={{ ...availableData, platform }}
          isLoading={false}
          isError={false}
          isLowestPrice={false}
        />
      );
      expect(screen.getByText(name)).toBeInTheDocument();
      unmount();
    }
  });
});
