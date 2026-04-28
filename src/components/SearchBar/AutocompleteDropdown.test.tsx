/**
 * AutocompleteDropdown component tests.
 *
 * Smoke tests verifying the dropdown renders suggestions and handles interactions.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import AutocompleteDropdown from './AutocompleteDropdown';
import type { VegetableSuggestion } from '../../types';

const suggestions: VegetableSuggestion[] = [
  { id: 'tomato', name: 'Tomato', query: 'tomato' },
  { id: 'potato', name: 'Potato', query: 'potato' },
  { id: 'onion', name: 'Onion', query: 'onion' },
];

const defaultProps = {
  suggestions,
  isLoading: false,
  onSelect: vi.fn(),
  focusedIndex: -1,
  onFocusedIndexChange: vi.fn(),
  onClose: vi.fn(),
};

describe('AutocompleteDropdown', () => {
  it('renders suggestions when provided', () => {
    render(<AutocompleteDropdown {...defaultProps} />);
    expect(screen.getByText('Tomato')).toBeInTheDocument();
    expect(screen.getByText('Potato')).toBeInTheDocument();
    expect(screen.getByText('Onion')).toBeInTheDocument();
  });

  it('renders a listbox with the correct role', () => {
    render(<AutocompleteDropdown {...defaultProps} />);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('renders the correct number of options', () => {
    render(<AutocompleteDropdown {...defaultProps} />);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
  });

  it('returns null when suggestions are empty and not loading', () => {
    const { container } = render(
      <AutocompleteDropdown
        {...defaultProps}
        suggestions={[]}
        isLoading={false}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('shows loading indicator when isLoading is true and no suggestions', () => {
    render(
      <AutocompleteDropdown
        {...defaultProps}
        suggestions={[]}
        isLoading={true}
      />
    );
    expect(screen.getByText(/Loading suggestions/i)).toBeInTheDocument();
  });

  it('calls onSelect when a suggestion is clicked', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<AutocompleteDropdown {...defaultProps} onSelect={onSelect} />);

    await user.click(screen.getByText('Tomato'));
    expect(onSelect).toHaveBeenCalledWith(suggestions[0]);
  });

  it('marks the focused item as aria-selected', () => {
    render(<AutocompleteDropdown {...defaultProps} focusedIndex={1} />);
    const options = screen.getAllByRole('option');
    expect(options[1]).toHaveAttribute('aria-selected', 'true');
    expect(options[0]).toHaveAttribute('aria-selected', 'false');
  });

  it('uses inputId to build listbox id when provided', () => {
    render(<AutocompleteDropdown {...defaultProps} inputId="my-input" />);
    expect(screen.getByRole('listbox')).toHaveAttribute('id', 'my-input-listbox');
  });
});
