/**
 * SearchBar component.
 *
 * Handles free-text vegetable name input and product URL paste detection.
 * Classifies every keystroke, fires debounced autocomplete for text queries,
 * and immediately resolves product links via the matching platform adapter.
 *
 * Requirements: 1.1, 1.3, 4.1, 4.2, 4.3, 4.4, 7.3, 7.5
 */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useId,
} from 'react';
import { classifyInput } from '../../utils/urlClassifier';
import { adapters } from '../../adapters';
import type { VegetableSuggestion } from '../../types';
import AutocompleteDropdown from './AutocompleteDropdown';
import './SearchBar.css';

export interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

/** Best sellers — shown as top chips */
const BEST_SELLERS: { query: string; label: string; emoji: string }[] = [
  { query: 'tomato',   label: 'Tomato',   emoji: '🍅' },
  { query: 'potato',   label: 'Potato',   emoji: '🥔' },
  { query: 'onion',    label: 'Onion',    emoji: '🧅' },
  { query: 'spinach',  label: 'Spinach',  emoji: '🥬' },
  { query: 'carrot',   label: 'Carrot',   emoji: '🥕' },
];

/** Most searched — shown as secondary chips */
const MOST_SEARCHED: { query: string; label: string; emoji: string }[] = [
  { query: 'capsicum',    label: 'Capsicum',    emoji: '🫑' },
  { query: 'cauliflower', label: 'Cauliflower', emoji: '🥦' },
  { query: 'peas',        label: 'Peas',        emoji: '🫛' },
  { query: 'garlic',      label: 'Garlic',      emoji: '🧄' },
  { query: 'ginger',      label: 'Ginger',      emoji: '🫚' },
  { query: 'cucumber',    label: 'Cucumber',    emoji: '🥒' },
];

/** Local vegetable catalogue used for client-side autocomplete filtering. */
const VEGETABLE_CATALOGUE: VegetableSuggestion[] = [
  { id: 'tomato',      name: 'Tomato',      query: 'tomato',      badge: 'bestseller', emoji: '🍅' },
  { id: 'potato',      name: 'Potato',      query: 'potato',      badge: 'bestseller', emoji: '🥔' },
  { id: 'onion',       name: 'Onion',       query: 'onion',       badge: 'bestseller', emoji: '🧅' },
  { id: 'spinach',     name: 'Spinach',     query: 'spinach',     badge: 'bestseller', emoji: '🥬' },
  { id: 'carrot',      name: 'Carrot',      query: 'carrot',      badge: 'bestseller', emoji: '🥕' },
  { id: 'capsicum',    name: 'Capsicum',    query: 'capsicum',    badge: 'trending',   emoji: '🫑' },
  { id: 'cauliflower', name: 'Cauliflower', query: 'cauliflower', badge: 'trending',   emoji: '🥦' },
  { id: 'peas',        name: 'Peas',        query: 'peas',        badge: 'trending',   emoji: '🫛' },
  { id: 'garlic',      name: 'Garlic',      query: 'garlic',      badge: 'trending',   emoji: '🧄' },
  { id: 'ginger',      name: 'Ginger',      query: 'ginger',      badge: 'trending',   emoji: '🫚' },
  { id: 'cucumber',    name: 'Cucumber',    query: 'cucumber',    badge: 'trending',   emoji: '🥒' },
  { id: 'brinjal',     name: 'Brinjal',     query: 'brinjal',     emoji: '🍆' },
  { id: 'beans',       name: 'Beans',       query: 'beans',       emoji: '🫘' },
  { id: 'cabbage',     name: 'Cabbage',     query: 'cabbage',     emoji: '🥬' },
  { id: 'coriander',   name: 'Coriander',   query: 'coriander',   emoji: '🌿' },
];

