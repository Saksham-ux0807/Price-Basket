/**
 * SearchPage — the single route of the application.
 *
 * Reads the `q` URL param to drive the active search query.
 * Renders SearchBar (pre-populated with the current query) and
 * ComparisonView (only when a non-empty query is present).
 *
 * Requirements: 1.2, 1.5, 5.3
 */

import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { ComparisonView } from '../components/ComparisonView';
import { RecipesSection } from '../components/RecipesSection/RecipesSection';
import './SearchPage.css';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') ?? '';
  const trimmedQuery = query.trim();

  function handleSearch(newQuery: string) {
    const trimmed = newQuery.trim();
    if (!trimmed) return;
    setSearchParams({ q: trimmed });
  }

  return (
    <div className="search-page">
      <header className="search-page__header">
        <h1 className="search-page__title">🧺 PriceBasket</h1>
        <p className="search-page__tagline">
          Compare vegetable prices across your favourite platforms — instantly.
        </p>
        <div className="search-page__platforms">
          <span className="search-page__platform-pill search-page__platform-pill--blinkit">Blinkit</span>
          <span className="search-page__platform-pill search-page__platform-pill--zepto">Zepto</span>
          <span className="search-page__platform-pill search-page__platform-pill--bigbasket">BigBasket</span>
        </div>
      </header>

      <main className="search-page__main">
        <div className="search-page__search-wrapper">
          <SearchBar
            initialValue={query}
            onSearch={handleSearch}
          />
        </div>

        {trimmedQuery && (
          <div className="search-page__results">
            <ComparisonView query={trimmedQuery} />
            <RecipesSection
              query={trimmedQuery}
              onSelectVeggie={(veggie) => setSearchParams({ q: veggie })}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
