/**
 * AutocompleteDropdown component.
 *
 * Renders a keyboard-navigable list of vegetable suggestions below the search
 * input. Hidden when the suggestions array is empty.
 *
 * Requirements: 1.3, 1.5, 7.3
 */

import React, { useEffect, useRef, useCallback } from 'react';
import type { VegetableSuggestion } from '../../types';
import './AutocompleteDropdown.css';

export interface AutocompleteDropdownProps {
  suggestions: VegetableSuggestion[];
  isLoading: boolean;
  onSelect: (suggestion: VegetableSuggestion) => void;
  /** Index of the currently keyboard-focused item (-1 = none) */
  focusedIndex: number;
  /** Called when the focused index should change (e.g. arrow key navigation) */
  onFocusedIndexChange: (index: number) => void;
  /** Called when the dropdown should be closed (e.g. Escape key) */
  onClose: () => void;
  /** ID of the input element that owns this listbox (for aria-controls) */
  inputId?: string;
}

const AutocompleteDropdown: React.FC<AutocompleteDropdownProps> = ({
  suggestions,
  isLoading,
  onSelect,
  focusedIndex,
  onFocusedIndexChange,
  onClose,
  inputId,
}) => {
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Keep itemRefs array in sync with suggestions length
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, suggestions.length);
  }, [suggestions.length]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLUListElement>) => {
      if (suggestions.length === 0) return;

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          const next = focusedIndex < suggestions.length - 1 ? focusedIndex + 1 : 0;
          onFocusedIndexChange(next);
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          const prev = focusedIndex > 0 ? focusedIndex - 1 : suggestions.length - 1;
          onFocusedIndexChange(prev);
          break;
        }
        case 'Enter': {
          event.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < suggestions.length) {
            onSelect(suggestions[focusedIndex]);
          }
          break;
        }
        case 'Escape': {
          event.preventDefault();
          onClose();
          break;
        }
        default:
          break;
      }
    },
    [suggestions, focusedIndex, onFocusedIndexChange, onSelect, onClose]
  );

  const isHidden = !isLoading && suggestions.length === 0;

  if (isHidden) {
    return null;
  }

  const listboxId = inputId ? `${inputId}-listbox` : 'autocomplete-listbox';

  return (
    <ul
      ref={listRef}
      id={listboxId}
      role="listbox"
      aria-label="Vegetable suggestions"
      className="autocomplete-dropdown"
      onKeyDown={handleKeyDown}
      // The list itself is not focusable; focus stays on the input
      tabIndex={-1}
    >
      {isLoading && suggestions.length === 0 ? (
        <li
          role="option"
          aria-selected={false}
          aria-disabled={true}
          className="autocomplete-dropdown__loading"
        >
          Loading suggestions…
        </li>
      ) : (
        suggestions.map((suggestion, index) => {
          const isFocused = index === focusedIndex;
          return (
            <li
              key={suggestion.id}
              ref={(el) => { itemRefs.current[index] = el; }}
              role="option"
              aria-selected={isFocused}
              id={`${listboxId}-option-${suggestion.id}`}
              className={`autocomplete-dropdown__item${isFocused ? ' autocomplete-dropdown__item--focused' : ''}`}
              onMouseDown={(e) => { e.preventDefault(); }}
              onClick={() => onSelect(suggestion)}
              onMouseEnter={() => onFocusedIndexChange(index)}
            >
              <span className="autocomplete-dropdown__item-emoji">{suggestion.emoji}</span>
              <span className="autocomplete-dropdown__item-name">{suggestion.name}</span>
              {suggestion.badge === 'bestseller' && (
                <span className="autocomplete-dropdown__badge autocomplete-dropdown__badge--bestseller">
                  🔥 Best Seller
                </span>
              )}
              {suggestion.badge === 'trending' && (
                <span className="autocomplete-dropdown__badge autocomplete-dropdown__badge--trending">
                  📈 Trending
                </span>
              )}
            </li>
          );
        })
      )}
    </ul>
  );
};

export default AutocompleteDropdown;
