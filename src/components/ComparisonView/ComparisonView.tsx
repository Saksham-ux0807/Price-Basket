/**
 * ComparisonView component — fires one price query per platform in parallel
 * and renders a PriceCard for each result.
 *
 * Requirements: 1.2, 1.4, 2.1, 2.3, 2.4, 5.2, 5.4, 7.1
 */

import React, { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { adapters } from '../../adapters/index';
import { PriceCard } from '../PriceCard';
import { buildShareableLink } from '../../utils/shareableLink';
import './ComparisonView.css';

interface ComparisonViewProps {
  query: string;
}

type ShareState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'failure'; url: string };

export function ComparisonView({ query }: ComparisonViewProps) {
  const [shareState, setShareState] = useState<ShareState>({ status: 'idle' });

  // Fire one query per platform in parallel
  const results = useQueries({
    queries: adapters.map((adapter) => ({
      queryKey: ['price', adapter.id, query] as const,
      queryFn: () => adapter.fetchPrice(query),
    })),
  });

  // Derive the lowest price among available results
  const availablePrices = results
    .map((result, index) => ({
      index,
      price: result.data?.availability ? result.data.price : null,
    }))
    .filter((item): item is { index: number; price: number } => item.price !== null);

  const minPrice =
    availablePrices.length > 0
      ? Math.min(...availablePrices.map((item) => item.price))
      : null;

  const lowestPriceIndices = new Set(
    minPrice !== null
      ? availablePrices
          .filter((item) => item.price === minPrice)
          .map((item) => item.index)
      : [],
  );

  // "No results" when all queries are done and none returned available data
  const allDone = results.every((r) => !r.isLoading);
  const allFinishedWithNoAvailableData =
    allDone && !results.some((r) => r.data?.availability === true);

  async function handleShare() {
    const url = buildShareableLink(query);
    try {
      await navigator.clipboard.writeText(url);
      setShareState({ status: 'success' });
      setTimeout(() => setShareState({ status: 'idle' }), 2000);
    } catch {
      setShareState({ status: 'failure', url });
    }
  }

  return (
    <section className="comparison-view" aria-label="Price comparison results">
      {/* Share Comparison button */}
      <div className="comparison-view__share-bar">
        <button
          type="button"
          className="comparison-view__share-btn"
          onClick={handleShare}
          aria-label="Share comparison link"
        >
          {shareState.status === 'success' ? 'Comparison link copied!' : 'Share Comparison'}
        </button>

        {shareState.status === 'failure' && (
          <div className="comparison-view__share-fallback" role="alert">
            <p>Could not copy automatically. Please copy this URL manually:</p>
            <span
              className="comparison-view__share-url"
              role="textbox"
              aria-readonly="true"
              aria-label="Shareable URL"
              tabIndex={0}
            >
              {shareState.url}
            </span>
          </div>
        )}
      </div>

      {/* No results message */}
      {allFinishedWithNoAvailableData && (
        <p className="comparison-view__no-results" role="status">
          No results found. Try a different search term.
        </p>
      )}

      {/* Price cards grid */}
      <div className="comparison-view__grid" aria-label="Platform price cards">
        {adapters.map((adapter, index) => {
          const result = results[index];
          return (
            <PriceCard
              key={adapter.id}
              platform={adapter.id}
              data={result.data}
              isLoading={result.isLoading}
              isError={result.isError}
              isLowestPrice={lowestPriceIndices.has(index)}
            />
          );
        })}
      </div>
    </section>
  );
}

export default ComparisonView;