/** Filter the local catalogue by the current text query (case-insensitive prefix/substring match). */
function filterSuggestions(query: string): VegetableSuggestion[] {
  const lower = query.trim().toLowerCase();
  if (lower.length < 2) return [];
  return VEGETABLE_CATALOGUE.filter(
    (v) => v.name.toLowerCase().includes(lower) || v.query.toLowerCase().includes(lower)
  );
}

type InlineMessage =
  | { type: 'unsupported_url'; text: string }
  | { type: 'malformed_url'; text: string }
  | null;

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialValue = '' }) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [inputValue, setInputValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<VegetableSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [inlineMessage, setInlineMessage] = useState<InlineMessage>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Auto-focus on mount (Requirement 7.5)
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Sync if initialValue changes externally
  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  /** Clear any pending debounce timer. */
  const clearDebounce = useCallback(() => {
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  /** Run the autocomplete fetch for text queries — instant, no debounce needed (client-side). */
  const scheduleSuggestionFetch = useCallback((query: string) => {
    clearDebounce();
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      setDropdownOpen(false);
      return;
    }

    // Instant client-side filter — no network call, no delay needed
    const results = filterSuggestions(trimmed);
    setSuggestions(results);
    setIsLoadingSuggestions(false);
    setDropdownOpen(results.length > 0);
    setFocusedIndex(-1);
  }, [clearDebounce]);

  /** Handle every keystroke in the input. */
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(value);
      setInlineMessage(null);

      const classification = classifyInput(value);

      switch (classification) {
        case 'text_query': {
          scheduleSuggestionFetch(value);
          break;
        }

        case 'product_link': {
          clearDebounce();
          setSuggestions([]);
          setDropdownOpen(false);
          setIsLoadingSuggestions(false);

          // Find the matching adapter and extract the vegetable identity
          const matchingAdapter = adapters.find((a) => a.matchesUrl(value));
          if (matchingAdapter) {
            const extracted = matchingAdapter.extractQueryFromUrl(value);
            if (extracted) {
              onSearch(extracted);
            }
          }
          break;
        }

        case 'unsupported_url': {
          clearDebounce();
          setSuggestions([]);
          setDropdownOpen(false);
          setIsLoadingSuggestions(false);
          setInlineMessage({
            type: 'unsupported_url',
            text: 'This platform is not supported. Supported platforms: Blinkit, Zepto, BigBasket.',
          });
          break;
        }

        case 'malformed_url': {
          clearDebounce();
          setSuggestions([]);
          setDropdownOpen(false);
          setIsLoadingSuggestions(false);
          setInlineMessage({
            type: 'malformed_url',
            text: 'Could not recognise this link. Try searching by vegetable name instead.',
          });
          break;
        }

        default:
          break;
      }
    },
    [onSearch, scheduleSuggestionFetch, clearDebounce]
  );

  /** Submit the current input value as a search query. */
  const handleSubmit = useCallback(
    (event?: React.FormEvent) => {
      event?.preventDefault();
      const trimmed = inputValue.trim();
      if (!trimmed) return; // no-op for empty/whitespace
      setDropdownOpen(false);
      setSuggestions([]);
      clearDebounce();
      onSearch(trimmed);
    },
    [inputValue, onSearch, clearDebounce]
  );

  /** Handle keyboard events on the input element. */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!dropdownOpen) {
        if (event.key === 'Enter') {
          handleSubmit();
        }
        return;
      }

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          const next = focusedIndex < suggestions.length - 1 ? focusedIndex + 1 : 0;
          setFocusedIndex(next);
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          const prev = focusedIndex > 0 ? focusedIndex - 1 : suggestions.length - 1;
          setFocusedIndex(prev);
          break;
        }
        case 'Enter': {
          event.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < suggestions.length) {
            handleSuggestionSelect(suggestions[focusedIndex]);
          } else {
            handleSubmit();
          }
          break;
        }
        case 'Escape': {
          event.preventDefault();
          setDropdownOpen(false);
          setSuggestions([]);
          setFocusedIndex(-1);
          break;
        }
        default:
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dropdownOpen, focusedIndex, suggestions, handleSubmit]
  );

  /** Called when the user selects a suggestion from the dropdown. */
  const handleSuggestionSelect = useCallback(
    (suggestion: VegetableSuggestion) => {
      setInputValue(suggestion.name);
      setSuggestions([]);
      setDropdownOpen(false);
      setFocusedIndex(-1);
      clearDebounce();
      onSearch(suggestion.query);
      // Return focus to the input
      inputRef.current?.focus();
    },
    [onSearch, clearDebounce]
  );

  const handleCloseDropdown = useCallback(() => {
    setDropdownOpen(false);
    setFocusedIndex(-1);
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      clearDebounce();
    };
  }, [clearDebounce]);

  const listboxId = `${inputId}-listbox`;
  const activeDescendant =
    dropdownOpen && focusedIndex >= 0 && suggestions[focusedIndex]
      ? `${listboxId}-option-${suggestions[focusedIndex].id}`
      : undefined;

  return (
    <div className="search-bar" role="search" aria-label="Search for vegetables">
      <form
        className="search-bar__form"
        onSubmit={handleSubmit}
        aria-label="Vegetable search form"
        noValidate
      >
        <div className="search-bar__input-wrapper">
          <input
            ref={inputRef}
            id={inputId}
            type="search"
            className="search-bar__input"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Search vegetables or paste a product link…"
            aria-label="Search vegetables or paste a product link"
            aria-autocomplete="list"
            aria-controls={dropdownOpen ? listboxId : undefined}
            aria-activedescendant={activeDescendant}
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
            autoComplete="off"
            spellCheck={false}
          />

          {/* Dropdown is positioned relative to the form */}
          {(dropdownOpen || isLoadingSuggestions) && (
            <div className="search-bar__dropdown-container">
              <AutocompleteDropdown
                suggestions={suggestions}
                isLoading={isLoadingSuggestions}
                onSelect={handleSuggestionSelect}
                focusedIndex={focusedIndex}
                onFocusedIndexChange={setFocusedIndex}
                onClose={handleCloseDropdown}
                inputId={inputId}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="search-bar__button"
          aria-label="Search"
        >
          Search
        </button>
      </form>

      {/* Inline status messages for URL classification results */}
      {inlineMessage?.type === 'unsupported_url' && (
        <p
          className="search-bar__message search-bar__message--warning"
          role="alert"
          aria-live="polite"
        >
          {inlineMessage.text}
        </p>
      )}
      {inlineMessage?.type === 'malformed_url' && (
        <p
          className="search-bar__message search-bar__message--error"
          role="alert"
          aria-live="polite"
        >
          {inlineMessage.text}
        </p>
      )}

      {/* Trending suggestions — shown when input is empty */}
      {!inputValue.trim() && (
        <div className="search-bar__trending" aria-label="Trending vegetables">
          <div className="search-bar__trending-row">
            <span className="search-bar__trending-label">🔥 Best Sellers</span>
            <div className="search-bar__trending-chips">
              {BEST_SELLERS.map((item) => (
                <button
                  key={item.query}
                  type="button"
                  className="search-bar__chip search-bar__chip--bestseller"
                  onClick={() => { setInputValue(item.label); onSearch(item.query); }}
                  aria-label={`Search ${item.label}`}
                >
                  {item.emoji} {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="search-bar__trending-row">
            <span className="search-bar__trending-label">📈 Most Searched</span>
            <div className="search-bar__trending-chips">
              {MOST_SEARCHED.map((item) => (
                <button
                  key={item.query}
                  type="button"
                  className="search-bar__chip search-bar__chip--trending"
                  onClick={() => { setInputValue(item.label); onSearch(item.query); }}
                  aria-label={`Search ${item.label}`}
                >
                  {item.emoji} {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
