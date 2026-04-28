/**
 * SearchBar component tests.
 *
 * Smoke tests verifying the component renders correctly and core interactions work.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders without crashing', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    expect(screen.getByRole('search')).toBeInTheDocument();
  });

  it('has an input element', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    const input = screen.getByRole('searchbox');
    expect(input).toBeInTheDocument();
  });

  it('has a search button', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('renders with an initial value', () => {
    render(<SearchBar onSearch={vi.fn()} initialValue="tomato" />);
    const input = screen.getByRole('searchbox') as HTMLInputElement;
    expect(input.value).toBe('tomato');
  });

  it('calls onSearch when the form is submitted', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByRole('searchbox');
    await user.type(input, 'tomato');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(onSearch).toHaveBeenCalledWith('tomato');
  });

  it('shows autocomplete suggestions when typing at least 2 characters', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={vi.fn()} />);

    const input = screen.getByRole('searchbox');
    await user.type(input, 'to');

    // Wait for debounce (300ms) — use a small delay
    await new Promise((r) => setTimeout(r, 400));

    // "Tomato" should appear in the dropdown
    expect(screen.getByText('Tomato')).toBeInTheDocument();
  });

  it('shows unsupported URL message for non-supported platform URLs', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={vi.fn()} />);

    const input = screen.getByRole('searchbox');
    await user.type(input, 'https://www.amazon.in/product/123');

    expect(
      screen.getByText(/This platform is not supported/i)
    ).toBeInTheDocument();
  });

  it('does not call onSearch for empty input', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar onSearch={onSearch} />);

    await user.click(screen.getByRole('button', { name: /search/i }));
    expect(onSearch).not.toHaveBeenCalled();
  });
});
